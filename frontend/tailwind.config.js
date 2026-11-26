/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          light: '#f0fdfa', // Teal 50
          DEFAULT: '#0f766e', // Teal 700 - deep calming botanical teal
          dark: '#115e59', // Teal 800
          accent: '#14b8a6', // Teal 500
          soft: '#ccfbf1',
        },
        surface: {
          50: '#faf9f6',  // Warm Alabaster 50
          100: '#f5f3ef', // Warm Linen 100
          200: '#ebe7e0', // Soft Sand 200
          300: '#dcd7cd',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e6efe8',
          200: '#d1e1d5',
          600: '#3d7a54',
          700: '#2e5d40',
          800: '#244832',
        },
        sand: {
          50: '#fbfbfa',
          100: '#f5f3ef',
          200: '#ebe7e0',
          500: '#a39887',
          800: '#524b40',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
