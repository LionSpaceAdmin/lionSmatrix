import { test, expect } from '@playwright/test';

test.describe('Visual Debug - Lions of Zion', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Homepage visual inspection', async ({ page }) => {
    console.log('🔍 Testing Homepage...');
    
    try {
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
      
      // Wait for potential animations to load
      await page.waitForTimeout(2000);
      
      // Take full page screenshot
      await page.screenshot({ 
        path: 'homepage-full.png', 
        fullPage: true 
      });
      
      // Check if matrix/graph elements exist
      const matrixElements = await page.locator('[class*="matrix"], [class*="graph"], [class*="network"], [id*="matrix"], canvas, svg').count();
      console.log(`Found ${matrixElements} potential matrix/graph elements`);
      
      // Check for broken images
      const images = await page.locator('img').all();
      for (const img of images) {
        const src = await img.getAttribute('src');
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        if (naturalWidth === 0 && src) {
          console.log(`❌ Broken image: ${src}`);
        }
      }
      
      // Check for console errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
    } catch (error) {
      console.log(`❌ Homepage error: ${error}`);
      await page.screenshot({ path: 'homepage-error.png' });
    }
  });

  test('Dashboard visual inspection', async ({ page }) => {
    console.log('🔍 Testing Dashboard...');
    
    try {
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: 'dashboard-full.png', 
        fullPage: true 
      });
      
      // Look for dashboard-specific elements
      const dashboardElements = await page.locator('[class*="dashboard"], [class*="chart"], [class*="metric"], [class*="analytics"]').count();
      console.log(`Found ${dashboardElements} dashboard elements`);
      
    } catch (error) {
      console.log(`❌ Dashboard error: ${error}`);
      await page.screenshot({ path: 'dashboard-error.png' });
    }
  });

  test('Matrix/Graph elements inspection', async ({ page }) => {
    console.log('🔍 Looking for Matrix elements...');
    
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Look for various matrix/animation selectors
    const selectors = [
      'canvas',
      'svg',
      '[class*="matrix"]',
      '[class*="graph"]',
      '[class*="network"]',
      '[class*="animation"]',
      '[class*="particles"]',
      '[class*="background"]',
      '[id*="matrix"]',
      '[id*="background"]'
    ];
    
    for (const selector of selectors) {
      const elements = await page.locator(selector).all();
      if (elements.length > 0) {
        console.log(`✅ Found ${elements.length} elements matching: ${selector}`);
        
        // Screenshot each element
        for (let i = 0; i < elements.length; i++) {
          try {
            await elements[i].screenshot({ path: `matrix-element-${selector.replace(/[^\w]/g, '')}-${i}.png` });
          } catch (e) {
            console.log(`Could not screenshot ${selector}[${i}]`);
          }
        }
      }
    }
  });

  test('Layout inspection', async ({ page }) => {
    console.log('🔍 Testing Layout integrity...');
    
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check for layout issues
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        display: computed.display,
        position: computed.position,
        width: computed.width,
        height: computed.height,
        overflow: computed.overflow,
        backgroundColor: computed.backgroundColor
      };
    });
    
    console.log('Body styles:', bodyStyles);
    
    // Check if elements are properly positioned
    const elements = await page.locator('header, nav, main, footer, [class*="container"], [class*="wrapper"]').all();
    
    for (const el of elements) {
      try {
        const box = await el.boundingBox();
        const tagName = await el.evaluate(node => node.tagName);
        const className = await el.getAttribute('class');
        
        if (box) {
          console.log(`${tagName}.${className}: x=${box.x}, y=${box.y}, w=${box.width}, h=${box.height}`);
        } else {
          console.log(`❌ ${tagName}.${className}: No bounding box (possibly hidden)`);
        }
      } catch (e) {
        console.log(`Error checking element:`, e);
      }
    }
  });

  test('CSS Loading inspection', async ({ page }) => {
    console.log('🔍 Testing CSS Loading...');
    
    // Capture network requests
    const cssRequests: string[] = [];
    const failedRequests: string[] = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.css') || url.includes('stylesheet')) {
        cssRequests.push(url);
        if (!response.ok()) {
          failedRequests.push(`${url} - ${response.status()}`);
        }
      }
    });
    
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    console.log('CSS requests:', cssRequests);
    console.log('Failed CSS requests:', failedRequests);
    
    // Check if Tailwind is loaded
    const hasTailwind = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.className = 'bg-red-500';
      document.body.appendChild(testEl);
      const bgColor = window.getComputedStyle(testEl).backgroundColor;
      document.body.removeChild(testEl);
      return bgColor === 'rgb(239, 68, 68)' || bgColor.includes('239, 68, 68');
    });
    
    console.log('Tailwind loaded:', hasTailwind);
  });
});