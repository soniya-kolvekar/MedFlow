from pydantic import BaseModel

class TTSRequest(BaseModel):
    text: str
    target_language: str
    speaker: str = "meera"

class SummaryRequest(BaseModel):
    transcript: str
