import { useState, useEffect, useCallback } from "react";

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);

      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("No se pudo guardar en localStorage.", error);
    }
  }, [key, value]);

  const updateValue = useCallback((nextValue) => {
    setValue((current) =>
      typeof nextValue === "function" ? nextValue(current) : nextValue,
    );
  }, []);

  return [value, updateValue];
}
