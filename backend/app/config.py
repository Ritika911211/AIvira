"""
Aivira AI Operating System - Backend Configuration
Supports Google Gemini, Gnani Prisma v2.5 STT, Gnani Timbre v2.5 TTS,
Supabase PostgreSQL & Auth, Firebase Cloud Messaging, and Agora (reserved).
"""
import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "Aivira AI Operating System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # 1. Google Gemini API
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.5-flash"
    
    # 2. Gnani AI (Prisma v2.5 STT & Timbre v2.5 TTS)
    GNANI_API_KEY: Optional[str] = None
    GNANI_STT_URL: str = "https://api.vachana.ai/stt/v3"
    GNANI_TTS_URL: str = "https://api.vachana.ai/api/v1/tts/sse"
    GNANI_TTS_MODEL: str = "timbre-v2.5"
    GNANI_TTS_DEFAULT_VOICE: str = "Nalini" # Available: Nalini, Deepak, Bhavna, Vikrant, etc.
    
    # 3. Supabase / PostgreSQL
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"
    SUPABASE_URL: Optional[str] = "https://grbopzrunuydwbyqkjgm.supabase.co"
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    
    # 4. Firebase Cloud Messaging (FCM)
    FIREBASE_PROJECT_ID: str = "AiVira"
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_SERVICE_ACCOUNT_FILE: Optional[str] = None
    
    # 5. Agora (Reserved for Future Calling Module)
    AGORA_APP_ID: Optional[str] = None
    AGORA_APP_CERTIFICATE: Optional[str] = None
    
    # Security
    JWT_SECRET: str = "aivira-secret-key-super-secure-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
