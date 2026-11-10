-- ==============================================================================
-- AIVIRA AI OPERATING SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- Supports Multi-Workspace, Personas, Voice-to-Action, Situation Intelligence,
-- PromiseOS, SafeCircle modules, and FCM Device Tokens.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- References auth.users(id) in Supabase
    full_name TEXT NOT NULL,
    email TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    active_persona TEXT DEFAULT 'Professional', -- Student, Parent, Professional, Founder, Delivery, Elderly
    preferred_language TEXT DEFAULT 'Hinglish', -- English, Hindi, Hinglish
    voice_enabled BOOLEAN DEFAULT TRUE,
    auto_driving_mode BOOLEAN DEFAULT FALSE,
    emergency_sos_pin TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKSPACES (Personal, Family, Business)
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    workspace_type TEXT NOT NULL CHECK (workspace_type IN ('Personal', 'Family', 'Business')),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKSPACE MEMBERS & ROLES
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('Owner', 'Admin', 'Manager', 'Employee', 'Parent', 'Child', 'Member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, profile_id)
);

-- 4. TASKS & COMMITMENTS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id),
    assigned_to UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    module TEXT DEFAULT 'WorkMate', -- FamilyLife, WorkMate, FounderOS, etc.
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    due_date TIMESTAMPTZ,
    extracted_from_voice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REMINDERS & NOTIFICATION ENGINE
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    module TEXT NOT NULL, -- FamilyLife, MoneyMate, CareMate, DriveSafe, etc.
    remind_at TIMESTAMPTZ NOT NULL,
    recurrence TEXT DEFAULT 'Once' CHECK (recurrence IN ('Once', 'Daily', 'Weekly', 'Monthly')),
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    confirmed BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb, -- e.g. amount for fee/rent, dosage for medicine
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CALENDAR & SCHEDULE
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    module TEXT DEFAULT 'Smart Planner',
    location TEXT,
    meeting_url TEXT,
    attendees JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROMISE TRACKER & ESCALATIONS (PromiseOS)
CREATE TABLE IF NOT EXISTS public.promises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('PROMISED_BY_ME', 'WAITING_FOR')),
    target_person TEXT NOT NULL, -- Rahul, Investor, Delivery Manager
    promise_text TEXT NOT NULL,
    due_date TIMESTAMPTZ,
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Fulfilled', 'Overdue', 'Escalated')),
    escalation_sent BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'Voice Command',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI MEMORY & NOTES (MemoryOS)
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category TEXT DEFAULT 'Notes', -- Notes, Meeting, Decision, Trip, Family
    tags TEXT[] DEFAULT '{}',
    source TEXT DEFAULT 'Voice Note',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SAFECIRCLE & SAFETY CENTER
CREATE TABLE IF NOT EXISTS public.safety_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    relation TEXT,
    is_emergency_priority BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.safety_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mode TEXT DEFAULT 'Women Safety', -- Women Safety, DriveSafe, SafeWalk
    destination_name TEXT,
    destination_lat DOUBLE PRECISION,
    destination_lng DOUBLE PRECISION,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'SOS_Triggered', 'Missed_Checkin')),
    start_time TIMESTAMPTZ DEFAULT NOW(),
    expected_arrival TIMESTAMPTZ,
    last_latitude DOUBLE PRECISION,
    last_longitude DOUBLE PRECISION,
    sos_reason TEXT
);

-- 10. AI CALLING ASSISTANT
CREATE TABLE IF NOT EXISTS public.call_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    phone_or_user_id TEXT NOT NULL,
    call_channel TEXT NOT NULL CHECK (call_channel IN ('WhatsApp', 'PhoneDialer', 'AiviraVoIP')),
    status TEXT DEFAULT 'Completed' CHECK (status IN ('Scheduled', 'Missed', 'Completed', 'Rejected')),
    duration_seconds INT DEFAULT 0,
    scheduled_for TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FCM DEVICE NOTIFICATION TOKENS
CREATE TABLE IF NOT EXISTS public.device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_token TEXT NOT NULL,
    device_type TEXT DEFAULT 'android',
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, device_token)
);

-- Row Level Security (RLS) Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- Helper function for auto timestamp update
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profiles ON public.profiles;
CREATE TRIGGER trigger_update_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
