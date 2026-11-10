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
import { useResponsive } from '../utils/responsive';

interface Props {
  onBack: () => void;
  onOpenVoice: (prompt: string) => void;
}

export const FamilyLifeScreen: React.FC<Props> = ({ onBack, onOpenVoice }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { isSmall, rf, horizontalPadding } = useResponsive();

  const items = [
    {
      id: 'fee',
      title: 'School Fee Reminders',
      subtitle: 'Upcoming dues and payments',
      badge: 'Due in 5 days (₹8,000)',
      badgeColor: '#F59E0B',
      icon: 'cash-outline',
      color: '#F59E0B',
      detail: "Rohan's Class 7 quarterly tuition fee is due on 15 December. Payment portal linked."
    },
    {
      id: 'homework',
      title: 'Homework Tracker',
      subtitle: 'Pending assignments',
      badge: '2 Pending',
      badgeColor: '#7652EB',
      icon: 'book-outline',
      color: '#7652EB',
      detail: "Science project chart due tomorrow; Mathematics Ex 4.2 due Friday."
    },
    {
      id: 'exam',
      title: 'Exam & Result Alerts',
      subtitle: 'Exams and results dates',
      badge: 'Unit Test next week',
      badgeColor: '#3B82F6',
      icon: 'document-text-outline',
      color: '#3B82F6',
      detail: "Quarterly Mathematics & English assessments start from Monday 22nd."
    },
    {
      id: 'event',
      title: 'School Event Reminders',
      subtitle: 'PTM, holidays, functions',
      badge: 'PTM this Saturday',
      badgeColor: '#10B981',
      icon: 'calendar-outline',
      color: '#10B981',
      detail: "Parent Teacher Meeting at DPS East Campus from 9:30 AM to 12:00 PM."
    },
    {
      id: 'transport',
      title: 'Transport Alerts',
      subtitle: 'Bus pickup and drop timings',
      badge: 'Bus #14 (7:45 AM)',
      badgeColor: '#06B6D4',
      icon: 'bus-outline',
      color: '#06B6D4',
      detail: "Morning bus pickup: 7:45 AM at Gate 2. Afternoon drop: 3:15 PM."
    },
    {
      id: 'document',
      title: 'Document Expiry',
      subtitle: 'IDs, certificates, important docs',
      badge: 'Birth Cert Verified',
      badgeColor: '#6B7280',
      icon: 'shield-checkmark-outline',
      color: '#6B7280',
      detail: "Rohan's Aadhaar update confirmed. School ID valid till March 2027."
    },
    {
      id: 'family_cal',
      title: 'Family Calendar',
      subtitle: 'All family events in one place',
      badge: 'Shared with 4 members',
      badgeColor: '#8B5CF6',
      icon: 'people-outline',
      color: '#8B5CF6',
      detail: "Dad's doctor appointment, Rohan's annual sports day, Mom's dental checkup."
    },
    {
      id: 'sharing',
      title: 'Parent-Child Task Sharing',
      subtitle: 'Assign age-appropriate tasks',
      badge: 'Star Rewards Active',
      badgeColor: '#EC4899',
      icon: 'star-outline',
      color: '#EC4899',
      detail: "Rohan's daily responsibilities: Pack school bag, 30 min reading, organize study table."
    },
  ];

  const handleAction = (item: typeof items[0]) => {
    setActiveItem(activeItem === item.id ? null : item.id);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.topBarTitleColumn}>
          <Text style={[styles.screenTitle, { fontSize: rf(isSmall ? 18 : 20) }]}>FamilyLife Manager</Text>
          <Text style={[styles.screenSubtitle, { fontSize: rf(isSmall ? 11 : 12) }]}>
            Manage your child's education, family responsibilities and important events.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.listContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Voice Trigger Banner */}
        <TouchableOpacity 
          style={styles.voicePromptBanner}
          onPress={() => onOpenVoice("Rohan ki school fee 15 December ko due hai, 5 din pehle remind karna")}
          activeOpacity={0.8}
        >
          <View style={styles.micCircle}>
            <Ionicons name="mic" size={18} color="#FFF" />
          </View>
          <View style={styles.voicePromptTextColumn}>
            <Text style={styles.voicePromptHeading}>Quick Voice Action</Text>
            <Text style={styles.voicePromptExample}>
              "Rohan ki school fee 15 Dec ko due hai, 5 din pehle remind karna"
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
        </TouchableOpacity>

        {/* Feature List */}
        {items.map(item => {
          const isExpanded = activeItem === item.id;
          return (
            <View key={item.id} style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.itemCard}
                onPress={() => handleAction(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>

                <View style={styles.itemTextContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <View style={[styles.badgePill, { backgroundColor: `${item.badgeColor}15` }]}>
                      <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>

                <Ionicons
                  name={isExpanded ? "chevron-down" : "chevron-forward"}
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              {/* Expanded details */}
              {isExpanded && (
                <View style={styles.expandedSection}>
                  <Text style={styles.detailText}>{item.detail}</Text>
                  <View style={styles.detailButtonRow}>
                    <TouchableOpacity 
                      style={styles.actionBtnPrimary}
                      onPress={() => Alert.alert("Aivira Action", `Action recorded for ${item.title}`)}
                    >
                      <Text style={styles.actionBtnText}>Take Action</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionBtnSecondary}
                      onPress={() => onOpenVoice(`Set a reminder for ${item.title}`)}
                    >
                      <Text style={styles.actionBtnSecText}>Voice Reminder</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  backButton: {
    paddingRight: 14,
    paddingTop: 2,
  },
  topBarTitleColumn: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  screenSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    lineHeight: 16,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 10,
  },
  voicePromptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6DEFC',
    padding: 12,
    marginBottom: 6,
    gap: 12,
  },
  micCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voicePromptTextColumn: {
    flex: 1,
  },
  voicePromptHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  voicePromptExample: {
    fontSize: 11,
    color: Colors.primaryText,
    marginTop: 2,
  },
  itemWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    overflow: 'hidden',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTextContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  expandedSection: {
    backgroundColor: '#FAF9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EEF8',
  },
  detailText: {
    fontSize: 12,
    color: Colors.primaryText,
    lineHeight: 18,
    marginBottom: 10,
  },
  detailButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD7F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnSecText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

