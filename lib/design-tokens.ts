// Central design tokens (source of truth references CSS variables)
// Access via getComputedStyle(document.documentElement).getPropertyValue('--token') at runtime if needed.
// This file provides TypeScript enums & maps for consistency in components.

export const PrimitiveTokens = {
  terminalBg: "var(--terminal-bg)",
  terminalSecondary: "var(--terminal-secondary)",
  terminalCyan: "var(--terminal-cyan)",
  terminalGold: "var(--terminal-gold)",
  terminalRed: "var(--terminal-red)",
  terminalText: "var(--terminal-text)",
  terminalMuted: "var(--terminal-muted)",
  terminalBorder: "var(--terminal-border)",
} as const

export const SemanticTokens = {
  surfaceBase: "var(--color-surface-base)",
  surfaceAlt: "var(--color-surface-alt)",
  borderDefault: "var(--color-border-default)",
  textPrimary: "var(--color-text-primary)",
  textMuted: "var(--color-text-muted)",
  accentPrimary: "var(--color-accent-primary)",
  accentWarn: "var(--color-accent-warn)",
  accentError: "var(--color-accent-error)",
  focusRing: "var(--color-focus-ring)",
} as const

export type TokenKey = keyof typeof PrimitiveTokens | keyof typeof SemanticTokens

export const allTokens: Record<string, string> = {
  ...PrimitiveTokens,
  ...SemanticTokens,
}

// Helper to inline style objects easily
export function tokenVar(token: keyof typeof allTokens) {
  return allTokens[token]
}

// Example usage pattern (documentation snippet):
// style={{ backgroundColor: `rgb(${getCssVar('--terminal-bg')})` }}
export function getCssVar(name: string): string {
  if (typeof window === "undefined") return ""
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
