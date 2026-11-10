from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from app.services.speech.prisma_stt import prisma_stt_service
from app.services.speech.timbre_tts import timbre_tts_service

router = APIRouter(prefix="/speech", tags=["Speech (Gnani AI)"])

class SynthesizeRequest(BaseModel):
    text: str
    voice: Optional[str] = "Nalini"
    language: Optional[str] = "hi"
    model: Optional[str] = "timbre-v2.5"

@router.post("/transcribe")
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    language_code: str = Form("hi-IN")
):
    """
    Transcribes spoken audio using Gnani Prisma v2.5 STT.
    Supported language codes: hi-IN (Hindi), en-IN (Indian English), etc.
    """
    contents = await audio_file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty audio file uploaded")
    
    result = await prisma_stt_service.transcribe(
        audio_bytes=contents,
        filename=audio_file.filename or "audio.wav",
        content_type=audio_file.content_type or "audio/wav",
        language_code=language_code
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=502, detail=result.get("error", "Transcription failed"))
    
    return result

@router.post("/synthesize")
async def synthesize_text(req: SynthesizeRequest):
    """
    Synthesizes text into speech audio using Gnani Timbre v2.5 TTS.
    Returns assembled base64 audio and metadata.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    result = await timbre_tts_service.synthesize(
        text=req.text,
        voice=req.voice,
        language=req.language,
        model=req.model
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=502, detail=result.get("error", "Speech synthesis failed"))
        
    return result

@router.post("/synthesize/stream")
async def synthesize_stream(req: SynthesizeRequest):
    """
    Real-time Server-Sent Events (SSE) streaming for low-latency voice playback.
    """
    return StreamingResponse(
        timbre_tts_service.stream_synthesize(text=req.text, voice=req.voice, language=req.language or "hi"),
        media_type="text/event-stream"
    )

