"use client"

import { TranslationProvider } from "@/contexts/translation-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <TranslationProvider>{children}</TranslationProvider>
}

export { TranslationProvider }
