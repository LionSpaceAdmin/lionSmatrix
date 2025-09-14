'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Locale, defaultLocale, rtlLocales } from '@/lib/i18n/config'
import { getDirection } from '@/lib/i18n/helpers'

// Types
interface CognitiveMessage {
  id: number
  en: string
  he: string
  ar: string
  fr: string
  de: string
  ru: string
  es: string
  pt: string
  it: string
  zh: string
  ja: string
  hi: string
  fa: string
}

interface CognitiveWarfareRotatingMessagesProps {
  locale?: Locale
  className?: string
  onMessageChange?: (messageId: number) => void
}

// Performance optimized constants
const TYPEWRITER_CONFIG = {
  typeSpeed: 24, // characters per second
  backspaceSpeed: 36, // characters per second
  holdPerMessage: 3500, // milliseconds including typing time
  crossfadeOut: 250, // milliseconds
  crossfadeIn: 250 // milliseconds
} as const

const FALLBACK_MESSAGE = "Narrative is the weapon. Media is the battlefield."

// Custom hook for reduced motion preference
function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}

// Custom hook for animation pause control
function useAnimationControl() {
  const [isPaused, setIsPaused] = useState(false)
  
  return {
    isPaused,
    togglePause: () => setIsPaused(prev => !prev),
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false)
  }
}

// Optimized message loader with error boundary
async function loadMessages(): Promise<CognitiveMessage[]> {
  try {
    const response = await fetch('/i18n/cognitive_warfare_messages_multilingual.json', {
      method: 'GET',
      headers: {
        'Cache-Control': 'max-age=3600', // 1 hour cache
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    // Validate data structure
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid data format')
    }
    
    return data
  } catch (error) {
    console.warn('Failed to load cognitive warfare messages:', error)
    // Return fallback message in all languages
    return [{
      id: 1,
      en: FALLBACK_MESSAGE,
      he: "הנרטיב הוא הנשק. התקשורת היא שדה הקרב.",
      ar: "السرد هو السلاح. الإعلام هو ساحة المعركة.",
      fr: "Le récit est l'arme. Les médias sont le champ de bataille.",
      de: "Das Narrativ ist die Waffe. Die Medien sind das Schlachtfeld.",
      ru: "Нарратив - это оружие. Медиа - это поле битвы.",
      es: "La narrativa es el arma. Los medios son el campo de batalla.",
      pt: "A narrativa é a arma. A mídia é o campo de batalha.",
      it: "La narrativa è l'arma. I media sono il campo di battaglia.",
      zh: "叙事是武器。媒体是战场。",
      ja: "物語が武器である。メディアが戦場である。",
      hi: "कथा ही हथियार है। मीडिया ही युद्धक्षेत्र है।",
      fa: "روایت سلاح است. رسانه میدان جنگ است."
    }]
  }
}

// Typewriter effect with performance optimization
function useTypewriterEffect(
  text: string,
  isActive: boolean,
  reducedMotion: boolean,
  isPaused: boolean,
  isRTL: boolean = false
) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isBackspacing, setIsBackspacing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const animationRef = useRef<number>()
  const timeoutRef = useRef<NodeJS.Timeout>()

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isActive || reducedMotion) {
      setDisplayText(text)
      setIsComplete(true)
      setIsTyping(false)
      setIsBackspacing(false)
      return
    }

    if (isPaused) {
      return
    }

    cleanup()
    
    let currentIndex = 0
    let isCurrentlyTyping = true
    let lastFrameTime = 0
    
    setDisplayText('')
    setIsTyping(true)
    setIsBackspacing(false)
    setIsComplete(false)

    const animate = (timestamp: number) => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      if (timestamp - lastFrameTime < (1000 / (isCurrentlyTyping ? TYPEWRITER_CONFIG.typeSpeed : TYPEWRITER_CONFIG.backspaceSpeed))) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      lastFrameTime = timestamp

      if (isCurrentlyTyping) {
        if (currentIndex < text.length) {
          currentIndex++
          // For RTL languages, we need to handle text building differently
          if (isRTL) {
            // For RTL, we build the text normally but ensure proper RTL display
            setDisplayText(text.slice(0, currentIndex))
          } else {
            // For LTR, normal slicing
            setDisplayText(text.slice(0, currentIndex))
          }
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setIsTyping(false)
          setIsComplete(true)
          // Hold the complete message
          timeoutRef.current = setTimeout(() => {
            if (!isPaused) {
              setIsComplete(false)
              setIsBackspacing(true)
              isCurrentlyTyping = false
              animationRef.current = requestAnimationFrame(animate)
            }
          }, TYPEWRITER_CONFIG.holdPerMessage)
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--
          // For RTL languages, we need to handle text building differently
          if (isRTL) {
            // For RTL, we build the text normally but ensure proper RTL display
            setDisplayText(text.slice(0, currentIndex))
          } else {
            // For LTR, normal slicing
            setDisplayText(text.slice(0, currentIndex))
          }
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setIsBackspacing(false)
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return cleanup
  }, [text, isActive, reducedMotion, isPaused, cleanup])

  return { displayText, isTyping, isBackspacing, isComplete }
}

