/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050509',
          900: '#0a0a14',
          800: '#10101f',
          700: '#17172b',
        },
        // primary accent — electric blue
        coral: {
          400: '#7c9cff',
          500: '#4f6fff',
          600: '#3d56e0',
          700: '#2f43b8',
        },
        // secondary accent — violet/purple
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
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
          400: '#7c9cff',
          500: '#4f6fff',
          600: '#3d56e0',
        },
        gold: {
          400: '#7c9cff',
          500: '#4f6fff',
          600: '#3d56e0',
        },
        peach: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        accent: {
          cyan: '#7c9cff',
          violet: '#8b5cf6',
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
