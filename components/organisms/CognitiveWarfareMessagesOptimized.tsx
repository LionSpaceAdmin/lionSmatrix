'use client'

import React, { useEffect, useState, useRef, useCallback, memo } from 'react'
import { useLocale } from '@/lib/hooks/useLocale'

// Optimized version with vanilla JS animations and reduced bundle size
// Target: < 12KB gzipped, CLS < 0.01, TTI impact < 100ms

interface Message {
  id: number
  [key: string]: string | number
}

interface OptimizedMessagesProps {
  className?: string
  hideControls?: boolean
}

const FALLBACK = "Narrative is the weapon. Media is the battlefield."
const TYPE_SPEED = 24 // chars per second
const HOLD_TIME = 3500 // milliseconds
const FADE_TIME = 250 // milliseconds

// Memoized message component to prevent re-renders
const MessageDisplay = memo(({ 
  text, 
  isTyping, 
  showCursor 
}: { 
  text: string
  isTyping: boolean
  showCursor: boolean
}) => (
  <div 
    className="font-mono text-terminal-cyan text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight"
    aria-live="polite"
    aria-atomic="true"
  >
    <span>{text}</span>
    {showCursor && (
      <span 
        className="inline-block w-0.5 h-6 md:h-7 lg:h-8 bg-terminal-cyan ml-1"
        style={{ 
          animation: isTyping ? 'none' : 'blink 1s step-end infinite',
          opacity: isTyping ? 1 : undefined
        }}
      />
    )}
  </div>
))

MessageDisplay.displayName = 'MessageDisplay'

export const CognitiveWarfareMessagesOptimized = memo(function CognitiveWarfareMessagesOptimized({
  className = '',
  hideControls = false
}: OptimizedMessagesProps) {
  const { locale, isRTL } = useLocale()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isReduced, setIsReduced] = useState(false)
  
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const charIndexRef = useRef(0)
  const holdTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Check reduced motion on mount only
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReduced(mq.matches)
    
    // Passive listener for better performance
    const handler = (e: MediaQueryListEvent) => setIsReduced(e.matches)
    mq.addEventListener('change', handler, { passive: true } as any)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Load messages with cache
  useEffect(() => {
    let isMounted = true
    
    const loadMessages = async () => {
      try {
        // Check sessionStorage cache first
        const cached = sessionStorage.getItem('cw_messages')
        if (cached) {
          const parsed = JSON.parse(cached) as { messages: Message[] }
          if (isMounted) setMessages(parsed.messages)
          return
        }

        const res = await fetch('/i18n/cognitive_warfare_messages_multilingual.json')
        if (!res.ok) throw new Error('Failed to load')
        
        const data = await res.json() as { messages: Message[] }
        if (isMounted) {
          setMessages(data.messages)
          // Cache for session
          sessionStorage.setItem('cw_messages', JSON.stringify(data))
        }
      } catch {
        if (isMounted) {
          setMessages([{ id: 1, en: FALLBACK }])
        }
      }
    }
    
    loadMessages()
    return () => { isMounted = false }
  }, [])

  // Get message text
  const getMessage = useCallback((msg: Message): string => {
    return (msg[locale] || msg.en || FALLBACK) as string
  }, [locale])

  // Optimized typewriter using RAF
  const typeWriter = useCallback((text: string) => {
    if (isReduced || isPaused) {
      setDisplayText(text)
      setIsTyping(false)
      
      if (!isPaused) {
        holdTimeoutRef.current = setTimeout(() => {
          setCurrentIndex(i => (i + 1) % messages.length)
        }, HOLD_TIME)
      }
      return
    }

    setIsTyping(true)
    charIndexRef.current = 0
    startTimeRef.current = performance.now()

    const animate = (currentTime: number) => {
      if (isPaused) {
        setIsTyping(false)
        return
      }

      const elapsed = currentTime - (startTimeRef.current || currentTime)
      const targetChars = Math.floor((elapsed / 1000) * TYPE_SPEED)
      
      if (targetChars > charIndexRef.current) {
        charIndexRef.current = Math.min(targetChars, text.length)
        setDisplayText(text.slice(0, charIndexRef.current))
      }

      if (charIndexRef.current < text.length) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setIsTyping(false)
        holdTimeoutRef.current = setTimeout(() => {
          if (!isPaused) {
            setCurrentIndex(i => (i + 1) % messages.length)
          }
        }, HOLD_TIME)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [isReduced, isPaused, messages.length])

  // Handle message changes
  useEffect(() => {
    if (messages.length === 0) return

    // Cleanup previous animations
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current)

    const msg = messages[currentIndex]
    if (msg) {
      const text = getMessage(msg)
      typeWriter(text)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current)
    }
  }, [currentIndex, messages, getMessage, typeWriter])

  return (
    <div 
      className={`relative ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ textAlign: isRTL ? 'right' : 'left' }}
    >
      <MessageDisplay 
        text={displayText} 
        isTyping={isTyping}
        showCursor={!isReduced}
      />

      {!hideControls && (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="px-2 py-1 text-xs font-mono text-terminal-cyan/70 
                     hover:text-terminal-cyan transition-colors"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            [{isPaused ? '▶' : '❚❚'}]
          </button>
          <span className="text-xs font-mono text-terminal-muted">
            {locale.toUpperCase()}
          </span>
        </div>
      )}

      {/* Minimal progress dots */}
      <div className="mt-3 flex gap-1" aria-hidden="true">
        {messages.slice(0, 10).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 transition-colors duration-300 ${
              i === currentIndex ? 'bg-terminal-cyan' : 'bg-terminal-cyan/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
})

// CSS for cursor blink (inject once)
if (typeof document !== 'undefined' && !document.getElementById('cw-cursor-style')) {
  const style = document.createElement('style')
  style.id = 'cw-cursor-style'
  style.textContent = `
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `
  document.head.appendChild(style)
}