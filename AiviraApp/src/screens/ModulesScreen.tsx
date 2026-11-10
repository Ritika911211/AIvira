import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface Props {
  onSelectModule: (moduleKey: string) => void;
}

export const ModulesScreen: React.FC<Props> = ({ onSelectModule }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isSmall, isTablet, rf, horizontalPadding } = useResponsive();

  const categories = ['All', 'Personal Life', 'Communication', 'Productivity', 'Health & Safety', 'Business', 'Intelligence'];

  const moduleCatalog = [
    {
      id: 'FamilyLife',
      title: 'Family & Child',
      subtitle: 'School, family, home',
      description: 'Fee reminders, homework tracker, exam alerts & family calendar.',
      icon: 'people',
      color: '#F97316',
      bgColor: '#FFF7ED',
      category: 'Personal Life',
    },
    {
      id: 'Calling',
      title: 'AI Calling',
      subtitle: 'WhatsApp, Phone, Aivira',
      description: 'Voice calling assistant with scheduling and hands-free control.',
      icon: 'call',
      color: '#10B981',
      bgColor: '#ECFDF5',
      category: 'Communication',
    },
    {
      id: 'Productivity',
      title: 'Productivity',
      subtitle: 'Tasks, Planner, Work',
      description: 'Smart planner, recurring tasks, deadline management.',
      icon: 'checkbox',
      color: '#7652EB',
      bgColor: '#F5F3FF',
      category: 'Productivity',
    },
    {
      id: 'Safety',
      title: 'Health & Safety',
      subtitle: 'Care, Safety Agent',
      description: 'SafeCircle SOS, live location tracking, SafeWalk check-ins.',
      icon: 'shield-checkmark',
      color: '#06B6D4',
      bgColor: '#ECFEFF',
      category: 'Health & Safety',
    },
    {
      id: 'Business',
      title: 'Business & Founder',
      subtitle: 'Founder, Team, Clients',
      description: 'Investor follow-ups, client commitments & team coordination.',
      icon: 'briefcase',
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      category: 'Business',
    },
    {
      id: 'Travel',
      title: 'TravelMate',
      subtitle: 'Trips, Transport, Hotels',
      description: 'Packing checklists, train & flight reminders, itinerary.',
      icon: 'airplane',
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      category: 'Personal Life',
    },
    {
      id: 'MoneyMate',
      title: 'MoneyMate',
      subtitle: 'Bills, EMI, Dues, Fees',
      description: 'Utility bills, house rent, EMI instalments & payment tracking.',
      icon: 'card',
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      category: 'Personal Life',
    },
    {
      id: 'DriveSafe',
      title: 'DriveSafe Rider',
      subtitle: 'Hands-free delivery mode',
      description: 'Voice delivery directions, auto-replies while on the road.',
      icon: 'bicycle',
      color: '#14B8A6',
      bgColor: '#F0FDFA',
      category: 'Communication',
    },
    {
      id: 'CareMate',
      title: 'CareMate Health',
      subtitle: 'Medicines & Elderly care',
      description: 'Daily medicine alarms, confirmation checks & doctor visits.',
      icon: 'medical',
      color: '#EF4444',
      bgColor: '#FEF2F2',
      category: 'Health & Safety',
    },
    {
      id: 'PromiseOS',
      title: 'PromiseOS',
      subtitle: 'Promises & Waiting For',
      description: 'Tracks personal commitments and smart escalation rules.',
      icon: 'sparkles',
      color: '#6366F1',
      bgColor: '#EEF2FF',
      category: 'Intelligence',
    },
    {
      id: 'MemoryOS',
      title: 'MemoryOS',
      subtitle: 'Voice Notes & AI RAG',
      description: 'Semantic memory retrieval: Ask your memory anything.',
      icon: 'bulb',
      color: '#EC4899',
      bgColor: '#FDF2F8',
      category: 'Intelligence',
    },
    {
      id: 'HomeMate',
      title: 'HomeMate',
      subtitle: 'Chores, Gas, Domestic Help',
      description: 'Appliance service dates, domestic help schedule & home dues.',
      icon: 'home',
      color: '#10B981',
      bgColor: '#ECFDF5',
      category: 'Personal Life',
    },
  ];

  const filteredModules = moduleCatalog.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Aivira Modules</Text>
        <Text style={styles.subtitle}>Explore all 20 AI personal & business operating modules</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search modules (e.g. fees, medicine, safe)..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                selectedCategory === cat && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Grid of Modules */}
      <ScrollView contentContainerStyle={[styles.gridContent, { paddingHorizontal: isSmall ? 12 : 16 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.grid, { gap: isSmall ? 8 : 12 }]}>
          {filteredModules.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                { width: isSmall ? '48.5%' : isTablet ? '31.5%' : '48%' }
              ]}
              onPress={() => onSelectModule(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: item.bgColor, width: isSmall ? 38 : 44, height: isSmall ? 38 : 44 }]}>
                <Ionicons name={item.icon as any} size={isSmall ? 20 : 24} color={item.color} />
              </View>
              <Text style={[styles.cardTitle, { fontSize: rf(isSmall ? 12.5 : 14) }]}>{item.title}</Text>
              <Text style={[styles.cardSubtitle, { fontSize: rf(isSmall ? 10 : 11) }]} numberOfLines={1}>{item.subtitle}</Text>
              <Text style={[styles.cardDesc, { fontSize: rf(isSmall ? 10 : 11) }]} numberOfLines={2}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8FC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE7F5',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryText,
  },
  categoryRow: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  gridContent: {
    padding: 16,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 11,
    color: Colors.secondaryText,
    lineHeight: 15,
  },
});

