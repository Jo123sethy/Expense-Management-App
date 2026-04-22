// styles/globalStyles.ts

export type ThemePalette = {
  background: string;
  card: string;
  surface: string;
  text: string;
  subText: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
  gradientA: string;
  gradientB: string;
};

export const LIGHT_THEME: ThemePalette = {
  background: "#F5F7FB",
  card: "rgba(255,255,255,0.78)",
  surface: "rgba(255,255,255,0.92)",
  text: "#111827",
  subText: "#6B7280",
  primary: "#6366F1",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  border: "rgba(15,23,42,0.08)",
  gradientA: "hsla(237, 100%, 83%, 0.95)",
  gradientB: "hsla(187, 100%, 74%, 0.95)",
};

export const DARK_THEME: ThemePalette = {
  background: "#07101F",
  card: "rgba(20,29,44,0.78)",
  surface: "rgba(15,23,42,0.92)",
  text: "#F8FAFC",
  subText: "#94A3B8",
  primary: "#818CF8",
  success: "#34D399",
  warning: "#FBBF24",
  danger: "#F87171",
  border: "rgba(148,163,184,0.18)",
  gradientA: "hsla(207, 92%, 70%, 0.95)",
  gradientB: "hsla(145, 86%, 61%, 0.95)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const TYPOGRAPHY = {
  display: {
    fontSize: 36,
    letterSpacing: -0.5,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    letterSpacing: -0.4,
    fontWeight: "700",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
};

export const GLASS = {
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    padding: 20,
  },
};

export const BUTTONS = {
  fab: {
    position: "absolute",
    bottom: 28,
    right: 22,
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
  },
};

export const CHIP = {
  base: {
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
  },
};

export const SHADOW = {
  soft: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  glow: {
    shadowColor: "#7C3AED",
    shadowOpacity: 0.42,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
};
