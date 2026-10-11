import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook
 * 
 * A React hook that syncs state with localStorage.
 * Automatically serializes/deserializes JSON values.
 * 
 * Usage:
 *   const [name, setName] = useLocalStorage('user-name', 'Guest');
 *   const [prefs, setPrefs] = useLocalStorage('prefs', { fontSize: 14 });
 * 
 * @param {string} key - localStorage key
 * @param {any} initialValue - Default value if key doesn't exist
 * @returns {[any, Function]} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`[useLocalStorage] Error writing key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
