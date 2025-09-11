#!/usr/bin/env node

/**
 * Lions of Zion - Advanced Log Analyzer
 * Analyzes Chromium logs for performance, errors, and security insights
 */

const fs = require('fs');
const path = require('path');
// const { spawn } = require('child_process') // TODO: Implement log analysis;

const LOGS_DIR = path.join(__dirname, '..', 'logs');

class LogAnalyzer {
  constructor() {
    this.results = {
      errors: [],
      warnings: [],
      performance: {},
      network: {},
      security: {},
      summary: {}
    };
  }

  // Analyze console logs
  analyzeConsoleLog(logFile) {
    console.log(`🔍 Analyzing console log: ${path.basename(logFile)}`);
    
    if (!fs.existsSync(logFile)) {
      console.log(`⚠️  Log file not found: ${logFile}`);
      return;
    }

    const content = fs.readFileSync(logFile, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    // Error patterns
    const errorPatterns = [
      /ERROR|Error|error/,
      /Failed|failed|FAILED/,
      /Exception|exception/,
      /Uncaught|uncaught/,
      /TypeError|ReferenceError|SyntaxError/,
      /401|403|404|500|502|503/
    ];

    // Warning patterns
    const warningPatterns = [
      /WARNING|Warning|warning/,
      /deprecated|Deprecated/,
      /WARN|warn/
    ];

    // Performance patterns
    const performancePatterns = [
      /LCP|FCP|FID|CLS/,
      /performance|Performance/,
      /slow|Slow|timeout|Timeout/
    ];

    lines.forEach((line, index) => {
      // Check for errors
      errorPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          this.results.errors.push({
            line: index + 1,
            content: line,
            type: 'console_error',
            file: path.basename(logFile)
          });
        }
      });

      // Check for warnings
      warningPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          this.results.warnings.push({
            line: index + 1,
            content: line,
            type: 'console_warning',
            file: path.basename(logFile)
          });
        }
      });

      // Check for performance issues
      performancePatterns.forEach(pattern => {
        if (pattern.test(line)) {
          if (!this.results.performance.issues) {
            this.results.performance.issues = [];
          }
          this.results.performance.issues.push({
            line: index + 1,
            content: line,
            file: path.basename(logFile)
          });
        }
      });
    });

    console.log(`✓ Console analysis complete: ${this.results.errors.length} errors, ${this.results.warnings.length} warnings`);
  }

  // Analyze network logs
  analyzeNetworkLog(logFile) {
    console.log(`🌐 Analyzing network log: ${path.basename(logFile)}`);
    
    if (!fs.existsSync(logFile)) {
      console.log(`⚠️  Network log not found: ${logFile}`);
      return;
    }

    try {
      const content = fs.readFileSync(logFile, 'utf-8');
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(content);
      } catch (_e) {
        // If not valid JSON, analyze as text
        this.analyzeNetworkLogText(content);
        return;
      }

      if (data.events && Array.isArray(data.events)) {
        this.analyzeNetworkEvents(data.events);
      }
    } catch (error) {
      console.log(`❌ Error analyzing network log: ${error.message}`);
    }
  }

  analyzeNetworkEvents(events) {
    const stats = {
      totalRequests: 0,
      failedRequests: 0,
      slowRequests: 0,
      domains: new Set(),
      requestTypes: {},
      errors: []
    };

    events.forEach(event => {
      if (event.type === 'REQUEST_ALIVE' && event.params?.url) {
        stats.totalRequests++;
        
        try {
          const url = new URL(event.params.url);
          stats.domains.add(url.hostname);
          
          // Categorize request type
          const ext = path.extname(url.pathname);
          const type = this.getRequestType(ext, url.pathname);
          stats.requestTypes[type] = (stats.requestTypes[type] || 0) + 1;
        } catch (_e) {
          // Invalid URL
        }
      }

      // Check for failed requests
      if (event.type === 'HTTP_TRANSACTION_READ_RESPONSE_HEADERS') {
        const headers = event.params?.headers || '';
        if (headers.includes('HTTP/1.1 4') || headers.includes('HTTP/1.1 5')) {
          stats.failedRequests++;
          stats.errors.push({
            type: 'network_error',
            content: headers,
            timestamp: event.time
          });
        }
      }

      // Check for slow requests (> 5 seconds)
      if (event.type === 'REQUEST_ALIVE' && event.params?.load_timing) {
        const timing = event.params.load_timing;
        if (timing.request_start && timing.receive_headers_end) {
          const duration = timing.receive_headers_end - timing.request_start;
          if (duration > 5000) { // 5 seconds
            stats.slowRequests++;
          }
        }
      }
    });

    this.results.network = {
      ...stats,
      domains: Array.from(stats.domains),
      errorRate: stats.totalRequests > 0 ? (stats.failedRequests / stats.totalRequests * 100).toFixed(2) : 0
    };

    console.log(`✓ Network analysis complete: ${stats.totalRequests} requests, ${stats.failedRequests} failures`);
  }

  analyzeNetworkLogText(content) {
    // Fallback for non-JSON network logs
    const lines = content.split('\n');
    const urlPattern = /https?:\/\/[^\s]+/g;
    const errorPattern = /4\d{2}|5\d{2}/g;
    
    const urls = [];
    const errors = [];
    
    lines.forEach(line => {
      const foundUrls = line.match(urlPattern);
      if (foundUrls) {
        urls.push(...foundUrls);
      }
      
      const foundErrors = line.match(errorPattern);
      if (foundErrors) {
        errors.push(line);
      }
    });
    
    this.results.network = {
      totalRequests: urls.length,
      failedRequests: errors.length,
      uniqueDomains: [...new Set(urls.map(url => {
        try {
          return new URL(url).hostname;
        } catch {
          return 'unknown';
        }
      }))].length
    };
  }

  getRequestType(ext, pathname) {
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const scriptExts = ['.js', '.mjs'];
    const styleExts = ['.css'];
    const fontExts = ['.woff', '.woff2', '.ttf', '.otf'];
    
    if (imageExts.includes(ext)) return 'image';
    if (scriptExts.includes(ext)) return 'script';
    if (styleExts.includes(ext)) return 'stylesheet';
    if (fontExts.includes(ext)) return 'font';
    if (pathname.includes('/api/')) return 'api';
    
    return 'document';
  }

  // Analyze test results
  analyzeTestResults(testFile) {
    console.log(`📊 Analyzing test results: ${path.basename(testFile)}`);
    
    if (!fs.existsSync(testFile)) {
      console.log(`⚠️  Test results not found: ${testFile}`);
      return;
    }

    try {
      const content = fs.readFileSync(testFile, 'utf-8');
      const data = JSON.parse(content);
      
      const stats = {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0,
        totalDuration: 0,
        slowTests: []
      };

      if (data.suites && Array.isArray(data.suites)) {
        data.suites.forEach(suite => {
          if (suite.specs && Array.isArray(suite.specs)) {
            suite.specs.forEach(spec => {
              stats.totalTests++;
              
              if (spec.ok) {
                stats.passedTests++;
              } else {
                stats.failedTests++;
              }
              
              if (spec.duration) {
                stats.totalDuration += spec.duration;
                
                // Consider tests > 10 seconds as slow
                if (spec.duration > 10000) {
                  stats.slowTests.push({
                    title: spec.title,
                    duration: spec.duration,
                    suite: suite.title
                  });
                }
              }
            });
          }
        });
      }

      this.results.summary = {
        ...stats,
        averageDuration: stats.totalTests > 0 ? Math.round(stats.totalDuration / stats.totalTests) : 0,
        successRate: stats.totalTests > 0 ? ((stats.passedTests / stats.totalTests) * 100).toFixed(2) : 0
      };

      console.log(`✓ Test analysis complete: ${stats.passedTests}/${stats.totalTests} passed (${this.results.summary.successRate}%)`);
    } catch (error) {
      console.log(`❌ Error analyzing test results: ${error.message}`);
    }
  }

  // Check for security issues
  analyzeSecurityIssues() {
    console.log(`🔒 Analyzing security issues...`);
    
    const securityPatterns = [
      /CSP|Content-Security-Policy/,
      /XSS|Cross-site scripting/,
      /CSRF|Cross-site request forgery/,
      /Mixed Content|mixed-content/,
      /Insecure|insecure/,
      /SSL|TLS|certificate/
    ];

    const allLogs = [
      ...this.results.errors,
      ...this.results.warnings,
      ...(this.results.network.errors || [])
    ];

    const securityIssues = allLogs.filter(log => {
      return securityPatterns.some(pattern => pattern.test(log.content));
    });

    this.results.security = {
      issues: securityIssues,
      count: securityIssues.length,
      severity: securityIssues.length > 0 ? 'high' : 'low'
    };

    console.log(`✓ Security analysis complete: ${securityIssues.length} potential issues found`);
  }

  // Generate comprehensive report
  generateReport() {
    console.log(`📋 Generating comprehensive analysis report...`);
    
    const reportPath = path.join(LOGS_DIR, `analysis-report-${new Date().toISOString().split('T')[0]}.json`);
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalErrors: this.results.errors.length,
        totalWarnings: this.results.warnings.length,
        networkRequests: this.results.network.totalRequests || 0,
        networkErrors: this.results.network.failedRequests || 0,
        securityIssues: this.results.security.count || 0,
        testResults: this.results.summary
      },
      details: this.results
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📊 Analysis Report Summary:`);
    console.log(`├── Errors: ${report.summary.totalErrors}`);
    console.log(`├── Warnings: ${report.summary.totalWarnings}`);
    console.log(`├── Network Requests: ${report.summary.networkRequests}`);
    console.log(`├── Network Errors: ${report.summary.networkErrors}`);
    console.log(`├── Security Issues: ${report.summary.securityIssues}`);
    console.log(`└── Test Success Rate: ${report.summary.testResults?.successRate || 'N/A'}%`);
    console.log(`\n💾 Full report saved to: ${reportPath}`);
    
    return reportPath;
  }

  // Run complete analysis
  async analyze() {
    console.log(`🛡️  Lions of Zion - Advanced Log Analysis Starting...\n`);
    
    // Ensure logs directory exists
    if (!fs.existsSync(LOGS_DIR)) {
      console.log(`❌ Logs directory not found: ${LOGS_DIR}`);
      console.log(`Run './scripts/monitor-chromium.sh setup' first`);
      return;
    }

    // Analyze console logs
    const consoleLog = path.join(LOGS_DIR, 'chromium-console.log');
    const rtlConsoleLog = path.join(LOGS_DIR, 'chromium-rtl-console.log');
    
    this.analyzeConsoleLog(consoleLog);
    this.analyzeConsoleLog(rtlConsoleLog);

    // Analyze network logs
    const networkLog = path.join(LOGS_DIR, 'chromium-net-log.json');
    const rtlNetworkLog = path.join(LOGS_DIR, 'chromium-rtl-net-log.json');
    
    this.analyzeNetworkLog(networkLog);
    this.analyzeNetworkLog(rtlNetworkLog);

    // Analyze test results
    const testResults = path.join(LOGS_DIR, 'test-results.json');
    this.analyzeTestResults(testResults);

    // Security analysis
    this.analyzeSecurityIssues();

    // Generate final report
    const reportPath = this.generateReport();
    
    console.log(`\n✅ Analysis complete! Check the report for detailed insights.`);
    return reportPath;
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new LogAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = LogAnalyzer;