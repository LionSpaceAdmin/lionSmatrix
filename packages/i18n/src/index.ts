'use client';

import { getRequestConfig } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

export type Locale = 'en' | 'he' | 'ar'

export const locales: Locale[] = ['en', 'he', 'ar']
export const defaultLocale: Locale = 'en'

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'he' || locale === 'ar' ? 'rtl' : 'ltr'
}

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales })

// Hook for translations
export function useTranslation() {
  const t = useTranslations()
  return { t }
}

// Hook for RTL detection
export function useRTL() {
  const locale = useLocale() as Locale
  return getDirection(locale) === 'rtl'
}

// Hook for language switcher
export function useLanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  
  const switchLanguage = (newLocale: Locale) => {
    router.replace('/', { locale: newLocale })
  }

  return {
    currentLocale: locale,
    switchLanguage,
    locales,
    getDirection
  }
}

// Server-side configuration
export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./locales/${locale}.json`)).default
}))

// Re-export for convenience
export { useTranslations, useLocale } from 'next-intl'