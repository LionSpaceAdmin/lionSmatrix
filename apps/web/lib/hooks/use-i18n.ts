import { useState, useCallback, useEffect } from 'react';
import { translations, languages } from '@/lib/data/translations';

/**
 * Hook for internationalization (i18n) support
 * @param defaultLang - Default language code (default: 'en')
 */
export function useI18n(defaultLang: string = 'en') {
  const [currentLang, setCurrentLang] = useState(defaultLang);

  const setLanguage = useCallback((lang: string) => {
    if (!translations[lang]) lang = 'en';
    setCurrentLang(lang);

    // Update document attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'he' || lang === 'ar') ? 'rtl' : 'ltr';

    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', lang);
    }

    // Update all elements with data-i18n-key
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
      const key = el.getAttribute('data-i18n-key');
      if (!key) return;

      const translation = translations[lang]?.[key] || translations['en']?.[key];
      if (translation) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          (el as HTMLInputElement).placeholder = translation;
        } else {
          // Preserve icons if they exist
          const icon = el.firstChild && (el.firstChild.nodeType === 1) 
            ? el.firstChild.cloneNode(true) as Node 
            : null;
          el.textContent = translation;
          if (icon) {
            el.prepend(icon, " ");
          }
        }
      }
    });

    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }, []);

  const t = useCallback((key: string): string => {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
  }, [currentLang]);

  // Get translation with interpolation support
  const tWithParams = useCallback((key: string, params: Record<string, string | number>): string => {
    let translation = t(key);
    Object.entries(params).forEach(([paramKey, value]) => {
      translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
    });
    return translation;
  }, [t]);

  // Get all available translations for a key
  const getAllTranslations = useCallback((key: string): Record<string, string> => {
    const result: Record<string, string> = {};
    Object.keys(translations).forEach(lang => {
      result[lang] = translations[lang]?.[key] || key;
    });
    return result;
  }, []);

  // Check if a translation exists for the current language
  const hasTranslation = useCallback((key: string): boolean => {
    return !!translations[currentLang]?.[key];
  }, [currentLang]);

  // Initialize language from localStorage or browser settings
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Try to get saved preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
      return;
    }

    // Try to detect browser language
    const browserLang = navigator.language?.split('-')?.[0];
    if (browserLang && translations[browserLang]) {
      setLanguage(browserLang);
    }
  }, [setLanguage]);

  return { 
    currentLang, 
    setLanguage, 
    t, 
    tWithParams,
    getAllTranslations,
    hasTranslation,
    languages, 
    translations,
    isRTL: currentLang === 'he' || currentLang === 'ar'
  };
}

/**
 * Hook for managing language-specific content visibility
 */
export function useLanguageVisibility(supportedLangs: string[]) {
  const { currentLang } = useI18n();
  
  const isSupported = supportedLangs.includes(currentLang);
  const fallbackLang = isSupported ? currentLang : supportedLangs[0] || 'en';
  
  return { isSupported, fallbackLang };
}

/**
 * Hook for language-specific formatting
 */
export function useI18nFormatting(lang?: string) {
  const { currentLang } = useI18n();
  const activeLang = lang || currentLang;
  
  const formatNumber = useCallback((num: number): string => {
    return new Intl.NumberFormat(activeLang === 'ar' ? 'ar-EG' : activeLang).format(num);
  }, [activeLang]);
  
  const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(activeLang === 'ar' ? 'ar-EG' : activeLang, options).format(dateObj);
  }, [activeLang]);
  
  const formatCurrency = useCallback((amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat(activeLang === 'ar' ? 'ar-EG' : activeLang, {
      style: 'currency',
      currency
    }).format(amount);
  }, [activeLang]);
  
  const formatPercent = useCallback((value: number): string => {
    return new Intl.NumberFormat(activeLang === 'ar' ? 'ar-EG' : activeLang, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }, [activeLang]);
  
  return { formatNumber, formatDate, formatCurrency, formatPercent };
}

/**
 * Hook for managing multilingual typewriter animations
 */
export function useI18nTypewriter(lineKeys: string[]) {
  const { currentLang, t } = useI18n();
  
  const getLines = useCallback(() => {
    return lineKeys.map(key => t(key));
  }, [lineKeys, t]);
  
  return { getLines, currentLang };
}

/**
 * Hook for language switcher component
 */
export function useLanguageSwitcher() {
  const { currentLang, setLanguage, languages } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const selectLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    setIsOpen(false);
  }, [setLanguage]);
  
  const getCurrentLanguageInfo = useCallback(() => {
    return languages[currentLang] || languages['en'];
  }, [currentLang, languages]);
  
  return {
    currentLang,
    isOpen,
    toggleDropdown,
    selectLanguage,
    getCurrentLanguageInfo,
    availableLanguages: Object.entries(languages).map(([code, info]) => ({
      code,
      ...info
    }))
  };
}