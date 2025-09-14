'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/components/auth/AuthContext'
import { TranslationProvider } from '@/contexts/translation-context'
import { useState, useEffect } from 'react'
import { trackWebVitals, trackPerformanceMetrics } from '@/lib/web-vitals'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
}

export function Providers({ children, locale }: ProvidersProps) {
  // Create QueryClient instance
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  // Initialize Web Vitals tracking
  useEffect(() => {
    trackWebVitals()
    trackPerformanceMetrics()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <TranslationProvider>
          <AuthProvider>
            <TooltipProvider delayDuration={300}>
              <div data-locale={locale}>
                {children}
              </div>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </TranslationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
