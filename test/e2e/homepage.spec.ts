import { test, expect } from '@playwright/test';

test('homepage has a visible main heading', async ({ page }) => {
  await page.goto('/');

  // Check that the main heading is visible
  const mainHeading = page.getByRole('heading', { level: 1 });
  await expect(mainHeading).toBeVisible();
});
