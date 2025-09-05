const { chromium } = require('playwright');

async function testPanelInteraction() {
  let browser;
  
  try {
    console.log('Launching browser for panel interaction test...');
    
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
    
    // Wait for the page to fully load and animations to settle
    await page.waitForTimeout(4000);
    
    console.log('Testing node interactions...');
    
    // Find and click on visible nodes (they should have the neural-network-canvas class)
    const canvas = await page.locator('canvas.neural-network-canvas');
    
    if (await canvas.count() > 0) {
      console.log('Canvas found, attempting to click on nodes...');
      
      // Try clicking on different areas where nodes might be
      const positions = [
        { x: 400, y: 300 },  // Left side
        { x: 960, y: 300 },  // Center top
        { x: 1500, y: 400 }, // Right side
        { x: 700, y: 600 },  // Bottom left
        { x: 1200, y: 600 }  // Bottom right
      ];
      
      for (let i = 0; i < positions.length; i++) {
        console.log(`Clicking position ${i + 1}: (${positions[i].x}, ${positions[i].y})`);
        
        await page.mouse.click(positions[i].x, positions[i].y);
        await page.waitForTimeout(2000);
        
        // Check if panel opened
        const panelExists = await page.locator('text=INTELLIGENCE PROFILE').count() > 0;
        
        if (panelExists) {
          console.log('✅ Intelligence panel opened!');
          
          // Take screenshot with panel open
          await page.screenshot({ 
            path: `panel-open-${i + 1}.png`,
            fullPage: false
          });
          
          // Check panel content
          const actorName = await page.locator('h3.text-xl').first().textContent().catch(() => null);
          const riskLevel = await page.locator('text=RISK LEVEL').locator('..').textContent().catch(() => null);
          
          console.log('Actor displayed:', actorName);
          console.log('Risk info:', riskLevel);
          
          // Close panel
          const closeButton = await page.locator('button:has(svg)').first();
          if (await closeButton.count() > 0) {
            await closeButton.click();
            console.log('Panel closed');
            await page.waitForTimeout(1000);
          }
        }
      }
    }
    
    // Test hover effects
    console.log('\nTesting hover effects...');
    await page.mouse.move(960, 540);
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'hover-effect.png',
      fullPage: false
    });
    
    // Final full screenshot
    await page.screenshot({ 
      path: 'final-state.png',
      fullPage: false
    });
    
    console.log('\n✅ Interaction test complete!');
    
    return {
      success: true,
      message: 'All interaction tests completed'
    };
    
  } catch (error) {
    console.error('❌ Interaction test failed:', error);
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

testPanelInteraction().then(result => {
  console.log('\n📊 Test Results:', result);
  process.exit(result.success ? 0 : 1);
});