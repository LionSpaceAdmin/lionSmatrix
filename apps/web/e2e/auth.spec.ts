import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('complete sign-in flow', async ({ page }) => {
    await page.goto('/auth/sign-in')
    
    // Check page elements
    await expect(page.locator('h1')).toContainText('Sign In')
    
    // Fill email
    await page.fill('input[type="email"]', 'test@example.com')
    
    // Check provider buttons
    await expect(page.locator('text=Continue with Google')).toBeVisible()
    await expect(page.locator('text=Continue with X')).toBeVisible()
    
    // Submit form (mock)
    await page.click('button[type="submit"]')
    
    // Should show success message (mock)
    await expect(page.locator('text=Check your email')).toBeVisible()
  })

  test('join flow with value props', async ({ page }) => {
    await page.goto('/auth/join')
    
    // Check value propositions
    await expect(page.locator('h1')).toContainText('Join')
    await expect(page.locator('text=Free')).toBeVisible()
    
    // Navigate to onboarding
    await page.click('text=Join the fight')
    await expect(page).toHaveURL('/auth/onboarding')
  })

  test('onboarding wizard', async ({ page }) => {
    await page.goto('/auth/onboarding')
    
    // Step 1: Interests
    await expect(page.locator('text=Select Your Interests')).toBeVisible()
    await page.click('text=Fact-Checking')
    await page.click('text=Continue')
    
    // Step 2: Experience
    await expect(page.locator('text=Experience Level')).toBeVisible()
    await page.click('text=Intermediate')
    await page.click('text=Continue')
    
    // Step 3: Notifications
    await expect(page.locator('text=Stay Updated')).toBeVisible()
    await page.click('text=Complete Setup')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('protected route redirect', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard')
    
    // Should redirect to sign-in
    await expect(page).toHaveURL('/auth/sign-in')
  })

  test('password reset flow', async ({ page }) => {
    await page.goto('/auth/sign-in')
    
    // Click forgot password
    await page.click('text=Forgot password?')
    await expect(page).toHaveURL('/auth/reset-password')
    
    // Fill reset form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.click('text=Send Reset Link')
    
    // Check success message
    await expect(page.locator('text=Check your email')).toBeVisible()
  })
})
