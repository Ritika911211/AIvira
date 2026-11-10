import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  isActive?: boolean;
  barCount?: number;
  barColor?: string;
}

export const VoiceWaveform: React.FC<Props> = ({ 
  isActive = true, 
  barCount = 18, 
  barColor = Colors.primary 
}) => {
  const animValues = useRef<Animated.Value[]>(
    Array.from({ length: barCount }, () => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    if (!isActive) return;

    const animations = animValues.map((val, idx) => {
      const minVal = 0.15 + (Math.sin(idx) * 0.1);
      const maxVal = 0.6 + (Math.cos(idx * 0.8) * 0.4);
      
      return Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: maxVal,
            duration: 250 + (idx % 5) * 80,
            useNativeDriver: false,
          }),
          Animated.timing(val, {
            toValue: minVal,
            duration: 250 + (idx % 5) * 80,
            useNativeDriver: false,
          }),
        ])
      );
    });

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [isActive]);

  return (
    <View style={styles.container}>
      {animValues.map((anim, index) => {
        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [6, 48],
        });

        // Alternating colors for depth
        const color = index % 2 === 0 ? Colors.primary : Colors.secondary;

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height,
                backgroundColor: barColor || color,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 4,
    paddingHorizontal: 8,
  },
  bar: {
    width: 3.5,
    borderRadius: 3,
  },
});

