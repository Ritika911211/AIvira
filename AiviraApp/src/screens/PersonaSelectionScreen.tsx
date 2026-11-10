import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { Persona } from '../types';
import { useResponsive } from '../utils/responsive';

interface Props {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  onProceed: () => void;
}

export const PersonaSelectionScreen: React.FC<Props> = ({
  selectedPersona,
  onSelectPersona,
  onProceed,
}) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const personas: { id: Persona; label: string; desc: string; icon: string; color: string }[] = [
    {
      id: 'Professional',
      label: 'Working Professional',
      desc: 'Meetings, task delegation, team coordination & calendar optimization.',
      icon: 'briefcase',
      color: '#7652EB',
    },
    {
      id: 'Parent',
      label: 'Parent & Family',
      desc: "School fee reminders, homework, exam schedules & family calendar.",
      icon: 'people',
      color: '#F59E0B',
    },
    {
      id: 'Startup Founder',
      label: 'Startup Founder / Owner',
      desc: 'Investor follow-up, client commitments, decision memory & team tasks.',
      icon: 'rocket',
      color: '#3B82F6',
    },
    {
      id: 'Delivery Executive',
      label: 'Delivery Executive / Driver',
      desc: 'Hands-free calls, voice delivery instructions & driving auto-reply.',
      icon: 'bicycle',
      color: '#10B981',
    },
    {
      id: 'Women Safety',
      label: 'SafeCircle & Solo Travel',
      desc: 'Safe journey check-in, live location sharing & instant voice SOS alert.',
      icon: 'shield-checkmark',
      color: '#EC4899',
    },
    {
      id: 'Student',
      label: 'School / College Student',
      desc: 'Homework tracker, assignment deadlines & exam revision alerts.',
      icon: 'school',
      color: '#8B5CF6',
    },
    {
      id: 'Elderly',
      label: 'Elderly & Health Care',
      desc: 'Medicine alarms, doctor appointments & caregiver notifications.',
      icon: 'heart-circle',
      color: '#EF4444',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <Text style={[styles.title, { fontSize: rf(isSmall ? 20 : 24) }]}>Select Your Persona</Text>
        <Text style={[styles.subtitle, { fontSize: rf(isSmall ? 11.5 : 13) }]}>
          How will you primarily use Aivira? Your home dashboard and AI voice priorities will adapt automatically.
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.listContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {personas.map(item => {
          const isSelected = selectedPersona === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.personaCard,
                isSelected && styles.personaCardSelected,
              ]}
              onPress={() => onSelectPersona(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrapper, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>

              <View style={styles.cardTextContent}>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  )}
                </View>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onProceed}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Enter Aivira ({selectedPersona})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.secondaryText,
    lineHeight: 19,
    marginTop: 6,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  personaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F0EEF8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  personaCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F8F6FF',
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  cardTitleSelected: {
    color: Colors.primary,
  },
  cardDesc: {
    fontSize: 12,
    color: Colors.secondaryText,
    lineHeight: 17,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EEF8',
  },
  continueButton: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

