import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Accessibility Tests', () => {
  test('landing page accessibility', async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    })
  })

  test('auth pages accessibility', async ({ page }) => {
    const authPages = [
      '/auth/sign-in',
      '/auth/join',
      '/auth/onboarding'
    ]

    for (const url of authPages) {
      await page.goto(url)
      await injectAxe(page)
      await checkA11y(page, null, {
        detailedReport: true
      })
    }
  })

  test('dashboard accessibility', async ({ page }) => {
    await page.goto('/dashboard')
    await injectAxe(page)
    await checkA11y(page, null, {
      detailedReport: true
    })
  })

  test('keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Tab through all interactive elements
    const interactiveElements = await page.$$('button, a, input, select, textarea, [tabindex="0"]')
    
    for (let i = 0; i < interactiveElements.length; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBeTruthy()
    }
  })

  test('focus indicators visible', async ({ page }) => {
    await page.goto('/')
    
    // Tab to first button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check focus ring is visible
    const focusedElement = page.locator(':focus')
    const boxShadow = await focusedElement.evaluate(el => 
      window.getComputedStyle(el).boxShadow
    )
    expect(boxShadow).not.toBe('none')
  })

  test('ARIA labels present', async ({ page }) => {
    await page.goto('/')
    
    // Check main navigation
    const nav = page.locator('nav')
    await expect(nav).toHaveAttribute('aria-label', /navigation/i)
    
    // Check buttons have accessible names
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const ariaLabel = await button.getAttribute('aria-label')
      const text = await button.textContent()
      expect(ariaLabel || text).toBeTruthy()
    }
  })

  test('color contrast compliance', async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)
    
    const results = await page.evaluate(async () => {
      // @ts-ignore
      return await axe.run(document, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
    })
    
    expect(results.violations.filter(v => v.id === 'color-contrast')).toHaveLength(0)
  })

  test('screen reader announcements', async ({ page }) => {
    await page.goto('/')
    
    // Check for live regions
    const liveRegions = page.locator('[aria-live]')
    await expect(liveRegions).toHaveCount.greaterThan(0)
    
    // Check for status messages
    const alerts = page.locator('[role="alert"]')
    const status = page.locator('[role="status"]')
    
    // Submit a form to trigger status
    await page.goto('/auth/sign-in')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    
    // Check announcement
    await expect(page.locator('[role="status"]')).toBeVisible()
  })

  test('RTL support for Hebrew/Arabic', async ({ page }) => {
    await page.goto('/')
    
    // Switch to Hebrew
    await page.click('[data-testid="locale-toggle"]')
    await page.click('text=עברית')
    
    // Check RTL
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
    await expect(html).toHaveAttribute('lang', 'he')
    
    // Check layout mirroring
    const header = page.locator('header')
    const flexDirection = await header.evaluate(el => 
      window.getComputedStyle(el).flexDirection
    )
    expect(flexDirection).toBe('row-reverse')
  })

  test('form accessibility', async ({ page }) => {
    await page.goto('/auth/sign-in')
    
    // Check labels
    const inputs = page.locator('input')
    const count = await inputs.count()
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      const label = page.locator(`label[for="${id}"]`)
      await expect(label).toBeVisible()
    }
    
    // Check error messages
    await page.click('button[type="submit"]')
    const errorMessages = page.locator('[role="alert"]')
    await expect(errorMessages).toHaveCount.greaterThan(0)
    
    // Check error association
    const inputWithError = page.locator('input[aria-invalid="true"]')
    const describedBy = await inputWithError.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
  })

  test('skip links present', async ({ page }) => {
    await page.goto('/')
    
    // Focus skip link
    await page.keyboard.press('Tab')
    
    const skipLink = page.locator('text=Skip to content')
    await expect(skipLink).toBeVisible()
    
    // Activate skip link
    await page.keyboard.press('Enter')
    
    // Check focus moved to main
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBe('MAIN')
  })
})

test.describe('Mobile Accessibility', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('mobile touch targets', async ({ page }) => {
    await page.goto('/')
    
    // Check button sizes
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const box = await button.boundingBox()
      
      // WCAG requires 44x44 minimum
      expect(box?.width).toBeGreaterThanOrEqual(44)
      expect(box?.height).toBeGreaterThanOrEqual(44)
    }
  })

  test('mobile menu accessibility', async ({ page }) => {
    await page.goto('/')
    
    const menuButton = page.locator('[data-testid="mobile-menu"]')
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    
    await menuButton.click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    
    // Check menu is visible
    const menu = page.locator('[data-testid="mobile-nav"]')
    await expect(menu).toBeVisible()
    
    // Check focus trap
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })
})
