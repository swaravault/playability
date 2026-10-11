/**
 * Application Configuration
 *
 * This file exports app configuration that can be imported by components.
 * All values are injected at build time by Vite's `define` plugin, which
 * reads from `app.config.json` at the project root.
 *
 * VERSION AUTO-GENERATION:
 * The version is automatically computed at build time (in each vite.config)
 * based on the current date. No manual version bumping needed.
 *
 * Version format: x.y.z
 *   - x = current year - 2025
 *   - y = current month (1-12)
 *   - z = current day of month
 *
 * Examples:
 *   - 11-Oct-2026 → 1.10.11
 *   - 3-Jan-2027  → 2.1.3
 *   - 31-Dec-2025 → 0.12.31
 *
 * Defaults below are fallbacks only used when env vars are missing (e.g. tests).
 */

const APP_CONFIG = {
  // App Information
  name: import.meta.env.VITE_APP_NAME || 'PlayAbility',
  displayName: import.meta.env.VITE_APP_DISPLAY_NAME || 'PlayAbility',
  version: import.meta.env.VITE_APP_VERSION || '0.0.0',

  // Developer Information (injected from app.config.json `developer` block)
  developer: {
    name: import.meta.env.VITE_DEVELOPER_NAME || 'Swara Abheri',
    email: import.meta.env.VITE_DEVELOPER_EMAIL || 'swara.vault@gmail.com',
    message:
      import.meta.env.VITE_DEVELOPER_MESSAGE ||
      'Comments and suggestions are welcome!',
  },

  // Build Information
  buildDate:
    import.meta.env.VITE_BUILD_DATE ||
    new Date().toISOString().split('T')[0],
};

export default APP_CONFIG;

// Named exports for convenience
export const APP_NAME = APP_CONFIG.name;
export const APP_DISPLAY_NAME = APP_CONFIG.displayName;
export const APP_VERSION = APP_CONFIG.version;
export const DEVELOPER_INFO = APP_CONFIG.developer;
export const BUILD_DATE = APP_CONFIG.buildDate;
