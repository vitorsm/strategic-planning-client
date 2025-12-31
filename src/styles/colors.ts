export const themes = {
  light: {
    primary: '#137fec',
    primaryHover: '#0f6fd3',
    primaryRing: 'rgba(19, 127, 236, 0.15)',

    bg: '#f6f7f8',
    white: '#ffffff',
    card: '#ffffff',
    surface: '#ffffff',
    surface2: '#f3f4f6',
    inputBg: '#ffffff',

    text: '#0f172a',
    muted: '#64748b',
    muted2: '#94a3b8',

    border: '#e2e8f0',
    borderDark: '#1f2937',

    success: '#16a34a',
    danger: '#dc2626',
  },
  dark: {
    primary: '#137fec',
    primaryHover: '#0f6fd3',
    primaryRing: 'rgba(19, 127, 236, 0.25)',

    // Matches the darker palette used in `src/code.html`
    bg: '#101922',
    white: '#ffffff',
    card: '#0b1220',
    surface: '#1c2127',
    surface2: '#283039',
    inputBg: '#111418',

    text: '#e5e7eb',
    muted: '#94a3b8',
    muted2: '#64748b',

    border: '#1f2937',
    borderDark: '#0b1220',

    success: '#22c55e',
    danger: '#ef4444',
  },
} as const;

export type ThemeName = keyof typeof themes;
export type Colors = (typeof themes)[ThemeName];

/**
 * Backwards-compatible default palette so existing imports (`import { colors } ...`)
 * keep working. Switch this to `themes.dark` once you wire up runtime theming.
 */
export const colors: Colors = themes.dark;


