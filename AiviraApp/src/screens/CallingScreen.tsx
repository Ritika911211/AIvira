import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  Alert, 
  Modal 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { CallRecord } from '../types';
import { useResponsive } from '../utils/responsive';

interface Props {
  onBack: () => void;
  callHistory: CallRecord[];
}

export const CallingScreen: React.FC<Props> = ({ onBack, callHistory }) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const [activeCallSession, setActiveCallSession] = useState<{ contact: string; channel: string } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  const contacts = [
    { name: 'Ritika Sharma', phone: '+91 98765 43210', role: 'Product Partner', isAiviraUser: true },
    { name: 'Rahul (Tech Lead)', phone: '+91 98111 22334', role: 'Engineering', isAiviraUser: true },
    { name: 'Delivery Manager', phone: '+91 98222 33445', role: 'Operations', isAiviraUser: false },
    { name: 'Mummy', phone: '+91 98765 00001', role: 'Family (Emergency)', isAiviraUser: true },
  ];

  const handleWhatsAppCall = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `whatsapp://send?phone=${cleanPhone}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("WhatsApp Handoff", `Opening chat with ${name} (${phone})...`);
        }
      })
      .catch(() => {
        Alert.alert("WhatsApp Call", `Connecting to WhatsApp for ${name}...`);
      });
  };

  const handleNativeCall = (phone: string, name: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert("Phone Dialer", `Calling ${name} at ${phone}...`);
    });
  };

  const handleAiviraInternetCall = (name: string) => {
    setActiveCallSession({ contact: name, channel: 'Aivira Internet VoIP' });
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={[styles.title, { fontSize: rf(isSmall ? 17 : 20) }]}>AI Calling Assistant</Text>
          <Text style={[styles.subtitle, { fontSize: rf(11) }]}>WhatsApp, Phone Dialer & Aivira VoIP Calls</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Quick Launch Calling Options Banner */}
        <View style={styles.callingChannelsRow}>
          <View style={styles.channelBadge}>
            <Ionicons name="logo-whatsapp" size={16} color="#16A36A" />
            <Text style={styles.channelBadgeText}>WhatsApp Call</Text>
          </View>
          <View style={styles.channelBadge}>
            <Ionicons name="call" size={16} color="#3B82F6" />
            <Text style={styles.channelBadgeText}>Phone Dialer</Text>
          </View>
          <View style={styles.channelBadge}>
            <Ionicons name="wifi" size={16} color={Colors.primary} />
            <Text style={styles.channelBadgeText}>Aivira VoIP</Text>
          </View>
        </View>

        {/* Contacts Directory */}
        <Text style={styles.sectionHeading}>Important Contacts</Text>
        <View style={styles.contactsList}>
          {contacts.map((c, idx) => (
            <View key={idx} style={styles.contactCard}>
              <View style={styles.contactAvatar}>
                <Text style={styles.avatarLetter}>{c.name[0]}</Text>
              </View>

              <View style={styles.contactInfo}>
                <View style={styles.contactNameRow}>
                  <Text style={styles.contactName}>{c.name}</Text>
                  {c.isAiviraUser && (
                    <View style={styles.aiviraUserTag}>
                      <Text style={styles.aiviraUserTagText}>Aivira</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.contactPhone}>{c.role} • {c.phone}</Text>
              </View>

              {/* Action Buttons for this contact */}
              <View style={styles.contactActionButtons}>
                <TouchableOpacity 
                  style={[styles.miniBtn, { backgroundColor: '#ECFDF5' }]}
                  onPress={() => handleWhatsAppCall(c.phone, c.name)}
                >
                  <Ionicons name="logo-whatsapp" size={18} color="#16A36A" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.miniBtn, { backgroundColor: '#EFF6FF' }]}
                  onPress={() => handleNativeCall(c.phone, c.name)}
                >
                  <Ionicons name="call" size={18} color="#3B82F6" />
                </TouchableOpacity>

                {c.isAiviraUser && (
                  <TouchableOpacity 
                    style={[styles.miniBtn, { backgroundColor: '#F3EEFF' }]}
                    onPress={() => handleAiviraInternetCall(c.name)}
                  >
                    <Ionicons name="wifi" size={18} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Call History */}
        <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Recent Call History</Text>
        <View style={styles.historyCard}>
          {callHistory.map(call => (
            <View key={call.id} style={styles.historyRow}>
              <View style={[styles.historyIcon, { backgroundColor: call.type === 'Missed' ? '#FEE2E2' : '#F3EEFF' }]}>
                <Ionicons 
                  name={call.type === 'Missed' ? 'call-outline' : call.type === 'Outgoing' ? 'arrow-up' : 'arrow-down'} 
                  size={16} 
                  color={call.type === 'Missed' ? '#EF4444' : Colors.primary} 
                />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyName}>{call.contactName}</Text>
                <Text style={styles.historySub}>
                  {call.channel} • {call.type} {call.duration ? `(${call.duration})` : ''}
                </Text>
              </View>
              <Text style={styles.historyTime}>{call.timestamp}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Aivira Active VoIP Call Screen Modal */}
      <Modal visible={!!activeCallSession} transparent animationType="fade">
        <View style={styles.voipModalContainer}>
          <View style={styles.voipCallerCard}>
            <View style={styles.voipAvatarCircle}>
              <Text style={styles.voipAvatarText}>{activeCallSession?.contact[0] || 'A'}</Text>
            </View>
            <Text style={styles.voipCallerName}>{activeCallSession?.contact}</Text>
            <Text style={styles.voipStatusText}>Aivira High-Definition Voice Call • Connected</Text>

            {/* Audio Waveform */}
            <View style={{ marginVertical: 24 }}>
              <Ionicons name="radio" size={40} color="#FFFFFF99" />
            </View>

            {/* In-Call Controls */}
            <View style={styles.inCallControlsRow}>
              <TouchableOpacity 
                style={[styles.ctrlBtn, isMuted && styles.ctrlBtnActive]}
                onPress={() => setIsMuted(!isMuted)}
              >
                <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#FFF" />
                <Text style={styles.ctrlLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.ctrlBtn, isSpeaker && styles.ctrlBtnActive]}
                onPress={() => setIsSpeaker(!isSpeaker)}
              >
                <Ionicons name={isSpeaker ? "volume-high" : "volume-medium"} size={24} color="#FFF" />
                <Text style={styles.ctrlLabel}>Speaker</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.endCallBtn}
                onPress={() => setActiveCallSession(null)}
              >
                <Ionicons name="call" size={26} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
                <Text style={styles.ctrlLabel}>End</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  backBtn: {
    paddingRight: 14,
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
    paddingTop: 20,
    paddingBottom: 32,
  },
  callingChannelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    marginBottom: 20,
  },
  channelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  channelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  contactsList: {
    gap: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  aiviraUserTag: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  aiviraUserTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  contactPhone: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  contactActionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  miniBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    paddingHorizontal: 16,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8FC',
  },
  historyIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  historySub: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  historyTime: {
    fontSize: 11,
    color: Colors.secondaryText,
  },
  voipModalContainer: {
    flex: 1,
    backgroundColor: '#17152BFA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  voipCallerCard: {
    alignItems: 'center',
    width: '100%',
  },
  voipAvatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  voipAvatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  voipCallerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  voipStatusText: {
    fontSize: 13,
    color: '#A78BFA',
    fontWeight: '600',
  },
  inCallControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 40,
  },
  ctrlBtn: {
    alignItems: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2E2B4A',
    justifyContent: 'center',
    gap: 4,
  },
  ctrlBtnActive: {
    backgroundColor: Colors.primary,
  },
  ctrlLabel: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  endCallBtn: {
    alignItems: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    gap: 4,
  },
});

