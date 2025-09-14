/**
 * Pattern Detector - זיהוי דפוסים וחוקיות בקוד
 * מזהה anti-patterns, דפוסי ארכיטקטורה, ריחות קוד והזדמנויות אופטימיזציה
 */

import { AnalyticsConfig, PatternDetectionResult, AntiPattern, ArchitecturePattern, CodeSmell, DesignPattern, OptimizationOpportunity } from './index';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface PatternRule {
  id: string;
  name: string;
  type: 'anti_pattern' | 'architecture_pattern' | 'code_smell' | 'design_pattern' | 'optimization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  matcher: RegExp | ((code: string) => boolean);
  suggestion: string;
  autoFixable: boolean;
}

export interface PatternMatch {
  rule: PatternRule;
  location: FileLocation;
  context: string;
  confidence: number;
  metadata?: any;
}

export interface FileLocation {
  file: string;
  line: number;
  column: number;
  length: number;
}

export interface CodeAnalysisResult {
  file: string;
  patterns: PatternMatch[];
  complexity: number;
  maintainabilityIndex: number;
  codeSmellDensity: number;
}

export class PatternDetector {
  private config: AnalyticsConfig;
  private rules: PatternRule[] = [];
  private projectRoot: string;
  private cache: Map<string, CodeAnalysisResult> = new Map();

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.projectRoot = process.cwd();
    this.initializeRules();
  }

  /**
   * זיהוי דפוסים מקיף בכל הפרויקט
   */
  public async detectPatterns(): Promise<PatternDetectionResult> {
    console.log('🔍 מזהה דפוסים ב-Lions of Zion...');

    try {
      const sourceFiles = await this.findSourceFiles();
      const analysisResults = await this.analyzeFiles(sourceFiles);

      const antiPatterns = this.extractAntiPatterns(analysisResults);
      const architecturePatterns = this.extractArchitecturePatterns(analysisResults);
      const codeSmells = this.extractCodeSmells(analysisResults);
      const designPatterns = this.extractDesignPatterns(analysisResults);
      const optimizationOpportunities = this.extractOptimizationOpportunities(analysisResults);

      console.log(`✅ זיהוי דפוסים הושלם:`);
      console.log(`   📕 Anti-patterns: ${antiPatterns.length}`);
      console.log(`   🏗️ Architecture patterns: ${architecturePatterns.length}`);
      console.log(`   👃 Code smells: ${codeSmells.length}`);
      console.log(`   🎨 Design patterns: ${designPatterns.length}`);
      console.log(`   ⚡ Optimization opportunities: ${optimizationOpportunities.length}`);

      return {
        antiPatterns,
        architecturePatterns,
        codeSmells,
        designPatterns,
        optimizationOpportunities
      };

    } catch (error) {
      console.error('❌ שגיאה בזיהוי דפוסים:', error);
      return this.getEmptyPatternResult();
    }
  }

  /**
   * ניתוח קובץ בודד
   */
  public async analyzeFile(filePath: string): Promise<CodeAnalysisResult> {
    const cacheKey = `${filePath}_${await this.getFileHash(filePath)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const patterns = await this.findPatternsInCode(content, filePath);
      const complexity = this.calculateComplexity(content);
      const maintainabilityIndex = this.calculateMaintainabilityIndex(content, patterns);
      const codeSmellDensity = this.calculateCodeSmellDensity(patterns, content.split('\n').length);

      const result: CodeAnalysisResult = {
        file: filePath,
        patterns,
        complexity,
        maintainabilityIndex,
        codeSmellDensity
      };

      this.cache.set(cacheKey, result);
      return result;

    } catch (error) {
      console.warn(`⚠️ שגיאה בניתוח קובץ ${filePath}:`, error);
      return this.getEmptyAnalysisResult(filePath);
    }
  }

  /**
   * איתור דפוסים בקוד
   */
  private async findPatternsInCode(code: string, filePath: string): Promise<PatternMatch[]> {
    const matches: PatternMatch[] = [];

    for (const rule of this.rules) {
      const ruleMatches = await this.applyRule(rule, code, filePath);
      matches.push(...ruleMatches);
    }

    // סינון והתאמת רמת ביטחון
    return matches
      .filter(match => match.confidence > 0.6)
      .sort((a, b) => this.getSeverityWeight(b.rule.severity) - this.getSeverityWeight(a.rule.severity));
  }

  /**
   * יישום חוקה על קוד
   */
  private async applyRule(rule: PatternRule, code: string, filePath: string): Promise<PatternMatch[]> {
    const matches: PatternMatch[] = [];

    try {
      if (rule.matcher instanceof RegExp) {
        const regexMatches = [...code.matchAll(new RegExp(rule.matcher, 'gm'))];
        
        for (const match of regexMatches) {
          const location = this.getLocationFromMatch(match, code);
          const context = this.extractContext(code, location);
          
          matches.push({
            rule,
            location: {
              file: filePath,
              ...location
            },
            context,
            confidence: this.calculateConfidence(rule, match[0], context)
          });
        }
      } else if (typeof rule.matcher === 'function') {
        const isMatch = rule.matcher(code);
        
        if (isMatch) {
          matches.push({
            rule,
            location: {
              file: filePath,
              line: 1,
              column: 1,
              length: 0
            },
            context: this.extractFileContext(code),
            confidence: 0.8
          });
        }
      }
    } catch (error) {
      console.warn(`⚠️ שגיאה ביישום חוקה ${rule.id}:`, error);
    }

    return matches;
  }

  /**
   * אתחול חוקים לזיהוי דפוסים
   */
  private initializeRules(): void {
    this.rules = [
      // Anti-patterns
      {
        id: 'god_object',
        name: 'God Object',
        type: 'anti_pattern',
        severity: 'high',
        description: 'קלאס או רכיב גדול מדי עם יותר מדי אחריויות',
        matcher: (code: string) => {
          const lines = code.split('\n').length;
          const methods = (code.match(/function|method|\=\>/g) || []).length;
          return lines > 500 || methods > 20;
        },
        suggestion: 'פצל את האובייקט למספר רכיבים קטנים יותר עם אחריות יחידה',
        autoFixable: false
      },
      {
        id: 'long_parameter_list',
        name: 'Long Parameter List',
        type: 'anti_pattern',
        severity: 'medium',
        description: 'פונקציה עם יותר מדי פרמטרים',
        matcher: /function\s+\w+\([^)]{100,}\)/g,
        suggestion: 'השתמש באובייקט פרמטרים או פצל הפונקציה',
        autoFixable: true
      },
      {
        id: 'magic_numbers',
        name: 'Magic Numbers',
        type: 'code_smell',
        severity: 'low',
        description: 'מספרים קשיחים ללא הסבר',
        matcher: /(?<!\/\*.*)\b\d{2,}\b(?!.*\*\/)/g,
        suggestion: 'הגדר קבועים עם שמות משמעותיים',
        autoFixable: true
      },
      {
        id: 'duplicate_code',
        name: 'Duplicate Code',
        type: 'code_smell',
        severity: 'medium',
        description: 'קוד מוכפל',
        matcher: (code: string) => this.detectDuplicateCode(code),
        suggestion: 'חלץ את הקוד הכפול לפונקציה או רכיב נפרד',
        autoFixable: false
      },

      // Architecture patterns
      {
        id: 'mvc_pattern',
        name: 'MVC Pattern',
        type: 'architecture_pattern',
        severity: 'low',
        description: 'דפוס MVC מיושם',
        matcher: (code: string) => this.detectMVCPattern(code),
        suggestion: 'דפוס MVC מיושם כראוי',
        autoFixable: false
      },
      {
        id: 'observer_pattern',
        name: 'Observer Pattern',
        type: 'design_pattern',
        severity: 'low',
        description: 'דפוס Observer מיושם',
        matcher: /subscribe|addEventListener|on\(/g,
        suggestion: 'דפוס Observer מיושם - שמור על ניהול נכון של listeners',
        autoFixable: false
      },

      // React/Next.js specific patterns
      {
        id: 'use_effect_dependency',
        name: 'useEffect Dependency Issue',
        type: 'code_smell',
        severity: 'high',
        description: 'useEffect ללא dependencies נכונות',
        matcher: /useEffect\([^,]+\,\s*\[\s*\]\)/g,
        suggestion: 'הוסף dependencies נכונות למערך התלויות',
        autoFixable: false
      },
      {
        id: 'inline_styles',
        name: 'Inline Styles',
        type: 'code_smell',
        severity: 'low',
        description: 'שימוש מרובה ב-inline styles',
        matcher: /style\s*=\s*\{\{[^}]+\}\}/g,
        suggestion: 'העבר לקלאסי CSS או styled-components',
        autoFixable: true
      },

      // Performance patterns
      {
        id: 'unnecessary_re_renders',
        name: 'Unnecessary Re-renders',
        type: 'optimization',
        severity: 'medium',
        description: 'רכיבים שמתרנדרים מחדש ללא צורך',
        matcher: (code: string) => this.detectUnnecessaryRerenders(code),
        suggestion: 'השתמש ב-React.memo או useMemo לאופטימיזציה',
        autoFixable: false
      },
      {
        id: 'large_bundle_imports',
        name: 'Large Bundle Imports',
        type: 'optimization',
        severity: 'medium',
        description: 'import של ספריות גדולות ללא tree shaking',
        matcher: /import\s+\*\s+as\s+\w+\s+from\s+['"](?:lodash|moment|@material-ui)['"];?/g,
        suggestion: 'השתמש ב-named imports לצמצום גודל bundle',
        autoFixable: true
      },

      // Security patterns
      {
        id: 'xss_vulnerability',
        name: 'XSS Vulnerability',
        type: 'anti_pattern',
        severity: 'critical',
        description: 'פוטנציאל לפרצת XSS',
        matcher: /dangerouslySetInnerHTML|innerHTML\s*=|eval\s*\(/g,
        suggestion: 'השתמש בשיטות בטוחות להכנסת תוכן דינמי',
        autoFixable: false
      },

      // TypeScript patterns
      {
        id: 'any_type_usage',
        name: 'Any Type Usage',
        type: 'code_smell',
        severity: 'medium',
        description: 'שימוש מרובה בטיפוס any',
        matcher: /:\s*any\b|as\s+any\b/g,
        suggestion: 'הגדר טיפוסים ספציפיים במקום any',
        autoFixable: false
      }
    ];
  }

  // Pattern extraction methods
  private extractAntiPatterns(results: CodeAnalysisResult[]): AntiPattern[] {
    const antiPatterns: AntiPattern[] = [];

    for (const result of results) {
      const patterns = result.patterns.filter(p => p.rule.type === 'anti_pattern');
      
      for (const pattern of patterns) {
        antiPatterns.push({
          name: pattern.rule.name,
          location: pattern.location.file,
          severity: pattern.rule.severity,
          description: pattern.rule.description,
          suggestion: pattern.rule.suggestion,
          confidence: pattern.confidence,
          context: pattern.context,
          autoFixable: pattern.rule.autoFixable
        });
      }
    }

    return antiPatterns;
  }

  private extractArchitecturePatterns(results: CodeAnalysisResult[]): ArchitecturePattern[] {
    const architecturePatterns: ArchitecturePattern[] = [];

    for (const result of results) {
      const patterns = result.patterns.filter(p => p.rule.type === 'architecture_pattern');
      
      for (const pattern of patterns) {
        architecturePatterns.push({
          name: pattern.rule.name,
          usage: `מיושם ב-${path.basename(pattern.location.file)}`,
          recommendation: pattern.rule.suggestion,
          quality: this.assessPatternQuality(pattern),
          adherence: pattern.confidence
        });
      }
    }

    return architecturePatterns;
  }

  private extractCodeSmells(results: CodeAnalysisResult[]): CodeSmell[] {
    const codeSmells: CodeSmell[] = [];

    for (const result of results) {
      const patterns = result.patterns.filter(p => p.rule.type === 'code_smell');
      
      for (const pattern of patterns) {
        codeSmells.push({
          type: pattern.rule.name,
          location: `${path.basename(pattern.location.file)}:${pattern.location.line}`,
          severity: pattern.rule.severity,
          description: pattern.rule.description,
          suggestion: pattern.rule.suggestion,
          impact: this.assessSmellImpact(pattern),
          effort: this.assessFixEffort(pattern)
        });
      }
    }

    return codeSmells;
  }

  private extractDesignPatterns(results: CodeAnalysisResult[]): DesignPattern[] {
    const designPatterns: DesignPattern[] = [];

    for (const result of results) {
      const patterns = result.patterns.filter(p => p.rule.type === 'design_pattern');
      
      for (const pattern of patterns) {
        designPatterns.push({
          name: pattern.rule.name,
          usage: `זוהה ב-${path.basename(pattern.location.file)}`,
          optimization: pattern.rule.suggestion,
          effectiveness: pattern.confidence,
          implementationQuality: this.assessPatternQuality(pattern)
        });
      }
    }

    return designPatterns;
  }

  private extractOptimizationOpportunities(results: CodeAnalysisResult[]): OptimizationOpportunity[] {
    const opportunities: OptimizationOpportunity[] = [];

    for (const result of results) {
      const patterns = result.patterns.filter(p => p.rule.type === 'optimization');
      
      for (const pattern of patterns) {
        opportunities.push({
          type: pattern.rule.name,
          location: `${path.basename(pattern.location.file)}:${pattern.location.line}`,
          benefit: this.calculateOptimizationBenefit(pattern),
          effort: this.assessFixEffort(pattern),
          priority: this.calculatePriority(pattern),
          description: pattern.rule.description,
          implementation: pattern.rule.suggestion
        });
      }
    }

    return opportunities.sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority));
  }

  // Helper methods
  private async findSourceFiles(): Promise<string[]> {
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    const ignorePatterns = ['node_modules', '.next', 'dist', 'build'];
    
    return this.findFilesRecursively(this.projectRoot, extensions, ignorePatterns);
  }

  private async findFilesRecursively(
    dir: string, 
    extensions: string[], 
    ignorePatterns: string[]
  ): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !ignorePatterns.includes(entry.name)) {
          const subFiles = await this.findFilesRecursively(fullPath, extensions, ignorePatterns);
          files.push(...subFiles);
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️ שגיאה בקריאת תיקייה ${dir}:`, error);
    }
    
    return files;
  }

  private async analyzeFiles(files: string[]): Promise<CodeAnalysisResult[]> {
    const results: CodeAnalysisResult[] = [];
    const batchSize = 10;
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(file => this.analyzeFile(file))
      );
      results.push(...batchResults);
    }
    
    return results;
  }

  private getLocationFromMatch(match: RegExpMatchArray, code: string): { line: number; column: number; length: number } {
    const beforeMatch = code.substring(0, match.index!);
    const lines = beforeMatch.split('\n');
    
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
      length: match[0].length
    };
  }

  private extractContext(code: string, location: { line: number; column: number }): string {
    const lines = code.split('\n');
    const startLine = Math.max(0, location.line - 3);
    const endLine = Math.min(lines.length - 1, location.line + 2);
    
    return lines.slice(startLine, endLine + 1).join('\n');
  }

  private extractFileContext(code: string): string {
    const lines = code.split('\n');
    return lines.slice(0, Math.min(10, lines.length)).join('\n');
  }

  private calculateConfidence(rule: PatternRule, match: string, context: string): number {
    let confidence = 0.7; // בסיס
    
    // התאם ביטחון לפי סוג הדפוס
    switch (rule.type) {
      case 'anti_pattern':
        confidence += 0.1;
        break;
      case 'code_smell':
        confidence += 0.05;
        break;
    }
    
    // התאם ביטחון לפי חומרה
    switch (rule.severity) {
      case 'critical':
        confidence += 0.2;
        break;
      case 'high':
        confidence += 0.1;
        break;
    }
    
    return Math.min(1.0, confidence);
  }

  private calculateComplexity(code: string): number {
    // חישוב מורכבות ציקלומטית בסיסי
    const complexityKeywords = [
      'if', 'else', 'while', 'for', 'switch', 'case', 'catch', 'try'
    ];
    
    let complexity = 1; // בסיס
    
    for (const keyword of complexityKeywords) {
      const matches = code.match(new RegExp(`\\b${keyword}\\b`, 'g'));
      if (matches) {
        complexity += matches.length;
      }
    }
    
    return complexity;
  }

  private calculateMaintainabilityIndex(code: string, patterns: PatternMatch[]): number {
    const linesOfCode = code.split('\n').length;
    const complexity = this.calculateComplexity(code);
    const codeSmells = patterns.filter(p => p.rule.type === 'code_smell').length;
    
    // נוסחה פשוטה למדד תחזוקה
    let index = 100;
    index -= Math.log2(linesOfCode) * 2;
    index -= complexity * 0.5;
    index -= codeSmells * 5;
    
    return Math.max(0, Math.min(100, index));
  }

  private calculateCodeSmellDensity(patterns: PatternMatch[], linesOfCode: number): number {
    const smells = patterns.filter(p => p.rule.type === 'code_smell').length;
    return linesOfCode > 0 ? (smells / linesOfCode) * 1000 : 0; // ריחות לכל 1000 שורות
  }

  private getSeverityWeight(severity: string): number {
    switch (severity) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  private assessPatternQuality(pattern: PatternMatch): string {
    if (pattern.confidence > 0.8) return 'excellent';
    if (pattern.confidence > 0.6) return 'good';
    if (pattern.confidence > 0.4) return 'fair';
    return 'poor';
  }

  private assessSmellImpact(pattern: PatternMatch): string {
    switch (pattern.rule.severity) {
      case 'critical': return 'high';
      case 'high': return 'medium-high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'minimal';
    }
  }

  private assessFixEffort(pattern: PatternMatch): string {
    if (pattern.rule.autoFixable) return 'low';
    
    switch (pattern.rule.severity) {
      case 'critical': return 'high';
      case 'high': return 'medium-high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'minimal';
    }
  }

  private calculateOptimizationBenefit(pattern: PatternMatch): string {
    switch (pattern.rule.severity) {
      case 'critical': return 'major performance improvement';
      case 'high': return 'significant improvement';
      case 'medium': return 'moderate improvement';
      case 'low': return 'minor improvement';
      default: return 'minimal improvement';
    }
  }

  private calculatePriority(pattern: PatternMatch): string {
    const severityWeight = this.getSeverityWeight(pattern.rule.severity);
    const confidenceWeight = pattern.confidence;
    
    const priority = severityWeight * confidenceWeight;
    
    if (priority >= 3) return 'high';
    if (priority >= 2) return 'medium';
    return 'low';
  }

  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  private async getFileHash(filePath: string): Promise<string> {
    try {
      const stats = await fs.stat(filePath);
      return `${stats.mtime.getTime()}_${stats.size}`;
    } catch {
      return Date.now().toString();
    }
  }

  // Complex pattern detection methods
  private detectDuplicateCode(code: string): boolean {
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    const duplicates = new Map<string, number>();
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 10) { // התעלם משורות קצרות
        duplicates.set(trimmed, (duplicates.get(trimmed) || 0) + 1);
      }
    }
    
    // בדוק אם יש יותר מ-3 שורות זהות
    for (const count of duplicates.values()) {
      if (count > 3) {
        return true;
      }
    }
    
    return false;
  }

  private detectMVCPattern(code: string): boolean {
    const hasController = /controller|Controller/.test(code);
    const hasModel = /model|Model|interface|type/.test(code);
    const hasView = /component|Component|render|return.*jsx/i.test(code);
    
    return hasController && hasModel && hasView;
  }

  private detectUnnecessaryRerenders(code: string): boolean {
    // בדוק שימוש לא נכון ב-hooks שגורם לרנדרים מיותרים
    const hasInlineObjects = /\{\s*[^}]+\s*\}/g.test(code);
    const hasInlineFunctions = /\(\s*\)\s*=>\s*{/g.test(code);
    const inRender = /return\s*\(/g.test(code);
    
    return hasInlineObjects && hasInlineFunctions && inRender;
  }

  private getEmptyPatternResult(): PatternDetectionResult {
    return {
      antiPatterns: [],
      architecturePatterns: [],
      codeSmells: [],
      designPatterns: [],
      optimizationOpportunities: []
    };
  }

  private getEmptyAnalysisResult(filePath: string): CodeAnalysisResult {
    return {
      file: filePath,
      patterns: [],
      complexity: 0,
      maintainabilityIndex: 50,
      codeSmellDensity: 0
    };
  }
}