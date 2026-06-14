export const COLORS = {
  // Primary brand
  primary: '#A855F7',        // Purple
  primaryLight: '#C084FC',
  primaryDark: '#7C3AED',
  primaryGlow: 'rgba(168, 85, 247, 0.3)',

  // Accent
  accent: '#06B6D4',         // Cyan
  accentLight: '#22D3EE',
  accentGlow: 'rgba(6, 182, 212, 0.25)',

  // Success/Active
  success: '#10B981',
  successGlow: 'rgba(16, 185, 129, 0.25)',

  // Warning
  warning: '#F59E0B',

  // Error
  error: '#EF4444',

  // Background layers
  bg0: '#060609',            // Deepest background
  bg1: '#0A0A0F',            // Main background
  bg2: '#0F0F1A',            // Card background
  bg3: '#141428',            // Elevated card
  bg4: '#1A1A35',            // Input / chip background

  // Text
  textPrimary: '#F0EEFF',
  textSecondary: '#9B9BC0',
  textMuted: '#5B5B80',
  textAccent: '#A855F7',

  // Borders
  border: 'rgba(168, 85, 247, 0.15)',
  borderLight: 'rgba(255, 255, 255, 0.06)',

  // Instagram brand
  instagram: '#E1306C',
  instagramGrad1: '#F58529',
  instagramGrad2: '#DD2A7B',
  instagramGrad3: '#8134AF',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FONT = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 32,
    hero: 42,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const TOPICS_LIKE = [
  { id: 'tech', label: 'Technology', emoji: '💻' },
  { id: 'ai', label: 'Artificial Intelligence', emoji: '🤖' },
  { id: 'startups', label: 'Startups', emoji: '🚀' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'finance', label: 'Finance', emoji: '📈' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'health', label: 'Health & Wellness', emoji: '🌿' },
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'design', label: 'Design', emoji: '🎨' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'food', label: 'Food', emoji: '🍕' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'crypto', label: 'Crypto / Web3', emoji: '₿' },
  { id: 'science', label: 'Science', emoji: '🔬' },
];

export const TOPICS_AVOID = [
  { id: 'drama', label: 'Drama / Gossip', emoji: '🎭' },
  { id: 'politics', label: 'Politics', emoji: '🏛️' },
  { id: 'ads', label: 'Ads / Promotions', emoji: '📣' },
  { id: 'negativity', label: 'Negativity', emoji: '⛔' },
  { id: 'clickbait', label: 'Clickbait', emoji: '🎣' },
  { id: 'nsfw', label: 'Adult Content', emoji: '🔞' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'celebrities', label: 'Celebrity News', emoji: '⭐' },
];

export const API_URL = 'https://feedflow-backend.onrender.com';
