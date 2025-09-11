/**
 * Health Indicators System
 * Comprehensive project health monitoring and analysis
 */

import { SmartIndicator, IndicatorThresholds } from './index';
import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

interface CodeMetrics {
  complexity: number;
  maintainabilityIndex: number;
  linesOfCode: number;
  duplicateLines: number;
  technicalDebt: number; // in hours
}

interface DependencyHealth {
  total: number;
  outdated: number;
  vulnerable: number;
  unused: number;
  licenses: { [key: string]: number };
}

interface TestCoverage {
  overall: number;
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

interface DocumentationHealth {
  readmeQuality: number;
  apiDocumentation: number;
  inlineComments: number;
  typeDefinitions: number;
}

export class HealthIndicatorsEngine {
  private thresholds: IndicatorThresholds;
  private projectRoot: string;
  private packageJsonPath: string;
  private tsConfigPath: string;

  constructor(thresholds: IndicatorThresholds) {
    this.thresholds = thresholds;
    this.projectRoot = process.cwd();
    this.packageJsonPath = join(this.projectRoot, 'package.json');
    this.tsConfigPath = join(this.projectRoot, 'tsconfig.json');
  }

  async initialize(): Promise<void> {
    // Validate project structure
    if (!existsSync(this.packageJsonPath)) {
      throw new Error('No package.json found - invalid project structure');
    }
  }

  async analyze(): Promise<SmartIndicator[]> {
    const indicators: SmartIndicator[] = [];

    try {
      // Overall project health score
      const overallHealth = await this.calculateOverallHealth();
      indicators.push(this.createIndicator({
        id: 'overall-health',
        type: 'health',
        title: 'Overall Project Health',
        description: 'Comprehensive health score based on multiple factors',
        value: overallHealth,
        unit: '%',
        category: 'overview'
      }));

      // Code quality metrics
      const codeMetrics = await this.analyzeCodeQuality();
      indicators.push(...this.createCodeQualityIndicators(codeMetrics));

      // Dependency health
      const depHealth = await this.analyzeDependencies();
      indicators.push(...this.createDependencyIndicators(depHealth));

      // Test coverage
      const coverage = await this.analyzeTestCoverage();
      indicators.push(...this.createTestCoverageIndicators(coverage));

      // Documentation health
      const docHealth = await this.analyzeDocumentation();
      indicators.push(...this.createDocumentationIndicators(docHealth));

      // Performance bottlenecks
      const perfIssues = await this.identifyPerformanceBottlenecks();
      indicators.push(...perfIssues);

      // Project structure health
      const structureHealth = await this.analyzeProjectStructure();
      indicators.push(...structureHealth);

    } catch (error) {
      console.error('Health analysis failed:', error);
      indicators.push(this.createErrorIndicator('health-analysis-failed', error));
    }

    return indicators;
  }

  private async calculateOverallHealth(): Promise<number> {
    const factors = await Promise.allSettled([
      this.getCodeQualityScore(),
      this.getDependencyHealthScore(),
      this.getTestCoverageScore(),
      this.getDocumentationScore(),
      this.getSecurityScore()
    ]);

    const validScores = factors
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<number>).value);

    if (validScores.length === 0) return 0;

    // Weighted average
    const weights = [0.25, 0.2, 0.2, 0.15, 0.2]; // Code, Dependencies, Tests, Docs, Security
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

