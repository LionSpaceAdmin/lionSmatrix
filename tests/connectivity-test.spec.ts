import { test, expect } from '@playwright/test';

/**
 * Lions of Zion - Connectivity Test
 * Simple test to check if we can launch browser and access external sites
 */

test.describe('Lions of Zion - Connectivity Tests', () => {
  test('browser launches successfully', async ({ page }) => {
    // This should work regardless of our app
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('can access example site and take screenshot', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toContainText('Example Domain');
    
    // Take a screenshot to verify visual testing works
    await page.screenshot({ path: 'test-results/example-site.png' });
  });

  test('test local network access attempt', async ({ page }) => {
    // Try to access localhost:3000 and see what happens
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    }).catch(error => {
      console.log('Connection failed as expected:', error.message);
      return null;
    });

    if (response) {
      console.log('SUCCESS: Connected to localhost:3000');
      console.log('Status:', response.status());
      console.log('URL:', response.url());
      
      // Take screenshot if connection works
      await page.screenshot({ path: 'test-results/localhost-success.png' });
      
      // Check if we can see any content
      const title = await page.title();
      console.log('Page title:', title);
      
      const bodyText = await page.locator('body').textContent();
      console.log('Body content preview:', bodyText?.substring(0, 200) + '...');
    } else {
      console.log('EXPECTED: Cannot connect to localhost:3000 - server not running');
    }
  });

  test('test mobile viewport capability', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://example.com');
    
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
    expect(viewport?.height).toBe(667);
    
    await page.screenshot({ path: 'test-results/mobile-viewport.png' });
  });

  test('test RTL support capability', async ({ page }) => {
    // Test Hebrew locale and RTL support
    await page.goto('https://example.com');
    
    // Add some RTL content to test
    await page.addStyleTag({
      content: `
        body::after {
          content: "בדיקת עברית - Hebrew Test";
          direction: rtl;
          display: block;
          font-size: 24px;
          margin: 20px;
          border: 2px solid blue;
          padding: 10px;
        }
      `
    });
    
    await page.screenshot({ path: 'test-results/rtl-test.png' });
  });

  test('performance measurement capability', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://example.com');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(10000); // 10 seconds should be plenty
    
    // Test network monitoring
    const requests: any[] = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });
    
    await page.reload();
    console.log(`Network requests captured: ${requests.length}`);
    expect(requests.length).toBeGreaterThan(0);
  });
});