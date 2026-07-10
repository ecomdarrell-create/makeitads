// ═══════════════════════════════════════════════════════════
//  DESIGN TOKENS - MakeItAds Design System
// Tous les composants doivent utiliser ces valeurs
// ══════════════════════════════════════════════════════════

// ✅ SPACING SCALE (8px base grid)
export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
} as const;

// ✅ TYPOGRAPHY SCALE
export const typography = {
  // Font sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  
  // Font weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
} as const;

// ✅ BUTTON SPECIFICATIONS
export const buttonSpecs = {
  // Heights (consistent across all buttons)
  height: {
    sm: '2.25rem',    // 36px
    md: '2.75rem',    // 44px (touch target)
    lg: '3.25rem',    // 52px
  },
  
  // Padding
  padding: {
    sm: '0 0.75rem',
    md: '0 1.25rem',
    lg: '0 1.5rem',
  },
  
  // Border radius
  radius: '0.625rem', // 10px
  
  // Font
  fontSize: '0.875rem', // 14px
  fontWeight: 500,
  
  // Gap between icon and text
  gap: '0.5rem', // 8px
} as const;

// ✅ ICON SPECIFICATIONS
export const iconSpecs = {
  // Standard sizes
  size: {
    sm: '1rem',      // 16px
    md: '1.25rem',   // 20px
    lg: '1.5rem',    // 24px
  },
  
  // Stroke width (consistent)
  strokeWidth: 2,
  
  // Gap with text
  gap: '0.5rem', // 8px
} as const;

// ✅ ANIMATION SPECIFICATIONS
export const animationSpecs = {
  // Durations
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  
  // Easing curves
  easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  // Page transitions
  pageTransition: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  },
} as const;

// ✅ LAYOUT SPECIFICATIONS
export const layoutSpecs = {
  // Header
  header: {
    height: '4rem', // 64px
    paddingX: {
      mobile: '1rem',    // 16px
      tablet: '1.5rem',  // 24px
      desktop: '2rem',   // 32px
    },
  },
  
  // Sidebar
  sidebar: {
    width: '16.25rem', // 260px
  },
  
  // Main content
  main: {
    padding: {
      mobile: '1rem',    // 16px
      tablet: '1.5rem',  // 24px
      desktop: '2rem',   // 32px
    },
    paddingTop: '5rem', // 80px (header + spacing)
  },
  
  // Cards
  card: {
    radius: '1rem', // 16px
    padding: {
      mobile: '1.25rem', // 20px
      desktop: '1.5rem', // 24px
    },
    gap: '1.5rem', // 24px between cards
  },
} as const;

// ✅ COLORS (reference only - actual colors in Tailwind config)
export const colors = {
  brand: {
    primary: '#6366f1',
    accent: '#8b5cf6',
    dark: '#4f46e5',
    light: '#a5b4fc',
  },
  background: {
    primary: '#080810',
    secondary: '#0a0a14',
    elevated: '#0f0f1a',
    card: '#0a0a14',
  },
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    muted: '#64748b',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.06)',
    strong: 'rgba(255, 255, 255, 0.2)',
  },
} as const;

// Export all tokens
export const designTokens = {
  spacing,
  typography,
  buttonSpecs,
  iconSpecs,
  animationSpecs,
  layoutSpecs,
  colors,
} as const;