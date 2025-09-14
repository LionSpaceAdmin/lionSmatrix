// Mock Radix UI components - replace with actual @radix-ui packages when installed
import * as React from 'react'

// Mock Slot component
export const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...children.props,
      ref: ref as any,
    })
  }
  
  return React.createElement('div', { ref, ...props }, children)
})

Slot.displayName = 'Slot'

// Export under radix-ui namespace for easy replacement
export const RadixUI = {
  Slot
}