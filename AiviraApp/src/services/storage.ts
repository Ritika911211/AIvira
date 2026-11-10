import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskItem, ReminderItem, CalendarEvent, PromiseItem, MemoryNote, CallRecord, Persona, WorkspaceType } from '../types';

const STORAGE_KEYS = {
  PERSONA: '@aivira_persona',
  WORKSPACE: '@aivira_workspace',
  TASKS: '@aivira_tasks',
  REMINDERS: '@aivira_reminders',
  CALENDAR: '@aivira_calendar',
  PROMISES: '@aivira_promises',
  MEMORIES: '@aivira_memories',
  CALLS: '@aivira_calls',
  SAFE_JOURNEY_ACTIVE: '@aivira_safe_journey_active',
  DRIVE_MODE_ACTIVE: '@aivira_drive_mode_active',
};

// Realistic Seed Data matching Prompt & UI Reference
export const INITIAL_TASKS: TaskItem[] = [
  { id: 't1', title: 'Prepare presentation', priority: 'High', time: 'Today, 11:00 AM', completed: false, module: 'WorkMate' },
  { id: 't2', title: 'Call client', priority: 'Medium', time: 'Today, 4:00 PM', completed: false, module: 'ConnectAI' },
  { id: 't3', title: 'Buy groceries', priority: 'Low', time: 'Tomorrow', completed: false, module: 'HomeMate' },
  { id: 't4', title: 'Pay electricity bill', priority: 'High', time: '18 Apr', completed: false, module: 'MoneyMate' },
  { id: 't5', title: 'Complete project report', priority: 'Medium', time: '20 Apr', completed: false, module: 'WorkMate' },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  { id: 'r1', title: "Rohan's school fee due in 5 days", module: 'FamilyLife', time: '15 Dec', priority: 'High', amount: '₹8,000' },
  { id: 'r2', title: 'Team meeting at 11:00 AM', module: 'WorkMate', time: '11:00 AM', priority: 'Medium' },
  { id: 'r3', title: 'Take medicine at 8:00 PM', module: 'CareMate', time: '8:00 PM', priority: 'High', recurrence: 'Daily' },
];

export const INITIAL_CALENDAR: CalendarEvent[] = [
  { id: 'c1', time: '9:00 AM', title: 'Team Meeting', module: 'WorkMate', color: '#7652EB' },
  { id: 'c2', time: '12:30 PM', title: 'Lunch with Rohan', module: 'ConnectAI', color: '#F59E0B' },
  { id: 'c3', time: '4:00 PM', title: 'Project Review', module: 'WorkMate', color: '#10B981' },
  { id: 'c4', time: '6:00 PM', title: 'Gym', module: 'Personal', color: '#EC4899' },
];

export const INITIAL_PROMISES: PromiseItem[] = [
  { id: 'p1', type: 'PROMISED_BY_ME', targetPerson: 'Peak Ventures (Investor)', promiseText: 'Send updated pitch deck with Q3 metrics', dueDate: 'Today, 6:00 PM', status: 'Open', escalationRule: 'Auto-remind 2h prior' },
  { id: 'p2', type: 'WAITING_FOR', targetPerson: 'Rahul (Tech Lead)', promiseText: 'Production deployment status for website', dueDate: 'Friday, 11:00 AM', status: 'Waiting', escalationRule: 'Escalate to WhatsApp if overdue' },
  { id: 'p3', type: 'PROMISED_BY_ME', targetPerson: 'Mummy', promiseText: 'Call after reaching hotel safely in Goa', dueDate: 'Yesterday', status: 'Fulfilled', escalationRule: 'SafeCircle Arrival Alert' },
];

export const INITIAL_MEMORIES: MemoryNote[] = [
  { id: 'm1', title: 'Meeting with client', snippet: 'Discussed the new website design and agreed on sprint deliverables...', timestamp: 'Today, 10:24 AM', category: 'Notes' },
  { id: 'm2', title: 'Trip to Goa', snippet: 'Flight details and hotel booking confirmation: IndiGo 6E-243 departing at 6 AM...', timestamp: 'Yesterday, 6:12 PM', category: 'Trips' },
  { id: 'm3', title: 'Project Ideas', snippet: 'AI based solution for education and intelligent family coordination...', timestamp: '12 Apr, 4:30 PM', category: 'Notes' },
  { id: 'm4', title: 'Family discussion', snippet: "Rohan's school fee and upcoming quarterly exam schedule reviewed...", timestamp: '10 Apr, 8:45 PM', category: 'Family' },
];

export const INITIAL_CALLS: CallRecord[] = [
  { id: 'call_1', contactName: 'Ritika Sharma', phone: '+91 98765 43210', channel: 'WhatsApp', type: 'Outgoing', timestamp: 'Today, 12:45 PM', duration: '4m 12s' },
  { id: 'call_2', contactName: 'Delivery Manager', phone: '+91 98111 22334', channel: 'Phone', type: 'Missed', timestamp: 'Today, 11:15 AM' },
  { id: 'call_3', contactName: 'Aivira Tech Sync', phone: 'room_team_sync', channel: 'Aivira', type: 'Incoming', timestamp: 'Yesterday, 4:00 PM', duration: '18m' },
];

export const StorageService = {
  async getTasks(): Promise<TaskItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },

  async saveTasks(tasks: TaskItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks', e);
    }
  },

  async getReminders(): Promise<ReminderItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
      return data ? JSON.parse(data) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  },

  async saveReminders(reminders: ReminderItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.warn('Failed to save reminders', e);
    }
  },

  async getMemories(): Promise<MemoryNote[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MEMORIES);
      return data ? JSON.parse(data) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  },

  async saveMemories(memories: MemoryNote[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch (e) {
      console.warn('Failed to save memories', e);
    }
  },

  async getPersona(): Promise<Persona> {
    try {
      const p = await AsyncStorage.getItem(STORAGE_KEYS.PERSONA);
      return (p as Persona) || 'Professional';
    } catch {
      return 'Professional';
    }
  },

  async savePersona(persona: Persona): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PERSONA, persona);
    } catch (e) {
      console.warn('Failed to save persona', e);
    }
  },

  async getWorkspace(): Promise<WorkspaceType> {
    try {
      const w = await AsyncStorage.getItem(STORAGE_KEYS.WORKSPACE);
      return (w as WorkspaceType) || 'Personal';
    } catch {
      return 'Personal';
    }
  },

  async saveWorkspace(workspace: WorkspaceType): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKSPACE, workspace);
    } catch (e) {
      console.warn('Failed to save workspace', e);
    }
  }
};

