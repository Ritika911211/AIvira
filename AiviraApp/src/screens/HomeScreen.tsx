import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { VoiceWaveform } from '../components/VoiceWaveform';
import { Persona, WorkspaceType, TaskItem, ReminderItem } from '../types';
import { useResponsive } from '../utils/responsive';

interface Props {
  persona: Persona;
  workspace: WorkspaceType;
  tasks: TaskItem[];
  reminders: ReminderItem[];
  onToggleTask: (id: string) => void;
  onOpenVoiceModal: (initialPrompt?: string) => void;
  onOpenDailyBriefing: () => void;
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<Props> = ({
  persona,
  workspace,
  tasks,
  reminders,
  onToggleTask,
  onOpenVoiceModal,
  onOpenDailyBriefing,
  onNavigate,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const { isSmall, rf, horizontalPadding } = useResponsive();

  const handleQuickSubmit = () => {
    if (quickInput.trim()) {
      onOpenVoiceModal(quickInput.trim());
      setQuickInput('');
    }
  };

  const pillWidth = isSmall ? '47.5%' : '48.2%';

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} 
      showsVerticalScrollIndicator={false}
    >
      {/* Central AI Voice Assistant Card (Purple Gradient) */}
      <View style={styles.voiceCardWrapper}>
        <LinearGradient
          colors={['#7652EB', '#8E6DF7', '#A78BFA']}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={[styles.voiceCard, { paddingVertical: isSmall ? 16 : 20 }]}
        >
          {/* Animated audio bars */}
          <VoiceWaveform isActive={true} barCount={isSmall ? 14 : 18} barColor="#FFFFFFEE" />

          <Text style={[styles.voicePromptText, { fontSize: rf(isSmall ? 16 : 18) }]}>
            How can I help you today?
          </Text>

          {/* Central Microphone button */}
          <TouchableOpacity 
            style={[styles.micCircleButton, isSmall && { width: 54, height: 54, borderRadius: 27 }]}
            onPress={() => onOpenVoiceModal()}
            activeOpacity={0.85}
          >
            <Ionicons name="mic" size={isSmall ? 24 : 28} color={Colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.tapToTalkHint, { fontSize: rf(isSmall ? 11 : 12) }]}>
            Tap to talk in Hindi, English or Hinglish
          </Text>
        </LinearGradient>
      </View>

