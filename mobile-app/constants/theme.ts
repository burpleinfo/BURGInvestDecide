/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1C3A77';
const tintColorDark = '#87A6DF';

export const AppColors = {
  teal: '#1C3A77',
  tealDark: '#0A1B3E',
  tealSoft: '#EBF0F6',
  orange: '#5882D3',
  orangeSoft: '#E5E9F0',
  red: '#305CB5',
  green: '#6371B1',
  background: '#EFF3FA',
  card: '#EBF0F6',
  text: '#0A1B3E',
  muted: '#8B9DBE',
  mutedAlt: '#9BA3A8',
  border: '#DFE2EF',
  surface: '#EDEFF0',
  shadow: '#0A1B3E',
  ink: '#0F1726',
};

export const Colors = {
  light: {
    text: AppColors.text,
    background: AppColors.background,
    tint: tintColorLight,
    icon: AppColors.muted,
    tabIconDefault: AppColors.mutedAlt,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: AppColors.card,
    background: AppColors.ink,
    tint: tintColorDark,
    icon: AppColors.muted,
    tabIconDefault: AppColors.mutedAlt,
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
