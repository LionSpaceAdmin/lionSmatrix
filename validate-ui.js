const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function validateUI() {
  console.log('Starting LionSpace UI Validation...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Create screenshots directory
    const screenshotDir = path.join(__dirname, 'validation-screenshots');
    await fs.mkdir(screenshotDir, { recursive: true });

    // Test viewports
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];

    // Pages to test
    const pages = [
      { url: 'http://localhost:3001', name: 'homepage' },
      { url: 'http://localhost:3001/dashboard', name: 'dashboard' },
      { url: 'http://localhost:3001/intelligence', name: 'intelligence' },
    ];

    const results = [];

    for (const pageConfig of pages) {
      console.log(`\nTesting ${pageConfig.name}...`);
      
      for (const viewport of viewports) {
        console.log(`  - ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        // Set viewport
        await page.setViewport(viewport);
        
        // Navigate to page
        const response = await page.goto(pageConfig.url, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });
        
        // Wait for animations to settle
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check for console errors
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        // Take screenshot
        const screenshotPath = path.join(
          screenshotDir, 
          `${pageConfig.name}-${viewport.name}.png`
        );
        await page.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });
        
        // Check for critical elements
        const elements = {
          terminalBg: await page.$('.terminal-card') !== null,
          terminalButton: await page.$('.terminal-button') !== null,
          statusIndicator: await page.$('.status-online') !== null,
          heroTitle: await page.$('.hero-title') !== null,
        };
        
        // Check colors
        const colors = await page.evaluate(() => {
          const body = document.body;
          const styles = window.getComputedStyle(body);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            fontFamily: styles.fontFamily
          };
        });
        
        // Performance metrics
        const metrics = await page.metrics();
        
        results.push({
          page: pageConfig.name,
          viewport: viewport.name,
          status: response.status(),
          screenshot: screenshotPath,
          elements,
          colors,
          consoleErrors,
          performance: {
            jsHeapUsed: Math.round(metrics.JSHeapUsedSize / 1024 / 1024) + ' MB',
            domNodes: metrics.Nodes,
            layoutDuration: Math.round(metrics.LayoutDuration * 1000) + ' ms'
          }
        });
      }
    }
    
    // Generate validation report
    const report = {
      timestamp: new Date().toISOString(),
      results,
      summary: {
        totalTests: results.length,
        passed: results.filter(r => r.status === 200 && r.consoleErrors.length === 0).length,
        failed: results.filter(r => r.status !== 200 || r.consoleErrors.length > 0).length,
      }
    };
    
    // Save report
    await fs.writeFile(
      path.join(screenshotDir, 'validation-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    // Print summary
    console.log('\n=== VALIDATION SUMMARY ===');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    
    // Print details
    for (const result of results) {
      console.log(`\n${result.page} - ${result.viewport}:`);
      console.log(`  Status: ${result.status === 200 ? '✅' : '❌'} ${result.status}`);
      console.log(`  Console Errors: ${result.consoleErrors.length === 0 ? '✅ None' : '❌ ' + result.consoleErrors.length}`);
      console.log(`  Terminal Elements: ${Object.values(result.elements).every(v => v) ? '✅ All found' : '⚠️ Some missing'}`);
      console.log(`  Performance: DOM Nodes: ${result.performance.domNodes}, JS Heap: ${result.performance.jsHeapUsed}`);
      console.log(`  Screenshot: ${result.screenshot}`);
    }
    
    console.log('\n✅ Validation complete! Screenshots saved in validation-screenshots/');
    
  } catch (error) {
    console.error('Validation failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

validateUI().catch(console.error);