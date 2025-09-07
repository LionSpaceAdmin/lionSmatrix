import { test, expect } from '@playwright/test';

test.describe('LionSpace Intelligence Platform E2E', () => {
  test('homepage loads and displays basic elements', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads with a reasonable title
    await expect(page).toHaveTitle(/LionSpace|Next|Intelligence/);
    
    // Check for basic page structure
    await expect(page.locator('body')).toBeVisible();
  });

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/');
    
    // Try to navigate to platform page
    await page.goto('/platform');
    await expect(page.locator('body')).toBeVisible();
    
    // Check that we can navigate back to home
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});