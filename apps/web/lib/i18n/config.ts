// i18n Configuration
export const locales = ['en', 'he', 'ar', 'fr', 'de', 'ru', 'es', 'pt', 'it', 'zh', 'ja', 'hi', 'fa'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const rtlLocales: Locale[] = ['he', 'ar', 'fa']

export const localeNames: Record<Locale, string> = {
  en: 'English',
  he: 'עברית',
  ar: 'العربية',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  zh: '中文',
  ja: '日本語',
  hi: 'हिन्दी',
  fa: 'فارسی'
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
  ar: {
    name: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'SAR'
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
  ru: {
    name: 'Русский',
    flag: '🇷🇺',
    direction: 'ltr' as const,
    dateFormat: 'DD.MM.YYYY',
    currency: 'RUB'
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    direction: 'ltr' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR'
  },
  pt: {
    name: 'Português',
    flag: '🇵🇹',
    direction: 'ltr' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR'
  },
  it: {
    name: 'Italiano',
    flag: '🇮🇹',
    direction: 'ltr' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR'
  },
  zh: {
    name: '中文',
    flag: '🇨🇳',
    direction: 'ltr' as const,
    dateFormat: 'YYYY/MM/DD',
    currency: 'CNY'
  },
  ja: {
    name: '日本語',
    flag: '🇯🇵',
    direction: 'ltr' as const,
    dateFormat: 'YYYY/MM/DD',
    currency: 'JPY'
  },
  hi: {
    name: 'हिन्दी',
    flag: '🇮🇳',
    direction: 'ltr' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR'
  },
  fa: {
    name: 'فارسی',
    flag: '🇮🇷',
    direction: 'rtl' as const,
    dateFormat: 'DD/MM/YYYY',
    currency: 'IRR'
  }
} as const
