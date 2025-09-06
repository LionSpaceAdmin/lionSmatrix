/**
 * TailwindUI Design Tokens
 * 
 * Extends the existing Tailwind configuration with TailwindUI-specific design tokens
 * while maintaining consistency with the LionSpace terminal aesthetic.
 */

import type { Config } from 'tailwindcss'

// Terminal-specific design tokens that extend TailwindUI patterns
export const TERMINAL_DESIGN_TOKENS = {
  // Color mappings for TailwindUI component adaptation
  colors: {
    // Primary action colors (maps to TailwindUI primary)
    'tailwindui-primary': '#6EE7B7',        // terminal-cyan
    'tailwindui-primary-hover': '#34D399',   // terminal-cyan darker
    'tailwindui-primary-active': '#10B981',  // terminal-cyan darkest
    
    // Secondary action colors (maps to TailwindUI secondary)
    'tailwindui-secondary': '#FFB700',       // terminal-gold
    'tailwindui-secondary-hover': '#F59E0B', // terminal-gold darker
    'tailwindui-secondary-active': '#D97706', // terminal-gold darkest
    
    // Background colors for TailwindUI components
    'tailwindui-bg-primary': '#030712',      // terminal-bg
    'tailwindui-bg-secondary': '#0F172A',    // secondary-900
    'tailwindui-bg-tertiary': '#1E293B',     // secondary-800
    'tailwindui-bg-elevated': '#334155',     // secondary-700
    
    // Text colors for TailwindUI components  
    'tailwindui-text-primary': '#E5E7EB',    // terminal-text
    'tailwindui-text-secondary': '#94A3B8',  // muted-foreground
    'tailwindui-text-muted': '#64748B',      // secondary-500
    'tailwindui-text-inverse': '#030712',    // dark text on light backgrounds
    
    // Border colors
    'tailwindui-border': '#1E293B',          // terminal-line
    'tailwindui-border-hover': '#334155',    // secondary-700
    'tailwindui-border-focus': '#6EE7B7',    // terminal-cyan for focus states
    
    // Status colors
    'tailwindui-success': '#10B981',         // terminal-cyan variant
    'tailwindui-warning': '#FFB700',         // terminal-gold
    'tailwindui-error': '#D43F3F',           // terminal-red
    'tailwindui-info': '#6EE7B7',           // terminal-cyan
  },
  
  // Typography extensions for TailwindUI components
  typography: {
    fontFamily: {
      'tailwindui-sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
      'tailwindui-mono': ['Space Mono', 'SF Mono', 'Monaco', 'monospace'],
      'tailwindui-terminal': ['Space Mono', 'monospace'],
    },
    fontSize: {
      'tailwindui-xs': ['0.75rem', { lineHeight: '1rem' }],
      'tailwindui-sm': ['0.875rem', { lineHeight: '1.25rem' }],
      'tailwindui-base': ['1rem', { lineHeight: '1.5rem' }],
      'tailwindui-lg': ['1.125rem', { lineHeight: '1.75rem' }],
      'tailwindui-xl': ['1.25rem', { lineHeight: '1.75rem' }],
      'tailwindui-2xl': ['1.5rem', { lineHeight: '2rem' }],
      'tailwindui-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      'tailwindui-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      'tailwindui-normal': '400',
      'tailwindui-medium': '500',
      'tailwindui-semibold': '600',
      'tailwindui-bold': '700',
    },
  },
  
  // Spacing tokens optimized for terminal UI
  spacing: {
    'tailwindui-xs': '0.25rem',    // 4px
    'tailwindui-sm': '0.5rem',     // 8px
    'tailwindui-md': '1rem',       // 16px
    'tailwindui-lg': '1.5rem',     // 24px
    'tailwindui-xl': '2rem',       // 32px
    'tailwindui-2xl': '3rem',      // 48px
    'tailwindui-3xl': '4rem',      // 64px
  },
  
  // Shadow tokens with terminal glow effects
  shadows: {
    'tailwindui-sm': '0 1px 2px 0 rgb(30 41 59 / 0.05)',
    'tailwindui-md': '0 4px 6px -1px rgb(30 41 59 / 0.1), 0 2px 4px -1px rgb(30 41 59 / 0.06)',
    'tailwindui-lg': '0 10px 15px -3px rgb(30 41 59 / 0.1), 0 4px 6px -2px rgb(30 41 59 / 0.05)',
    'tailwindui-xl': '0 20px 25px -5px rgb(30 41 59 / 0.1), 0 10px 10px -5px rgb(30 41 59 / 0.04)',
    'tailwindui-glow': '0 0 20px rgba(110, 231, 183, 0.3)',
    'tailwindui-glow-strong': '0 0 30px rgba(110, 231, 183, 0.5)',
    'tailwindui-focus': '0 0 0 3px rgba(110, 231, 183, 0.1)',
  },
  
  // Border radius tokens
  borderRadius: {
    'tailwindui-none': '0',
    'tailwindui-sm': '0.125rem',   // 2px
    'tailwindui-md': '0.375rem',   // 6px
    'tailwindui-lg': '0.5rem',     // 8px
    'tailwindui-xl': '0.75rem',    // 12px
    'tailwindui-2xl': '1rem',      // 16px
    'tailwindui-full': '9999px',
  },
  
  // Animation tokens for terminal UI
  animations: {
    'tailwindui-fade-in': 'tailwindui-fade-in 0.2s ease-in-out',
    'tailwindui-slide-up': 'tailwindui-slide-up 0.3s ease-out',
    'tailwindui-slide-down': 'tailwindui-slide-down 0.3s ease-out',
    'tailwindui-scale-in': 'tailwindui-scale-in 0.2s ease-out',
    'tailwindui-glow-pulse': 'tailwindui-glow-pulse 2s ease-in-out infinite',
    'tailwindui-data-flow': 'tailwindui-data-flow 3s ease-in-out infinite',
  },
  
  // Transition tokens
  transitions: {
    'tailwindui-all': 'all 0.15s ease-in-out',
    'tailwindui-colors': 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, color 0.15s ease-in-out',
    'tailwindui-shadow': 'box-shadow 0.15s ease-in-out',
    'tailwindui-transform': 'transform 0.15s ease-in-out',
  },
} as const

