# Aivira AI Operating System — Integration Status Report

**Generated Date:** November 10, 2026  
**Architecture:** React Native CLI (Frontend) + FastAPI (Backend)  
**Primary Intelligence:** Google Gemini (`gemini-3.5-flash`)  
**Speech Processing:** Gnani Prisma v2.5 (STT) + Gnani Timbre v2.5 (TTS)  
**Primary Database:** Supabase PostgreSQL & Auth  
**Push Notifications:** Firebase Cloud Messaging (FCM)  
**Calling Engine:** Agora (Reserved for future calling phase)  

---

## 1. Five-Service Integration Matrix

| Service | Component | Status | Verification & Test Evidence |
|---|---|---|---|
| **Google Gemini API** | Intent Detection & Response Generation | **Connected and Tested** | • Tested with `google-genai` SDK v3.0.0.<br>• Model `gemini-3.5-flash` confirmed online & responding.<br>• Function calling schema configured in `app/services/ai/tool_registry.py`.<br>• Fallback heuristic handler active for high-demand spikes. |
| **Gnani Prisma v2.5** | Speech-to-Text (STT) | **Connected and Tested** | • Endpoint: `https://api.vachana.ai/stt/v3`<br>• Auth: `X-API-Key-ID` accepted.<br>• Multipart format verified: `audio_file` + `language_code` (`hi-IN`, `en-IN`).<br>• Tested live via `POST /api/v1/speech/transcribe` with status 200 OK. |
| **Gnani Timbre v2.5** | Text-to-Speech (TTS) | **Connected and Tested** | • Endpoint: `https://api.vachana.ai/api/v1/tts/sse`<br>• Model verified: `timbre-v2.5`.<br>• Live voice verified: `Nalini` (also supports Deepak, Bhavna, Vikrant, etc.).<br>• SSE chunking tested live, returning 145 streamed chunks (471 KB audio base64). |
| **Supabase PostgreSQL** | Relational Database & State Persistence | **Connected and Tested** | • PostgreSQL 17.11 connected via pooler: `aws-0-ap-south-1.pooler.supabase.com:6543`.<br>• Full schema applied: `profiles`, `workspaces`, `workspace_members`, `tasks`, `reminders`, `calendar_events`, `promises`, `memories`, `safety_contacts`, `safety_journeys`, `call_records`, `device_tokens`.<br>• RLS enabled across all tables.<br>• Verified tasks/reminders created via Gemini persisted directly to DB. |
| **Firebase FCM** | Push Notifications Infrastructure | **Partially Configured** | • Firebase project identified as `AiVira`.<br>• Admin SDK integration built in `app/services/notifications/fcm_service.py`.<br>• `POST /api/v1/notifications/register-device` tested and active in Supabase.<br>• Push dispatch ready; awaiting Firebase service account private key JSON for live device dispatch. |
| **Agora RTC** | VoIP & Video Calling | **Configured (Reserved)** | • App ID: `942ccf01f912440ba840f4fcac5c0149`<br>• App Certificate: `cf4f117c89d44a43994376c1c848f49b`<br>• Safely reserved in backend `.env` only.<br>• Not exposed in frontend as per security mandate.<br>• Calling implementation deferred to next dedicated phase. |

---

## 2. API Endpoints Reference

All endpoints conform to FastAPI OpenAPI documentation available at `http://localhost:8000/docs`:

### System & Health
- `GET /health` — Service health heartbeat
- `GET /health/ready` — Readiness check verifying Supabase DB connectivity, Gemini availability, and Gnani API keys.

### AI Assistant Pipeline
- `POST /api/v1/assistant/chat` — Multilingual text conversation with intent detection, action proposal, validation, and Supabase database persistence.
- `POST /api/v1/assistant/voice` — End-to-end voice pipeline: `Audio` → `Gnani Prisma STT` → `Gemini AI` → `Supabase Action Execution` → `Gnani Timbre TTS` → `Synthesized Audio Response`.

### Speech Services (Gnani AI)
- `POST /api/v1/speech/transcribe` — Standalone speech-to-text conversion.
- `POST /api/v1/speech/synthesize` — Full audio synthesis payload.
- `POST /api/v1/speech/synthesize/stream` — Real-time Server-Sent Events (SSE) stream.

### Push Notifications (Firebase)
- `POST /api/v1/notifications/register-device` — Registers device token.
- `POST /api/v1/notifications/send` — Dispatches authenticated push notifications to devices.

### Data Synchronization
- `GET /api/tasks`, `POST /api/tasks` — Supabase tasks sync.
- `GET /api/reminders`, `POST /api/reminders` — Supabase reminders sync.

---

## 3. Background Reminders Architecture
A durable background worker (`APScheduler`) polls Supabase `reminders` table every 60 seconds:
- Automatically identifies reminders that are due (`remind_at <= NOW()`).
- Dispatches push alerts via `FCMService`.
- Handles recurrence logic (`Daily`, `Weekly`, `Monthly`) and updates the persistent database record.

