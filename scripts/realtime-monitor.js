#!/usr/bin/env node

/**
 * Lions of Zion - Real-time Browser Monitor
 * Live monitoring dashboard for Chromium logs and performance
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { createInterface } = require('readline');

const LOGS_DIR = path.join(__dirname, '..', 'logs');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

class RealTimeMonitor {
  constructor() {
    this.isRunning = false;
    this.watchers = [];
    this.stats = {
      errors: 0,
      warnings: 0,
      requests: 0,
      failures: 0,
      startTime: new Date()
    };
    
    // Setup readline for interactive commands
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Clear screen and show header
  showHeader() {
    console.clear();
    console.log(`${colors.cyan}${colors.bright}
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🛡️  Lions of Zion - Live Monitor                         ║
║                          Real-time Browser Monitoring                        ║
╚══════════════════════════════════════════════════════════════════════════════╝${colors.reset}
`);
    
    const uptime = Math.floor((new Date() - this.stats.startTime) / 1000);
    const uptimeStr = `${Math.floor(uptime / 60)}m ${uptime % 60}s`;
    
    console.log(`${colors.green}Status: ${this.isRunning ? 'MONITORING' : 'STOPPED'}${colors.reset} | ${colors.yellow}Uptime: ${uptimeStr}${colors.reset} | ${colors.blue}Logs: ${LOGS_DIR}${colors.reset}\n`);
    
    // Show stats
    console.log(`${colors.bright}📊 Session Statistics:${colors.reset}`);
    console.log(`├── Errors: ${colors.red}${this.stats.errors}${colors.reset}`);
    console.log(`├── Warnings: ${colors.yellow}${this.stats.warnings}${colors.reset}`);
    console.log(`├── Network Requests: ${colors.cyan}${this.stats.requests}${colors.reset}`);
    console.log(`└── Network Failures: ${colors.red}${this.stats.failures}${colors.reset}\n`);
  }

  // Watch a log file and process lines
  watchLogFile(filePath, label, color, processor) {
    if (!fs.existsSync(filePath)) {
      console.log(`${colors.yellow}⚠️  Waiting for log file: ${path.basename(filePath)}${colors.reset}`);
      return;
    }

    const tail = spawn('tail', ['-f', filePath]);
    
    tail.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      lines.forEach(line => {
        if (processor) processor(line);
        this.displayLogLine(label, line, color);
      });
    });

    tail.stderr.on('data', (data) => {
      console.log(`${colors.red}Error watching ${label}: ${data}${colors.reset}`);
    });

    this.watchers.push(tail);
  }

  // Process console log lines
  processConsoleLine(line) {
    if (line.includes('ERROR') || line.includes('Error')) {
      this.stats.errors++;
    } else if (line.includes('WARNING') || line.includes('Warning')) {
      this.stats.warnings++;
    }
  }

  // Process network log lines
  processNetworkLine(line) {
    try {
      const data = JSON.parse(line);
      if (data.events) {
        data.events.forEach(event => {
          if (event.type === 'REQUEST_ALIVE') {
            this.stats.requests++;
          } else if (event.type === 'HTTP_TRANSACTION_READ_RESPONSE_HEADERS') {
            const headers = event.params?.headers || '';
            if (headers.includes('HTTP/1.1 4') || headers.includes('HTTP/1.1 5')) {
              this.stats.failures++;
            }
          }
        });
      }
    } catch (e) {
      // Not JSON, ignore
    }
  }

  // Display a log line with formatting
  displayLogLine(label, line, color) {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const maxLength = 120;
    const truncatedLine = line.length > maxLength ? line.substring(0, maxLength) + '...' : line;
    
    // Format based on log level
    let icon = '📝';
    let lineColor = color;
    
    if (line.includes('ERROR') || line.includes('Error')) {
      icon = '🚨';
      lineColor = colors.red;
    } else if (line.includes('WARNING') || line.includes('Warning')) {
      icon = '⚠️ ';
      lineColor = colors.yellow;
    } else if (line.includes('SUCCESS') || line.includes('✓')) {
      icon = '✅';
      lineColor = colors.green;
    }
    
    console.log(`${colors.white}[${timestamp}]${colors.reset} ${icon} ${colors.bright}[${label}]${colors.reset} ${lineColor}${truncatedLine}${colors.reset}`);
  }

  // Watch for new files in logs directory
  watchLogDirectory() {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }

    const chokidar = require('chokidar');
    const watcher = chokidar.watch(LOGS_DIR, { ignored: /^\./, persistent: true });

    watcher.on('add', (filePath) => {
      const fileName = path.basename(filePath);
      if (fileName.endsWith('.log') && !this.watchers.find(w => w.filePath === filePath)) {
        console.log(`${colors.green}📁 New log file detected: ${fileName}${colors.reset}`);
        this.setupFileWatcher(filePath);
      }
    });

    this.watchers.push(watcher);
  }

  // Setup watcher for a specific file
  setupFileWatcher(filePath) {
    const fileName = path.basename(filePath);
    
    if (fileName.includes('console')) {
      this.watchLogFile(filePath, 'CONSOLE', colors.cyan, (line) => this.processConsoleLine(line));
    } else if (fileName.includes('network') || fileName.includes('net-log')) {
      this.watchLogFile(filePath, 'NETWORK', colors.blue, (line) => this.processNetworkLine(line));
    } else if (fileName.includes('error')) {
      this.watchLogFile(filePath, 'ERROR', colors.red);
    } else if (fileName.includes('performance')) {
      this.watchLogFile(filePath, 'PERF', colors.magenta);
    } else {
      this.watchLogFile(filePath, 'LOG', colors.white);
    }
  }

  // Start monitoring
  async start() {
    this.isRunning = true;
    this.showHeader();
    
    console.log(`${colors.green}🚀 Starting real-time monitoring...${colors.reset}\n`);
    
    // Setup initial file watchers
    const logFiles = [
      'chromium-console.log',
      'chromium-rtl-console.log',
      'chromium-net-log.json',
      'chromium-rtl-net-log.json',
      'playwright-console.log',
      'page-errors.log',
      'network-errors.log'
    ];
    
    logFiles.forEach(fileName => {
      const filePath = path.join(LOGS_DIR, fileName);
      this.setupFileWatcher(filePath);
    });
    
    // Watch for new files
    this.watchLogDirectory();
    
    // Update header every 30 seconds
    const headerInterval = setInterval(() => {
      if (this.isRunning) {
        this.showHeader();
      }
    }, 30000);
    
    // Setup interactive commands
    this.setupCommands();
    
    console.log(`${colors.yellow}📋 Commands: 'stats', 'clear', 'analyze', 'help', 'quit'${colors.reset}\n`);
  }

  // Setup interactive commands
  setupCommands() {
    this.rl.on('line', (input) => {
      const command = input.trim().toLowerCase();
      
      switch (command) {
        case 'stats':
          this.showDetailedStats();
          break;
        case 'clear':
          this.showHeader();
          break;
        case 'analyze':
          this.runAnalysis();
          break;
        case 'help':
          this.showHelp();
          break;
        case 'quit':
        case 'exit':
          this.stop();
          break;
        default:
          if (command) {
            console.log(`${colors.red}Unknown command: ${command}. Type 'help' for available commands.${colors.reset}`);
          }
      }
    });
  }

  // Show detailed statistics
  showDetailedStats() {
    console.log(`\n${colors.bright}📊 Detailed Statistics:${colors.reset}`);
    console.log(`├── Session Duration: ${Math.floor((new Date() - this.stats.startTime) / 1000)}s`);
    console.log(`├── Total Errors: ${colors.red}${this.stats.errors}${colors.reset}`);
    console.log(`├── Total Warnings: ${colors.yellow}${this.stats.warnings}${colors.reset}`);
    console.log(`├── Network Requests: ${colors.cyan}${this.stats.requests}${colors.reset}`);
    console.log(`├── Network Failures: ${colors.red}${this.stats.failures}${colors.reset}`);
    console.log(`├── Error Rate: ${this.stats.requests > 0 ? ((this.stats.failures / this.stats.requests) * 100).toFixed(2) : 0}%`);
    console.log(`└── Active Watchers: ${this.watchers.length}\n`);
  }

  // Run quick analysis
  async runAnalysis() {
    console.log(`${colors.blue}🔍 Running quick analysis...${colors.reset}`);
    
    try {
      const LogAnalyzer = require('./log-analyzer.js');
      const analyzer = new LogAnalyzer();
      const reportPath = await analyzer.analyze();
      console.log(`${colors.green}✅ Analysis complete. Report: ${reportPath}${colors.reset}\n`);
    } catch (error) {
      console.log(`${colors.red}❌ Analysis failed: ${error.message}${colors.reset}\n`);
    }
  }

  // Show help
  showHelp() {
    console.log(`\n${colors.bright}🔧 Available Commands:${colors.reset}`);
    console.log(`├── stats   - Show detailed statistics`);
    console.log(`├── clear   - Clear screen and refresh header`);
    console.log(`├── analyze - Run log analysis`);
    console.log(`├── help    - Show this help`);
    console.log(`└── quit    - Stop monitoring and exit\n`);
  }

  // Stop monitoring
  stop() {
    console.log(`\n${colors.yellow}🛑 Stopping monitor...${colors.reset}`);
    
    this.isRunning = false;
    
    // Stop all watchers
    this.watchers.forEach(watcher => {
      try {
        if (watcher.kill) {
          watcher.kill();
        } else if (watcher.close) {
          watcher.close();
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    });
    
    this.rl.close();
    
    console.log(`${colors.green}✅ Monitor stopped. Final stats:${colors.reset}`);
    this.showDetailedStats();
    
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}📡 Received interrupt signal...${colors.reset}`);
  if (global.monitor) {
    global.monitor.stop();
  } else {
    process.exit(0);
  }
});

// Main execution
if (require.main === module) {
  const monitor = new RealTimeMonitor();
  global.monitor = monitor;
  
  // Check for required dependencies
  try {
    require('chokidar');
  } catch (e) {
    console.log(`${colors.red}❌ Missing dependency 'chokidar'. Install with: npm install chokidar${colors.reset}`);
    process.exit(1);
  }
  
  monitor.start().catch(console.error);
}

module.exports = RealTimeMonitor;