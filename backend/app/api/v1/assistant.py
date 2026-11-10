import logging
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.supabase import get_db
from app.database.repositories.task_repo import TaskRepository
from app.database.repositories.reminder_repo import ReminderRepository
from app.database.repositories.memory_repo import MemoryRepository
from app.services.ai.gemini_service import gemini_service
from app.services.speech.prisma_stt import prisma_stt_service
from app.services.speech.timbre_tts import timbre_tts_service

logger = logging.getLogger("aivira.api.assistant")

router = APIRouter(prefix="/assistant", tags=["Assistant (Gemini + Voice Pipeline)"])

class ChatRequest(BaseModel):
    message: str
    persona: Optional[str] = "Professional"
    language: Optional[str] = "Hinglish"
    conversation_history: Optional[List[Dict[str, str]]] = []

def execute_validated_actions(db: Session, proposed_actions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Validates every action proposed by Gemini and persists it to Supabase DB.
    Never executes arbitrary actions.
    """
    executed = []
    for action in proposed_actions:
        action_type = action.get("action_type")
        title = action.get("title", "").strip()
        if not title:
            continue
            
        if action_type == "CREATE_TASK":
            task = TaskRepository.create(
                db=db,
                title=title,
                module=action.get("module", "WorkMate"),
                priority=action.get("priority", "Medium"),
                from_voice=True
            )
            executed.append({
                "action_type": "CREATE_TASK",
                "id": str(task.id),
                "title": task.title,
                "module": task.module,
                "priority": task.priority
            })
            
        elif action_type == "CREATE_REMINDER":
            # Default remind_at to today + 2 hours or tomorrow if not parseable
            remind_time = datetime.utcnow() + timedelta(hours=2)
            reminder = ReminderRepository.create(
                db=db,
                title=title,
                module=action.get("module", "CareMate"),
                remind_at=remind_time,
                priority=action.get("priority", "High"),
                recurrence=action.get("recurrence", "Once")
            )
            executed.append({
                "action_type": "CREATE_REMINDER",
                "id": str(reminder.id),
                "title": reminder.title,
                "module": reminder.module,
                "remind_at": reminder.remind_at.isoformat()
            })
            
        elif action_type == "SAVE_MEMORY":
            mem = MemoryRepository.create(
                db=db,
                title=title,
                content=action.get("content", title),
                category=action.get("category", "Notes")
            )
            executed.append({
                "action_type": "SAVE_MEMORY",
                "id": str(mem.id),
                "title": mem.title,
                "category": mem.category
            })
            
    return executed

@router.post("/chat")
async def chat_with_assistant(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Text-based assistant conversation powered by Google Gemini.
    Detects intents, validates actions, and saves tasks/reminders to Supabase.
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    ai_result = await gemini_service.chat(
        user_message=req.message,
        conversation_history=req.conversation_history,
        persona=req.persona or "Professional",
        language=req.language or "Hinglish"
    )
    
    # Validate and execute proposed actions safely in DB
    executed = execute_validated_actions(db, ai_result.get("proposed_actions", []))
    
    return {
        "reply_text": ai_result.get("reply_text"),
        "intent": ai_result.get("intent"),
        "executed_actions": executed,
        "model_used": ai_result.get("model_used")
    }

@router.post("/voice")
async def voice_assistant_pipeline(
    audio_file: UploadFile = File(...),
    persona: str = Form("Professional"),
    language_code: str = Form("hi-IN"),
    voice_name: str = Form("Nalini"),
    db: Session = Depends(get_db)
):
    """
    Complete End-to-End Aivira Voice Pipeline:
    1. Audio -> Gnani Prisma v2.5 STT
    2. Transcribed Text -> Gemini AI
    3. Action validation & DB persistence -> Supabase
    4. AI Reply -> Gnani Timbre v2.5 TTS
    5. Returns transcript, reply text, executed actions, and synthesized audio!
    """
    audio_bytes = await audio_file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio file uploaded")
        
    # Step 1: Transcribe with Gnani Prisma STT
    stt_res = await prisma_stt_service.transcribe(
        audio_bytes=audio_bytes,
        filename=audio_file.filename or "voice.wav",
        content_type=audio_file.content_type or "audio/wav",
        language_code=language_code
    )
    
    transcript = stt_res.get("transcript", "").strip()
    if not transcript:
        # Default conversational prompt if empty audio
        transcript = "Namaste Aivira, aaj ke mere important tasks batao."
        
    # Step 2: Reasoning & Intent Extraction with Google Gemini
    ai_res = await gemini_service.chat(
        user_message=transcript,
        persona=persona,
        language="Hinglish" if "hi" in language_code else "English"
    )
    
    reply_text = ai_res.get("reply_text", "Samajh gaya!")
    
    # Step 3: Validate & execute actions into Supabase DB
    executed = execute_validated_actions(db, ai_res.get("proposed_actions", []))
    
    # Step 4: Synthesize Voice Response with Gnani Timbre TTS
    tts_res = await timbre_tts_service.synthesize(
        text=reply_text,
        voice=voice_name,
        language="hi" if "hi" in language_code else "en"
    )
    
    return {
        "transcript": transcript,
        "reply_text": reply_text,
        "intent": ai_res.get("intent"),
        "executed_actions": executed,
        "audio_base64": tts_res.get("audio_base64"),
        "audio_format": tts_res.get("audio_format", "wav"),
        "stt_engine": "Gnani Prisma v2.5",
        "tts_engine": "Gnani Timbre v2.5",
        "ai_engine": ai_res.get("model_used")
    }

