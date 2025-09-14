import { test, expect, Page, BrowserContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(__dirname, '..', 'logs');

// Helper class for advanced monitoring
class PageMonitor {
  private page: Page;
  private logs: any[] = [];
  private networkRequests: any[] = [];
  private performanceMetrics: any = {};

  constructor(page: Page) {
    this.page = page;
    this.setupMonitoring();
  }

  private setupMonitoring() {
    // Console monitoring
    this.page.on('console', msg => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      };
      this.logs.push(logEntry);
      
      // Log to file immediately for real-time monitoring
      const logFile = path.join(LOGS_DIR, 'console', 'playwright-console.log');
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    });

    // Network monitoring
    this.page.on('request', request => {
      const requestData = {
        timestamp: new Date().toISOString(),
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        resourceType: request.resourceType()
      };
      this.networkRequests.push(requestData);
    });

    this.page.on('response', response => {
      const responseData = {
        timestamp: new Date().toISOString(),
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers()
      };
      
      // Log network errors
      if (response.status() >= 400) {
        const errorLog = path.join(LOGS_DIR, 'network', 'network-errors.log');
        fs.appendFileSync(errorLog, JSON.stringify(responseData) + '\n');
      }
    });

    // Error monitoring
    this.page.on('pageerror', error => {
      const errorEntry = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack
      };
      
      const errorFile = path.join(LOGS_DIR, 'console', 'page-errors.log');
      fs.appendFileSync(errorFile, JSON.stringify(errorEntry) + '\n');
    });
  }

  async collectPerformanceMetrics() {
    try {
      const metrics = await this.page.evaluate(() => {
        const performance = window.performance;
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
          largestContentfulPaint: paint.find(p => p.name === 'largest-contentful-paint')?.startTime,
          memory: (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
          } : null
        };
      });
      
      this.performanceMetrics = metrics;
      
      // Save performance metrics
      const perfFile = path.join(LOGS_DIR, 'performance', 'performance-metrics.log');
      fs.appendFileSync(perfFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        url: this.page.url(),
        metrics
      }) + '\n');
      
      return metrics;
    } catch (error) {
      console.warn('Could not collect performance metrics:', error);
      return null;
    }
  }

  async saveReport(testName: string) {
    const report = {
      testName,
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      logs: this.logs,
      networkRequests: this.networkRequests,
      performanceMetrics: this.performanceMetrics
    };
    
    const reportFile = path.join(LOGS_DIR, 'traces', `${testName}-report.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    return reportFile;
  }
}

test.describe('Lions of Zion - Monitoring Tests', () => {
  let monitor: PageMonitor;

  test.beforeEach(async ({ page }) => {
    monitor = new PageMonitor(page);
  });

  test('Homepage monitoring and performance', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check basic elements
    await expect(page).toHaveTitle(/Lions of Zion/);
    
    // Collect performance metrics
    const metrics = await monitor.collectPerformanceMetrics();
    
    // Performance assertions
    if (metrics) {
      expect(metrics.firstContentfulPaint).toBeLessThan(2500); // FCP < 2.5s
      expect(metrics.domContentLoaded).toBeLessThan(3000); // DCL < 3s
    }
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: path.join(LOGS_DIR, 'screenshots', 'homepage-monitoring.png'),
      fullPage: true 
    });
    
    // Save monitoring report
    await monitor.saveReport('homepage-monitoring');
  });

  test('Dashboard navigation with monitoring', async ({ page }) => {
    // Navigate to dashboard (assuming protected route)
    await page.goto('/dashboard');
    
    // Check for auth redirect or dashboard content
    await page.waitForLoadState('networkidle');
    
    // Monitor console for errors during navigation
    await page.waitForTimeout(2000); // Allow time for any async operations
    
    // Collect metrics
    await monitor.collectPerformanceMetrics();
    
    // Save report
    await monitor.saveReport('dashboard-navigation');
  });

  test('RTL Hebrew support monitoring', async ({ page }) => {
    // Set Hebrew locale if possible
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        get: () => 'he-IL'
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check RTL direction
    const direction = await page.evaluate(() => {
      return document.documentElement.dir || document.body.dir;
    });
    
    // Take screenshot for RTL verification
    await page.screenshot({
      path: path.join(LOGS_DIR, 'screenshots', 'rtl-monitoring.png'),
      fullPage: true
    });
    
    await monitor.saveReport('rtl-monitoring');
  });

  test('Error handling monitoring', async ({ page }) => {
    // Navigate to a potentially problematic page
    await page.goto('/nonexistent-page');
    
    // Wait for error handling
    await page.waitForLoadState('networkidle');
    
    // Check for 404 page or error handling
    const pageContent = await page.textContent('body');
    
    // This should capture 404 errors in network logs
    await page.waitForTimeout(1000);
    
    await monitor.saveReport('error-handling');
  });

  test('Performance under load simulation', async ({ page }) => {
    // Simulate multiple rapid navigations
    const pages = ['/', '/about', '/features', '/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('domcontentloaded');
      
      // Small delay to simulate user behavior
      await page.waitForTimeout(500);
    }
    
    // Final metrics collection
    await monitor.collectPerformanceMetrics();
    await monitor.saveReport('performance-under-load');
  });
});

// Global test hooks for comprehensive monitoring
test.afterEach(async ({ page }, testInfo) => {
  // Always take screenshot on failure
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshotPath = path.join(LOGS_DIR, 'screenshots', `failure-${testInfo.title.replace(/\s+/g, '-')}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }
  
  // Save page trace if available
  if (testInfo.status !== testInfo.expectedStatus) {
    const tracePath = path.join(LOGS_DIR, 'traces', `failure-${testInfo.title.replace(/\s+/g, '-')}.zip`);
    // Note: Trace saving is handled by Playwright config
  }
});