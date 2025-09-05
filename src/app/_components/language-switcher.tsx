'use client';

import { useState } from 'react';

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'he', label: 'עב', name: 'עברית' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'ar', label: 'ע', name: 'العربية' },
];

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const changeLanguage = (code: string) => setCurrentLanguage(code);

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`
            px-3 py-1 text-sm font-mono transition-all duration-300
            ${currentLanguage === lang.code 
              ? 'bg-green-400/20 text-green-400 border border-green-400' 
              : 'bg-black/50 text-green-400/50 border border-green-400/20 hover:border-green-400/50'
            }
          `}
          title={lang.name}
          aria-label={`Switch to ${lang.name}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}