import * as React from 'react'

interface ScreenReaderOnlyProps {
  children: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
}

export function ScreenReaderOnly({ 
  children, 
  as: Component = 'span' 
}: ScreenReaderOnlyProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}

// Live region for screen reader announcements
interface LiveRegionProps {
  children: React.ReactNode
  politeness?: 'polite' | 'assertive' | 'off'
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  atomic?: boolean
}

export function LiveRegion({
  children,
  politeness = 'polite',
  relevant = 'additions',
  atomic = false,
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-relevant={relevant}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  )
}

// Announce component for dynamic messages
export function useAnnounce() {
  const [message, setMessage] = React.useState('')

  const announce = React.useCallback((text: string, politeness: 'polite' | 'assertive' = 'polite') => {
    // Clear and set message to ensure announcement
    setMessage('')
    setTimeout(() => setMessage(text), 100)
  }, [])

  return {
    announce,
    Announcer: () => (
      <LiveRegion politeness="polite">
        {message}
      </LiveRegion>
    )
  }
}