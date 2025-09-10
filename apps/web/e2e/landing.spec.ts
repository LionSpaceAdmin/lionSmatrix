import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display hero section with CTAs', async ({ page }) => {
    // Check hero content
    await expect(page.locator('h1')).toContainText('Lions of Zion')
    
    // Check primary CTAs
    const joinCTA = page.locator('text=Join the fight')
    const warMachineCTA = page.locator('text=Explore the War Machine')
    
    await expect(joinCTA).toBeVisible()
    await expect(warMachineCTA).toBeVisible()
  })

  test('should navigate to auth pages', async ({ page }) => {
    // Click Join CTA
    await page.click('text=Join the fight')
    await expect(page).toHaveURL('/auth/join')
    
    // Go back and test War Machine
    await page.goBack()
    await page.click('text=Explore the War Machine')
    await expect(page).toHaveURL('/dashboard/war-machine')
  })

  test('should display narrative cards', async ({ page }) => {
    const narrativeCards = page.locator('[data-testid="narrative-card"]')
    await expect(narrativeCards).toHaveCount(6)
  })

  test('should have working locale toggle', async ({ page }) => {
    const localeToggle = page.locator('[data-testid="locale-toggle"]')
    await expect(localeToggle).toBeVisible()
    
    // Switch to Hebrew
    await localeToggle.click()
    await page.click('text=עברית')
    
    // Check RTL
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
  })

  test('should have accessible navigation', async ({ page }) => {
    // Tab through navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile menu
    const mobileMenu = page.locator('[data-testid="mobile-menu"]')
    await expect(mobileMenu).toBeVisible()
  })
})
