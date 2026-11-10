import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface Props {
  onBack: () => void;
  onOpenCalling: () => void;
}

export const DriveSafeScreen: React.FC<Props> = ({ onBack, onOpenCalling }) => {
  const { isSmall, rf, width, horizontalPadding } = useResponsive();
  const [autoReply, setAutoReply] = useState(true);
  const [priorityContacts, setPriorityContacts] = useState(true);
  const [handsFree, setHandsFree] = useState(true);
  const [isDrivingActive, setIsDrivingActive] = useState(true);

  const scooterCircleSize = Math.min(width * 0.3, isSmall ? 90 : 120);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={[styles.title, { fontSize: rf(isSmall ? 18 : 20) }]}>DriveSafe</Text>
          <Text style={[styles.subtitle, { fontSize: rf(isSmall ? 11 : 12) }]}>Hands-free assistance for drivers and delivery riders.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Rider Mode Card */}
        <View style={[styles.riderCard, isSmall && { padding: 16 }]}>
          <View style={[styles.scooterCircle, { width: scooterCircleSize, height: scooterCircleSize, borderRadius: scooterCircleSize / 2 }]}>
            <Ionicons name="bicycle" size={isSmall ? 46 : 62} color={Colors.primary} />
          </View>

          {/* Driving Mode Active Badge */}
          <TouchableOpacity 
            style={[styles.statusBadge, !isDrivingActive && styles.statusBadgeInactive]}
            onPress={() => setIsDrivingActive(!isDrivingActive)}
          >
            <View style={[styles.statusDot, !isDrivingActive && styles.statusDotInactive]} />
            <Text style={[styles.statusText, !isDrivingActive && styles.statusTextInactive]}>
              {isDrivingActive ? "Driving Mode Active" : "Driving Mode Paused"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Feature Status Cards */}
        <View style={styles.featuresList}>
          <TouchableOpacity 
            style={styles.featureItem}
            onPress={() => Alert.alert("Incoming Call Routing", "Manager call prioritized. Can answer via headset or auto-reply.")}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="call" size={20} color="#3B82F6" />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>Incoming Call Routing</Text>
              <Text style={styles.featureDesc}>Announces caller identity & marks urgency</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureItem}
            onPress={() => Alert.alert("Delivery Instructions", "Voice reads: 'Leave package with security at Tower B flat 402'")}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="volume-high" size={20} color="#10B981" />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>Delivery Instructions</Text>
              <Text style={styles.featureDesc}>Reads customer address notes aloud</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureItem}
            onPress={() => Alert.alert("Voice Notifications", "Aivira reads incoming notifications through your earphones")}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#F3EEFF' }]}>
              <Ionicons name="notifications" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>Voice Notifications</Text>
              <Text style={styles.featureDesc}>Hands-free summary of incoming messages</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Quick Settings Toggles */}
        <Text style={styles.sectionHeading}>Quick Settings</Text>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="chatbubble" size={18} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.settingLabel}>Auto Reply</Text>
                <Text style={styles.settingSub}>"I am riding. Will call back shortly."</Text>
              </View>
            </View>
            <Switch
              value={autoReply}
              onValueChange={setAutoReply}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={autoReply ? Colors.primary : '#F4F3F4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="star" size={18} color="#10B981" />
              </View>
              <View>
                <Text style={styles.settingLabel}>Priority Contacts</Text>
                <Text style={styles.settingSub}>Only break through for Family & Managers</Text>
              </View>
            </View>
            <Switch
              value={priorityContacts}
              onValueChange={setPriorityContacts}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={priorityContacts ? Colors.primary : '#F4F3F4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: '#F3EEFF' }]}>
                <Ionicons name="headset" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Hands-free Controls</Text>
                <Text style={styles.settingSub}>Accept or reject with headset button</Text>
              </View>
            </View>
            <Switch
              value={handsFree}
              onValueChange={setHandsFree}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={handsFree ? Colors.primary : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Safety Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
          <Text style={styles.disclaimerText}>
            Never look at your phone screen while riding or driving. DriveSafe operates completely via audio and bluetooth.
          </Text>
        </View>
      </ScrollView>
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
  headerTitleCol: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  riderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EEF8',
    marginBottom: 20,
  },
  scooterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 8,
  },
  statusBadgeInactive: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusDotInactive: {
    backgroundColor: '#9CA3AF',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  statusTextInactive: {
    color: '#4B5563',
  },
  featuresList: {
    gap: 10,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  featureDesc: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8FC',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  settingSub: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 1,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
  },
});

