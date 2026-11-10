import { NativeModules, Platform, DeviceEventEmitter, PermissionsAndroid } from 'react-native';

const { AiviraVoice } = NativeModules;

export interface SpeechListenerHandlers {
  onStart?: () => void;
  onPartial?: (partialText: string) => void;
  onResults?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export const SpeechPlayer = {
  /**
   * Request microphone permission on Android
   */
  async requestMicPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Aivira Microphone Permission',
          message: 'Aivira needs access to your microphone to listen to your voice commands.',
          buttonPositive: 'Allow',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  },

  /**
   * Start listening to the user's real voice through device microphone
   */
  async startListening(
    language: string = 'hi-IN',
    handlers: SpeechListenerHandlers
  ): Promise<boolean> {
    if (Platform.OS !== 'android' || !AiviraVoice) {
      console.warn('[SpeechPlayer] Native AiviraVoice not available.');
      return false;
    }

    const hasPermission = await this.requestMicPermission();
    if (!hasPermission) {
      handlers.onError?.('Microphone permission was denied.');
      return false;
    }

    // Remove any existing listeners
    DeviceEventEmitter.removeAllListeners('onSpeechStart');
    DeviceEventEmitter.removeAllListeners('onSpeechPartial');
    DeviceEventEmitter.removeAllListeners('onSpeechResults');
    DeviceEventEmitter.removeAllListeners('onSpeechError');

    // Subscribe to native speech events
    if (handlers.onStart) {
      DeviceEventEmitter.addListener('onSpeechStart', () => {
        handlers.onStart?.();
      });
    }

    if (handlers.onPartial) {
      DeviceEventEmitter.addListener('onSpeechPartial', (e: { partial: string }) => {
        handlers.onPartial?.(e.partial || '');
      });
    }

    if (handlers.onResults) {
      DeviceEventEmitter.addListener('onSpeechResults', (e: { transcript: string }) => {
        handlers.onResults?.(e.transcript || '');
      });
    }

    if (handlers.onError) {
      DeviceEventEmitter.addListener('onSpeechError', (e: { error: string }) => {
        handlers.onError?.(e.error || 'Speech error');
      });
    }

    try {
      await AiviraVoice.startListening(language);
      return true;
    } catch (err: any) {
      console.warn('[SpeechPlayer] Failed to start native speech recognizer:', err);
      handlers.onError?.(err?.message || 'Failed to start speech recognition');
      return false;
    }
  },

  /**
   * Stop listening
   */
  stopListening(): void {
    if (Platform.OS === 'android' && AiviraVoice) {
      try {
        AiviraVoice.stopListening();
      } catch {}
    }
  },

  /**
   * Plays the audio through the phone speaker:
   * 1. If base64 audio from Gnani Timbre TTS is present, plays through Android MediaPlayer.
   * 2. Otherwise speaks the text aloud using the device's native Hindi/English Text-To-Speech engine.
   */
  async playOrSpeak(text: string, audioBase64?: string): Promise<boolean> {
    if (Platform.OS !== 'android' || !AiviraVoice) {
      console.log('[SpeechPlayer] Native AiviraVoice module not available.');
      return false;
    }

    try {
      if (audioBase64 && audioBase64.length > 500) {
        console.log(`[SpeechPlayer] Playing Gnani Timbre audio (${audioBase64.length} chars)`);
        await AiviraVoice.playBase64Audio(audioBase64);
        return true;
      }
    } catch (e) {
      console.warn('[SpeechPlayer] Gnani audio playback error, falling back to system TTS:', e);
    }

    // Fallback to native device TextToSpeech
    if (text && text.trim()) {
      try {
        console.log(`[SpeechPlayer] Speaking text aloud via native TTS: "${text.substring(0, 40)}..."`);
        await AiviraVoice.speak(text.trim(), 'hi');
        return true;
      } catch (err) {
        console.warn('[SpeechPlayer] Native TTS speech failed:', err);
      }
    }

    return false;
  },

  /**
   * Stop any active speech or audio playback
   */
  stop(): void {
    if (Platform.OS === 'android' && AiviraVoice) {
      try {
        AiviraVoice.stopSpeaking();
      } catch {}
    }
  },
};
