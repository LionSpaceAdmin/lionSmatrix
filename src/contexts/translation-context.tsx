'use client';

import { createContext, useContext } from 'react'
// import { useTranslation as useNextIntlTranslation } from '@lionspace/i18n'

const TranslationContext = createContext<{
  t: (key: string) => string
} | null>(null)

export function useTranslation() {
  const context = useContext(TranslationContext)
  
  if (context) {
    return context
  }
  
  // Fallback implementation
  return {
    t: (key: string) => key
  }
}

export { TranslationContext }
