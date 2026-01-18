/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'navy': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        'gold': {
          50: '#fefcf3',
          100: '#fef7e0',
          200: '#fcedc2',
          300: '#f9dd94',
          400: '#f5c566',
          500: '#f0ad3d',
          600: '#d4af37',
          700: '#b8942d',
          800: '#9a7a28',
          900: '#7d6322',
        },
        'beige': {
          50: '#fdfcfb',
          100: '#faf9f7',
          200: '#f8f6f2',
          300: '#f3f1ed',
          400: '#ebe8e1',
          500: '#e3dfd5',
          600: '#d1ccc0',
          700: '#bfb9aa',
          800: '#9e9788',
          900: '#7d7568',
        },
      },
    },
  },
  plugins: [],
}
