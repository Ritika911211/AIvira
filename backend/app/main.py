"""
Aivira AI Operating System - FastAPI Backend
Production Core Server integrating Google Gemini, Gnani Prisma v2.5 STT,
Gnani Timbre v2.5 TTS, Supabase PostgreSQL & Auth, and Firebase Cloud Messaging.
"""
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.config import settings
from app.database.supabase import get_db, engine
from app.database.repositories.task_repo import TaskRepository
from app.database.repositories.reminder_repo import ReminderRepository
from app.services.scheduler.reminder_scheduler import reminder_scheduler

# API v1 Routers
from app.api.v1.assistant import router as assistant_router
from app.api.v1.speech import router as speech_router
from app.api.v1.notifications import router as notifications_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("aivira.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start reminder background scheduler
    logger.info("Initializing Aivira Operating System services...")
    reminder_scheduler.start()
    yield
    # Shutdown
    reminder_scheduler.shutdown()
    logger.info("Aivira Operating System services stopped.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Your Life. Your Work. One AI. Production Operating System Backend",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Routers
app.include_router(assistant_router, prefix="/api/v1")
app.include_router(speech_router, prefix="/api/v1")
app.include_router(notifications_router, prefix="/api/v1")

# Health Checks
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }

@app.get("/health/ready")
def health_ready(db: Session = Depends(get_db)):
    # Check DB connectivity
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception as e:
        logger.error(f"Database readiness check failed: {e}")
        
    return {
        "status": "ready" if db_ok else "degraded",
        "database_connected": db_ok,
        "gemini_model": settings.GEMINI_MODEL,
        "gnani_stt": bool(settings.GNANI_API_KEY),
        "gnani_tts": bool(settings.GNANI_API_KEY),
        "firebase_project": settings.FIREBASE_PROJECT_ID,
        "agora_ready": bool(settings.AGORA_APP_ID)
    }

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "tagline": "Your Life. Your Work. One AI.",
        "status": "online",
        "docs_url": "/docs",
        "services": {
            "ai_engine": f"Google Gemini ({settings.GEMINI_MODEL})",
            "stt_engine": "Gnani Prisma v2.5",
            "tts_engine": f"Gnani Timbre v2.5 ({settings.GNANI_TTS_DEFAULT_VOICE})",
            "database": "Supabase PostgreSQL",
            "notifications": f"Firebase FCM ({settings.FIREBASE_PROJECT_ID})",
            "calling": "Agora (Reserved for future calling phase)"
        }
    }

# Data endpoints for frontend synchronization
class TaskCreateRequest(BaseModel):
    title: str
    module: Optional[str] = "WorkMate"
    priority: Optional[str] = "Medium"
    due_date: Optional[str] = None
    description: Optional[str] = None

class ReminderCreateRequest(BaseModel):
    title: str
    module: str
    remind_at: Optional[str] = None
    priority: Optional[str] = "High"
    recurrence: Optional[str] = "Once"

@app.get("/api/tasks")
def list_tasks(db: Session = Depends(get_db)):
    tasks = TaskRepository.get_all(db)
    return [
        {
            "id": str(t.id),
            "title": t.title,
            "module": t.module,
            "priority": t.priority,
            "status": t.status,
            "completed": t.status == "Completed",
            "due_date": t.due_date.isoformat() if t.due_date else "Today"
        }
        for t in tasks
    ]

@app.post("/api/tasks")
def create_task(req: TaskCreateRequest, db: Session = Depends(get_db)):
    task = TaskRepository.create(
        db=db,
        title=req.title,
        module=req.module or "WorkMate",
        priority=req.priority or "Medium",
        description=req.description
    )
    return {
        "id": str(task.id),
        "title": task.title,
        "module": task.module,
        "priority": task.priority,
        "status": task.status
    }

@app.get("/api/reminders")
def list_reminders(db: Session = Depends(get_db)):
    rems = ReminderRepository.get_all(db)
    return [
        {
            "id": str(r.id),
            "title": r.title,
            "module": r.module,
            "priority": r.priority,
            "remind_at": r.remind_at.isoformat(),
            "recurrence": r.recurrence
        }
        for r in rems
    ]

@app.post("/api/reminders")
def create_reminder(req: ReminderCreateRequest, db: Session = Depends(get_db)):
    remind_time = datetime.utcnow()
    reminder = ReminderRepository.create(
        db=db,
        title=req.title,
        module=req.module,
        remind_at=remind_time,
        priority=req.priority or "High",
        recurrence=req.recurrence or "Once"
    )
    return {
        "id": str(reminder.id),
        "title": reminder.title,
        "module": reminder.module,
        "remind_at": reminder.remind_at.isoformat()
    }
