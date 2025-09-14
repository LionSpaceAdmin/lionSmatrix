/**
 * Performance Metrics System
 * Advanced performance monitoring and optimization insights
 */

import { SmartIndicator, IndicatorThresholds, IndicatorLevel } from './index';
import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

interface BundleAnalysis {
  totalSize: number;
  chunkSizes: { [key: string]: number };
  duplicateModules: string[];
  heavyDependencies: { name: string; size: number }[];
  treeShakingOpportunities: string[];
}

interface PerformanceBottleneck {
  type: 'large-bundle' | 'heavy-computation' | 'memory-leak' | 'blocking-resource';
  file: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  estimatedSavings: string;
  suggestion: string;
}

interface WebVitalsEstimation {
  lcp: { score: number; issues: string[] }; // Largest Contentful Paint
  fid: { score: number; issues: string[] }; // First Input Delay
  cls: { score: number; issues: string[] }; // Cumulative Layout Shift
  fcp: { score: number; issues: string[] }; // First Contentful Paint
  ttfb: { score: number; issues: string[] }; // Time to First Byte
}

interface LoadTimeAnalysis {
  jsExecutionTime: number;
  cssParseTime: number;
  imageOptimization: number;
  fontLoadingTime: number;
  apiResponseTime: number;
}

interface MemoryUsageAnalysis {
  potentialLeaks: string[];
  heavyObjects: string[];
  unusedCode: string[];
  optimizationOpportunities: string[];
}

export class PerformanceMetrics {
  private thresholds: IndicatorThresholds;
  private projectRoot: string;
  private buildDir: string;
  private publicDir: string;

  constructor(thresholds: IndicatorThresholds) {
    this.thresholds = thresholds;
    this.projectRoot = process.cwd();
    this.buildDir = join(this.projectRoot, '.next');
    this.publicDir = join(this.projectRoot, 'public');
  }

  async initialize(): Promise<void> {
    // Check if build directory exists
    if (!existsSync(this.buildDir)) {
      console.warn('Build directory not found - some performance metrics will be limited');
    }
  }

  async analyze(): Promise<SmartIndicator[]> {
    const indicators: SmartIndicator[] = [];

    try {
      // Overall performance score
      const overallScore = await this.calculateOverallPerformanceScore();
      indicators.push(this.createIndicator({
        id: 'performance-score-overall',
        type: 'performance',
        title: 'Overall Performance Score',
        description: 'Comprehensive performance health score',
        value: overallScore,
        unit: '%',
        category: 'overview'
      }));

      // Bundle size analysis
      const bundleAnalysis = await this.analyzeBundleSize();
      indicators.push(...this.createBundleSizeIndicators(bundleAnalysis));

      // Identify large files
      const largeFiles = await this.identifyLargeFiles();
      indicators.push(...this.createLargeFileIndicators(largeFiles));

      // Heavy computation detection
      const heavyComputations = await this.detectHeavyComputations();
      indicators.push(...this.createHeavyComputationIndicators(heavyComputations));

      // Memory leak indicators
      const memoryAnalysis = await this.analyzeMemoryUsage();
      indicators.push(...this.createMemoryUsageIndicators(memoryAnalysis));

      // Web Vitals estimation
      const webVitals = await this.estimateWebVitals();
      indicators.push(...this.createWebVitalsIndicators(webVitals));

      // Load time impact analysis
      const loadTimeAnalysis = await this.analyzeLoadTimeImpact();
      indicators.push(...this.createLoadTimeIndicators(loadTimeAnalysis));

      // Unused code detection
      const unusedCode = await this.detectUnusedCode();
      indicators.push(...this.createUnusedCodeIndicators(unusedCode));

      // Performance bottlenecks
      const bottlenecks = await this.identifyPerformanceBottlenecks();
      indicators.push(...this.createBottleneckIndicators(bottlenecks));

    } catch (error) {
      console.error('Performance analysis failed:', error);
      indicators.push(this.createErrorIndicator('performance-analysis-failed', error));
    }

    return indicators;
  }

