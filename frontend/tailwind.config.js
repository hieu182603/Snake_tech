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
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: {
          dark: '#0f0c29',
          light: '#ffffff',
        },
        surface: {
          dark: '#1a1a2e',
          accent: '#16213e',
        },
        border: {
          dark: '#2a2a3e',
        },
        text: {
          main: '#e2e8f0',
          secondary: '#94a3b8',
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