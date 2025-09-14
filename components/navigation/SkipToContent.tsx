'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export default function SkipToContent() {
  return (
    <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-0 focus-within:left-0 focus-within:z-50">
      <a
        href="#main-content"
        className={cn(
          'inline-block bg-primary-600 text-white px-4 py-2 m-2 rounded',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        )}
      >
        Skip to main content
      </a>
      <a
        href="#main-navigation"
        className={cn(
          'inline-block bg-primary-600 text-white px-4 py-2 m-2 rounded',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        )}
      >
        Skip to navigation
      </a>
      <a
        href="#footer"
        className={cn(
          'inline-block bg-primary-600 text-white px-4 py-2 m-2 rounded',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        )}
      >
        Skip to footer
      </a>
    </div>
  )
}