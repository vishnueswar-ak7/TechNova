/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'elder-sm': ['1.125rem', { lineHeight: '1.75rem' }],
        'elder-base': ['1.25rem', { lineHeight: '2rem' }],
        'elder-lg': ['1.5rem', { lineHeight: '2.25rem' }],
        'elder-xl': ['1.875rem', { lineHeight: '2.5rem' }],
        'elder-2xl': ['2.25rem', { lineHeight: '2.75rem' }],
        'elder-3xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        safe: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        warn: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fff1f2',
          500: '#f43f5e',
          700: '#be123c',
        },
      },
      minHeight: {
        touch: '56px',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};
