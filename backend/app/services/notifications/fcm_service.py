"""
Firebase Cloud Messaging (FCM) Service
Handles Firebase Admin SDK initialization, device token tracking,
and push notifications for reminders, system alerts, and incoming calls.
"""
import os
import logging
from typing import Dict, Any, List, Optional
import firebase_admin
from firebase_admin import credentials, messaging
from app.config import settings

logger = logging.getLogger("aivira.notifications.fcm")

class FCMService:
    def __init__(self):
        self.is_initialized = False
        self.project_id = settings.FIREBASE_PROJECT_ID
        self._init_firebase()

    def _init_firebase(self):
        if firebase_admin._apps:
            self.is_initialized = True
            logger.info("Firebase Admin already initialized")
            return

        # 1. Try service account file if provided
        if settings.FIREBASE_SERVICE_ACCOUNT_FILE and os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_FILE):
            try:
                cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_FILE)
                firebase_admin.initialize_app(cred, {"projectId": self.project_id})
                self.is_initialized = True
                logger.info(f"Firebase Admin initialized via service account file for project: {self.project_id}")
                return
            except Exception as e:
                logger.error(f"Failed to initialize Firebase from file: {e}")

        # 2. Try inline credentials from environment variables
        if settings.FIREBASE_CLIENT_EMAIL and settings.FIREBASE_PRIVATE_KEY:
            try:
                cert_dict = {
                    "type": "service_account",
                    "project_id": self.project_id,
                    "client_email": settings.FIREBASE_CLIENT_EMAIL,
                    "private_key": settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n")
                }
                cred = credentials.Certificate(cert_dict)
                firebase_admin.initialize_app(cred, {"projectId": self.project_id})
                self.is_initialized = True
                logger.info(f"Firebase Admin initialized via env credentials for project: {self.project_id}")
                return
            except Exception as e:
                logger.error(f"Failed to initialize Firebase from env: {e}")

        logger.info(f"Firebase project configured as '{self.project_id}'. Service account credentials pending for live FCM sending.")

    def send_notification(
        self,
        token: str,
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Sends a single push notification to a registered device token.
        """
        if not self.is_initialized:
            logger.warning(f"[Simulated FCM] To token {token[:10]}... | Title: {title} | Body: {body}")
            return {
                "success": True,
                "message_id": f"simulated_fcm_{title[:10]}",
                "is_simulated": True
            }

        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                token=token
            )
            response = messaging.send(message)
            logger.info(f"FCM notification sent successfully: {response}")
            return {
                "success": True,
                "message_id": response,
                "is_simulated": False
            }
        except messaging.UnregisteredError:
            logger.warning(f"Device token is unregistered or expired: {token[:15]}...")
            return {
                "success": False,
                "error": "UNREGISTERED_TOKEN",
                "token": token
            }
        except Exception as e:
            logger.error(f"Failed to send FCM message: {e}")
            return {
                "success": False,
                "error": str(e)
            }

fcm_service = FCMService()