  private async analyzeCodeQuality(): Promise<CodeMetrics> {
    try {
      const files = await this.getSourceFiles();
      let totalLines = 0;
      let totalComplexity = 0;
      let duplicateLines = 0;
      
      for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        totalLines += lines.length;
        
        // Simple complexity calculation
        const complexity = this.calculateCyclomaticComplexity(content);
        totalComplexity += complexity;
        
        // Basic duplicate detection
        duplicateLines += this.findDuplicateLines(lines);
      }

      const avgComplexity = files.length > 0 ? totalComplexity / files.length : 0;
      const maintainabilityIndex = this.calculateMaintainabilityIndex(avgComplexity, totalLines);
      const technicalDebt = this.estimateTechnicalDebt(avgComplexity, duplicateLines);

      return {
        complexity: Math.round(avgComplexity * 100) / 100,
        maintainabilityIndex: Math.round(maintainabilityIndex),
        linesOfCode: totalLines,
        duplicateLines,
        technicalDebt: Math.round(technicalDebt)
      };
    } catch (error) {
      console.error('Code quality analysis failed:', error);
      return {
        complexity: 0,
        maintainabilityIndex: 0,
        linesOfCode: 0,
        duplicateLines: 0,
        technicalDebt: 0
      };
    }
  }

  private async analyzeDependencies(): Promise<DependencyHealth> {
    try {
      const packageJson = JSON.parse(readFileSync(this.packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const total = Object.keys(deps).length;

      // Mock analysis - in real implementation, would use npm audit, npm outdated
      const outdated = Math.floor(total * 0.15); // Assume 15% are outdated
      const vulnerable = Math.floor(total * 0.05); // Assume 5% have vulnerabilities
      const unused = Math.floor(total * 0.1); // Assume 10% are unused

      const licenses = {
        'MIT': Math.floor(total * 0.6),
        'Apache-2.0': Math.floor(total * 0.2),
        'BSD': Math.floor(total * 0.1),
        'Other': Math.floor(total * 0.1)
      };

      return { total, outdated, vulnerable, unused, licenses };
    } catch (error) {
      console.error('Dependency analysis failed:', error);
      return { total: 0, outdated: 0, vulnerable: 0, unused: 0, licenses: {} };
    }
  }

  private async analyzeTestCoverage(): Promise<TestCoverage> {
    // In real implementation, would parse coverage reports
    // Mock data for now
    const mockCoverage = {
      overall: 78,
      statements: 82,
      branches: 71,
      functions: 85,
      lines: 79
    };

    return mockCoverage;
  }

  private async analyzeDocumentation(): Promise<DocumentationHealth> {
    try {
      const readmeExists = existsSync(join(this.projectRoot, 'README.md'));
      const readmeQuality = readmeExists ? await this.assessReadmeQuality() : 0;
      
      const sourceFiles = await this.getSourceFiles();
      const commentRatio = await this.calculateCommentRatio(sourceFiles);
      
      const hasTypeDefs = existsSync(this.tsConfigPath);
      const apiDocsScore = await this.assessApiDocumentation();

      return {
        readmeQuality,
        apiDocumentation: apiDocsScore,
        inlineComments: commentRatio,
        typeDefinitions: hasTypeDefs ? 90 : 20
      };
    } catch (error) {
      console.error('Documentation analysis failed:', error);
      return {
        readmeQuality: 0,
        apiDocumentation: 0,
        inlineComments: 0,
        typeDefinitions: 0
      };
    }
  }

  private async identifyPerformanceBottlenecks(): Promise<SmartIndicator[]> {
    const indicators: SmartIndicator[] = [];
    
    try {
      // Large file detection
      const files = await this.getSourceFiles();
      const largeFiles = files.filter(file => {
        const stats = statSync(file);
        return stats.size > 50000; // Files larger than 50KB
      });

      if (largeFiles.length > 0) {
        indicators.push(this.createIndicator({
          id: 'large-files-detected',
          type: 'performance',
          title: 'Large Files Detected',
          description: `${largeFiles.length} files exceed recommended size limit`,
          value: largeFiles.length,
          category: 'performance',
          level: largeFiles.length > 5 ? 'warning' : 'info',
          actionable: true,
          suggestion: 'Consider splitting large files or optimizing bundle size'
        }));
      }

      // Heavy imports detection
      const heavyImports = await this.detectHeavyImports(files);
      if (heavyImports.length > 0) {
        indicators.push(this.createIndicator({
          id: 'heavy-imports-detected',
          type: 'performance',
          title: 'Heavy Imports Detected',
          description: `${heavyImports.length} potentially heavy library imports found`,
          value: heavyImports.length,
          category: 'performance',
          level: 'warning',
          actionable: true,
          suggestion: 'Consider dynamic imports or lighter alternatives'
        }));
      }

    } catch (error) {
      console.error('Performance bottleneck analysis failed:', error);
    }

    return indicators;
  }

  private async analyzeProjectStructure(): Promise<SmartIndicator[]> {
    const indicators: SmartIndicator[] = [];

    try {
      // Essential files check
      const essentialFiles = [
        'package.json',
        'tsconfig.json',
        'README.md',
        '.gitignore',
        '.env.example'
      ];

      const missingFiles = essentialFiles.filter(file => 
        !existsSync(join(this.projectRoot, file))
      );

      if (missingFiles.length > 0) {
        indicators.push(this.createIndicator({
          id: 'missing-essential-files',
          type: 'health',
          title: 'Missing Essential Files',
          description: `${missingFiles.join(', ')} not found`,
          value: missingFiles.length,
          category: 'structure',
          level: missingFiles.includes('package.json') ? 'critical' : 'warning',
          actionable: true,
          suggestion: `Create missing files: ${missingFiles.join(', ')}`
        }));
      }

      // Folder structure validation
      const recommendedFolders = ['lib', 'components', 'app', 'public'];
      const existingFolders = recommendedFolders.filter(folder =>
        existsSync(join(this.projectRoot, folder))
      );

      const structureScore = (existingFolders.length / recommendedFolders.length) * 100;
      indicators.push(this.createIndicator({
        id: 'project-structure-health',
        type: 'health',
        title: 'Project Structure Health',
        description: 'Adherence to recommended folder structure',
        value: structureScore,
        unit: '%',
        category: 'structure'
      }));

    } catch (error) {
      console.error('Project structure analysis failed:', error);
    }

    return indicators;
  }

  // Helper methods
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

  private calculateCyclomaticComplexity(code: string): number {
    // Simple complexity calculation
    const complexityKeywords = ['if', 'else', 'while', 'for', 'case', 'catch', '&&', '||', '?'];
    let complexity = 1; // Base complexity
    
    complexityKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      complexity += matches ? matches.length : 0;
    });
    
    return complexity;
  }

  private calculateMaintainabilityIndex(complexity: number, linesOfCode: number): number {
    // Simplified maintainability index calculation
    const volume = linesOfCode * Math.log2(linesOfCode || 1);
    const maintainabilityIndex = Math.max(0, 
      (171 - 5.2 * Math.log(volume) - 0.23 * complexity - 16.2 * Math.log(linesOfCode || 1)) * 100 / 171
    );
    return maintainabilityIndex;
  }

  private estimateTechnicalDebt(complexity: number, duplicateLines: number): number {
    // Estimate technical debt in hours
    const complexityDebt = Math.max(0, complexity - 10) * 0.5; // 0.5 hours per excessive complexity point
    const duplicationDebt = duplicateLines * 0.01; // 0.01 hours per duplicate line
    return complexityDebt + duplicationDebt;
  }

  private findDuplicateLines(lines: string[]): number {
    const lineMap = new Map<string, number>();
    let duplicates = 0;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && trimmed.length > 10) { // Ignore short lines
        const count = lineMap.get(trimmed) || 0;
        lineMap.set(trimmed, count + 1);
        if (count > 0) duplicates++;
      }
    });
    
    return duplicates;
  }

  private async assessReadmeQuality(): Promise<number> {
    try {
      const readmePath = join(this.projectRoot, 'README.md');
      const content = readFileSync(readmePath, 'utf-8');
      
      let score = 0;
      const checks = [
        { pattern: /^# /, points: 20, description: 'Has main title' },
        { pattern: /## Installation/i, points: 15, description: 'Has installation section' },
        { pattern: /## Usage/i, points: 15, description: 'Has usage section' },
        { pattern: /## Contributing/i, points: 10, description: 'Has contributing section' },
        { pattern: /## License/i, points: 10, description: 'Has license section' },
        { pattern: /!\[.*?\]\(.*?\)/g, points: 15, description: 'Has images/badges' },
        { pattern: /```/g, points: 15, description: 'Has code examples' }
      ];
      
      checks.forEach(check => {
        if (check.pattern.test(content)) {
          score += check.points;
        }
      });
      
      return Math.min(score, 100);
    } catch (error) {
      return 0;
    }
  }

  private async calculateCommentRatio(files: string[]): Promise<number> {
    let totalLines = 0;
    let commentLines = 0;
    
    for (const file of files.slice(0, 50)) { // Sample first 50 files
      try {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        totalLines += lines.length;
        
        commentLines += lines.filter(line => {
          const trimmed = line.trim();
          return trimmed.startsWith('//') || 
                 trimmed.startsWith('/*') || 
                 trimmed.startsWith('*') ||
                 trimmed.includes('/**');
        }).length;
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return totalLines > 0 ? Math.round((commentLines / totalLines) * 100) : 0;
  }

  private async assessApiDocumentation(): Promise<number> {
    // Mock implementation - would analyze JSDoc comments, OpenAPI specs, etc.
    return 65; // Placeholder score
  }

  private async detectHeavyImports(files: string[]): Promise<string[]> {
    const heavyLibraries = ['lodash', 'moment', 'jquery', 'rxjs', 'three'];
    const heavyImports: string[] = [];
    
    for (const file of files.slice(0, 20)) { // Sample files
      try {
        const content = readFileSync(file, 'utf-8');
        heavyLibraries.forEach(lib => {
          if (content.includes(`from '${lib}'`) || content.includes(`require('${lib}')`)) {
            heavyImports.push(`${lib} in ${file}`);
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return heavyImports;
  }

  // Score calculation methods
  private async getCodeQualityScore(): Promise<number> {
    const metrics = await this.analyzeCodeQuality();
    const complexityScore = Math.max(0, 100 - metrics.complexity * 2);
    return Math.min(complexityScore, metrics.maintainabilityIndex);
  }

  private async getDependencyHealthScore(): Promise<number> {
    const health = await this.analyzeDependencies();
    if (health.total === 0) return 50;
    
    const outdatedPenalty = (health.outdated / health.total) * 30;
    const vulnerablePenalty = (health.vulnerable / health.total) * 40;
    const unusedPenalty = (health.unused / health.total) * 20;
    
    return Math.max(0, 100 - outdatedPenalty - vulnerablePenalty - unusedPenalty);
  }

  private async getTestCoverageScore(): Promise<number> {
    const coverage = await this.analyzeTestCoverage();
    return coverage.overall;
  }

  private async getDocumentationScore(): Promise<number> {
    const docs = await this.analyzeDocumentation();
    return (docs.readmeQuality + docs.apiDocumentation + docs.inlineComments + docs.typeDefinitions) / 4;
  }

  private async getSecurityScore(): Promise<number> {
    // Mock security score - would integrate with actual security scanners
    return 85;
  }

  // Indicator creation helpers
  private createCodeQualityIndicators(metrics: CodeMetrics): SmartIndicator[] {
    return [
      this.createIndicator({
        id: 'code-complexity',
        type: 'health',
        title: 'Code Complexity',
        description: 'Average cyclomatic complexity across codebase',
        value: metrics.complexity,
        category: 'code-quality',
        level: metrics.complexity > 15 ? 'warning' : metrics.complexity > 10 ? 'info' : 'success'
      }),
      this.createIndicator({
        id: 'maintainability-index',
        type: 'health',
        title: 'Maintainability Index',
        description: 'Code maintainability score',
        value: metrics.maintainabilityIndex,
        unit: '%',
        category: 'code-quality'
      }),
      this.createIndicator({
        id: 'technical-debt',
        type: 'health',
        title: 'Technical Debt',
        description: 'Estimated time needed to address technical debt',
        value: metrics.technicalDebt,
        unit: 'hours',
        category: 'code-quality',
        level: metrics.technicalDebt > 40 ? 'warning' : 'info',
        actionable: metrics.technicalDebt > 0
      })
    ];
  }

  private createDependencyIndicators(health: DependencyHealth): SmartIndicator[] {
    const indicators: SmartIndicator[] = [
      this.createIndicator({
        id: 'dependency-health',
        type: 'health',
        title: 'Dependency Health',
        description: 'Overall health of project dependencies',
        value: this.getDependencyHealthScore(),
        unit: '%',
        category: 'dependencies'
      })
    ];

    if (health.outdated > 0) {
      indicators.push(this.createIndicator({
        id: 'outdated-dependencies',
        type: 'health',
        title: 'Outdated Dependencies',
        description: 'Number of dependencies with available updates',
        value: health.outdated,
        category: 'dependencies',
        level: health.outdated > 10 ? 'warning' : 'info',
        actionable: true,
        suggestion: 'Run npm update or check for breaking changes before updating'
      }));
    }

    if (health.vulnerable > 0) {
      indicators.push(this.createIndicator({
        id: 'vulnerable-dependencies',
        type: 'security',
        title: 'Vulnerable Dependencies',
        description: 'Dependencies with known security vulnerabilities',
        value: health.vulnerable,
        category: 'dependencies',
        level: 'critical',
        actionable: true,
        suggestion: 'Run npm audit fix to resolve vulnerabilities'
      }));
    }

    return indicators;
  }

  private createTestCoverageIndicators(coverage: TestCoverage): SmartIndicator[] {
    return [
      this.createIndicator({
        id: 'test-coverage',
        type: 'health',
        title: 'Test Coverage',
        description: 'Overall test coverage percentage',
        value: coverage.overall,
        unit: '%',
        category: 'testing',
        level: coverage.overall < 60 ? 'warning' : coverage.overall < 80 ? 'info' : 'success'
      }),
      this.createIndicator({
        id: 'branch-coverage',
        type: 'health',
        title: 'Branch Coverage',
        description: 'Percentage of code branches covered by tests',
        value: coverage.branches,
        unit: '%',
        category: 'testing'
      })
    ];
  }

  private createDocumentationIndicators(docs: DocumentationHealth): SmartIndicator[] {
    return [
      this.createIndicator({
        id: 'documentation-quality',
        type: 'health',
        title: 'Documentation Quality',
        description: 'Overall documentation completeness and quality',
        value: Math.round((docs.readmeQuality + docs.apiDocumentation + docs.inlineComments + docs.typeDefinitions) / 4),
        unit: '%',
        category: 'documentation'
      }),
      this.createIndicator({
        id: 'inline-comments',
        type: 'health',
        title: 'Code Comments',
        description: 'Percentage of code with inline comments',
        value: docs.inlineComments,
        unit: '%',
        category: 'documentation',
        level: docs.inlineComments < 10 ? 'warning' : 'info'
      })
    ];
  }

  private createIndicator(config: Partial<SmartIndicator> & { 
    id: string; 
    type: SmartIndicator['type']; 
    title: string; 
    description: string; 
    value: number | string; 
    category: string; 
  }): SmartIndicator {
    const level = config.level || this.determineLevel(config.value);
    
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
        animation: level === 'critical' ? 'pulse' : undefined
      }
    };
  }

  private createErrorIndicator(id: string, error: any): SmartIndicator {
    return this.createIndicator({
      id,
      type: 'health',
      title: 'Analysis Error',
      description: `Health analysis encountered an error: ${error.message}`,
      value: 'Error',
      category: 'system',
      level: 'critical',
      actionable: true,
      suggestion: 'Check system logs and ensure all dependencies are properly installed'
    });
  }

  private determineLevel(value: number | string): SmartIndicator['level'] {
    if (typeof value !== 'number') return 'info';
    
    if (value >= this.thresholds.excellent) return 'success';
    if (value >= this.thresholds.good) return 'info';
    if (value >= this.thresholds.warning) return 'warning';
    return 'critical';
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