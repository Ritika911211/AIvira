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
  onTriggerSOS: () => void;
  onOpenDriveSafe: () => void;
}

export const SafetyAgentScreen: React.FC<Props> = ({ 
  onBack, 
  onTriggerSOS,
  onOpenDriveSafe 
}) => {
  const { isSmall, rf, width, horizontalPadding } = useResponsive();
  const [activeTab, setActiveTab] = useState<'Women Safety' | 'DriveSafe' | 'SafeWalk'>('Women Safety');
  const [isJourneyActive, setIsJourneyActive] = useState(false);

  const shieldSize = Math.min(width * 0.28, isSmall ? 84 : 110);

  const handleTabChange = (tab: 'Women Safety' | 'DriveSafe' | 'SafeWalk') => {
    setActiveTab(tab);
    if (tab === 'DriveSafe') {
      onOpenDriveSafe();
    }
  };

  const toggleSafeJourney = () => {
    setIsJourneyActive(!isJourneyActive);
    Alert.alert(
      isJourneyActive ? "Journey Ended" : "Safe Journey Started",
      isJourneyActive 
        ? "Safe arrival recorded. Contacts updated."
        : "Live location consent enabled. Expected arrival in 45 mins. Check-in timer started."
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.topHeader, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerTitleColumn}>
          <Text style={[styles.title, { fontSize: rf(isSmall ? 18 : 20) }]}>Aivira Safety Agent</Text>
          <Text style={[styles.subtitle, { fontSize: rf(isSmall ? 11 : 12) }]}>Your safety. Our priority.</Text>
        </View>
      </View>

      {/* Segmented Subtabs */}
      <View style={[styles.tabBar, { paddingHorizontal: horizontalPadding }]}>
        {(['Women Safety', 'DriveSafe', 'SafeWalk'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabPill,
              activeTab === tab && styles.tabPillActive,
            ]}
            onPress={() => handleTabChange(tab)}
          >
            <Text style={[styles.tabPillText, activeTab === tab && styles.tabPillTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Protective Shield Illustration Card */}
        <View style={[styles.illustrationCard, isSmall && { padding: 16 }]}>
          <View style={styles.shieldWrapper}>
            <View style={[styles.shieldBackgroundCircle, { width: shieldSize, height: shieldSize, borderRadius: shieldSize / 2 }]}>
              <Ionicons name="shield-checkmark" size={isSmall ? 48 : 64} color={Colors.primary} />
            </View>
          </View>
          <Text style={[styles.cardHeading, { fontSize: rf(isSmall ? 16 : 18) }]}>
            {isJourneyActive ? "Safe Journey in Progress" : "Safe Journey Protection"}
          </Text>
          <Text style={[styles.cardDescription, { fontSize: rf(isSmall ? 11 : 12) }]}>
            {isJourneyActive 
              ? "Live GPS tracking active. Checking in with Mummy & Rahul."
              : "Continuous monitoring, route deviation alerts, and automated check-ins."}
          </Text>

          {/* Primary CTA Button */}
          <TouchableOpacity 
            style={[styles.startJourneyBtn, isJourneyActive && styles.endJourneyBtn]}
            onPress={toggleSafeJourney}
            activeOpacity={0.85}
          >
            <Ionicons 
              name={isJourneyActive ? "checkmark-circle" : "navigate"} 
              size={20} 
              color="#FFF" 
              style={{ marginRight: 8 }} 
            />
            <Text style={styles.startJourneyBtnText}>
              {isJourneyActive ? "Confirm Safe Arrival" : "Start Safe Journey"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3 Quick Action Icons Row */}
        <View style={styles.quickIconsRow}>
          <TouchableOpacity 
            style={styles.quickIconItem}
            onPress={() => Alert.alert("Live Location", "Sharing active with 2 trusted contacts")}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="location" size={22} color="#3B82F6" />
            </View>
            <Text style={styles.quickIconLabel}>Live Location</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickIconItem}
            onPress={onTriggerSOS}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="alert-circle" size={24} color="#EF4444" />
            </View>
            <Text style={[styles.quickIconLabel, { color: '#EF4444', fontWeight: '700' }]}>SOS Alert</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickIconItem}
            onPress={() => Alert.alert("Trusted Circle", "1. Mummy (+91 98765 00001)\n2. Rahul (+91 98765 00002)")}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="people" size={22} color="#F59E0B" />
            </View>
            <Text style={styles.quickIconLabel}>Trusted Circle</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions List */}
        <Text style={styles.listSectionHeader}>Quick Actions</Text>

        <TouchableOpacity 
          style={styles.actionRow}
          onPress={onTriggerSOS}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="call" size={20} color="#EF4444" />
          </View>
          <View style={styles.actionTextColumn}>
            <Text style={styles.actionTitle}>Emergency Call</Text>
            <Text style={styles.actionSubtitle}>One-tap dial to 112 / Emergency helpline</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionRow}
          onPress={() => Alert.alert("Share Location", "Google Maps live link sent to WhatsApp contacts")}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="share-social" size={20} color="#3B82F6" />
          </View>
          <View style={styles.actionTextColumn}>
            <Text style={styles.actionTitle}>Share Location</Text>
            <Text style={styles.actionSubtitle}>Send temporary tracking link to contacts</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionRow}
          onPress={() => Alert.alert("Safe Check-in", "Scheduled 10:00 PM check-in confirmed")}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="checkmark-done-circle" size={20} color="#10B981" />
          </View>
          <View style={styles.actionTextColumn}>
            <Text style={styles.actionTitle}>Safe Check-in</Text>
            <Text style={styles.actionSubtitle}>Automated check-in timer for destination</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingRight: 14,
  },
  headerTitleColumn: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabPillActive: {
    backgroundColor: Colors.primary,
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  tabPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  illustrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EEF8',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  shieldWrapper: {
    marginBottom: 16,
  },
  shieldBackgroundCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E6DEFC',
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 12,
  },
  startJourneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    width: '100%',
    height: 50,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  endJourneyBtn: {
    backgroundColor: Colors.success,
  },
  startJourneyBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  quickIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    marginBottom: 24,
  },
  quickIconItem: {
    alignItems: 'center',
    gap: 6,
  },
  quickIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  listSectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    marginBottom: 10,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTextColumn: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  actionSubtitle: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
});

