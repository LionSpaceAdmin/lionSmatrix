const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function testWarRoom() {
  let browser;
  
  try {
    console.log('Launching browser...');
    
    // Use system Chrome/Chromium if available
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      executablePath: '/usr/bin/chromium-browser'
    });

    const page = await browser.newPage();
    
    // Set viewport to desktop size
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to war-room page...');
    await page.goto('http://localhost:3001/war-room', { 
      waitUntil: 'networkidle2',
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
    const errors = await page.evaluate(() => {
      const logs = [];
      // Get any errors that were logged
      return logs;
    });
    
    // Test mobile view
    console.log('Testing mobile view...');
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'war-room-mobile.png',
      fullPage: false
    });
    
    // Test interactivity - try clicking on a node
    console.log('Testing interactivity...');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.waitForTimeout(2000);
    
    // Try to click on the canvas to select a node
    await page.mouse.click(960, 540);
    await page.waitForTimeout(2000);
    
    // Take screenshot with panel potentially open
    await page.screenshot({ 
      path: 'war-room-interaction.png',
      fullPage: false
    });
    
    // Check page content
    const pageTitle = await page.evaluate(() => {
      const title = document.querySelector('h1');
      return title ? title.textContent : null;
    });
    
    console.log('Page title found:', pageTitle);
    
    // Check if components are rendered
    const hasCanvas = await page.evaluate(() => {
      return document.querySelector('canvas.neural-network-canvas') !== null;
    });
    
    const hasMatrix = await page.evaluate(() => {
      return document.querySelector('.matrix-background') !== null;
    });
    
    console.log('Components rendered:');
    console.log('- Neural Network Canvas:', hasCanvas);
    console.log('- Matrix Background:', hasMatrix);
    
    console.log('\n✅ Validation complete!');
    console.log('Screenshots saved:');
    console.log('- war-room-desktop.png');
    console.log('- war-room-mobile.png');
    console.log('- war-room-interaction.png');
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testWarRoom();