/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // ═══════════════════════════════════════════════════════════
    // BREAKPOINTS PERSONNALISÉS (Mobile-First)
    // ═══════════════════════════════════════════════════════════
    screens: {
      'xs': '360px',    // Petit mobile
      'sm': '430px',    // Mobile standard
      'md': '768px',    // Tablette
      'lg': '1024px',   // Laptop
      'xl': '1280px',   // Desktop
      '2xl': '1440px',  // Large desktop
      '3xl': '1920px',  // Ultra-wide
    },
    
    // ═══════════════════════════════════════════════════════════
    // CONTAINER RESPONSIVE
    // ═══════════════════════════════════════════════════════════
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',      // 16px mobile
        'sm': '1.25rem',      // 20px
        'md': '1.5rem',       // 24px
        'lg': '2rem',         // 32px
        'xl': '2.5rem',       // 40px
        '2xl': '3rem',        // 48px
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
      // ═══════════════════════════════════════════════════════════
      // COULEURS (conservées + enrichies)
      // ═══════════════════════════════════════════════════════════
      colors: {
        // Fonds sombres (thème original)
        background: {
          DEFAULT: "#080810",
          secondary: "#0a0a14",
          dashboard: "#0f0f1a",
          card: "#0a0a14",
          elevated: "#12121c",
          hover: "#16161f",
        },
        // Textes clairs sur fond sombre
        foreground: {
          DEFAULT: "#FFFFFF",
          secondary: "#94A3B8",
          muted: "#64748B",
          disabled: "#475569",
        },
        // Marque (violet/indigo)
        brand: {
          DEFAULT: "#6366F1",
          accent: "#8B5CF6",
          light: "#EEF2FF",
          dark: "#4F46E5",
          hover: "#5558E6",
          active: "#4338CA",
        },
        // Bordures
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          light: "rgba(255, 255, 255, 0.05)",
          strong: "rgba(255, 255, 255, 0.2)",
        },
        // Sémantique
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      
      // ═══════════════════════════════════════════════════════════
      // TYPOGRAPHIE
      // ═══════════════════════════════════════════════════════════
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      
      fontSize: {
        // Échelle responsive mobile-first
        'xs': ['0.75rem', { lineHeight: '1rem' }],           // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],       // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],          // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],       // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],        // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],           // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],      // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],        // 36px
        '5xl': ['3rem', { lineHeight: '1.1' }],              // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],             // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }],              // 72px
        '8xl': ['6rem', { lineHeight: '1' }],                // 96px
        '9xl': ['8rem', { lineHeight: '1' }],                // 128px
      },
      
      // ═══════════════════════════════════════════════════════════
      // ESPACEMENTS (Scale cohérente)
      // ═══════════════════════════════════════════════════════════
      spacing: {
        '0': '0',
        '0.5': '0.125rem',   // 2px
        '1': '0.25rem',      // 4px
        '1.5': '0.375rem',   // 6px
        '2': '0.5rem',       // 8px
        '2.5': '0.625rem',   // 10px
        '3': '0.75rem',      // 12px
        '3.5': '0.875rem',   // 14px
        '4': '1rem',         // 16px
        '5': '1.25rem',      // 20px
        '6': '1.5rem',       // 24px
        '7': '1.75rem',      // 28px
        '8': '2rem',         // 32px
        '9': '2.25rem',      // 36px
        '10': '2.5rem',      // 40px
        '11': '2.75rem',     // 44px (Touch target minimum)
        '12': '3rem',        // 48px
        '14': '3.5rem',      // 56px
        '16': '4rem',        // 64px
        '20': '5rem',        // 80px
        '24': '6rem',        // 96px
        '28': '7rem',        // 112px
        '32': '8rem',        // 128px
        '36': '9rem',        // 144px
        '40': '10rem',       // 160px
        '44': '11rem',       // 176px
        '48': '12rem',       // 192px
        '52': '13rem',       // 208px
        '56': '14rem',       // 224px
        '60': '15rem',       // 240px
        '64': '16rem',       // 256px
        '72': '18rem',       // 288px
        '80': '20rem',       // 320px
        '96': '24rem',       // 384px
      },
      
      // ═══════════════════════════════════════════════════════════
      // BORDER RADIUS
      // ═══════════════════════════════════════════════════════════
      borderRadius: {
        'none': '0',
        'sm': '0.375rem',    // 6px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.625rem',    // 10px
        'lg': '0.75rem',     // 12px
        'xl': '1rem',        // 16px
        '2xl': '1.25rem',    // 20px
        '3xl': '1.5rem',     // 24px
        '4xl': '2rem',       // 32px
        'full': '9999px',
        'button': '0.625rem',
        'card': '1rem',
      },
      
      // ═══════════════════════════════════════════════════════════
      // BOX SHADOWS
      // ═══════════════════════════════════════════════════════════
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
        'elevated': '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
        'glow': '0 0 20px rgb(99 102 241 / 0.3)',
        'glow-lg': '0 0 40px rgb(99 102 241 / 0.4)',
      },
      
      // ═══════════════════════════════════════════════════════════
      // ANIMATIONS & TRANSITIONS
      // ═══════════════════════════════════════════════════════════
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // ═══════════════════════════════════════════════════════════
      // Z-INDEX (Hiérarchie claire)
      // ═══════════════════════════════════════════════════════════
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'navbar': '100',
        'drawer': '200',
        'modal': '300',
        'popover': '400',
        'tooltip': '500',
        'max': '9999',
      },
      
      // ═══════════════════════════════════════════════════════════
      // MIN HEIGHTS (Touch targets)
      // ═══════════════════════════════════════════════════════════
      minHeight: {
        'touch': '44px',      // Minimum Apple/Google
        'button': '44px',     // Boutons
        'input': '44px',      // Inputs
      },
      
      // ═══════════════════════════════════════════════════════════
      // ASPECT RATIOS
      // ═══════════════════════════════════════════════════════════
      aspectRatio: {
        'auto': 'auto',
        '1': '1 / 1',
        '4/3': '4 / 3',
        '16/9': '16 / 9',
        '21/9': '21 / 9',
        '3/4': '3 / 4',
        '9/16': '9 / 16',
      },
    },
  },
  plugins: [],
};