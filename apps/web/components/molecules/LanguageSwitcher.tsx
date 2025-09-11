'use client'

import { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Language {
  code: string
  name: string
  flag: string
  direction: 'ltr' | 'rtl'
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'he', name: 'עברית', flag: '🇮🇱', direction: 'rtl' },
  { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' }
]

interface LanguageSwitcherProps {
  currentLanguage?: string
  onLanguageChange?: (language: string) => void
  className?: string
}

export function LanguageSwitcher({
  currentLanguage = 'en',
  onLanguageChange,
  className
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange?.(langCode)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-terminal-secondary border border-terminal-border',
          'text-terminal-text hover:text-terminal-cyan',
          'hover:border-terminal-cyan/50 transition-all duration-200',
          'font-mono text-sm'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="flex items-center gap-2">
          <span>{currentLang.flag}</span>
          <span className="hidden sm:inline">{currentLang.name}</span>
        </span>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={cn(
            'absolute top-full right-0 mt-2 z-50',
            'bg-terminal-bg border border-terminal-border rounded-lg',
            'shadow-lg shadow-black/20 backdrop-blur-sm',
            'min-w-48 py-2'
          )}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2',
                  'text-left font-mono text-sm',
                  'hover:bg-terminal-secondary transition-colors',
                  lang.code === currentLanguage
                    ? 'text-terminal-cyan bg-terminal-cyan/10'
                    : 'text-terminal-text'
                )}
                dir={lang.direction}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-xs text-terminal-muted opacity-70">
                    {lang.code.toUpperCase()}
                  </div>
                </div>
                {lang.code === currentLanguage && (
                  <div className="w-2 h-2 rounded-full bg-terminal-cyan" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher