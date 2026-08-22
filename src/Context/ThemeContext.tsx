import { createContext } from "react";
import type { ThemeColors } from "./themes";

export type ThemeId = "amanecer" | "anochecer";

export interface ThemeContextType {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  colors: ThemeColors;
}

const DEFAULT_COLORS: ThemeColors = {
  "--bg-primary": "#0B1628",
  "--bg-secondary": "#0E1B30",
  "--bg-tertiary": "#112038",
  "--bg-card": "#0B1628",
  "--bg-card-hover": "#112038",
  "--bg-input": "#112038",
  "--bg-sidebar": "#081220",
  "--text-primary": "#EAF4FF",
  "--text-secondary": "#8BB8D6",
  "--text-muted": "#3D6A8A",
  "--text-inverse": "#0B1628",
  "--accent": "#00C9DB",
  "--accent-hover": "#00E5C0",
  "--accent-light": "#7DFCE0",
  "--accent-dark": "#6B3FA0",
  "--accent-text": "#0B1628",
  "--accent-glow": "rgba(0,201,219,0.25)",
  "--border": "#1A2E4A",
  "--border-light": "#2A4466",
  "--gradient-start": "#00C9DB",
  "--gradient-end": "#6B3FA0",
  "--success": "#34D399",
  "--success-bg": "rgba(52,211,153,0.1)",
  "--warning": "#FBBF24",
  "--warning-bg": "rgba(251,191,36,0.1)",
  "--error": "#F472B6",
  "--error-bg": "rgba(244,114,182,0.1)",
  "--info": "#38BDF8",
  "--info-bg": "rgba(56,189,248,0.1)",
  "--violet": "#A78BFA",
  "--violet-bg": "rgba(167,139,250,0.1)",
  "--scrollbar-track": "#112038",
  "--scrollbar-thumb": "#1A2E4A",
  "--overlay": "rgba(11,22,40,0.85)",
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "amanecer",
  setTheme: () => {},
  colors: DEFAULT_COLORS,
});
