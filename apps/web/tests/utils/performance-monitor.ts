import type { Page } from "@playwright/test"

/**
 * Lions of Zion - Performance Monitoring Utilities
 * Web Vitals and performance metrics collection for information warfare defense platform
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte

  // Additional metrics
  domContentLoaded?: number
  loadComplete?: number
  networkRequests?: NetworkRequest[]
  resourceTimings?: ResourceTiming[]
  memoryUsage?: MemoryInfo
  cpuUsage?: number
}

export interface NetworkRequest {
  url: string
  method: string
  status: number
  duration: number
  size: number
  type: string
  timestamp: number
}

export interface ResourceTiming {
  name: string
  duration: number
  transferSize: number
  decodedBodySize: number
  startTime: number
}

export interface MemoryInfo {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

export class PerformanceMonitor {
  private networkRequests: NetworkRequest[] = []
  private performanceEntries: any[] = []

  constructor(private page: Page) {
    this.setupNetworkMonitoring()
    this.setupConsoleLogging()
    this.setupErrorTracking()
  }

  /**
   * Setup comprehensive network monitoring
   */
  private setupNetworkMonitoring() {
    // Monitor all network requests
    this.page.on("request", (request) => {
      const timestamp = Date.now()
      console.log(`🌐 [${new Date().toISOString()}] REQUEST: ${request.method()} ${request.url()}`)

      // Log request headers for debugging
      const headers = request.headers()
      if (headers["user-agent"]?.includes("Lions-of-Zion")) {
        console.log(`   User-Agent: ${headers["user-agent"]}`)
      }
    })

    this.page.on("response", (response) => {
      const request = response.request()
      const timestamp = Date.now()

      const networkRequest: NetworkRequest = {
        url: request.url(),
        method: request.method(),
        status: response.status(),
        duration: 0, // Will be calculated
        size: 0, // Will be updated if available
        type: request.resourceType(),
        timestamp,
      }

      // Log response details
      console.log(
        `📨 [${new Date().toISOString()}] RESPONSE: ${response.status()} ${request.url()} (${request.resourceType()})`
      )

      // Track failed requests
      if (response.status() >= 400) {
        console.log(`❌ [${new Date().toISOString()}] FAILED REQUEST: ${response.status()} ${request.url()}`)
      }

      // Track slow requests
      response.finished().then(() => {
        const timing = response.request().timing()
        if (timing && timing.responseEnd - timing.requestStart > 2000) {
          console.log(
            `🐌 [${new Date().toISOString()}] SLOW REQUEST: ${request.url()} took ${timing.responseEnd - timing.requestStart}ms`
          )
        }
      })

      this.networkRequests.push(networkRequest)
    })

    // Monitor request failures
    this.page.on("requestfailed", (request) => {
      console.log(`💥 [${new Date().toISOString()}] REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`)
    })
  }

  /**
   * Setup console logging capture
   */
  private setupConsoleLogging() {
    this.page.on("console", (msg) => {
      const type = msg.type()
      const text = msg.text()
      const timestamp = new Date().toISOString()

      // Format console messages with timestamps
      const logLevel = this.getLogLevelEmoji(type)
      console.log(`${logLevel} [${timestamp}] BROWSER-CONSOLE: ${text}`)

      // Track errors and warnings specifically
      if (type === "error") {
        console.log(`🚨 [${timestamp}] CRITICAL BROWSER ERROR: ${text}`)
      } else if (type === "warning") {
        console.log(`⚠️  [${timestamp}] BROWSER WARNING: ${text}`)
      }
    })
  }

  /**
   * Setup error tracking
   */
  private setupErrorTracking() {
    this.page.on("pageerror", (error) => {
      console.log(`💀 [${new Date().toISOString()}] PAGE ERROR: ${error.message}`)
      console.log(`   Stack: ${error.stack}`)
    })

    this.page.on("crash", () => {
      console.log(`💥 [${new Date().toISOString()}] PAGE CRASHED`)
    })
  }

  /**
   * Collect comprehensive performance metrics
   */
  async collectMetrics(): Promise<PerformanceMetrics> {
    const metrics: PerformanceMetrics = {}

    try {
      // Collect Core Web Vitals and performance metrics
      const performanceData = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          // Collect performance navigation timing
          const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

          // Collect resource timings
          const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]

          // Basic metrics
          const basicMetrics = {
            domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
            loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
            ttfb: navigation?.responseStart - navigation?.requestStart,
          }

          // Try to get Core Web Vitals (may not be available immediately)
          const webVitals = {
            lcp: 0,
            fid: 0,
            cls: 0,
            fcp: 0,
          }

          // Get First Contentful Paint
          const paintEntries = performance.getEntriesByType("paint")
          const fcpEntry = paintEntries.find((entry) => entry.name === "first-contentful-paint")
          if (fcpEntry) {
            webVitals.fcp = fcpEntry.startTime
          }

          // Collect memory information (if available)
          let memoryInfo = null
          if ("memory" in performance) {
            memoryInfo = {
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
              jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
            }
          }

          resolve({
            ...basicMetrics,
            ...webVitals,
            memoryUsage: memoryInfo,
            resourceTimings: resources.map((resource) => ({
              name: resource.name,
              duration: resource.duration,
              transferSize: resource.transferSize || 0,
              decodedBodySize: resource.decodedBodySize || 0,
              startTime: resource.startTime,
            })),
          })
        })
      })

      // Merge collected data
      Object.assign(metrics, performanceData)
      metrics.networkRequests = this.networkRequests

      // Log performance summary
      this.logPerformanceSummary(metrics)

      return metrics
    } catch (error) {
      console.log(`❌ Error collecting performance metrics: ${error}`)
      return metrics
    }
  }

  /**
   * Wait for critical performance markers
   */
  async waitForPageLoad(): Promise<void> {
    try {
      // Wait for network to be idle
      await this.page.waitForLoadState("networkidle", { timeout: 30000 })

      // Wait for any pending animations
      await this.page.waitForTimeout(500)

      console.log(`✅ [${new Date().toISOString()}] Page load completed successfully`)
    } catch (error) {
      console.log(`⚠️  [${new Date().toISOString()}] Page load timeout or error: ${error}`)
    }
  }

  /**
   * Monitor real-time performance during test execution
   */
  async startRealTimeMonitoring(): Promise<void> {
    // Set up periodic performance monitoring
    const monitoringInterval = setInterval(async () => {
      try {
        const currentMetrics = await this.page.evaluate(() => {
          const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

          return {
            timestamp: Date.now(),
            memoryUsage: "memory" in performance ? (performance as any).memory : null,
            resourceCount: performance.getEntriesByType("resource").length,
            domNodes: document.querySelectorAll("*").length,
          }
        })

        console.log(`📊 [${new Date().toISOString()}] REAL-TIME METRICS:`, currentMetrics)
      } catch (error) {
        console.log(`❌ Real-time monitoring error: ${error}`)
      }
    }, 5000) // Every 5 seconds

    // Clean up interval when page is closed
    this.page.on("close", () => {
      clearInterval(monitoringInterval)
    })
  }

  /**
   * Log performance summary
   */
  private logPerformanceSummary(metrics: PerformanceMetrics) {
    console.log("\n" + "=".repeat(60))
    console.log("📊 LIONS OF ZION - PERFORMANCE SUMMARY")
    console.log("=".repeat(60))

    if (metrics.lcp) console.log(`🎯 Largest Contentful Paint: ${metrics.lcp.toFixed(2)}ms`)
    if (metrics.fcp) console.log(`🎨 First Contentful Paint: ${metrics.fcp.toFixed(2)}ms`)
    if (metrics.ttfb) console.log(`⚡ Time to First Byte: ${metrics.ttfb.toFixed(2)}ms`)
    if (metrics.domContentLoaded) console.log(`📄 DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`)
    if (metrics.loadComplete) console.log(`✅ Load Complete: ${metrics.loadComplete.toFixed(2)}ms`)

    if (metrics.memoryUsage) {
      const memoryMB = (metrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)
      console.log(`🧠 Memory Usage: ${memoryMB}MB`)
    }

    if (metrics.networkRequests) {
      const failedRequests = metrics.networkRequests.filter((req) => req.status >= 400)
      console.log(`🌐 Network Requests: ${metrics.networkRequests.length} total, ${failedRequests.length} failed`)
    }

    // Performance warnings
    if (metrics.lcp && metrics.lcp > 2500) {
      console.log(`⚠️  WARNING: LCP exceeds 2.5s threshold (${metrics.lcp.toFixed(2)}ms)`)
    }
    if (metrics.fcp && metrics.fcp > 1800) {
      console.log(`⚠️  WARNING: FCP exceeds 1.8s threshold (${metrics.fcp.toFixed(2)}ms)`)
    }

    console.log("=".repeat(60))
  }

  /**
   * Get emoji for log level
   */
  private getLogLevelEmoji(type: string): string {
    switch (type) {
      case "error":
        return "❌"
      case "warning":
        return "⚠️"
      case "info":
        return "ℹ️"
      case "debug":
        return "🔍"
      case "log":
        return "📝"
      default:
        return "💬"
    }
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      networkRequests: this.networkRequests,
      performanceEntries: this.performanceEntries,
    }

    return JSON.stringify(report, null, 2)
  }
}

/**
 * Helper function to create performance monitor
 */
export function createPerformanceMonitor(page: Page): PerformanceMonitor {
  return new PerformanceMonitor(page)
}

/**
 * Performance assertion helpers
 */
export const performanceAssertions = {
  assertLCP: (lcp: number, threshold = 2500) => {
    if (lcp > threshold) {
      throw new Error(`LCP ${lcp}ms exceeds threshold ${threshold}ms`)
    }
  },

  assertFCP: (fcp: number, threshold = 1800) => {
    if (fcp > threshold) {
      throw new Error(`FCP ${fcp}ms exceeds threshold ${threshold}ms`)
    }
  },

  assertTTFB: (ttfb: number, threshold = 600) => {
    if (ttfb > threshold) {
      throw new Error(`TTFB ${ttfb}ms exceeds threshold ${threshold}ms`)
    }
  },

  assertMemoryUsage: (memory: MemoryInfo, maxMB = 100) => {
    const usedMB = memory.usedJSHeapSize / 1024 / 1024
    if (usedMB > maxMB) {
      throw new Error(`Memory usage ${usedMB.toFixed(2)}MB exceeds threshold ${maxMB}MB`)
    }
  },
}
