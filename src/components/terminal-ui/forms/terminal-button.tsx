'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { TerminalButtonProps } from '../types'

/**
 * Terminal Button Component
 * Based on TailwindUI button patterns with terminal theme adaptations
 */

const terminalButtonVariants = {
  solid: {
    cyan: 'bg-terminal-cyan text-terminal-bg hover:bg-terminal-cyan/90 shadow-glow-cyan',
    gold: 'bg-terminal-gold text-terminal-bg hover:bg-terminal-gold/90 shadow-glow-gold',
    green: 'bg-terminal-green text-terminal-bg hover:bg-terminal-green/90 shadow-glow-green',
    red: 'bg-terminal-red text-terminal-bg hover:bg-terminal-red/90 shadow-glow-red',
    white: 'bg-terminal-text text-terminal-bg hover:bg-terminal-text/90',
    muted: 'bg-terminal-muted text-terminal-bg hover:bg-terminal-muted/90'
  },
  outline: {
    cyan: 'border-2 border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/10',
    gold: 'border-2 border-terminal-gold text-terminal-gold hover:bg-terminal-gold/10',
    green: 'border-2 border-terminal-green text-terminal-green hover:bg-terminal-green/10',
    red: 'border-2 border-terminal-red text-terminal-red hover:bg-terminal-red/10',
    white: 'border-2 border-terminal-text text-terminal-text hover:bg-terminal-text/10',
    muted: 'border-2 border-terminal-muted text-terminal-muted hover:bg-terminal-muted/10'
  },
  ghost: {
    cyan: 'text-terminal-cyan hover:bg-terminal-cyan/10',
    gold: 'text-terminal-gold hover:bg-terminal-gold/10',
    green: 'text-terminal-green hover:bg-terminal-green/10',
    red: 'text-terminal-red hover:bg-terminal-red/10',
    white: 'text-terminal-text hover:bg-terminal-text/10',
    muted: 'text-terminal-muted hover:bg-terminal-muted/10'
  },
  glow: {
    cyan: 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan hover:bg-terminal-cyan/30 shadow-glow-cyan animate-pulse-glow',
    gold: 'bg-terminal-gold/20 text-terminal-gold border border-terminal-gold hover:bg-terminal-gold/30 shadow-glow-gold animate-pulse-glow',
    green: 'bg-terminal-green/20 text-terminal-green border border-terminal-green hover:bg-terminal-green/30 shadow-glow-green animate-pulse-glow',
    red: 'bg-terminal-red/20 text-terminal-red border border-terminal-red hover:bg-terminal-red/30 shadow-glow-red animate-pulse-glow',
    white: 'bg-terminal-text/20 text-terminal-text border border-terminal-text hover:bg-terminal-text/30',
    muted: 'bg-terminal-muted/20 text-terminal-muted border border-terminal-muted hover:bg-terminal-muted/30'
  },
  pulse: {
    cyan: 'bg-terminal-cyan text-terminal-bg hover:bg-terminal-cyan/90 animate-pulse shadow-glow-cyan',
    gold: 'bg-terminal-gold text-terminal-bg hover:bg-terminal-gold/90 animate-pulse shadow-glow-gold',
    green: 'bg-terminal-green text-terminal-bg hover:bg-terminal-green/90 animate-pulse shadow-glow-green',
    red: 'bg-terminal-red text-terminal-bg hover:bg-terminal-red/90 animate-pulse shadow-glow-red',
    white: 'bg-terminal-text text-terminal-bg hover:bg-terminal-text/90 animate-pulse',
    muted: 'bg-terminal-muted text-terminal-bg hover:bg-terminal-muted/90 animate-pulse'
  }
}

const terminalButtonSizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
}

export const TerminalButton = forwardRef<HTMLButtonElement, TerminalButtonProps>(
  (
    {
      className,
      variant = 'solid',
      size = 'md',
      color = 'cyan',
      animate = false,
      glow = false,
      scanline = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = terminalButtonVariants[variant as keyof typeof terminalButtonVariants]
    const variantClasses = variantStyles[color as keyof typeof variantStyles]
    const sizeClasses = terminalButtonSizes[size as keyof typeof terminalButtonSizes]

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base classes from TailwindUI
          'relative inline-flex items-center justify-center font-terminal font-medium',
          'rounded-md transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terminal-cyan',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Terminal-specific classes
          variantClasses,
          sizeClasses,
          
          // Optional effects
          animate && 'animate-pulse',
          glow && 'shadow-glow-pulse',
          scanline && 'overflow-hidden after:absolute after:inset-0 after:bg-scanline after:animate-scan',
          
          // Loading state
          loading && 'cursor-wait',
          
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        
        {/* Button content */}
        <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </span>
        
        {/* Glow effect overlay */}
        {glow && (
          <span className="absolute inset-0 rounded-md animate-pulse-glow pointer-events-none" />
        )}
      </button>
    )
  }
)

TerminalButton.displayName = 'TerminalButton'