// TailwindUI component-specific design tokens
export const TAILWINDUI_COMPONENT_TOKENS = {
  // Button component tokens
  button: {
    sizes: {
      xs: {
        fontSize: 'tailwindui-xs',
        padding: '0.25rem 0.5rem',
        borderRadius: 'tailwindui-sm',
      },
      sm: {
        fontSize: 'tailwindui-sm',
        padding: '0.375rem 0.75rem',
        borderRadius: 'tailwindui-md',
      },
      md: {
        fontSize: 'tailwindui-base',
        padding: '0.5rem 1rem',
        borderRadius: 'tailwindui-md',
      },
      lg: {
        fontSize: 'tailwindui-lg',
        padding: '0.75rem 1.5rem',
        borderRadius: 'tailwindui-lg',
      },
      xl: {
        fontSize: 'tailwindui-xl',
        padding: '1rem 2rem',
        borderRadius: 'tailwindui-lg',
      },
    },
    variants: {
      primary: {
        backgroundColor: 'tailwindui-primary',
        color: 'tailwindui-text-inverse',
        border: 'none',
        shadow: 'tailwindui-glow',
        hover: {
          backgroundColor: 'tailwindui-primary-hover',
          shadow: 'tailwindui-glow-strong',
        },
      },
      secondary: {
        backgroundColor: 'tailwindui-secondary',
        color: 'tailwindui-text-inverse',
        border: 'none',
        hover: {
          backgroundColor: 'tailwindui-secondary-hover',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'tailwindui-primary',
        border: '1px solid tailwindui-border-focus',
        hover: {
          backgroundColor: 'tailwindui-primary',
          color: 'tailwindui-text-inverse',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'tailwindui-text-primary',
        border: 'none',
        hover: {
          backgroundColor: 'tailwindui-bg-tertiary',
        },
      },
    },
  },
  
  // Card component tokens
  card: {
    backgroundColor: 'tailwindui-bg-primary',
    border: '1px solid tailwindui-border',
    borderRadius: 'tailwindui-lg',
    padding: 'tailwindui-lg',
    shadow: 'tailwindui-md',
    hover: {
      shadow: 'tailwindui-glow',
      border: '1px solid tailwindui-border-hover',
    },
  },
  
  // Modal/Dialog component tokens
  modal: {
    overlay: {
      backgroundColor: 'rgb(3 7 18 / 0.8)', // terminal-bg with opacity
      backdropBlur: '4px',
    },
    content: {
      backgroundColor: 'tailwindui-bg-primary',
      border: '1px solid tailwindui-border',
      borderRadius: 'tailwindui-xl',
      shadow: 'tailwindui-glow',
      maxWidth: '32rem',
    },
  },
  
  // Input component tokens
  input: {
    backgroundColor: 'tailwindui-bg-secondary',
    border: '1px solid tailwindui-border',
    borderRadius: 'tailwindui-md',
    color: 'tailwindui-text-primary',
    fontSize: 'tailwindui-base',
    padding: '0.5rem 0.75rem',
    focus: {
      border: '1px solid tailwindui-border-focus',
      boxShadow: 'tailwindui-focus',
      outline: 'none',
    },
    placeholder: {
      color: 'tailwindui-text-muted',
    },
  },
  
  // Table component tokens
  table: {
    container: {
      backgroundColor: 'tailwindui-bg-primary',
      border: '1px solid tailwindui-border',
      borderRadius: 'tailwindui-lg',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: 'tailwindui-bg-tertiary',
      color: 'tailwindui-secondary',
      fontSize: 'tailwindui-xs',
      fontWeight: 'tailwindui-semibold',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    row: {
      borderBottom: '1px solid tailwindui-border',
      hover: {
        backgroundColor: 'tailwindui-bg-secondary',
      },
      even: {
        backgroundColor: 'rgb(30 41 59 / 0.1)', // subtle zebra striping
      },
    },
    cell: {
      padding: '0.75rem 1rem',
      fontSize: 'tailwindui-sm',
      color: 'tailwindui-text-primary',
    },
  },
  
  // Navigation component tokens
  navigation: {
    backgroundColor: 'tailwindui-bg-primary',
    border: '1px solid tailwindui-border',
    item: {
      color: 'tailwindui-text-secondary',
      fontSize: 'tailwindui-sm',
      padding: '0.5rem 0.75rem',
      borderRadius: 'tailwindui-md',
      hover: {
        backgroundColor: 'tailwindui-bg-tertiary',
        color: 'tailwindui-text-primary',
      },
      active: {
        backgroundColor: 'tailwindui-primary',
        color: 'tailwindui-text-inverse',
        fontWeight: 'tailwindui-semibold',
      },
    },
  },
} as const

// Keyframe definitions for terminal-specific animations
export const TAILWINDUI_KEYFRAMES = {
  'tailwindui-fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  'tailwindui-slide-up': {
    '0%': { transform: 'translateY(100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  'tailwindui-slide-down': {
    '0%': { transform: 'translateY(-100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  'tailwindui-scale-in': {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  'tailwindui-glow-pulse': {
    '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 10px currentColor)' },
    '50%': { filter: 'brightness(1.2) drop-shadow(0 0 20px currentColor)' },
  },
  'tailwindui-data-flow': {
    '0%': { transform: 'translateX(-100%)', opacity: '0' },
    '50%': { opacity: '1' },
    '100%': { transform: 'translateX(100%)', opacity: '0' },
  },
} as const

/**
 * Generate Tailwind CSS configuration extension for TailwindUI integration
 */
export function createTailwindUIConfig(): Partial<Config['theme']> {
  return {
    extend: {
      colors: TERMINAL_DESIGN_TOKENS.colors,
      fontFamily: TERMINAL_DESIGN_TOKENS.typography.fontFamily,
      fontSize: TERMINAL_DESIGN_TOKENS.typography.fontSize,
      fontWeight: TERMINAL_DESIGN_TOKENS.typography.fontWeight,
      spacing: TERMINAL_DESIGN_TOKENS.spacing,
      boxShadow: TERMINAL_DESIGN_TOKENS.shadows,
      borderRadius: TERMINAL_DESIGN_TOKENS.borderRadius,
      animation: TERMINAL_DESIGN_TOKENS.animations,
      transitionProperty: TERMINAL_DESIGN_TOKENS.transitions,
      keyframes: TAILWINDUI_KEYFRAMES,
    },
  }
}

/**
 * Get component-specific design tokens
 */
export function getComponentTokens(component: keyof typeof TAILWINDUI_COMPONENT_TOKENS) {
  return TAILWINDUI_COMPONENT_TOKENS[component]
}

/**
 * Generate CSS custom properties for TailwindUI components
 */
export function generateCSSCustomProperties(): Record<string, string> {
  const properties: Record<string, string> = {}
  
  // Generate color custom properties
  Object.entries(TERMINAL_DESIGN_TOKENS.colors).forEach(([key, value]) => {
    properties[`--tailwindui-${key}`] = value
  })
  
  // Generate spacing custom properties
  Object.entries(TERMINAL_DESIGN_TOKENS.spacing).forEach(([key, value]) => {
    properties[`--tailwindui-${key}`] = value
  })
  
  return properties
}

/**
 * Utility class generator for TailwindUI component variants
 */
export function generateUtilityClasses() {
  return {
    // Button utility classes
    '.btn-terminal-primary': {
      ...TAILWINDUI_COMPONENT_TOKENS.button.variants.primary,
      ...TAILWINDUI_COMPONENT_TOKENS.button.sizes.md,
      transition: TERMINAL_DESIGN_TOKENS.transitions['tailwindui-all'],
      '&:hover': TAILWINDUI_COMPONENT_TOKENS.button.variants.primary.hover,
    },
    
    '.btn-terminal-secondary': {
      ...TAILWINDUI_COMPONENT_TOKENS.button.variants.secondary,
      ...TAILWINDUI_COMPONENT_TOKENS.button.sizes.md,
      transition: TERMINAL_DESIGN_TOKENS.transitions['tailwindui-all'],
      '&:hover': TAILWINDUI_COMPONENT_TOKENS.button.variants.secondary.hover,
    },
    
    '.btn-terminal-outline': {
      ...TAILWINDUI_COMPONENT_TOKENS.button.variants.outline,
      ...TAILWINDUI_COMPONENT_TOKENS.button.sizes.md,
      transition: TERMINAL_DESIGN_TOKENS.transitions['tailwindui-all'],
      '&:hover': TAILWINDUI_COMPONENT_TOKENS.button.variants.outline.hover,
    },
    
    // Card utility classes
    '.card-terminal': {
      ...TAILWINDUI_COMPONENT_TOKENS.card,
      transition: TERMINAL_DESIGN_TOKENS.transitions['tailwindui-shadow'],
      '&:hover': TAILWINDUI_COMPONENT_TOKENS.card.hover,
    },
    
    // Input utility classes
    '.input-terminal': {
      ...TAILWINDUI_COMPONENT_TOKENS.input,
      transition: TERMINAL_DESIGN_TOKENS.transitions['tailwindui-colors'],
      '&:focus': TAILWINDUI_COMPONENT_TOKENS.input.focus,
      '&::placeholder': TAILWINDUI_COMPONENT_TOKENS.input.placeholder,
    },
  }
}

// Export all tokens for easy access
export default {
  TERMINAL_DESIGN_TOKENS,
  TAILWINDUI_COMPONENT_TOKENS,
  TAILWINDUI_KEYFRAMES,
  createTailwindUIConfig,
  getComponentTokens,
  generateCSSCustomProperties,
  generateUtilityClasses,
}