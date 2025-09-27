import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useI18n } from './use-i18n'
import React from 'react'

vi.mock('@/lib/i18n/translations', () => ({
  translations: {
    en: { 'test-key': 'Hello' },
    he: { 'test-key': 'שלום' },
  },
}))

function TestComponent() {
  const { setLanguage } = useI18n()

  return (
    <div>
      <button data-i18n-key="test-key">
        <span>Icon</span>
        Some text
        <i>Another icon</i>
      </button>
      <button onClick={() => setLanguage('he')}>Change to Hebrew</button>
    </div>
  )
}

describe('useI18n', () => {
  it('should not remove child elements when changing language', () => {
    render(<TestComponent />)
    const button = screen.getByText('Change to Hebrew')
    const buttonWithIcon = screen.getByText('Some text').parentElement as HTMLElement

    expect(buttonWithIcon.querySelector('span')).not.toBeNull()
    expect(buttonWithIcon.querySelector('i')).not.toBeNull()

    button.click()

    expect(buttonWithIcon.querySelector('span')).not.toBeNull()
    expect(buttonWithIcon.querySelector('i')).not.toBeNull()
  })
})