export function CognitiveWarfareRotatingMessages({
  locale = defaultLocale,
  className = '',
  onMessageChange
}: CognitiveWarfareRotatingMessagesProps) {
  const [messages, setMessages] = useState<CognitiveMessage[]>([])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const reducedMotion = useReducedMotion()
  const { isPaused, togglePause } = useAnimationControl()
  
  const currentMessage = messages[currentMessageIndex]
  const currentText = currentMessage?.[locale] || currentMessage?.en || FALLBACK_MESSAGE
  const direction = getDirection(locale)
  const isRTL = rtlLocales.includes(locale)

  const { displayText, isTyping, isBackspacing, isComplete } = useTypewriterEffect(
    currentText,
    hasStarted && isVisible && !isLoading,
    reducedMotion,
    isPaused,
    isRTL
  )

  // Load messages on mount
  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      try {
        const data = await loadMessages()
        if (mounted) {
          setMessages(data)
          setIsLoading(false)
        }
      } catch (error) {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()
    return () => { mounted = false }
  }, [])

  // Rotation logic
  useEffect(() => {
    if (!hasStarted || isLoading || messages.length === 0 || isPaused || reducedMotion) {
      return
    }

    const timer = setTimeout(() => {
      const nextIndex = (currentMessageIndex + 1) % messages.length
      setCurrentMessageIndex(nextIndex)
      const nextMessage = messages[nextIndex]
      if (nextMessage) {
        onMessageChange?.(nextMessage.id)
      }
    }, TYPEWRITER_CONFIG.holdPerMessage + 1000) // Extra time for transitions

    return () => clearTimeout(timer)
  }, [currentMessageIndex, hasStarted, isLoading, messages.length, isPaused, reducedMotion, onMessageChange, messages])

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsVisible(entry.isIntersecting)
          if (entry.isIntersecting && !hasStarted) {
            // Defer start until idle or first interaction
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => setHasStarted(true))
            } else {
              setTimeout(() => setHasStarted(true), 100)
            }
          }
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('cognitive-warfare-messages')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [hasStarted])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && event.ctrlKey) {
        event.preventDefault()
        togglePause()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [togglePause])

  if (isLoading) {
    return (
      <div 
        className={`cognitive-warfare-loading ${className}`}
        dir={direction}
      >
        <div className="font-mono text-terminal-muted animate-pulse">
          Loading truth defense protocols...
        </div>
      </div>
    )
  }

  return (
    <div
      id="cognitive-warfare-messages"
      className={`cognitive-warfare-messages ${className}`}
      dir={direction}
      role="region"
      aria-label="Rotating cognitive warfare messages"
    >
      {/* Screen reader only label */}
      <div className="sr-only">
        Rotating message {currentMessageIndex + 1} of {messages.length}
      </div>

      {/* Main message container */}
      <div
        className="message-container relative"
        aria-live="polite"
        aria-atomic="true"
      >
        <div 
          className={`
            message-text
            font-mono text-xl md:text-2xl lg:text-3xl 
            font-bold leading-tight
            text-terminal-cyan
            min-h-[3rem] md:min-h-[4rem] lg:min-h-[5rem]
            flex items-center
            transition-opacity duration-${TYPEWRITER_CONFIG.crossfadeOut}
            ${isTyping || isBackspacing ? 'opacity-90' : 'opacity-100'}
            ${isRTL ? 'text-right' : 'text-left'}
          `}
          style={{
            // CSS logical properties for RTL support
            paddingInlineStart: isRTL ? '0' : '0.5rem',
            paddingInlineEnd: isRTL ? '0.5rem' : '0',
            borderInlineStart: isRTL ? 'none' : '2px solid currentColor',
            borderInlineEnd: isRTL ? '2px solid currentColor' : 'none',
            // Force RTL direction for Hebrew text
            direction: isRTL ? 'rtl' : 'ltr',
            unicodeBidi: isRTL ? 'bidi-override' : 'normal'
          }}
        >
          <span style={{ direction: isRTL ? 'rtl' : 'ltr', unicodeBidi: isRTL ? 'bidi-override' : 'normal' }}>
            {displayText}
            {(isTyping || isBackspacing) && !reducedMotion && (
              <span 
                className="cursor inline-block w-0.5 h-[1em] bg-terminal-cyan ml-1 animate-pulse"
                aria-hidden="true"
                style={{ direction: isRTL ? 'rtl' : 'ltr', unicodeBidi: isRTL ? 'bidi-override' : 'normal' }}
              />
            )}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="controls mt-4 flex items-center justify-between text-sm">
        <div className="message-counter text-terminal-muted font-mono">
          {currentMessageIndex + 1} / {messages.length}
        </div>
        
        <div className="flex items-center gap-4">
          {!reducedMotion && (
            <button
              onClick={togglePause}
              className="pause-button 
                px-3 py-1 
                bg-terminal-secondary 
                border border-terminal-border 
                rounded 
                text-terminal-text 
                hover:bg-terminal-accent 
                hover:text-terminal-bg
                font-mono text-xs
                transition-colors
                focus:outline-none 
                focus:ring-2 
                focus:ring-terminal-cyan
              "
              aria-label={isPaused ? 'Resume animations' : 'Pause animations'}
              title="Ctrl+Space to toggle"
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}
          
          <div className="reduced-motion-indicator text-terminal-muted font-mono text-xs">
            {reducedMotion && 'Reduced motion mode'}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {!reducedMotion && !isPaused && (
        <div className="progress-bar mt-2 h-1 bg-terminal-secondary rounded overflow-hidden">
          <div 
            className="progress-fill h-full bg-terminal-cyan transition-all duration-1000 ease-linear"
            style={{
              width: `${((currentMessageIndex + 1) / messages.length) * 100}%`
            }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}