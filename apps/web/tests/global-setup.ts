import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(__dirname, '..', 'logs');

async function globalSetup(config: FullConfig) {
  console.log('🛡️  Lions of Zion - Setting up global test environment...');
  
  // Ensure logs directory exists
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
  
  // Create subdirectories for different log types
  const logDirs = ['crashes', 'network', 'console', 'performance', 'screenshots', 'traces'];
  logDirs.forEach(dir => {
    const dirPath = path.join(LOGS_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
  
  // Setup browser with enhanced logging
  const browser = await chromium.launch({
    executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
    args: [
      '--enable-logging=stderr',
      '--log-level=0',
      '--v=1',
      '--enable-precise-memory-info',
      '--log-net-log=' + path.join(LOGS_DIR, 'global-net-log.json'),
      '--crash-dumps-dir=' + path.join(LOGS_DIR, 'crashes'),
    ],
    headless: false,
  });
  
  // Test basic connectivity
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3000');
    console.log('✅ Basic connectivity test passed');
  } catch (error) {
    console.error('❌ Basic connectivity test failed:', error);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
  
  console.log('🎯 Global setup completed successfully');
}

export default globalSetup;