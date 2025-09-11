import { test, expect } from '@playwright/test';

test('Simple page test', async ({ page }) => {
  try {
    await page.goto('http://localhost:3000/test', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-page-working.png', fullPage: true });
    
    // Check if basic content is visible
    const heading = await page.textContent('h1');
    console.log('Heading found:', heading);
    
  } catch (error) {
    console.log('Error accessing test page:', error);
    await page.screenshot({ path: 'test-page-error.png' });
  }
});

test('Homepage inspection detailed', async ({ page }) => {
  console.log('🔍 Attempting to access homepage...');
  
  try {
    await page.goto('http://localhost:3000/', { timeout: 10000 });
    await page.screenshot({ path: 'homepage-detailed.png', fullPage: true });
    
    // Check what's actually rendered
    const bodyContent = await page.textContent('body');
    console.log('Body content:', bodyContent?.substring(0, 200));
    
  } catch (error) {
    console.log('❌ Homepage failed:', error);
    await page.screenshot({ path: 'homepage-failed.png' });
  }
});