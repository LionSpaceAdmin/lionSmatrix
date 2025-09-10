import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // LionSpace Futuristic Intelligence Terminal Color System
        background: '#030712',           // Primary background - Deep space black
        foreground: '#E5E7EB',          // Primary text - Clear white
        
        // Core operational colors
        primary: {
          DEFAULT: '#6EE7B7',           // Operational cyan - Primary actions
          foreground: '#030712',        // Dark text on cyan
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        
        secondary: {
          DEFAULT: '#0F172A',           // Deep navy blue - Secondary surfaces
          foreground: '#E5E7EB',        // Light text on dark
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        
        // Strategic accent colors
        accent: {
          DEFAULT: '#FFB700',           // Strategic gold - Key indicators
          foreground: '#030712',        // Dark text on gold
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FFB700',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        
        // Alert system
        destructive: {
          DEFAULT: '#D43F3F',           // Alert red - Critical warnings
          foreground: '#FFFFFF',        // White text on red
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#D43F3F',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        
        // UI element colors
        muted: {
          DEFAULT: '#1E293B',           // Muted background
          foreground: '#94A3B8',        // Muted text
        },
        
        border: '#1E293B',              // Terminal borders
        input: '#1E293B',               // Input borders
        ring: '#6EE7B7',                // Focus ring cyan
        
        // Terminal specific colors
        'terminal-bg': '#030712',
        'terminal-grid': '#0F172A',
        'terminal-line': '#1E293B',
        'terminal-text': '#E5E7EB',
        'terminal-cyan': '#6EE7B7',
        'terminal-gold': '#FFB700',
        'terminal-red': '#D43F3F',
        'terminal-glow-cyan': '#6EE7B7',
        'terminal-glow-gold': '#FFB700',
        'data-stream': '#34D399',
        'network-node': '#6EE7B7',
        'network-edge': '#1E293B',
      },
      
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'monospace'],
        terminal: ['Space Mono', 'monospace'],
      },
      
      animation: {
        'data-flow': 'data-flow 3s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'terminal-blink': 'terminal-blink 1.5s step-end infinite',
        'grid-fade': 'grid-fade 4s ease-in-out infinite',
        'node-pulse': 'node-pulse 2s ease-in-out infinite',
        'edge-flow': 'edge-flow 3s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'status-ping': 'status-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      
      keyframes: {
        'data-flow': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'terminal-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'grid-fade': {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.08' },
        },
        'node-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        'edge-flow': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '100' },
        },
        'glow-pulse': {
          '0%': { filter: 'brightness(1) drop-shadow(0 0 10px currentColor)' },
          '100%': { filter: 'brightness(1.2) drop-shadow(0 0 20px currentColor)' },
        },
        'status-ping': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'terminal-gradient': 'linear-gradient(180deg, #030712 0%, #0F172A 100%)',
        'data-gradient': 'linear-gradient(90deg, transparent, #6EE7B7, transparent)',
        'grid-pattern': `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          #1E293B1A 2px,
          #1E293B1A 4px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          #1E293B1A 2px,
          #1E293B1A 4px
        )`,
        'scan-gradient': 'linear-gradient(180deg, transparent, #6EE7B740, transparent)',
      },
      boxShadow: {
        'terminal': '0 0 40px rgba(110, 231, 183, 0.1)',
        'glow-cyan': '0 0 20px rgba(110, 231, 183, 0.5)',
        'glow-gold': '0 0 20px rgba(255, 183, 0, 0.5)',
        'glow-red': '0 0 20px rgba(212, 63, 63, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(110, 231, 183, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config