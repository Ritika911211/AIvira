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
import { Persona, WorkspaceType } from '../types';
import { useResponsive } from '../utils/responsive';

interface Props {
  persona: Persona;
  workspace: WorkspaceType;
  onChangePersona: () => void;
  onChangeWorkspace: (workspace: WorkspaceType) => void;
  onLogout: () => void;
  onOpenCalling: () => void;
  onOpenSafety: () => void;
  onOpenPromises: () => void;
}

export const SettingsScreen: React.FC<Props> = ({
  persona,
  workspace,
  onChangePersona,
  onChangeWorkspace,
  onLogout,
  onOpenCalling,
  onOpenSafety,
  onOpenPromises,
}) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [voiceHandsFree, setVoiceHandsFree] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <Text style={[styles.title, { fontSize: rf(isSmall ? 19 : 22) }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>PS</Text>
          </View>
          <View style={styles.profileInfoCol}>
            <Text style={styles.profileName}>Priya Sharma</Text>
            <Text style={styles.profileEmail}>priya@example.com</Text>
            <View style={styles.personaBadge}>
              <Text style={styles.personaBadgeText}>Persona: {persona}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onChangePersona}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Workspace Switcher */}
        <Text style={styles.sectionHeader}>Active Workspace</Text>
        <View style={styles.workspaceRow}>
          {(['Personal', 'Family', 'Business'] as WorkspaceType[]).map(ws => (
            <TouchableOpacity
              key={ws}
              style={[
                styles.workspacePill,
                workspace === ws && styles.workspacePillActive,
              ]}
              onPress={() => onChangeWorkspace(ws)}
            >
              <Ionicons 
                name={ws === 'Personal' ? 'person' : ws === 'Family' ? 'people' : 'briefcase'} 
                size={14} 
                color={workspace === ws ? '#FFF' : Colors.secondaryText} 
              />
              <Text style={[styles.workspacePillText, workspace === ws && styles.workspacePillTextActive]}>
                {ws}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Nav to Key Signature Modules */}
        <Text style={styles.sectionHeader}>Signature Differentiators</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={onOpenPromises}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="sparkles" size={20} color="#6366F1" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>PromiseOS & Smart Escalation</Text>
              <Text style={styles.settingSub}>Promises made, Waiting for, Auto-escalation</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={onOpenSafety}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#FDF2F8' }]}>
              <Ionicons name="shield-checkmark" size={20} color="#EC4899" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>SafeCircle & SOS Center</Text>
              <Text style={styles.settingSub}>Women Safety, SafeWalk, Emergency Contacts</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={onOpenCalling}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="call" size={20} color="#10B981" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>AI Calling Assistant</Text>
              <Text style={styles.settingSub}>WhatsApp, native phone, Aivira VoIP</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Standard Settings Groups */}
        <Text style={styles.sectionHeader}>Preferences & Privacy</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={onChangePersona}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#F3EEFF' }]}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Personalisation</Text>
              <Text style={styles.settingSub}>Persona ({persona}), language (Hinglish), voice</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert("Privacy & Security", "End-to-end encrypted storage. Voice and location permission controls enabled.")}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="lock-closed" size={20} color="#3B82F6" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Privacy & Security</Text>
              <Text style={styles.settingSub}>Permissions, data, explicit action consent</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert("Connected Accounts", "WhatsApp: Linked\nGoogle Calendar: Synced\nPhone Contacts: Allowed")}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="link" size={20} color="#F59E0B" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Connected Accounts</Text>
              <Text style={styles.settingSub}>WhatsApp, Google, Calendar, Contacts</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Toggle Switches */}
          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="notifications" size={20} color="#EF4444" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Notifications & Reminders</Text>
              <Text style={styles.settingSub}>Urgent calls, fee dues, medicine alarms</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={notificationsEnabled ? Colors.primary : '#F4F3F4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="moon" size={20} color="#374151" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Dark Theme</Text>
              <Text style={styles.settingSub}>Light theme is recommended for Aivira</Text>
            </View>
            <Switch
              value={darkTheme}
              onValueChange={(val) => {
                setDarkTheme(val);
                if (val) Alert.alert("Theme Notice", "Aivira is tailored with a premium light palette. Dark theme is active for emergency SOS mode.");
              }}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={darkTheme ? Colors.primary : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Log Out</Text>
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
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  title: {
    fontWeight: '800',
    color: Colors.primaryText,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  profileInfoCol: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  profileEmail: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 1,
  },
  personaBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  personaBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 10,
    marginTop: 4,
  },
  workspaceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  workspacePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0EEF8',
    gap: 6,
  },
  workspacePillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  workspacePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  workspacePillTextActive: {
    color: '#FFFFFF',
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8FC',
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextCol: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  settingSub: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    marginTop: 4,
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});

