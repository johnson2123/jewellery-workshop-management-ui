
import { useState, useEffect, useCallback } from 'react';
import { ThemeContext } from './ThemeContext';

const STORAGE_KEY = 'jw_theme_preference';

/**
 * Enterprise-grade Theme Provider component supporting system preference syncing,
 * multi-tab state synchronization, and lazy-loading DOM mutations.
 */
export const ThemeProvider = ({ children }) => {
  // 1. Lazy State Initialization to prevent Flash of Unstyled Content (FOUC)
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    } catch (e) {
      console.warn('LocalStorage access blocked; defaulting to light theme.', e);
      return 'light';
    }
  });

  // 2. Optimized DOM mutation function
  const applyThemeToDOM = useCallback((targetTheme) => {
    const root = window.document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Sync DOM immediately on mount and theme transitions
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme, applyThemeToDOM]);

  // 3. Sync theme across different browser tabs in real-time
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        setTheme(event.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 4. Listen to OS System preference transitions (only if user has not set a preference manually)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const hasSavedPreference = localStorage.getItem(STORAGE_KEY);
      if (!hasSavedPreference) {
        const nextTheme = e.matches ? 'dark' : 'light';
        setTheme(nextTheme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange); // Legacy fallback
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange); // Legacy fallback
      }
    };
  }, []);

  // 5. Expose optimized toggle mechanism
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch (e) {
        console.warn('Failed to write theme preference to LocalStorage.', e);
      }
      return nextTheme;
    });
  }, []);

  const value = {
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;