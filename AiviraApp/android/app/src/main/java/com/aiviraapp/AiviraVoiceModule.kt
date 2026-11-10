package com.aiviraapp

import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.util.Base64
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.File
import java.io.FileOutputStream
import java.util.Locale

class AiviraVoiceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), TextToSpeech.OnInitListener {

    private var mediaPlayer: MediaPlayer? = null
    private var textToSpeech: TextToSpeech? = null
    private var speechRecognizer: SpeechRecognizer? = null
    private var isTtsReady = false
    private val mainHandler = Handler(Looper.getMainLooper())

    init {
        mainHandler.post {
            initTts()
        }
    }

    private fun initTts() {
        try {
            textToSpeech = TextToSpeech(reactContext.applicationContext, this)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun getName(): String = "AiviraVoice"

    private fun sendEvent(eventName: String, params: WritableMap?) {
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (_: Exception) {}
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            textToSpeech?.let {
                val langResult = it.setLanguage(Locale("hi", "IN"))
                if (langResult == TextToSpeech.LANG_MISSING_DATA || langResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                    it.setLanguage(Locale("en", "IN"))
                }
                it.setSpeechRate(0.95f)
                it.setPitch(1.0f)
            }
            isTtsReady = true
        }
    }

    @ReactMethod
    fun startListening(language: String, promise: Promise) {
        mainHandler.post {
            try {
                if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
                    promise.reject("STT_NOT_AVAILABLE", "Speech recognition is not available on this device")
                    return@post
                }

                speechRecognizer?.destroy()
                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext).apply {
                    setRecognitionListener(object : RecognitionListener {
                        override fun onReadyForSpeech(params: Bundle?) {
                            val map = Arguments.createMap().apply {
                                putString("status", "ready")
                            }
                            sendEvent("onSpeechStart", map)
                        }

                        override fun onBeginningOfSpeech() {}
                        override fun onRmsChanged(rmsdB: Float) {}
                        override fun onBufferReceived(buffer: ByteArray?) {}
                        override fun onEndOfSpeech() {}

                        override fun onError(error: Int) {
                            val errMsg = when (error) {
                                SpeechRecognizer.ERROR_NO_MATCH -> "No speech detected. Please speak clearly."
                                SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "Speech timeout. Please try again."
                                SpeechRecognizer.ERROR_AUDIO -> "Audio recording error."
                                SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Microphone permission required."
                                else -> "Speech recognition error: code $error"
                            }
                            val map = Arguments.createMap().apply {
                                putString("error", errMsg)
                                putInt("code", error)
                            }
                            sendEvent("onSpeechError", map)
                        }

                        override fun onResults(results: Bundle?) {
                            val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                            val transcript = if (!matches.isNullOrEmpty()) matches[0] else ""
                            val map = Arguments.createMap().apply {
                                putString("transcript", transcript)
                            }
                            sendEvent("onSpeechResults", map)
                        }

                        override fun onPartialResults(partialResults: Bundle?) {
                            val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                            if (!matches.isNullOrEmpty()) {
                                val map = Arguments.createMap().apply {
                                    putString("partial", matches[0])
                                }
                                sendEvent("onSpeechPartial", map)
                            }
                        }

                        override fun onEvent(eventType: Int, params: Bundle?) {}
                    })
                }

                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    val langTag = if (language.lowercase().contains("en")) "en-IN" else "hi-IN"
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, langTag)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, langTag)
                    putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                    putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
                }

                speechRecognizer?.startListening(intent)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("STT_START_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun stopListening() {
        mainHandler.post {
            try {
                speechRecognizer?.stopListening()
            } catch (_: Exception) {}
        }
    }

    @ReactMethod
    fun playBase64Audio(base64Audio: String, promise: Promise) {
        mainHandler.post {
            try {
                stopSpeaking()
                if (base64Audio.isEmpty()) {
                    promise.reject("EMPTY_AUDIO", "Audio base64 is empty")
                    return@post
                }
                val cleanBase64 = base64Audio.replace("\n", "").replace("\r", "").replace(" ", "").trim()
                val audioBytes = Base64.decode(cleanBase64, Base64.DEFAULT)
                if (audioBytes.size < 44) {
                    promise.reject("INVALID_AUDIO", "Audio bytes too small: " + audioBytes.size)
                    return@post
                }

                val tempFile = File(reactContext.cacheDir, "gnani_tts_current.wav")
                if (tempFile.exists()) tempFile.delete()
                FileOutputStream(tempFile).use { fos ->
                    fos.write(audioBytes)
                    fos.flush()
                }

                val mp = MediaPlayer()
                mediaPlayer = mp
                mp.setAudioAttributes(
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setLegacyStreamType(AudioManager.STREAM_MUSIC)
                        .build()
                )
                mp.setVolume(1.0f, 1.0f)
                mp.setDataSource(tempFile.absolutePath)
                mp.setOnPreparedListener { player ->
                    player.start()
                }
                mp.setOnCompletionListener { player ->
                    try { player.release() } catch (_: Exception) {}
                    if (mediaPlayer == player) mediaPlayer = null
                    promise.resolve(true)
                }
                mp.setOnErrorListener { player, what, extra ->
                    try { player.release() } catch (_: Exception) {}
                    if (mediaPlayer == player) mediaPlayer = null
                    promise.reject("PLAYBACK_ERROR", "MediaPlayer error: what=$what, extra=$extra")
                    true
                }
                mp.prepareAsync()
            } catch (e: Exception) {
                promise.reject("PLAYBACK_EXCEPTION", e.message, e)
            }
        }
    }

    @ReactMethod
    fun speak(text: String, lang: String, promise: Promise) {
        mainHandler.post {
            try {
                stopSpeaking()
                if (textToSpeech == null || !isTtsReady) {
                    textToSpeech = TextToSpeech(reactContext.applicationContext) { status ->
                        if (status == TextToSpeech.SUCCESS) {
                            isTtsReady = true
                            speakInternal(text, lang, promise)
                        } else {
                            promise.reject("TTS_INIT_FAILED", "Failed to init TextToSpeech")
                        }
                    }
                } else {
                    speakInternal(text, lang, promise)
                }
            } catch (e: Exception) {
                promise.reject("TTS_ERROR", e.message, e)
            }
        }
    }

    private fun speakInternal(text: String, lang: String, promise: Promise) {
        try {
            textToSpeech?.let { tts ->
                val locale = if (lang.lowercase().contains("en")) Locale("en", "IN") else Locale("hi", "IN")
                tts.setLanguage(locale)
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "aivira_tts_id")
                promise.resolve(true)
            } ?: run {
                promise.reject("TTS_NOT_READY", "TextToSpeech engine not initialized")
            }
        } catch (e: Exception) {
            promise.reject("TTS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun stopSpeaking() {
        mainHandler.post {
            try {
                mediaPlayer?.let {
                    if (it.isPlaying) {
                        it.stop()
                    }
                    it.release()
                    mediaPlayer = null
                }
                textToSpeech?.stop()
            } catch (_: Exception) {}
        }
    }
}
