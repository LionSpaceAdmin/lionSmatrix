'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TerminalInputProps } from '../types'

/**
 * Terminal Input Component
 * Based on TailwindUI form patterns with terminal theme adaptations
 */

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  (
    {
      className,
      variant = 'outline',
      size = 'md',
      color = 'cyan',
      animate = false,
      glow = false,
      scanline = false,
      label,
      error,
      helper,
      icon,
      showCursor = true,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)
    const [cursorVisible, setCursorVisible] = useState(true)

    // Terminal cursor blink effect
    useEffect(() => {
      if (showCursor && focused) {
        const interval = setInterval(() => {
          setCursorVisible(v => !v)
        }, 500)
        return () => clearInterval(interval)
      }
    }, [showCursor, focused])

    const inputSizes: Record<string, string> = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
      xl: 'px-6 py-4 text-xl'
    }

    const inputVariants: Record<string, string> = {
      solid: `bg-terminal-secondary border-2 border-terminal-line`,
      outline: `bg-transparent border-2`,
      ghost: `bg-transparent border-b-2 border-l-0 border-r-0 border-t-0 rounded-none`,
      glow: `bg-terminal-secondary/50 border-2 shadow-glow-${color}`,
      pulse: `bg-terminal-secondary border-2 animate-pulse`
    }

    const colorClasses: Record<string, string> = {
      cyan: `border-terminal-cyan/30 focus:border-terminal-cyan text-terminal-cyan placeholder-terminal-cyan/50`,
      gold: `border-terminal-gold/30 focus:border-terminal-gold text-terminal-gold placeholder-terminal-gold/50`,
      green: `border-terminal-green/30 focus:border-terminal-green text-terminal-green placeholder-terminal-green/50`,
      red: `border-terminal-red/30 focus:border-terminal-red text-terminal-red placeholder-terminal-red/50`,
      white: `border-terminal-text/30 focus:border-terminal-text text-terminal-text placeholder-terminal-text/50`,
      muted: `border-terminal-muted/30 focus:border-terminal-muted text-terminal-muted placeholder-terminal-muted/50`
    }

    return (
      <div className="space-y-1">
        {label && (
          <label className={cn(
            'block text-sm font-medium font-terminal uppercase tracking-wider',
            error ? 'text-terminal-red' : `text-terminal-${color}`
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`text-terminal-${color}`}>{icon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              // Base TailwindUI form input classes
              'block w-full font-terminal rounded-md transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-terminal-bg',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              
              // Size classes
              inputSizes[size],
              
              // Variant classes
              inputVariants[variant],
              
              // Color classes
              error ? 'border-terminal-red focus:border-terminal-red focus:ring-terminal-red' : colorClasses[color],
              
              // Icon padding
              icon && 'pl-10',
              
              // Optional effects
              animate && 'animate-pulse',
              glow && 'shadow-glow-pulse',
              scanline && 'overflow-hidden',
              
              className
            )}
            {...props}
          />
          
          {/* Terminal cursor */}
          {showCursor && focused && (
            <span
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-2 h-5 bg-terminal-cyan',
                cursorVisible ? 'opacity-100' : 'opacity-0',
                'transition-opacity duration-100 pointer-events-none'
              )}
              style={{ left: 'calc(100% - 2rem)' }}
            />
          )}
          
          {/* Scanline effect */}
          {scanline && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-scanline animate-scan" />
            </div>
          )}
        </div>
        
        {/* Helper or error text */}
        {(error || helper) && (
          <p className={cn(
            'text-sm font-terminal',
            error ? 'text-terminal-red' : 'text-terminal-muted'
          )}>
            {error || helper}
          </p>
        )}
      </div>
    )
  }
)

TerminalInput.displayName = 'TerminalInput'