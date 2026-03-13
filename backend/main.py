from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import os
import requests
import json
import asyncio
import websockets
import base64
from dotenv import load_dotenv
from typing import Optional, List
from models import TTSRequest, SummaryRequest
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI(title="MedFlow AI API", description="Backend for MedFlow AI prototype", version="1.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("⚠️ WARNING: GEMINI_API_KEY not found in environment variables.")

@app.post("/api/summarize")
async def summarize_session(request: SummaryRequest):
    """
    Generate a clinical summary using Gemini API based on session transcript.
    """
    if not GEMINI_API_KEY:
        return {"error": "Gemini API key not configured on backend."}
    
    try:
        models_to_try = [
            'gemini-2.5-flash',
            'gemini-2.5-pro',
            'gemini-1.5-pro-latest',
            'gemini-1.5-flash'
        ]
        
        prompt = f"""
        You are an expert Clinical AI Medical Scribe. Your task is to analyze the following transcript between a Doctor and a Patient, 
        which may contain information in English, Hindi, or Tamil.
        
        Extract the following structured clinical data and provide it in strict JSON format:
        1. symptoms: A list of specific clinical symptoms mentioned by the patient. 
           - Always translate symptoms to English.
           - If no symptoms are found, return [].
        2. diagnosis: Potential preliminary diagnoses or clinical conditions discussed.
           - Always translate to English.
           - If not discussed, return "---".
        3. notes: Professional clinical notes for the doctor's review.
           - Always written in English.
           - Focus only on medically relevant information. 
           - Do not include meta-commentary about the presence or absence of data.
           - If no medical content is found, return "Awaiting clinical information...".
        
        Transcript:
        {request.transcript}
        
        Return ONLY valid JSON.
        """
        
        response = None
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = await asyncio.to_thread(model.generate_content, prompt)
                print(f"✅ Successfully generated summary using model: {model_name}")
                break
            except Exception as model_e:
                print(f"⚠️ Model {model_name} failed: {model_e}")
                continue
                
        if response is not None and hasattr(response, 'text'):
            # Clean up JSON if model adds markdown formatting
            text = response.text.replace('```json', '').replace('```', '').strip()
            summary_data = json.loads(text)
            return summary_data
        else:
            raise Exception("Gemini returned an empty or invalid response.")
        
    except Exception as e:
        print(f"❌ Gemini Summarize Error: {e}")
        return {
            "symptoms": [],
            "diagnosis": "---",
            "notes": "Awaiting clinical information..."
        }

@app.post("/api/tts")
async def text_to_speech(request: TTSRequest):
    """
    Proxy request to Sarvam AI TTS API
    """
    url = "https://api.sarvam.ai/text-to-speech"
    
    payload = {
        "inputs": [request.text],
        "target_language_code": f"{request.target_language}-IN",
        "speaker": request.speaker,
        "pitch": 0,
        "pace": 1.0,
        "loudness": 1.5,
        "speech_sample_rate": 8000,
        "enable_preprocessing": True,
        "model": "bulbul:v1"
    }
    
    headers = {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        # Sarvam returns an object with base64 encoded audio in 'audios' list
        data = response.json()
        audio_content = data.get("audios", [])[0]
        
        import base64
        import io
        
        # Decode base64 to bytes
        audio_bytes = base64.b64decode(audio_content)
        
        return StreamingResponse(io.BytesIO(audio_bytes), media_type="audio/wav")
        
    except Exception as e:
        print(f"Error calling Sarvam AI: {e}")
        return {"error": str(e)}, 500
        
@app.websocket("/ws/translate")
async def translate_websocket_relay(websocket: WebSocket, source_language: str = "en-IN", target_language: str = "hi-IN"):
    print(f"📥 Incoming Connection: {source_language} -> {target_language}")
    await websocket.accept()
    print("✅ Connection accepted from client.")
    
    # Use standard STT endpoint for transcription
    sarvam_url = (
        f"wss://api.sarvam.ai/speech-to-text/ws?"
        f"model=saaras:v3&"
        f"language-code={source_language}&"
        f"mode=transcribe&" # Use transcribe mode to get the original language
        f"input_audio_codec=audio/wav&" 
        f"sample_rate=16000"
    )
    
    headers = {
        "api-subscription-key": SARVAM_API_KEY
    }


    try:
        async with websockets.connect(sarvam_url, additional_headers=headers) as sarvam_ws:
            print(f"Connected to Sarvam STT relay for Bi-directional Translation")

            async def receive_from_client():
                try:
                    while True:
                        data = await websocket.receive_bytes()
                        # print(f"Client -> Sarvam: {len(data)} bytes")
                        payload = {
                            "audio": {
                                "data": base64.b64encode(data).decode('utf-8'),
                                "sample_rate": "16000",
                                "encoding": "audio/wav" 
                            }
                        }
                        await sarvam_ws.send(json.dumps(payload))
                except WebSocketDisconnect:
                    print("Client disconnected")
                except Exception as e:
                    print(f"Client relay receive error: {e}")

            async def send_to_client():
                try:
                    last_transcript = ""
                    last_translation = ""
                    last_spoken_text = "" # To prevent repeating the same sentence
                    
                    async for message in sarvam_ws:
                        resp = json.loads(message)
                        payload = resp.get("data", {}) if resp.get("type") == "data" else resp
                        
                        transcript = payload.get("transcript", "")
                        is_final = payload.get("is_final", False)
                        
                        # If no transcript and not final, skip
                        if not transcript and not is_final:
                            continue
                        
                        if transcript:
                            last_transcript = transcript

                        # Decision: Should we trigger TTS? 
                        # Trigger if is_final OR if transcript ends with sentence-ending punctuation
                        should_speak = is_final
                        if transcript.strip() and transcript.strip()[-1] in ".?!":
                            should_speak = True
                        
                        # Hide speaker's language if translating
                        display_text = "" if target_language != source_language else last_transcript
                        
                        # Process translation
                        if target_language != source_language and last_transcript:
                            try:
                                res = await asyncio.to_thread(requests.post, "https://api.sarvam.ai/translate", json={
                                    "input": last_transcript,
                                    "source_language_code": source_language,
                                    "target_language_code": target_language
                                }, headers=headers, timeout=1.5)
                                if res.status_code == 200:
                                    last_translation = res.json().get("translated_text", "")
                                    display_text = last_translation
                                else:
                                    print(f"Translation API Error {res.status_code}")
                            except Exception as te:
                                print(f"Translation sync error: {te}")
                        
                        # Generate TTS if should_speak and we haven't spoken this exact text yet
                        audio_base64 = None
                        if should_speak and last_translation and last_translation != last_spoken_text:
                            print(f"🔊 Triggering TTS for stable sentence: '{last_translation}'")
                            try:
                                tts_res = await asyncio.to_thread(requests.post, "https://api.sarvam.ai/text-to-speech", json={
                                    "inputs": [last_translation],
                                    "target_language_code": target_language,
                                    "speaker": "shubh" if target_language == "hi-IN" else "ritu",
                                    "model": "bulbul:v3"
                                }, headers={
                                    "api-subscription-key": SARVAM_API_KEY,
                                    "Content-Type": "application/json"
                                }, timeout=5)
                                if tts_res.status_code == 200:
                                    audios = tts_res.json().get("audios", [])
                                    if audios:
                                        audio_base64 = audios[0]
                                        last_spoken_text = last_translation
                                        print(f"✅ TTS Success ({len(audio_base64)} chars)")
                            except Exception as tts_e:
                                print(f"⚠️ TTS Exception: {tts_e}")

                        # Send to frontend (Check if socket is still alive)
                        try:
                            if websocket.client_state.value == 1: # CONNECTED
                                await websocket.send_text(json.dumps({
                                    "translated_text": display_text or last_transcript,
                                    "transcript": last_transcript,
                                    "audio": audio_base64,
                                    "is_final": is_final or should_speak,
                                    "type": "data"
                                }))
                            else:
                                break
                        except Exception:
                            break

                        if is_final:
                            last_transcript = ""
                            last_translation = ""
                    
                except Exception as e:
                    print(f"Sarvam relay send error: {e}")

            # Run both tasks concurrently
            await asyncio.gather(receive_from_client(), send_to_client())

    except Exception as e:
        print(f"WebSocket relay setup failed: {e}")
        await websocket.close(code=1011)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "MedFlow AI Backend is running!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
