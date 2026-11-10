from typing import List
from sqlalchemy.orm import Session
from app.database.models import Memory

class MemoryRepository:
    @staticmethod
    def get_all(db: Session, limit: int = 50) -> List[Memory]:
        return db.query(Memory).order_by(Memory.created_at.desc()).limit(limit).all()

    @staticmethod
    def create(db: Session, title: str, content: str, category: str = "Notes", summary: str = None) -> Memory:
        mem = Memory(
            title=title,
            content=content,
            category=category,
            summary=summary
        )
        db.add(mem)
        db.commit()
        db.refresh(mem)
        return mem

