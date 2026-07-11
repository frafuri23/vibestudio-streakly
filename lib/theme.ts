import { Ionicons } from "@expo/vector-icons";

export const colors = {
  background: "#0D0D12",
  surface: "#1C1C25",
  elevated: "#25252F",
  text: "#F5F4FA",
  mutedText: "#9795A3",
  border: "#31313D",
  accent: "#8A7CFF",
  accentTint: "#2A2447",
  flame: "#FF9D5C",
  flameTint: "#3A2A1C",
  success: "#3DD873",
  successTint: "#173626",
  danger: "#FF6B70",
  dangerTint: "#3A1A1C",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
};

export const type = {
  display: { fontSize: 32, fontWeight: "800" as const, letterSpacing: 0.2 },
  title: { fontSize: 22, fontWeight: "700" as const },
  heading: { fontSize: 17, fontWeight: "600" as const },
  body: { fontSize: 15.5, fontWeight: "500" as const },
  bodyRegular: { fontSize: 15.5, fontWeight: "400" as const },
  caption: { fontSize: 12.5, fontWeight: "600" as const, letterSpacing: 0.3 },
};

export const shadow = {
  card: {
    shadowColor: "#161221",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  floating: {
    shadowColor: "#161221",
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
};

export const HABIT_COLORS = ["#6C5CE7", "#22C55E", "#FF8A3D", "#22B8CF", "#F43F9E", "#4C6EF5", "#F59F00"];

// A single typed source of truth for icon names, so every screen that picks or
// renders a habit icon gets compile-time checking against the real glyph set
// instead of silently rendering a missing icon on a typo.
export type IoniconName = keyof typeof Ionicons.glyphMap;

export const HABIT_ICONS: IoniconName[] = [
  "water-outline",
  "book-outline",
  "barbell-outline",
  "bed-outline",
  "walk-outline",
  "leaf-outline",
  "moon-outline",
  "nutrition-outline",
  "pencil-outline",
  "musical-notes-outline",
  "heart-outline",
  "sunny-outline",
];
