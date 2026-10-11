/**
 * Application Constants
 * 
 * Centralized constants used across the application.
 * Add your app-specific constants here.
 * 
 * Usage:
 *   import { ROUTES, BREAKPOINTS, STORAGE_KEYS } from '@/config/constants';
 */

// ─── Routes ──────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
};

// ─── Breakpoints (match Tailwind defaults) ───────────────────────
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// ─── Storage Keys ────────────────────────────────────────────────
export const STORAGE_KEYS = {
  THEME: 'theme',
  USER: 'user',
  AUTH_TOKEN: 'auth_token',
  PREFERENCES: 'preferences',
};

// ─── API ─────────────────────────────────────────────────────────
export const API = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1 second
};

// ─── Pagination ──────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// ─── Date Formats ────────────────────────────────────────────────
export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM d, yyyy h:mm a',
};

// ─── Feature Flags ───────────────────────────────────────────────
// These can be overridden by app.config.json features section
export const FEATURES = {
  GOOGLE_AUTH: import.meta.env.VITE_FEATURE_GOOGLE_AUTH === 'true',
  CLOUD_SYNC: import.meta.env.VITE_FEATURE_CLOUD_SYNC === 'true',
  AI_ASSISTANT: import.meta.env.VITE_FEATURE_AI_ASSISTANT === 'true',
};

export default {
  ROUTES,
  BREAKPOINTS,
  STORAGE_KEYS,
  API,
  PAGINATION,
  DATE_FORMATS,
  FEATURES,
};
