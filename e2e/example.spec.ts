import { test, expect } from '@playwright/test'

test.describe('LionSpace Enterprise Platform', () => {
  test('should display the application properly', async ({ page }) => {
    await page.goto('/')

    // בדיקה שהדף נטען
    await expect(page).toHaveURL('/')
    
    // בדיקה שיש title 
    await expect(page).toHaveTitle(/Next.js Enterprise Boilerplate|LionSpace/)
    
    // בדיקה שאין שגיאות JavaScript בקונסול
    const logs: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        logs.push(msg.text())
      }
    })

    // ניווט בדף להפעלת JavaScript
    await page.waitForLoadState('networkidle')
    
    // בדיקה שאין שגיאות קריטיות
    const criticalErrors = logs.filter(log => 
      log.includes('Error') && !log.includes('favicon')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/')
    
    // בדיקת responsive design
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile
    await expect(page.locator('body')).toBeVisible()
    
    await page.setViewportSize({ width: 768, height: 1024 }) // Tablet  
    await expect(page.locator('body')).toBeVisible()
    
    await page.setViewportSize({ width: 1920, height: 1080 }) // Desktop
    await expect(page.locator('body')).toBeVisible()
  })
  
  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/')
    
    // בדיקת meta tags בסיסיים
    const title = await page.locator('title').textContent()
    expect(title).toBeTruthy()
    
    // בדיקת viewport meta tag
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toHaveAttribute('content', /width=device-width/)
  })
})
