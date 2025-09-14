import { FullConfig } from "@playwright/test"
import { readFile, writeFile, readdir, stat } from "fs/promises"
import { resolve, join } from "path"

/**
 * Lions of Zion - Global Test Teardown
 * Cleanup and final reporting after test execution
 */
async function globalTeardown(config: FullConfig) {
  console.log("\n" + "=".repeat(80))
  console.log("🦁 LIONS OF ZION - GLOBAL TEST TEARDOWN")
  console.log("=".repeat(80))

  try {
    // Generate comprehensive test summary
    await generateTestSummary()

    // Analyze performance data
    await analyzePerformanceData()

    // Generate artifact summary
    await generateArtifactSummary()

    // Cleanup temporary files
    await cleanupTempFiles()

    console.log("=".repeat(80))
    console.log("🎯 MISSION COMPLETE - ALL SYSTEMS ANALYZED")
    console.log("=".repeat(80))
  } catch (error) {
    console.log(`❌ Teardown error: ${error}`)
  }
}

/**
 * Generate comprehensive test summary
 */
async function generateTestSummary() {
  console.log("📊 Generating test summary...")

  try {
    // Read test results if available
    const reportPath = resolve("test-results/report.json")
    let testResults = null

    try {
      const reportData = await readFile(reportPath, "utf-8")
      testResults = JSON.parse(reportData)
    } catch {
      console.log("⚠️  No test results JSON found")
    }

    // Read detailed log
    let detailedLog = ""
    try {
      detailedLog = await readFile(resolve("test-results/lions-of-zion-detailed.log"), "utf-8")
    } catch {
      console.log("⚠️  No detailed log found")
    }

    // Calculate summary statistics
    const summary = {
      timestamp: new Date().toISOString(),
      execution: {
        totalTests: testResults?.stats?.total || 0,
        passed: testResults?.stats?.passed || 0,
        failed: testResults?.stats?.failed || 0,
        skipped: testResults?.stats?.skipped || 0,
        duration: testResults?.stats?.duration || 0,
      },
      performance: {
        averageDuration: 0,
        slowestTest: "N/A",
        fastestTest: "N/A",
        totalNetworkRequests: 0,
        failedRequests: 0,
      },
      artifacts: {
        screenshots: 0,
        videos: 0,
        traces: 0,
        reports: 0,
      },
      issues: {
        criticalErrors: 0,
        warnings: 0,
        performanceIssues: 0,
      },
    }

    // Count artifacts
    try {
      const screenshotFiles = await readdir(resolve("test-results/screenshots")).catch(() => [])
      const videoFiles = await readdir(resolve("test-results/videos")).catch(() => [])
      const traceFiles = await readdir(resolve("test-results/traces")).catch(() => [])

      summary.artifacts.screenshots = screenshotFiles.length
      summary.artifacts.videos = videoFiles.length
      summary.artifacts.traces = traceFiles.length
    } catch {
      console.log("⚠️  Could not count artifact files")
    }

    // Analyze log for issues
    if (detailedLog) {
      summary.issues.criticalErrors = (detailedLog.match(/CRITICAL|ERROR/g) || []).length
      summary.issues.warnings = (detailedLog.match(/WARNING/g) || []).length
      summary.issues.performanceIssues = (detailedLog.match(/SLOW TEST WARNING/g) || []).length
    }

    // Save comprehensive summary
    await writeFile(resolve("test-results/final-summary.json"), JSON.stringify(summary, null, 2))

    // Generate human-readable summary
    const readableSummary = `
Lions of Zion - Test Execution Summary
======================================
Execution Time: ${new Date().toISOString()}

Test Results:
- Total Tests: ${summary.execution.totalTests}
- Passed: ${summary.execution.passed} ✅
- Failed: ${summary.execution.failed} ❌
- Skipped: ${summary.execution.skipped} ⏭️
- Success Rate: ${
      summary.execution.totalTests > 0
        ? ((summary.execution.passed / summary.execution.totalTests) * 100).toFixed(2)
        : 0
    }%
- Total Duration: ${(summary.execution.duration / 1000).toFixed(2)}s

Artifacts Generated:
- Screenshots: ${summary.artifacts.screenshots}
- Videos: ${summary.artifacts.videos}
- Traces: ${summary.artifacts.traces}

Issues Detected:
- Critical Errors: ${summary.issues.criticalErrors}
- Warnings: ${summary.issues.warnings}
- Performance Issues: ${summary.issues.performanceIssues}

Recommendations:
${summary.issues.criticalErrors > 0 ? "🚨 Review critical errors in detailed log\n" : ""}${
      summary.issues.performanceIssues > 0 ? "⚡ Optimize slow-performing tests\n" : ""
    }${summary.execution.failed > 0 ? "🔍 Investigate failed test cases\n" : ""}${
      summary.execution.failed === 0 && summary.issues.criticalErrors === 0 ? "🎉 All systems operational!\n" : ""
    }
======================================
`

    await writeFile(resolve("test-results/SUMMARY.txt"), readableSummary)

    console.log("✅ Test summary generated")
    console.log(
      `📈 Success Rate: ${
        summary.execution.totalTests > 0
          ? ((summary.execution.passed / summary.execution.totalTests) * 100).toFixed(2)
          : 0
      }%`
    )
    console.log(`⏱️  Total Duration: ${(summary.execution.duration / 1000).toFixed(2)}s`)
  } catch (error) {
    console.log(`❌ Error generating test summary: ${error}`)
  }
}

