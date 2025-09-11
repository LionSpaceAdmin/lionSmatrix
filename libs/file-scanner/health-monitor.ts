/**
 * Health Monitor
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Comprehensive project health analysis and issue detection system
 */

import path from 'path';
import {
  FileNode,
  DependencyGraph,
  RouteGraph,
  ComponentMap,
  ProjectHealth,
  HealthIssue,
  MissingDependency,
  DeadCodeInfo,
  TypeScriptError,
  PerformanceIssue,
  SecurityIssue,
  IssueType,
  IssueSeverity,
  DeadCodeType,
  PerformanceIssueType,
  SecurityIssueType,
  FileType,
  AnalyzerRule
} from './types';

export class HealthMonitor {
  private customRules: AnalyzerRule[] = [];
  
  // Security patterns to detect
  private securityPatterns = {
    xssVulnerability: /dangerouslySetInnerHTML|innerHTML\s*=/g,
    unsafeEval: /eval\s*\(|new\s+Function\s*\(/g,
    hardcodedSecrets: /(?:password|secret|key|token|api_key)\s*[:=]\s*['"`][^'"`\s]{8,}/gi,
    dangerousProps: /target\s*=\s*['"`]_blank['"`](?!\s+rel\s*=\s*['"`][^'"`]*noopener)/g
  };

  // Performance anti-patterns
  private performancePatterns = {
    useEffectWithoutDeps: /useEffect\s*\(\s*[^,]+\s*\)/g,
    largeInlineObjects: /=\s*\{[^}]{200,}\}/g,
    inefficientRender: /\.map\s*\([^)]*\)\s*\.map/g,
    blockingImports: /import\s*\(\s*['"`][^'"`]+['"`]\s*\)(?!\s*\.then)/g
  };

  /**
   * Analyze overall project health
   */
  async analyzeProjectHealth(context: {
    files: FileNode[];
    dependencies: DependencyGraph;
    routes: RouteGraph;
    components: ComponentMap;
  }): Promise<ProjectHealth> {
    const issues: HealthIssue[] = [];
    const missingDependencies: MissingDependency[] = [];
    const deadCode: DeadCodeInfo[] = [];
    const typeErrors: TypeScriptError[] = [];
    const performanceIssues: PerformanceIssue[] = [];
    const securityIssues: SecurityIssue[] = [];

    // Analyze each file
    for (const file of context.files) {
      if (file.isDirectory || !file.content) continue;

      // Security analysis
      const fileSecurityIssues = this.analyzeFileSecurity(file);
      securityIssues.push(...fileSecurityIssues);

      // Performance analysis
      const filePerformanceIssues = this.analyzeFilePerformance(file);
      performanceIssues.push(...filePerformanceIssues);

      // Dead code analysis
      const fileDeadCode = this.analyzeDeadCode(file, context.dependencies);
      deadCode.push(...fileDeadCode);

      // TypeScript error analysis (simulated)
      const fileTypeErrors = this.analyzeTypeScriptErrors(file);
      typeErrors.push(...fileTypeErrors);
    }

    // Dependency analysis
    const depMissingDeps = this.analyzeMissingDependencies(context.dependencies);
    missingDependencies.push(...depMissingDeps);

    // Architecture analysis
    const archIssues = this.analyzeArchitecture(context);
    issues.push(...archIssues);

    // Apply custom rules
    const customIssues = this.applyCustomRules(context.files);
    issues.push(...customIssues);

    // Convert analysis results to health issues
    issues.push(...this.convertToHealthIssues(securityIssues, performanceIssues, deadCode, typeErrors));

    // Calculate health score
    const score = this.calculateHealthScore({
      issues,
      missingDependencies,
      deadCode,
      typeErrors,
      performanceIssues,
      securityIssues
    });

    return {
      score,
      issues,
      missingDependencies,
      orphanedFiles: context.dependencies.orphanedFiles,
      deadCode,
      typeErrors,
      performanceIssues,
      securityIssues
    };
  }

  /**
   * Analyze file for security vulnerabilities
   */
  private analyzeFileSecurity(file: FileNode): SecurityIssue[] {
    if (!file.content || !this.isCodeFile(file)) {
      return [];
    }

    const issues: SecurityIssue[] = [];
    const lines = file.content.split('\n');

    // Check for XSS vulnerabilities
    let match;
    while ((match = this.securityPatterns.xssVulnerability.exec(file.content)) !== null) {
      const lineNumber = this.getLineNumber(file.content, match.index);
      
      issues.push({
        file: file.path,
        type: SecurityIssueType.XSS_VULNERABILITY,
        description: 'Potential XSS vulnerability detected. Ensure user input is properly sanitized.',
        severity: 'high',
        cwe: 'CWE-79'
      });
    }

    this.securityPatterns.xssVulnerability.lastIndex = 0;

    // Check for unsafe eval usage
    while ((match = this.securityPatterns.unsafeEval.exec(file.content)) !== null) {
      issues.push({
        file: file.path,
        type: SecurityIssueType.UNSAFE_EVAL,
        description: 'Unsafe eval() or Function() constructor usage detected.',
        severity: 'critical',
        cwe: 'CWE-95'
      });
    }

    this.securityPatterns.unsafeEval.lastIndex = 0;

    // Check for hardcoded secrets
    while ((match = this.securityPatterns.hardcodedSecrets.exec(file.content)) !== null) {
      issues.push({
        file: file.path,
        type: SecurityIssueType.HARDCODED_SECRET,
        description: 'Potential hardcoded secret detected. Use environment variables instead.',
        severity: 'high',
        cwe: 'CWE-798'
      });
    }

    this.securityPatterns.hardcodedSecrets.lastIndex = 0;

    // Check for dangerous link targets
    while ((match = this.securityPatterns.dangerousProps.exec(file.content)) !== null) {
      issues.push({
        file: file.path,
        type: SecurityIssueType.DANGEROUS_PROPS,
        description: 'Links with target="_blank" should include rel="noopener" for security.',
        severity: 'medium'
      });
    }

    this.securityPatterns.dangerousProps.lastIndex = 0;

    return issues;
  }

  /**
   * Analyze file for performance issues
   */
  private analyzeFilePerformance(file: FileNode): PerformanceIssue[] {
    if (!file.content || !this.isCodeFile(file)) {
      return [];
    }

    const issues: PerformanceIssue[] = [];

    // Check for useEffect without dependencies
    let match;
    while ((match = this.performancePatterns.useEffectWithoutDeps.exec(file.content)) !== null) {
      // Only flag if it's actually missing deps array, not just empty
      if (!file.content.substring(match.index, match.index + match[0].length + 10).includes('[]')) {
        issues.push({
          file: file.path,
          type: PerformanceIssueType.INEFFICIENT_RENDER,
          description: 'useEffect without dependency array may cause infinite re-renders.',
          impact: 'high',
          suggestion: 'Add dependency array to useEffect or use useCallback/useMemo.'
        });
      }
    }

    this.performancePatterns.useEffectWithoutDeps.lastIndex = 0;

    // Check for large inline objects
    while ((match = this.performancePatterns.largeInlineObjects.exec(file.content)) !== null) {
      issues.push({
        file: file.path,
        type: PerformanceIssueType.INEFFICIENT_RENDER,
        description: 'Large inline object detected. Consider moving to a constant or useMemo.',
        impact: 'medium',
        suggestion: 'Extract large objects to constants or use useMemo for expensive computations.'
      });
    }

    this.performancePatterns.largeInlineObjects.lastIndex = 0;

    // Check for chained map operations
    while ((match = this.performancePatterns.inefficientRender.exec(file.content)) !== null) {
      issues.push({
        file: file.path,
        type: PerformanceIssueType.INEFFICIENT_RENDER,
        description: 'Chained map operations detected. Consider combining into single operation.',
        impact: 'medium',
        suggestion: 'Combine multiple map operations or use more efficient data transformation.'
      });
    }

    this.performancePatterns.inefficientRender.lastIndex = 0;

    // Check file size
    if (file.size > 100 * 1024) { // > 100KB
      issues.push({
        file: file.path,
        type: PerformanceIssueType.LARGE_BUNDLE,
        description: `Large file detected (${Math.round(file.size / 1024)}KB). Consider code splitting.`,
        impact: 'medium',
        suggestion: 'Split large components or use dynamic imports for code splitting.'
      });
    }

    return issues;
  }

  /**
   * Analyze dead code in files
   */
  private analyzeDeadCode(file: FileNode, dependencies: DependencyGraph): DeadCodeInfo[] {
    if (!file.content || !this.isCodeFile(file)) {
      return [];
    }

    const deadCode: DeadCodeInfo[] = [];
    const dependents = dependencies.reverseAdjacencyList.get(file.path) || [];

    // Check if file is completely unused
    if (dependents.length === 0 && !this.isEntryPoint(file)) {
      deadCode.push({
        file: file.path,
        type: DeadCodeType.UNUSED_EXPORT,
        name: file.name,
        line: 1,
        reason: 'File has no dependents and is not an entry point'
      });
    }

    // Analyze unused imports (simplified)
    const imports = this.extractImportStatements(file.content);
    const usedIdentifiers = this.extractUsedIdentifiers(file.content);

    for (const importStatement of imports) {
      for (const identifier of importStatement.identifiers) {
        if (!usedIdentifiers.has(identifier)) {
          deadCode.push({
            file: file.path,
            type: DeadCodeType.UNUSED_IMPORT,
            name: identifier,
            line: importStatement.line,
            reason: 'Imported but never used in the file'
          });
        }
      }
    }

    return deadCode;
  }

  /**
   * Analyze TypeScript errors (simplified simulation)
   */
  private analyzeTypeScriptErrors(file: FileNode): TypeScriptError[] {
    if (!file.content || ![FileType.TYPESCRIPT, FileType.TSX].includes(file.type)) {
      return [];
    }

    const errors: TypeScriptError[] = [];
    
    // Simple checks for common TypeScript issues
    const commonIssues = [
      {
        pattern: /:\s*any(?!\w)/g,
        message: "Type 'any' should be avoided. Use specific types instead.",
        code: 2571,
        severity: 'warning' as const
      },
      {
        pattern: /@ts-ignore/g,
        message: "@ts-ignore directive found. Consider fixing the underlying issue.",
        code: 2578,
        severity: 'warning' as const
      },
      {
        pattern: /\.tsx?$/,
        message: "Consider using explicit return types for functions.",
        code: 7030,
        severity: 'info' as const
      }
    ];

    for (const issue of commonIssues) {
      let match;
      while ((match = issue.pattern.exec(file.content)) !== null) {
        const lineNumber = this.getLineNumber(file.content, match.index);
        
        errors.push({
          file: file.path,
          line: lineNumber,
          column: match.index - file.content.lastIndexOf('\n', match.index),
          code: issue.code,
          message: issue.message,
          severity: issue.severity
        });
      }
      issue.pattern.lastIndex = 0;
    }

    return errors;
  }

  /**
   * Analyze missing dependencies
   */
  private analyzeMissingDependencies(dependencies: DependencyGraph): MissingDependency[] {
    const missing: MissingDependency[] = [];
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    // This would require reading package.json and comparing with actual imports
    // For now, return empty array as it requires filesystem access
    
    return missing;
  }

  /**
   * Analyze overall architecture issues
   */
  private analyzeArchitecture(context: {
    files: FileNode[];
    dependencies: DependencyGraph;
    routes: RouteGraph;
    components: ComponentMap;
  }): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Check for circular dependencies
    for (const cycle of context.dependencies.cycles) {
      issues.push({
        id: `cycle-${cycle.join('-')}`,
        type: IssueType.DEAD_CODE,
        severity: IssueSeverity.HIGH,
        file: cycle[0],
        message: `Circular dependency detected: ${cycle.join(' → ')}`,
        suggestion: 'Refactor to remove circular dependencies by extracting shared logic.',
        fixable: false
      });
    }

    // Check for excessive dependencies
    for (const [filePath, deps] of context.dependencies.adjacencyList) {
      if (deps.length > 20) {
        issues.push({
          id: `high-deps-${filePath}`,
          type: IssueType.PERFORMANCE,
          severity: IssueSeverity.MEDIUM,
          file: filePath,
          message: `File has ${deps.length} dependencies, consider refactoring.`,
          suggestion: 'Split large files or reduce coupling between modules.',
          fixable: false
        });
      }
    }

    // Check for deeply nested file structures
    for (const file of context.files) {
      if (file.depth > 8) {
        issues.push({
          id: `deep-nesting-${file.path}`,
          type: IssueType.PERFORMANCE,
          severity: IssueSeverity.LOW,
          file: file.path,
          message: `File is deeply nested (depth: ${file.depth}). Consider flattening structure.`,
          suggestion: 'Reorganize file structure to reduce nesting depth.',
          fixable: false
        });
      }
    }

    return issues;
  }

  /**
   * Apply custom analyzer rules
   */
  private applyCustomRules(files: FileNode[]): HealthIssue[] {
    const issues: HealthIssue[] = [];

    for (const rule of this.customRules) {
      for (const file of files) {
        if (file.isDirectory) continue;
        
        try {
          const ruleIssues = rule.check(file);
          issues.push(...ruleIssues);
        } catch (error) {
          console.warn(`Error applying rule ${rule.id}:`, error);
        }
      }
    }

    return issues;
  }

  /**
   * Convert specialized issues to general health issues
   */
  private convertToHealthIssues(
    securityIssues: SecurityIssue[],
    performanceIssues: PerformanceIssue[],
    deadCode: DeadCodeInfo[],
    typeErrors: TypeScriptError[]
  ): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Convert security issues
    for (const sec of securityIssues) {
      issues.push({
        id: `security-${sec.file}-${sec.type}`,
        type: IssueType.SECURITY,
        severity: this.mapSecuritySeverity(sec.severity),
        file: sec.file,
        message: sec.description,
        suggestion: this.getSecuritySuggestion(sec.type),
        fixable: this.isSecurityFixable(sec.type)
      });
    }

    // Convert performance issues
    for (const perf of performanceIssues) {
      issues.push({
        id: `performance-${perf.file}-${perf.type}`,
        type: IssueType.PERFORMANCE,
        severity: this.mapPerformanceImpact(perf.impact),
        file: perf.file,
        message: perf.description,
        suggestion: perf.suggestion,
        fixable: true
      });
    }

    // Convert dead code
    for (const dead of deadCode) {
      issues.push({
        id: `deadcode-${dead.file}-${dead.name}`,
        type: IssueType.DEAD_CODE,
        severity: IssueSeverity.LOW,
        file: dead.file,
        line: dead.line,
        message: `Dead code detected: ${dead.name} - ${dead.reason}`,
        suggestion: 'Remove unused code to improve maintainability.',
        fixable: true
      });
    }

    // Convert TypeScript errors
    for (const ts of typeErrors) {
      issues.push({
        id: `typescript-${ts.file}-${ts.line}-${ts.code}`,
        type: IssueType.TYPE_ERROR,
        severity: this.mapTypeScriptSeverity(ts.severity),
        file: ts.file,
        line: ts.line,
        column: ts.column,
        message: ts.message,
        suggestion: 'Fix TypeScript error to improve type safety.',
        fixable: ts.severity === 'warning'
      });
    }

    return issues;
  }

  /**
   * Calculate overall health score
   */
  private calculateHealthScore(health: {
    issues: HealthIssue[];
    missingDependencies: MissingDependency[];
    deadCode: DeadCodeInfo[];
    typeErrors: TypeScriptError[];
    performanceIssues: PerformanceIssue[];
    securityIssues: SecurityIssue[];
  }): number {
    let score = 100;

    // Deduct points for different types of issues
    const weights = {
      [IssueSeverity.CRITICAL]: 20,
      [IssueSeverity.HIGH]: 10,
      [IssueSeverity.MEDIUM]: 5,
      [IssueSeverity.LOW]: 1
    };

    for (const issue of health.issues) {
      score -= weights[issue.severity];
    }

    // Additional deductions
    score -= health.missingDependencies.length * 5;
    score -= health.deadCode.length * 2;
    score -= health.typeErrors.filter(e => e.severity === 'error').length * 3;
    score -= health.performanceIssues.filter(p => p.impact === 'high').length * 8;
    score -= health.securityIssues.filter(s => s.severity === 'critical').length * 25;

    return Math.max(0, Math.min(100, score));
  }

  // Helper methods

  private isCodeFile(file: FileNode): boolean {
    return [
      FileType.TYPESCRIPT,
      FileType.JAVASCRIPT,
      FileType.TSX,
      FileType.JSX
    ].includes(file.type);
  }

  private isEntryPoint(file: FileNode): boolean {
    const entryPatterns = [
      /page\.(ts|tsx|js|jsx)$/,
      /layout\.(ts|tsx|js|jsx)$/,
      /^index\.(ts|tsx|js|jsx)$/,
      /route\.(ts|js)$/
    ];

    return entryPatterns.some(pattern => pattern.test(file.name));
  }

  private getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split('\n').length;
  }

  private extractImportStatements(content: string): Array<{ identifiers: string[]; line: number }> {
    const imports: Array<{ identifiers: string[]; line: number }> = [];
    const importRegex = /import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"`][^'"`]+['"`]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const line = this.getLineNumber(content, match.index);
      let identifiers: string[] = [];
      
      if (match[1]) { // Named imports
        identifiers = match[1].split(',').map(s => s.trim().split(' as ')[0]);
      } else if (match[2]) { // Namespace import
        identifiers = [match[2]];
      } else if (match[3]) { // Default import
        identifiers = [match[3]];
      }
      
      imports.push({ identifiers, line });
    }
    
    return imports;
  }

  private extractUsedIdentifiers(content: string): Set<string> {
    // Simplified identifier extraction
    const identifierRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
    const identifiers = new Set<string>();
    
    let match;
    while ((match = identifierRegex.exec(content)) !== null) {
      identifiers.add(match[0]);
    }
    
    return identifiers;
  }

  private mapSecuritySeverity(severity: string): IssueSeverity {
    switch (severity) {
      case 'critical': return IssueSeverity.CRITICAL;
      case 'high': return IssueSeverity.HIGH;
      case 'medium': return IssueSeverity.MEDIUM;
      default: return IssueSeverity.LOW;
    }
  }

  private mapPerformanceImpact(impact: string): IssueSeverity {
    switch (impact) {
      case 'high': return IssueSeverity.HIGH;
      case 'medium': return IssueSeverity.MEDIUM;
      default: return IssueSeverity.LOW;
    }
  }

  private mapTypeScriptSeverity(severity: string): IssueSeverity {
    switch (severity) {
      case 'error': return IssueSeverity.HIGH;
      case 'warning': return IssueSeverity.MEDIUM;
      default: return IssueSeverity.LOW;
    }
  }

  private getSecuritySuggestion(type: SecurityIssueType): string {
    switch (type) {
      case SecurityIssueType.XSS_VULNERABILITY:
        return 'Use DOMPurify or similar library to sanitize HTML content.';
      case SecurityIssueType.UNSAFE_EVAL:
        return 'Replace eval() with safer alternatives like JSON.parse() or template literals.';
      case SecurityIssueType.HARDCODED_SECRET:
        return 'Move secrets to environment variables or secure key management.';
      case SecurityIssueType.DANGEROUS_PROPS:
        return 'Add rel="noopener noreferrer" to external links.';
      default:
        return 'Review security implications and apply appropriate fixes.';
    }
  }

  private isSecurityFixable(type: SecurityIssueType): boolean {
    return [
      SecurityIssueType.DANGEROUS_PROPS,
      SecurityIssueType.HARDCODED_SECRET
    ].includes(type);
  }

  /**
   * Add custom analyzer rule
   */
  addCustomRule(rule: AnalyzerRule): void {
    this.customRules.push(rule);
  }

  /**
   * Remove custom analyzer rule
   */
  removeCustomRule(ruleId: string): void {
    this.customRules = this.customRules.filter(rule => rule.id !== ruleId);
  }

  /**
   * Get all custom rules
   */
  getCustomRules(): AnalyzerRule[] {
    return [...this.customRules];
  }
}