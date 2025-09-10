'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ScreenReaderOnly } from './ScreenReaderOnly'

export interface AccessibleButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaPressed?: boolean
  ariaExpanded?: boolean
  ariaControls?: string
  loadingText?: string
}

export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(({
  className,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  ariaExpanded,
  ariaControls,
  loadingText = 'Loading...',
  onClick,
  ...props
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      e.preventDefault()
      return
    }
    onClick?.(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Ensure Enter and Space both trigger click
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.key === ' ') {
        e.preventDefault() // Prevent page scroll on space
      }
      handleClick(e as any)
    }
  }

  const baseClasses = cn(
    // Base styles
    'inline-flex items-center justify-center rounded-md font-medium',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Size variants
    {
      'px-3 py-1.5 text-sm': size === 'small',
      'px-4 py-2 text-base': size === 'medium',
      'px-6 py-3 text-lg': size === 'large',
    },
    
    // Color variants
    {
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500':
        variant === 'primary',
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500':
        variant === 'secondary',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500':
        variant === 'danger',
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500':
        variant === 'ghost',
    },
    
    // Full width
    {
      'w-full': fullWidth,
    },
    
    className
  )

  return (
    <button
      ref={ref}
      className={baseClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-busy={loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {loading && (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
          <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
        </>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2" aria-hidden="true">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2" aria-hidden="true">{icon}</span>
      )}
    </button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'