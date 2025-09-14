// Main i18n exports
export * from './config'
export * from './helpers'
export * from './translations'

import { Locale, defaultLocale } from './config'
import { t as translate } from './translations'

// Re-export commonly used functions
export { translate as t }

// Create a hook-like function for components
export function useTranslation(locale: Locale = defaultLocale) {
  return {
    t: (key: string, params?: Record<string, any>) => translate(key, locale, params),
    locale,
    isRTL: locale === 'he' || locale === 'ar'
  }
}
