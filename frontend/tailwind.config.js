/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0a',
          900: '#0e0e10',
          800: '#15151a',
          700: '#1c1c22',
        },
        cream: {
          50: '#fafaf7',
          100: '#f5f3ec',
          200: '#ede9dc',
          300: '#d9d4c2',
        },
        lime: {
          400: '#d4f56b',
          500: '#bce650',
          600: '#a3cf3d',
        },
        peach: {
          400: '#fbbf9c',
          500: '#f8a978',
        },
        // backward-compat keys still referenced by older files
        gold: {
          400: '#d4f56b',
          500: '#bce650',
          600: '#a3cf3d',
        },
        accent: {
          cyan: '#7ee8c5',
          violet: '#f8a978',
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'gradient': 'gradient 8s ease infinite',
        'marquee': 'marquee 30s linear infinite',
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
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
