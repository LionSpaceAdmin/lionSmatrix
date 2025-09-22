#!/usr/bin/env node

/**
 * Development server with automatic browser opening
 * Works in multiple environments: local, Docker, Codespaces, etc.
 */

const { spawn } = require('child_process');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Detect environment
function detectEnvironment() {
  if (process.env.CODESPACES) return 'codespaces';
  if (process.env.GITPOD_WORKSPACE_ID) return 'gitpod';
  if (process.env.DOCKER_ENV) return 'docker';
  return 'local';
}

// Get the appropriate URL based on environment
function getUrl() {
  const env = detectEnvironment();
  
  switch (env) {
    case 'codespaces':
      return `https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev`;
    case 'gitpod':
      return `https://${PORT}-${process.env.GITPOD_WORKSPACE_ID}.${process.env.GITPOD_WORKSPACE_CLUSTER_HOST}`;
    case 'docker':
      return `http://${HOST}:${PORT}`;
    default:
      return `http://localhost:${PORT}`;
  }
}

// Wait for server to be ready
function waitForServer(url, callback) {
  const maxAttempts = 30;
  let attempts = 0;
  
  const check = () => {
    attempts++;
    try {
      execSync(`curl -s "${url}" > /dev/null`, { stdio: 'ignore' });
      callback();
    } catch (error) {
      if (attempts < maxAttempts) {
        setTimeout(check, 1000);
      } else {
        console.log(`❌ Could not connect to ${url} after ${maxAttempts} attempts`);
      }
    }
  };
  
  setTimeout(check, 2000); // Initial delay
}

// Open browser
function openBrowser(url) {
  const env = detectEnvironment();
  
  console.log(`🌍 Environment: ${env}`);
  console.log(`🚀 Opening ${url}`);
  
  if (env === 'local') {
    // Try different browser opening methods
    try {
      if (process.platform === 'darwin') {
        execSync(`open "${url}"`);
      } else if (process.platform === 'win32') {
        execSync(`start "${url}"`);
      } else {
        // Linux/Unix
        const browsers = ['xdg-open', 'google-chrome', 'firefox', 'chromium-browser'];
        for (const browser of browsers) {
          try {
            execSync(`which ${browser}`, { stdio: 'ignore' });
            execSync(`${browser} "${url}" &`, { stdio: 'ignore' });
            break;
          } catch (e) {
            continue;
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not automatically open browser. Please visit: ${url}`);
    }
  } else {
    console.log(`📋 Copy this URL to your browser: ${url}`);
  }
}

// Main function
function main() {
  console.log('🚀 Starting Next.js development server with automatic browser opening...');
  
  // Start Next.js dev server
  const nextProcess = spawn('pnpm', ['next', 'dev'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: PORT.toString() }
  });
  
  // Wait for server and open browser
  const url = getUrl();
  waitForServer(url, () => openBrowser(url));
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    nextProcess.kill('SIGINT');
    process.exit(0);
  });
  
  nextProcess.on('close', (code) => {
    process.exit(code);
  });
}

// Export functions for testing
module.exports = { detectEnvironment, getUrl, openBrowser };

if (require.main === module) {
  main();
}