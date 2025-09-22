import { useState, useEffect } from 'react';
import { translations } from '@/lib/i18n/translations';

export function useI18n() {
  const [lang, setLang] = useState('en');

  const setLanguage = (newLang: string) => {
    if (!['en', 'he'].includes(newLang)) newLang = 'en';

    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n-key]').forEach(el => {
        const key = el.getAttribute('data-i18n-key') as keyof typeof translations.en;
        const translation = translations[newLang as 'en' | 'he'][key];
        if (translation) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                (el as HTMLInputElement).placeholder = translation;
            } else {
                const icon = el.firstChild && (el.firstChild.nodeType === 1) ? el.firstChild.cloneNode(true) : null;
                el.textContent = translation;
                if(icon) el.prepend(icon, " ");
            }
        }
    });

    setLang(newLang);
  };

  return { lang, setLanguage };
}
