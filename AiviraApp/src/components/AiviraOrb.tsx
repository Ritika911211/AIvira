import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../theme/colors';

interface Props {
  size?: number;
  glowColor?: string;
  pulsing?: boolean;
}

export const AiviraOrb: React.FC<Props> = ({ 
  size = 130, 
  glowColor = Colors.primary,
  pulsing = true 
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pulsing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [pulsing]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size * 1.5, height: size * 1.5 }]}>
      {/* Outer ambient glow */}
      <Animated.View
        style={[
          styles.glowOuter,
          {
            width: size * 1.35,
            height: size * 1.35,
            borderRadius: (size * 1.35) / 2,
            backgroundColor: '#C4B5FD33',
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Orbit ring */}
      <Animated.View
        style={[
          styles.orbitRing,
          {
            width: size * 1.45,
            height: size * 1.45,
            borderRadius: (size * 1.45) / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <View style={styles.orbitDot} />
      </Animated.View>

      {/* Main 3D Glowing Sphere */}
      <Animated.View
        style={[
          styles.orbWrapper,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#A78BFA', '#7652EB', '#4C28B5']}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.85, y: 0.9 }}
          style={[styles.orbGradient, { borderRadius: size / 2 }]}
        >
          {/* Internal specular highlight reflection */}
          <View style={styles.specularHighlight} />
          {/* Secondary subtle glow spot */}
          <View style={styles.subtleGlowSpot} />
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
  },
  orbitRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#E0D7FE88',
    borderStyle: 'dashed',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  orbitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: -5,
  },
  orbWrapper: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 14,
  },
  orbGradient: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  specularHighlight: {
    position: 'absolute',
    top: '16%',
    left: '22%',
    width: '28%',
    height: '24%',
    borderRadius: 30,
    backgroundColor: '#FFFFFF99',
    transform: [{ rotate: '-30deg' }],
  },
  subtleGlowSpot: {
    position: 'absolute',
    bottom: '18%',
    right: '20%',
    width: '18%',
    height: '18%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF44',
  },
});

