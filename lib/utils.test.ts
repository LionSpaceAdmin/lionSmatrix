import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', { 'conditional': true })).toBe('base conditional');
    expect(cn('base', { 'conditional': false })).toBe('base');
  });

  it('should deduplicate tailwind classes', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle a mix of strings, objects, and arrays', () => {
    const isActive = true;
    const hasError = false;
    const result = cn(
      'base-class',
      isActive && 'active-class',
      hasError ? 'error-class' : 'success-class',
      ['another-class', { 'yet-another': true }]
    );
    expect(result).toBe('base-class active-class success-class another-class yet-another');
  });
});
