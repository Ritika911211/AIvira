import React, { useState } from 'react';
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
import { CalendarEvent } from '../types';
import { useResponsive } from '../utils/responsive';

interface Props {
  calendarEvents: CalendarEvent[];
  onAddEvent: () => void;
}

export const PlannerScreen: React.FC<Props> = ({ calendarEvents, onAddEvent }) => {
  const [activeTab, setActiveTab] = useState<'Today' | 'Week' | 'Month'>('Today');
  const [selectedDate, setSelectedDate] = useState('Tue 15 Apr');
  const { isSmall, rf, horizontalPadding } = useResponsive();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <Text style={[styles.title, { fontSize: rf(isSmall ? 19 : 22) }]}>Smart Planner</Text>

        {/* Period Selector Tabs */}
        <View style={styles.tabContainer}>
          {(['Today', 'Week', 'Month'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabBtnText, { fontSize: rf(isSmall ? 11.5 : 13) }, activeTab === tab && styles.tabBtnTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Navigator */}
        <View style={styles.dateNavigatorRow}>
          <TouchableOpacity 
            style={styles.navArrow}
            onPress={() => setSelectedDate('Mon 14 Apr')}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.primaryText} />
          </TouchableOpacity>
          <Text style={[styles.dateLabel, { fontSize: rf(isSmall ? 13.5 : 15) }]}>{selectedDate}</Text>
          <TouchableOpacity 
            style={styles.navArrow}
            onPress={() => setSelectedDate('Wed 16 Apr')}
          >
            <Ionicons name="chevron-forward" size={20} color={Colors.primaryText} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Timeline Events */}
        <View style={styles.timelineList}>
          {calendarEvents.map((evt, idx) => (
            <View key={evt.id || idx} style={styles.eventRow}>
              {/* Time Indicator */}
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{evt.time}</Text>
              </View>

              {/* Event Card */}
              <TouchableOpacity
                style={styles.eventCard}
                onPress={() => Alert.alert(evt.title, `${evt.module} • Scheduled at ${evt.time}`)}
                activeOpacity={0.75}
              >
                <View style={[styles.cardDot, { backgroundColor: evt.color || Colors.primary }]} />
                <View style={styles.eventTextCol}>
                  <Text style={styles.eventTitle}>{evt.title}</Text>
                  <Text style={styles.eventModule}>{evt.module}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Free Slot Highlight Box */}
        <View style={styles.freeSlotBanner}>
          <View style={styles.freeSlotIconBox}>
            <Ionicons name="time" size={20} color={Colors.primary} />
          </View>
          <View style={styles.freeSlotTextCol}>
            <Text style={styles.freeSlotTitle}>Free slot available</Text>
            <Text style={styles.freeSlotTime}>10:30 AM - 12:00 PM</Text>
          </View>
          <TouchableOpacity 
            style={styles.quickScheduleBtn}
            onPress={onAddEvent}
          >
            <Text style={styles.quickScheduleBtnText}>Book Slot</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={onAddEvent}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  dateNavigatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  navArrow: {
    padding: 4,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
  },
  timelineList: {
    gap: 14,
    marginBottom: 18,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeColumn: {
    width: 72,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  eventCard: {
    flex: 1,
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
  cardDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  eventTextCol: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  eventModule: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  freeSlotBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6DEFC',
  },
  freeSlotIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  freeSlotTextCol: {
    flex: 1,
  },
  freeSlotTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  freeSlotTime: {
    fontSize: 12,
    color: Colors.primaryText,
    marginTop: 1,
  },
  quickScheduleBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  quickScheduleBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});

