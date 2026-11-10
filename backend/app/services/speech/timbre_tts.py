"""
Gnani Timbre v2.5 - Text-to-Speech (TTS) Integration
Endpoint: POST https://api.vachana.ai/api/v1/tts/sse
Header: X-API-Key-ID
Supported Voices: Nalini, Bhavna, Yashvi, Deepak, Roopesh, Vikrant, Hemraj, etc.
Supported Models: timbre-v2.5, timbre-v3.0
"""
import json
import base64
import io
import wave
import logging
from typing import Dict, Any, Optional, AsyncGenerator
import httpx
from app.config import settings

logger = logging.getLogger("aivira.speech.tts")

class TimbreTTSService:
    def __init__(self, api_key: Optional[str] = None, endpoint_url: Optional[str] = None):
        self.api_key = api_key or settings.GNANI_API_KEY
        self.endpoint_url = endpoint_url or settings.GNANI_TTS_URL
        self.default_model = settings.GNANI_TTS_MODEL
        self.default_voice = settings.GNANI_TTS_DEFAULT_VOICE

    async def synthesize(
        self,
        text: str,
        voice: Optional[str] = None,
        language: str = "hi",
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Synthesizes text into audio using Gnani Timbre v2.5.
        Collects all SSE PCM audio chunks, packages them into a valid standard
        16-bit mono 16kHz RIFF/WAVE container, and returns clean base64 audio.
        """
        if not self.api_key:
            logger.warning("GNANI_API_KEY not set. Returning simulation TTS.")
            return {
                "success": True,
                "audio_base64": "",
                "format": "wav",
                "is_simulated": True
            }

        headers = {
            "X-API-Key-ID": self.api_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model or self.default_model,
            "voice": voice or self.default_voice,
            "text": text,
            "language": language
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.endpoint_url,
                    headers=headers,
                    json=payload
                )

                if response.status_code == 200:
                    all_pcm = bytearray()
                    for line in response.text.splitlines():
                        if line.startswith("data:"):
                            raw_json = line[5:].strip()
                            if raw_json:
                                try:
                                    item = json.loads(raw_json)
                                    chunk = item.get("audio", "")
                                    if chunk:
                                        all_pcm.extend(base64.b64decode(chunk))
                                except Exception:
                                    continue
                    
                    if all_pcm:
                        # Pack into standard RIFF WAVE container (16kHz, 16-bit mono)
                        wav_io = io.BytesIO()
                        with wave.open(wav_io, "wb") as wf:
                            wf.setnchannels(1)
                            wf.setsampwidth(2)
                            wf.setframerate(16000)
                            wf.writeframes(all_pcm)

                        valid_wav_bytes = wav_io.getvalue()
                        valid_b64 = base64.b64encode(valid_wav_bytes).decode("utf-8")
                        logger.info(f"Gnani Timbre TTS generated valid WAV ({len(valid_wav_bytes)} bytes) for text: {text[:40]}")
                        
                        return {
                            "success": True,
                            "audio_base64": valid_b64,
                            "audio_format": "wav",
                            "voice": payload["voice"],
                            "model": payload["model"],
                            "is_simulated": False
                        }
                    else:
                        logger.warning("No audio chunks received in Gnani SSE response")
                        return {
                            "success": False,
                            "error": "Empty audio chunks received",
                            "audio_base64": ""
                        }
                else:
                    logger.error(f"Gnani TTS returned {response.status_code}: {response.text}")
                    return {
                        "success": False,
                        "error": f"Gnani TTS error {response.status_code}: {response.text}",
                        "audio_base64": ""
                    }
        except Exception as e:
            logger.error(f"Gnani Timbre TTS exception: {e}")
            return {
                "success": False,
                "error": str(e),
                "audio_base64": ""
            }

    async def stream_synthesize(
        self,
        text: str,
        voice: Optional[str] = None,
        language: str = "hi"
    ) -> AsyncGenerator[str, None]:
        """
        Pass-through streaming generator for real-time SSE audio streaming to mobile clients.
        """
        headers = {
            "X-API-Key-ID": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.default_model,
            "voice": voice or self.default_voice,
            "text": text,
            "language": language
        }
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            async with client.stream("POST", self.endpoint_url, headers=headers, json=payload) as response:
                async for chunk in response.aiter_text():
                    yield chunk

timbre_tts_service = TimbreTTSService()
