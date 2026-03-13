from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import os
import requests
import json
import asyncio
import websockets
from dotenv import load_dotenv
from typing import Optional
from models import TTSRequest

# Load environment variables
load_dotenv()

app = FastAPI(title="MedFlow AI API", description="Backend for MedFlow AI prototype", version="1.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
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
async def translate_websocket_relay(websocket: WebSocket, target_language: str = "en"):
    """
    WebSocket relay to Sarvam AI Streaming STT-Translate API
    """
    await websocket.accept()
    
    sarvam_url = "wss://api.sarvam.ai/speech-to-text-translate"
    headers = {
        "api-subscription-key": SARVAM_API_KEY
    }

    try:
        async with websockets.connect(sarvam_url, extra_headers=headers) as sarvam_ws:
            # Send initial configuration to Sarvam
            config = {
                "action": "start",
                "target_language_code": f"{target_language}-IN",
                "model": "saarika:v1" # Example model, should verify current streaming model name
            }
            await sarvam_ws.send(json.dumps(config))

            async def receive_from_client():
                try:
                    while True:
                        data = await websocket.receive_bytes()
                        # Wrap binary data in Sarvam format if required, 
                        # but usually streaming APIs take raw bytes after start
                        await sarvam_ws.send(data)
                except WebSocketDisconnect:
                    await sarvam_ws.send(json.dumps({"action": "stop"}))
                except Exception as e:
                    print(f"Client receive error: {e}")

            async def send_to_client():
                try:
                    async for message in sarvam_ws:
                        # Message from Sarvam is usually JSON
                        await websocket.send_text(message)
                except Exception as e:
                    print(f"Sarvam relay error: {e}")

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
