from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.models import Task

class TaskRepository:
    @staticmethod
    def get_all(db: Session, limit: int = 50) -> List[Task]:
        return db.query(Task).order_by(Task.created_at.desc()).limit(limit).all()

    @staticmethod
    def create(db: Session, title: str, module: str = "WorkMate", priority: str = "Medium", due_date=None, description: str = None, from_voice: bool = False) -> Task:
        task = Task(
            title=title,
            module=module,
            priority=priority,
            due_date=due_date,
            description=description,
            extracted_from_voice=from_voice
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def update_status(db: Session, task_id: str, status: str) -> Optional[Task]:
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            task.status = status
            db.commit()
            db.refresh(task)
        return task

