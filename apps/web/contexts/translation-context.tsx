'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface TranslationContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string, fallback?: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.academy': 'Academy',
    'nav.daily-brief': 'Daily Brief',
    'nav.archive': 'Archive',
    'nav.trust': 'Trust',
    'auth.signin': 'Sign In',
    'auth.signout': 'Sign Out',
  },
  he: {
    'nav.home': 'בית',
    'nav.about': 'אודות',
    'nav.academy': 'אקדמיה',
    'nav.daily-brief': 'תדריך יומי',
    'nav.archive': 'ארכיון',
    'nav.trust': 'אמון',
    'auth.signin': 'התחברות',
    'auth.signout': 'יציאה',
  }
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en')

  const t = (key: string, fallback?: string) => {
    const lang = translations[language as keyof typeof translations] || translations.en
    return lang[key as keyof typeof lang] || fallback || key
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}