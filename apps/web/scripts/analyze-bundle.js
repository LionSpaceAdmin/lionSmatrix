#!/usr/bin/env node

/**
 * Bundle Analysis Script for Lions of Zion
 * Analyzes bundle size and provides optimization recommendations
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const BUNDLE_SIZE_LIMITS = {
  initial: 200 * 1024, // 200KB initial bundle
  total: 500 * 1024,   // 500KB total JS
  css: 50 * 1024,      // 50KB CSS
}

const COLORS = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

function colorize(text, color) {
  return `${COLORS[color]}${text}${COLORS.reset}`
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

function analyzeManifest() {
  const buildManifestPath = path.join(__dirname, '../.next/build-manifest.json')
  
  if (!fs.existsSync(buildManifestPath)) {
    console.log(colorize('❌ Build manifest not found. Run `npm run build` first.', 'red'))
    return null
  }

  const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'))
  return manifest
}

function analyzeStaticFiles() {
  const staticDir = path.join(__dirname, '../.next/static')
  
  if (!fs.existsSync(staticDir)) {
    console.log(colorize('❌ Static files not found. Run `npm run build` first.', 'red'))
    return {}
  }

  const analysis = {
    js: { files: [], totalSize: 0 },
    css: { files: [], totalSize: 0 },
    chunks: {},
  }

  function scanDirectory(dir, relativePath = '') {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const relativeFilePath = path.join(relativePath, file)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, relativeFilePath)
      } else if (stat.isFile()) {
        const ext = path.extname(file)
        const size = stat.size
        
        if (ext === '.js') {
          analysis.js.files.push({ name: relativeFilePath, size })
          analysis.js.totalSize += size
          
          // Categorize chunks
          if (file.includes('framework-')) {
            analysis.chunks.framework = (analysis.chunks.framework || 0) + size
          } else if (file.includes('main-')) {
            analysis.chunks.main = (analysis.chunks.main || 0) + size
          } else if (file.includes('webpack-')) {
            analysis.chunks.webpack = (analysis.chunks.webpack || 0) + size
          } else if (file.includes('pages-')) {
            analysis.chunks.pages = (analysis.chunks.pages || 0) + size
          } else {
            analysis.chunks.other = (analysis.chunks.other || 0) + size
          }
        } else if (ext === '.css') {
          analysis.css.files.push({ name: relativeFilePath, size })
          analysis.css.totalSize += size
        }
      }
    }
  }

  scanDirectory(staticDir)
  return analysis
}

function generateRecommendations(analysis) {
  const recommendations = []
  
  // Check bundle size limits
  if (analysis.js.totalSize > BUNDLE_SIZE_LIMITS.total) {
    recommendations.push({
      type: 'error',
      message: `Total JS bundle size (${formatBytes(analysis.js.totalSize)}) exceeds limit (${formatBytes(BUNDLE_SIZE_LIMITS.total)})`,
      suggestions: [
        'Enable code splitting for large components',
        'Use dynamic imports for heavy libraries',
        'Remove unused dependencies',
        'Enable tree shaking optimization',
      ]
    })
  }

  if (analysis.css.totalSize > BUNDLE_SIZE_LIMITS.css) {
    recommendations.push({
      type: 'warning',
      message: `CSS bundle size (${formatBytes(analysis.css.totalSize)}) exceeds recommended limit (${formatBytes(BUNDLE_SIZE_LIMITS.css)})`,
      suggestions: [
        'Remove unused CSS classes',
        'Use Tailwind CSS purge for production',
        'Consider CSS-in-JS for component-scoped styles',
      ]
    })
  }

  // Check for large individual files
  const largeJSFiles = analysis.js.files.filter(f => f.size > 100 * 1024) // >100KB
  if (largeJSFiles.length > 0) {
    recommendations.push({
      type: 'warning',
      message: `Found ${largeJSFiles.length} large JavaScript files`,
      suggestions: largeJSFiles.map(f => `Split ${f.name} (${formatBytes(f.size)})`),
    })
  }

  // Check framework chunk size
  if (analysis.chunks.framework && analysis.chunks.framework > 150 * 1024) {
    recommendations.push({
      type: 'info',
      message: `Framework chunk is large (${formatBytes(analysis.chunks.framework)})`,
      suggestions: [
        'This is usually acceptable for React/Next.js',
        'Ensure you are not bundling server-side libraries in client',
      ]
    })
  }

  return recommendations
}

function printAnalysis(analysis) {
  console.log(colorize('\n🔍 Bundle Analysis Report\n', 'bold'))
  console.log('━'.repeat(50))
  
  // Overall stats
  console.log(colorize('\n📊 Overall Statistics:', 'blue'))
  console.log(`Total JavaScript: ${formatBytes(analysis.js.totalSize)}`)
  console.log(`Total CSS: ${formatBytes(analysis.css.totalSize)}`)
  console.log(`Total Assets: ${formatBytes(analysis.js.totalSize + analysis.css.totalSize)}`)
  
  // Budget status
  const jsBudgetStatus = analysis.js.totalSize <= BUNDLE_SIZE_LIMITS.total ? 'green' : 'red'
  const cssBudgetStatus = analysis.css.totalSize <= BUNDLE_SIZE_LIMITS.css ? 'green' : 'yellow'
  
  console.log(colorize('\n💰 Budget Status:', 'blue'))
  console.log(`JavaScript: ${colorize(formatBytes(analysis.js.totalSize), jsBudgetStatus)} / ${formatBytes(BUNDLE_SIZE_LIMITS.total)}`)
  console.log(`CSS: ${colorize(formatBytes(analysis.css.totalSize), cssBudgetStatus)} / ${formatBytes(BUNDLE_SIZE_LIMITS.css)}`)
  
  // Chunk breakdown
  if (Object.keys(analysis.chunks).length > 0) {
    console.log(colorize('\n📦 Chunk Breakdown:', 'blue'))
    Object.entries(analysis.chunks)
      .sort(([,a], [,b]) => b - a)
      .forEach(([name, size]) => {
        console.log(`${name.padEnd(12)}: ${formatBytes(size)}`)
      })
  }
  
  // Top 10 largest files
  const allFiles = [...analysis.js.files, ...analysis.css.files]
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
  
  if (allFiles.length > 0) {
    console.log(colorize('\n📁 Largest Files:', 'blue'))
    allFiles.forEach((file, index) => {
      const sizeColor = file.size > 100 * 1024 ? 'red' : file.size > 50 * 1024 ? 'yellow' : 'green'
      console.log(`${(index + 1).toString().padStart(2)}. ${file.name.padEnd(40)} ${colorize(formatBytes(file.size), sizeColor)}`)
    })
  }
}

function printRecommendations(recommendations) {
  if (recommendations.length === 0) {
    console.log(colorize('\n✅ No optimization recommendations. Great job!', 'green'))
    return
  }
  
  console.log(colorize('\n💡 Optimization Recommendations:', 'blue'))
  console.log('━'.repeat(50))
  
  recommendations.forEach((rec, index) => {
    const icon = rec.type === 'error' ? '❌' : rec.type === 'warning' ? '⚠️' : 'ℹ️'
    const color = rec.type === 'error' ? 'red' : rec.type === 'warning' ? 'yellow' : 'blue'
    
    console.log(`\n${icon} ${colorize(rec.message, color)}`)
    
    if (rec.suggestions && rec.suggestions.length > 0) {
      rec.suggestions.forEach(suggestion => {
        console.log(`   • ${suggestion}`)
      })
    }
  })
}

function main() {
  console.log(colorize('🚀 Lions of Zion Bundle Analyzer', 'bold'))
  
  try {
    // Check if build exists
    const analysis = analyzeStaticFiles()
    
    if (!analysis.js || analysis.js.files.length === 0) {
      console.log(colorize('\n❌ No build files found. Please run `npm run build` first.', 'red'))
      process.exit(1)
    }
    
    // Print analysis
    printAnalysis(analysis)
    
    // Generate and print recommendations
    const recommendations = generateRecommendations(analysis)
    printRecommendations(recommendations)
    
    // Success/failure status
    const hasErrors = recommendations.some(r => r.type === 'error')
    
    if (hasErrors) {
      console.log(colorize('\n❌ Bundle analysis completed with errors. Please address the issues above.', 'red'))
      process.exit(1)
    } else {
      console.log(colorize('\n✅ Bundle analysis completed successfully!', 'green'))
    }
    
  } catch (error) {
    console.error(colorize(`\n❌ Error during analysis: ${error.message}`, 'red'))
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  analyzeStaticFiles,
  generateRecommendations,
  BUNDLE_SIZE_LIMITS,
}