      {/* Text Chat Quick Input Bar */}
      <View style={styles.quickInputBar}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.secondaryText} style={styles.chatIcon} />
        <TextInput
          style={[styles.quickTextInput, { fontSize: rf(isSmall ? 12.5 : 14) }]}
          placeholder="Ask Aivira or type an instruction..."
          placeholderTextColor="#9CA3AF"
          value={quickInput}
          onChangeText={setQuickInput}
          onSubmitEditing={handleQuickSubmit}
          returnKeyType="send"
        />
        {quickInput.length > 0 && (
          <TouchableOpacity onPress={handleQuickSubmit} style={styles.sendIconBtn}>
            <Ionicons name="arrow-up-circle" size={28} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Situation Intelligence Card (Signature Feature) */}
      <View style={styles.situationCard}>
        <View style={styles.situationBadgeRow}>
          <View style={styles.situationLiveTag}>
            <View style={styles.pulsingGreenDot} />
            <Text style={styles.situationTagText}>SITUATION INTELLIGENCE</Text>
          </View>
          <TouchableOpacity onPress={onOpenDailyBriefing}>
            <Text style={styles.viewBriefingLink}>Daily Briefing →</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.situationTitle, { fontSize: rf(isSmall ? 14 : 15.5) }]}>
          {persona === 'Delivery Executive' 
            ? 'Incoming Urgent Call from Delivery Manager'
            : persona === 'Parent' || persona === 'Student'
            ? "Rohan's school fee is due in 5 days"
            : persona === 'Startup Founder'
            ? 'Investor Pitch Deck Follow-up Due Today'
            : "Rohan's school fee is due in 5 days"}
        </Text>
        <Text style={[styles.situationSubtitle, { fontSize: rf(isSmall ? 11.5 : 12.5) }]}>
          {persona === 'Delivery Executive'
            ? 'DriveSafe mode active. Hands-free auto-reply available.'
            : '₹8,000 due on 15 Dec. Would you like an advance reminder?'}
        </Text>

        <View style={styles.situationActionsRow}>
          <TouchableOpacity 
            style={styles.situationPrimaryBtn}
            onPress={() => onNavigate(persona === 'Delivery Executive' ? 'DriveSafe' : 'FamilyLife')}
          >
            <Text style={[styles.situationBtnText, { fontSize: rf(isSmall ? 11 : 12) }]}>
              {persona === 'Delivery Executive' ? 'Open DriveSafe' : 'View in FamilyLife'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.situationSecondaryBtn}
            onPress={() => onOpenVoiceModal("Remind me before due date")}
          >
            <Text style={[styles.situationSecondaryBtnText, { fontSize: rf(isSmall ? 11 : 12) }]}>
              Remind 2 Days Before
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2x2 Quick Actions Grid */}
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={[styles.actionPill, { width: pillWidth }]} 
          onPress={() => onNavigate('Calling')}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: '#EBFBF5' }]}>
            <Ionicons name="call" size={17} color="#16A36A" />
          </View>
          <Text style={[styles.actionLabel, { fontSize: rf(isSmall ? 11.5 : 13) }]} numberOfLines={1}>
            Make a call
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionPill, { width: pillWidth }]} 
          onPress={() => onNavigate('Tasks')}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: '#F3EEFF' }]}>
            <Ionicons name="checkbox" size={17} color={Colors.primary} />
          </View>
          <Text style={[styles.actionLabel, { fontSize: rf(isSmall ? 11.5 : 13) }]} numberOfLines={1}>
            Add a task
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionPill, { width: pillWidth }]} 
          onPress={() => onNavigate('Planner')}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="calendar" size={17} color="#3B82F6" />
          </View>
          <Text style={[styles.actionLabel, { fontSize: rf(isSmall ? 11.5 : 13) }]} numberOfLines={1}>
            Check calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionPill, { width: pillWidth }]} 
          onPress={() => onNavigate('Safety')}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: '#FDF2F8' }]}>
            <Ionicons name="shield-checkmark" size={17} color="#EC4899" />
          </View>
          <Text style={[styles.actionLabel, { fontSize: rf(isSmall ? 11.5 : 13) }]} numberOfLines={1}>
            Start Safety
          </Text>
        </TouchableOpacity>
      </View>

      {/* Today's Highlights Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Today's Highlights</Text>
        <TouchableOpacity onPress={() => onNavigate('Modules')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.highlightsContainer}>
        {/* Highlight 1: Rohan's school fee */}
        <TouchableOpacity 
          style={styles.highlightCard} 
          onPress={() => onNavigate('FamilyLife')}
          activeOpacity={0.75}
        >
          <View style={[styles.highlightIconBox, { backgroundColor: '#FFF7ED' }]}>
            <Ionicons name="school" size={20} color="#F59E0B" />
          </View>
          <View style={styles.highlightTextContent}>
            <Text style={styles.highlightTitle}>Rohan's school fee due in 5 days</Text>
            <Text style={styles.highlightModule}>FamilyLife</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Highlight 2: Team meeting */}
        <TouchableOpacity 
          style={styles.highlightCard} 
          onPress={() => onNavigate('Planner')}
          activeOpacity={0.75}
        >
          <View style={[styles.highlightIconBox, { backgroundColor: '#F5F3FF' }]}>
            <Ionicons name="people" size={20} color="#7652EB" />
          </View>
          <View style={styles.highlightTextContent}>
            <Text style={styles.highlightTitle}>Team meeting at 11:00 AM</Text>
            <Text style={styles.highlightModule}>WorkMate</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Highlight 3: Take medicine */}
        <TouchableOpacity 
          style={styles.highlightCard} 
          onPress={() => onNavigate('CareMate')}
          activeOpacity={0.75}
        >
          <View style={[styles.highlightIconBox, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="medical" size={20} color="#10B981" />
          </View>
          <View style={styles.highlightTextContent}>
            <Text style={styles.highlightTitle}>Take medicine at 8:00 PM</Text>
            <Text style={styles.highlightModule}>CareMate</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Pending Tasks Quick Section */}
      <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
        <Text style={styles.sectionTitle}>Pending Tasks</Text>
        <TouchableOpacity onPress={() => onNavigate('Tasks')}>
          <Text style={styles.seeAllText}>View all ({tasks.length})</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tasksListContainer}>
        {tasks.slice(0, 3).map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskRowItem}
            onPress={() => onToggleTask(task.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={task.completed ? "checkbox" : "square-outline"}
              size={22}
              color={task.completed ? Colors.primary : "#9CA3AF"}
            />
            <View style={styles.taskTextColumn}>
              <Text style={[styles.taskTitleText, task.completed && styles.taskTitleCompleted]}>
                {task.title}
              </Text>
              <Text style={styles.taskMetaText}>
                {task.priority} • {task.time}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  voiceCardWrapper: {
    borderRadius: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 16,
  },
  voiceCard: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voicePromptText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 14,
  },
  micCircleButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  tapToTalkHint: {
    color: '#FFFFFFCC',
    fontSize: 12,
    fontWeight: '500',
  },
  quickInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  chatIcon: {
    marginRight: 8,
  },
  quickTextInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryText,
  },
  sendIconBtn: {
    paddingLeft: 6,
  },
  situationCard: {
    backgroundColor: '#F8F6FF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8E1FF',
    padding: 16,
    marginBottom: 20,
  },
  situationBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  situationLiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pulsingGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  situationTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  viewBriefingLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  situationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  situationSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    lineHeight: 17,
    marginBottom: 12,
  },
  situationActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  situationPrimaryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  situationBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  situationSecondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0D7FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  situationSecondaryBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  highlightsContainer: {
    gap: 10,
    marginBottom: 10,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  highlightIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  highlightTextContent: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  highlightModule: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  tasksListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  taskRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8FC',
  },
  taskTextColumn: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskMetaText: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
});

