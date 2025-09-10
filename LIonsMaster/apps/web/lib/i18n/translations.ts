import { Locale } from './config'

// Translation key paths
export type TranslationKeys = {
  common: {
    appName: string
    tagline: string
    loading: string
    error: string
    retry: string
    cancel: string
    save: string
    delete: string
    edit: string
    close: string
    search: string
    filter: string
    sortBy: string
  }
  nav: {
    home: string
    dailyBrief: string
    archive: string
    warMachine: string
    about: string
    contact: string
    signIn: string
    signOut: string
    join: string
    dashboard: string
  }
  hero: {
    title: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
  }
  threats: {
    low: string
    medium: string
    high: string
    critical: string
  }
  actions: {
    factCheck: string
    reportFake: string
    viewDetails: string
    share: string
    verify: string
  }
  auth: {
    signInTitle: string
    joinTitle: string
    email: string
    password: string
    confirmPassword: string
    forgotPassword: string
    rememberMe: string
    or: string
    continueWith: string
  }
  footer: {
    copyright: string
    privacy: string
    terms: string
    transparency: string
  }
}

// Mock translation function (to be replaced with actual implementation)
export function t(key: string, locale: Locale = 'en', params?: Record<string, any>): string {
  // This is a simplified mock - in production, load from JSON files
  const translations: Record<Locale, Partial<TranslationKeys>> = {
    en: {
      common: {
        appName: 'Lions of Zion',
        tagline: 'Truth Defenders Against Disinformation',
        loading: 'Loading...',
        error: 'Something went wrong',
        retry: 'Try Again',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        search: 'Search',
        filter: 'Filter',
        sortBy: 'Sort by'
      },
      nav: {
        home: 'Home',
        dailyBrief: 'Daily Brief',
        archive: 'Archive',
        warMachine: 'War Machine',
        about: 'About',
        contact: 'Contact',
        signIn: 'Sign In',
        signOut: 'Sign Out',
        join: 'Join',
        dashboard: 'Dashboard'
      },
      hero: {
        title: 'Fight Disinformation',
        subtitle: 'Join thousands defending truth in the information age',
        ctaPrimary: 'Join the Fight - Free',
        ctaSecondary: 'Explore the War Machine'
      }
    },
    he: {
      common: {
        appName: 'אריות ציון',
        tagline: 'מגיני האמת נגד דיסאינפורמציה',
        loading: 'טוען...',
        error: 'משהו השתבש',
        retry: 'נסה שוב',
        cancel: 'ביטול',
        save: 'שמור',
        delete: 'מחק',
        edit: 'ערוך',
        close: 'סגור',
        search: 'חיפוש',
        filter: 'סינון',
        sortBy: 'מיין לפי'
      },
      nav: {
        home: 'בית',
        dailyBrief: 'תקציר יומי',
        archive: 'ארכיון',
        warMachine: 'מכונת המלחמה',
        about: 'אודות',
        contact: 'צור קשר',
        signIn: 'כניסה',
        signOut: 'יציאה',
        join: 'הצטרף',
        dashboard: 'לוח בקרה'
      },
      hero: {
        title: 'להילחם בדיסאינפורמציה',
        subtitle: 'הצטרף לאלפים המגינים על האמת בעידן המידע',
        ctaPrimary: 'הצטרף למאבק - חינם',
        ctaSecondary: 'חקור את מכונת המלחמה'
      }
    },
    es: {
      common: {
        appName: 'Leones de Sion',
        tagline: 'Defensores de la Verdad Contra la Desinformación',
        loading: 'Cargando...',
        error: 'Algo salió mal',
        retry: 'Intentar de nuevo'
      }
    },
    fr: {
      common: {
        appName: 'Lions de Sion',
        tagline: 'Défenseurs de la Vérité Contre la Désinformation',
        loading: 'Chargement...',
        error: 'Quelque chose a mal tourné',
        retry: 'Réessayer'
      }
    },
    de: {
      common: {
        appName: 'Löwen von Zion',
        tagline: 'Verteidiger der Wahrheit gegen Desinformation',
        loading: 'Laden...',
        error: 'Etwas ist schief gelaufen',
        retry: 'Erneut versuchen'
      }
    },
    ar: {
      common: {
        appName: 'أسود صهيون',
        tagline: 'المدافعون عن الحقيقة ضد التضليل',
        loading: 'جاري التحميل...',
        error: 'حدث خطأ ما',
        retry: 'حاول مرة أخرى'
      }
    }
  }

  // Navigate to the key in translations
  const keys = key.split('.')
  let value: any = translations[locale]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value]
    } else {
      // Fallback to English if key not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey as keyof typeof value]
        } else {
          return key // Return the key itself if translation not found
        }
      }
      break
    }
  }

  // Replace parameters if provided
  if (params && typeof value === 'string') {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replace(`{${paramKey}}`, String(paramValue))
    })
  }

  return typeof value === 'string' ? value : key
}
