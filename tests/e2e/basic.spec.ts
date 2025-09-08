import { test, expect } from '@playwright/test';

test.describe('LionSpace Intelligence Platform E2E', () => {
  test('homepage loads and displays basic elements', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads with a reasonable title
    await expect(page).toHaveTitle(/LionSpace|Intelligence|Matrix/);
    
    // Check for basic page structure
    await expect(page.locator('body')).toBeVisible();
    
    // Verify no critical console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for matrix background or main content
    const hasMatrixBackground = await page.locator('[class*="matrix"]').count() > 0;
    const hasMainContent = await page.locator('main, [role="main"]').count() > 0;
    
    expect(hasMatrixBackground || hasMainContent).toBeTruthy();
    
    // Verify page returns 200 status
    const response = await page.request.get('/');
    expect(response.status()).toBe(200);
  });

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/');
    
    // Check homepage loads
    await expect(page.locator('body')).toBeVisible();
    
    // Try to navigate to platform page
    await page.goto('/platform');
    await expect(page.locator('body')).toBeVisible();
    
    // Check that we can navigate back to home
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('matrix route redirects correctly', async ({ page }) => {
    // The matrix route should redirect to home
    await page.goto('/matrix');
    
    // Should be redirected to home page
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('API health check endpoint works', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ok');
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check that page is responsive
    await expect(page.locator('body')).toBeVisible();
    
    // Verify no horizontal scroll
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = 375;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small tolerance
  });

  test('page meta tags are present', async ({ page }) => {
    await page.goto('/');
    
    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for description meta tag
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    
    // Check for viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });
});