import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Calendar } from './calendar'

describe('Calendar', () => {
  it('should render the calendar', () => {
    render(<Calendar />)
    const month = new Date().toLocaleString('default', { month: 'long' })
    expect(screen.getByText(month, { exact: false })).not.toBeNull()
  });

  it('should not have opacity-50 on nav buttons by default', () => {
    render(<Calendar />)
    const prevButton = screen.getAllByRole('button', { name: 'Go to the Previous Month' })[0]
    const nextButton = screen.getAllByRole('button', { name: 'Go to the Next Month' })[0]
    expect(prevButton.classList.contains('opacity-50')).toBe(false)
    expect(nextButton.classList.contains('opacity-50')).toBe(false)
  });

  it.skip('should be disabled when fromMonth and toMonth are the same', () => {
    const today = new Date()
    render(<Calendar fromMonth={today} toMonth={today} />)
    const prevButton = screen.getAllByRole('button', { name: 'Go to the Previous Month' })[0]
    const nextButton = screen.getAllByRole('button', { name: 'Go to the Next Month' })[0]
    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  });
});
