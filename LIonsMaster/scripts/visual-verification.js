#!/usr/bin/env node
// DEPRECATED FILE
// Real implementation: scripts/visual-verification.mjs
console.warn('[DEPRECATED] Redirecting to scripts/visual-verification.mjs')
process.exit(0)
#!/usr/bin/env node
// DEPRECATED STUB
// The real implementation moved to: scripts/visual-verification.mjs
// This stub remains only to avoid breaking external references.
console.warn('[DEPRECATED] Use scripts/visual-verification.mjs instead of scripts/visual-verification.js')
process.exit(0)

// Logging utilities
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}➤${colors.reset} ${msg}`),
}

/**
 * Check if dev server is running
 * The server should ALWAYS be running on port 3000 in our dev environment
 */
function isDevServerRunning() {
  try {
    execSync("curl -s http://localhost:3000 > /dev/null 2>&1")
    return true
  } catch {
    return false
  }
}

/**
 * Ensure dev server is accessible
 * In our setup, the server should always be running on port 3000
 */
async function ensureDevServer() {
  // Check if server is already running (which it should be)
  if (isDevServerRunning()) {
    log.success("Development server confirmed running on http://localhost:3000")
    return true
  }

  // If not running, this is unexpected - warn the user
  log.warning("Dev server not detected on port 3000!")
  log.info("The dev server should always be running in our environment.")
  log.info('Please ensure "pnpm dev" is running in another terminal.')

  // Try to check if there's a process running
  try {
    const psResult = execSync('ps aux | grep -E "next.*dev.*3000" | grep -v grep', { encoding: "utf8" })
    if (psResult) {
      log.info("Server process found, waiting for it to respond...")

      // Wait a bit for server to be ready
      let attempts = 0
      while (!isDevServerRunning() && attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        attempts++
      }

      if (isDevServerRunning()) {
        log.success("Server is now responding on http://localhost:3000")
        return true
      }
    }
  } catch {
    // Process not found
  }

  log.error("Dev server is not running on port 3000")
  log.info('Please run "pnpm dev" in another terminal to start the server')
  throw new Error("Dev server must be running on port 3000 for visual verification")
}

/**
 * Take screenshots using Playwright
 */
async function takeScreenshots(url = "http://localhost:3000") {
  const screenshotDir = path.join(process.cwd(), "visual-evidence", new Date().toISOString().split("T")[0])

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }

  log.step("Taking screenshots for visual verification...")

  const screenshots = []

  try {
    const { chromium, firefox, webkit } = require("playwright")
    const browsers = { chromium, firefox, webkit }

    for (const browserName of config.browsers) {
      if (config.level === "lenient" && browserName !== "chromium") continue

      const browser = await browsers[browserName].launch({ headless: false })
      const context = await browser.newContext()
      const page = await context.newPage()

      for (const viewport of config.viewports) {
        if (config.level === "moderate" && viewport.name === "desktop-wide") continue

        await page.setViewportSize(viewport)
        await page.goto(url, { waitUntil: "networkidle" })

        // Wait for any animations to complete
        await page.waitForTimeout(1000)

        const filename = `${browserName}-${viewport.name}-${Date.now()}.png`
        const filepath = path.join(screenshotDir, filename)

        await page.screenshot({
          path: filepath,
          fullPage: true,
        })

        screenshots.push({
          browser: browserName,
          viewport: viewport.name,
          path: filepath,
        })

        log.success(`Screenshot saved: ${filename}`)
      }

      await browser.close()
    }
  } catch (error) {
    log.error(`Failed to take screenshots: ${error.message}`)
    if (config.blockWithoutProof) {
      throw error
    }
  }

  return screenshots
}

/**
 * Run accessibility checks
 */
async function runAccessibilityChecks(url = "http://localhost:3000") {
  if (!process.env.REQUIRE_ACCESSIBILITY_CHECK === "true") {
    return { passed: true }
  }

  log.step("Running accessibility checks...")

  try {
    const { chromium } = require("playwright")
    const { injectAxe, checkA11y } = require("axe-playwright")

    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(url)
    await injectAxe(page)

    const results = await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })

    await browser.close()

    if (results.violations.length > 0) {
      log.warning(`Found ${results.violations.length} accessibility issues`)
      return { passed: false, violations: results.violations }
    }

    log.success("All accessibility checks passed")
    return { passed: true }
  } catch (error) {
    log.error(`Accessibility check failed: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Run visual regression tests
 */
