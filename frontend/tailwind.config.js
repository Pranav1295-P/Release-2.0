/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070707',
          900: '#0d0d0d',
          800: '#141414',
          700: '#1c1c1c',
        },
        // Primary brand red — vibrant, sporty
        coral: {
          400: '#ff3848',
          500: '#e30613',
          600: '#b80510',
          700: '#8a040c',
        },
        red: {
          400: '#ff3848',
          500: '#e30613',
          600: '#b80510',
        },
        // Gold accent — premium muted (jersey-trim style)
        gold: {
          400: '#f4c842',
          500: '#d4a24c',
          600: '#a87a30',
          700: '#7a5520',
        },
        // Backward-compat aliases so any old usages auto-flip
        lime:   { 400: '#ff3848', 500: '#e30613', 600: '#b80510' },
        peach:  { 400: '#ff6d54', 500: '#ff3848' },
        violet: { 400: '#f4c842', 500: '#d4a24c', 600: '#a87a30' },
        cream:  { 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#a3a3a3' },
        mute:   { 100: '#fafafa', 300: '#a3a3a3', 500: '#737373', 700: '#404040' },
        accent: { cyan: '#f4c842', violet: '#e30613' },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
