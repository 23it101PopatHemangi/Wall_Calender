import type { CSSProperties } from "react";

/**
 * Seasonal accent palettes by month index (0–11).
 * Exposed as CSS variables on `<main>` for DateCell, Calendar, Notes, and hero.
 */
export type MonthTheme = {
  /** Gradient start (boundaries / buttons) */
  accentFrom: string;
  /** Gradient end */
  accentTo: string;
  /** Range fill (middle + soft highlight) */
  rangeBg: string;
  rangeText: string;
  /** Today ring + glow */
  ring: string;
  /** Note dot on calendar */
  dot: string;
  /** Nav / chip buttons */
  buttonBg: string;
  buttonBorder: string;
  buttonText: string;
};

const themes: MonthTheme[] = [
  // Jan — winter / ice
  {
    accentFrom: "#0ea5e9",
    accentTo: "#2563eb",
    rangeBg: "rgba(14, 165, 233, 0.22)",
    rangeText: "#0c4a6e",
    ring: "#38bdf8",
    dot: "#e879f9",
    buttonBg: "rgba(14, 165, 233, 0.12)",
    buttonBorder: "rgba(14, 165, 233, 0.35)",
    buttonText: "#0369a1",
  },
  // Feb — rose / valentine
  {
    accentFrom: "#e11d48",
    accentTo: "#be185d",
    rangeBg: "rgba(244, 63, 94, 0.2)",
    rangeText: "#881337",
    ring: "#fb7185",
    dot: "#a855f7",
    buttonBg: "rgba(244, 63, 94, 0.12)",
    buttonBorder: "rgba(244, 63, 94, 0.35)",
    buttonText: "#be123c",
  },
  // Mar — spring green
  {
    accentFrom: "#22c55e",
    accentTo: "#059669",
    rangeBg: "rgba(34, 197, 94, 0.2)",
    rangeText: "#14532d",
    ring: "#4ade80",
    dot: "#f472b6",
    buttonBg: "rgba(34, 197, 94, 0.12)",
    buttonBorder: "rgba(34, 197, 94, 0.35)",
    buttonText: "#15803d",
  },
  // Apr — fresh mint / teal
  {
    accentFrom: "#14b8a6",
    accentTo: "#0d9488",
    rangeBg: "rgba(20, 184, 166, 0.2)",
    rangeText: "#134e4a",
    ring: "#2dd4bf",
    dot: "#f59e0b",
    buttonBg: "rgba(20, 184, 166, 0.12)",
    buttonBorder: "rgba(20, 184, 166, 0.35)",
    buttonText: "#0f766e",
  },
  // May — meadow
  {
    accentFrom: "#65a30d",
    accentTo: "#16a34a",
    rangeBg: "rgba(101, 163, 13, 0.18)",
    rangeText: "#365314",
    ring: "#84cc16",
    dot: "#ec4899",
    buttonBg: "rgba(101, 163, 13, 0.12)",
    buttonBorder: "rgba(101, 163, 13, 0.35)",
    buttonText: "#3f6212",
  },
  // Jun — summer sky
  {
    accentFrom: "#3b82f6",
    accentTo: "#6366f1",
    rangeBg: "rgba(59, 130, 246, 0.2)",
    rangeText: "#1e3a8a",
    ring: "#60a5fa",
    dot: "#f97316",
    buttonBg: "rgba(59, 130, 246, 0.12)",
    buttonBorder: "rgba(59, 130, 246, 0.35)",
    buttonText: "#1d4ed8",
  },
  // Jul — ocean
  {
    accentFrom: "#0284c7",
    accentTo: "#4f46e5",
    rangeBg: "rgba(2, 132, 199, 0.2)",
    rangeText: "#0c4a6e",
    ring: "#38bdf8",
    dot: "#fbbf24",
    buttonBg: "rgba(2, 132, 199, 0.12)",
    buttonBorder: "rgba(2, 132, 199, 0.35)",
    buttonText: "#0369a1",
  },
  // Aug — sunset
  {
    accentFrom: "#ea580c",
    accentTo: "#db2777",
    rangeBg: "rgba(234, 88, 12, 0.16)",
    rangeText: "#7c2d12",
    ring: "#fb923c",
    dot: "#8b5cf6",
    buttonBg: "rgba(234, 88, 12, 0.1)",
    buttonBorder: "rgba(234, 88, 12, 0.3)",
    buttonText: "#c2410c",
  },
  // Sep — autumn amber
  {
    accentFrom: "#d97706",
    accentTo: "#ca8a04",
    rangeBg: "rgba(217, 119, 6, 0.18)",
    rangeText: "#713f12",
    ring: "#fbbf24",
    dot: "#0ea5e9",
    buttonBg: "rgba(217, 119, 6, 0.12)",
    buttonBorder: "rgba(217, 119, 6, 0.35)",
    buttonText: "#a16207",
  },
  // Oct — rust / autumn
  {
    accentFrom: "#c2410c",
    accentTo: "#b45309",
    rangeBg: "rgba(194, 65, 12, 0.16)",
    rangeText: "#7c2d12",
    ring: "#fb923c",
    dot: "#22c55e",
    buttonBg: "rgba(194, 65, 12, 0.1)",
    buttonBorder: "rgba(194, 65, 12, 0.3)",
    buttonText: "#9a3412",
  },
  // Nov — twilight purple
  {
    accentFrom: "#7c3aed",
    accentTo: "#5b21b6",
    rangeBg: "rgba(124, 58, 237, 0.18)",
    rangeText: "#3b0764",
    ring: "#a78bfa",
    dot: "#facc15",
    buttonBg: "rgba(124, 58, 237, 0.12)",
    buttonBorder: "rgba(124, 58, 237, 0.35)",
    buttonText: "#6d28d9",
  },
  // Dec — winter night / pine
  {
    accentFrom: "#0f766e",
    accentTo: "#1e40af",
    rangeBg: "rgba(15, 118, 110, 0.18)",
    rangeText: "#134e4a",
    ring: "#2dd4bf",
    dot: "#f472b6",
    buttonBg: "rgba(15, 118, 110, 0.12)",
    buttonBorder: "rgba(15, 118, 110, 0.35)",
    buttonText: "#0f766e",
  },
];

export function getMonthTheme(monthIndex: number): MonthTheme {
  const m = ((monthIndex % 12) + 12) % 12;
  return themes[m];
}

/** Apply theme as inline CSS variables for `style` on a wrapper element */
export function monthThemeStyle(t: MonthTheme): CSSProperties {
  return {
    "--accent-from": t.accentFrom,
    "--accent-to": t.accentTo,
    "--accent-range": t.rangeBg,
    "--accent-range-text": t.rangeText,
    "--accent-ring": t.ring,
    "--accent-dot": t.dot,
    "--accent-btn-bg": t.buttonBg,
    "--accent-btn-border": t.buttonBorder,
    "--accent-btn-text": t.buttonText,
  } as CSSProperties;
}
