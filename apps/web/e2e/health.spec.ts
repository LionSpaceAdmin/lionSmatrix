import { test, expect } from '@playwright/test'

test.describe('Health Check API', () => {
  test('should return healthy status', async ({ page }) => {
    // בדיקת API health endpoint
    const response = await page.request.get('/api/health')
    expect(response.ok()).toBeTruthy()
    
    const health = await response.json()
    expect(health.status).toMatch(/operational|degraded/)
    expect(health.service).toContain('LionSpace')
    expect(health.timestamp).toBeTruthy()
    expect(health.checks).toBeTruthy()
  })

  test('should load home page', async ({ page }) => {
    await page.goto('/')
    
    // בדיקה שהדף נטען
    await expect(page).toHaveTitle(/LionSpace|Next/)
    
    // בדיקה שיש תוכן בדף
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})