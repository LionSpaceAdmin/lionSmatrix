'use client'

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Types
interface Message {
  id: number
  en: string
  he?: string
  ar?: string
  fr?: string
  de?: string
  ru?: string
  es?: string
  pt?: string
  it?: string
  zh?: string
  ja?: string
  hi?: string
  fa?: string
}

interface MessagesData {
  title: string
  languages: string[]
  messages: Message[]
}

interface CognitiveWarfareMessagesProps {
  locale?: string
  className?: string
  typeSpeed?: number // chars per second
  backspaceSpeed?: number // chars per second
  holdDuration?: number // milliseconds
  crossfadeDuration?: number // milliseconds
  autoStart?: boolean
  showControls?: boolean
}

// RTL languages
const RTL_LOCALES = ['he', 'ar', 'fa']

// Fallback message if JSON fails to load
const FALLBACK_MESSAGE = "Narrative is the weapon. Media is the battlefield."

export function CognitiveWarfareMessages({
  locale = 'en',
  className = '',
  typeSpeed = 24,
  backspaceSpeed = 36,
  holdDuration = 3500,
  crossfadeDuration = 250,
  autoStart = true,
  showControls = true
}: CognitiveWarfareMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true)
  const [error, setError] = useState(false)
  const [currentLocale, setCurrentLocale] = useState(locale)
  
  const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsAnimationEnabled(!mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsAnimationEnabled(!e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Detect locale from various sources
  useEffect(() => {
    const detectLocale = () => {
      // Check URL params
      const urlParams = new URLSearchParams(window.location.search)
      const langParam = urlParams.get('lang')
      if (langParam) return langParam
      
      // Check cookie
      const cookies = document.cookie.split(';')
      const langCookie = cookies.find(c => c.trim().startsWith('lang='))
      if (langCookie) {
        const lang = langCookie.split('=')[1]
        if (lang) return lang
      }
      
      // Check navigator language
      const navigatorLang = navigator.language.split('-')[0]
      if (navigatorLang) return navigatorLang
      
      return locale
    }
    
    const detectedLocale = detectLocale()
    setCurrentLocale(detectedLocale)
  }, [locale])

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch('/i18n/cognitive_warfare_messages_multilingual.json')
        if (!response.ok) throw new Error('Failed to load messages')
        
        const data = await response.json() as MessagesData
        setMessages(data.messages)
        setError(false)
      } catch (err) {
        console.error('Error loading messages:', err)
        setError(true)
        // Use fallback
        setMessages([{ id: 1, en: FALLBACK_MESSAGE }])
      }
    }
    
    loadMessages()
  }, [])

  // Get message text for current locale
  const getMessageText = useCallback((message: Message): string => {
    const text = message[currentLocale as keyof Message] as string | undefined
    return text || message.en || FALLBACK_MESSAGE
  }, [currentLocale])

  // Check if current locale is RTL
  const isRTL = useMemo(() => RTL_LOCALES.includes(currentLocale), [currentLocale])

  // Typewriter effect
  const typewriterEffect = useCallback((text: string, index: number = 0) => {
    if (!isAnimationEnabled || isPaused) {
      setDisplayedText(text)
      setIsTyping(false)
      return
    }

    if (index <= text.length) {
      setDisplayedText(text.slice(0, index))
      setIsTyping(true)
      
      const delay = 1000 / typeSpeed
      typeTimeoutRef.current = setTimeout(() => {
        typewriterEffect(text, index + 1)
      }, delay)
    } else {
      setIsTyping(false)
      // Hold the message
      holdTimeoutRef.current = setTimeout(() => {
        nextMessage()
      }, holdDuration)
    }
  }, [isAnimationEnabled, isPaused, typeSpeed, holdDuration])

  // Move to next message
  const nextMessage = useCallback(() => {
    if (isPaused) return
    
    setCurrentMessageIndex(prev => (prev + 1) % messages.length)
  }, [isPaused, messages.length])

  // Effect to handle message changes
  useEffect(() => {
    if (messages.length === 0) return
    
    // Clear existing timeouts
    if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current)
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current)
    
    const currentMessage = messages[currentMessageIndex]
    if (!currentMessage) return
    
    const text = getMessageText(currentMessage)
    
    if (isAnimationEnabled && !isPaused) {
      typewriterEffect(text)
    } else {
      setDisplayedText(text)
    }
    
    return () => {
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current)
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current)
    }
  }, [currentMessageIndex, messages, isAnimationEnabled, isPaused, getMessageText, typewriterEffect])

  // Handle pause/resume
  const togglePause = () => {
    setIsPaused(prev => !prev)
  }

  // Handle animation toggle
  const toggleAnimation = () => {
    setIsAnimationEnabled(prev => !prev)
  }

  // Container styles
  const containerStyles = useMemo(() => ({
    direction: isRTL ? ('rtl' as const) : ('ltr' as const),
    textAlign: isRTL ? ('right' as const) : ('left' as const)
  }), [isRTL])

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={containerStyles}
    >
      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        <span>Rotating message: {displayedText}</span>
      </div>

      {/* Main message display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessageIndex}
          initial={isAnimationEnabled ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={isAnimationEnabled ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: crossfadeDuration / 1000 }}
          className="relative"
        >
          <div className="font-mono text-terminal-cyan text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight">
            {displayedText}
            {isTyping && isAnimationEnabled && (
              <span className="inline-block w-0.5 h-6 md:h-7 lg:h-8 bg-terminal-cyan ml-1 animate-terminal-blink" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {showControls && (
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={togglePause}
            className="px-3 py-1.5 text-xs font-mono text-terminal-cyan border border-terminal-cyan/30 
                     bg-terminal-bg hover:bg-terminal-cyan/10 transition-colors rounded
                     focus:outline-none focus:ring-2 focus:ring-terminal-cyan/50"
            aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={toggleAnimation}
            className="px-3 py-1.5 text-xs font-mono text-terminal-cyan border border-terminal-cyan/30 
                     bg-terminal-bg hover:bg-terminal-cyan/10 transition-colors rounded
                     focus:outline-none focus:ring-2 focus:ring-terminal-cyan/50"
            aria-label={isAnimationEnabled ? 'Disable animations' : 'Enable animations'}
          >
            {isAnimationEnabled ? 'Disable animations' : 'Enable animations'}
          </button>

          {/* Language indicator */}
          <span className="text-xs font-mono text-terminal-muted">
            [{currentLocale.toUpperCase()}] {isRTL ? 'RTL' : 'LTR'}
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-4 text-xs font-mono text-terminal-red">
          Using fallback message (failed to load translations)
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-4 flex gap-1">
        {messages.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index === currentMessageIndex 
                ? 'bg-terminal-cyan' 
                : 'bg-terminal-cyan/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// SSR-friendly wrapper component
export function CognitiveWarfareMessagesSSR(props: CognitiveWarfareMessagesProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Server-side render first message statically
  if (!mounted) {
    const isRTL = RTL_LOCALES.includes(props.locale || 'en')
    return (
      <div 
        className={props.className}
        style={{
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left'
        }}
      >
        <div className="font-mono text-terminal-cyan text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight">
          {FALLBACK_MESSAGE}
        </div>
      </div>
    )
  }

  return <CognitiveWarfareMessages {...props} />
}