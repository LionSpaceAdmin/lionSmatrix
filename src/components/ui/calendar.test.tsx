import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Calendar } from './calendar'

describe('Calendar', () => {
  it('should render the calendar', () => {
    // Mock the date to make the test deterministic
    const mockDate = new Date(2024, 7, 10) // August 10, 2024
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate)

    render(<Calendar />)
    expect(screen.getByText('August 2024')).not.toBeNull()

    vi.restoreAllMocks()
  });

  it('should not have opacity-50 on nav buttons by default', () => {
    render(<Calendar />)
    const prevButton = screen.getByRole('button', { name: 'Go to the Previous Month' })
    const nextButton = screen.getByRole('button', { name: 'Go to the Next Month' })
    expect(prevButton.classList.contains('opacity-50')).toBe(false)
    expect(nextButton.classList.contains('opacity-50')).toBe(false)
  });

  it('should be disabled when fromMonth and toMonth are the same', () => {
    const month = new Date()
    render(<Calendar fromMonth={month} toMonth={month} />)
    const prevButton = screen.getByRole('button', { name: 'Go to the Previous Month' })
    const nextButton = screen.getByRole('button', { name: 'Go to the Next Month' })
    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  });
});
