#!/usr/bin/env node
import dotenv from "dotenv"
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env.visual-verification" })

const config = {
  requireVisualVerification: process.env.REQUIRE_VISUAL_VERIFICATION === "true",
  mandatoryBrowserTesting: process.env.MANDATORY_BROWSER_TESTING === "true",
  autoScreenshotValidation: process.env.AUTO_SCREENSHOT_VALIDATION === "true",
  blockWithoutProof: process.env.BLOCK_COMPLETION_WITHOUT_VISUAL_PROOF === "true",
  screenshotOnCompletion: process.env.SCREENSHOT_ON_COMPLETION === "true",
  level: process.env.VISUAL_VERIFICATION_LEVEL || "strict",
  browsers: ["chromium", "firefox", "webkit"],
  viewports: [
    { width: 320, height: 568, name: "mobile" },
    { width: 768, height: 1024, name: "tablet" },
    { width: 1024, height: 768, name: "desktop" },
    { width: 1440, height: 900, name: "desktop-wide" },
  ],
}

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
}
const log = {
  info: (m) => console.log(`${colors.blue}[INFO]${colors.reset} ${m}`),
  success: (m) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${m}`),
  warning: (m) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${m}`),
  error: (m) => console.error(`${colors.red}[ERROR]${colors.reset} ${m}`),
  step: (m) => console.log(`${colors.cyan}➤${colors.reset} ${m}`),
}

function isDevServerRunning() {
  try {
    execSync("curl -s http://localhost:3000 > /dev/null 2>&1")
    return true
  } catch {
    return false
  }
}
async function ensureDevServer() {
  if (isDevServerRunning()) {
    log.success("Development server confirmed running on http://localhost:3000")
    return true
  }
  log.warning("Dev server not detected on port 3000!")
  log.info("The dev server should always be running in our environment.")
  log.info('Please ensure "pnpm dev" is running in another terminal.')
  try {
    const ps = execSync('ps aux | grep -E "next.*dev.*3000" | grep -v grep', { encoding: "utf8" })
    if (ps) {
      log.info("Server process found, waiting for it to respond...")
      let attempts = 0
      while (!isDevServerRunning() && attempts < 10) {
        await new Promise((r) => setTimeout(r, 1000))
        attempts++
      }
      if (isDevServerRunning()) {
        log.success("Server is now responding on http://localhost:3000")
        return true
      }
    }
  } catch {}
  log.error("Dev server is not running on port 3000")
  throw new Error("Dev server must be running on port 3000 for visual verification")
}

async function takeScreenshots(url = "http://localhost:3000") {
  const screenshotDir = path.join(process.cwd(), "visual-evidence", new Date().toISOString().split("T")[0])
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true })
  log.step("Taking screenshots for visual verification...")
  const screenshots = []
  try {
    const { chromium, firefox, webkit } = await import("playwright")
    const browsers = { chromium, firefox, webkit }
    for (const browserName of config.browsers) {
      if (config.level === "lenient" && browserName !== "chromium") continue
      const browser = await browsers[browserName].launch({ headless: true })
      const context = await browser.newContext()
      const page = await context.newPage()
      for (const viewport of config.viewports) {
        if (config.level === "moderate" && viewport.name === "desktop-wide") continue
        await page.setViewportSize(viewport)
        await page.goto(url, { waitUntil: "networkidle" })
        await page.waitForTimeout(1000)
        const filename = `${browserName}-${viewport.name}-${Date.now()}.png`
        const filepath = path.join(screenshotDir, filename)
        await page.screenshot({ path: filepath, fullPage: true })
        screenshots.push({ browser: browserName, viewport: viewport.name, path: filepath })
        log.success(`Screenshot saved: ${filename}`)
      }
      await browser.close()
    }
  } catch (e) {
    log.error(`Failed to take screenshots: ${e.message}`)
    if (config.blockWithoutProof) throw e
  }
  return screenshots
}

async function runAccessibilityChecks(url = "http://localhost:3000") {
  if (!(process.env.REQUIRE_ACCESSIBILITY_CHECK === "true")) return { passed: true }
  log.step("Running accessibility checks...")
  try {
    const { chromium } = await import("playwright")
    const { injectAxe, checkA11y } = await import("axe-playwright")
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(url)
    await injectAxe(page)
    const results = await checkA11y(page, null, { detailedReport: true, detailedReportOptions: { html: true } })
    await browser.close()
    if (results.violations.length) {
      log.warning(`Found ${results.violations.length} accessibility issues`)
      return { passed: false, violations: results.violations }
    }
    log.success("All accessibility checks passed")
    return { passed: true }
  } catch (e) {
    log.error(`Accessibility check failed: ${e.message}`)
    return { passed: false, error: e.message }
  }
}

async function runVisualRegressionTests() {
  log.step("Running visual regression tests...")
  try {
    execSync("pnpm e2e:headless", { stdio: "inherit" })
    log.success("Visual regression tests passed")
    return true
  } catch (e) {
    log.error("Visual regression tests failed")
    if (config.blockWithoutProof) throw new Error("Visual regression tests must pass before completion")
    return false
  }
}

function generateReport(results) {
  const reportPath = path.join(process.cwd(), "visual-reports", `report-${Date.now()}.json`)
  const dir = path.dirname(reportPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const report = {
    timestamp: new Date().toISOString(),
    config,
    results,
    passed: results.every((r) => r.passed !== false),
  }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  log.info(`Report saved: ${reportPath}`)
  return report
}

export async function verifyVisually() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════${colors.reset}`)
  console.log(`${colors.cyan}     Visual Verification Enforcement Active      ${colors.reset}`)
  console.log(`${colors.cyan}═══════════════════════════════════════════════${colors.reset}\n`)
  if (!config.requireVisualVerification) {
    log.warning("Visual verification is disabled. Set REQUIRE_VISUAL_VERIFICATION=true to enable.")
    return { passed: true, skipped: true }
  }
  const results = []
  try {
    await ensureDevServer()
    if (config.autoScreenshotValidation) {
      const screenshots = await takeScreenshots()
      results.push({ test: "screenshots", passed: screenshots.length > 0, data: screenshots })
    }
    const accessibilityResults = await runAccessibilityChecks()
    results.push({ test: "accessibility", ...accessibilityResults })
    if (config.mandatoryBrowserTesting) {
      const regressionPassed = await runVisualRegressionTests()
      results.push({ test: "regression", passed: regressionPassed })
    }
    const report = generateReport(results)
    // Link to BUG_LOG
    try {
      const { main: linkBugs } = await import("./bug-linker.mjs")
      linkBugs()
      log.info("Bug linker updated BUG_LOG.md")
    } catch (e) {
      log.warning(`Bug linker skipped: ${e.message}`)
    }
    const allPassed = results.every((r) => r.passed !== false)
    if (allPassed) {
      console.log(`\n${colors.green}✓ Visual verification completed successfully!${colors.reset}\n`)
      return { passed: true, report }
    }
    console.log(`\n${colors.red}✗ Visual verification failed!${colors.reset}\n`)
    if (config.blockWithoutProof) process.exit(1)
    return { passed: false, report }
  } catch (e) {
    log.error(`Visual verification failed: ${e.message}`)
    if (config.blockWithoutProof) process.exit(1)
    return { passed: false, error: e.message }
  }
}

export { runAccessibilityChecks, runVisualRegressionTests, takeScreenshots }

if (process.argv[1] && process.argv[1].endsWith("visual-verification.mjs")) {
  verifyVisually().catch(console.error)
}
