import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Modal,
  StatusBar
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Theme & Types
import { Colors } from './src/theme/colors';
import { Persona, WorkspaceType, TaskItem, ReminderItem, CalendarEvent, PromiseItem, MemoryNote, CallRecord } from './src/types';
import { 
  StorageService, 
  INITIAL_TASKS, 
  INITIAL_REMINDERS, 
  INITIAL_CALENDAR, 
  INITIAL_PROMISES, 
  INITIAL_MEMORIES, 
  INITIAL_CALLS 
} from './src/services/storage';

// Components
import { Header } from './src/components/Header';
import { BottomNavBar, TabName } from './src/components/BottomNavBar';

// Screens
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { PersonaSelectionScreen } from './src/screens/PersonaSelectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ModulesScreen } from './src/screens/ModulesScreen';
import { FamilyLifeScreen } from './src/screens/FamilyLifeScreen';
import { SafetyAgentScreen } from './src/screens/SafetyAgentScreen';
import { DriveSafeScreen } from './src/screens/DriveSafeScreen';
import { PlannerScreen } from './src/screens/PlannerScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { MemoryScreen } from './src/screens/MemoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { CallingScreen } from './src/screens/CallingScreen';
import { CareMateScreen } from './src/screens/CareMateScreen';
import { MoneyMateScreen } from './src/screens/MoneyMateScreen';
import { PromiseOSScreen } from './src/screens/PromiseOSScreen';

// Modals
import { VoiceAssistantModal } from './src/screens/VoiceAssistantModal';
import { SafetyAlertModal } from './src/screens/SafetyAlertModal';
import { DailyBriefingModal } from './src/screens/DailyBriefingModal';
import { VoiceActionResult } from './src/services/voiceAgent';

