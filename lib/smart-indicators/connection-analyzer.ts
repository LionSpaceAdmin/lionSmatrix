/**
 * Connection Analyzer
 * Advanced dependency and connection health analysis for network topology
 */

import { SmartIndicator, IndicatorLevel } from './index';
import { existsSync, readFileSync } from 'fs';
import { join, dirname, relative, resolve } from 'path';
import { glob } from 'glob';

interface ImportExportMap {
  file: string;
  imports: ImportInfo[];
  exports: ExportInfo[];
  dependencies: string[];
}

interface ImportInfo {
  source: string;
  specifiers: string[];
  isDefault: boolean;
  isDynamic: boolean;
  line: number;
}

interface ExportInfo {
  name: string;
  isDefault: boolean;
  line: number;
  type: 'function' | 'class' | 'variable' | 'type' | 'interface';
}

interface ConnectionIssue {
  type: 'broken-import' | 'missing-dependency' | 'circular-dependency' | 'orphaned-file' | 'unused-export';
  severity: IndicatorLevel.CRITICAL | IndicatorLevel.WARNING | IndicatorLevel.INFO;
  file: string;
  details: string;
  suggestion: string;
}

interface CircularDependency {
  cycle: string[];
  severity: IndicatorLevel.CRITICAL | IndicatorLevel.WARNING;
  impact: number; // Number of files affected
}

interface ComponentUsage {
  component: string;
  file: string;
  usageCount: number;
  importedBy: string[];
  exports: string[];
}

export class ConnectionAnalyzer {
  private projectRoot: string;
  private importExportMap: Map<string, ImportExportMap> = new Map();
  private packageJson: any;
  private nodeModulesPath: string;

  constructor() {
    this.projectRoot = process.cwd();
    this.nodeModulesPath = join(this.projectRoot, 'node_modules');
  }

  async initialize(): Promise<void> {
    try {
      const packageJsonPath = join(this.projectRoot, 'package.json');
      if (existsSync(packageJsonPath)) {
        this.packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      }
      
      await this.buildImportExportMap();
    } catch (error) {
      console.error('Connection analyzer initialization failed:', error);
    }
  }

  async analyze(): Promise<SmartIndicator[]> {
    const indicators: SmartIndicator[] = [];

    try {
      // Detect broken imports and exports
      const brokenConnections = await this.detectBrokenConnections();
      indicators.push(...this.createBrokenConnectionIndicators(brokenConnections));

      // Find missing dependencies
      const missingDeps = await this.detectMissingDependencies();
      indicators.push(...this.createMissingDependencyIndicators(missingDeps));

      // Identify circular dependencies
      const circularDeps = await this.detectCircularDependencies();
      indicators.push(...this.createCircularDependencyIndicators(circularDeps));

      // Find orphaned files
      const orphanedFiles = await this.detectOrphanedFiles();
      indicators.push(...this.createOrphanedFileIndicators(orphanedFiles));

      // Analyze component usage efficiency
      const usageAnalysis = await this.analyzeComponentUsage();
      indicators.push(...this.createUsageEfficiencyIndicators(usageAnalysis));

      // Validate route connectivity
      const routeIssues = await this.validateRouteConnectivity();
      indicators.push(...this.createRouteConnectivityIndicators(routeIssues));

      // Overall connection health
      const overallHealth = this.calculateConnectionHealth(indicators);
      indicators.unshift(this.createIndicator({
        id: 'connection-health-overall',
        type: 'connection',
        title: 'Connection Health',
        description: 'Overall health of imports, exports, and dependencies',
        value: overallHealth,
        unit: '%',
        category: 'connections'
      }));

    } catch (error) {
      console.error('Connection analysis failed:', error);
      indicators.push(this.createErrorIndicator('connection-analysis-failed', error));
    }

    return indicators;
  }

  private async buildImportExportMap(): Promise<void> {
    const sourceFiles = await this.getSourceFiles();
    
    for (const file of sourceFiles) {
      try {
        const content = readFileSync(file, 'utf-8');
        const imports = this.parseImports(content);
        const exports = this.parseExports(content);
        const dependencies = this.extractDependencies(imports);

        this.importExportMap.set(file, {
          file,
          imports,
          exports,
          dependencies
        });
      } catch (error) {
        console.error(`Failed to analyze file ${file}:`, error);
      }
    }
  }

