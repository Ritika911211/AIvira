import React from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { useResponsive } from '../utils/responsive';

interface AiviraLogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
  horizontal?: boolean;
}

export const AiviraLogo: React.FC<AiviraLogoProps> = ({
  size,
  showText = false,
  showTagline = false,
  horizontal = false,
}) => {
  const { width, rf, isSmall } = useResponsive();
  const logoSize = size || Math.min(width * 0.14, 52);

  if (horizontal) {
    return (
      <View style={styles.row}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: logoSize, height: logoSize, resizeMode: 'contain' }}
        />
        {showText && (
          <Text style={[styles.brandText, { fontSize: rf(isSmall ? 18 : 20) }]}>
            Aivira
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Image
        source={require('../assets/logo.png')}
        style={{ width: logoSize, height: logoSize, resizeMode: 'contain' }}
      />
      {showText && (
        <Text style={[styles.brandText, { fontSize: rf(isSmall ? 18 : 22) }]}>
          Aivira
        </Text>
      )}
      {showTagline && (
        <Text style={[styles.tagline, { fontSize: rf(isSmall ? 11 : 12) }]}>
          Your Life. Your Work. One AI.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: {
    fontWeight: '800',
    color: '#17152B',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  tagline: {
    color: '#77758A',
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});