  private async calculateOverallPerformanceScore(): Promise<number> {
    const factors = await Promise.allSettled([
      this.getBundleSizeScore(),
      this.getMemoryUsageScore(),
      this.getWebVitalsScore(),
      this.getLoadTimeScore(),
      this.getCodeOptimizationScore()
    ]);

    const validScores = factors
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<number>).value);

    if (validScores.length === 0) return 0;

    // Weighted average
    const weights = [0.25, 0.2, 0.25, 0.15, 0.15]; // Bundle, Memory, Web Vitals, Load Time, Code Optimization
    let weightedSum = 0;
    let totalWeight = 0;

    validScores.forEach((score, index) => {
      if (index < weights.length) {
        weightedSum += score * weights[index];
        totalWeight += weights[index];
      }
    });

    return Math.round(weightedSum / totalWeight);
  }

  private async analyzeBundleSize(): Promise<BundleAnalysis> {
    try {
      const buildManifestPath = join(this.buildDir, 'build-manifest.json');
      const staticDir = join(this.buildDir, 'static');
      
      let totalSize = 0;
      const chunkSizes: { [key: string]: number } = {};
      const duplicateModules: string[] = [];
      const heavyDependencies: { name: string; size: number }[] = [];

      // Analyze build output if available
      if (existsSync(buildManifestPath)) {
        const manifest = JSON.parse(readFileSync(buildManifestPath, 'utf-8'));
        
        // Analyze chunks
        if (manifest.pages) {
          for (const [page, files] of Object.entries(manifest.pages)) {
            let pageSize = 0;
            for (const file of files as string[]) {
              const filePath = join(staticDir, file);
              if (existsSync(filePath)) {
                const stats = statSync(filePath);
                pageSize += stats.size;
                totalSize += stats.size;
              }
            }
            chunkSizes[page] = pageSize;
          }
        }
      } else {
        // Fallback: analyze source files
        const sourceFiles = await this.getSourceFiles();
        for (const file of sourceFiles) {
          const stats = statSync(file);
          totalSize += stats.size;
          
          if (stats.size > 100000) { // Files larger than 100KB
            const relativePath = file.replace(this.projectRoot, '');
            heavyDependencies.push({
              name: relativePath,
              size: stats.size
            });
          }
        }
      }

      // Mock tree-shaking opportunities (would require actual bundle analysis)
      const treeShakingOpportunities = [
        'lodash (use specific imports)',
        'moment (consider date-fns)',
        'rxjs (use specific operators)'
      ];

      return {
        totalSize,
        chunkSizes,
        duplicateModules,
        heavyDependencies: heavyDependencies.sort((a, b) => b.size - a.size),
        treeShakingOpportunities
      };
    } catch (error) {
      console.error('Bundle analysis failed:', error);
      return {
        totalSize: 0,
        chunkSizes: {},
        duplicateModules: [],
        heavyDependencies: [],
        treeShakingOpportunities: []
      };
    }
  }

  private async identifyLargeFiles(): Promise<{ file: string; size: number; type: string }[]> {
    const largeFiles: { file: string; size: number; type: string }[] = [];
    
    try {
      const files = await this.getAllProjectFiles();
      
      for (const file of files) {
        try {
          const stats = statSync(file);
          const sizeThresholds = {
            '.js': 50000,   // 50KB
            '.jsx': 50000,  // 50KB  
            '.ts': 50000,   // 50KB
            '.tsx': 50000,  // 50KB
            '.css': 30000,  // 30KB
            '.json': 20000, // 20KB
            '.png': 500000, // 500KB
            '.jpg': 500000, // 500KB
            '.jpeg': 500000, // 500KB
            '.svg': 50000,  // 50KB
          };
          
          const ext = file.substring(file.lastIndexOf('.'));
          const threshold = sizeThresholds[ext] || 100000; // Default 100KB
          
          if (stats.size > threshold) {
            largeFiles.push({
              file: file.replace(this.projectRoot, ''),
              size: stats.size,
              type: this.getFileType(ext)
            });
          }
        } catch (error) {
          // Skip files that can't be accessed
        }
      }
      
      return largeFiles.sort((a, b) => b.size - a.size);
    } catch (error) {
      console.error('Large file detection failed:', error);
      return [];
    }
  }

  private async detectHeavyComputations(): Promise<string[]> {
    const heavyComputations: string[] = [];
    
    try {
      const sourceFiles = await this.getSourceFiles();
      
      const heavyPatterns = [
        /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/g, // Nested loops
        /while\s*\([^)]*\)\s*\{[^}]*while\s*\([^)]*\)/g, // Nested while loops
        /\.map\([^)]*\)\.filter\([^)]*\)\.map\([^)]*\)/g, // Chained array methods
        /JSON\.parse\(.*JSON\.stringify/g, // JSON deep copy
        /document\.querySelector\([^)]*\)/g, // DOM queries (should be minimized)
        /setInterval\(.*,\s*[0-9]+\)/g, // Frequent intervals
        /setTimeout\(.*,\s*0\)/g, // setTimeout(0) - potential performance issue
      ];
      
      for (const file of sourceFiles.slice(0, 50)) { // Limit analysis
        try {
          const content = readFileSync(file, 'utf-8');
          
          for (const pattern of heavyPatterns) {
            if (pattern.test(content)) {
              heavyComputations.push(file.replace(this.projectRoot, ''));
              break; // One detection per file is enough
            }
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    } catch (error) {
      console.error('Heavy computation detection failed:', error);
    }
    
    return heavyComputations;
  }

  private async analyzeMemoryUsage(): Promise<MemoryUsageAnalysis> {
    const analysis: MemoryUsageAnalysis = {
      potentialLeaks: [],
      heavyObjects: [],
      unusedCode: [],
      optimizationOpportunities: []
    };
    
    try {
      const sourceFiles = await this.getSourceFiles();
      
      const memoryLeakPatterns = [
        /addEventListener\([^)]*\)/g, // Event listeners without cleanup
        /setInterval\([^)]*\)/g, // Intervals without cleanup
        /new\s+Array\(\d{6,}\)/g, // Large array allocations
        /new\s+Map\(\)/g, // Map usage (check for cleanup)
        /new\s+Set\(\)/g, // Set usage (check for cleanup)
      ];
      
      const heavyObjectPatterns = [
        /new\s+Date\(/g, // Excessive date object creation
        /new\s+RegExp\(/g, // Dynamic regex creation
        /JSON\.parse\(/g, // JSON parsing
        /Buffer\.from\(/g, // Buffer creation
      ];
      
      for (const file of sourceFiles.slice(0, 30)) { // Limit analysis
        try {
          const content = readFileSync(file, 'utf-8');
          const relativePath = file.replace(this.projectRoot, '');
          
          // Check for potential memory leaks
          for (const pattern of memoryLeakPatterns) {
            const matches = content.match(pattern);
            if (matches && matches.length > 3) { // Multiple instances
              analysis.potentialLeaks.push(relativePath);
              break;
            }
          }
          
          // Check for heavy object creation
          for (const pattern of heavyObjectPatterns) {
            const matches = content.match(pattern);
            if (matches && matches.length > 10) { // Many instances
              analysis.heavyObjects.push(relativePath);
              break;
            }
          }
          
          // Check for unused imports (simplified)
          const importMatches = content.match(/import\s+[^;]+from\s+['"'][^'"]+['"]/g);
          if (importMatches) {
            const unusedImports = importMatches.filter(importLine => {
              const importedName = importLine.match(/import\s+(\w+)/)?.[1];
              if (importedName) {
                const usageRegex = new RegExp(`\\b${importedName}\\b`, 'g');
                const usages = content.match(usageRegex);
                return usages && usages.length === 1; // Only the import itself
              }
              return false;
            });
            
            if (unusedImports.length > 0) {
              analysis.unusedCode.push(relativePath);
            }
          }
          
        } catch (error) {
          // Skip files that can't be read
        }
      }
      
      // Generate optimization opportunities
      if (analysis.potentialLeaks.length > 0) {
        analysis.optimizationOpportunities.push('Add cleanup for event listeners and intervals');
      }
      if (analysis.heavyObjects.length > 0) {
        analysis.optimizationOpportunities.push('Consider object pooling for frequently created objects');
      }
      if (analysis.unusedCode.length > 0) {
        analysis.optimizationOpportunities.push('Remove unused imports to reduce bundle size');
      }
      
    } catch (error) {
      console.error('Memory usage analysis failed:', error);
    }
    
    return analysis;
  }

  private async estimateWebVitals(): Promise<WebVitalsEstimation> {
    // This would integrate with actual performance monitoring in production
    // For now, we'll estimate based on code patterns and file sizes
    
    const bundleAnalysis = await this.analyzeBundleSize();
    const largeFiles = await this.identifyLargeFiles();
    const sourceFiles = await this.getSourceFiles();
    
    // LCP estimation (Largest Contentful Paint)
    const lcpScore = this.estimateLCP(bundleAnalysis, largeFiles);
    
    // FID estimation (First Input Delay)  
    const fidScore = this.estimateFID(sourceFiles);
    
    // CLS estimation (Cumulative Layout Shift)
    const clsScore = this.estimateCLS(sourceFiles);
    
    // FCP estimation (First Contentful Paint)
    const fcpScore = this.estimateFCP(bundleAnalysis);
    
    // TTFB estimation (Time to First Byte)
    const ttfbScore = this.estimateTTFB();
    
    return {
      lcp: lcpScore,
      fid: fidScore,
      cls: clsScore,
      fcp: fcpScore,
      ttfb: ttfbScore
    };
  }

  private async analyzeLoadTimeImpact(): Promise<LoadTimeAnalysis> {
    const bundleAnalysis = await this.analyzeBundleSize();
    
    return {
      jsExecutionTime: this.estimateJSExecutionTime(bundleAnalysis.totalSize),
      cssParseTime: this.estimateCSSParseTime(),
      imageOptimization: await this.analyzeImageOptimization(),
      fontLoadingTime: this.estimateFontLoadingTime(),
      apiResponseTime: this.estimateApiResponseTime()
    };
  }

  private async detectUnusedCode(): Promise<string[]> {
    // Simplified unused code detection
    // In a real implementation, this would use tools like webpack-bundle-analyzer
    
    const unusedFiles: string[] = [];
    const sourceFiles = await this.getSourceFiles();
    
    // Mock detection based on common patterns
    for (const file of sourceFiles.slice(0, 20)) {
      try {
        const content = readFileSync(file, 'utf-8');
        
        // Check for files that might be unused
        const hasExports = /export\s+/g.test(content);
        const hasImports = /import\s+[^;]+from/g.test(content);
        
        if (hasExports && !hasImports) {
          // File exports but isn't imported anywhere (potential dead code)
          const relativePath = file.replace(this.projectRoot, '');
          if (!relativePath.includes('page.') && !relativePath.includes('layout.')) {
            unusedFiles.push(relativePath);
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return unusedFiles;
  }

  private async identifyPerformanceBottlenecks(): Promise<PerformanceBottleneck[]> {
    const bottlenecks: PerformanceBottleneck[] = [];
    
    try {
      const bundleAnalysis = await this.analyzeBundleSize();
      const largeFiles = await this.identifyLargeFiles();
      const heavyComputations = await this.detectHeavyComputations();
      const memoryAnalysis = await this.analyzeMemoryUsage();
      
      // Large bundle bottleneck
      if (bundleAnalysis.totalSize > 5000000) { // 5MB
        bottlenecks.push({
          type: 'large-bundle',
          file: 'Bundle',
          impact: 'high',
          description: `Total bundle size is ${Math.round(bundleAnalysis.totalSize / 1024 / 1024 * 10) / 10}MB`,
          estimatedSavings: '2-5 seconds faster load time',
          suggestion: 'Implement code splitting and lazy loading'
        });
      }
      
      // Large files
      largeFiles.slice(0, 3).forEach(file => {
        bottlenecks.push({
          type: 'blocking-resource',
          file: file.file,
          impact: file.size > 200000 ? 'high' : 'medium',
          description: `Large ${file.type} file (${Math.round(file.size / 1024)}KB)`,
          estimatedSavings: '0.5-2 seconds faster load time',
          suggestion: file.type === 'image' ? 'Optimize and compress images' : 'Consider code splitting'
        });
      });
      
      // Heavy computations
      heavyComputations.slice(0, 2).forEach(file => {
        bottlenecks.push({
          type: 'heavy-computation',
          file: file,
          impact: 'medium',
          description: 'Contains computationally expensive operations',
          estimatedSavings: '100-500ms faster execution',
          suggestion: 'Consider memoization or moving computation to web workers'
        });
      });
      
      // Memory leaks
      memoryAnalysis.potentialLeaks.slice(0, 2).forEach(file => {
        bottlenecks.push({
          type: 'memory-leak',
          file: file,
          impact: 'medium',
          description: 'Potential memory leak patterns detected',
          estimatedSavings: 'Prevent memory bloat over time',
          suggestion: 'Add proper cleanup for event listeners and intervals'
        });
      });
      
    } catch (error) {
      console.error('Performance bottleneck identification failed:', error);
    }
    
    return bottlenecks;
  }

  // Helper methods for Web Vitals estimation
  private estimateLCP(bundleAnalysis: BundleAnalysis, largeFiles: any[]): { score: number; issues: string[] } {
    let score = 85; // Base score
    const issues: string[] = [];
    
    // Penalize large bundles
    if (bundleAnalysis.totalSize > 3000000) { // 3MB
      score -= 20;
      issues.push('Large bundle size affects LCP');
    }
    
    // Penalize large images
    const largeImages = largeFiles.filter(f => f.type === 'image');
    if (largeImages.length > 0) {
      score -= largeImages.length * 10;
      issues.push('Large images slow down LCP');
    }
    
    return { score: Math.max(0, score), issues };
  }

  private estimateFID(sourceFiles: string[]): { score: number; issues: string[] } {
    let score = 90; // Base score
    const issues: string[] = [];
    
    // Estimate based on bundle size (simplified)
    if (sourceFiles.length > 200) {
      score -= 15;
      issues.push('Large number of files may impact FID');
    }
    
    return { score: Math.max(0, score), issues };
  }

  private estimateCLS(sourceFiles: string[]): { score: number; issues: string[] } {
    const score = 95; // Base score (CLS is usually good in React apps)
    const issues: string[] = [];
    
    // This would check for dynamic content insertion patterns
    return { score, issues };
  }

  private estimateFCP(bundleAnalysis: BundleAnalysis): { score: number; issues: string[] } {
    let score = 80; // Base score
    const issues: string[] = [];
    
    if (bundleAnalysis.totalSize > 2000000) { // 2MB
      score -= 20;
      issues.push('Large bundle affects FCP');
    }
    
    return { score: Math.max(0, score), issues };
  }

  private estimateTTFB(): { score: number; issues: string[] } {
    // Would integrate with server monitoring
    return { score: 85, issues: [] };
  }

  // Other helper methods
  private estimateJSExecutionTime(bundleSize: number): number {
    // Rough estimation: 1MB ≈ 100ms execution time
    return Math.round(bundleSize / 1024 / 1024 * 100);
  }

  private estimateCSSParseTime(): number {
    // Mock estimation
    return 50; // ms
  }

  private async analyzeImageOptimization(): Promise<number> {
    let score = 100;
    
    try {
      const imageFiles = await this.getImageFiles();
      let unoptimizedCount = 0;
      
      for (const file of imageFiles) {
        const stats = statSync(file);
        const ext = file.substring(file.lastIndexOf('.'));
        
        // Check if images are potentially unoptimized
        const sizeThresholds = {
          '.png': 200000,  // 200KB
          '.jpg': 300000,  // 300KB
          '.jpeg': 300000, // 300KB
        };
        
        const threshold = sizeThresholds[ext];
        if (threshold && stats.size > threshold) {
          unoptimizedCount++;
        }
      }
      
      if (imageFiles.length > 0) {
        score = Math.max(0, 100 - (unoptimizedCount / imageFiles.length * 100));
      }
    } catch (error) {
      console.error('Image optimization analysis failed:', error);
    }
    
    return Math.round(score);
  }

  private estimateFontLoadingTime(): number {
    // Mock estimation - would check for font loading strategies
    return 200; // ms
  }

  private estimateApiResponseTime(): number {
    // Mock estimation - would integrate with actual API monitoring
    return 300; // ms
  }

  // Score calculation methods
  private async getBundleSizeScore(): Promise<number> {
    const analysis = await this.analyzeBundleSize();
    if (analysis.totalSize === 0) return 50;
    
    // Score based on bundle size (lower is better)
    const sizeMB = analysis.totalSize / 1024 / 1024;
    
    if (sizeMB < 1) return 100;
    if (sizeMB < 2) return 85;
    if (sizeMB < 3) return 70;
    if (sizeMB < 5) return 50;
    return 30;
  }

  private async getMemoryUsageScore(): Promise<number> {
    const analysis = await this.analyzeMemoryUsage();
    let score = 100;
    
    score -= analysis.potentialLeaks.length * 10;
    score -= analysis.heavyObjects.length * 5;
    score -= analysis.unusedCode.length * 2;
    
    return Math.max(0, score);
  }

  private async getWebVitalsScore(): Promise<number> {
    const vitals = await this.estimateWebVitals();
    return Math.round((vitals.lcp.score + vitals.fid.score + vitals.cls.score + vitals.fcp.score + vitals.ttfb.score) / 5);
  }

  private async getLoadTimeScore(): Promise<number> {
    const analysis = await this.analyzeLoadTimeImpact();
    
    let score = 100;
    
    // Penalize slow execution times
    if (analysis.jsExecutionTime > 500) score -= 20;
    if (analysis.jsExecutionTime > 1000) score -= 30;
    
    if (analysis.imageOptimization < 70) score -= 15;
    if (analysis.fontLoadingTime > 300) score -= 10;
    
    return Math.max(0, score);
  }

  private async getCodeOptimizationScore(): Promise<number> {
    const unusedCode = await this.detectUnusedCode();
    const bottlenecks = await this.identifyPerformanceBottlenecks();
    
    let score = 100;
    
    score -= unusedCode.length * 5;
    score -= bottlenecks.filter(b => b.impact === 'high').length * 15;
    score -= bottlenecks.filter(b => b.impact === 'medium').length * 10;
    
    return Math.max(0, score);
  }

  // File system helpers
  private async getSourceFiles(): Promise<string[]> {
    return new Promise((resolve) => {
      glob('**/*.{ts,tsx,js,jsx}', {
        cwd: this.projectRoot,
        ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
      }, (err, files) => {
        if (err) {
          console.error('Error finding source files:', err);
          resolve([]);
        } else {
          resolve(files.map(file => join(this.projectRoot, file)));
        }
      });
    });
  }

  private async getAllProjectFiles(): Promise<string[]> {
    return new Promise((resolve) => {
      glob('**/*', {
        cwd: this.projectRoot,
        ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**', '.git/**']
      }, (err, files) => {
        if (err) {
          console.error('Error finding project files:', err);
          resolve([]);
        } else {
          resolve(files.map(file => join(this.projectRoot, file)));
        }
      });
    });
  }

  private async getImageFiles(): Promise<string[]> {
    return new Promise((resolve) => {
      glob('**/*.{png,jpg,jpeg,gif,svg,webp}', {
        cwd: this.projectRoot,
        ignore: ['node_modules/**', '.next/**']
      }, (err, files) => {
        if (err) {
          console.error('Error finding image files:', err);
          resolve([]);
        } else {
          resolve(files.map(file => join(this.projectRoot, file)));
        }
      });
    });
  }

  private getFileType(extension: string): string {
    const typeMap: { [key: string]: string } = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.css': 'stylesheet',
      '.scss': 'stylesheet',
      '.json': 'data',
      '.png': 'image',
      '.jpg': 'image',
      '.jpeg': 'image',
      '.gif': 'image',
      '.svg': 'image',
      '.webp': 'image'
    };
    
    return typeMap[extension] || 'unknown';
  }

  // Indicator creation methods
  private createBundleSizeIndicators(analysis: BundleAnalysis): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    const sizeMB = Math.round(analysis.totalSize / 1024 / 1024 * 10) / 10;
    
    indicators.push(this.createIndicator({
      id: 'bundle-size-total',
      type: 'performance',
      title: 'Total Bundle Size',
      description: 'Combined size of all JavaScript bundles',
      value: sizeMB,
      unit: 'MB',
      category: 'bundle',
      level: sizeMB > 5 ? IndicatorLevel.CRITICAL : sizeMB > 3 ? IndicatorLevel.WARNING : IndicatorLevel.INFO
    }));

    if (analysis.heavyDependencies.length > 0) {
      indicators.push(this.createIndicator({
        id: 'heavy-dependencies',
        type: 'performance',
        title: 'Heavy Dependencies',
        description: `${analysis.heavyDependencies.length} large dependencies detected`,
        value: analysis.heavyDependencies.length,
        category: 'bundle',
        level: analysis.heavyDependencies.length > 3 ? IndicatorLevel.WARNING : IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Consider lighter alternatives or dynamic imports'
      }));
    }

    if (analysis.treeShakingOpportunities.length > 0) {
      indicators.push(this.createIndicator({
        id: 'tree-shaking-opportunities',
        type: 'performance',
        title: 'Tree Shaking Opportunities',
        description: 'Libraries that could benefit from tree shaking',
        value: analysis.treeShakingOpportunities.length,
        category: 'optimization',
        level: IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Use specific imports instead of importing entire libraries'
      }));
    }

    return indicators;
  }

  private createLargeFileIndicators(largeFiles: { file: string; size: number; type: string }[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (largeFiles.length > 0) {
      indicators.push(this.createIndicator({
        id: 'large-files-count',
        type: 'performance',
        title: 'Large Files',
        description: `${largeFiles.length} files exceed size recommendations`,
        value: largeFiles.length,
        category: 'files',
        level: largeFiles.length > 5 ? IndicatorLevel.WARNING : IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Consider splitting large files or optimizing content'
      }));

      // Show largest file
      const largest = largeFiles[0];
      const sizeMB = Math.round(largest.size / 1024 / 1024 * 100) / 100;
      
      indicators.push(this.createIndicator({
        id: 'largest-file',
        type: 'performance',
        title: 'Largest File',
        description: `${largest.file} (${largest.type})`,
        value: sizeMB,
        unit: 'MB',
        category: 'files',
        level: sizeMB > 1 ? IndicatorLevel.WARNING : IndicatorLevel.INFO
      }));
    }

    return indicators;
  }

  private createHeavyComputationIndicators(computations: string[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (computations.length > 0) {
      indicators.push(this.createIndicator({
        id: 'heavy-computations',
        type: 'performance',
        title: 'Heavy Computations',
        description: `${computations.length} files contain expensive operations`,
        value: computations.length,
        category: 'computation',
        level: computations.length > 3 ? IndicatorLevel.WARNING : IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Consider optimization techniques like memoization or web workers'
      }));
    }

    return indicators;
  }

  private createMemoryUsageIndicators(analysis: MemoryUsageAnalysis): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (analysis.potentialLeaks.length > 0) {
      indicators.push(this.createIndicator({
        id: 'potential-memory-leaks',
        type: 'performance',
        title: 'Potential Memory Leaks',
        description: `${analysis.potentialLeaks.length} files may have memory leak patterns`,
        value: analysis.potentialLeaks.length,
        category: 'memory',
        level: IndicatorLevel.WARNING,
        actionable: true,
        suggestion: 'Add cleanup for event listeners and intervals'
      }));
    }

    if (analysis.unusedCode.length > 0) {
      indicators.push(this.createIndicator({
        id: 'unused-imports',
        type: 'performance',
        title: 'Unused Imports',
        description: `${analysis.unusedCode.length} files contain unused imports`,
        value: analysis.unusedCode.length,
        category: 'optimization',
        level: IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Remove unused imports to reduce bundle size'
      }));
    }

    return indicators;
  }

  private createWebVitalsIndicators(vitals: WebVitalsEstimation): SmartIndicator[] {
    return [
      this.createIndicator({
        id: 'web-vitals-lcp',
        type: 'performance',
        title: 'Largest Contentful Paint',
        description: 'Estimated LCP performance score',
        value: vitals.lcp.score,
        unit: '%',
        category: 'web-vitals',
        level: vitals.lcp.score < 60 ? IndicatorLevel.WARNING : IndicatorLevel.INFO
      }),
      this.createIndicator({
        id: 'web-vitals-fid',
        type: 'performance',
        title: 'First Input Delay',
        description: 'Estimated FID performance score',
        value: vitals.fid.score,
        unit: '%',
        category: 'web-vitals',
        level: vitals.fid.score < 60 ? IndicatorLevel.WARNING : IndicatorLevel.INFO
      }),
      this.createIndicator({
        id: 'web-vitals-cls',
        type: 'performance',
        title: 'Cumulative Layout Shift',
        description: 'Estimated CLS performance score',
        value: vitals.cls.score,
        unit: '%',
        category: 'web-vitals',
        level: vitals.cls.score < 60 ? IndicatorLevel.WARNING : IndicatorLevel.INFO
      })
    ];
  }

  private createLoadTimeIndicators(analysis: LoadTimeAnalysis): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    indicators.push(this.createIndicator({
      id: 'js-execution-time',
      type: 'performance',
      title: 'JS Execution Time',
      description: 'Estimated JavaScript execution time',
      value: analysis.jsExecutionTime,
      unit: 'ms',
      category: 'load-time',
      level: analysis.jsExecutionTime > 1000 ? IndicatorLevel.WARNING : IndicatorLevel.INFO
    }));

    indicators.push(this.createIndicator({
      id: 'image-optimization-score',
      type: 'performance',
      title: 'Image Optimization',
      description: 'Image optimization efficiency score',
      value: analysis.imageOptimization,
      unit: '%',
      category: 'load-time',
      level: analysis.imageOptimization < 70 ? IndicatorLevel.WARNING : IndicatorLevel.INFO,
      actionable: analysis.imageOptimization < 90,
      suggestion: 'Optimize and compress images for better performance'
    }));

    return indicators;
  }

  private createUnusedCodeIndicators(unusedFiles: string[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (unusedFiles.length > 0) {
      indicators.push(this.createIndicator({
        id: 'unused-code-files',
        type: 'performance',
        title: 'Potentially Unused Files',
        description: `${unusedFiles.length} files may contain unused code`,
        value: unusedFiles.length,
        category: 'optimization',
        level: IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Review and remove unused files to reduce bundle size'
      }));
    }

    return indicators;
  }

  private createBottleneckIndicators(bottlenecks: PerformanceBottleneck[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    const criticalBottlenecks = bottlenecks.filter(b => b.impact === 'high');
    const mediumBottlenecks = bottlenecks.filter(b => b.impact === 'medium');

    if (criticalBottlenecks.length > 0) {
      indicators.push(this.createIndicator({
        id: 'critical-performance-bottlenecks',
        type: 'performance',
        title: 'Critical Performance Issues',
        description: `${criticalBottlenecks.length} high-impact performance bottlenecks`,
        value: criticalBottlenecks.length,
        category: 'bottlenecks',
        level: IndicatorLevel.CRITICAL,
        actionable: true,
        suggestion: 'Address critical bottlenecks for significant performance gains'
      }));
    }

    if (mediumBottlenecks.length > 0) {
      indicators.push(this.createIndicator({
        id: 'medium-performance-bottlenecks',
        type: 'performance',
        title: 'Performance Optimization Opportunities',
        description: `${mediumBottlenecks.length} medium-impact optimization opportunities`,
        value: mediumBottlenecks.length,
        category: 'bottlenecks',
        level: IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Optimize these areas for improved performance'
      }));
    }

    return indicators;
  }

  private createIndicator(config: Partial<SmartIndicator> & { 
    id: string; 
    type: SmartIndicator['type']; 
    title: string; 
    description: string; 
    value: number | string; 
    category: string; 
  }): SmartIndicator {
    const level = config.level || IndicatorLevel.INFO;
    
    return {
      id: config.id,
      type: config.type,
      level,
      title: config.title,
      description: config.description,
      value: config.value,
      unit: config.unit,
      trend: config.trend,
      category: config.category,
      timestamp: new Date(),
      actionable: config.actionable || false,
      suggestion: config.suggestion,
      visualConfig: {
        color: this.getLevelColor(level),
        icon: this.getTypeIcon(config.type),
        animation: level === IndicatorLevel.CRITICAL ? 'pulse' : undefined
      }
    };
  }

  private createErrorIndicator(id: string, error: any): SmartIndicator {
    return this.createIndicator({
      id,
      type: 'performance',
      title: 'Performance Analysis Error',
      description: `Performance analysis encountered an error: ${error.message}`,
      value: 'Error',
      category: 'system',
      level: IndicatorLevel.CRITICAL,
      actionable: true,
      suggestion: 'Check system permissions and build configuration'
    });
  }

  private getLevelColor(level: SmartIndicator['level']): string {
    const colors = {
      critical: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      success: '#10b981'
    };
    return colors[level];
  }

  private getTypeIcon(type: SmartIndicator['type']): string {
    const icons = {
      health: '❤️',
      connection: '🔗',
      performance: '⚡',
      security: '🛡️',
      suggestion: '💡'
    };
    return icons[type] || '📊';
  }

  updateThresholds(thresholds: IndicatorThresholds): void {
    this.thresholds = thresholds;
  }
}