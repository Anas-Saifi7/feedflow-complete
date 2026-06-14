import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserPreferences {
  likedTopics: string[];
  avoidedTopics: string[];
}

export interface InstagramConnection {
  username: string;
  connected: boolean;
  connectedAt: string | null;
  lastSync: string | null;
}

export interface AutomationStats {
  actionsCompleted: number;
  sessionsRun: number;
  lastActivity: string | null;
  isActive: boolean;
  progressScore: number;
  dailyTarget: number;
  todayActions: number;
}

interface AppState {
  // User
  userId: string | null;
  name: string;
  email: string;

  // Onboarding
  onboardingComplete: boolean;

  // Instagram
  instagram: InstagramConnection;

  // Preferences
  preferences: UserPreferences;

  // Automation
  automation: AutomationStats;
  automationRunning: boolean;

  // Actions
  setUser: (id: string, name: string, email: string) => void;
  setOnboardingComplete: (v: boolean) => void;
  setInstagram: (data: Partial<InstagramConnection>) => void;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  toggleLikedTopic: (id: string) => void;
  toggleAvoidedTopic: (id: string) => void;
  setAutomation: (data: Partial<AutomationStats>) => void;
  setAutomationRunning: (v: boolean) => void;
  incrementActions: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  reset: () => void;
}

const DEFAULT_STATE = {
  userId: null,
  name: '',
  email: '',
  onboardingComplete: false,
  instagram: {
    username: '',
    connected: false,
    connectedAt: null,
    lastSync: null,
  },
  preferences: {
    likedTopics: [],
    avoidedTopics: [],
  },
  automation: {
    actionsCompleted: 0,
    sessionsRun: 0,
    lastActivity: null,
    isActive: false,
    progressScore: 0,
    dailyTarget: 20,
    todayActions: 0,
  },
  automationRunning: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...DEFAULT_STATE,

  setUser: (id, name, email) => {
    set({ userId: id, name, email });
    get().saveToStorage();
  },

  setOnboardingComplete: (v) => {
    set({ onboardingComplete: v });
    get().saveToStorage();
  },

  setInstagram: (data) => {
    set((s) => ({ instagram: { ...s.instagram, ...data } }));
    get().saveToStorage();
  },

  setPreferences: (prefs) => {
    set((s) => ({ preferences: { ...s.preferences, ...prefs } }));
    get().saveToStorage();
  },

  toggleLikedTopic: (id) => {
    set((s) => {
      const current = s.preferences.likedTopics;
      const updated = current.includes(id)
        ? current.filter((t) => t !== id)
        : [...current, id];
      return { preferences: { ...s.preferences, likedTopics: updated } };
    });
    get().saveToStorage();
  },

  toggleAvoidedTopic: (id) => {
    set((s) => {
      const current = s.preferences.avoidedTopics;
      const updated = current.includes(id)
        ? current.filter((t) => t !== id)
        : [...current, id];
      return { preferences: { ...s.preferences, avoidedTopics: updated } };
    });
    get().saveToStorage();
  },

  setAutomation: (data) => {
    set((s) => ({ automation: { ...s.automation, ...data } }));
    get().saveToStorage();
  },

  setAutomationRunning: (v) => set({ automationRunning: v }),

  incrementActions: () => {
    set((s) => {
      const newTotal = s.automation.actionsCompleted + 1;
      const newToday = s.automation.todayActions + 1;
      const newScore = Math.min(100, Math.floor((newTotal / 100) * 100));
      return {
        automation: {
          ...s.automation,
          actionsCompleted: newTotal,
          todayActions: newToday,
          progressScore: newScore,
          lastActivity: new Date().toISOString(),
        },
      };
    });
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem('@feedflow_state');
      if (data) {
        const parsed = JSON.parse(data);
        set(parsed);
      }
    } catch (e) {
      console.log('Load error:', e);
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      const toSave = {
        userId: state.userId,
        name: state.name,
        email: state.email,
        onboardingComplete: state.onboardingComplete,
        instagram: state.instagram,
        preferences: state.preferences,
        automation: state.automation,
      };
      await AsyncStorage.setItem('@feedflow_state', JSON.stringify(toSave));
    } catch (e) {
      console.log('Save error:', e);
    }
  },

  reset: () => {
    set(DEFAULT_STATE);
    AsyncStorage.removeItem('@feedflow_state');
  },
}));
