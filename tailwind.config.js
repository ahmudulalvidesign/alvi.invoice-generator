/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#111827',
        accent: '#2563EB',
        success: '#16A34A',
        border: '#E5E7EB',
        bg: '#F9FAFB',
        card: '#FFFFFF',
        dark: {
          bg: '#1a1a1a',
          card: '#1f1f1f',
          border: '#2a2a2a',
        },
      },
      borderRadius: {
        xl2: '16px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(17, 24, 39, 0.04), 0 1px 3px rgba(17, 24, 39, 0.06)',
        card: '0 1px 3px rgba(17, 24, 39, 0.06), 0 1px 2px rgba(17, 24, 39, 0.04)',
      },
    },
  },
  plugins: [],
}
