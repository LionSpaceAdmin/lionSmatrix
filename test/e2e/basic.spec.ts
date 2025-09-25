import { test, expect } from '@playwright/test';

test.describe('Basic Smoke Tests', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/en/');
    console.log(await page.content());
    await expect(page.getByRole('heading', { name: 'Truth is pattern. AI sees it.' })).toBeVisible();
  });
});