async function runVisualRegressionTests() {
  log.step("Running visual regression tests...")

  try {
    execSync("pnpm e2e:headless", { stdio: "inherit" })
    log.success("Visual regression tests passed")
    return true
  } catch (error) {
    log.error("Visual regression tests failed")
    if (config.blockWithoutProof) {
      throw new Error("Visual regression tests must pass before completion")
    }
    return false
  }
}

/**
 * Generate visual verification report
 */
function generateReport(results) {
  const reportPath = path.join(process.cwd(), "visual-reports", `report-${Date.now()}.json`)
  const reportDir = path.dirname(reportPath)

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  const report = {
    timestamp: new Date().toISOString(),
    config: config,
    results: results,
    passed: results.every((r) => r.passed !== false),
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  log.info(`Report saved: ${reportPath}`)

  return report
}

/**
 * Main verification process
 */
async function verifyVisually() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════${colors.reset}`)
  console.log(`${colors.cyan}     Visual Verification Enforcement Active      ${colors.reset}`)
  console.log(`${colors.cyan}═══════════════════════════════════════════════${colors.reset}\n`)

  if (!config.requireVisualVerification) {
    log.warning("Visual verification is disabled. Set REQUIRE_VISUAL_VERIFICATION=true to enable.")
    return { passed: true, skipped: true }
  }

  const results = []

  try {
    // Step 1: Ensure dev server is running
    await ensureDevServer()

    // Step 2: Take screenshots
    if (config.autoScreenshotValidation) {
      const screenshots = await takeScreenshots()
      results.push({
        test: "screenshots",
        passed: screenshots.length > 0,
        data: screenshots,
      })
    }

    // Step 3: Run accessibility checks
    const accessibilityResults = await runAccessibilityChecks()
    results.push({
      test: "accessibility",
      ...accessibilityResults,
    })

    // Step 4: Run visual regression tests
    if (config.mandatoryBrowserTesting) {
      const regressionPassed = await runVisualRegressionTests()
      results.push({
        test: "regression",
        passed: regressionPassed,
      })
    }

    // Step 5: Generate report
    const report = generateReport(results)

    // Step 5.1: Link report into BUG_LOG (best-effort)
    try {
      const { main: linkBugs } = require("./bug-linker.js")
      linkBugs()
      log.info("Bug linker updated BUG_LOG.md")
    } catch (e) {
      log.warning(`Bug linker skipped: ${e.message}`)
    }

    // Step 6: Determine overall result
    const allPassed = results.every((r) => r.passed !== false)

    if (allPassed) {
      console.log(`\n${colors.green}✓ Visual verification completed successfully!${colors.reset}\n`)
      return { passed: true, report }
    } else {
      console.log(`\n${colors.red}✗ Visual verification failed!${colors.reset}\n`)
      if (config.blockWithoutProof) {
        process.exit(1)
      }
      return { passed: false, report }
    }
  } catch (error) {
    log.error(`Visual verification failed: ${error.message}`)
    if (config.blockWithoutProof) {
      process.exit(1)
    }
    return { passed: false, error: error.message }
  }
}

// Export for use in other scripts
module.exports = { verifyVisually, takeScreenshots, runAccessibilityChecks, runVisualRegressionTests }

if (require.main === module) {
  verifyVisually().catch(console.error)
}
