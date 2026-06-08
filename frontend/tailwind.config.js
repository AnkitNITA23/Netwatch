/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-surface-light': '#334155',
        'neon-blue': '#00d9ff',
        'neon-purple': '#c084fc',
        'neon-pink': '#ec4899',
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)' },
        },
      },
      backdropFilter: {
        'glass': 'blur(10px)',
      },
    },
  },
  plugins: [],
}
