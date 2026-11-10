import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { TaskItem } from '../types';
import { useResponsive } from '../utils/responsive';

interface Props {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, priority: 'Low' | 'Medium' | 'High') => void;
}

export const TasksScreen: React.FC<Props> = ({ tasks, onToggleTask, onAddTask }) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const [activeTab, setActiveTab] = useState<'All' | 'Today' | 'Upcoming' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'Completed') return t.completed;
    if (activeTab === 'Today') return !t.completed && (t.time.includes('Today') || t.time.includes('AM') || t.time.includes('PM'));
    if (activeTab === 'Upcoming') return !t.completed && (t.time.includes('Apr') || t.time.includes('Tomorrow') || t.time.includes('Dec'));
    return true; // All
  });

  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), newTaskPriority);
      setNewTaskTitle('');
      setIsModalOpen(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
      case 'Urgent':
        return Colors.danger;
      case 'Medium':
        return Colors.warning;
      case 'Low':
      default:
        return Colors.success;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <Text style={[styles.title, { fontSize: rf(isSmall ? 19 : 22) }]}>Tasks</Text>

        {/* Filter Tabs */}
        <View style={styles.tabBar}>
          {(['All', 'Today', 'Upcoming', 'Completed'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, { fontSize: rf(isSmall ? 11 : 12) }, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkbox-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>All responsibilities in this view are up to date.</Text>
          </View>
        ) : (
          <View style={styles.tasksList}>
            {filteredTasks.map(task => {
              const pColor = getPriorityColor(task.priority);
              return (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskCard}
                  onPress={() => onToggleTask(task.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={task.completed ? "checkbox" : "square-outline"}
                    size={24}
                    color={task.completed ? Colors.primary : "#9CA3AF"}
                  />

                  <View style={styles.taskTextColumn}>
                    <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskMetaRow}>
                      <View style={[styles.priorityDot, { backgroundColor: pColor }]} />
                      <Text style={[styles.priorityText, { color: pColor }]}>
                        {task.priority}
                      </Text>
                      <Text style={styles.dotDivider}>•</Text>
                      <Text style={styles.timeText}>{task.time}</Text>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Bottom Floating "+ Add Task" button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.addTaskButton}
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.addTaskButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Add Task Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Task</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="What needs to be done?"
              placeholderTextColor="#9CA3AF"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />

            <Text style={styles.modalPriorityLabel}>Priority</Text>
            <View style={styles.prioritySelectorRow}>
              {(['Low', 'Medium', 'High'] as const).map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityChoicePill,
                    newTaskPriority === p && styles.priorityChoiceActive,
                  ]}
                  onPress={() => setNewTaskPriority(p)}
                >
                  <Text
                    style={[
                      styles.priorityChoiceText,
                      newTaskPriority === p && styles.priorityChoiceTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.modalSubmitBtn}
              onPress={handleCreateTask}
            >
              <Text style={styles.modalSubmitBtnText}>Create Task</Text>
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
    paddingHorizontal: 20,
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
  tabBar: {
    flexDirection: 'row',
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  tabPillActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  tasksList: {
    gap: 10,
  },
  taskCard: {
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
  taskTextColumn: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dotDivider: {
    marginHorizontal: 6,
    color: '#CBD5E1',
    fontSize: 10,
  },
  timeText: {
    fontSize: 11,
    color: Colors.secondaryText,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0EEF8',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  addTaskButtonText: {
    color: '#FFFFFF',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  modalInput: {
    backgroundColor: '#F8F8FC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE7F5',
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: Colors.primaryText,
    marginBottom: 16,
  },
  modalPriorityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  prioritySelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  priorityChoicePill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  priorityChoiceActive: {
    backgroundColor: Colors.primary,
  },
  priorityChoiceText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  priorityChoiceTextActive: {
    color: '#FFF',
  },
  modalSubmitBtn: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

