import type { ThemeId } from "./ThemeContext";

export interface ThemeColors {
  "--bg-primary": string;
  "--bg-secondary": string;
  "--bg-tertiary": string;
  "--bg-card": string;
  "--bg-card-hover": string;
  "--bg-input": string;
  "--bg-sidebar": string;
  "--text-primary": string;
  "--text-secondary": string;
  "--text-muted": string;
  "--text-inverse": string;
  "--accent": string;
  "--accent-hover": string;
  "--accent-light": string;
  "--accent-dark": string;
  "--accent-text": string;
  "--accent-glow": string;
  "--border": string;
  "--border-light": string;
  "--gradient-start": string;
  "--gradient-end": string;
  "--success": string;
  "--success-bg": string;
  "--warning": string;
  "--warning-bg": string;
  "--error": string;
  "--error-bg": string;
  "--info": string;
  "--info-bg": string;
  "--violet": string;
  "--violet-bg": string;
  "--scrollbar-track": string;
  "--scrollbar-thumb": string;
  "--overlay": string;
}

export interface Theme {
  id: ThemeId;
  label: string;
  emoji: string;
  colors: ThemeColors;
}

export const THEMES: Theme[] = [
  {
    id: "amanecer",
    label: "Amanecer",
    emoji: "\u{1F305}",
    colors: {
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
    },
  },
  {
    id: "anochecer",
    label: "Anochecer",
    emoji: "\u{1F307}",
    colors: {
      "--bg-primary": "#10182F",
      "--bg-secondary": "#161E38",
      "--bg-tertiary": "#1C2542",
      "--bg-card": "#10182F",
      "--bg-card-hover": "#1C2542",
      "--bg-input": "#1C2542",
      "--bg-sidebar": "#0D1428",
      "--text-primary": "#FFD166",
      "--text-secondary": "#F4A261",
      "--text-muted": "#693C78",
      "--text-inverse": "#10182F",
      "--accent": "#E76F51",
      "--accent-hover": "#C94C4C",
      "--accent-light": "#F4A261",
      "--accent-dark": "#A84A68",
      "--accent-text": "#ffffff",
      "--accent-glow": "rgba(231,111,81,0.25)",
      "--border": "#202A50",
      "--border-light": "#403B73",
      "--gradient-start": "#E76F51",
      "--gradient-end": "#C94C4C",
      "--success": "#22c55e",
      "--success-bg": "rgba(34,197,94,0.1)",
      "--warning": "#FFD166",
      "--warning-bg": "rgba(255,209,102,0.1)",
      "--error": "#C94C4C",
      "--error-bg": "rgba(201,76,76,0.1)",
      "--info": "#2A9D8F",
      "--info-bg": "rgba(42,157,143,0.12)",
      "--violet": "#9D6BC3",
      "--violet-bg": "rgba(157,107,195,0.12)",
      "--scrollbar-track": "#1C2542",
      "--scrollbar-thumb": "#202A50",
      "--overlay": "rgba(16,24,47,0.8)",
    },
  },
];
