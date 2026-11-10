"""
Tool definitions and schemas for Gemini Function Calling.
FastAPI validates and executes every action proposed by Gemini.
"""
from typing import Dict, Any, List

AIVIRA_TOOLS = [
    {
        "name": "create_task",
        "description": "Create a new actionable task with priority and deadline",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "title": {"type": "STRING", "description": "Title of the task"},
                "module": {"type": "STRING", "description": "Module category, e.g. WorkMate, FamilyLife, FounderOS"},
                "priority": {"type": "STRING", "enum": ["Low", "Medium", "High", "Urgent"]},
                "due_date": {"type": "STRING", "description": "Due date or time string"},
                "assignee": {"type": "STRING", "description": "Name of person assigned, if any"}
            },
            "required": ["title"]
        }
    },
    {
        "name": "create_reminder",
        "description": "Create a scheduled reminder for fee, medicine, meeting, or personal obligation",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "title": {"type": "STRING", "description": "Reminder text or title"},
                "module": {"type": "STRING", "description": "CareMate, FamilyLife, MoneyMate, WorkMate"},
                "remind_at": {"type": "STRING", "description": "Date or time for reminder"},
                "priority": {"type": "STRING", "enum": ["Low", "Medium", "High", "Urgent"]},
                "recurrence": {"type": "STRING", "enum": ["Once", "Daily", "Weekly", "Monthly"]}
            },
            "required": ["title", "module"]
        }
    },
    {
        "name": "save_memory",
        "description": "Store important personal or business notes, decisions, or facts in AI Memory (MemoryOS)",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "title": {"type": "STRING", "description": "Brief headline of the memory"},
                "content": {"type": "STRING", "description": "Detailed text to remember"},
                "category": {"type": "STRING", "description": "Meeting, Notes, Decision, Family, Travel"}
            },
            "required": ["title", "content"]
        }
    },
    {
        "name": "trigger_safety_sos",
        "description": "Trigger emergency safety alert and notify trusted contacts with live location",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "reason": {"type": "STRING", "description": "Reason for emergency SOS"},
                "mode": {"type": "STRING", "description": "Women Safety, DriveSafe, SafeWalk"}
            },
            "required": ["reason"]
        }
    }
]

