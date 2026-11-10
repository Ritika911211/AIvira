"""
PromiseOS - Commitment & Escalation Intelligence Engine
Manages:
- "Promises I made" (e.g. "I will send pitch deck by Monday")
- "Waiting For" (e.g. "Waiting for client payment confirmation")
- Smart Escalation: Triggers follow-up reminders and escalations if promises remain unfulfilled.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

class PromiseTrackerEngine:
    def __init__(self):
        # In-memory sample data / cache
        self.promises: List[Dict[str, Any]] = [
            {
                "id": "prm_1",
                "type": "PROMISED_BY_ME",
                "target_person": "Peak Ventures (Investor)",
                "promise_text": "Send updated pitch deck with Q3 metrics",
                "due_date": "Today, 6:00 PM",
                "status": "Open",
                "escalation_rule": "Remind 2 hours before, then notify manager if missed",
                "source": "Voice Command"
            },
            {
                "id": "prm_2",
                "type": "WAITING_FOR",
                "target_person": "Rahul (Tech Lead)",
                "promise_text": "Production deployment status for website",
                "due_date": "Friday, 11:00 AM",
                "status": "Waiting",
                "escalation_rule": "Ping via WhatsApp if no reply by Friday 12 PM",
                "source": "Voice-to-Action Delegation"
            },
            {
                "id": "prm_3",
                "type": "PROMISED_BY_ME",
                "target_person": "Mummy",
                "promise_text": "Call after reaching hotel safely in Goa",
                "due_date": "Yesterday, 10:00 PM",
                "status": "Fulfilled",
                "escalation_rule": "SafeCircle Arrival Ping",
                "source": "SafeWalk Check-in"
            }
        ]

    def get_all(self, promise_type: Optional[str] = None) -> List[Dict[str, Any]]:
        if promise_type:
            return [p for p in self.promises if p["type"] == promise_type]
        return self.promises

    def add_promise(self, promise_data: Dict[str, Any]) -> Dict[str, Any]:
        new_item = {
            "id": f"prm_{len(self.promises) + 1}",
            "type": promise_data.get("type", "PROMISED_BY_ME"),
            "target_person": promise_data.get("target_person", "Contact"),
            "promise_text": promise_data.get("promise_text", ""),
            "due_date": promise_data.get("due_date", "Tomorrow, 5:00 PM"),
            "status": "Open",
            "escalation_rule": promise_data.get("escalation_rule", "Auto-remind on due date"),
            "source": promise_data.get("source", "Manual / Voice")
        }
        self.promises.insert(0, new_item)
        return new_item

    def toggle_status(self, promise_id: str) -> Optional[Dict[str, Any]]:
        for p in self.promises:
            if p["id"] == promise_id:
                p["status"] = "Fulfilled" if p["status"] != "Fulfilled" else "Open"
                return p
        return None

promise_engine = PromiseTrackerEngine()

