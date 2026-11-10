"""
Situation Intelligence Engine - Aivira's Core Differentiator
Proactively detects real-life situations and proposes contextual actions
with human-in-the-loop permission.
"""

from typing import List, Dict, Any
from datetime import datetime, timedelta

class SituationIntelligenceEngine:
    @staticmethod
    def evaluate_situations(user_persona: str, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        situations = []
        
        # 1. School Fee Situation (Parent / Student persona)
        fee_due_days = context.get("school_fee_due_days", 5)
        if fee_due_days is not None and fee_due_days <= 7:
            situations.append({
                "id": "sit_school_fee",
                "category": "FamilyLife",
                "severity": "high",
                "title": "School Fee Due in 5 Days",
                "situation_text": "Rohan's school fee of ₹8,000 is due on 15 December.",
                "suggested_action": "Would you like me to create an early reminder on 12 December and another on the due date?",
                "action_type": "CREATE_REMINDER",
                "payload": {"module": "FamilyLife", "target": "Rohan", "amount": 8000, "days": 5}
            })

        # 2. Delivery Executive / Driving Situation
        is_driving = context.get("is_driving", False)
        incoming_caller = context.get("incoming_caller")
        if is_driving and incoming_caller:
            situations.append({
                "id": "sit_driving_call",
                "category": "DriveSafe",
                "severity": "urgent",
                "title": f"Incoming Call from {incoming_caller}",
                "situation_text": f"Your {incoming_caller} is calling while you are on the road.",
                "suggested_action": "You can answer using your headset or send the approved 'I am driving' auto-reply.",
                "action_type": "TRIGGER_HANDS_FREE",
                "payload": {"caller": incoming_caller, "auto_reply": "I am riding right now. Will call back in 15 mins."}
            })

        # 3. Startup Founder / Business Situation
        pending_investor_deck = context.get("pending_investor_deck", True)
        if user_persona in ["Founder", "Business Owner"] and pending_investor_deck:
            situations.append({
                "id": "sit_founder_investor",
                "category": "FounderOS",
                "severity": "medium",
                "title": "Investor Pitch Deck Follow-up",
                "situation_text": "You committed to sending the updated pitch deck to Peak Ventures today.",
                "suggested_action": "Would you like me to prepare an email draft with the deck attached?",
                "action_type": "DRAFT_EMAIL",
                "payload": {"recipient": "Peak Ventures", "subject": "Updated Pitch Deck - Aivira"}
            })

        # 4. Elderly Parent Care / CareMate Situation
        unconfirmed_meds = context.get("unconfirmed_medicine_minutes", 35)
        if unconfirmed_meds > 30:
            situations.append({
                "id": "sit_medicine_unconfirmed",
                "category": "CareMate",
                "severity": "urgent",
                "title": "Unconfirmed Medicine Dose",
                "situation_text": "Papa's 9:00 PM evening blood pressure medicine hasn't been confirmed yet.",
                "suggested_action": "Would you like me to send a check-in ping or alert the caregiver?",
                "action_type": "SEND_CAREGIVER_ALERT",
                "payload": {"recipient": "Papa", "medicine": "BP Tab (Evening)"}
            })

        return situations

situation_engine = SituationIntelligenceEngine()

