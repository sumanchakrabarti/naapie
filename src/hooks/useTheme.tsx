import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface ThemeDefinition {
  id: string;
  name: string;
  /** Which data-theme value to set on <html> */
  dataTheme: string;
  /** Monaco editor theme name */
  monacoTheme: 'vs-dark' | 'light';
}

export const themes: ThemeDefinition[] = [
  { id: 'minecraft-dark', name: '⛏️ Minecraft Dark', dataTheme: 'minecraft-dark', monacoTheme: 'vs-dark' },
  { id: 'default-dark', name: '🌙 Default Dark', dataTheme: 'default-dark', monacoTheme: 'vs-dark' },
  { id: 'default-light', name: '☀️ Default Light', dataTheme: 'default-light', monacoTheme: 'light' },
];

interface ThemeContextValue {
  current: ThemeDefinition;
  setTheme: (id: string) => void;
}

const STORAGE_KEY = 'naaipe-theme';

function loadThemeId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && themes.some((t) => t.id === stored)) return stored;
  } catch { /* ignore */ }
  return themes[0].id;
}

const ThemeContext = createContext<ThemeContextValue>({
  current: themes[0],
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(loadThemeId);
  const current = themes.find((t) => t.id === themeId) ?? themes[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', current.dataTheme);
    localStorage.setItem(STORAGE_KEY, current.id);
  }, [current]);

  const setTheme = useCallback((id: string) => setThemeId(id), []);

  return (
    <ThemeContext.Provider value={{ current, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
