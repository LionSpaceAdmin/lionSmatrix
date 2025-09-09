'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { INTELLIGENCE_DATA } from '../_components/visuals/intelligence-data'
import { loadMessages, selectContextualMessage, type MultilingualMessage } from '../../lib/data-loaders'

interface TranslationContextType {
  t: (key: string) => string
  currentLanguage: string
  setLanguage: (lang: string) => void
  getCurrentMessage: () => string
  getNextMessage: () => string
  getContextualMessage: (context?: 'landing' | 'network' | 'analysis' | 'default') => string
  availableLanguages: string[]
}

const TranslationContext = createContext<TranslationContextType | null>(null)

// Simple translation function that returns keys as fallbacks
const translations: Record<string, string> = {
  'intelligence.analytics_kpi_time_to_counter': 'Time to Counter',
  'intelligence.analytics_kpi_reach_delta': 'Reach Delta',
  'intelligence.analytics_kpi_precision': 'Precision Rate',
  'intelligence.analytics_kpi_ops_ran': 'Operations Ran',
  'intelligence.campaign_generator_select_target': 'Select Target',
  // Add more translations as needed
}

// Available languages list for future use
// const availableLanguages = ['en', 'he', 'ar', 'fr', 'de', 'ru', 'es', 'pt', 'it', 'zh', 'ja', 'hi', 'fa']

function simpleTranslate(key: string): string {
  return translations[key] || key.split('.').pop() || key
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en')
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0)
  const [csvMessages, setCsvMessages] = useState<MultilingualMessage[]>([])
  const [messagesLoaded, setMessagesLoaded] = useState<boolean>(false)
  const [dynamicLanguages, setDynamicLanguages] = useState<string[]>(['en', 'he', 'ar', 'fr', 'de', 'ru', 'es', 'pt', 'it', 'zh', 'ja', 'hi', 'fa'])

  // Load CSV messages using the new async data loaders
  useEffect(() => {
    const initializeMessages = async () => {
      try {
        console.log('🚀 Loading messages via data loaders...')
        const { messages, languages } = await loadMessages()
        
        setCsvMessages(messages)
        setDynamicLanguages(languages)
        setMessagesLoaded(true)
        
        console.log('✅ Translation context initialized:', {
          messages: messages.length,
          languages: languages.length,
          firstMessage: messages[0]?.en
        })
      } catch (error) {
        console.error('❌ Failed to initialize messages:', error)
        
        // Fallback to existing data
        setCsvMessages(INTELLIGENCE_DATA.multilingual_messages || [])
        setMessagesLoaded(true)
      }
    }
    
    initializeMessages()
  }, [])

  // Intelligent message rotation using CSV data - ENHANCED
  useEffect(() => {
    if (!messagesLoaded || csvMessages.length === 0) return
    
    const messageRotationInterval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % csvMessages.length
        console.log(`🔄 Message rotation: ${prevIndex} → ${nextIndex}`, csvMessages[nextIndex]?.en?.substring(0, 50))
        return nextIndex
      })
    }, 3500) // Rotate every 3.5 seconds as specified

    return () => clearInterval(messageRotationInterval)
  }, [csvMessages, messagesLoaded])

  // Smart language cycling for maximum impact - ENHANCED
  useEffect(() => {
    if (!messagesLoaded) return
    
    const languageRotationInterval = setInterval(() => {
      const priorityLanguages = ['en', 'he', 'ar'] // Focus on key languages
      const randomPriorityLang = priorityLanguages[Math.floor(Math.random() * priorityLanguages.length)]
      const shouldUsePriority = Math.random() < 0.75 // 75% chance for priority languages
      
      const newLang = shouldUsePriority 
        ? randomPriorityLang 
        : dynamicLanguages[Math.floor(Math.random() * dynamicLanguages.length)]
      
      if (newLang && typeof newLang === 'string') {
        console.log(`🌍 Language change: ${currentLanguage} → ${newLang}`)
        setCurrentLanguage(newLang)
      }
    }, 12000) // Change language every 12 seconds for more dynamic feel

    return () => clearInterval(languageRotationInterval)
  }, [messagesLoaded, dynamicLanguages, currentLanguage])

  const getCurrentMessage = useCallback(() => {
    // Choose messages (loaded CSV > bundled INTELLIGENCE_DATA > empty fallback)
    const messages = (messagesLoaded && csvMessages.length > 0)
      ? csvMessages
      : (INTELLIGENCE_DATA.multilingual_messages || [])

    if (!messages || messages.length === 0) return "Truth is pattern. AI sees it."

    const safeIndex = Math.max(0, currentMessageIndex % messages.length)
    const message = messages[safeIndex]
    if (!message) return "Truth is pattern. AI sees it."

    const langKey = currentLanguage as keyof MultilingualMessage
    const result = (message as Record<string, unknown>)[langKey] || message.en || "Truth is pattern. AI sees it."
    return String(result)
  }, [currentMessageIndex, currentLanguage, csvMessages, messagesLoaded])

  const getNextMessage = useCallback(() => {
    // Use loaded CSV messages with enhanced fallback
    const messages = messagesLoaded && csvMessages.length > 0 
      ? csvMessages 
      : (INTELLIGENCE_DATA.multilingual_messages || [])
    
    if (messages.length === 0) return "Pattern recognition reveals the hidden war."
    
    const nextIndex = (currentMessageIndex + 1) % messages.length
    const message = messages[nextIndex]
    
    if (!message) return "Pattern recognition reveals the hidden war."
    
    const langKey = currentLanguage as keyof MultilingualMessage
    const result = (message as Record<string, unknown>)[langKey] || message.en || "Pattern recognition reveals the hidden war."
    return String(result)
  }, [currentMessageIndex, currentLanguage, csvMessages, messagesLoaded])

  const getContextualMessage = useCallback((context: 'landing' | 'network' | 'analysis' | 'default' = 'default') => {
    // Use the advanced selectContextualMessage from data-loaders
    const messages = messagesLoaded && csvMessages.length > 0 
      ? csvMessages 
      : (INTELLIGENCE_DATA.multilingual_messages || [])
    
    if (messages.length === 0) return "Truth is pattern. AI sees it."
    
    // Use the enhanced contextual message selector
    const result = selectContextualMessage(messages, context, currentLanguage)
    return String(result)
  }, [csvMessages, currentLanguage, messagesLoaded])

  const setLanguage = useCallback((lang: string) => {
    if (dynamicLanguages.includes(lang)) {
      setCurrentLanguage(lang)
    }
  }, [dynamicLanguages])

  const contextValue: TranslationContextType = {
    t: simpleTranslate,
    currentLanguage,
    setLanguage,
    getCurrentMessage,
    getNextMessage,
    getContextualMessage,
    availableLanguages: dynamicLanguages
  }

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    // Fallback for components outside provider
    return {
      t: simpleTranslate,
      currentLanguage: 'en',
      setLanguage: () => {},
      getCurrentMessage: () => "Truth is pattern. AI sees it.",
      getNextMessage: () => "Pattern recognition reveals the hidden war.",
      getContextualMessage: () => "Truth is pattern. AI sees it.",
      availableLanguages: ['en', 'he', 'ar', 'fr', 'de', 'ru', 'es', 'pt', 'it', 'zh', 'ja', 'hi', 'fa']
    }
  }
  return context
}

export { TranslationContext }
