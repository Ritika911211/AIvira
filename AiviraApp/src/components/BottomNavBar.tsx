import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabName = 'Home' | 'Modules' | 'Planner' | 'Tasks' | 'Memory' | 'More';

interface Props {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  onMicPress?: () => void;
}

export const BottomNavBar: React.FC<Props> = ({ activeTab, onTabChange, onMicPress }) => {
  const { isSmall, rf } = useResponsive();
  const insets = useSafeAreaInsets();

  const tabs: { name: TabName; label: string; icon: string; iconActive: string }[] = [
    { name: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
    { name: 'Modules', label: 'Modules', icon: 'grid-outline', iconActive: 'grid' },
    { name: 'Planner', label: 'Planner', icon: 'calendar-outline', iconActive: 'calendar' },
    { name: 'Tasks', label: 'Tasks', icon: 'checkbox-outline', iconActive: 'checkbox' },
    { name: 'Memory', label: 'Memory', icon: 'bulb-outline', iconActive: 'bulb' },
    { name: 'More', label: 'More', icon: 'ellipsis-horizontal-outline', iconActive: 'ellipsis-horizontal' },
  ];

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding, height: (isSmall ? 56 : 60) + bottomPadding }]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => onTabChange(tab.name)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={isSmall ? 19 : 21}
                color={isActive ? Colors.primary : Colors.secondaryText}
              />
            </View>
            <Text 
              style={[
                styles.tabLabel, 
                { fontSize: rf(isSmall ? 9 : 10.5) },
                isActive && styles.tabLabelActive
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EEF8',
    paddingTop: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 34,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  iconWrapperActive: {
    backgroundColor: '#F3EEFF',
  },
  tabLabel: {
    fontWeight: '500',
    color: Colors.secondaryText,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

