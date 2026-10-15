import { createContext, useContext, useEffect, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

/* eslint-disable react-refresh/only-export-components -- Keep the theme context and hook with their provider. */
export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("questforge-theme", "dark");

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, [setTheme]);

  useEffect(() => {
    document.body.dataset.theme = theme;

    return () => {
      delete document.body.dataset.theme;
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe utilizarse dentro de ThemeProvider");
  }

  return context;
}
