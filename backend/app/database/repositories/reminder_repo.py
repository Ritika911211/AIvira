from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.models import Reminder

class ReminderRepository:
    @staticmethod
    def get_all(db: Session, limit: int = 50) -> List[Reminder]:
        return db.query(Reminder).order_by(Reminder.remind_at.asc()).limit(limit).all()

    @staticmethod
    def create(db: Session, title: str, module: str, remind_at: datetime, priority: str = "Medium", recurrence: str = "Once", metadata: dict = None) -> Reminder:
        reminder = Reminder(
            title=title,
            module=module,
            remind_at=remind_at,
            priority=priority,
            recurrence=recurrence,
            metadata_=metadata or {}
        )
        db.add(reminder)
        db.commit()
        db.refresh(reminder)
        return reminder

    @staticmethod
    def get_pending_due_reminders(db: Session, now: datetime) -> List[Reminder]:
        return db.query(Reminder).filter(Reminder.remind_at <= now, Reminder.is_sent == False).all()

    @staticmethod
    def mark_sent(db: Session, reminder_id: str):
        rem = db.query(Reminder).filter(Reminder.id == reminder_id).first()
        if rem:
            rem.is_sent = True
            db.commit()

