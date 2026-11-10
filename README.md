<<<<<<< HEAD
# AIvira
=======
# Aivira – Your Life. Your Work. One AI.

> Production-ready, Android-first AI Personal Operating System built with React Native (Expo), TypeScript, Python FastAPI, PostgreSQL (Supabase), and Gnani AI Voice Agent.

---

## 📱 Visual UI Design Alignment

The mobile application design reproduces the **15 screens** from the Aivira UI Design Reference (`Basic/Aivira Personal AI Assistant UI Collage.png`):

1. **Splash Screen**: Glowing 3D AI assistant sphere with orbiting rings, tagline *"Your Life. Your Work. One AI."*, and subtle loading animation.
2. **Onboarding Carousel**: Multi-stage carousel introducing children, students, working professionals, and business owners (*"From school to success"*), with Get Started and Sign In buttons.
3. **Authentication Screen**: Mobile number login (+91), password field with show/hide toggle, OTP verification, Remember me, social logins (Google, Apple).
4. **Home Dashboard**:
   - Header with personalized greeting (*"Good morning, Priya!"*), notifications badge, and workspace switcher.
   - Central AI Voice Assistant Card with live audio waveform, prompt *"How can I help you today?"*, and central microphone trigger.
   - Quick Action cards (Make a call, Add a task, Check calendar, Start Safety).
   - Signature **Situation Intelligence** alert card (*"Rohan's school fee due in 5 days"*).
   - Today's Highlights (FamilyLife, WorkMate, CareMate).
   - Pending tasks with interactive checkboxes.
5. **Aivira Modules Screen**: Searchable directory covering all 20 modules organized into Personal Life, Communication, Productivity, Health & Safety, Business, and Intelligence.
6. **FamilyLife Manager**: School fee reminders with advance countdowns, homework tracker, exam alerts, school transport bus timings, document expiry, and parent-child task sharing.
7. **Aivira Safety Agent (Women Safety)**: Protective shield hero illustration, *"Start Safe Journey"* consent-based GPS tracker, live location sharing, SOS alert trigger, and trusted contacts circle.
8. **DriveSafe Assistant (Delivery Rider)**: Motorcycle delivery illustration, *"Driving Mode Active"* status dot, incoming call routing with urgency detection, voice delivery instructions reader, and hands-free auto-reply toggles.
9. **Smart Planner**: Today/Week/Month tabs, date navigator (`< Tue 15 Apr >`), hourly schedule timeline with module color tags, and *"Free slot available"* highlight.
10. **Tasks & Productivity**: All, Today, Upcoming, and Completed tabs, priority badges (High, Medium, Low), interactive completion toggles, and floating `+ Add Task` modal.
11. **Voice Assistant (Active Mode)**: Pulsing central AI orb, animated live waveform, live speech-to-text transcript, voice-to-action execution confirmation, and multilingual prompts (Hindi, English, Hinglish).
12. **Memory & Notes (MemoryOS)**: Notes, Summaries, and Search tabs with *"Ask your memory"* semantic search bar (e.g. *"Last week meeting mein kya decide hua tha?"*), category badges, and `+ New Note` modal.
13. **Settings & Workspace Center**: Profile card (Priya Sharma), Personal, Family, and Business workspace selector, personalization settings, privacy/permissions, connected accounts, and theme preferences.
14. **Safety Alert (Emergency SOS Active)**: High-urgency dark crimson theme, *"SOS Alert Sent"*, live Google Maps GPS tracking card, Call Emergency (112), Contact Family, and Cancel Alert.
15. **Daily AI Briefing**: Morning/evening briefing with Top Priorities, Today's Schedule timeline, and proactive contextual suggestions.

---

## 🌟 The 3 Signature Differentiators

1. **Situation Intelligence**:
   - Aivira doesn't wait for explicit commands. It proactively evaluates real-life situations (school fee due dates, delivery rider receiving calls on the road, startup founder investor pitch deck deadlines, elderly parent unconfirmed medication doses) and presents actionable suggestions with human-in-the-loop consent.
2. **Promise Tracker (PromiseOS)**:
   - Tracks commitments in two distinct directions:
     - *Promises I Made* (e.g. *"Send updated pitch deck with Q3 metrics by today evening to investor"*).
     - *Waiting For Others* (e.g. *"Waiting for website deployment status from Rahul"*).
3. **Smart Escalation**:
   - If an urgent responsibility remains unfulfilled after a specified timeframe, Aivira triggers configured escalation rules (e.g. advance reminder -> WhatsApp ping -> caregiver/manager alert).

---

## 🎙️ Gnani AI Voice Agent Integration

- **Modular Adapter Architecture**: Implemented in `backend/app/services/gnani_service.py` and `aivira-app/src/services/voiceAgent.ts`.
- **Multilingual Support**: Real-time understanding of Hindi, Indian English, and Hinglish.
- **Voice-to-Action Engine**:
  - *"Kal Rahul ko website deployment ka task dena aur Friday ko progress check karna"* ➡️ Automatically creates Rahul's task and schedules Friday follow-up reminder.
  - *"Papa ki medicine subah 8 aur raat 9 baje yaad dilana"* ➡️ Automatically creates two daily recurring medicine reminders with confirmation check-in.
  - *"Rohan ki school fee 15 December ko due hai, 5 din pehle remind karna"* ➡️ Automatically creates an advance fee reminder and due date alert.

---

## 🏗️ Repository Architecture

```
.
├── aivira-app/                   # React Native Expo Mobile App (TypeScript)
│   ├── src/
│   │   ├── components/           # Reusable UI (VoiceWaveform, AiviraOrb, Header, BottomNavBar)
│   │   ├── screens/              # All 15+ Screens & Modals
│   │   ├── services/             # StorageService (AsyncStorage persistence), VoiceAgentService
│   │   ├── theme/                # Color tokens (#7652EB brand palette, light default & SOS dark)
│   │   └── types/                # Personas, Workspaces, Tasks, Reminders, Promises, Memories
│   ├── App.tsx                   # Main application controller with phase routing & state
│   └── package.json
│
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py               # FastAPI entry point, REST endpoints & WebSocket streams
│   │   ├── config.py             # App configuration, Supabase & Gnani settings
│   │   └── services/
│   │       ├── gnani_service.py  # Modular Gnani STT/TTS & Intent Adapter
│   │       ├── situation_intelligence.py # Proactive contextual detector
│   │       ├── promise_engine.py # PromiseOS & Escalation rules
│   │       └── calling_service.py # WhatsApp, Phone dialer, and Aivira VoIP session manager
│   ├── schema.sql                # Complete PostgreSQL / Supabase DDL schema with RLS
│   └── requirements.txt
│
└── Basic/                        # Reference documents & UI collage
    ├── Aivira Personal AI Assistant UI Collage.png
    ├── Our Gnani Powered AI Voice agent.pdf
    └── All Feature.pdf
```

---

## 🚀 Getting Started

### 1. Mobile Application (React Native / Expo)

```bash
cd aivira-app

# Run in development mode
pnpm start

# Run on Android emulator / device
pnpm run android

# Run in Web browser
pnpm run web
```

### 2. Backend (Python FastAPI)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server with hot reload
uvicorn app.main:app --reload --port 8000
```

- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
- Real-time Voice WebSocket: `ws://localhost:8000/ws/voice-stream`

>>>>>>> 38f9fab (update)
