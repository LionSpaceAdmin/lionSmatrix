import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter"
import { createWriteStream, WriteStream } from "fs"
import { resolve } from "path"

/**
 * Lions of Zion - Custom Test Reporter
 * Enhanced monitoring and logging for information warfare defense platform testing
 */
export class LionsOfZionReporter implements Reporter {
  private logStream: WriteStream
  private startTime: number = 0
  private testResults: Array<{
    test: string
    status: string
    duration: number
    errors: string[]
    logs: string[]
    performance: Record<string, any>
  }> = []

  constructor() {
    // Create detailed log file
    this.logStream = createWriteStream(resolve("test-results/lions-of-zion-detailed.log"), { flags: "w" })
    this.log("🦁 Lions of Zion Test Reporter Initialized")
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now()
    this.log(`🚀 Test Suite Started: ${suite.allTests().length} tests`)
    this.log(`📊 Running on ${config.projects.length} projects`)
    this.log(`⚙️  Workers: ${config.workers}`)
    this.log(`🔄 Retries: ${config.retries}`)
  }

  onTestBegin(test: TestCase) {
    this.log(`🧪 Starting: ${test.title}`)
    this.log(`📁 Project: ${test.parent.project()?.name || "unknown"}`)
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const duration = result.duration
    const status = result.status
    const errors = result.errors.map((error) => error.message || error.toString())

    // Collect test data
    this.testResults.push({
      test: test.title,
      status,
      duration,
      errors,
      logs: result.stdout,
      performance: {
        duration,
        retry: result.retry,
        workerIndex: result.workerIndex,
      },
    })

    // Log test completion
    const statusEmoji = this.getStatusEmoji(status)
    this.log(`${statusEmoji} ${test.title} - ${status} (${duration}ms) [Retry: ${result.retry}]`)

    if (errors.length > 0) {
      this.log(`❌ Errors:`)
      errors.forEach((error) => this.log(`   ${error}`))
    }

    if (result.stdout.length > 0) {
      this.log(`📝 Console Output:`)
      result.stdout.forEach((log) => this.log(`   ${log}`))
    }

    // Performance warnings
    if (duration > 10000) {
      this.log(`⚠️  SLOW TEST WARNING: ${test.title} took ${duration}ms`)
    }

    // Memory and resource analysis if available
    if (result.attachments) {
      result.attachments.forEach((attachment) => {
        this.log(`📎 Attachment: ${attachment.name} (${attachment.contentType})`)
      })
    }
  }

  onEnd(result: FullResult) {
    const totalDuration = Date.now() - this.startTime
    const totalTests = this.testResults.length
    const passed = this.testResults.filter((r) => r.status === "passed").length
    const failed = this.testResults.filter((r) => r.status === "failed").length
    const skipped = this.testResults.filter((r) => r.status === "skipped").length

    // Final summary
    this.log("\n" + "=".repeat(80))
    this.log("🦁 LIONS OF ZION - TEST EXECUTION SUMMARY")
    this.log("=".repeat(80))
    this.log(`⏱️  Total Time: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`)
    this.log(`📊 Total Tests: ${totalTests}`)
    this.log(`✅ Passed: ${passed}`)
    this.log(`❌ Failed: ${failed}`)
    this.log(`⏭️  Skipped: ${skipped}`)
    this.log(`📈 Success Rate: ${((passed / totalTests) * 100).toFixed(2)}%`)

    // Performance analysis
    const avgDuration = this.testResults.reduce((sum, test) => sum + test.duration, 0) / totalTests
    const slowTests = this.testResults.filter((test) => test.duration > avgDuration * 2)

    this.log(`\n📊 PERFORMANCE ANALYSIS:`)
    this.log(`⚡ Average Test Duration: ${avgDuration.toFixed(2)}ms`)
    this.log(`🐌 Slow Tests (>${(avgDuration * 2).toFixed(0)}ms): ${slowTests.length}`)

    if (slowTests.length > 0) {
      this.log(`🔍 Slowest Tests:`)
      slowTests
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5)
        .forEach((test) => {
          this.log(`   ${test.test}: ${test.duration}ms`)
        })
    }

    // Error analysis
    const testsWithErrors = this.testResults.filter((test) => test.errors.length > 0)
    if (testsWithErrors.length > 0) {
      this.log(`\n🚨 ERROR ANALYSIS:`)
      this.log(`❌ Tests with Errors: ${testsWithErrors.length}`)
      testsWithErrors.forEach((test) => {
        this.log(`   ${test.test}:`)
        test.errors.forEach((error) => this.log(`     - ${error}`))
      })
    }

    // Final status
    this.log("\n" + "=".repeat(80))
    if (result.status === "passed") {
      this.log("🎉 ALL SYSTEMS OPERATIONAL - DEFENSE PLATFORM READY")
    } else {
      this.log("🚨 CRITICAL ISSUES DETECTED - REVIEW REQUIRED")
    }
    this.log("=".repeat(80))

    this.logStream.end()
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case "passed":
        return "✅"
      case "failed":
        return "❌"
      case "skipped":
        return "⏭️"
      case "timedOut":
        return "⏰"
      default:
        return "❓"
    }
  }

  private log(message: string) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(logMessage)
    this.logStream.write(logMessage + "\n")
  }
}

export default LionsOfZionReporter
