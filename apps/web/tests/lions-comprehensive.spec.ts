import { test, expect } from '@playwright/test';

/**
 * Lions of Zion - Comprehensive Test Suite
 * Full application testing with all browsers and viewports
 */

test.describe('Lions of Zion - Comprehensive Application Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Enable detailed request/response logging
    page.on('request', request => {
      console.log('REQUEST:', request.method(), request.url());
    });
    
    page.on('response', response => {
      if (!response.ok()) {
        console.log('FAILED RESPONSE:', response.status(), response.url());
      }
    });
    
    // Enable console logging
    page.on('console', msg => {
      console.log('BROWSER CONSOLE:', msg.type(), msg.text());
    });
  });

  test('homepage accessibility and navigation', async ({ page }) => {
    console.log('=== Testing Homepage Access ===');
    
    // Go to root and expect redirect to /home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to /home
    expect(page.url()).toMatch(/\/home$/);
    
    console.log('✅ Successfully redirected to /home');
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/homepage-full.png', 
      fullPage: true 
    });
    
    // Check page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Look for any main heading
    const headings = await page.locator('h1, h2, h3').all();
    console.log(`Found ${headings.length} headings`);
    
    for (let i = 0; i < Math.min(headings.length, 5); i++) {
      const text = await headings[i].textContent();
      console.log(`Heading ${i + 1}: "${text}"`);
    }
    
    // Check if page has navigation
    const navElements = await page.locator('nav, [role="navigation"]').count();
    console.log(`Found ${navElements} navigation elements`);
    
    // Check for links
    const links = await page.locator('a').count();
    console.log(`Found ${links} links on page`);
    
    // Take screenshot of viewport
    await page.screenshot({ path: 'test-results/homepage-viewport.png' });
  });

  test('responsive design - multiple viewports', async ({ page }) => {
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'laptop', width: 1366, height: 768 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      console.log(`=== Testing ${viewport.name} viewport (${viewport.width}x${viewport.height}) ===`);
      
      await page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      await page.goto('/home');
      await page.waitForLoadState('networkidle');
      
      // Take screenshot for this viewport
      await page.screenshot({ 
        path: `test-results/responsive-${viewport.name}.png`,
        fullPage: true
      });
      
      // Check that content is visible
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length).toBeGreaterThan(100);
      
      console.log(`✅ ${viewport.name} viewport renders content`);
    }
  });

  test('performance measurement', async ({ page }) => {
    console.log('=== Performance Testing ===');
    
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/home');
    await page.waitForLoadState('domcontentloaded');
    const domLoadTime = Date.now() - startTime;
    
    await page.waitForLoadState('networkidle');
    const fullLoadTime = Date.now() - startTime;
    
    console.log(`DOM loaded in: ${domLoadTime}ms`);
    console.log(`Full page loaded in: ${fullLoadTime}ms`);
    
    // Performance should be reasonable
    expect(fullLoadTime).toBeLessThan(15000); // 15 seconds max
    
    // Check for JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('JS ERROR:', error.message);
    });
    
    // Wait a bit more to catch any delayed errors
    await page.waitForTimeout(2000);
    
    console.log(`JavaScript errors found: ${errors.length}`);
  });

  test('navigation and routing', async ({ page }) => {
    console.log('=== Navigation Testing ===');
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Find all navigation links
    const navLinks = await page.locator('nav a, [role="navigation"] a').all();
    console.log(`Found ${navLinks.length} navigation links`);
    
    // Test first few navigation links
    for (let i = 0; i < Math.min(navLinks.length, 3); i++) {
      const link = navLinks[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      
      if (href && href.startsWith('/')) {
        console.log(`Testing navigation to: ${href} (${text})`);
        
        try {
          await link.click();
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          
          const newUrl = page.url();
          console.log(`✅ Successfully navigated to: ${newUrl}`);
          
          // Take screenshot of this page
          await page.screenshot({ 
            path: `test-results/nav-page-${i}.png` 
          });
          
          // Go back to home for next test
          await page.goto('/home');
          await page.waitForLoadState('networkidle');
          
        } catch (error) {
          console.log(`⚠️  Navigation failed for ${href}: ${error.message}`);
        }
      }
    }
  });

  test('hebrew/rtl support', async ({ page }) => {
    console.log('=== Hebrew/RTL Testing ===');
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Look for language selector
    const langSelectors = await page.locator('[data-testid*="lang"], [class*="lang"], button:has-text("🇺🇸"), button:has-text("🇮🇱")').all();
    
    if (langSelectors.length > 0) {
      console.log(`Found ${langSelectors.length} language selectors`);
      
      // Try to switch to Hebrew
      for (const selector of langSelectors) {
        try {
          await selector.click();
          await page.waitForTimeout(1000);
          
          // Look for Hebrew option
          const hebrewOptions = await page.locator('text=/עברית|Hebrew|🇮🇱/').all();
          if (hebrewOptions.length > 0) {
            await hebrewOptions[0].click();
            await page.waitForLoadState('networkidle');
            
            // Check if RTL is applied
            const htmlDir = await page.locator('html').getAttribute('dir');
            const bodyDir = await page.locator('body').getAttribute('dir');
            
            console.log(`HTML dir: ${htmlDir}, Body dir: ${bodyDir}`);
            
            // Take screenshot in Hebrew mode
            await page.screenshot({ 
              path: 'test-results/hebrew-rtl.png',
              fullPage: true
            });
            
            break;
          }
        } catch (error) {
          console.log(`Language switch attempt failed: ${error.message}`);
        }
      }
    } else {
      console.log('No language selectors found - testing RTL manually');
      
      // Add manual RTL test
      await page.addStyleTag({
        content: `
          body::after {
            content: "בדיקה בעברית - Lions of Zion אריות ציון";
            direction: rtl;
            display: block;
            font-size: 20px;
            margin: 20px;
            padding: 20px;
            background: yellow;
            border: 2px solid red;
          }
        `
      });
      
      await page.screenshot({ 
        path: 'test-results/manual-rtl-test.png' 
      });
    }
  });

  test('accessibility basics', async ({ page }) => {
    console.log('=== Accessibility Testing ===');
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation
    console.log('Testing keyboard navigation...');
    await page.keyboard.press('Tab');
    
    // Check for skip links
    const skipLinks = await page.locator('a:has-text("Skip"), [class*="skip"]').count();
    console.log(`Skip links found: ${skipLinks}`);
    
    // Check for alt texts on images
    const images = await page.locator('img').all();
    let imagesWithoutAlt = 0;
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (!alt) {
        imagesWithoutAlt++;
      }
    }
    
    console.log(`Images without alt text: ${imagesWithoutAlt}/${images.length}`);
    
    // Check for heading structure
    const h1Count = await page.locator('h1').count();
    console.log(`H1 headings: ${h1Count}`);
    
    // Check for form labels
    const inputs = await page.locator('input, textarea, select').all();
    let inputsWithoutLabels = 0;
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      
      if (id) {
        const labelForInput = await page.locator(`label[for="${id}"]`).count();
        if (labelForInput === 0 && !ariaLabel) {
          inputsWithoutLabels++;
        }
      } else if (!ariaLabel) {
        inputsWithoutLabels++;
      }
    }
    
    console.log(`Form inputs without labels: ${inputsWithoutLabels}/${inputs.length}`);
    
    // Take screenshot with focus indicators
    await page.screenshot({ 
      path: 'test-results/accessibility-state.png' 
    });
  });

  test('cross-browser consistency', async ({ browserName, page }) => {
    console.log(`=== Cross-Browser Testing (${browserName}) ===`);
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Take browser-specific screenshot
    await page.screenshot({ 
      path: `test-results/cross-browser-${browserName}.png`,
      fullPage: true
    });
    
    // Check basic functionality works in all browsers
    const title = await page.title();
    const bodyText = await page.locator('body').textContent();
    
    console.log(`${browserName} - Title: ${title}`);
    console.log(`${browserName} - Content length: ${bodyText?.length || 0}`);
    
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('error handling and resilience', async ({ page }) => {
    console.log('=== Error Handling Testing ===');
    
    // Test 404 page
    const response = await page.goto('/nonexistent-page');
    console.log(`404 page status: ${response?.status()}`);
    
    await page.screenshot({ path: 'test-results/404-page.png' });
    
    // Try malformed URLs
    const malformedUrls = [
      '/admin/../../../etc/passwd',
      '/api/malicious-endpoint',
      '/search?q=<script>alert("xss")</script>'
    ];
    
    for (const url of malformedUrls) {
      try {
        console.log(`Testing malformed URL: ${url}`);
        await page.goto(url);
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        
        const currentUrl = page.url();
        console.log(`Result URL: ${currentUrl}`);
        
      } catch (error) {
        console.log(`Expected error for ${url}: ${error.message}`);
      }
    }
    
    // Return to home
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
  });
});