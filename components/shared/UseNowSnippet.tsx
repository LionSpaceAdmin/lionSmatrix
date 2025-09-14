'use client'

import React, { useState } from 'react'
import { Copy, Check, Globe, Hash, MessageSquare, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SnippetContent {
  id: string
  text: string
  language: 'en' | 'he' | 'es' | 'fr' | 'de' | 'ar'
  category: 'response' | 'alert' | 'fact' | 'action'
  hashtags?: string[]
  source?: string
}

interface UseNowSnippetProps {
  snippets: SnippetContent[]
  className?: string
  title?: string
  showLanguageSelector?: boolean
}

const categoryConfig = {
  response: {
    icon: MessageSquare,
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
    label: 'RESPONSE'
  },
  alert: {
    icon: Zap,
    color: 'text-red-400 border-red-500/30 bg-red-500/5',
    label: 'ALERT'
  },
  fact: {
    icon: Check,
    color: 'text-green-400 border-green-500/30 bg-green-500/5',
    label: 'FACT'
  },
  action: {
    icon: Hash,
    color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
    label: 'ACTION'
  }
}

const languageNames = {
  en: 'English',
  he: 'עברית',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية'
}

export function UseNowSnippet({
  snippets,
  className,
  title = 'USE NOW',
  showLanguageSelector = true
}: UseNowSnippetProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const availableLanguages = [...new Set(snippets.map(s => s.language))]
  
  const filteredSnippets = snippets.filter(snippet => {
    const matchesLanguage = snippet.language === selectedLanguage
    const matchesCategory = !selectedCategory || snippet.category === selectedCategory
    return matchesLanguage && matchesCategory
  })

  const handleCopy = async (snippet: SnippetContent) => {
    try {
      const textToCopy = snippet.hashtags 
        ? `${snippet.text}\n\n${snippet.hashtags.map(h => `#${h}`).join(' ')}`
        : snippet.text
        
      await navigator.clipboard.writeText(textToCopy)
      setCopiedId(snippet.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono font-bold text-terminal-cyan flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {title}
        </h3>
        
        {/* Language Selector */}
        {showLanguageSelector && availableLanguages.length > 1 && (
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-terminal-muted" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-terminal-secondary border border-terminal-border rounded px-2 py-1 text-xs font-mono text-terminal-text focus:border-terminal-cyan/50 focus:outline-none"
            >
              {availableLanguages.map(lang => (
                <option key={lang} value={lang}>
                  {languageNames[lang as keyof typeof languageNames]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'px-2 py-1 rounded text-xs font-mono transition-colors',
            !selectedCategory
              ? 'bg-terminal-cyan/20 border border-terminal-cyan/50 text-terminal-cyan'
              : 'bg-terminal-secondary border border-terminal-border text-terminal-muted hover:border-terminal-cyan/30'
          )}
        >
          ALL
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={cn(
              'px-2 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1',
              selectedCategory === key
                ? config.color
                : 'bg-terminal-secondary border border-terminal-border text-terminal-muted hover:border-terminal-cyan/30'
            )}
          >
            <config.icon className="w-3 h-3" />
            {config.label}
          </button>
        ))}
      </div>

      {/* Snippets */}
      <div className="space-y-2">
        {filteredSnippets.map((snippet) => {
          const config = categoryConfig[snippet.category]
          const Icon = config.icon
          
          return (
            <div
              key={snippet.id}
              className={cn(
                'relative rounded border p-3 transition-all duration-200',
                config.color,
                'hover:shadow-md'
              )}
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase">
                    {config.label}
                  </span>
                  {snippet.source && (
                    <>
                      <span className="text-xs opacity-50">•</span>
                      <span className="text-xs font-mono opacity-70">
                        {snippet.source}
                      </span>
                    </>
                  )}
                </div>
                
                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(snippet)}
                  className={cn(
                    'p-1.5 rounded transition-all duration-200',
                    'hover:bg-white/10',
                    copiedId === snippet.id && 'text-green-400'
                  )}
                  aria-label="Copy snippet"
                >
                  {copiedId === snippet.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Text Content */}
              <p className="text-sm text-terminal-text whitespace-pre-wrap">
                {snippet.text}
              </p>

              {/* Hashtags */}
              {snippet.hashtags && snippet.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-current opacity-30">
                  {snippet.hashtags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-mono opacity-70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredSnippets.length === 0 && (
        <div className="text-center py-6 text-terminal-muted">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-mono">
            No snippets available
            {selectedCategory && ' for this category'}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="pt-3 border-t border-terminal-border">
        <div className="flex items-center justify-between text-xs text-terminal-muted font-mono">
          <span>{filteredSnippets.length} snippets ready</span>
          <span>Click to copy • Paste anywhere</span>
        </div>
      </div>
    </div>
  )
}

export default UseNowSnippet
