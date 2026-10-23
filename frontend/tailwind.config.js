/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        volt: {
          DEFAULT: '#D6ED17',
          light: '#E4F54C',
          dark: '#B0C40E',
          glow: 'rgba(214, 237, 23, 0.25)',
          50: '#FBFDE8',
          100: '#F6FDC9',
          200: '#ECFA97',
          300: '#D6ED17',
          400: '#C2D90D',
          500: '#A3B809',
          600: '#849606',
          900: '#2A3001',
        },
        graphite: {
          DEFAULT: '#606060',
          50: '#F7F7F7',
          100: '#EFEFEF',
          200: '#DFDFDF',
          300: '#BFBFBF',
          400: '#8A8A8A',
          500: '#606060',
          600: '#4F4F4F',
          700: '#3D3D3D',
          800: '#2B2B2B',
          900: '#1A1A1A',
        },
        linear: {
          bg: '#08090A',
          panel: '#0F1012',
          surface: '#151619',
          hover: '#1C1E22',
          border: '#23252A',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          text: '#F0F1F3',
          muted: '#8B909A',
          dim: '#565A63'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'xs': '3px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '10px',
        '2xl': '12px',
      }
    },
  },
  plugins: [],
}
