"""
Background Reminders Scheduler
Runs periodic checks against Supabase PostgreSQL to fire due reminders
and dispatch push notifications via FCM.
"""
import logging
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from app.database.supabase import SessionLocal
from app.database.repositories.reminder_repo import ReminderRepository
from app.database.repositories.device_token_repo import DeviceTokenRepository
from app.services.notifications.fcm_service import fcm_service

logger = logging.getLogger("aivira.scheduler.reminders")

class ReminderScheduler:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.is_running = False

    def check_and_fire_due_reminders(self):
        """
        Polls database for due reminders, sends FCM notifications, and marks sent.
        """
        db = SessionLocal()
        try:
            now = datetime.utcnow()
            due_reminders = ReminderRepository.get_pending_due_reminders(db, now)
            if not due_reminders:
                return

            logger.info(f"Found {len(due_reminders)} due reminder(s) to dispatch")
            active_tokens = DeviceTokenRepository.get_active_tokens(db)

            for rem in due_reminders:
                title = f"⏰ Aivira Reminder: {rem.title}"
                body = f"Module: {rem.module} | Priority: {rem.priority}"
                
                # Send to active mobile devices
                for token in active_tokens:
                    fcm_service.send_notification(
                        token=token,
                        title=title,
                        body=body,
                        data={"reminder_id": str(rem.id), "module": rem.module}
                    )

                # Update or handle recurrence
                if rem.recurrence == "Daily":
                    rem.remind_at = rem.remind_at + timedelta(days=1)
                elif rem.recurrence == "Weekly":
                    rem.remind_at = rem.remind_at + timedelta(weeks=1)
                else:
                    rem.is_sent = True
                    
                db.commit()

        except Exception as e:
            logger.error(f"Error checking due reminders: {e}")
        finally:
            db.close()

    def start(self):
        if not self.is_running:
            # Poll every 60 seconds
            self.scheduler.add_job(
                self.check_and_fire_due_reminders,
                "interval",
                seconds=60,
                id="check_reminders_job",
                replace_existing=True
            )
            self.scheduler.start()
            self.is_running = True
            logger.info("Reminder background scheduler started (60s poll interval)")

    def shutdown(self):
        if self.is_running:
            self.scheduler.shutdown()
            self.is_running = False
            logger.info("Reminder background scheduler stopped")

reminder_scheduler = ReminderScheduler()

