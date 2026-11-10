/**
 * Aivira API Client
 * Connects React Native frontend to FastAPI Backend:
 * - Google Gemini AI Assistant (/api/v1/assistant/chat)
 * - Gnani Prisma STT & Timbre TTS (/api/v1/speech/*)
 * - Supabase Tasks & Reminders synchronization (/api/tasks, /api/reminders)
 * - Firebase Push Notification Device Registration (/api/v1/notifications/*)
 */
import { Platform } from 'react-native';

// Candidate backend addresses to check in order:
// 1. localhost:8000 - Works on Android device via `adb reverse tcp:8000 tcp:8000` or iOS
// 2. 192.168.1.2:8000 - Host PC Wi-Fi LAN IP (works directly from phone on same Wi-Fi)
// 3. 10.0.2.2:8000 - Android Studio standard emulator loopback
const CANDIDATE_HOSTS = [
  'http://localhost:8000',
  'http://192.168.1.2:8000',
  'http://10.0.2.2:8000',
];

let cachedBaseUrl: string | null = null;

export interface ChatApiResponse {
  reply_text: string;
  intent: string;
  executed_actions: Array<{
    action_type: string;
    id: string;
    title: string;
    module: string;
    priority?: string;
    remind_at?: string;
  }>;
  model_used: string;
}

export interface VoiceApiResponse {
  transcript: string;
  reply_text: string;
  intent: string;
  executed_actions: any[];
  audio_base64?: string;
  audio_format?: string;
}

/**
 * Fetch with timeout using AbortController
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 3500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const ApiService = {
  /**
   * Discovers and caches the working backend base URL
   */
  async getActiveBaseUrl(): Promise<string> {
    if (cachedBaseUrl) {
      return cachedBaseUrl;
    }

    for (const host of CANDIDATE_HOSTS) {
      try {
        const res = await fetchWithTimeout(`${host}/health`, { method: 'GET' }, 1500);
        if (res.ok) {
          cachedBaseUrl = host;
          console.log(`[Aivira API] Connected to backend at: ${host}`);
          return host;
        }
      } catch {
        // Try next host
      }
    }

    // Default fallback
    return 'http://localhost:8000';
  },

  /**
   * Health check to test backend connectivity
   */
  async checkHealth(): Promise<boolean> {
    try {
      const base = await this.getActiveBaseUrl();
      const res = await fetchWithTimeout(`${base}/health`, { method: 'GET' }, 2000);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Text chat with Gemini Assistant & action execution in Supabase
   */
  async chat(message: string, persona: string = 'Professional'): Promise<ChatApiResponse> {
    const baseUrl = await this.getActiveBaseUrl();
    const url = `${baseUrl}/api/v1/assistant/chat`;
    
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          persona,
          language: 'Hinglish',
        }),
      },
      8000 // Allow up to 8s for Gemini reasoning
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Backend error (${response.status}): ${errText}`);
    }

    return await response.json();
  },

  /**
   * Synthesize natural speech audio with Gnani Timbre v2.5
   */
  async synthesizeSpeech(text: string, voice: string = 'Nalini', language: string = 'hi'): Promise<string> {
    try {
      const baseUrl = await this.getActiveBaseUrl();
      const res = await fetchWithTimeout(
        `${baseUrl}/api/v1/speech/synthesize`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice,
            language,
            model: 'timbre-v2.5',
          }),
        },
        7000
      );

      if (res.ok) {
        const data = await res.json();
        return data.audio_base64 || '';
      }
    } catch (e) {
      console.warn('[Aivira TTS] Request failed:', e);
    }
    return '';
  },

  /**
   * Transcribe speech using Gnani Prisma v2.5 STT
   */
  async transcribeAudio(audioBase64: string, languageCode: string = 'hi-IN'): Promise<string> {
    try {
      const baseUrl = await this.getActiveBaseUrl();
      const formData = new FormData();
      formData.append('audio_file', {
        uri: `data:audio/wav;base64,${audioBase64}`,
        name: 'recording.wav',
        type: 'audio/wav',
      } as any);
      formData.append('language_code', languageCode);

      const res = await fetchWithTimeout(
        `${baseUrl}/api/v1/speech/transcribe`,
        {
          method: 'POST',
          body: formData,
        },
        10000
      );

      if (res.ok) {
        const data = await res.json();
        return data.transcript || '';
      }
    } catch (e) {
      console.warn('[Aivira STT] Request failed:', e);
    }
    return '';
  },

  /**
   * Fetch all tasks directly from Supabase via backend
   */
  async fetchTasks(): Promise<any[]> {
    try {
      const baseUrl = await this.getActiveBaseUrl();
      const res = await fetchWithTimeout(`${baseUrl}/api/tasks`, {}, 3000);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  /**
   * Fetch all reminders directly from Supabase via backend
   */
  async fetchReminders(): Promise<any[]> {
    try {
      const baseUrl = await this.getActiveBaseUrl();
      const res = await fetchWithTimeout(`${baseUrl}/api/reminders`, {}, 3000);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  /**
   * Register FCM push device token
   */
  async registerDeviceToken(token: string): Promise<boolean> {
    try {
      const baseUrl = await this.getActiveBaseUrl();
      const res = await fetchWithTimeout(
        `${baseUrl}/api/v1/notifications/register-device`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_token: token, device_type: Platform.OS }),
        },
        4000
      );
      return res.ok;
    } catch {
      return false;
    }
  },
};
