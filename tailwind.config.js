/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fonds sombres (thème original)
        background: {
          DEFAULT: "#080810",
          secondary: "#0a0a14",
          dashboard: "#0f0f1a",
          card: "#0a0a14",
          elevated: "#12121c",
        },
        // Textes clairs sur fond sombre
        foreground: {
          DEFAULT: "#FFFFFF",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
        // Marque (violet/indigo - reste identique)
        brand: {
          DEFAULT: "#6366F1",
          accent: "#8B5CF6",
          light: "#EEF2FF",
          dark: "#4F46E5",
        },
        // Sémantique
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)",
        "card-hover": "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)",
        elevated: "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)",
        glow: "0 0 20px rgb(99 102 241 / 0.3)",
      },
      borderRadius: {
        card: "1rem",
        button: "0.625rem",
      },
    },
  },
  plugins: [],
};