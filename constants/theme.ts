/**
 * Design tokens for the app. Keep in sync with tailwind.config.js's `theme.extend` block.
 * Components should import from here rather than hardcoding colors, spacing, or fonts.
 */

export const colors = {
  background: {
    primary: '#EDF6F1',
    card: '#FFFFFF',
    cardAlt: '#E0F0E8',
    cardAltDeep: '#CCEFDD',
    cardAltStrong: '#A7E1C7',
  },
  accent: {
    flat: '#1E9E72',
    gradient: ['#4FC79A', '#0A6B4C'] as const,
    gold: '#D4A017',
  },
  text: {
    primary: '#1F1F1F',
    secondary: '#6A6A6A',
  },
  divider: '#D6EADF',
  status: {
    error: '#D64545',
    success: '#1E9E67',
  },
  white: '#FFFFFF',
} as const;

export const typography = {
  screenTitle: { fontSize: 20, fontWeight: '700' as const },
  sectionHeader: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  largeNumeric: { fontSize: 30, fontWeight: '700' as const },
  buttonLabel: { fontSize: 16, fontWeight: '600' as const },
} as const;

// 4dp grid — all margins/paddings must be one of these.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const radius = {
  card: 16,
  button: 14,
  buttonPill: 26,
  input: 12,
  sheetTop: 20,
  pill: 9999,
} as const;

export const motion = {
  buttonPressScale: 0.97,
  buttonPressDurationMs: 150,
  screenTransitionDurationMs: 250,
  giftAnimationDurationMs: 2500,
} as const;

export const minTapTarget = 44;

export const theme = { colors, typography, spacing, radius, motion, minTapTarget } as const;

export type Theme = typeof theme;
