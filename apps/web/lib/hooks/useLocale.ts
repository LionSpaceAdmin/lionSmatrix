'use client'

import { useState, useEffect } from 'react'
import { Locale, defaultLocale, locales } from '@/lib/i18n/config'

/**
 * Custom hook to manage locale state
 * Reads from cookie and localStorage, with browser language fallback
 */
export function useLocale(): {
  locale: Locale
  setLocale: (locale: Locale) => void
  isLoading: boolean
} {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [isLoading, setIsLoading] = useState(true)

  // Get locale from various sources
  const getInitialLocale = (): Locale => {
    if (typeof window === 'undefined') {
      return defaultLocale
    }

    try {
      // 1. Check localStorage
      const storedLocale = localStorage.getItem('locale')
      if (storedLocale && locales.includes(storedLocale as Locale)) {
        return storedLocale as Locale
      }

      // 2. Check cookie
      const cookieLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('locale='))
        ?.split('=')[1]
      if (cookieLocale && locales.includes(cookieLocale as Locale)) {
        return cookieLocale as Locale
      }

      // 3. Check browser language
      const browserLang = navigator.language.split('-')[0].toLowerCase()
      if (locales.includes(browserLang as Locale)) {
        return browserLang as Locale
      }

      // 4. Check Accept-Language if available
      const languages = navigator.languages || [navigator.language]
      for (const lang of languages) {
        const shortLang = lang.split('-')[0].toLowerCase()
        if (locales.includes(shortLang as Locale)) {
          return shortLang as Locale
        }
      }

    } catch (error) {
      console.warn('Error reading locale preferences:', error)
    }

    return defaultLocale
  }

  // Initialize locale on mount
  useEffect(() => {
    const initialLocale = getInitialLocale()
    setLocaleState(initialLocale)
    setIsLoading(false)
  }, [])

  // Set locale with persistence
  const setLocale = (newLocale: Locale) => {
    if (!locales.includes(newLocale)) {
      console.warn(`Invalid locale: ${newLocale}`)
      return
    }

    setLocaleState(newLocale)

    try {
      // Save to localStorage
      localStorage.setItem('locale', newLocale)

      // Save to cookie (expires in 1 year)
      const expiryDate = new Date()
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      document.cookie = `locale=${newLocale}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('localeChange', { 
        detail: { locale: newLocale } 
      }))
    } catch (error) {
      console.warn('Error saving locale preference:', error)
    }
  }

  return {
    locale,
    setLocale,
    isLoading
  }
}