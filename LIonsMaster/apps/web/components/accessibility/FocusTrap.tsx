'use client'

import * as React from 'react'

interface FocusTrapProps {
  children: React.ReactNode
  active?: boolean
  returnFocus?: boolean
}

export function FocusTrap({ 
  children, 
  active = true,
  returnFocus = true 
}: FocusTrapProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!active) return

    // Store the currently focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement

    const root = rootRef.current
    if (!root) return

    // Get all focusable elements
    const getFocusableElements = () => {
      const selector = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',')
      
      return Array.from(root.querySelectorAll(selector)) as HTMLElement[]
    }

    // Focus the first focusable element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Handle Tab key navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // Trap focus within the container
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      
      // Return focus to previously focused element
      if (returnFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus()
      }
    }
  }, [active, returnFocus])

  return (
    <div ref={rootRef} data-focus-trap={active}>
      {children}
    </div>
  )
}