/**
 * Analyze performance data
 */
async function analyzePerformanceData() {
  console.log("📊 Analyzing performance data...")

  try {
    // Read baseline performance if available
    let baselineData = null
    try {
      const baselineRaw = await readFile(resolve("test-results/baseline-performance.json"), "utf-8")
      baselineData = JSON.parse(baselineRaw)
    } catch {
      console.log("⚠️  No baseline performance data found")
    }

    // Read monitoring configuration
    let monitoringConfig = null
    try {
      const configRaw = await readFile(resolve("test-results/monitoring-config.json"), "utf-8")
      monitoringConfig = JSON.parse(configRaw)
    } catch {
      console.log("⚠️  No monitoring configuration found")
    }

    const performanceAnalysis = {
      timestamp: new Date().toISOString(),
      baseline: baselineData,
      thresholds: monitoringConfig?.performanceThresholds,
      analysis: {
        baselineLoadTime: baselineData?.loadTime || 0,
        thresholdViolations: [],
        recommendations: [],
      },
    }

    // Analyze baseline against thresholds
    if (baselineData && monitoringConfig) {
      const { loadTime } = baselineData
      const { lcp, fcp, ttfb } = monitoringConfig.performanceThresholds

      if (loadTime > lcp) {
        performanceAnalysis.analysis.thresholdViolations.push({
          metric: "Load Time",
          value: loadTime,
          threshold: lcp,
          severity: "high",
        })
        performanceAnalysis.analysis.recommendations.push(
          "Optimize initial page load performance - consider code splitting and lazy loading"
        )
      }

      if (loadTime > fcp) {
        performanceAnalysis.analysis.thresholdViolations.push({
          metric: "First Contentful Paint equivalent",
          value: loadTime,
          threshold: fcp,
          severity: "medium",
        })
        performanceAnalysis.analysis.recommendations.push("Improve First Contentful Paint metrics")
      }
    }

    // Add general recommendations
    if (performanceAnalysis.analysis.thresholdViolations.length === 0) {
      performanceAnalysis.analysis.recommendations.push("Performance within acceptable thresholds")
    }

    await writeFile(resolve("test-results/performance-analysis.json"), JSON.stringify(performanceAnalysis, null, 2))

    console.log("✅ Performance analysis completed")
    if (performanceAnalysis.analysis.thresholdViolations.length > 0) {
      console.log(
        `⚠️  ${performanceAnalysis.analysis.thresholdViolations.length} performance threshold violations detected`
      )
    }
  } catch (error) {
    console.log(`❌ Error analyzing performance data: ${error}`)
  }
}

/**
 * Generate artifact summary
 */
async function generateArtifactSummary() {
  console.log("📁 Generating artifact summary...")

  try {
    const artifactSummary = {
      timestamp: new Date().toISOString(),
      directories: {},
      totalSize: 0,
      fileCount: 0,
    }

    // Analyze test-results directory
    const resultsDirs = ["screenshots", "videos", "traces", "html-report"]

    for (const dir of resultsDirs) {
      const dirPath = resolve("test-results", dir)
      try {
        const files = await readdir(dirPath)
        let totalSize = 0

        for (const file of files) {
          try {
            const filePath = join(dirPath, file)
            const stats = await stat(filePath)
            totalSize += stats.size
          } catch {
            // File might not exist or be accessible
          }
        }

        artifactSummary.directories[dir] = {
          fileCount: files.length,
          totalSize,
          sizeHuman: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
        }

        artifactSummary.totalSize += totalSize
        artifactSummary.fileCount += files.length
      } catch {
        artifactSummary.directories[dir] = {
          fileCount: 0,
          totalSize: 0,
          sizeHuman: "0 MB",
        }
      }
    }

    await writeFile(resolve("test-results/artifact-summary.json"), JSON.stringify(artifactSummary, null, 2))

    console.log("✅ Artifact summary generated")
    console.log(`📊 Total artifacts: ${artifactSummary.fileCount} files`)
    console.log(`💾 Total size: ${(artifactSummary.totalSize / 1024 / 1024).toFixed(2)} MB`)
  } catch (error) {
    console.log(`❌ Error generating artifact summary: ${error}`)
  }
}

/**
 * Cleanup temporary files
 */
async function cleanupTempFiles() {
  console.log("🧹 Cleaning up temporary files...")

  // Currently, we keep all files for analysis
  // In the future, this could remove old traces, videos, etc.
  // based on retention policies

  console.log("✅ Cleanup completed (retention policy: keep all)")
}

export default globalTeardown
