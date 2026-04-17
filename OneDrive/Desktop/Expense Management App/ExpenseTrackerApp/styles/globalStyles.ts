// styles/globalStyles.ts

export const COLORS = {
  light: {
    background: "#F5F7FB",
    card: "rgba(255,255,255,0.7)",
    text: "#111827",
    subText: "#6B7280",
    primary: "#6366F1",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    border: "#E5E7EB",
  },

  dark: {
    background: "#0F172A",
    card: "rgba(30,41,59,0.6)",
    text: "#F9FAFB",
    subText: "#94A3B8",
    primary: "#818CF8",
    success: "#34D399",
    warning: "#FBBF24",
    danger: "#F87171",
    border: "#1F2937",
  },
};

/* 🎨 SPACING SYSTEM (clean UI consistency) */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

/* 🔤 TYPOGRAPHY */
export const TYPOGRAPHY = {
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
  },
  small: {
    fontSize: 12,
    fontWeight: "400",
  },
};

/* 🧊 GLASS EFFECT (reusable) */
export const GLASS = {
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
};

/* 🔘 BUTTON STYLES */
export const BUTTONS = {
  primary: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
};

/* 🧩 CHIP STYLE */
export const CHIP = {
  base: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
};

/* 📦 SHADOWS */
export const SHADOW = {
  soft: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  glow: {
    shadowColor: "#6366F1",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
};