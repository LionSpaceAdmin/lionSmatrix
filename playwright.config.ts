import { defineConfig, devices } from "@playwright/test"

/**
 * Lions of Zion - Playwright Configuration
 * Military-grade testing configuration for information warfare defense platform
 * Enhanced with comprehensive browser monitoring and logging
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Enhanced reporting with custom HTML and JSON
  reporter: [
    ["html", { outputFolder: "test-results/html-report" }],
    ["json", { outputFile: "test-results/report.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["./tests/utils/custom-reporter.ts"],
  ],

  use: {
    // Base URL for tests - adjust based on your dev server
    baseURL: "http://localhost:3000",

    // Enhanced global test settings
    trace: "on", // Always collect traces for detailed debugging
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Hebrew/RTL support
    locale: "en-US",
    timezoneId: "Asia/Jerusalem",

    // Custom browser context setup for comprehensive monitoring
    contextOptions: {
      // Ignore HTTPS errors for local development
      ignoreHTTPSErrors: true,

      // Enhanced permissions
      permissions: ["geolocation", "notifications"],

      // Custom user agent for tracking
      userAgent: "Lions-of-Zion-Test-Agent/1.0 (Playwright)",
    },
  },

  projects: [
    {
      name: "chromium-monitoring",
      use: {
        ...devices["Desktop Chrome"],
        // Enhanced Chromium configuration with monitoring
        launchOptions: {
          executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
          // Enable comprehensive logging
          args: [
            "--enable-logging",
            "--log-level=0",
            "--enable-features=NetworkService,NetworkServiceLogging",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
            "--enable-devtools-experiments",
          ],
          // Custom logger for browser events
          logger: {
            isEnabled: () => true,
            log: (name: string, severity: string, message: string, args: any[]) => {
              const timestamp = new Date().toISOString()
              console.log(`[${timestamp}] [BROWSER-${severity}] ${name}: ${message}`, args)
            },
          },
        },
      },
    },

    {
      name: "chromium-headless-monitoring",
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
        // Enhanced headless mode with monitoring
        launchOptions: {
          args: [
            "--enable-logging",
            "--log-level=0",
            "--disable-gpu",
            "--enable-features=NetworkService,NetworkServiceLogging",
          ],
        },
      },
    },

    {
      name: "firefox-monitoring",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          firefoxUserPrefs: {
            // Enable detailed Firefox logging
            "devtools.console.stdout.enabled": true,
            "browser.dom.window.dump.enabled": true,
          },
        },
      },
    },

    {
      name: "webkit-monitoring",
      use: {
        ...devices["Desktop Safari"],
        launchOptions: {
          // WebKit specific monitoring options
          env: {
            WEBKIT_DISABLE_ACCELERATED_COMPOSITING: "1",
          },
        },
      },
    },

    // Mobile testing with enhanced monitoring
    {
      name: "Mobile Chrome Monitoring",
      use: {
        ...devices["Pixel 5"],
        launchOptions: {
          args: ["--enable-logging", "--log-level=0", "--enable-features=NetworkService"],
        },
      },
    },

    {
      name: "Mobile Safari Monitoring",
      use: { ...devices["iPhone 12"] },
    },

    // RTL testing for Hebrew support with monitoring
    {
      name: "chromium-rtl-monitoring",
      use: {
        ...devices["Desktop Chrome"],
        locale: "he-IL",
        launchOptions: {
          executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
          args: ["--force-device-scale-factor=1", "--enable-logging", "--log-level=0"],
        },
      },
    },
  ],

  // Web server configuration - disabled for now due to build issues
  // webServer: {
  //   command: "pnpm dev",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: true,
  //   timeout: 120 * 1000,
  // },

  // Enhanced global setup and teardown
  globalSetup: "./tests/utils/global-setup.ts",
  globalTeardown: "./tests/utils/global-teardown.ts",
})
