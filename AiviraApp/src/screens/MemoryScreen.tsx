import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { MemoryNote } from '../types';
import { useResponsive } from '../utils/responsive';

interface Props {
  memories: MemoryNote[];
  onAddMemory: (title: string, snippet: string, category: 'Notes' | 'Summaries' | 'Trips' | 'Family') => void;
}

export const MemoryScreen: React.FC<Props> = ({ memories, onAddMemory }) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const [activeTab, setActiveTab] = useState<'Notes' | 'Summaries' | 'Search'>('Notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSnippet, setNewSnippet] = useState('');
  const [newCategory, setNewCategory] = useState<'Notes' | 'Summaries' | 'Trips' | 'Family'>('Notes');
  const [askResult, setAskResult] = useState<string | null>(null);

  const filteredMemories = memories.filter(m => {
    if (activeTab === 'Search' || searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.snippet.toLowerCase().includes(q);
    }
    if (activeTab === 'Summaries') return m.category === 'Summaries' || m.title.toLowerCase().includes('discussion') || m.title.toLowerCase().includes('meeting');
    return true; // Notes
  });

  const handleAskMemory = () => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('investor') || q.includes('deck') || q.includes('meeting')) {
      setAskResult("From Meeting with Client (Today 10:24 AM) & Founder Notes: Decided to finalize Sprint 1 website deliverables and send updated pitch deck with Q3 metrics by today evening.");
    } else if (q.includes('goa') || q.includes('flight') || q.includes('trip')) {
      setAskResult("From Trip to Goa (Yesterday 6:12 PM): IndiGo flight 6E-243 departing at 6:00 AM, Taj Vivanta booking confirmed, packing checklist prepared.");
    } else if (q.includes('fee') || q.includes('rohan') || q.includes('school')) {
      setAskResult("From Family discussion (10 Apr 8:45 PM): Rohan's school fee of ₹8,000 due on 15 Dec, unit test begins 22nd.");
    } else {
      setAskResult(`Found 1 relevant note: "${filteredMemories[0]?.title || 'Client Notes'}" matching "${searchQuery}".`);
    }
  };

  const handleSaveNote = () => {
    if (newTitle.trim()) {
      onAddMemory(newTitle.trim(), newSnippet.trim() || 'No additional details provided.', newCategory);
      setNewTitle('');
      setNewSnippet('');
      setIsModalOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <Text style={[styles.title, { fontSize: rf(isSmall ? 19 : 22) }]}>Memory</Text>

        {/* Tab Selection */}
        <View style={styles.tabContainer}>
          {(['Notes', 'Summaries', 'Search'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Semantic "Ask Your Memory" Search Box */}
        <View style={styles.searchBar}>
          <Ionicons name="sparkles" size={18} color={Colors.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ask your memory: 'Last week meeting mein kya decide hua?'"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleAskMemory}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleAskMemory} style={styles.askButton}>
              <Text style={styles.askButtonText}>Ask</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Semantic Search AI Answer Card */}
        {askResult && (
          <View style={styles.aiAnswerCard}>
            <View style={styles.aiAnswerHeader}>
              <Ionicons name="bulb" size={18} color={Colors.primary} />
              <Text style={styles.aiAnswerTitle}>AI Memory Retrieval</Text>
            </View>
            <Text style={styles.aiAnswerText}>{askResult}</Text>
            <TouchableOpacity onPress={() => setAskResult(null)} style={styles.dismissLink}>
              <Text style={styles.dismissLinkText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Memories List */}
        <View style={styles.notesList}>
          {filteredMemories.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.noteCard}
              onPress={() => Alert.alert(item.title, `${item.snippet}\n\nTimestamp: ${item.timestamp}\nCategory: ${item.category}`)}
              activeOpacity={0.75}
            >
              <View style={styles.noteIconCircle}>
                <Ionicons name="document-text" size={20} color={Colors.primary} />
              </View>

              <View style={styles.noteTextCol}>
                <View style={styles.noteTitleRow}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <Text style={styles.noteTime}>{item.timestamp}</Text>
                </View>
                <Text style={styles.noteSnippet} numberOfLines={2}>
                  {item.snippet}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* FAB "+ New Note" */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setIsModalOpen(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" style={{ marginRight: 6 }} />
        <Text style={[styles.fabText, { fontSize: rf(14) }]}>New Note</Text>
      </TouchableOpacity>

      {/* Modal to add new memory note */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Add Memory Note</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Title (e.g. Meeting with Client)"
              placeholderTextColor="#9CA3AF"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TextInput
              style={[styles.modalInput, { height: 90, textAlignVertical: 'top' }]}
              placeholder="Enter note or transcription..."
              placeholderTextColor="#9CA3AF"
              value={newSnippet}
              onChangeText={setNewSnippet}
              multiline
            />

            <TouchableOpacity 
              style={styles.modalSaveBtn}
              onPress={handleSaveNote}
            >
              <Text style={styles.modalSaveBtnText}>Save to Memory</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8FC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE7F5',
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.primaryText,
  },
  askButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  askButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },  aiAnswerCard: {
    backgroundColor: '#F3EEFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6DEFC',
    padding: 16,
    marginBottom: 16,
  },
  aiAnswerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiAnswerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  aiAnswerText: {
    fontSize: 13,
    color: Colors.primaryText,
    lineHeight: 18,
  },
  dismissLink: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  dismissLinkText: {
    fontSize: 11,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  notesList: {
    gap: 12,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  noteIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  noteTextCol: {
    flex: 1,
  },
  noteTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  noteTime: {
    fontSize: 11,
    color: Colors.secondaryText,
  },
  noteSnippet: {
    fontSize: 12,
    color: Colors.secondaryText,
    lineHeight: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 26,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  modalInput: {
    backgroundColor: '#F8F8FC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE7F5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.primaryText,
    marginBottom: 12,
  },
  modalSaveBtn: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalSaveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

