from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from sqlalchemy.orm import Session
from app.database.supabase import get_db
from app.database.repositories.device_token_repo import DeviceTokenRepository
from app.services.notifications.fcm_service import fcm_service
from app.services.auth.auth_service import AuthService

router = APIRouter(prefix="/notifications", tags=["Notifications (Firebase)"])

class RegisterDeviceRequest(BaseModel):
    device_token: str
    device_type: Optional[str] = "android"
    profile_id: Optional[str] = None

class SendNotificationRequest(BaseModel):
    device_token: Optional[str] = None
    title: str
    body: str
    data: Optional[Dict[str, str]] = None
    send_to_all: Optional[bool] = False

@router.post("/register-device")
def register_device_token(req: RegisterDeviceRequest, db: Session = Depends(get_db)):
    """
    Registers or updates a mobile device token for push notifications.
    """
    if not req.device_token:
        raise HTTPException(status_code=400, detail="Device token required")
    
    token_record = DeviceTokenRepository.register_or_update(
        db=db,
        token=req.device_token,
        device_type=req.device_type,
        profile_id=req.profile_id
    )
    return {
        "success": True,
        "device_token": token_record.device_token,
        "is_active": token_record.is_active
    }

@router.post("/send")
def send_notification(
    req: SendNotificationRequest,
    db: Session = Depends(get_db),
    # Optional auth: if token provided verify, otherwise allow backend calls
    user: Optional[dict] = Depends(AuthService.verify_token)
):
    """
    Dispatches a push notification to specific device token or all active devices.
    Protected by backend authorization.
    """
    if req.send_to_all:
        tokens = DeviceTokenRepository.get_active_tokens(db)
        results = []
        for t in tokens:
            res = fcm_service.send_notification(token=t, title=req.title, body=req.body, data=req.data)
            results.append(res)
        return {"success": True, "dispatched_count": len(results), "results": results}
    
    if not req.device_token:
        raise HTTPException(status_code=400, detail="Must provide device_token or set send_to_all=true")
    
    res = fcm_service.send_notification(token=req.device_token, title=req.title, body=req.body, data=req.data)
    return res