export default function App() {
  // App Phase: 'splash' | 'onboarding' | 'auth' | 'persona' | 'main'
  const [appPhase, setAppPhase] = useState<'splash' | 'onboarding' | 'auth' | 'persona' | 'main'>('splash');
  
  // Active Navigation
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceInitialPrompt, setVoiceInitialPrompt] = useState<string | undefined>(undefined);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);

  // User State
  const [persona, setPersona] = useState<Persona>('Professional');
  const [workspace, setWorkspace] = useState<WorkspaceType>('Personal');

  // Reactive Data
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR);
  const [promises, setPromises] = useState<PromiseItem[]>(INITIAL_PROMISES);
  const [memories, setMemories] = useState<MemoryNote[]>(INITIAL_MEMORIES);
  const [callHistory, setCallHistory] = useState<CallRecord[]>(INITIAL_CALLS);

  // Load persisted data on launch
  useEffect(() => {
    (async () => {
      const savedTasks = await StorageService.getTasks();
      const savedReminders = await StorageService.getReminders();
      const savedMemories = await StorageService.getMemories();
      const savedPersona = await StorageService.getPersona();
      const savedWorkspace = await StorageService.getWorkspace();
      
      setTasks(savedTasks);
      setReminders(savedReminders);
      setMemories(savedMemories);
      setPersona(savedPersona);
      setWorkspace(savedWorkspace);
    })();
  }, []);

  // Handlers
  const handleToggleTask = async (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    await StorageService.saveTasks(updated);
  };

  const handleAddTask = async (title: string, priority: 'Low' | 'Medium' | 'High') => {
    const newTask: TaskItem = {
      id: `t_${Date.now()}`,
      title,
      priority,
      time: 'Today',
      completed: false,
      module: 'Productivity'
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    await StorageService.saveTasks(updated);
  };

  const handleAddMemory = async (title: string, snippet: string, category: 'Notes' | 'Summaries' | 'Trips' | 'Family') => {
    const newNote: MemoryNote = {
      id: `m_${Date.now()}`,
      title,
      snippet,
      timestamp: 'Just now',
      category
    };
    const updated = [newNote, ...memories];
    setMemories(updated);
    await StorageService.saveMemories(updated);
  };

  const handleTogglePromise = (id: string) => {
    const updated = promises.map(p => p.id === id ? { ...p, status: p.status === 'Fulfilled' ? ('Open' as const) : ('Fulfilled' as const) } : p);
    setPromises(updated);
  };

  const handleAddPromise = (item: Omit<PromiseItem, 'id'>) => {
    const newPromise: PromiseItem = {
      id: `p_${Date.now()}`,
      ...item
    };
    setPromises([newPromise, ...promises]);
  };

  const handleVoiceActionComplete = (result: VoiceActionResult) => {
    // If voice created tasks or reminders, refresh state
    if (result.createdTasks) {
      setTasks(prev => [...result.createdTasks!, ...prev]);
    }
    if (result.createdReminders) {
      setReminders(prev => [...result.createdReminders!, ...prev]);
    }
    if (result.triggeredSOS) {
      setIsVoiceModalOpen(false);
      setIsSOSModalOpen(true);
      return;
    }
    // Update active tab or subscreen in background without closing modal prematurely
    if (result.navTarget) {
      if (['Tasks', 'Planner', 'Memory', 'Modules'].includes(result.navTarget)) {
        setActiveTab(result.navTarget as TabName);
      } else {
        setActiveSubScreen(result.navTarget);
      }
    }
  };

  const handleOpenVoice = (prompt?: string) => {
    setVoiceInitialPrompt(prompt);
    setIsVoiceModalOpen(true);
  };

  const handleNavigate = (screenKey: string) => {
    if (['Home', 'Modules', 'Planner', 'Tasks', 'Memory', 'More'].includes(screenKey)) {
      setActiveTab(screenKey as TabName);
      setActiveSubScreen(null);
    } else {
      setActiveSubScreen(screenKey);
    }
  };

  const handleSelectPersona = async (p: Persona) => {
    setPersona(p);
    await StorageService.savePersona(p);
  };

  const handleSelectWorkspace = async (w: WorkspaceType) => {
    setWorkspace(w);
    await StorageService.saveWorkspace(w);
  };

  // Render entry flow screens
  if (appPhase === 'splash') {
    return <SplashScreen onFinish={() => setAppPhase('onboarding')} />;
  }

  if (appPhase === 'onboarding') {
    return (
      <OnboardingScreen 
        onComplete={() => setAppPhase('persona')} 
        onLoginPress={() => setAppPhase('auth')} 
      />
    );
  }

  if (appPhase === 'auth') {
    return (
      <AuthScreen 
        onSuccess={() => setAppPhase('persona')} 
      />
    );
  }

  if (appPhase === 'persona') {
    return (
      <PersonaSelectionScreen 
        selectedPersona={persona}
        onSelectPersona={handleSelectPersona}
        onProceed={() => setAppPhase('main')}
      />
    );
  }

  // Render Sub-Screens if active
  const renderSubScreen = () => {
    switch (activeSubScreen) {
      case 'FamilyLife':
        return <FamilyLifeScreen onBack={() => setActiveSubScreen(null)} onOpenVoice={handleOpenVoice} />;
      case 'Safety':
        return (
          <SafetyAgentScreen 
            onBack={() => setActiveSubScreen(null)} 
            onTriggerSOS={() => setIsSOSModalOpen(true)}
            onOpenDriveSafe={() => setActiveSubScreen('DriveSafe')}
          />
        );
      case 'DriveSafe':
        return <DriveSafeScreen onBack={() => setActiveSubScreen(null)} onOpenCalling={() => setActiveSubScreen('Calling')} />;
      case 'Calling':
        return <CallingScreen onBack={() => setActiveSubScreen(null)} callHistory={callHistory} />;
      case 'CareMate':
        return <CareMateScreen onBack={() => setActiveSubScreen(null)} onOpenVoice={handleOpenVoice} />;
      case 'MoneyMate':
        return <MoneyMateScreen onBack={() => setActiveSubScreen(null)} onOpenVoice={handleOpenVoice} />;
      case 'PromiseOS':
        return (
          <PromiseOSScreen 
            onBack={() => setActiveSubScreen(null)} 
            promises={promises}
            onTogglePromise={handleTogglePromise}
            onAddPromise={handleAddPromise}
          />
        );
      default:
        return null;
    }
  };

  // Render Main Tab Screen
  const renderTabContent = () => {
    if (activeSubScreen) {
      return renderSubScreen();
    }

    switch (activeTab) {
      case 'Home':
        return (
          <HomeScreen
            persona={persona}
            workspace={workspace}
            tasks={tasks}
            reminders={reminders}
            onToggleTask={handleToggleTask}
            onOpenVoiceModal={handleOpenVoice}
            onOpenDailyBriefing={() => setIsBriefingModalOpen(true)}
            onNavigate={handleNavigate}
          />
        );
      case 'Modules':
        return (
          <ModulesScreen 
            onSelectModule={handleNavigate}
          />
        );
      case 'Planner':
        return (
          <PlannerScreen 
            calendarEvents={calendarEvents} 
            onAddEvent={() => handleOpenVoice("Schedule a new meeting for tomorrow 11 AM")}
          />
        );
      case 'Tasks':
        return (
          <TasksScreen 
            tasks={tasks} 
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
          />
        );
      case 'Memory':
        return (
          <MemoryScreen 
            memories={memories} 
            onAddMemory={handleAddMemory}
          />
        );
      case 'More':
        return (
          <SettingsScreen 
            persona={persona}
            workspace={workspace}
            onChangePersona={() => setIsPersonaModalOpen(true)}
            onChangeWorkspace={handleSelectWorkspace}
            onLogout={() => setAppPhase('auth')}
            onOpenCalling={() => setActiveSubScreen('Calling')}
            onOpenSafety={() => setActiveSubScreen('Safety')}
            onOpenPromises={() => setActiveSubScreen('PromiseOS')}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFF" />

        {/* Main Top Header (hidden on deep sub-screens) */}
        {!activeSubScreen && (
          <Header 
            greeting="Good morning, Priya!"
            subtitle={activeTab === 'Home' ? "Here's what's important today" : `Active Persona: ${persona}`}
            activePersona={persona}
            activeWorkspace={workspace}
            onNotificationPress={() => setIsBriefingModalOpen(true)}
            onProfilePress={() => setActiveTab('More')}
            onWorkspacePress={() => {
              const nextWs = workspace === 'Personal' ? 'Family' : workspace === 'Family' ? 'Business' : 'Personal';
              handleSelectWorkspace(nextWs);
            }}
            notificationCount={3}
          />
        )}

        {/* Main Content Area */}
        <View style={styles.contentArea}>
          {renderTabContent()}
        </View>

        {/* Bottom Navigation Bar (always accessible) */}
        <BottomNavBar 
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveSubScreen(null);
            setActiveTab(tab);
          }}
          onMicPress={() => handleOpenVoice()}
        />

        {/* Voice Assistant Modal (Screen 11 in collage) */}
        <Modal visible={isVoiceModalOpen} animationType="slide">
          <VoiceAssistantModal 
            initialPrompt={voiceInitialPrompt}
            onClose={() => setIsVoiceModalOpen(false)}
            onActionComplete={handleVoiceActionComplete}
          />
        </Modal>

        {/* Emergency SOS Modal (Screen 14 in collage) */}
        <Modal visible={isSOSModalOpen} animationType="fade">
          <SafetyAlertModal 
            onDismiss={() => setIsSOSModalOpen(false)}
          />
        </Modal>

        {/* Daily AI Briefing Modal (Screen 15 in collage) */}
        <Modal visible={isBriefingModalOpen} animationType="slide">
          <DailyBriefingModal 
            onClose={() => setIsBriefingModalOpen(false)}
            onOpenVoice={handleOpenVoice}
          />
        </Modal>

        {/* Persona Switcher Modal */}
        <Modal visible={isPersonaModalOpen} animationType="slide">
          <PersonaSelectionScreen 
            selectedPersona={persona}
            onSelectPersona={handleSelectPersona}
            onProceed={() => setIsPersonaModalOpen(false)}
          />
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  contentArea: {
    flex: 1,
  },
});
