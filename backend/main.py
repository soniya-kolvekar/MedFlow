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
from typing import Optional
from models import TTSRequest

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
    """
    WebSocket relay to Sarvam AI Streaming STT-Translate API
    """
    await websocket.accept()
    
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
                    async for message in sarvam_ws:
                        resp = json.loads(message)
                        
                        # Extract payload
                        payload = resp.get("data", {}) if resp.get("type") == "data" else resp
                        transcript = payload.get("transcript", "")
                        is_final = payload.get("is_final", False)

                        if not transcript:
                            continue

                        # Hide speaker's language if translating
                        display_text = "" if target_language != source_language else transcript
                        
                        # Process translation
                        if target_language != source_language:
                            try:
                                # Translation call
                                def call_translate():
                                    api_url = "https://api.sarvam.ai/translate"
                                    trans_payload = {
                                        "input": transcript,
                                        "source_language_code": source_language,
                                        "target_language_code": target_language
                                    }
                                    return requests.post(api_url, json=trans_payload, headers=headers, timeout=1.5)

                                print(f"Translating: '{transcript}'")
                                res = await asyncio.to_thread(call_translate)
                                if res.status_code == 200:
                                    display_text = res.json().get("translated_text", "")
                                    print(f"Result: '{display_text}'")
                                else:
                                    print(f"Translation API Error {res.status_code}: {res.text}")
                            except Exception as te:
                                print(f"Translation sync error: {te}")
                        
                        # Send to frontend
                        # If display_text is empty (waiting for translation), we don't send to avoid clearing the last good subtitle
                        if display_text:
                            await websocket.send_text(json.dumps({
                                "translated_text": display_text,
                                "transcript": transcript,
                                "is_final": is_final,
                                "type": "data"
                            }))
                        elif is_final:
                            # If it's final and we somehow have no translation, send original to ensure it's recorded
                            await websocket.send_text(json.dumps({
                                "translated_text": transcript,
                                "transcript": transcript,
                                "is_final": True,
                                "type": "data"
                            }))
                            
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
