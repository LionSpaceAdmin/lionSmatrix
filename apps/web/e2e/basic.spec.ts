import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display hero section with CTAs', async ({ page }) => {
    // Check hero title exists
    await expect(page.locator('h1')).toBeVisible()
    
    // Check primary CTA
    const primaryCTA = page.getByRole('button', { name: /join the fight/i })
    await expect(primaryCTA).toBeVisible()
    
    // Check secondary CTA
    const secondaryCTA = page.getByRole('button', { name: /explore.*war machine/i })
    await expect(secondaryCTA).toBeVisible()
  })

  test('should navigate to join page when clicking primary CTA', async ({ page }) => {
    const joinButton = page.getByRole('button', { name: /join the fight/i })
    await joinButton.click()
    await expect(page).toHaveURL(/.*\/auth\/join/)
  })

  test('should navigate to war machine when clicking secondary CTA', async ({ page }) => {
    const warMachineButton = page.getByRole('button', { name: /explore.*war machine/i })
    await warMachineButton.click()
    await expect(page).toHaveURL(/.*\/dashboard\/war-machine/)
  })

  test('should have working navigation links', async ({ page }) => {
    // Test navigation links
    const navLinks = [
      { name: /daily brief/i, url: /daily-brief/ },
      { name: /archive/i, url: /archive/ },
      { name: /about/i, url: /about/ },
      { name: /contact/i, url: /contact/ }
    ]

    for (const link of navLinks) {
      const navLink = page.getByRole('link', { name: link.name })
      await expect(navLink).toBeVisible()
      await navLink.click()
      await expect(page).toHaveURL(link.url)
      await page.goBack()
    }
  })

  test('should have locale switcher', async ({ page }) => {
    const localeSwitcher = page.getByRole('combobox', { name: /language/i })
    await expect(localeSwitcher).toBeVisible()
    
    // Test switching to Hebrew
    await localeSwitcher.selectOption('he')
    await expect(page).toHaveURL(/\/he/)
    
    // Check RTL is applied
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
  })

  test('should display narrative cards', async ({ page }) => {
    const narrativeCards = page.locator('[data-testid="narrative-card"]')
    await expect(narrativeCards).toHaveCount(3) // Expecting at least 3 cards
  })

  test('should have working skip to content link', async ({ page }) => {
    // Tab to reveal skip link
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: /skip to content/i })
    await expect(skipLink).toBeVisible()
    
    // Click and verify focus moved to main
    await skipLink.click()
    const main = page.locator('main')
    await expect(main).toBeFocused()
  })
})

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/')
    
    // Check mobile menu button exists
    const menuButton = page.getByRole('button', { name: /menu/i })
    await expect(menuButton).toBeVisible()
    
    // Open mobile menu
    await menuButton.click()
    
    // Check navigation items are visible
    const navItem = page.getByRole('link', { name: /daily brief/i })
    await expect(navItem).toBeVisible()
  })
})

test.describe('Dark Theme', () => {
  test('should have dark theme by default', async ({ page }) => {
    await page.goto('/')
    
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
    
    // Check background is dark
    const body = page.locator('body')
    const backgroundColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    
    // Parse RGB and check if it's dark
    const rgb = backgroundColor.match(/\d+/g)
    if (rgb) {
      const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3
      expect(brightness).toBeLessThan(50) // Dark color
    }
  })
})
