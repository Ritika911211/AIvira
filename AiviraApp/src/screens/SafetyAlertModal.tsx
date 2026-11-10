import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface Props {
  onDismiss: () => void;
}

export const SafetyAlertModal: React.FC<Props> = ({ onDismiss }) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const handleCallEmergency = () => {
    Alert.alert("Emergency Dial", "Dialing national emergency helpline (112)...");
  };

  const handleContactFamily = () => {
    Alert.alert("Contact Family", "Calling Mummy (+91 98765 00001)...");
  };

  return (
    <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
      <View style={styles.content}>
        {/* Urgent Warning Shield Icon */}
        <View style={[styles.iconPulseWrapper, isSmall && { marginBottom: 12 }]}>
          <View style={[styles.iconPulseOuter, isSmall && { width: 90, height: 90, borderRadius: 45 }]}>
            <View style={[styles.iconCircle, isSmall && { width: 64, height: 64, borderRadius: 32 }]}>
              <Ionicons name="warning" size={isSmall ? 38 : 48} color="#EF4444" />
            </View>
          </View>
        </View>

        <Text style={[styles.title, { fontSize: rf(isSmall ? 22 : 26) }]}>SOS Alert Sent</Text>
        <Text style={[styles.subtitle, { fontSize: rf(isSmall ? 12.5 : 14) }]}>
          Your trusted contacts have been notified with your live location.
        </Text>

        {/* Live Location Shared Card */}
        <TouchableOpacity 
          style={styles.locationCard}
          onPress={() => Alert.alert("GPS Location", "Latitude: 12.9716, Longitude: 77.5946\nAccuracy: High (GPS)")}
          activeOpacity={0.8}
        >
          <View style={styles.locationIconBox}>
            <Ionicons name="shield-checkmark" size={22} color="#10B981" />
          </View>
          <View style={styles.locationTextCol}>
            <Text style={styles.locationCardTitle}>Live Location Shared</Text>
            <Text style={styles.locationLinkText} numberOfLines={1}>
              https://maps.google.com/?q=12.9716,77.5946
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.buttonsGroup}>
          <TouchableOpacity 
            style={styles.callEmergencyBtn}
            onPress={handleCallEmergency}
            activeOpacity={0.85}
          >
            <Ionicons name="call" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.callEmergencyBtnText}>Call Emergency (112)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactFamilyBtn}
            onPress={handleContactFamily}
            activeOpacity={0.85}
          >
            <Ionicons name="people" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.contactFamilyBtnText}>Contact Family</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelBtn}
            onPress={onDismiss}
          >
            <Text style={styles.cancelBtnText}>Cancel Alert</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0914',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
  },
  iconPulseWrapper: {
    marginBottom: 20,
  },
  iconPulseOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#38121E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#571829',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#D1C4D6',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1528',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#322340',
    width: '100%',
    marginBottom: 28,
  },
  locationIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#132A22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationTextCol: {
    flex: 1,
  },
  locationCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  locationLinkText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  buttonsGroup: {
    width: '100%',
    gap: 12,
  },
  callEmergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    height: 52,
    borderRadius: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  callEmergencyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  contactFamilyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#261C33',
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#423356',
  },
  contactFamilyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: '#A197AB',
    fontSize: 14,
    fontWeight: '600',
  },
});

