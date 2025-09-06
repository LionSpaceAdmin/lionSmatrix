/**
 * Terminal UI Component System
 * Centralized exports for all TailwindUI-based terminal components
 */

// Export types
export * from './types'

// Export form components
export { TerminalButton } from './forms/terminal-button'
export { TerminalInput } from './forms/terminal-input'

// Export display components
export { TerminalCard } from './display/terminal-card'

// Export layout components
export { TerminalHero } from './layout/terminal-hero'

// Re-export the better MatrixBackground from visuals
export { default as MatrixBackground } from '@/app/_components/visuals/MatrixBackground'