// Design tokens — Sety Vision landing
// Single source of truth. No component should hardcode colors.
// Imported via "@/lib/tokens" (alias "@/*" -> project root).

export const colors = {
  background: "#FFFFFF",
  surface: "#FAFAFA",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.08)",
  borderMid: "rgba(0,0,0,0.12)",
  text: "#0A0A0A",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  purple: "#7C3AED",
  purpleDark: "#6D28D9",
  purpleLight: "#8B5CF6",
  purpleLighter: "#A78BFA",
  green: "#22C55E",
  greenDark: "#16A34A",
  white: "#FFFFFF",
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
} as const;

export const shadow = {
  xs: "0 1px 3px rgba(0,0,0,0.06)",
  sm: "0 2px 8px rgba(0,0,0,0.08)",
  md: "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
  lg: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
  xl: "0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.05)",
  purple: "0 4px 24px rgba(124,58,237,0.30)",
  purpleLg: "0 8px 48px rgba(124,58,237,0.40)",
} as const;

export const motion = {
  spring: { type: "spring", stiffness: 400, damping: 30 },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  fast: { duration: 0.2 },
  normal: { duration: 0.4 },
  slow: { duration: 0.6 },
} as const;

// Container padrão — USE SEMPRE ESTE E APENAS ESTE
export const container = {
  maxWidth: 1280,
  padding: "0 32px",
} as const;

// Helper: estilo inline do container padrão (1280 / 32px).
// Em mobile o padding cai para 20px via a classe utilitária "landing-container".
export const containerStyle = {
  maxWidth: container.maxWidth,
  margin: "0 auto",
  padding: container.padding,
  width: "100%",
} as const;
