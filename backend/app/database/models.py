import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database.supabase import Base

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    active_persona = Column(String, default="Professional")
    preferred_language = Column(String, default="Hinglish")
    voice_enabled = Column(Boolean, default=True)
    auto_driving_mode = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), nullable=True)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    assigned_to = Column(UUID(as_uuid=True), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    module = Column(String, default="WorkMate")
    priority = Column(String, default="Medium")
    status = Column(String, default="Pending")
    due_date = Column(DateTime, nullable=True)
    extracted_from_voice = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), nullable=True)
    profile_id = Column(UUID(as_uuid=True), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    module = Column(String, nullable=False)
    remind_at = Column(DateTime, nullable=False)
    recurrence = Column(String, default="Once")
    priority = Column(String, default="Medium")
    confirmed = Column(Boolean, default=False)
    is_sent = Column(Boolean, default=False)
    metadata_ = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class Memory(Base):
    __tablename__ = "memories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), nullable=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    summary = Column(String, nullable=True)
    category = Column(String, default="Notes")
    source = Column(String, default="Voice Note")
    created_at = Column(DateTime, default=datetime.utcnow)

class DeviceToken(Base):
    __tablename__ = "device_tokens"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), nullable=True)
    device_token = Column(String, nullable=False)
    device_type = Column(String, default="android")
    is_active = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=datetime.utcnow)

