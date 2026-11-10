"""
Gnani Prisma v2.5 - Speech-to-Text (STT) Integration
Endpoint: POST https://api.vachana.ai/stt/v3
Header: X-API-Key-ID
Supported Languages: Hindi (hi-IN), Indian English (en-IN), Hinglish
"""
import logging
from typing import Dict, Any, Optional
import httpx
from app.config import settings

logger = logging.getLogger("aivira.speech.stt")

class PrismaSTTService:
    def __init__(self, api_key: Optional[str] = None, endpoint_url: Optional[str] = None):
        self.api_key = api_key or settings.GNANI_API_KEY
        self.endpoint_url = endpoint_url or settings.GNANI_STT_URL

    async def transcribe(
        self,
        audio_bytes: bytes,
        filename: str = "audio.wav",
        content_type: str = "audio/wav",
        language_code: str = "hi-IN"
    ) -> Dict[str, Any]:
        """
        Transcribes speech using Gnani Prisma v2.5 API.
        """
        if not self.api_key:
            logger.warning("GNANI_API_KEY not configured. Returning simulation transcript.")
            return {
                "success": True,
                "transcript": "Kal Rahul ko website deployment ka task dena aur Friday ko progress check karna.",
                "confidence": 0.95,
                "language_code": language_code,
                "is_simulated": True
            }

        headers = {
            "X-API-Key-ID": self.api_key
        }
        
        files = {
            "audio_file": (filename, audio_bytes, content_type)
        }
        data = {
            "language_code": language_code
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.endpoint_url,
                    headers=headers,
                    files=files,
                    data=data
                )
                
                if response.status_code == 200:
                    result = response.json()
                    transcript = result.get("transcript", "").strip()
                    logger.info(f"Gnani Prisma STT transcription succeeded: {transcript[:50]}")
                    return {
                        "success": True,
                        "transcript": transcript,
                        "request_id": result.get("request_id"),
                        "language_code": language_code,
                        "is_simulated": False
                    }
                else:
                    logger.error(f"Gnani STT returned status {response.status_code}: {response.text}")
                    return {
                        "success": False,
                        "error": f"Gnani STT API error {response.status_code}: {response.text}",
                        "transcript": ""
                    }
        except Exception as e:
            logger.error(f"Gnani Prisma STT request exception: {e}")
            return {
                "success": False,
                "error": str(e),
                "transcript": ""
            }

prisma_stt_service = PrismaSTTService()

