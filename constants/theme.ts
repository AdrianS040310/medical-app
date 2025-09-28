/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const PrimaryPalette = {
  50: "#f1f9fe",
  100: "#e1f2fd",
  200: "#bce4fb",
  300: "#87d2f8",
  400: "#3fb8f1",
  500: "#159fe2",
  600: "#0980c0",
  700: "#08659c",
  800: "#0b5681",
  900: "#0f486b",
  950: "#0a2e47",
};

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: PrimaryPalette[900],
    background: PrimaryPalette[50],
    tint: PrimaryPalette[500],
    icon: PrimaryPalette[400],
    tabIconDefault: PrimaryPalette[400],
    tabIconSelected: PrimaryPalette[600],
  },
  dark: {
    text: PrimaryPalette[50],
    background: PrimaryPalette[950],
    tint: PrimaryPalette[400],
    icon: PrimaryPalette[300],
    tabIconDefault: PrimaryPalette[300],
    tabIconSelected: PrimaryPalette[100],
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
