const { chromium } = require('playwright');

async function testWarRoom() {
  let browser;
  
  try {
    console.log('Launching browser...');
    
    browser = await chromium.launch({
      headless: true
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    console.log('Navigating to war-room page...');
    await page.goto('http://localhost:3001/war-room', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for the page to fully load
    await page.waitForTimeout(3000);
    
    // Take desktop screenshot
    console.log('Taking desktop screenshot...');
    await page.screenshot({ 
      path: 'war-room-desktop.png',
      fullPage: false
    });
    
    // Check for console errors
    console.log('Checking for console errors...');
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
    
    // Test mobile view
    console.log('Testing mobile view...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'war-room-mobile.png',
      fullPage: false
    });
    
    // Test interactivity - try clicking on a node
    console.log('Testing interactivity...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(2000);
    
    // Try to click on the canvas area where nodes might be
    await page.mouse.click(960, 540);
    await page.waitForTimeout(2000);
    
    // Take screenshot with panel potentially open
    await page.screenshot({ 
      path: 'war-room-interaction.png',
      fullPage: false
    });
    
    // Check page content
    const pageTitle = await page.textContent('h1');
    console.log('Page title found:', pageTitle);
    
    // Check if components are rendered
    const hasCanvas = await page.locator('canvas.neural-network-canvas').count() > 0;
    const hasMatrix = await page.locator('.matrix-background').count() > 0;
    
    console.log('Components rendered:');
    console.log('- Neural Network Canvas:', hasCanvas);
    console.log('- Matrix Background:', hasMatrix);
    
    // Check for any visible errors
    const errorElements = await page.locator('text=/error|failed|exception/i').count();
    if (errorElements > 0) {
      console.warn('⚠️  Found error text on page');
    }
    
    // Test tablet view
    console.log('Testing tablet view...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'war-room-tablet.png',
      fullPage: false
    });
    
    console.log('\n✅ Validation complete!');
    console.log('Screenshots saved:');
    console.log('- war-room-desktop.png (1920x1080)');
    console.log('- war-room-mobile.png (375x667)');
    console.log('- war-room-tablet.png (768x1024)');
    console.log('- war-room-interaction.png (with interaction)');
    
    // Return validation results
    return {
      success: true,
      hasCanvas,
      hasMatrix,
      pageTitle,
      errorCount: errorElements
    };
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testWarRoom().then(result => {
  console.log('\n📊 Validation Results:', result);
  process.exit(result.success ? 0 : 1);
});