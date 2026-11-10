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

export const CareMateScreen: React.FC<Props> = ({ onBack, onOpenVoice }) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const [medicines, setMedicines] = useState([
    { id: 'm1', name: "Papa's Blood Pressure Tablet", time: '8:00 AM', dosage: '1 tablet after breakfast', confirmed: true },
    { id: 'm2', name: "Papa's Evening BP & Vitamin D", time: '9:00 PM', dosage: '1 tablet after dinner', confirmed: false },
    { id: 'm3', name: 'Multivitamin & Calcium', time: '1:00 PM', dosage: 'After lunch', confirmed: true },
  ]);

  const toggleConfirm = (id: string) => {
    setMedicines(medicines.map(m => {
      if (m.id === id) {
        const nextState = !m.confirmed;
        if (nextState) {
          Alert.alert("Medicine Confirmed", `Dose marked as taken at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Caregiver notified.`);
        }
        return { ...m, confirmed: nextState };
      }
      return m;
    }));
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={[styles.title, { fontSize: rf(isSmall ? 17 : 20) }]}>CareMate</Text>
          <Text style={[styles.subtitle, { fontSize: rf(11) }]}>Health & Elderly Family Care Assistant</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Caregiver Status Banner */}
        <View style={styles.caregiverBanner}>
          <View style={styles.caregiverIcon}>
            <Ionicons name="heart" size={22} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.caregiverTitle}>Elderly Care Circle Active</Text>
            <Text style={styles.caregiverSub}>
              Papa's doses are tracked. If unconfirmed within 30 mins, caregiver notification is dispatched.
            </Text>
          </View>
        </View>

        {/* Medicine Schedule Section */}
        <Text style={styles.sectionTitle}>Daily Medicine Routine</Text>
        <View style={styles.medsList}>
          {medicines.map(med => (
            <View key={med.id} style={styles.medCard}>
              <TouchableOpacity 
                style={[styles.confirmCheckCircle, med.confirmed && styles.confirmCheckCircleActive]}
                onPress={() => toggleConfirm(med.id)}
              >
                <Ionicons 
                  name={med.confirmed ? "checkmark" : "time-outline"} 
                  size={20} 
                  color={med.confirmed ? "#FFF" : "#9CA3AF"} 
                />
              </TouchableOpacity>

              <View style={styles.medInfoCol}>
                <View style={styles.medTitleRow}>
                  <Text style={[styles.medName, med.confirmed && styles.medConfirmedText]}>
                    {med.name}
                  </Text>
                  <Text style={styles.medTime}>{med.time}</Text>
                </View>
                <Text style={styles.medDosage}>{med.dosage}</Text>
                <Text style={[styles.confirmStatusText, { color: med.confirmed ? Colors.success : Colors.warning }]}>
                  {med.confirmed ? "✓ Confirmed taken" : "⏳ Pending confirmation"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Doctor Appointment Card */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Upcoming Doctor Appointments</Text>
        <View style={styles.appointmentCard}>
          <View style={styles.doctorAvatar}>
            <Ionicons name="medical" size={22} color="#10B981" />
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>Dr. Arvind Rao (Cardiologist)</Text>
            <Text style={styles.clinicName}>Apollo Hospital • 4:00 PM Tomorrow</Text>
            <Text style={styles.appointmentNote}>Routine quarterly blood pressure review</Text>
          </View>
        </View>

        {/* Voice Command Card */}
        <TouchableOpacity 
          style={styles.voicePromptCard}
          onPress={() => onOpenVoice("Papa ki medicine subah 8 aur raat 9 baje yaad dilana")}
          activeOpacity={0.8}
        >
          <Ionicons name="mic-circle" size={32} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.voiceHeading}>Set Routine with Voice</Text>
            <Text style={styles.voiceSub}>"Papa ki medicine subah 8 aur raat 9 baje yaad dilana"</Text>
          </View>
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
  caregiverBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 12,
    marginBottom: 20,
  },
  caregiverIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caregiverTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  caregiverSub: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  medsList: {
    gap: 10,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
  },
  confirmCheckCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  confirmCheckCircleActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  medInfoCol: {
    flex: 1,
  },
  medTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  medName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
    flex: 1,
  },
  medConfirmedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  medTime: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 8,
  },
  medDosage: {
    fontSize: 11,
    color: Colors.secondaryText,
  },
  confirmStatusText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    marginBottom: 20,
  },
  doctorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  clinicName: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 1,
  },
  appointmentNote: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  voicePromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6DEFC',
    gap: 12,
  },
  voiceHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  voiceSub: {
    fontSize: 11,
    color: Colors.primaryText,
    marginTop: 2,
  },
});

