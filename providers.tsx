"use client"

import type { ReactNode } from 'react'
import { TranslationProvider } from '@/app/_contexts/translation-context'

export function Providers({ children }: { children: ReactNode }) {
  return <TranslationProvider>{children}</TranslationProvider>
}

export { TranslationProvider }
