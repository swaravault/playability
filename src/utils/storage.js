/**
 * Storage Utility
 * 
 * A cross-platform storage abstraction over localStorage with
 * JSON serialization, namespacing, and error handling.
 * 
 * Works on all platforms (web, Electron, Capacitor WebView).
 * 
 * Usage:
 *   import storage from '@/utils/storage';
 * 
 *   storage.set('user', { name: 'John', age: 30 });
 *   const user = storage.get('user');           // { name: 'John', age: 30 }
 *   const name = storage.get('missing', 'default'); // 'default'
 *   storage.remove('user');
 *   storage.clear();
 */

const PREFIX = 'app_';

const storage = {
  /**
   * Get a value from storage
   * @param {string} key
   * @param {any} defaultValue - Returned if key doesn't exist
   * @returns {any} Parsed value or defaultValue
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(PREFIX + key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[Storage] Error reading key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Set a value in storage
   * @param {string} key
   * @param {any} value - Will be JSON.stringify'd
   */
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[Storage] Error writing key "${key}":`, error);
    }
  },

  /**
   * Remove a key from storage
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (error) {
      console.warn(`[Storage] Error removing key "${key}":`, error);
    }
  },

  /**
   * Check if a key exists in storage
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    try {
      return localStorage.getItem(PREFIX + key) !== null;
    } catch {
      return false;
    }
  },

  /**
   * Clear all app-namespaced keys from storage
   * (Does not clear keys from other apps)
   */
  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('[Storage] Error clearing storage:', error);
    }
  },

  /**
   * Get all app-namespaced keys
   * @returns {string[]} Array of keys (without prefix)
   */
  keys() {
    try {
      const result = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(PREFIX)) {
          result.push(key.slice(PREFIX.length));
        }
      }
      return result;
    } catch {
      return [];
    }
  },
};

export default storage;