  private parseImports(content: string): ImportInfo[] {
    const imports: ImportInfo[] = [];
    // const lines = content.split('\n'); // TODO: Implement line-by-line parsing

    // Regular import statements
    const importRegex = /^import\s+(?:(\w+)(?:\s*,\s*)?)?(?:\{\s*([^}]+)\s*\})?\s*from\s+['"]([^'"]+)['"]/gm;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const [, defaultImport, namedImports, source] = match;
      const lineNumber = content.substring(0, match.index).split('\n').length;
      
      const specifiers: string[] = [];
      if (defaultImport) specifiers.push(defaultImport);
      if (namedImports) {
        specifiers.push(...namedImports.split(',').map(s => s.trim()));
      }

      if (source) {
        imports.push({
          source,
          specifiers,
          isDefault: !!defaultImport,
          isDynamic: false,
          line: lineNumber
        });
      }
    }

    // Dynamic imports
    const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      const [, source] = match;
      const lineNumber = content.substring(0, match.index).split('\n').length;

      if (source) {
        imports.push({
          source,
          specifiers: [],
          isDefault: false,
          isDynamic: true,
          line: lineNumber
        });
      }
    }

    // Require statements
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      const [, source] = match;
      const lineNumber = content.substring(0, match.index).split('\n').length;

      if (source) {
        imports.push({
          source,
          specifiers: [],
          isDefault: true,
          isDynamic: false,
          line: lineNumber
        });
      }
    }

    return imports;
  }

  private parseExports(content: string): ExportInfo[] {
    const exports: ExportInfo[] = [];

    // Named exports
    const namedExportRegex = /export\s+(?:const|let|var|function|class|interface|type)\s+(\w+)/g;
    let match;

    while ((match = namedExportRegex.exec(content)) !== null) {
      const [, name] = match;
      const lineNumber = content.substring(0, match.index).split('\n').length;
      
      const type = this.determineExportType(match[0]);
      exports.push({
        name: name || '',
        isDefault: false,
        line: lineNumber,
        type
      });
    }

    // Default exports
    const defaultExportRegex = /export\s+default\s+(?:(?:function|class)\s+(\w+)|(\w+))/g;
    while ((match = defaultExportRegex.exec(content)) !== null) {
      const [, namedDefault, identifier] = match;
      const lineNumber = content.substring(0, match.index).split('\n').length;
      
      exports.push({
        name: namedDefault || identifier || 'default',
        isDefault: true,
        line: lineNumber,
        type: this.determineExportType(match[0])
      });
    }

    // Export { ... } statements
    const exportListRegex = /export\s*\{\s*([^}]+)\s*\}/g;
    while ((match = exportListRegex.exec(content)) !== null) {
      const [, exportList] = match;
      const lineNumber = content.substring(0, match.index).split('\n').length;
      
      if (exportList) {
        const exportNames = exportList.split(',').map(name => name.trim());
        exportNames.forEach(name => {
          exports.push({
            name: name.split(' as ')[0], // Handle "export { foo as bar }"
            isDefault: false,
            line: lineNumber,
            type: 'variable'
          });
        });
      }
    }

    return exports;
  }

  private extractDependencies(imports: ImportInfo[]): string[] {
    return imports
      .map(imp => imp.source)
      .filter(source => !source.startsWith('.') && !source.startsWith('/'))
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  }

  private determineExportType(exportStatement: string): ExportInfo['type'] {
    if (exportStatement.includes('function')) return 'function';
    if (exportStatement.includes('class')) return 'class';
    if (exportStatement.includes('interface')) return 'interface';
    if (exportStatement.includes('type')) return 'type';
    return 'variable';
  }

  private async detectBrokenConnections(): Promise<ConnectionIssue[]> {
    const issues: ConnectionIssue[] = [];

    for (const [filePath, fileInfo] of this.importExportMap) {
      for (const importInfo of fileInfo.imports) {
        // Skip node_modules imports for now
        if (!importInfo.source.startsWith('.') && !importInfo.source.startsWith('/')) {
          continue;
        }

        const resolvedPath = this.resolveImportPath(filePath, importInfo.source);
        if (!existsSync(resolvedPath)) {
          issues.push({
            type: 'broken-import',
            severity: IndicatorLevel.CRITICAL,
            file: filePath,
            details: `Cannot resolve import "${importInfo.source}" at line ${importInfo.line}`,
            suggestion: `Check if the file exists at ${resolvedPath} or update the import path`
          });
        } else {
          // Check if imported items actually exist
          const targetFileInfo = this.importExportMap.get(resolvedPath);
          if (targetFileInfo) {
            const missingImports = importInfo.specifiers.filter(spec => 
              !targetFileInfo.exports.some(exp => exp.name === spec)
            );

            if (missingImports.length > 0) {
              issues.push({
                type: 'broken-import',
                severity: IndicatorLevel.WARNING,
                file: filePath,
                details: `Importing non-existent items: ${missingImports.join(', ')} from ${importInfo.source}`,
                suggestion: `Check available exports in ${importInfo.source} or remove unused imports`
              });
            }
          }
        }
      }
    }

    return issues;
  }

  private async detectMissingDependencies(): Promise<ConnectionIssue[]> {
    const issues: ConnectionIssue[] = [];
    
    if (!this.packageJson) return issues;

    const installedDeps = new Set([
      ...Object.keys(this.packageJson.dependencies || {}),
      ...Object.keys(this.packageJson.devDependencies || {})
    ]);

    const usedDeps = new Set<string>();
    
    for (const fileInfo of this.importExportMap.values()) {
      fileInfo.dependencies.forEach(dep => {
        // Extract root package name (handle scoped packages)
        const rootDep = dep.startsWith('@') ? dep.split('/').slice(0, 2).join('/') : dep.split('/')[0];
        if (rootDep) {
          usedDeps.add(rootDep);
        }
      });
    }

    // Find missing dependencies
    for (const dep of usedDeps) {
      if (!installedDeps.has(dep) && !existsSync(join(this.nodeModulesPath, dep))) {
        issues.push({
          type: 'missing-dependency',
          severity: IndicatorLevel.CRITICAL,
          file: 'package.json',
          details: `Dependency "${dep}" is used but not declared in package.json`,
          suggestion: `Add "${dep}" to dependencies: npm install ${dep}`
        });
      }
    }

    // Find unused dependencies
    for (const dep of installedDeps) {
      if (!usedDeps.has(dep) && !this.isKnownUtilityDep(dep)) {
        issues.push({
          type: 'missing-dependency',
          severity: IndicatorLevel.INFO,
          file: 'package.json',
          details: `Dependency "${dep}" is declared but appears unused`,
          suggestion: `Consider removing unused dependency: npm uninstall ${dep}`
        });
      }
    }

    return issues;
  }

  private async detectCircularDependencies(): Promise<CircularDependency[]> {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const circularDeps: CircularDependency[] = [];

    const dfs = (file: string, path: string[]): void => {
      if (recursionStack.has(file)) {
        // Found a cycle
        const cycleStart = path.indexOf(file);
        const cycle = path.slice(cycleStart);
        cycle.push(file); // Complete the cycle

        const severity = cycle.length > 5 ? IndicatorLevel.CRITICAL : IndicatorLevel.WARNING;
        circularDeps.push({
          cycle: cycle.map(f => relative(this.projectRoot, f)),
          severity,
          impact: cycle.length
        });
        return;
      }

      if (visited.has(file)) return;

      visited.add(file);
      recursionStack.add(file);

      const fileInfo = this.importExportMap.get(file);
      if (fileInfo) {
        for (const importInfo of fileInfo.imports) {
          if (importInfo.source.startsWith('.') || importInfo.source.startsWith('/')) {
            const resolvedPath = this.resolveImportPath(file, importInfo.source);
            if (existsSync(resolvedPath)) {
              dfs(resolvedPath, [...path, file]);
            }
          }
        }
      }

      recursionStack.delete(file);
    };

    for (const file of this.importExportMap.keys()) {
      if (!visited.has(file)) {
        dfs(file, []);
      }
    }

    return circularDeps;
  }

  private async detectOrphanedFiles(): Promise<string[]> {
    const orphanedFiles: string[] = [];
    const referencedFiles = new Set<string>();
    
    // Collect all referenced files
    for (const fileInfo of this.importExportMap.values()) {
      for (const importInfo of fileInfo.imports) {
        if (importInfo.source.startsWith('.') || importInfo.source.startsWith('/')) {
          const resolvedPath = this.resolveImportPath(fileInfo.file, importInfo.source);
          referencedFiles.add(resolvedPath);
        }
      }
    }

    // Entry points that shouldn't be considered orphaned
    const entryPoints = new Set([
      join(this.projectRoot, 'app'),
      join(this.projectRoot, 'pages'),
      join(this.projectRoot, 'src/app'),
      join(this.projectRoot, 'src/pages')
    ]);

    // Check each file
    for (const file of this.importExportMap.keys()) {
      const isEntryPoint = Array.from(entryPoints).some(entry => 
        file.startsWith(entry) && file.includes('page.')
      );
      
      if (!referencedFiles.has(file) && !isEntryPoint) {
        // Additional check: files with certain patterns are likely not orphaned
        const fileName = file.split('/').pop() || '';
        const isConfig = fileName.includes('.config.') || fileName.startsWith('.');
        const isTest = fileName.includes('.test.') || fileName.includes('.spec.');
        const isStorybook = fileName.includes('.stories.');
        
        if (!isConfig && !isTest && !isStorybook) {
          orphanedFiles.push(file);
        }
      }
    }

    return orphanedFiles;
  }

  private async analyzeComponentUsage(): Promise<ComponentUsage[]> {
    const usage: ComponentUsage[] = [];
    const componentMap = new Map<string, ComponentUsage>();

    // Initialize components
    for (const [file, fileInfo] of this.importExportMap) {
      if (this.isComponentFile(file)) {
        for (const exportInfo of fileInfo.exports) {
          const key = `${file}:${exportInfo.name}`;
          componentMap.set(key, {
            component: exportInfo.name,
            file: relative(this.projectRoot, file),
            usageCount: 0,
            importedBy: [],
            exports: [exportInfo.name]
          });
        }
      }
    }

    // Count usage
    for (const [file, fileInfo] of this.importExportMap) {
      for (const importInfo of fileInfo.imports) {
        const resolvedPath = this.resolveImportPath(file, importInfo.source);
        
        for (const specifier of importInfo.specifiers) {
          const key = `${resolvedPath}:${specifier}`;
          const component = componentMap.get(key);
          if (component) {
            component.usageCount++;
            component.importedBy.push(relative(this.projectRoot, file));
          }
        }
      }
    }

    return Array.from(componentMap.values());
  }

  private async validateRouteConnectivity(): Promise<ConnectionIssue[]> {
    const issues: ConnectionIssue[] = [];
    
    try {
      // Look for Next.js app directory structure
      const appDir = join(this.projectRoot, 'app');
      if (existsSync(appDir)) {
        const routeFiles = await this.findRouteFiles(appDir);
        
        for (const routeFile of routeFiles) {
          const fileInfo = this.importExportMap.get(routeFile);
          if (!fileInfo) continue;

          // Check if route files have proper exports
          const hasDefaultExport = fileInfo.exports.some(exp => exp.isDefault);
          const hasNamedPageExport = fileInfo.exports.some(exp => exp.name === 'default' || exp.name === 'Page');
          
          if (!hasDefaultExport && !hasNamedPageExport) {
            issues.push({
              type: 'broken-import',
              severity: IndicatorLevel.WARNING,
              file: routeFile,
              details: 'Route file missing default export or Page component',
              suggestion: 'Add a default export or named Page export to this route file'
            });
          }
        }
      }
    } catch (error) {
      console.error('Route connectivity validation failed:', error);
    }

    return issues;
  }

  private calculateConnectionHealth(indicators: SmartIndicator[]): number {
    const criticalIssues = indicators.filter(i => i.level === IndicatorLevel.CRITICAL).length;
    const warningIssues = indicators.filter(i => i.level === IndicatorLevel.WARNING).length;
    
    const totalFiles = this.importExportMap.size;
    if (totalFiles === 0) return 0;

    const criticalPenalty = (criticalIssues / totalFiles) * 50;
    const warningPenalty = (warningIssues / totalFiles) * 20;
    
    return Math.max(0, Math.round(100 - criticalPenalty - warningPenalty));
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

  private resolveImportPath(fromFile: string, importPath: string): string {
    if (importPath.startsWith('/')) {
      return join(this.projectRoot, importPath);
    }
    
    const baseDir = dirname(fromFile);
    const resolved = resolve(baseDir, importPath);
    
    // Try different extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
    
    if (existsSync(resolved)) {
      return resolved;
    }
    
    for (const ext of extensions) {
      const withExt = resolved + ext;
      if (existsSync(withExt)) {
        return withExt;
      }
    }
    
    // Try index files
    for (const ext of extensions) {
      const indexFile = join(resolved, `index${ext}`);
      if (existsSync(indexFile)) {
        return indexFile;
      }
    }
    
    return resolved;
  }

  private isKnownUtilityDep(dep: string): boolean {
    const utilityDeps = [
      '@types/',
      'eslint',
      'prettier',
      'typescript',
      'jest',
      'vitest',
      '@testing-library/',
      'playwright',
      'webpack',
      'vite',
      'rollup',
      'babel'
    ];
    
    return utilityDeps.some(util => dep.includes(util));
  }

  private isComponentFile(file: string): boolean {
    const componentPatterns = [
      /components?/i,
      /\.component\./,
      /\.tsx$/,
      /ui/i
    ];
    
    return componentPatterns.some(pattern => pattern.test(file));
  }

  private async findRouteFiles(dir: string): Promise<string[]> {
    return new Promise((resolve) => {
      glob('**/page.{ts,tsx,js,jsx}', { cwd: dir }, (err, files) => {
        if (err) {
          resolve([]);
        } else {
          resolve(files.map(file => join(dir, file)));
        }
      });
    });
  }

  // Indicator creation methods
  private createBrokenConnectionIndicators(issues: ConnectionIssue[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    const criticalIssues = issues.filter(issue => issue.severity === IndicatorLevel.CRITICAL);
    const warningIssues = issues.filter(issue => issue.severity === IndicatorLevel.WARNING);

    if (criticalIssues.length > 0) {
      indicators.push(this.createIndicator({
        id: 'broken-imports-critical',
        type: 'connection',
        title: 'Critical Import Issues',
        description: `${criticalIssues.length} critical import/export issues found`,
        value: criticalIssues.length,
        category: 'imports',
        level: IndicatorLevel.CRITICAL,
        actionable: true,
        suggestion: 'Fix broken imports to prevent runtime errors'
      }));
    }

    if (warningIssues.length > 0) {
      indicators.push(this.createIndicator({
        id: 'broken-imports-warning',
        type: 'connection',
        title: 'Import Warnings',
        description: `${warningIssues.length} import issues that may cause problems`,
        value: warningIssues.length,
        category: 'imports',
        level: IndicatorLevel.WARNING,
        actionable: true,
        suggestion: 'Review and fix import warnings'
      }));
    }

    return indicators;
  }

  private createMissingDependencyIndicators(issues: ConnectionIssue[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    const missing = issues.filter(issue => issue.details.includes('not declared'));
    const unused = issues.filter(issue => issue.details.includes('appears unused'));

    if (missing.length > 0) {
      indicators.push(this.createIndicator({
        id: 'missing-dependencies',
        type: 'connection',
        title: 'Missing Dependencies',
        description: `${missing.length} dependencies are used but not declared`,
        value: missing.length,
        category: 'dependencies',
        level: IndicatorLevel.CRITICAL,
        actionable: true,
        suggestion: 'Add missing dependencies to package.json'
      }));
    }

    if (unused.length > 0) {
      indicators.push(this.createIndicator({
        id: 'unused-dependencies',
        type: 'connection',
        title: 'Unused Dependencies',
        description: `${unused.length} dependencies appear to be unused`,
        value: unused.length,
        category: 'dependencies',
        level: IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Remove unused dependencies to reduce bundle size'
      }));
    }

    return indicators;
  }

  private createCircularDependencyIndicators(circularDeps: CircularDependency[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (circularDeps.length > 0) {
      const critical = circularDeps.filter(dep => dep.severity === IndicatorLevel.CRITICAL);
      const warnings = circularDeps.filter(dep => dep.severity === IndicatorLevel.WARNING);

      if (critical.length > 0) {
        indicators.push(this.createIndicator({
          id: 'circular-dependencies-critical',
          type: 'connection',
          title: 'Critical Circular Dependencies',
          description: `${critical.length} complex circular dependencies detected`,
          value: critical.length,
          category: 'architecture',
          level: IndicatorLevel.CRITICAL,
          actionable: true,
          suggestion: 'Refactor code to eliminate circular dependencies'
        }));
      }

      if (warnings.length > 0) {
        indicators.push(this.createIndicator({
          id: 'circular-dependencies-warning',
          type: 'connection',
          title: 'Circular Dependencies',
          description: `${warnings.length} circular dependencies found`,
          value: warnings.length,
          category: 'architecture',
          level: IndicatorLevel.WARNING,
          actionable: true,
          suggestion: 'Consider refactoring to reduce circular dependencies'
        }));
      }
    }

    return indicators;
  }

  private createOrphanedFileIndicators(orphanedFiles: string[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (orphanedFiles.length > 0) {
      indicators.push(this.createIndicator({
        id: 'orphaned-files',
        type: 'connection',
        title: 'Orphaned Files',
        description: `${orphanedFiles.length} files appear to be unused`,
        value: orphanedFiles.length,
        category: 'cleanup',
        level: IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Review and remove unused files to keep codebase clean'
      }));
    }

    return indicators;
  }

  private createUsageEfficiencyIndicators(usage: ComponentUsage[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    const unusedComponents = usage.filter(comp => comp.usageCount === 0);
    // const overusedComponents = usage.filter(comp => comp.usageCount > 20); // TODO: Implement overused components analysis
    const avgUsage = usage.length > 0 ? usage.reduce((sum, comp) => sum + comp.usageCount, 0) / usage.length : 0;

    if (unusedComponents.length > 0) {
      indicators.push(this.createIndicator({
        id: 'unused-components',
        type: 'connection',
        title: 'Unused Components',
        description: `${unusedComponents.length} components are not being used`,
        value: unusedComponents.length,
        category: 'components',
        level: IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Remove unused components or consider if they should be used'
      }));
    }

    indicators.push(this.createIndicator({
      id: 'component-usage-efficiency',
      type: 'connection',
      title: 'Component Usage Efficiency',
      description: 'Average component usage across the codebase',
      value: Math.round(avgUsage * 100) / 100,
      category: 'components',
      level: avgUsage < 2 ? IndicatorLevel.WARNING : IndicatorLevel.INFO
    }));

    return indicators;
  }

  private createRouteConnectivityIndicators(issues: ConnectionIssue[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (issues.length > 0) {
      indicators.push(this.createIndicator({
        id: 'route-connectivity-issues',
        type: 'connection',
        title: 'Route Connectivity Issues',
        description: `${issues.length} route files have connectivity problems`,
        value: issues.length,
        category: 'routing',
        level: IndicatorLevel.WARNING,
        actionable: true,
        suggestion: 'Fix route export issues to ensure proper navigation'
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
      type: 'connection',
      title: 'Connection Analysis Error',
      description: `Connection analysis encountered an error: ${error.message}`,
      value: 'Error',
      category: 'system',
      level: IndicatorLevel.CRITICAL,
      actionable: true,
      suggestion: 'Check system logs and file permissions'
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
}