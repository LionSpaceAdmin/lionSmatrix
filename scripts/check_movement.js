const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const fs = require('fs');
(async () => {
  try {
    if (!fs.existsSync('validation-screenshots')) fs.mkdirSync('validation-screenshots');
    const possible = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    ];
    let exePath = null;
    for (const p of possible) {
      try { if (fs.existsSync(p)) { exePath = p; break; } } catch (e) {}
    }
    let args = [];
    if (!exePath) {
      exePath = await chromium.executablePath();
      args = chromium.args || [];
    }
    const browser = await puppeteer.launch({ executablePath: exePath, args: [...args, '--no-sandbox', '--disable-setuid-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));
    const a = 'validation-screenshots/home_a.png';
    const b = 'validation-screenshots/home_b.png';
    await page.screenshot({ path: a, fullPage: true });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: b, fullPage: true });
    console.log('wrote', a, b);
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('failed:', err);
    process.exit(2);
  }
})();
