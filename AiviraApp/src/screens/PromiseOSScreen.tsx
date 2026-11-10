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
import { PromiseItem } from '../types';
import { useResponsive } from '../utils/responsive';

interface Props {
  onBack: () => void;
  promises: PromiseItem[];
  onTogglePromise: (id: string) => void;
  onAddPromise: (item: Omit<PromiseItem, 'id'>) => void;
}

export const PromiseOSScreen: React.FC<Props> = ({
  onBack,
  promises,
  onTogglePromise,
  onAddPromise,
}) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const [activeTab, setActiveTab] = useState<'PROMISED_BY_ME' | 'WAITING_FOR'>('PROMISED_BY_ME');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPerson, setTargetPerson] = useState('');
  const [promiseText, setPromiseText] = useState('');
  const [dueDate, setDueDate] = useState('Tomorrow, 5:00 PM');
  const [escalationRule, setEscalationRule] = useState('Auto-remind on due date');

  const filteredPromises = promises.filter(p => p.type === activeTab);

  const handleCreatePromise = () => {
    if (targetPerson.trim() && promiseText.trim()) {
      onAddPromise({
        type: activeTab,
        targetPerson: targetPerson.trim(),
        promiseText: promiseText.trim(),
        dueDate,
        status: 'Open',
        escalationRule
      });
      setTargetPerson('');
      setPromiseText('');
      setIsModalOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={[styles.title, { fontSize: rf(isSmall ? 17 : 20) }]}>PromiseOS</Text>
          <Text style={[styles.subtitle, { fontSize: rf(11) }]}>Commitment & Smart Escalation Intelligence</Text>
        </View>
      </View>

      {/* Signature Feature Banner */}
      <View style={styles.signatureBanner}>
        <Ionicons name="sparkles" size={20} color={Colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.signatureHeading}>Signature Aivira Differentiator</Text>
          <Text style={styles.signatureDesc}>
            Tracks what you committed to others and what deliverables you are waiting for. Automatically escalates overdue items.
          </Text>
        </View>
      </View>

      {/* Two Tabs: Promises I Made vs Waiting For */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'PROMISED_BY_ME' && styles.tabButtonActive]}
          onPress={() => setActiveTab('PROMISED_BY_ME')}
        >
          <Ionicons 
            name="arrow-up-circle-outline" 
            size={18} 
            color={activeTab === 'PROMISED_BY_ME' ? Colors.primary : Colors.secondaryText} 
          />
          <Text style={[styles.tabButtonText, activeTab === 'PROMISED_BY_ME' && styles.tabButtonTextActive, { fontSize: rf(isSmall ? 11 : 13) }]}>
            Promises I Made
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'WAITING_FOR' && styles.tabButtonActive]}
          onPress={() => setActiveTab('WAITING_FOR')}
        >
          <Ionicons 
            name="hourglass-outline" 
            size={18} 
            color={activeTab === 'WAITING_FOR' ? Colors.primary : Colors.secondaryText} 
          />
          <Text style={[styles.tabButtonText, activeTab === 'WAITING_FOR' && styles.tabButtonTextActive, { fontSize: rf(isSmall ? 11 : 13) }]}>
            Waiting For
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {filteredPromises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="sparkles-outline" size={44} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No active commitments</Text>
            <Text style={styles.emptySub}>
              Use voice: "Ritika ko kal call karne ka promise kiya tha yaad dilana"
            </Text>
          </View>
        ) : (
          <View style={styles.promisesList}>
            {filteredPromises.map(item => {
              const isDone = item.status === 'Fulfilled';
              return (
                <View key={item.id} style={styles.promiseCard}>
                  <TouchableOpacity 
                    style={styles.promiseCardHeader}
                    onPress={() => onTogglePromise(item.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isDone ? "checkmark-circle" : "ellipse-outline"}
                      size={22}
                      color={isDone ? Colors.success : Colors.primary}
                    />
                    <View style={styles.cardHeaderCol}>
                      <Text style={[styles.targetPersonText, isDone && styles.textCompleted]}>
                        {activeTab === 'PROMISED_BY_ME' ? 'To: ' : 'From: '} {item.targetPerson}
                      </Text>
                      <Text style={styles.dueBadge}>{item.dueDate}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: isDone ? '#ECFDF5' : '#FFF7ED' }]}>
                      <Text style={[styles.statusBadgeText, { color: isDone ? '#065F46' : '#C2410C' }]}>
                        {item.status}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <Text style={[styles.promiseText, isDone && styles.textCompleted]}>
                    "{item.promiseText}"
                  </Text>

                  {/* Escalation rule indicator */}
                  <View style={styles.escalationRuleRow}>
                    <Ionicons name="notifications-outline" size={14} color="#7652EB" />
                    <Text style={styles.escalationRuleText}>
                      Escalation: {item.escalationRule}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.addBtnText}>
            {activeTab === 'PROMISED_BY_ME' ? 'Record New Promise' : 'Track Pending Item'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal to add promise */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>
                {activeTab === 'PROMISED_BY_ME' ? 'Record A Promise You Made' : 'Track Deliverable You Are Waiting For'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder={activeTab === 'PROMISED_BY_ME' ? 'Person promised to (e.g. Investor / Rahul)' : 'Person delivering (e.g. Client / Designer)'}
              placeholderTextColor="#9CA3AF"
              value={targetPerson}
              onChangeText={setTargetPerson}
            />

            <TextInput
              style={[styles.modalInput, { height: 70, textAlignVertical: 'top' }]}
              placeholder="What was promised? (e.g. Send updated pitch deck with Q3 metrics)"
              placeholderTextColor="#9CA3AF"
              value={promiseText}
              onChangeText={setPromiseText}
              multiline
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Due date (e.g. Friday, 11:00 AM)"
              placeholderTextColor="#9CA3AF"
              value={dueDate}
              onChangeText={setDueDate}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Escalation rule (e.g. Remind 2h prior, notify via WhatsApp)"
              placeholderTextColor="#9CA3AF"
              value={escalationRule}
              onChangeText={setEscalationRule}
            />

            <TouchableOpacity 
              style={styles.modalSubmitBtn}
              onPress={handleCreatePromise}
            >
              <Text style={styles.modalSubmitBtnText}>Save to PromiseOS</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  backBtn: {
    paddingRight: 14,
  },
  headerTitleCol: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  signatureBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3EEFF',
    margin: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6DEFC',
    gap: 10,
  },
  signatureHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 2,
  },
  signatureDesc: {
    fontSize: 11,
    color: Colors.primaryText,
    lineHeight: 16,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#F3EEFF',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  tabButtonTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  promisesList: {
    gap: 12,
  },
  promiseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  promiseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderCol: {
    flex: 1,
    marginLeft: 10,
  },
  targetPersonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  dueBadge: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  promiseText: {
    fontSize: 14,
    color: Colors.primaryText,
    lineHeight: 20,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  escalationRuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8FC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  escalationRuleText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryText,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 4,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0EEF8',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 14,
  },
  addBtnText: {
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
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  modalInput: {
    backgroundColor: '#F8F8FC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE7F5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.primaryText,
    marginBottom: 10,
  },
  modalSubmitBtn: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalSubmitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

