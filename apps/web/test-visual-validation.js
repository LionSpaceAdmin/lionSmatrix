const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Collect console messages
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('Download the React DevTools')) {
      consoleLogs.push({
        type: msg.type(),
        text: text
      });
    }
  });
  
  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  console.log('Navigating to http://localhost:3001/war-room...');
  
  await page.goto('http://localhost:3001/war-room', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  // Wait for potential dynamic content
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Check visual rendering
  const diagnostics = await page.evaluate(() => {
    const results = {};
    
    // Check if dark mode is applied
    results.hasDarkClass = document.documentElement.classList.contains('dark');
    
    // Check body styles
    const bodyStyles = window.getComputedStyle(document.body);
    results.bodyBackground = bodyStyles.backgroundColor;
    results.bodyColor = bodyStyles.color;
    
    // Check for components
    results.hasCanvas = document.querySelector('canvas') !== null;
    results.canvasCount = document.querySelectorAll('canvas').length;
    
    // Check main container
    const mainDiv = document.querySelector('.bg-black');
    if (mainDiv) {
      const mainStyles = window.getComputedStyle(mainDiv);
      results.mainDivBackground = mainStyles.backgroundColor;
    }
    
    // Check if title is visible
    const title = document.querySelector('h1');
    results.pageTitle = title ? title.textContent : 'No title';
    if (title) {
      const titleStyles = window.getComputedStyle(title);
      results.titleColor = titleStyles.color;
    }
    
    // Check for Matrix background
    const matrixDiv = document.querySelector('.matrix-background');
    results.hasMatrixBackground = matrixDiv !== null;
    if (matrixDiv) {
      results.matrixChildren = matrixDiv.children.length;
    }
    
    // Check for Neural Network canvas
    const neuralCanvas = document.querySelector('.neural-network-canvas');
    results.hasNeuralCanvas = neuralCanvas !== null;
    
    return results;
  });
  
  console.log('\n=== VISUAL DIAGNOSTICS ===');
  console.log('Dark mode applied:', diagnostics.hasDarkClass ? '✅' : '❌');
  console.log('Body background:', diagnostics.bodyBackground);
  console.log('Body text color:', diagnostics.bodyColor);
  console.log('Main div background:', diagnostics.mainDivBackground || 'N/A');
  console.log('Page title:', diagnostics.pageTitle);
  console.log('Title color:', diagnostics.titleColor || 'N/A');
  console.log('Has canvas:', diagnostics.hasCanvas ? '✅' : '❌');
  console.log('Canvas count:', diagnostics.canvasCount);
  console.log('Has Matrix background:', diagnostics.hasMatrixBackground ? '✅' : '❌');
  console.log('Matrix children:', diagnostics.matrixChildren || 0);
  console.log('Has Neural canvas:', diagnostics.hasNeuralCanvas ? '✅' : '❌');
  
  console.log('\n=== CONSOLE LOGS ===');
  if (consoleLogs.length > 0) {
    consoleLogs.forEach(log => {
      console.log(`[${log.type.toUpperCase()}] ${log.text}`);
    });
  } else {
    console.log('No relevant console logs');
  }
  
  console.log('\n=== PAGE ERRORS ===');
  if (pageErrors.length > 0) {
    pageErrors.forEach(err => console.log('ERROR:', err));
  } else {
    console.log('No page errors ✅');
  }
  
  // Take screenshots
  await page.screenshot({ path: 'war-room-fixed-desktop.png', fullPage: false });
  
  // Test mobile
  await page.setViewport({ width: 375, height: 667 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: 'war-room-fixed-mobile.png', fullPage: false });
  
  // Test tablet
  await page.setViewport({ width: 768, height: 1024 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: 'war-room-fixed-tablet.png', fullPage: false });
  
  // Test interactivity
  await page.setViewport({ width: 1920, height: 1080 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.mouse.click(960, 540);
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.screenshot({ path: 'war-room-fixed-interaction.png', fullPage: false });
  
  console.log('\n✅ Screenshots saved:');
  console.log('- war-room-fixed-desktop.png');
  console.log('- war-room-fixed-mobile.png');
  console.log('- war-room-fixed-tablet.png');
  console.log('- war-room-fixed-interaction.png');
  
  await browser.close();
})();