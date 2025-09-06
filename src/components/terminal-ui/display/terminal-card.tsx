'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { TerminalCardProps } from '../types'

/**
 * Terminal Card Component
 * Based on TailwindUI card patterns with terminal theme adaptations
 */

export function TerminalCard({
  className,
  variant = 'outline',
  size = 'md',
  color = 'cyan',
  animate = false,
  glow = false,
  scanline = false,
  title,
  subtitle,
  header,
  footer,
  bordered = true,
  elevated = false,
  children,
  ...props
}: TerminalCardProps) {
  const cardVariants: Record<string, string> = {
    solid: 'bg-terminal-secondary',
    outline: 'bg-terminal-bg/50 backdrop-blur-sm',
    ghost: 'bg-transparent',
    glow: `bg-terminal-secondary/50 shadow-glow-${color}`,
    pulse: 'bg-terminal-secondary animate-pulse'
  }

  const cardSizes: Record<string, string> = {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }

  const borderColors: Record<string, string> = {
    cyan: 'border-terminal-cyan/30',
    gold: 'border-terminal-gold/30',
    green: 'border-terminal-green/30',
    red: 'border-terminal-red/30',
    white: 'border-terminal-text/30',
    muted: 'border-terminal-muted/30'
  }

  return (
    <div
      className={cn(
        // Base TailwindUI card classes
        'relative rounded-lg transition-all duration-200',
        
        // Variant classes
        cardVariants[variant],
        
        // Size classes
        cardSizes[size],
        
        // Border classes
        bordered && `border-2 ${borderColors[color]}`,
        
        // Elevation
        elevated && 'shadow-2xl',
        
        // Optional effects
        animate && 'animate-pulse',
        glow && 'shadow-glow-pulse hover:shadow-glow-strong',
        
        className
      )}
      {...props}
    >
      {/* Scanline effect overlay */}
      {scanline && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-scanline animate-scan opacity-20" />
        </div>
      )}
      
      {/* Card header */}
      {(header || title || subtitle) && (
        <div className="mb-4 pb-4 border-b border-terminal-line">
          {header || (
            <>
              {title && (
                <h3 className={cn(
                  'text-lg font-bold font-terminal uppercase tracking-wider',
                  `text-terminal-${color}`
                )}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-terminal-muted">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Card content */}
      <div className="relative">
        {children}
      </div>
      
      {/* Card footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-terminal-line">
          {footer}
        </div>
      )}
      
      {/* Corner accents for terminal aesthetic */}
      {variant === 'glow' && (
        <>
          <div className={cn(
            'absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg',
            `border-terminal-${color}`
          )} />
          <div className={cn(
            'absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg',
            `border-terminal-${color}`
          )} />
          <div className={cn(
            'absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg',
            `border-terminal-${color}`
          )} />
          <div className={cn(
            'absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-lg',
            `border-terminal-${color}`
          )} />
        </>
      )}
    </div>
  )
}