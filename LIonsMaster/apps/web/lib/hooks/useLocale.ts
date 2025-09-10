'use client'

import { useEffect, useState } from 'react'

export type SupportedLocale = 'en' | 'he' | 'ar' | 'fr' | 'de' | 'ru' | 'es' | 'pt' | 'it' | 'zh' | 'ja' | 'hi' | 'fa'

const RTL_LOCALES: SupportedLocale[] = ['he', 'ar', 'fa']

const SUPPORTED_LOCALES: SupportedLocale[] = [
  'en', 'he', 'ar', 'fr', 'de', 'ru', 'es', 'pt', 'it', 'zh', 'ja', 'hi', 'fa'
]

interface LocaleInfo {
  locale: SupportedLocale
  isRTL: boolean
  dir: 'rtl' | 'ltr'
}

export function useLocale(defaultLocale: SupportedLocale = 'en'): LocaleInfo {
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale)

  useEffect(() => {
    const detectLocale = (): SupportedLocale => {
      // 1. Check URL params
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const langParam = urlParams.get('lang')
        if (langParam && SUPPORTED_LOCALES.includes(langParam as SupportedLocale)) {
          return langParam as SupportedLocale
        }
      }

      // 2. Check localStorage
      if (typeof window !== 'undefined') {
        const storedLocale = localStorage.getItem('locale')
        if (storedLocale && SUPPORTED_LOCALES.includes(storedLocale as SupportedLocale)) {
          return storedLocale as SupportedLocale
        }
      }

      // 3. Check cookie
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';')
        const langCookie = cookies.find(c => c.trim().startsWith('locale='))
        if (langCookie) {
          const cookieLocale = langCookie.split('=')[1]
          if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as SupportedLocale)) {
            return cookieLocale as SupportedLocale
          }
        }
      }

      // 4. Check navigator language
      if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language.split('-')[0]
        if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
          return browserLang as SupportedLocale
        }
      }

      return defaultLocale
    }

    const detectedLocale = detectLocale()
    setLocale(detectedLocale)

    // Apply dir attribute to html element
    if (typeof document !== 'undefined') {
      document.documentElement.dir = RTL_LOCALES.includes(detectedLocale) ? 'rtl' : 'ltr'
      document.documentElement.lang = detectedLocale
    }
  }, [defaultLocale])

  const isRTL = RTL_LOCALES.includes(locale)
  const dir = isRTL ? 'rtl' : 'ltr'

  return { locale, isRTL, dir }
}

// Utility to persist locale preference
export function setLocalePreference(locale: SupportedLocale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale)
    document.cookie = `locale=${locale}; path=/; max-age=31536000` // 1 year
    
    // Update HTML attributes
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
    
    // Trigger a custom event for components to react
    window.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }))
  }
}

// Hook to listen for locale changes
export function useLocaleChange(callback: (locale: SupportedLocale) => void) {
  useEffect(() => {
    const handleLocaleChange = (event: CustomEvent) => {
      callback(event.detail.locale)
    }

    window.addEventListener('localechange', handleLocaleChange as EventListener)
    return () => {
      window.removeEventListener('localechange', handleLocaleChange as EventListener)
    }
  }, [callback])
}