from pydantic import BaseModel

class TTSRequest(BaseModel):
    text: str
    target_language: str
    speaker: str = "meera" # Option to pick male/female speaker based on Sarvam API docs
