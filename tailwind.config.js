/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '360px',
      'sm': '430px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        'sm': '1.25rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        // Fonds clairs (White Premium Theme)
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8FAFC",
          soft: "#F4F4F6",
          dashboard: "#0f0f1a", // Conservé pour le dashboard
          card: "#FFFFFF",
          elevated: "#F8FAFC",
          hover: "#F1F5F9",
        },
        // Textes sombres sur fond clair
        foreground: {
          DEFAULT: "#0F172A", // Noir premium
          secondary: "#475569", // Gris doux
          muted: "#64748B", // Gris moyen
          disabled: "#94A3B8",
        },
        // Marque (violet/indigo conservé)
        brand: {
          DEFAULT: "#6366F1",
          accent: "#8B5CF6",
          light: "#EEF2FF",
          dark: "#4F46E5",
          hover: "#5558E6",
          active: "#4338CA",
        },
        // Bordures subtiles
        border: {
          DEFAULT: "#E2E8F0",
          light: "#F1F5F9",
          strong: "#CBD5E1",
        },
        // Sémantique
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '0': '0', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem',
        '2': '0.5rem', '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem',
        '4': '1rem', '5': '1.25rem', '6': '1.5rem', '7': '1.75rem',
        '8': '2rem', '9': '2.25rem', '10': '2.5rem', '11': '2.75rem',
        '12': '3rem', '14': '3.5rem', '16': '4rem', '20': '5rem',
        '24': '6rem', '28': '7rem', '32': '8rem', '36': '9rem',
        '40': '10rem', '44': '11rem', '48': '12rem', '52': '13rem',
        '56': '14rem', '60': '15rem', '64': '16rem', '72': '18rem',
        '80': '20rem', '96': '24rem',
      },
      borderRadius: {
        'none': '0', 'sm': '0.375rem', 'DEFAULT': '0.5rem', 'md': '0.625rem',
        'lg': '0.75rem', 'xl': '1rem', '2xl': '1.25rem', '3xl': '1.5rem',
        '4xl': '2rem', 'full': '9999px', 'button': '0.625rem', 'card': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(15 23 42 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(15 23 42 / 0.1), 0 1px 2px -1px rgb(15 23 42 / 0.1)',
        'md': '0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)',
        'lg': '0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)',
        'xl': '0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(15 23 42 / 0.15)',
        'inner': 'inset 0 2px 4px 0 rgb(15 23 42 / 0.05)',
        'card': '0 10px 40px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 20px 60px rgba(15, 23, 42, 0.12)',
        'glow': '0 0 20px rgb(99 102 241 / 0.3)',
        'glow-lg': '0 0 40px rgb(99 102 241 / 0.4)',
      },
      transitionDuration: {
        '0': '0ms', '75': '75ms', '100': '100ms', '150': '150ms',
        '200': '200ms', '250': '250ms', '300': '300ms', '400': '400ms',
        '500': '500ms', '700': '700ms', '1000': '1000ms',
      },
      zIndex: {
        '0': '0', '10': '10', '20': '20', '30': '30', '40': '40',
        '50': '50', 'navbar': '100', 'drawer': '200', 'modal': '300',
        'popover': '400', 'tooltip': '500', 'max': '9999',
      },
      minHeight: {
        'touch': '44px', 'button': '44px', 'input': '44px',
      },
      aspectRatio: {
        'auto': 'auto', '1': '1 / 1', '4/3': '4 / 3', '16/9': '16 / 9',
        '21/9': '21 / 9', '3/4': '3 / 4', '9/16': '9 / 16',
      },
    },
  },
  plugins: [],
};