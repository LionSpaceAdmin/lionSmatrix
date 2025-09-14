import { useLocale } from '../hooks/useLocale'
import { getTranslation } from './translations'

export function useTranslation() {
  const { locale } = useLocale()
  
  const t = (key: string, params?: Record<string, any>) => {
    return getTranslation(key, locale, params)
  }
  
  return { t, locale }
}
