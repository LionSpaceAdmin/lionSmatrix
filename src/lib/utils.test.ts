import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
  })

  it('should handle conditional class names', () => {
    expect(cn('base', { 'is-active': true, 'is-hidden': false })).toBe('base is-active')
  })

  it('should override conflicting class names', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('should handle various types of arguments', () => {
    expect(cn('a', undefined, 'b', { c: true, d: false }, null)).toBe('a b c')
  })
})
