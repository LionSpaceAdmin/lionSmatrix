/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'terminal': ['Space Mono', 'monospace'],
        'headline': ['Space Mono', 'monospace'],
      },
      colors: {
        'terminal-bg': '#0a0a0a',
        'terminal-text': '#00ff88',
        'terminal-cyan': '#00ffff',
        'terminal-border': '#333',
        'terminal-muted': '#888',
      },
    },
  },
  plugins: [],
}