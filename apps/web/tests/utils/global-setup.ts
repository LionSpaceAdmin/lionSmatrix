import { chromium, FullConfig } from "@playwright/test"
import { mkdir, writeFile } from "fs/promises"
import { resolve } from "path"

/**
 * Lions of Zion - Global Test Setup
 * Comprehensive browser monitoring and logging initialization
 */
async function globalSetup(config: FullConfig) {
  console.log("\n" + "=".repeat(80))
  console.log("🦁 LIONS OF ZION - GLOBAL TEST SETUP")
  console.log("=".repeat(80))

  // Create test results directory
  await mkdir("test-results", { recursive: true })
  await mkdir("test-results/screenshots", { recursive: true })
  await mkdir("test-results/videos", { recursive: true })
  await mkdir("test-results/traces", { recursive: true })

  console.log("📁 Created test results directories")

  // Initialize monitoring log
  const setupLog = `
Lions of Zion Test Suite - Setup Log
=====================================
Timestamp: ${new Date().toISOString()}
Configuration: ${JSON.stringify(
    config.projects.map((p) => p.name),
    null,
    2
  )}
Base URL: ${config.use?.baseURL || "Not specified"}
Workers: ${config.workers}
Retries: ${config.retries}

Browser Configurations:
${config.projects
  .map((project) => {
    const use = project.use
    return `- ${project.name}: 
  User Agent: ${use?.userAgent || "Default"}
  Viewport: ${use?.viewport ? `${use.viewport.width}x${use.viewport.height}` : "Default"}
  Launch Options: ${JSON.stringify(use?.launchOptions || {}, null, 4)}`
  })
  .join("\n")}

System Information:
Platform: ${process.platform}
Node Version: ${process.version}
PWD: ${process.cwd()}
=====================================
`

  await writeFile(resolve("test-results/setup.log"), setupLog)
  console.log("📋 Created setup log file")

  // Test browser availability and create baseline performance data
  console.log("🔍 Testing browser availability...")

  const browserTests = []

  // Test Chromium
  try {
    const browser = await chromium.launch({
      executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
    })
    const version = await browser.version()
    console.log(`✅ Chromium available: ${version}`)
    await browser.close()
    browserTests.push({ browser: "Chromium", status: "available", version })
  } catch (error) {
    console.log(`❌ Chromium not available: ${error}`)
    browserTests.push({ browser: "Chromium", status: "unavailable", error: error.toString() })
  }

  // Test Playwright's default Chromium
  try {
    const browser = await chromium.launch()
    const version = await browser.version()
    console.log(`✅ Playwright Chromium available: ${version}`)
    await browser.close()
    browserTests.push({ browser: "Playwright Chromium", status: "available", version })
  } catch (error) {
    console.log(`❌ Playwright Chromium not available: ${error}`)
    browserTests.push({ browser: "Playwright Chromium", status: "unavailable", error: error.toString() })
  }

  // Save browser test results
  await writeFile(resolve("test-results/browser-availability.json"), JSON.stringify(browserTests, null, 2))

  // Test base URL availability
  if (config.use?.baseURL) {
    console.log(`🌐 Testing base URL: ${config.use.baseURL}`)
    try {
      const browser = await chromium.launch()
      const page = await browser.newPage()

      // Enable request monitoring
      const requests: Array<{ url: string; status: number; timing: number }> = []

      page.on("response", async (response) => {
        requests.push({
          url: response.url(),
          status: response.status(),
          timing: Date.now(),
        })
      })

      const startTime = Date.now()
      await page.goto(config.use.baseURL, { waitUntil: "networkidle", timeout: 30000 })
      const loadTime = Date.now() - startTime

      console.log(`✅ Base URL accessible in ${loadTime}ms`)
      console.log(`📊 Network requests: ${requests.length}`)

      // Save baseline performance data
      const baselineData = {
        timestamp: new Date().toISOString(),
        baseURL: config.use.baseURL,
        loadTime,
        requests: requests.slice(0, 10), // First 10 requests
      }

      await writeFile(resolve("test-results/baseline-performance.json"), JSON.stringify(baselineData, null, 2))

      await browser.close()
    } catch (error) {
      console.log(`❌ Base URL test failed: ${error}`)
    }
  }

  // Environment check
  console.log("🔧 Environment check:")
  console.log(`   Node.js: ${process.version}`)
  console.log(`   Platform: ${process.platform}`)
  console.log(`   Architecture: ${process.arch}`)
  console.log(`   Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`)

  // Create monitoring configuration
  const monitoringConfig = {
    performanceThresholds: {
      lcp: 2500, // ms
      fcp: 1800, // ms
      ttfb: 600, // ms
      memoryUsage: 100, // MB
    },
    networkMonitoring: {
      logAllRequests: true,
      logFailedRequests: true,
      logSlowRequests: true,
      slowRequestThreshold: 2000, // ms
    },
    consoleMonitoring: {
      captureAll: true,
      highlightErrors: true,
      highlightWarnings: true,
    },
    realTimeMonitoring: {
      enabled: true,
      interval: 5000, // ms
    },
  }

  await writeFile(resolve("test-results/monitoring-config.json"), JSON.stringify(monitoringConfig, null, 2))

  console.log("⚙️  Created monitoring configuration")

  // Initialize performance baseline
  console.log("📊 Initializing performance baseline...")

  console.log("=".repeat(80))
  console.log("🚀 SETUP COMPLETE - READY FOR BATTLE")
  console.log("=".repeat(80))
  console.log()
}

export default globalSetup
