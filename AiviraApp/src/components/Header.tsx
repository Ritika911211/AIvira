import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { Persona, WorkspaceType } from '../types';
import { useResponsive } from '../utils/responsive';

interface HeaderProps {
  greeting?: string;
  subtitle?: string;
  activePersona?: Persona;
  activeWorkspace?: WorkspaceType;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onWorkspacePress?: () => void;
  notificationCount?: number;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  greeting = 'Good morning, Priya!',
  subtitle = "Here's what's important today",
  activePersona = 'Professional',
  activeWorkspace = 'Personal',
  onNotificationPress,
  onProfilePress,
  onWorkspacePress,
  notificationCount = 3,
  showLogo = false,
}) => {
  const { isSmall, rf, horizontalPadding, width } = useResponsive();
  const logoSize = Math.min(width * 0.1, 36);

  return (
    <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
      <View style={styles.leftColumn}>
        {showLogo ? (
          <View style={styles.logoRow}>
            <Image
              source={require('../assets/logo.png')}
              style={{ width: logoSize, height: logoSize, resizeMode: 'contain' }}
            />
            <Text style={[styles.brandText, { fontSize: rf(isSmall ? 17 : 19) }]}>Aivira</Text>
          </View>
        ) : (
          <View style={styles.greetingRow}>
            <Text
              style={[styles.greetingText, { fontSize: rf(isSmall ? 17 : 20) }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {greeting}
            </Text>
            {activeWorkspace && (
              <TouchableOpacity
                style={styles.workspacePill}
                onPress={onWorkspacePress}
                activeOpacity={0.7}
              >
                <Text style={styles.workspaceText}>{activeWorkspace}</Text>
                <Ionicons name="chevron-down" size={10} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}
        {!showLogo && (
          <Text
            style={[styles.subtitleText, { fontSize: rf(isSmall ? 11 : 12.5) }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.iconButton, { width: isSmall ? 34 : 38, height: isSmall ? 34 : 38, borderRadius: isSmall ? 17 : 19 }]}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={isSmall ? 18 : 20} color={Colors.primaryText} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.profileAvatar, { width: isSmall ? 34 : 38, height: isSmall ? 34 : 38, borderRadius: isSmall ? 17 : 19 }]}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          <Text style={[styles.avatarText, { fontSize: rf(isSmall ? 11.5 : 13) }]}>PS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: Colors.background,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontWeight: '800',
    color: Colors.primaryText,
    letterSpacing: -0.4,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  greetingText: {
    fontWeight: '700',
    color: Colors.primaryText,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  workspacePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 2,
  },
  workspaceText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  subtitleText: {
    color: Colors.secondaryText,
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.danger,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 7.5,
    fontWeight: 'bold',
  },
  profileAvatar: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
