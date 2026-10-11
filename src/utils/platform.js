/**
 * Platform Detection Utilities
 * 
 * Provides reliable platform detection for cross-platform applications.
 * Use these functions to conditionally enable/disable features based on platform.
 */

/**
 * Get the current platform
 * @returns {'desktop' | 'android' | 'ios' | 'web'}
 */
export function getPlatform() {
  // Check for Electron (desktop)
  if (typeof window !== 'undefined' && window.electronAPI) {
    return 'desktop';
  }
  
  // Check for Capacitor native platform (mobile)
  if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
    const platform = window.Capacitor.getPlatform?.();
    if (platform === 'ios') return 'ios';
    return 'android';
  }
  
  // Default to web
  return 'web';
}

/**
 * Check if running on a mobile platform (Android or iOS)
 * @returns {boolean}
 */
export function isMobile() {
  const platform = getPlatform();
  return platform === 'android' || platform === 'ios';
}

/**
 * Check if running on a desktop platform (Electron)
 * @returns {boolean}
 */
export function isDesktop() {
  return getPlatform() === 'desktop';
}

/**
 * Check if running in a web browser
 * @returns {boolean}
 */
export function isWeb() {
  return getPlatform() === 'web';
}

/**
 * Check if the platform supports multiple tabs/windows
 * @returns {boolean}
 */
export function supportsMultiTab() {
  return !isMobile();
}

/**
 * Check if the platform supports native file system access
 * @returns {boolean}
 */
export function supportsNativeFileSystem() {
  return isDesktop();
}

/**
 * Check if the platform supports keyboard shortcuts
 * @returns {boolean}
 */
export function supportsKeyboardShortcuts() {
  return !isMobile();
}

/**
 * Get the appropriate modifier key for the platform
 * @returns {'⌘' | 'Ctrl'}
 */
export function getModifierKey() {
  if (typeof navigator !== 'undefined' && navigator.platform?.includes('Mac')) {
    return '⌘';
  }
  return 'Ctrl';
}

export default {
  getPlatform,
  isMobile,
  isDesktop,
  isWeb,
  supportsMultiTab,
  supportsNativeFileSystem,
  supportsKeyboardShortcuts,
  getModifierKey,
};
