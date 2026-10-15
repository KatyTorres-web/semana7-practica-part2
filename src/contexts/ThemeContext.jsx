import {
  useState,
  useEffect,
  useCallback,
} from "react";
import { ThemeContext } from "./theme-context";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("questforge-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;

    try {
      localStorage.setItem("questforge-theme", theme);
    } catch (error) {
      console.warn("No se pudo guardar el tema.", error);
    }

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
