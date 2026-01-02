/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Colors mapped to CSS Variables
        primary: 'var(--color-primary)',

        // Dynamic Backgrounds (Changes based on mode)
        'background-dark': 'var(--bg-main)', // Main background
        'surface-dark': 'var(--bg-surface)', // Card background
        'surface-accent': 'var(--bg-accent)', // Hover/Active states

        'border-dark': 'var(--border-color)', // Border color

        // Text colors that adapt
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        'text-inverted': 'var(--text-inverted)',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': 'left center' },
          '50%': { 'background-position': 'right center' },
        }
      }
    },
  },
  plugins: [],
}