from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.models import DeviceToken

class DeviceTokenRepository:
    @staticmethod
    def register_or_update(db: Session, token: str, device_type: str = "android", profile_id=None) -> DeviceToken:
        existing = db.query(DeviceToken).filter(DeviceToken.device_token == token).first()
        if existing:
            existing.is_active = True
            existing.last_updated = datetime.utcnow()
            if profile_id:
                existing.profile_id = profile_id
            db.commit()
            db.refresh(existing)
            return existing
        
        new_token = DeviceToken(
            device_token=token,
            device_type=device_type,
            profile_id=profile_id,
            is_active=True
        )
        db.add(new_token)
        db.commit()
        db.refresh(new_token)
        return new_token

    @staticmethod
    def get_active_tokens(db: Session) -> List[str]:
        tokens = db.query(DeviceToken).filter(DeviceToken.is_active == True).all()
        return [t.device_token for t in tokens]

