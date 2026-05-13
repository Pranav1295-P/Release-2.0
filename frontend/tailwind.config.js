/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#000000',
          900: '#070708',
          800: '#0e0e10',
          700: '#16161a',
        },
        coral: {
          400: '#ff7a4d',
          500: '#ff5722',
          600: '#e64a1a',
          700: '#c93f15',
        },
        mute: {
          100: '#fafafa',
          300: '#a3a3a3',
          500: '#737373',
          700: '#404040',
        },
        // backward-compat (older files still use these tokens)
        cream: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#a3a3a3',
        },
        lime: {
          400: '#ff5722',
          500: '#ff5722',
          600: '#e64a1a',
        },
        gold: {
          400: '#ff5722',
          500: '#ff5722',
          600: '#e64a1a',
        },
        peach: {
          400: '#ff7a4d',
          500: '#ff5722',
        },
        accent: {
          cyan: '#ff7a4d',
          violet: '#ff5722',
        },
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
