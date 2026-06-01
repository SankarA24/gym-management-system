'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const THEME_KEY = 'irondesk:theme';

const ThemeCtx = createContext<{ theme: string; setTheme: (t: string) => void }>({
  theme: 'dark',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    try { setTheme(localStorage.getItem(THEME_KEY) || 'dark'); } catch { /* noop */ }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* noop */ }
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}