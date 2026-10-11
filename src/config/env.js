/**
 * Environment Configuration Helper
 * 
 * Provides type-safe access to environment variables with defaults.
 * All VITE_ prefixed env vars are available via import.meta.env.
 * 
 * Usage:
 *   import env from '@/config/env';
 * 
 *   if (env.isDev) { console.log('Development mode'); }
 *   const apiUrl = env.apiBaseUrl;
 */

const env = {
  // ─── Environment ───────────────────────────────────────────
  /** Current mode: 'development' | 'production' | 'test' */
  mode: import.meta.env.MODE,

  /** True when running in development mode (npm run dev) */
  isDev: import.meta.env.DEV,

  /** True when running in production mode (npm run build) */
  isProd: import.meta.env.PROD,

  // ─── API Configuration ────────────────────────────────────
  /** Base URL for API requests */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',

  // ─── Auth ─────────────────────────────────────────────────
  /** Google OAuth Client ID */
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',

  // ─── AI ───────────────────────────────────────────────────
  /** Gemini API Key */
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',

  // ─── App Info (injected from app.config.json via vite.config) ─
  /** App name */
  appName: import.meta.env.VITE_APP_NAME || 'MyApp',

  /** App display name */
  appDisplayName: import.meta.env.VITE_APP_DISPLAY_NAME || 'My Application',

  /** App version */
  appVersion: import.meta.env.VITE_APP_VERSION || '0.0.0',

  /** Build date */
  buildDate: import.meta.env.VITE_BUILD_DATE || '',
};

export default env;
