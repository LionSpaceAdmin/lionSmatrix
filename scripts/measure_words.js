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
    const logs = [];
    page.on('console', msg => {
      try { logs.push({ type: msg.type(), text: msg.text() }); } catch(e) {}
    });
    page.on('pageerror', err => {
      try { logs.push({ type: 'pageerror', text: err.message, stack: err.stack }); } catch(e) {}
    });
    await page.setViewport({ width: 1400, height: 900 });

    const ports = [3000, 3001];
    let connected = false;
    for (const port of ports) {
      try {
        await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle2', timeout: 45000 });
        connected = true;
        break;
      } catch (e) {
        // try next port
      }
    }
    if (!connected) throw new Error('Could not connect to localhost:3000 or :3001');

  // Wait a short while for client JS to mount and render dynamic words
  await new Promise(r => setTimeout(r, 2000));

    // Debug: capture container HTML and count of matrix-word elements
    const debugInfo = await page.evaluate(() => {
      const container = document.querySelector('.matrix-background');
      const count = document.querySelectorAll('.matrix-word').length;
      // Read __NEXT_DATA__ if present
      // eslint-disable-next-line no-undef
      const nextData = typeof window !== 'undefined' && (window).__NEXT_DATA__ ? (window).__NEXT_DATA__ : null;
      return {
        count,
        containerHTML: container ? container.innerHTML.slice(0, 4000) : null,
        nextData
      }
    });
    console.log('DEBUG container matrix-background count:', debugInfo.count);
    if (debugInfo.containerHTML) console.log('DEBUG container snippet:', debugInfo.containerHTML.slice(0, 500));
    try { fs.writeFileSync('validation-screenshots/page_after.html', await page.content()); } catch(e) {}

    // helper to snapshot words (capture whatever is present)
    const snapshot = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('.matrix-word'));
      return nodes.map((el, idx) => {
        const r = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          index: idx,
          text: (el.textContent || '').trim(),
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          opacity: parseFloat(style.opacity || '0'),
          transform: style.transform || ''
        };
      });
    });

  await new Promise(r => setTimeout(r, 800));

    const snapshot2 = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('.matrix-word'));
      return nodes.map((el, idx) => {
        const r = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          index: idx,
          text: (el.textContent || '').trim(),
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          opacity: parseFloat(style.opacity || '0'),
          transform: style.transform || ''
        };
      });
    });

    // combine
    const pairs = [];
    const length = Math.min(snapshot.length, snapshot2.length);
    let movedCount = 0;
    let totalDistance = 0;

    for (let i = 0; i < length; i++) {
      const a = snapshot[i];
      const b = snapshot2[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 0.5) movedCount++;
      totalDistance += dist;
      pairs.push({ index: i, text: a.text, before: a, after: b, dx, dy, dist });
    }

    const report = {
      timestamp: new Date().toISOString(),
      count_before: snapshot.length,
      count_after: snapshot2.length,
      measured_pairs: length,
      movedCount,
      averageDistance: length ? totalDistance / length : 0,
      pairs: pairs.slice(0, 200) // limit size
    };

    fs.writeFileSync('validation-screenshots/movement_report.json', JSON.stringify(report, null, 2));
  try { fs.writeFileSync('validation-screenshots/matrix_console.log', logs.map(l=>JSON.stringify(l)).join('\n')); } catch(e) {}
  try { fs.writeFileSync('validation-screenshots/page_after.html', await page.content()); } catch(e) {}
    console.log('WROTE validation-screenshots/movement_report.json');

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('failed:', err);
    process.exit(2);
  }
})();
