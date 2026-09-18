import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F7FF',
          100: '#E0F0FF',
          200: '#BAE0FF',
          300: '#7CC2FF',
          400: '#389EFF',
          500: '#0284C7', // Primary Accent Blue
          600: '#0265A2',
          700: '#0F4C81',
          800: '#0B3356', // Deep Navy
          900: '#072038', // Darkest Navy
          950: '#03101D',
        },
        cyanAccent: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        healthBg: '#F5F9FD',
        healthCard: '#FFFFFF',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
        'premium': '0 10px 30px -5px rgba(14, 165, 233, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'float': '0 20px 40px -15px rgba(7, 32, 56, 0.12)',
        'glow': '0 0 25px rgba(2, 132, 199, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.8s ease-in-out infinite',
        'scan': 'scan 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.2)' },
        },
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
