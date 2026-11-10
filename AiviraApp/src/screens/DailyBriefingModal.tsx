import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface Props {
  onClose: () => void;
  onOpenVoice: (prompt: string) => void;
}

export const DailyBriefingModal: React.FC<Props> = ({ onClose, onOpenVoice }) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const priorities = [
    { title: "Rohan's school fee due in 5 days", module: 'FamilyLife', accent: '#F59E0B', icon: 'school' },
    { title: 'Team meeting at 11:00 AM', module: 'WorkMate', accent: '#7652EB', icon: 'people' },
    { title: 'Doctor appointment at 4:00 PM', module: 'CareMate', accent: '#10B981', icon: 'medical' },
  ];

  const schedule = [
    { time: '9:00 AM', title: 'Team Meeting', module: 'WorkMate' },
    { time: '12:30 PM', title: 'Lunch with Rohan', module: 'ConnectAI' },
    { time: '4:00 PM', title: 'Project Review', module: 'WorkMate' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerTextCol}>
          <Text style={[styles.greetingText, { fontSize: rf(isSmall ? 16 : 18) }]}>Good morning, Priya!</Text>
          <Text style={[styles.subText, { fontSize: rf(isSmall ? 11 : 12) }]}>Here's your daily briefing</Text>
        </View>
        <TouchableOpacity 
          style={styles.voicePlayBtn}
          onPress={() => onOpenVoice("Read my daily briefing aloud")}
        >
          <Ionicons name="volume-high" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Top Priorities Section */}
        <View style={styles.sectionRow}>
          <Ionicons name="flag" size={18} color={Colors.primary} />
          <Text style={styles.sectionHeading}>Top Priorities</Text>
        </View>

        <View style={styles.prioritiesCard}>
          {priorities.map((item, idx) => (
            <View key={idx} style={[styles.priorityItemRow, idx > 0 && styles.priorityBorderTop]}>
              <View style={[styles.priorityIconCircle, { backgroundColor: `${item.accent}15` }]}>
                <Ionicons name={item.icon as any} size={18} color={item.accent} />
              </View>
              <View style={styles.priorityTextCol}>
                <Text style={styles.priorityTitle}>{item.title}</Text>
                <Text style={styles.priorityModule}>{item.module}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </View>
          ))}
        </View>

        {/* Today's Schedule Section */}
        <View style={[styles.sectionRow, { marginTop: 20 }]}>
          <Ionicons name="calendar" size={18} color="#3B82F6" />
          <Text style={styles.sectionHeading}>Today's Schedule</Text>
        </View>

        <View style={styles.scheduleCard}>
          {schedule.map((item, idx) => (
            <View key={idx} style={[styles.scheduleItemRow, idx > 0 && styles.priorityBorderTop]}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              <View style={styles.scheduleTextCol}>
                <Text style={styles.scheduleTitle}>{item.title}</Text>
                <Text style={styles.scheduleModule}>{item.module}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contextual Suggestion Banner */}
        <View style={styles.suggestionBanner}>
          <Ionicons name="sparkles" size={20} color={Colors.primary} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.suggestionTitle}>Intelligent Suggestion</Text>
            <Text style={styles.suggestionText}>
              You have a 1.5-hour free slot between 10:30 AM and 12:00 PM. Would you like to review the client presentation draft?
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Dismiss Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.startDayBtn}
          onPress={onClose}
        >
          <Text style={styles.startDayBtnText}>Start My Day</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  backBtn: {
    paddingRight: 12,
  },
  headerTextCol: {
    flex: 1,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  subText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  voicePlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  prioritiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  priorityItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  priorityBorderTop: {
    borderTopWidth: 1,
    borderTopColor: '#F8F8FC',
  },
  priorityIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  priorityTextCol: {
    flex: 1,
  },
  priorityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  priorityModule: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  scheduleItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  scheduleTime: {
    width: 76,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  scheduleTextCol: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  scheduleModule: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  suggestionBanner: {
    flexDirection: 'row',
    backgroundColor: '#F3EEFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6DEFC',
    padding: 14,
    gap: 10,
    marginTop: 20,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 12,
    color: Colors.primaryText,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0EEF8',
  },
  startDayBtn: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startDayBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

