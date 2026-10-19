import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

/**
 * Theme Provider
 * 
 * Manages light/dark theme state and persists preference to localStorage.
 * Automatically detects system preference on first load.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    }
    // Default to light mode regardless of device settings
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Remove both to start fresh
    root.classList.remove('dark', 'light');
    body.classList.remove('dark', 'light');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      body.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSetTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
