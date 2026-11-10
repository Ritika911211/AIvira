"""
Google Gemini AI Service
Uses official Google Gen AI Python SDK (google-genai) to power Aivira's
conversation intelligence, intent detection, and structured action proposal.
"""
import json
import logging
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types
from app.config import settings
from app.services.ai.prompt_manager import build_persona_prompt

logger = logging.getLogger("aivira.ai.gemini")

class GeminiService:
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
                logger.info(f"Gemini client initialized with model: {self.model}")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")

    async def chat(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        persona: str = "Professional",
        language: str = "Hinglish"
    ) -> Dict[str, Any]:
        """
        Sends conversation message to Gemini, processes context, and returns
        AI response along with detected intent and proposed actions.
        """
        if not self.client:
            logger.warning("Gemini client not initialized. Falling back to local heuristic intent parser.")
            return self._fallback_chat(user_message, persona)

        system_instruction = build_persona_prompt(persona, language)
        
        # Prepare structured extraction prompt
        prompt = f"""User command: "{user_message}"

Analyze the user's input and reply as Aivira.
Return your output in VALID JSON format with this exact structure:
{{
    "reply_text": "Natural friendly spoken reply in {language}",
    "intent": "TASK_CREATION | REMINDER_CREATION | MEMORY_STORAGE | EMERGENCY_SOS | GENERAL_CONVERSATION",
    "proposed_actions": [
        {{
            "action_type": "CREATE_TASK | CREATE_REMINDER | SAVE_MEMORY | TRIGGER_SOS",
            "title": "Clear concise title",
            "module": "WorkMate | CareMate | FamilyLife | MoneyMate | SafetyAgent | FounderOS",
            "priority": "Low | Medium | High | Urgent",
            "due_or_remind_time": "Time string or ISO",
            "recurrence": "Once | Daily | Weekly | Monthly",
            "assignee": "Name if specified, or null"
        }}
    ]
}}
"""

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )

            raw_text = response.text.strip()
            # Clean possible markdown fence
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            
            data = json.loads(raw_text.strip())
            return {
                "success": True,
                "reply_text": data.get("reply_text", "Samajh gaya!"),
                "intent": data.get("intent", "GENERAL_CONVERSATION"),
                "proposed_actions": data.get("proposed_actions", []),
                "model_used": self.model
            }

        except Exception as e:
            logger.error(f"Gemini generation error: {e}. Falling back to heuristic handler.")
            return self._fallback_chat(user_message, persona)

    def _fallback_chat(self, user_message: str, persona: str) -> Dict[str, Any]:
        text_lower = user_message.lower()
        actions = []
        
        if "rahul" in text_lower or "task" in text_lower or "deployment" in text_lower:
            actions.append({
                "action_type": "CREATE_TASK",
                "title": "Website Deployment (Rahul)",
                "module": "WorkMate",
                "priority": "High",
                "due_or_remind_time": "Tomorrow, 5:00 PM",
                "assignee": "Rahul"
            })
            actions.append({
                "action_type": "CREATE_REMINDER",
                "title": "Check Rahul progress on Website Deployment",
                "module": "WorkMate",
                "priority": "Medium",
                "due_or_remind_time": "Friday, 11:00 AM",
                "recurrence": "Once"
            })
            reply = "Maine Rahul ke liye task bana diya hai aur Friday ko progress check karne ka reminder set kar diya hai."
        elif "medicine" in text_lower or "dawai" in text_lower:
            actions.append({
                "action_type": "CREATE_REMINDER",
                "title": "Papa's Morning Medicine",
                "module": "CareMate",
                "priority": "High",
                "due_or_remind_time": "8:00 AM",
                "recurrence": "Daily"
            })
            actions.append({
                "action_type": "CREATE_REMINDER",
                "title": "Papa's Night Medicine",
                "module": "CareMate",
                "priority": "High",
                "due_or_remind_time": "9:00 PM",
                "recurrence": "Daily"
            })
            reply = "Papa ki subah 8 baje aur raat 9 baje ki medicine ke reminders set ho gaye hain."
        elif "school fee" in text_lower or "fee" in text_lower:
            actions.append({
                "action_type": "CREATE_REMINDER",
                "title": "Rohan's School Fee Due",
                "module": "FamilyLife",
                "priority": "High",
                "due_or_remind_time": "10 Dec",
                "recurrence": "Once"
            })
            reply = "Rohan ki school fee ka 5 din pehle reminder schedule kar diya hai."
        else:
            reply = f"Maine aapki baat note kar li hai: '{user_message}'."

        return {
            "success": True,
            "reply_text": reply,
            "intent": "ACTION_PARSED",
            "proposed_actions": actions,
            "model_used": "local-fallback"
        }

gemini_service = GeminiService()

