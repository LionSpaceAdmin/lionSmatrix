// i18n Configuration
export const locales = ['en', 'he', 'es', 'fr', 'de', 'ar'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const rtlLocales: Locale[] = ['he', 'ar']

export const localeNames: Record<Locale, string> = {
  en: 'English',
  he: 'עברית',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية'
}

export const localeConfig = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr' as const,
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  },
  he: {
    name: 'עברית',
    flag: '🇮🇱',
    direction: 'rtl' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'ILS'
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    direction: 'ltr' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR'
  },
  fr: {
    name: 'Français',
    flag: '🇫🇷',
    direction: 'ltr' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR'
  },
  de: {
    name: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr' as const,
    dateFormat: 'DD.MM.YYYY',
    currency: 'EUR'
  },
  ar: {
    name: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'SAR'
  }
} as const
