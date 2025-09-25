import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pagesToTest = ['/en/', '/en/daily-brief', '/en/archive'];

test.describe('Accessibility Tests (Axe)', () => {
  for (const pageUrl of pagesToTest) {
    test(`should not have any automatically detectable accessibility issues on page: ${pageUrl}`, async ({ page }) => {
      // Go to the page, setting the splash-seen cookie first
      await page.goto('/en/');
      await page.context().addCookies([{ name: 'splash-seen', value: 'true', url: page.url() }]);
      await page.goto(pageUrl);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});