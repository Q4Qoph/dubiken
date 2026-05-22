/**
 * Dubiken Global Trade Interface — from DESIGN.md
 * Flat design: no gradients, no drop shadows.
 */
export const colors = {
  surface: '#f8f9ff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainer: '#e5eeff',
  onSurface: '#0b1c30',
  onSurfaceVariant: '#434653',
  outline: '#737784',
  outlineVariant: '#c3c6d5',
  primary: '#00357f',
  primaryContainer: '#004aad',
  onPrimary: '#ffffff',
  secondaryContainer: '#ff924d',
  onSecondaryContainer: '#6d2f00',
  error: '#ba1a1a',
} as const;

export const layout = {
  containerMax: '1280px',
  gutter: '24px',
} as const;
