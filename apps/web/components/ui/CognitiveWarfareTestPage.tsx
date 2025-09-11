'use client'

import { useState, useEffect } from 'react'
import { CognitiveWarfareRotatingMessages } from './CognitiveWarfareRotatingMessages'
import { useLocale } from '@/lib/hooks/useLocale'
import { locales, localeNames } from '@/lib/i18n/config'
import { measurePerformance, generateStatusReport, type PerformanceMetrics, type ComponentStatus } from '@/lib/utils/performance'

/**
 * Test page for Cognitive Warfare Rotating Messages component
 * This component is for development/testing purposes only
 */
export function CognitiveWarfareTestPage() {
  const { locale, setLocale } = useLocale()
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [statusReport] = useState<ComponentStatus>(generateStatusReport())
  const [currentMessageId, setCurrentMessageId] = useState<number>(1)

  useEffect(() => {
    // Measure performance after component mounts
    const timer = setTimeout(() => {
      measurePerformance().then(setPerformanceMetrics)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-terminal-cyan mb-8 font-mono">
          Cognitive Warfare Messages - Test Environment
        </h1>

        {/* Locale Selector */}
        <div className="mb-8 p-4 bg-terminal-secondary border border-terminal-border rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-terminal-cyan">Locale Testing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className={`
                  px-3 py-2 rounded font-mono text-sm
                  ${locale === loc 
                    ? 'bg-terminal-cyan text-terminal-bg' 
                    : 'bg-terminal-bg border border-terminal-border text-terminal-text hover:bg-terminal-accent'
                  }
                `}
              >
                {loc.toUpperCase()} - {localeNames[loc]}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-terminal-muted">
            Current locale: <span className="text-terminal-cyan font-mono">{locale}</span>
            {' • '}
            Current message ID: <span className="text-terminal-cyan font-mono">{currentMessageId}</span>
          </div>
        </div>

        {/* Component Demo */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-terminal-cyan">Component Demo</h2>
          <div className="bg-terminal-secondary/50 border border-terminal-border rounded-lg p-6">
            <CognitiveWarfareRotatingMessages
              locale={locale}
              onMessageChange={setCurrentMessageId}
              className="max-w-4xl mx-auto"
            />
          </div>
        </div>

        {/* Performance Metrics */}
        {performanceMetrics && (
          <div className="mb-8 p-4 bg-terminal-secondary border border-terminal-border rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-terminal-cyan">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-sm">
              <div>
                <div className="text-terminal-muted">Component Load Time</div>
                <div className={performanceMetrics.componentLoadTime <= 100 ? 'text-green-400' : 'text-yellow-400'}>
                  {performanceMetrics.componentLoadTime.toFixed(2)}ms
                </div>
              </div>
              <div>
                <div className="text-terminal-muted">JSON Load Time</div>
                <div className={performanceMetrics.jsonLoadTime <= 50 ? 'text-green-400' : 'text-yellow-400'}>
                  {performanceMetrics.jsonLoadTime.toFixed(2)}ms
                </div>
              </div>
              <div>
                <div className="text-terminal-muted">Animation FPS</div>
                <div className={performanceMetrics.animationPerformance >= 55 ? 'text-green-400' : 'text-yellow-400'}>
                  {performanceMetrics.animationPerformance.toFixed(1)} FPS
                </div>
              </div>
              <div>
                <div className="text-terminal-muted">Memory Usage</div>
                <div className={performanceMetrics.memoryUsage <= 1 ? 'text-green-400' : 'text-yellow-400'}>
                  {performanceMetrics.memoryUsage.toFixed(2)}MB
                </div>
              </div>
              <div>
                <div className="text-terminal-muted">Render Time</div>
                <div className="text-terminal-cyan">
                  {performanceMetrics.renderTime.toFixed(2)}ms
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Report */}
        <div className="mb-8 p-4 bg-terminal-secondary border border-terminal-border rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-terminal-cyan">Component Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-terminal-text">Bundle Size</h3>
              <div className="font-mono text-sm space-y-1">
                <div>Component: {(statusReport.gzippedSize / 1024).toFixed(1)}KB gzipped</div>
                <div>JSON Data: {(statusReport.jsonSize / 1024).toFixed(1)}KB</div>
                <div>Supported Locales: {statusReport.supportedLocales}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-terminal-text">Accessibility</h3>
              <div className="font-mono text-sm space-y-1">
                <div className="text-green-400">✅ ARIA Support</div>
                <div className="text-green-400">✅ Reduced Motion</div>
                <div className="text-green-400">✅ RTL Support</div>
                <div className="text-green-400">✅ Keyboard Navigation</div>
              </div>
            </div>
          </div>
        </div>

        {/* RTL Testing */}
        <div className="mb-8 p-4 bg-terminal-secondary border border-terminal-border rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-terminal-cyan">RTL Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['he', 'ar', 'fa'].map((rtlLocale) => (
              <div key={rtlLocale} className="border border-terminal-border rounded p-3">
                <h3 className="text-sm font-semibold mb-2 text-terminal-text">
                  {localeNames[rtlLocale as keyof typeof localeNames]}
                </h3>
                <button
                  onClick={() => setLocale(rtlLocale as any)}
                  className="text-xs px-2 py-1 bg-terminal-cyan text-terminal-bg rounded font-mono"
                >
                  Test {rtlLocale.toUpperCase()}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-terminal-secondary border border-terminal-border rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-terminal-cyan">Testing Instructions</h2>
          <div className="space-y-2 text-sm text-terminal-muted">
            <p>1. Test different locales using the buttons above</p>
            <p>2. Verify RTL languages display correctly (Hebrew, Arabic, Persian)</p>
            <p>3. Test reduced motion by enabling it in your OS settings</p>
            <p>4. Use Ctrl+Space to pause/resume animations</p>
            <p>5. Check mobile viewport by resizing the window</p>
            <p>6. Monitor performance metrics above</p>
          </div>
        </div>
      </div>
    </div>
  )
}