// App Information
export const APP_NAME = 'MoodMeter';
export const APP_VERSION = '1.0.0';

// Feature Flags
export const ENABLE_OFFLINE_MODE = true;
export const ENABLE_DARK_MODE = true;

// API Endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
export const FEEDBACK_ENDPOINT = `${API_BASE_URL}/feedback`;
export const REPORTS_ENDPOINT = `${API_BASE_URL}/reports`;
export const USER_SCHOOLS_ENDPOINT = `${API_BASE_URL}/user-schools`;

// Authentication
export const AUTH_COOKIE_NAME = 'moodmeter_auth_token';
export const AUTH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Localization
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr']; // English, Spanish, French

// Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Emotions
export const EMOTIONS = {
  HAPPY: 'happy',
  OKAY: 'okay',
  UNHAPPY: 'unhappy',
};

// Data Limits
export const MAX_SCHOOLS_PER_USER = 10;
export const MAX_FEEDBACK_PER_DAY = 2000;

// Time Constants
export const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
export const FEEDBACK_COOLDOWN = 60 * 1000; // 1 minute in milliseconds

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  OFFLINE_FEEDBACK: 'moodmeter_offline_feedback',
  USER_SETTINGS: 'moodmeter_user_settings',
};

// Report Periods
export const REPORT_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

// UI Constants
export const ANIMATION_DURATION = 300; // in milliseconds
export const TOAST_DURATION = 3000; // in milliseconds

// Error Messages
export const ERROR_MESSAGES = {
  GENERAL: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
};