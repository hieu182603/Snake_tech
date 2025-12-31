/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: {
          DEFAULT: 'var(--background)',
          dark: '#0a0a0a',
          light: '#ffffff',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          dark: 'var(--surface-dark)',
          accent: 'var(--surface-accent)',
        },
        border: {
          DEFAULT: 'var(--border)',
          dark: 'var(--border-dark)',
        },
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          secondary: 'var(--text-secondary)',
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}