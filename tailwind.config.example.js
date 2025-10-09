/** @type {import('tailwindcss').Config} */

/**
 * Tailwind CSS Configuration for UX Audit MVP
 *
 * This config extends Tailwind with custom design tokens
 * Import design-tokens.ts for consistent theming
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom color palette
      colors: {
        // Background
        'page-bg': '#F5F1EA',
        'card-bg': '#FFFFFF',
        'card-hover': '#FDFCFA',

        // Brand colors
        sage: {
          50: '#F4F6F5',
          100: '#E8EBE9',
          200: '#D1D7D3',
          300: '#BAC3BD',
          400: '#A3AFA7',
          500: '#8C8C5A',
          600: '#707048',
          700: '#545436',
          800: '#383824',
          900: '#1C1C12',
        },
        teal: {
          50: '#F1F4F3',
          100: '#E3E9E7',
          200: '#C7D3CF',
          300: '#ABBDB7',
          400: '#8FA79F',
          500: '#516C61',
          600: '#41564E',
          700: '#31413B',
          800: '#202B28',
          900: '#101614',
        },
        blush: {
          50: '#FEF8F6',
          100: '#FDF1ED',
          200: '#FBE3DB',
          300: '#F9D5C9',
          400: '#F7C7B7',
          500: '#F0C2B4',
          600: '#C09B90',
          700: '#90746C',
          800: '#604E48',
          900: '#302724',
        },
        espresso: {
          50: '#F3F1F0',
          100: '#E7E3E1',
          200: '#CFC7C3',
          300: '#B7ABA5',
          400: '#9F8F87',
          500: '#3A2A28',
          600: '#2E2220',
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
          500: '#D8B466',
          600: '#AD9052',
          700: '#826C3E',
          800: '#56482A',
          900: '#2B2415',
        },

        // Semantic colors
        success: '#F0C2B4',
        warning: '#D8B466',
        error: '#8B3A3A',
        info: '#516C61',

        // Neutral (warm grays)
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

      // Typography
      fontFamily: {
        heading: ['EB Garamond', 'Garamond', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },

      fontSize: {
        // Display (Garamond)
        '4xl': ['2.625rem', { lineHeight: '3rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        '3xl': ['2.25rem', { lineHeight: '2.625rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        '2xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.01em', fontWeight: '600' }],

        // Headings (Garamond)
        'xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        'lg': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0', fontWeight: '600' }],
        'base': ['1.125rem', { lineHeight: '1.625rem', letterSpacing: '0', fontWeight: '600' }],

        // Body (Inter)
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'body-base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'body-xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],

        // Labels (Inter)
        'label-base': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-sm': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em', fontWeight: '500' }],
      },

      // Spacing (4px base unit)
      spacing: {
        0: '0',
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
      },

      // Border radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'base': '0.375rem', // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
        '2xl': '1.5rem',    // 24px
        'full': '9999px',
      },

      // Box shadows
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },

      // Transitions
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // Z-index
      zIndex: {
        'dropdown': '10',
        'sticky': '20',
        'overlay': '30',
        'modal': '40',
        'toast': '50',
        'tooltip': '60',
      },

      // Backdrop blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
    },
  },
  plugins: [
    // Add any plugins here (e.g., @tailwindcss/forms, @tailwindcss/typography)
  ],
}
