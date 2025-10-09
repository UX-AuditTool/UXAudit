/**
 * Design Tokens for UX Audit MVP
 *
 * These tokens define the visual language of the application.
 * Use these values throughout the codebase for consistency.
 *
 * Import in Tailwind config or use directly in components.
 */

export const designTokens = {
  /**
   * COLOR PALETTE
   */
  colors: {
    // Background
    background: {
      page: '#F5F1EA',      // Warm cream base
      card: '#FFFFFF',      // Pure white for contrast
      cardHover: '#FDFCFA', // Subtle warm tint
    },

    // Brand Colors
    sage: {
      50: '#F4F6F5',
      100: '#E8EBE9',
      200: '#D1D7D3',
      300: '#BAC3BD',
      400: '#A3AFA7',
      500: '#8C8C5A',  // Primary brand color
      600: '#707048',  // Primary hover
      700: '#545436',  // Primary active
      800: '#383824',
      900: '#1C1C12',
    },

    teal: {
      50: '#F1F4F3',
      100: '#E3E9E7',
      200: '#C7D3CF',
      300: '#ABBDB7',
      400: '#8FA79F',
      500: '#516C61',  // Secondary, accents
      600: '#41564E',  // Hover
      700: '#31413B',  // Active
      800: '#202B28',
      900: '#101614',
    },

    blush: {
      50: '#FEF8F6',
      100: '#FDF1ED',
      200: '#FBE3DB',
      300: '#F9D5C9',
      400: '#F7C7B7',
      500: '#F0C2B4',  // Success, warmth
      600: '#C09B90',  // Hover
      700: '#90746C',  // Active
      800: '#604E48',
      900: '#302724',
    },

    espresso: {
      50: '#F3F1F0',
      100: '#E7E3E1',
      200: '#CFC7C3',
      300: '#B7ABA5',
      400: '#9F8F87',
      500: '#3A2A28',  // Primary text, dark elements
      600: '#2E2220',  // Headings
      700: '#231918',
      800: '#171110',
      900: '#0C0908',
    },

    goldenrod: {
      50: '#FCF9F1',
      100: '#F9F3E3',
      200: '#F3E7C7',
      300: '#EDDBAB',
      400: '#E7CF8F',
      500: '#D8B466',  // Warning, attention
      600: '#AD9052',  // Hover
      700: '#826C3E',  // Active
      800: '#56482A',
      900: '#2B2415',
    },

    // Semantic Colors
    semantic: {
      success: '#F0C2B4',     // Blush pink (warm positive)
      warning: '#D8B466',     // Goldenrod (attention)
      error: '#8B3A3A',       // Error red tint (critical)
      info: '#516C61',        // Forest teal (informative)
    },

    // Neutral Tones (Warm Gray)
    neutral: {
      50: '#FAFAF9',
      100: '#F5F5F4',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A8A29E',
      500: '#78716C',
      600: '#57534E',
      700: '#44403C',
      800: '#292524',
      900: '#1C1917',
    },
  },

  /**
   * TYPOGRAPHY
   */
  typography: {
    fontFamily: {
      heading: "'EB Garamond', 'Garamond', 'Georgia', serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    },

    fontSize: {
      // Display sizes (Garamond)
      '4xl': ['2.625rem', { lineHeight: '3rem', letterSpacing: '-0.02em', fontWeight: '600' }],      // 42px
      '3xl': ['2.25rem', { lineHeight: '2.625rem', letterSpacing: '-0.01em', fontWeight: '600' }],   // 36px
      '2xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.01em', fontWeight: '600' }],  // 30px

      // Heading sizes (Garamond)
      'xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em', fontWeight: '600' }],         // 24px
      'lg': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0', fontWeight: '600' }],           // 20px
      'base': ['1.125rem', { lineHeight: '1.625rem', letterSpacing: '0', fontWeight: '600' }],       // 18px

      // Body sizes (Inter)
      'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],   // 18px
      'body-base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],      // 16px
      'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],   // 14px
      'body-xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],       // 12px

      // Label sizes (Inter)
      'label-base': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em', fontWeight: '500' }], // 14px
      'label-sm': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em', fontWeight: '500' }],       // 12px
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  /**
   * SPACING
   */
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px - Base spacing
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  /**
   * BORDER RADIUS
   */
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  /**
   * SHADOWS
   */
  boxShadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  /**
   * COMPONENT-SPECIFIC TOKENS
   */
  components: {
    button: {
      primary: {
        bg: '#8C8C5A',        // Sage 500
        bgHover: '#707048',   // Sage 600
        bgActive: '#545436',  // Sage 700
        text: '#FFFFFF',
      },
      secondary: {
        bg: '#FFFFFF',
        border: '#D6D3D1',    // Neutral 300
        borderHover: '#516C61', // Teal 500
        text: '#3A2A28',      // Espresso 500
      },
      ghost: {
        bg: 'transparent',
        bgHover: '#F1F4F3',   // Teal 50
        text: '#516C61',      // Teal 500
      },
      destructive: {
        bg: '#8B3A3A',
        bgHover: '#6B2C2C',
        text: '#FFFFFF',
      },
    },

    input: {
      bg: '#FFFFFF',
      border: '#E7E5E4',       // Neutral 200
      borderFocus: '#516C61',  // Teal 500
      borderError: '#8B3A3A',
      borderSuccess: '#F0C2B4', // Blush 500
      text: '#3A2A28',         // Espresso 500
      placeholder: '#A8A29E',  // Neutral 400
      focusShadow: 'rgba(81, 108, 97, 0.12)',
      errorShadow: 'rgba(139, 58, 58, 0.12)',
    },

    card: {
      bg: '#FFFFFF',
      bgHover: '#FDFCFA',
      border: '#E7E5E4',       // Neutral 200
      borderHover: '#D6D3D1',  // Neutral 300
    },

    badge: {
      severity: {
        critical: { bg: '#8B3A3A', text: '#FFFFFF' },
        high: { bg: '#D8B466', text: '#2E2220' },     // Goldenrod 500, Espresso 600
        medium: { bg: '#F9F3E3', text: '#56482A' },   // Goldenrod 100, 800
        low: { bg: '#F5F5F4', text: '#44403C' },      // Neutral 100, 700
      },
      priority: {
        high: { bg: '#D8B466', text: '#2E2220' },     // Goldenrod 500, Espresso 600
        medium: { bg: '#F9F3E3', text: '#56482A' },   // Goldenrod 100, 800
        low: { bg: '#FDF1ED', text: '#90746C' },      // Blush 100, 700
      },
      score: {
        poor: { bg: '#8B3A3A', text: '#FFFFFF' },     // 1-2
        fair: { bg: '#F9F3E3', text: '#56482A' },     // 2.5-3.5 Goldenrod
        good: { bg: '#FDF1ED', text: '#90746C' },     // 3.5-4.5 Blush
        excellent: { bg: '#8C8C5A', text: '#FFFFFF' }, // 4.5-5 Sage
      },
    },

    sidebar: {
      bg: '#3A2A28',           // Espresso 500
      text: '#FFFFFF',
      activeItemBg: '#8C8C5A', // Sage 500
      hoverItemBg: '#2E2220',  // Espresso 600
      border: '#231918',       // Espresso 700
    },
  },

  /**
   * ACCESSIBILITY
   */
  accessibility: {
    focusRing: {
      color: '#8C8C5A',   // Sage 500
      width: '2px',
      offset: '2px',
    },
    minTouchTarget: '44px',
    contrastRatios: {
      normalText: '4.5:1',
      largeText: '3:1',
      uiComponents: '3:1',
    },
  },

  /**
   * BREAKPOINTS
   */
  breakpoints: {
    mobile: '320px',
    tablet: '640px',
    desktop: '1024px',
    large: '1280px',
  },

  /**
   * Z-INDEX SCALE
   */
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    toast: 50,
    tooltip: 60,
  },

  /**
   * TRANSITIONS
   */
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Type export for TypeScript usage
export type DesignTokens = typeof designTokens;

// Helper function to get color with opacity
export function withOpacity(color: string, opacity: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Export individual color palettes for convenience
export const { colors, typography, spacing, borderRadius, boxShadow, components } = designTokens;
