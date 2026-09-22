/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-navy': '#0B1220',
        'ink-navy-light': '#1E293B',
        'soft-surface': '#F8FAFC',
        'evidence-teal': '#0F6E56',
        'need-blue': '#2563EB',
        'synergy-violet': '#8B5CF6',
        'warning-orange': '#F59E0B',
        'urgent-red': '#EF4444',
        'neutral-gray': '#64748B',
        'border-gray': '#E2E8F0',
      },
      fontFamily: {
        display: ['"Geist"', 'sans-serif'],
        body: ['"Geist"', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
