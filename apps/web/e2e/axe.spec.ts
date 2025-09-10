import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Accessibility Tests', () => {
  test('Landing page should pass accessibility checks', async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)
    
    // Run axe accessibility checks
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
        },
        rules: {
          // Disable specific rules if needed
          'color-contrast': { enabled: true },
          'valid-lang': { enabled: true },
          'html-has-lang': { enabled: true },
          'landmark-one-main': { enabled: true },
          'page-has-heading-one': { enabled: true }
        }
      }
    })
  })

  test('Daily Brief page should pass accessibility checks', async ({ page }) => {
    await page.goto('/daily-brief')
    await injectAxe(page)
    await checkA11y(page)
  })

  test('Archive page should pass accessibility checks', async ({ page }) => {
    await page.goto('/archive')
    await injectAxe(page)
    await checkA11y(page)
  })

  test('Navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/')
    
    // Tab through navigation
    await page.keyboard.press('Tab') // Skip to content
    await page.keyboard.press('Tab') // Logo
    await page.keyboard.press('Tab') // First nav item
    
    // Check focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Check focus ring is applied
    const focusRing = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none'
    })
    expect(focusRing).toBeTruthy()
  })

  test('Forms should have proper labels', async ({ page }) => {
    await page.goto('/contact')
    await injectAxe(page)
    
    // Check form accessibility
    await checkA11y(page, 'form', {
      axeOptions: {
        rules: {
          'label': { enabled: true },
          'aria-label': { enabled: true },
          'aria-labelledby': { enabled: true }
        }
      }
    })
  })

  test('Images should have alt text', async ({ page }) => {
    await page.goto('/')
    
    // Get all images
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
      expect(alt?.length).toBeGreaterThan(0)
    }
  })

  test('Buttons should have accessible names', async ({ page }) => {
    await page.goto('/')
    
    // Get all buttons
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const accessibleName = await button.evaluate((el) => {
        // Check for text content, aria-label, or aria-labelledby
        return el.textContent?.trim() || 
               el.getAttribute('aria-label') || 
               el.getAttribute('aria-labelledby')
      })
      expect(accessibleName).toBeTruthy()
    }
  })

  test('Color contrast should meet WCAG standards', async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)
    
    // Test color contrast specifically
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'rule',
          values: ['color-contrast']
        }
      }
    })
  })

  test('RTL layout should maintain accessibility', async ({ page }) => {
    await page.goto('/he')
    await injectAxe(page)
    
    // Check RTL is applied
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
    await expect(html).toHaveAttribute('lang', 'he')
    
    // Run accessibility checks for RTL
    await checkA11y(page)
  })

  test('Focus management in modals', async ({ page }) => {
    await page.goto('/')
    
    // Open a modal (assuming there's a modal trigger)
    const modalTrigger = page.getByRole('button', { name: /open modal/i })
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click()
      
      // Check focus is trapped in modal
      const modal = page.getByRole('dialog')
      await expect(modal).toBeVisible()
      
      // Tab through modal
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      
      // Check focus is within modal
      const isWithinModal = await focusedElement.evaluate((el, modalEl) => {
        return modalEl.contains(el)
      }, await modal.elementHandle())
      
      expect(isWithinModal).toBeTruthy()
    }
  })

  test('ARIA landmarks should be present', async ({ page }) => {
    await page.goto('/')
    
    // Check for main landmark
    const main = page.locator('main')
    await expect(main).toBeVisible()
    
    // Check for navigation landmark
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    
    // Check for header landmark
    const header = page.locator('header')
    await expect(header).toBeVisible()
    
    // Check for footer landmark
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})

test.describe('Screen Reader Compatibility', () => {
  test('Page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Check for h1
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    
    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    let previousLevel = 0
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName)
      const level = parseInt(tagName.substring(1))
      
      // Check that we don't skip levels
      if (previousLevel > 0) {
        expect(level).toBeLessThanOrEqual(previousLevel + 1)
      }
      previousLevel = level
    }
  })

  test('Interactive elements should have appropriate ARIA attributes', async ({ page }) => {
    await page.goto('/')
    
    // Check buttons with loading states
    const loadingButtons = page.locator('button[aria-busy="true"]')
    if (await loadingButtons.count() > 0) {
      await expect(loadingButtons.first()).toHaveAttribute('aria-busy', 'true')
    }
    
    // Check expanded/collapsed states
    const expandables = page.locator('[aria-expanded]')
    if (await expandables.count() > 0) {
      const expanded = await expandables.first().getAttribute('aria-expanded')
      expect(['true', 'false']).toContain(expanded)
    }
  })
})
