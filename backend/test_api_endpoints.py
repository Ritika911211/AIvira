import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=== 1. Testing GET /health ===")
r = client.get("/health")
print("Status:", r.status_code, "Body:", r.json())
assert r.status_code == 200

print("\n=== 2. Testing GET /health/ready ===")
r = client.get("/health/ready")
print("Status:", r.status_code, "Body:", r.json())
assert r.status_code == 200
assert r.json().get("database_connected") == True

print("\n=== 3. Testing POST /api/v1/assistant/chat ===")
chat_payload = {
    "message": "Kal Rahul ko website deployment ka task dena aur Friday ko progress check karna.",
    "persona": "Professional",
    "language": "Hinglish"
}
r = client.post("/api/v1/assistant/chat", json=chat_payload)
print("Status:", r.status_code)
chat_res = r.json()
print("Reply text:", chat_res.get("reply_text"))
print("Intent:", chat_res.get("intent"))
print("Executed actions:", chat_res.get("executed_actions"))
assert r.status_code == 200
assert len(chat_res.get("executed_actions", [])) > 0

print("\n=== 4. Testing GET /api/tasks (verifying Supabase persistence) ===")
r = client.get("/api/tasks")
tasks = r.json()
print("Total tasks in Supabase:", len(tasks))
for t in tasks[:3]:
    print(f"  - [{t['priority']}] {t['title']} ({t['module']})")
assert len(tasks) > 0

print("\n=== 5. Testing POST /api/v1/speech/synthesize (Gnani Timbre TTS) ===")
tts_payload = {
    "text": "नमस्ते, मैं आईवीरा हूँ। आपका टास्क सेव कर दिया गया है।",
    "voice": "Nalini",
    "language": "hi",
    "model": "timbre-v2.5"
}
r = client.post("/api/v1/speech/synthesize", json=tts_payload)
print("Status:", r.status_code)
tts_res = r.json()
print("Success:", tts_res.get("success"))
print("Audio format:", tts_res.get("audio_format"))
print("Audio base64 length:", len(tts_res.get("audio_base64", "")))
assert r.status_code == 200
assert tts_res.get("success") == True
assert len(tts_res.get("audio_base64", "")) > 100

print("\n=== 6. Testing POST /api/v1/notifications/register-device ===")
r = client.post("/api/v1/notifications/register-device", json={
    "device_token": "test_fcm_token_device_abc123",
    "device_type": "android"
})
print("Status:", r.status_code, "Body:", r.json())
assert r.status_code == 200

print("\nALL API ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!")

