import { createContext, useContext, useMemo, useState } from "react";
import { DarkTheme, LightTheme } from "../constants/theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? DarkTheme : LightTheme;

  const value = useMemo(
    () => ({ theme, isDark, toggleTheme: () => setIsDark((prev) => !prev) }),
    [isDark, theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
