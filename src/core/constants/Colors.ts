/**
 * Color tokens for JS-side usage: icon `color` props, chart configs, and
 * LinearGradient `colors`, where NativeWind classNames don't apply.
 *
 * These mirror the Tailwind tokens in `tailwind.config.js` — keep both in sync.
 * For className styling prefer the Tailwind tokens (e.g. `bg-surface-card`).
 */
export const Colors = {
  // Trend / status (green-400 up, red-400 down) — used across charts, arrows, pills
  up: '#4ade80',
  down: '#f87171',

  // Brand accent (mirrors Tailwind `accent`)
  accent: '#22c55e',
  accentDim: '#16a34a',
  accentLight: '#4ade80',

  // Surfaces (mirror Tailwind `surface`)
  surface: '#0A0A0A',
  surfaceElevated: '#111111',
  surfaceLight: '#161616',
  surfaceCard: '#1C1C1C',
  surfaceBorder: '#2A2A2A',
  muted: '#6b7280',

  white: '#ffffff',
} as const;

/** Translucent fills derived from the trend colors (chart areas, badges). */
export const trendAlpha = {
  up: (alpha: number) => `rgba(74, 222, 128, ${alpha})`,
  down: (alpha: number) => `rgba(248, 113, 113, ${alpha})`,
} as const;

/** Gradient color pairs for `LinearGradient`. */
export const Gradients = {
  accent: ['#4ade80', '#22c55e'] as const,
  disabled: ['#262626', '#262626'] as const,
} as const;
