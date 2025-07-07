import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const isNightTime = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7; // 7PM to 7AM is considered night time
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Initialize theme from localStorage, system preference, or time of day
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const autoTheme = localStorage.getItem('autoTheme');
    
    if (savedTheme && autoTheme !== 'true') {
      // User has manually set a theme and auto mode is off
      setTheme(savedTheme);
    } else if (autoTheme === 'true' || (!savedTheme && !prefersDark)) {
      // Auto mode is on, or no preference saved - use time-based theme
      const timeBasedTheme = isNightTime() ? 'dark' : 'light';
      setTheme(timeBasedTheme);
      localStorage.setItem('autoTheme', 'true');
    } else if (prefersDark) {
      // Fall back to system preference
      setTheme('dark');
    }
  }, []);

  // Set up interval to check time every minute for auto theme switching
  useEffect(() => {
    const autoTheme = localStorage.getItem('autoTheme');
    if (autoTheme === 'true') {
      const interval = setInterval(() => {
        const timeBasedTheme = isNightTime() ? 'dark' : 'light';
        setTheme(timeBasedTheme);
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, []);

  // Update document with theme class when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // When user manually toggles, disable auto mode
    localStorage.setItem('autoTheme', 'false');
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
