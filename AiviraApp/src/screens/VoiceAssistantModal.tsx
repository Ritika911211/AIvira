import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { VoiceWaveform } from '../components/VoiceWaveform';
import { VoiceAgentService, VoiceActionResult } from '../services/voiceAgent';
import { SpeechPlayer } from '../services/speechPlayer';
import { useResponsive } from '../utils/responsive';

interface Props {
  initialPrompt?: string;
  onClose: () => void;
  onActionComplete: (result: VoiceActionResult) => void;
}

export const VoiceAssistantModal: React.FC<Props> = ({
  initialPrompt,
  onClose,
  onActionComplete,
}) => {
  const { isSmall, rf, width, horizontalPadding } = useResponsive();
  const [transcript, setTranscript] = useState(initialPrompt || '');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionResult, setActionResult] = useState<VoiceActionResult | null>(null);
  const [listeningTimer, setListeningTimer] = useState(0);

  const timerRef = useRef<any>(null);

  const orbSize = isSmall ? 120 : Math.min(width * 0.38, 160);
  const innerOrbSize = orbSize - 36;

  // Suggested quick prompts matching the Master Prompt scenarios
  const promptScenarios = [
    {
      label: 'Website Delegation (WorkMate)',
      text: 'Kal Rahul ko website deployment ka task dena aur Friday ko progress check karna',
      icon: 'briefcase-outline',
      accent: '#7652EB',
    },
    {
      label: 'Papa Medicine Routine (CareMate)',
      text: 'Papa ki medicine subah 8 aur raat 9 baje yaad dilana',
      icon: 'medical-outline',
      accent: '#EF4444',
    },
    {
      label: 'School Fee Reminder (FamilyLife)',
      text: 'Rohan ki school fee 15 December ko due hai, 5 din pehle remind karna',
      icon: 'people-outline',
      accent: '#F59E0B',
    },
    {
      label: 'Call Reminder (ConnectAI)',
      text: 'Set a reminder to call mom tomorrow at 7 PM',
      icon: 'call-outline',
      accent: '#10B981',
    },
    {
      label: 'Emergency SOS (SafeCircle)',
      text: 'SOS emergency alert trusted contacts ko live location bhej do',
      icon: 'warning-outline',
      accent: '#DC2626',
    },
  ];

  const handleExecuteCommand = async (commandText: string) => {
    if (!commandText.trim()) return;
    setTranscript(commandText.trim());
    setIsProcessing(true);
    setIsListening(false);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const result = await VoiceAgentService.processVoiceInput(commandText.trim());
      setActionResult(result);
      onActionComplete(result);
      if (result && result.replyText) {
        SpeechPlayer.playOrSpeak(result.replyText, result.audioBase64);
      }
    } catch (err) {
      console.warn('Voice command execution failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartListening = async () => {
    setIsListening(true);
    setActionResult(null);
    setTranscript('Listening... Speak now in Hindi, English or Hinglish');
    setListeningTimer(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setListeningTimer(prev => prev + 1);
    }, 1000);

    await SpeechPlayer.startListening('hi-IN', {
      onStart: () => {
        setTranscript('Listening... Speak your command now');
      },
      onPartial: (partial) => {
        if (partial) {
          setTranscript(`"${partial}"`);
        }
      },
      onResults: (actualSpokenWords) => {
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (actualSpokenWords && actualSpokenWords.trim()) {
          setTranscript(`"${actualSpokenWords}"`);
          handleExecuteCommand(actualSpokenWords.trim());
        }
      },
      onError: (errMsg) => {
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setTranscript(errMsg || 'No speech detected. Tap microphone orb to try again or type below.');
      },
    });
  };

  const handleStopListening = () => {
    setIsListening(false);
    if (timerRef.current) clearInterval(timerRef.current);
    SpeechPlayer.stopListening();
  };

  const handleClose = () => {
    SpeechPlayer.stopListening();
    SpeechPlayer.stop();
    onClose();
  };

  useEffect(() => {
    if (initialPrompt) {
      handleExecuteCommand(initialPrompt);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      SpeechPlayer.stopListening();
    };
  }, [initialPrompt]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity 
          onPress={() => {
            SpeechPlayer.stop();
            onClose();
          }} 
          style={styles.closeBtn}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.listeningBadge}>
          <View style={[styles.listeningDot, isListening && styles.listeningDotActive]} />
          <Text style={styles.listeningText}>
            {isListening ? `Listening (${listeningTimer}s)...` : isProcessing ? 'AI Processing...' : 'Aivira Voice Agent'}
          </Text>
        </View>
        <View style={styles.engineBadge}>
          <Text style={styles.engineBadgeText}>Gnani + Gemini</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Animated Central Waveform Orb Area */}
        <View style={[styles.centerOrbArea, isSmall && { marginVertical: 8 }]}>
          <TouchableOpacity
            style={[styles.waveformGlowContainer, { width: orbSize, height: orbSize, borderRadius: orbSize / 2 }]}
            onPress={isListening ? handleStopListening : handleStartListening}
            activeOpacity={0.85}
          >
            <View style={[styles.innerOrbCircle, { width: innerOrbSize, height: innerOrbSize, borderRadius: innerOrbSize / 2 }]}>
              <VoiceWaveform isActive={isListening || isProcessing} barCount={isSmall ? 14 : 18} barColor={isListening ? '#10B981' : Colors.primary} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.tapOrbHint, { fontSize: rf(isSmall ? 11 : 12) }]}>
            {isListening ? 'Listening... Tap orb to submit speech' : 'Tap the microphone orb to speak'}
          </Text>
        </View>

        {/* Live Transcription Box */}
        <View style={[styles.transcriptBox, isSmall && { marginBottom: 12 }]}>
          <View style={styles.transcriptionHeader}>
            <Ionicons name="mic-outline" size={14} color={Colors.primary} />
            <Text style={styles.transcriptLabel}>LIVE TRANSCRIPTION (GNANI PRISMA STT)</Text>
          </View>
          <Text style={[styles.transcriptText, { fontSize: rf(isSmall ? 14 : 16) }]}>
            {transcript || 'Speak or type any command below in Hindi, English, or Hinglish.'}
          </Text>
        </View>

        {/* Loading Spinner */}
        {isProcessing && (
          <View style={styles.processingCard}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.processingText}>Processing with Gemini & Gnani Timbre...</Text>
          </View>
        )}

        {/* Action Result Card */}
        {actionResult && !isProcessing && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeaderRow}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.resultHeading}>
                {actionResult.isLiveAi ? 'Gemini AI Verified' : 'Aivira Smart Action'}
              </Text>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{actionResult.category}</Text>
              </View>
            </View>

            <Text style={[styles.resultReply, { fontSize: rf(isSmall ? 12.5 : 13.5) }]}>
              {actionResult.replyText}
            </Text>

            {/* Gnani Voice Synthesized Indicator & Replay */}
            <TouchableOpacity
              style={styles.ttsBadge}
              onPress={() => {
                if (actionResult.replyText) {
                  SpeechPlayer.playOrSpeak(actionResult.replyText, actionResult.audioBase64);
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="volume-high" size={16} color="#065F46" />
              <Text style={styles.ttsBadgeText}>
                {actionResult.audioBase64 ? 'Gnani Timbre Voice (Tap to Replay 🔊)' : 'Aivira Voice (Tap to Replay 🔊)'}
              </Text>
            </TouchableOpacity>

            {/* Created Tasks List */}
            {actionResult.createdTasks && actionResult.createdTasks.length > 0 && (
              <View style={styles.subActionBlock}>
                <Text style={styles.subActionLabel}>TASKS CREATED IN SUPABASE:</Text>
                {actionResult.createdTasks.map(t => (
                  <View key={t.id} style={styles.taskItemRow}>
                    <Ionicons name="checkbox-outline" size={15} color={Colors.primary} />
                    <Text style={styles.subActionValue}>{t.title} ({t.priority})</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Created Reminders List */}
            {actionResult.createdReminders && actionResult.createdReminders.length > 0 && (
              <View style={styles.subActionBlock}>
                <Text style={styles.subActionLabel}>REMINDERS SCHEDULED IN SUPABASE:</Text>
                {actionResult.createdReminders.map(r => (
                  <View key={r.id} style={styles.taskItemRow}>
                    <Ionicons name="alarm-outline" size={15} color="#F59E0B" />
                    <Text style={styles.subActionValue}>{r.title} ?" {r.time}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Quick Scenario Pills */}
        <Text style={[styles.scenarioHeading, { fontSize: rf(isSmall ? 13 : 14.5) }]}>
          Try Common Scenarios (Hindi / Hinglish / English):
        </Text>
        <View style={styles.scenariosGrid}>
          {promptScenarios.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.scenarioPill}
              onPress={() => handleExecuteCommand(item.text)}
              activeOpacity={0.75}
            >
              <View style={[styles.scenarioIconBox, { backgroundColor: `${item.accent}15` }]}>
                <Ionicons name={item.icon as any} size={18} color={item.accent} />
              </View>
              <View style={styles.scenarioTextCol}>
                <Text style={styles.scenarioLabel}>{item.label}</Text>
                <Text style={styles.scenarioText} numberOfLines={1}>{item.text}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Text Input Bar */}
      <View style={styles.bottomInputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type instruction in Hindi, English, Hinglish..."
          placeholderTextColor="#9CA3AF"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => {
            if (inputText.trim()) {
              handleExecuteCommand(inputText.trim());
              setInputText('');
            }
          }}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && { opacity: 0.6 }]}
          onPress={() => {
            if (inputText.trim()) {
              handleExecuteCommand(inputText.trim());
              setInputText('');
            }
          }}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    padding: 6,
  },
  listeningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  listeningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  listeningDotActive: {
    backgroundColor: '#10B981',
  },
  listeningText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  engineBadge: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  engineBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centerOrbArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  waveformGlowContainer: {
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E6DEFC',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  innerOrbCircle: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapOrbHint: {
    color: '#77758A',
    fontWeight: '600',
    marginTop: 8,
  },
  transcriptBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    marginBottom: 14,
  },
  transcriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  transcriptLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  transcriptText: {
    fontWeight: '700',
    color: Colors.primaryText,
    lineHeight: 22,
  },
  processingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F6FF',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  processingText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E8E1FF',
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 18,
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  resultHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryText,
    flex: 1,
  },
  categoryPill: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  resultReply: {
    color: Colors.primaryText,
    lineHeight: 20,
    marginBottom: 8,
  },
  ttsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  ttsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  subActionBlock: {
    backgroundColor: '#F8F8FC',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    gap: 6,
  },
  subActionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.4,
  },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subActionValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  scenarioHeading: {
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 10,
  },
  scenariosGrid: {
    gap: 8,
  },
  scenarioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    gap: 10,
  },
  scenarioIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioTextCol: {
    flex: 1,
  },
  scenarioLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  scenarioText: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  bottomInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0EEF8',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8F8FC',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 13,
    color: Colors.primaryText,
    borderWidth: 1,
    borderColor: '#F0EEF8',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
