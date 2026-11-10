import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const { width, height, rf, isSmall } = useResponsive();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotScale1 = useRef(new Animated.Value(0.5)).current;
  const dotScale2 = useRef(new Animated.Value(0.5)).current;
  const dotScale3 = useRef(new Animated.Value(0.5)).current;

  const logoSize = Math.min(width * 0.62, isSmall ? 180 : 220);

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Tagline fade-in after logo
    setTimeout(() => {
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 500);

    // Pulsing loading dots
    const pulseDots = () => {
      const makePulse = (anim: Animated.Value, delay: number) =>
        Animated.sequence([
          Animated.delay(delay),
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
              Animated.timing(anim, { toValue: 0.4, duration: 400, useNativeDriver: true }),
            ])
          ),
        ]);
      Animated.parallel([
        makePulse(dotScale1, 0),
        makePulse(dotScale2, 180),
        makePulse(dotScale3, 360),
      ]).start();
    };
    setTimeout(pulseDots, 400);

    // Navigate after 2.8s
    const timer = setTimeout(onFinish, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Background gradient circles */}
      <View style={[styles.bgCircle1, { width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4 }]} />
      <View style={[styles.bgCircle2, { width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25 }]} />

      {/* Logo + Brand */}
      <View style={styles.centerContent}>
        <Animated.View
          style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
        >
          <Image
            source={require('../assets/logo.png')}
            style={{ width: logoSize, height: logoSize, resizeMode: 'contain' }}
          />
        </Animated.View>

        <Animated.View style={[styles.textBlock, { opacity: taglineOpacity }]}>
          <Text style={[styles.tagline, { fontSize: rf(isSmall ? 11 : 12.5) }]}>
            Powered by Gnani.ai
          </Text>
        </Animated.View>
      </View>

      {/* Animated loading dots */}
      <Animated.View style={[styles.dotsRow, { opacity: taglineOpacity }]}>
        {[dotScale1, dotScale2, dotScale3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { opacity: dot }]}
          />
        ))}
      </Animated.View>

      <Text style={[styles.loadingText, { fontSize: rf(11) }]}>
        Loading your smart assistant...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    backgroundColor: '#EEE9FF',
    top: -60,
    left: -80,
    opacity: 0.6,
  },
  bgCircle2: {
    position: 'absolute',
    backgroundColor: '#E0D6FF',
    bottom: 40,
    right: -60,
    opacity: 0.4,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  tagline: {
    color: '#77758A',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 36,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  loadingText: {
    marginTop: 12,
    color: '#77758A',
    fontWeight: '500',
  },
});
