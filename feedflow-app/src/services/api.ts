import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://feedflow-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@feedflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ──────────────────────────────────────────────
export const authService = {
  register: async (name: string, email: string, password: string) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    await AsyncStorage.setItem('@feedflow_token', res.data.token);
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    await AsyncStorage.setItem('@feedflow_token', res.data.token);
    return res.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('@feedflow_token');
  },
};

// ─── Preferences ───────────────────────────────────────
export const preferencesService = {
  save: async (userId: string, liked: string[], avoided: string[]) => {
    const res = await api.post('/api/preferences', {
      userId,
      likedTopics: liked,
      avoidedTopics: avoided,
    });
    return res.data;
  },

  get: async (userId: string) => {
    const res = await api.get(`/api/preferences/${userId}`);
    return res.data;
  },
};

// ─── Instagram ─────────────────────────────────────────
export const instagramService = {
  connect: async (userId: string, username: string, password: string) => {
    const res = await api.post('/api/instagram/connect', {
      userId,
      username,
      password,
    });
    return res.data;
  },

  disconnect: async (userId: string) => {
    const res = await api.post('/api/instagram/disconnect', { userId });
    return res.data;
  },

  getStatus: async (userId: string) => {
    const res = await api.get(`/api/instagram/status/${userId}`);
    return res.data;
  },
};

// ─── Automation ────────────────────────────────────────
export const automationService = {
  start: async (userId: string) => {
    const res = await api.post('/api/automation/start', { userId });
    return res.data;
  },

  stop: async (userId: string) => {
    const res = await api.post('/api/automation/stop', { userId });
    return res.data;
  },

  getStats: async (userId: string) => {
    const res = await api.get(`/api/automation/stats/${userId}`);
    return res.data;
  },

  runSession: async (userId: string, preferences: { liked: string[]; avoided: string[] }) => {
    const res = await api.post('/api/automation/run-session', {
      userId,
      preferences,
    });
    return res.data;
  },
};

export default api;
