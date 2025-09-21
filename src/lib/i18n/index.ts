import { defaultLocale, locales, rtlLocales } from './config';
import { NextRequest } from 'next/server';

export function isRTL(locale: string): boolean {
  return rtlLocales.includes(locale);
}

export function getLocaleFromRequest(request: NextRequest): string {
  // Check for locale cookie first
  const localeCookie = request.cookies.get('locale')?.value;
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie;
  }

  // Fallback to Accept-Language header
  const acceptLanguageHeader = request.headers.get('Accept-Language');
  if (acceptLanguageHeader) {
    const acceptedLocales = acceptLanguageHeader.split(',').map(lang => lang.split(';')[0].trim());
    for (const acceptedLocale of acceptedLocales) {
      if (locales.includes(acceptedLocale)) {
        return acceptedLocale;
      }
    }
  }

  return defaultLocale;
}

// Stub for translation function
export function t(key: string, locale: string): string {
  // This is a stub. In a real implementation, it would load translations from JSON files.
  console.warn(`[i18n] Missing translation for key: ${key} in locale: ${locale}`);
  return key; // Return the key itself as a fallback
}
