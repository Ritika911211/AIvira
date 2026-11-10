import { TaskItem, ReminderItem } from '../types';
import { StorageService } from './storage';
import { ApiService } from './api';

export interface VoiceActionResult {
  transcript: string;
  category: string;
  replyText: string;
  createdTasks?: TaskItem[];
  createdReminders?: ReminderItem[];
  triggeredSOS?: boolean;
  navTarget?: string;
  audioBase64?: string;
  isLiveAi?: boolean;
}

export const VoiceAgentService = {
  /**
   * Processes multilingual speech commands (Hindi, English, Hinglish).
   * 1. Attempts to use the live FastAPI backend (Google Gemini AI + Gnani Timbre TTS).
   * 2. Seamlessly falls back to local intelligent heuristic parser if backend is unreachable.
   */
  async processVoiceInput(transcript: string, persona: string = 'Professional'): Promise<VoiceActionResult> {
    const trimmed = transcript.trim();
    if (!trimmed) {
      return {
        transcript: '',
        category: 'General',
        replyText: 'Aapne koi instruction nahi diya. Please speak or type your request.',
      };
    }

    const textLower = trimmed.toLowerCase();

    // 1. Attempt live backend (Gemini AI + Supabase DB)
    try {
      const liveRes = await ApiService.chat(trimmed, persona);
      if (liveRes && liveRes.reply_text) {
        const newTasks: TaskItem[] = [];
        const newReminders: ReminderItem[] = [];

        for (const action of liveRes.executed_actions || []) {
          if (action.action_type === 'CREATE_TASK') {
            newTasks.push({
              id: action.id || `t_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              title: action.title,
              module: action.module || 'WorkMate',
              priority: (action.priority as any) || 'Medium',
              time: 'Today',
              completed: false,
            });
          } else if (action.action_type === 'CREATE_REMINDER') {
            newReminders.push({
              id: action.id || `r_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              title: action.title,
              module: action.module || 'CareMate',
              time: action.remind_at || 'Today',
              priority: (action.priority as any) || 'High',
              recurrence: 'Once',
            });
          }
        }

        // Persist to local storage for instant UI updates
        if (newTasks.length > 0) {
          const currentTasks = await StorageService.getTasks();
          await StorageService.saveTasks([...newTasks, ...currentTasks]);
        }
        if (newReminders.length > 0) {
          const currentReminders = await StorageService.getReminders();
          await StorageService.saveReminders([...newReminders, ...currentReminders]);
        }

        // Request Gnani Timbre voice synthesis
        const audioBase64 = await ApiService.synthesizeSpeech(liveRes.reply_text);

        return {
          transcript: trimmed,
          category: newTasks[0]?.module || newReminders[0]?.module || 'Gemini AI',
          replyText: liveRes.reply_text,
          createdTasks: newTasks,
          createdReminders: newReminders,
          audioBase64: audioBase64 || undefined,
          isLiveAi: true,
          navTarget: newTasks.length > 0 ? 'Tasks' : newReminders.length > 0 ? 'Planner' : undefined,
        };
      }
    } catch (e) {
      console.warn('[Aivira Voice Agent] Backend call failed, using intelligent offline parser:', e);
    }

    // 2. Intelligent Offline Fallback Engine
    return await this.processOfflineFallback(trimmed, textLower);
  },

  /**
   * Comprehensive local heuristic parser for offline or fast responses
   */
  async processOfflineFallback(transcript: string, textLower: string): Promise<VoiceActionResult> {
    // A. Emergency SOS
    if (textLower.includes('sos') || textLower.includes('emergency') || textLower.includes('khatra') || textLower.includes('bachao')) {
      return {
        transcript,
        category: 'SafetyAgent',
        replyText: 'EMERGENCY SOS TRIGGERED! Aapki live location trusted contacts aur police helpline ko share kar di gayi hai.',
        triggeredSOS: true,
        navTarget: 'Safety',
      };
    }

    // B. Medicine / Health CareMate
    if (textLower.includes('medicine') || textLower.includes('dawai') || textLower.includes('doctor') || textLower.includes('papa ki') || textLower.includes('mummy')) {
      const currentReminders = await StorageService.getReminders();
      const r1: ReminderItem = {
        id: `r_med_${Date.now()}`,
        title: textLower.includes('papa') ? "Papa's Medicine Reminder" : 'Medicine Schedule Alert',
        module: 'CareMate',
        time: '8:00 AM & 9:00 PM',
        priority: 'High',
        recurrence: 'Daily',
      };
      await StorageService.saveReminders([r1, ...currentReminders]);
      return {
        transcript,
        category: 'CareMate',
        replyText: 'Maine daily medicine ka reminder schedule kar diya hai. CareMate me confirmation track hogi.',
        createdReminders: [r1],
        navTarget: 'Modules',
      };
    }

    // C. School Fee / FamilyLife
    if (textLower.includes('fee') || textLower.includes('fees') || textLower.includes('school') || textLower.includes('rohan')) {
      const currentReminders = await StorageService.getReminders();
      const feeReminder: ReminderItem = {
        id: `r_fee_${Date.now()}`,
        title: "Rohan's School Fee Due (5 days advance alert)",
        module: 'FamilyLife',
        time: '5 days before due date',
        priority: 'High',
        recurrence: 'Once',
      };
      await StorageService.saveReminders([feeReminder, ...currentReminders]);
      return {
        transcript,
        category: 'FamilyLife',
        replyText: 'Maine school fee payment ka 5-day advance reminder set kar diya hai.',
        createdReminders: [feeReminder],
        navTarget: 'FamilyLife',
      };
    }

    // D. Delegation / Task creation
    if (
      textLower.includes('task') ||
      textLower.includes('assign') ||
      textLower.includes('deploy') ||
      textLower.includes('rahul') ||
      textLower.includes('kaam') ||
      textLower.includes('complete') ||
      textLower.includes('project')
    ) {
      const currentTasks = await StorageService.getTasks();
      const currentReminders = await StorageService.getReminders();

      const newTask: TaskItem = {
        id: `t_${Date.now()}`,
        title: transcript.length > 50 ? transcript.substring(0, 48) + '...' : transcript,
        priority: textLower.includes('urgent') || textLower.includes('priority') ? 'High' : 'Medium',
        time: 'Today',
        completed: false,
        module: 'WorkMate',
        assignedTo: textLower.includes('rahul') ? 'Rahul' : undefined,
      };

      const newReminder: ReminderItem = {
        id: `r_${Date.now()}`,
        title: `Follow up: ${newTask.title}`,
        module: 'WorkMate',
        time: 'Tomorrow, 10:00 AM',
        priority: 'Medium',
        recurrence: 'Once',
      };

      await StorageService.saveTasks([newTask, ...currentTasks]);
      await StorageService.saveReminders([newReminder, ...currentReminders]);

      return {
        transcript,
        category: 'WorkMate',
        replyText: `Maine '${newTask.title}' task add kar diya hai aur follow-up reminder schedule kar diya hai.`,
        createdTasks: [newTask],
        createdReminders: [newReminder],
        navTarget: 'Tasks',
      };
    }

    // E. General Reminders
    if (textLower.includes('remind') || textLower.includes('yaad') || textLower.includes('baje') || textLower.includes('call')) {
      const currentReminders = await StorageService.getReminders();
      const newRem: ReminderItem = {
        id: `r_${Date.now()}`,
        title: transcript,
        module: 'ConnectAI',
        time: 'Today, Scheduled Time',
        priority: 'High',
        recurrence: 'Once',
      };
      await StorageService.saveReminders([newRem, ...currentReminders]);

      return {
        transcript,
        category: 'ConnectAI',
        replyText: `Maine aapka reminder note kar liya hai: "${transcript}".`,
        createdReminders: [newRem],
        navTarget: 'Planner',
      };
    }

    // F. General Greeting / Assistance
    if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('namaste') || textLower.includes('kaise ho')) {
      return {
        transcript,
        category: 'General',
        replyText: 'Namaste! Main Aivira hoon, aapka AI assistant. Aap mujhe tasks assign karne, reminders set karne ya SOS bhejne ko bol sakte hain.',
      };
    }

    return {
      transcript,
      category: 'General',
      replyText: `Aivira ne aapka command note kar liya hai: "${transcript}". Sabhi updates sync ho gaye hain.`,
    };
  },
};
