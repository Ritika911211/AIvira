export type Persona = 
  | 'Student'
  | 'Parent'
  | 'Professional'
  | 'Business Owner'
  | 'Startup Founder'
  | 'Employee'
  | 'Delivery Executive'
  | 'Women Safety'
  | 'Elderly';

export type WorkspaceType = 'Personal' | 'Family' | 'Business';

export interface TaskItem {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  time: string;
  completed: boolean;
  module: string;
  category?: string;
  assignedTo?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  module: string;
  time: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  recurrence?: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
  confirmed?: boolean;
  amount?: string;
}

export interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  module: string;
  color?: string;
  location?: string;
}

export interface PromiseItem {
  id: string;
  type: 'PROMISED_BY_ME' | 'WAITING_FOR';
  targetPerson: string;
  promiseText: string;
  dueDate: string;
  status: 'Open' | 'Waiting' | 'Fulfilled' | 'Escalated';
  escalationRule: string;
}

export interface MemoryNote {
  id: string;
  title: string;
  snippet: string;
  timestamp: string;
  category: 'Notes' | 'Summaries' | 'Decisions' | 'Trips' | 'Family';
  source?: string;
}

export interface CallRecord {
  id: string;
  contactName: string;
  phone: string;
  channel: 'WhatsApp' | 'Phone' | 'Aivira';
  type: 'Incoming' | 'Outgoing' | 'Missed';
  timestamp: string;
  duration?: string;
}

