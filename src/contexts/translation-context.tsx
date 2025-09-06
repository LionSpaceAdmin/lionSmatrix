'use client';

import { createContext, useContext } from 'react'

const TranslationContext = createContext<{
  t: (key: string) => string
} | null>(null)

// Simple translation function that returns keys as fallbacks
const translations: Record<string, string> = {
  'intelligence.analytics_kpi_time_to_counter': 'Time to Counter',
  'intelligence.analytics_kpi_reach_delta': 'Reach Delta',
  'intelligence.analytics_kpi_precision': 'Precision Rate',
  'intelligence.analytics_kpi_ops_ran': 'Operations Ran',
  'intelligence.campaign_generator_select_target': 'Select Target',
  // Add more translations as needed
}

function simpleTranslate(key: string): string {
  return translations[key] || key.split('.').pop() || key
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context) {
    return context
  }
  // Return simple translation function
  return { t: simpleTranslate }
}

export { TranslationContext }
