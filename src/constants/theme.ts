/**
 * Design tokens for the app: Material 3 color roles, Geist typography,
 * rounded corners, and spacing.
 */

import type { Theme } from "expo-router";
import { Platform } from "react-native";

export const Colors = {
  surface: "#f7f9fb",
  "surface-container": "#eceef0",
  "on-surface": "#191c1e",
  "surface-tint": "#545f73",
  primary: "#091426",
  "on-primary": "#ffffff",
  "primary-container": "#1e293b",
  "on-primary-container": "#8590a6",
  secondary: "#505f76",
  "on-secondary": "#ffffff",
  "secondary-container": "#d0e1fb",
  "on-secondary-container": "#54647a",
  tertiary: "#061525",
  "on-tertiary": "#ffffff",
  "tertiary-container": "#1b2a3b",
  "on-tertiary-container": "#8291a6",
  error: "#ba1a1a",
  "on-error": "#ffffff",
  "error-container": "#ffdad6",
  "on-error-container": "#93000a",
  background: "#f7f9fb",
  "on-background": "#191c1e",
} as const;

export type ThemeColor = keyof typeof Colors;

export const Fonts = Platform.select({
  ios: {
    regular: "Geist-Regular",
    medium: "Geist-Medium",
    semibold: "Geist-SemiBold",
    bold: "Geist-Bold",
  },
  android: {
    regular: "Geist_400Regular",
    medium: "Geist_500Medium",
    semibold: "Geist_600SemiBold",
    bold: "Geist_700Bold",
  },
  default: {
    regular: "Geist_400Regular",
    medium: "Geist_500Medium",
    semibold: "Geist_600SemiBold",
    bold: "Geist_700Bold",
  },
});

export type TypographyType = keyof typeof Typography;

export const Typography = {
  display: {
    fontFamily: Fonts.semibold,
    fontSize: 36,
    fontWeight: "600",
    lineHeight: 44,
    letterSpacing: -0.72,
  },
  "headline-lg": {
    fontFamily: Fonts.semibold,
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 36,
    letterSpacing: -0.56,
  },
  "headline-md": {
    fontFamily: Fonts.semibold,
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.33,
  },
  "body-lg": {
    fontFamily: Fonts.regular,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  "body-md": {
    fontFamily: Fonts.regular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  "body-sm": {
    fontFamily: Fonts.regular,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  },
  "label-md": {
    fontFamily: Fonts.medium,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.13,
  },
  "label-sm": {
    fontFamily: Fonts.medium,
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
    letterSpacing: 0.22,
  },
} as const;

export const Rounded = {
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

export const Spacing = {
  gutter: 16,
  margin: 20,
  "space-xs": 4,
  "space-sm": 8,
  "space-md": 12,
  "space-lg": 20,
  "space-xl": 32,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * React Navigation theme derived from the app's design tokens, so navigator
 * chrome (headers, backgrounds, tab bars) matches the rest of the UI.
 */
export const NavigationTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: Colors.background,
    card: Colors["surface-container"],
    text: Colors["on-surface"],
    border: Colors["surface-container"],
    notification: Colors.error,
  },
  fonts: {
    regular: { fontFamily: Fonts.regular, fontWeight: "400" },
    medium: { fontFamily: Fonts.medium, fontWeight: "500" },
    bold: { fontFamily: Fonts.bold, fontWeight: "700" },
    heavy: { fontFamily: Fonts.bold, fontWeight: "800" },
  },
};
