import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Homepage Smoke Test', () => {
  test('should load the homepage and have the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lions of Zion/);
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should display the main hero title', async ({ page }) => {
    await page.goto('/');
    const heroTitle = page.locator('h1', { hasText: /Truth is pattern/ });
    await expect(heroTitle).toBeVisible();
  });
});
