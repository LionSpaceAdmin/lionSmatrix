const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const fs = require('fs');
(async () => {
  try {
    if (!fs.existsSync('validation-screenshots')) fs.mkdirSync('validation-screenshots');
    // Prefer a local Chrome/Chromium install on macOS if available
    const possible = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    ];
    let exePath = null;
    for (const p of possible) {
      try {
        if (fs.existsSync(p)) { exePath = p; break; }
      } catch (e) {}
    }
    let args = [];
    if (!exePath) {
      exePath = await chromium.executablePath();
      args = chromium.args || [];
    }
    const browser = await puppeteer.launch({
      executablePath: exePath,
      args: [...args, '--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    console.log('navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  // small delay to allow animations to start
  await new Promise(r => setTimeout(r, 1500));
    const outPath = 'validation-screenshots/homepage.png';
    await page.screenshot({ path: outPath, fullPage: true });
    console.log('screenshot saved to', outPath);
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('screenshot failed:', err);
    process.exit(2);
  }
})();
