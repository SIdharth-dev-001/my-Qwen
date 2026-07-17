import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

export type Theme = 'dark' | 'light';

export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to Dark Mode
  const [theme, setTheme] = useState<Theme>(() => {
    return getLocalStorage<Theme>(STORAGE_KEYS.THEME, 'dark');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    setLocalStorage(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
