import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Animated, Easing
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface Props {
  onComplete: () => void;
  onLoginPress: () => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete, onLoginPress }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isSmall, rf, width, height, horizontalPadding } = useResponsive();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const circleSize = Math.min(width * 0.52, isSmall ? 170 : 210);
  const innerCircleSize = circleSize * 0.65;

  const slides = [
    {
      title: 'From school to success',
      description: 'Aivira helps kids, students, professionals and families manage their daily life.',
      icon: 'school-outline',
      personaHint: 'Students & Children',
      accent: '#7652EB'
    },
    {
      title: 'Voice-to-Action Assistant',
      description: 'Speak in Hindi, English or Hinglish. Aivira assigns tasks, sets reminders, and calls contacts.',
      icon: 'mic-circle-outline',
      personaHint: 'Powered by Gnani AI',
      accent: '#8B5CF6'
    },
    {
      title: 'Stay connected & safe',
      description: 'SafeCircle SOS, safe journey tracking, hands-free delivery rider mode, and medicine reminders.',
      icon: 'shield-checkmark-outline',
      personaHint: 'Personal & Family Safety',
      accent: '#10B981'
    },
    {
      title: 'Organise work & commitments',
      description: 'Never miss a promise. Smart escalation, task delegation, and multi-workspace support.',
      icon: 'briefcase-outline',
      personaHint: 'Founders & Professionals',
      accent: '#F59E0B'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true, easing: Easing.in(Easing.ease) }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true, easing: Easing.out(Easing.back(1.2)) }),
      ]).start();
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  const logoSize = Math.min(width * 0.14, 44);

  return (
    <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
      {/* Top bar: Logo + Skip */}
      <View style={styles.topBar}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: logoSize, height: logoSize, resizeMode: 'contain' }}
        />
        <Text style={[styles.personaBadge, { backgroundColor: `${slide.accent}18` , color: slide.accent}]}>
          {slide.personaHint}
        </Text>
        <TouchableOpacity onPress={onComplete}>
          <Text style={[styles.skipText, { fontSize: rf(13) }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Illustration */}
      <Animated.View
        style={[styles.illustrationCard, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={[
          styles.circleIllustration,
          { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: `${slide.accent}15` }
        ]}>
          <View style={[
            styles.innerCircle,
            { width: innerCircleSize, height: innerCircleSize, borderRadius: innerCircleSize / 2, backgroundColor: `${slide.accent}25` }
          ]}>
            <Ionicons name={slide.icon as any} size={isSmall ? 46 : 62} color={slide.accent} />
          </View>
        </View>
      </Animated.View>

      {/* Content */}
      <View style={[styles.contentSection, { paddingHorizontal: isSmall ? 8 : 16 }]}>
        <Text style={[styles.title, { fontSize: rf(isSmall ? 20 : 23) }]}>{slide.title}</Text>
        <Text style={[styles.description, { fontSize: rf(isSmall ? 13 : 14.5), lineHeight: rf(isSmall ? 20 : 22) }]}>
          {slide.description}
        </Text>

        {/* Dots */}
        <View style={styles.indicatorRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentSlide === i
                  ? [styles.activeDot, { backgroundColor: slide.accent }]
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={[styles.buttonSection, { gap: isSmall ? 10 : 14 }]}>
        <TouchableOpacity
          style={[styles.primaryButton, { height: isSmall ? 48 : 54, backgroundColor: slide.accent }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={[styles.primaryButtonText, { fontSize: rf(isSmall ? 15 : 16) }]}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onLoginPress} activeOpacity={0.7}>
          <Text style={[styles.secondaryButtonText, { fontSize: rf(13.5) }]}>
            I already have an account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingBottom: 36,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personaBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  skipText: {
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  illustrationCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  circleIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 22,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#DCD8F0',
  },
  buttonSection: {
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
