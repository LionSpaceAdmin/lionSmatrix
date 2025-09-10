import { NextRequest } from 'next/server'
import { Locale, defaultLocale, locales, rtlLocales } from './config'

/**
 * Check if a locale is RTL
 */
export function isRTL(locale: Locale | string): boolean {
  return rtlLocales.includes(locale as Locale)
}

/**
 * Get the direction for a locale
 */
export function getDirection(locale: Locale | string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

/**
 * Parse Accept-Language header
 */
export function parseAcceptLanguage(acceptLanguage: string): Locale {
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [language, priority = '1'] = lang.trim().split(';q=')
      return {
        language: language.split('-')[0].toLowerCase(),
        priority: parseFloat(priority)
      }
    })
    .sort((a, b) => b.priority - a.priority)

  for (const { language } of languages) {
    if (locales.includes(language as Locale)) {
      return language as Locale
    }
  }

  return defaultLocale
}

/**
 * Get locale from request (cookie or Accept-Language header)
 */
export function getLocaleFromRequest(request: NextRequest): Locale {
  // Try to get locale from cookie
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  // Try to get locale from Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    return parseAcceptLanguage(acceptLanguage)
  }

  return defaultLocale
}

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Format number according to locale
 */
export function formatNumber(number: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(number)
}

/**
 * Format currency according to locale
 */
export function formatCurrency(amount: number, locale: Locale, currency?: string): string {
  const localeCurrency = {
    en: 'USD',
    he: 'ILS',
    es: 'EUR',
    fr: 'EUR',
    de: 'EUR',
    ar: 'SAR'
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || localeCurrency[locale]
  }).format(amount)
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date, locale: Locale): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const now = new Date()
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000)
  
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1]
  ]
  
  for (const [unit, secondsInUnit] of units) {
    const diff = Math.floor(Math.abs(diffInSeconds) / secondsInUnit)
    if (diff >= 1) {
      return rtf.format(diffInSeconds < 0 ? -diff : diff, unit)
    }
  }
  
  return rtf.format(0, 'second')
}
