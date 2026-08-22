import { useState, useEffect, type ReactNode } from "react";
import { THEMES } from "./themes";
import { ThemeContext, type ThemeId } from "./ThemeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem("sentinel-theme") as ThemeId) || "amanecer";
  });

  const current = THEMES.find((t) => t.id === theme) || THEMES[0];

  useEffect(() => {
    localStorage.setItem("sentinel-theme", theme);
    const root = document.documentElement;
    Object.entries(current.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute("data-theme", theme);
  }, [theme, current]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: current.colors }}>
      {children}
    </ThemeContext.Provider>
  );
}
