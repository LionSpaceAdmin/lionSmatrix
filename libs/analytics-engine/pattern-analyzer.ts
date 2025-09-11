/**
 * Pattern Analyzer - מנתח דפוסים וזיהוי anti-patterns במערכת Lions of Zion
 * מזהה דפוסי קוד, בעיות ארכיטקטוניות והזדמנויות לשיפור
 */

import * as fs from "fs/promises"
import * as path from "path"
import { CollectedData } from "./data-collector"

export interface PatternAnalyzerConfig {
  analyzeCodePatterns: boolean
  analyzeArchitecturalPatterns: boolean
  detectAntiPatterns: boolean
  identifyCodeSmells: boolean
  analyzeDesignPatterns: boolean
  trackPatternEvolution: boolean
  customPatterns: CustomPattern[]
}

export interface CustomPattern {
  name: string
  description: string
  regex: RegExp
  category: "good" | "bad" | "neutral"
  severity: "low" | "medium" | "high" | "critical"
  suggestion: string
}

export interface PatternAnalysisResult {
  codePatterns: CodePattern[]
  architecturalPatterns: ArchitecturalPattern[]
  antiPatterns: AntiPattern[]
  codeSmells: CodeSmell[]
  designPatterns: DesignPattern[]
  optimizationOpportunities: OptimizationOpportunity[]
  patternTrends: PatternTrend[]
  riskAssessment: PatternRiskAssessment
}

export interface CodePattern {
  id: string
  name: string
  type: "good_practice" | "code_smell" | "anti_pattern" | "design_pattern"
  category: "react" | "typescript" | "performance" | "security" | "architecture"
  description: string
  locations: PatternLocation[]
  frequency: number
  impact: "low" | "medium" | "high" | "critical"
  recommendation: string
  examples: CodeExample[]
}

export interface ArchitecturalPattern {
  id: string
  name: string
  type: "mvc" | "component" | "layered" | "microservices" | "monolithic"
  description: string
  implementation: ArchitecturalImplementation
  compliance: number // 0-100
  violations: ArchitecturalViolation[]
  benefits: string[]
  concerns: string[]
}

export interface AntiPattern {
  id: string
  name: string
  category: "code" | "architecture" | "design" | "performance" | "security"
  description: string
  locations: PatternLocation[]
  severity: "low" | "medium" | "high" | "critical"
  impact: AntiPatternImpact
  resolution: ResolutionStrategy
  priority: number // 1-10
}

export interface CodeSmell {
  id: string
  name: string
  type: "bloaters" | "object_orientation_abusers" | "change_preventers" | "dispensables" | "couplers"
  description: string
  locations: PatternLocation[]
  severity: "minor" | "major" | "critical"
  refactoringStrategy: RefactoringStrategy
  effort: "low" | "medium" | "high"
  impact: SmellImpact
}

export interface DesignPattern {
  id: string
  name: string
  type: "creational" | "structural" | "behavioral"
  description: string
  implementation: DesignPatternImplementation
  usage: "correct" | "incorrect" | "partial" | "missing"
  recommendation: string
  benefits: string[]
}

export interface OptimizationOpportunity {
  id: string
  type: "performance" | "maintainability" | "security" | "scalability"
  description: string
  locations: PatternLocation[]
  expectedBenefit: string
  effort: "low" | "medium" | "high"
  priority: number // 1-10
  implementation: string[]
}

export interface PatternTrend {
  patternId: string
  patternName: string
  trend: "increasing" | "decreasing" | "stable"
  changeRate: number // percentage change
  timeFrame: "week" | "month" | "quarter"
  prediction: string
}

export interface PatternRiskAssessment {
  overallRisk: number // 0-10
  riskByCategory: { [category: string]: number }
  criticalPatterns: CriticalPattern[]
  riskTrend: "improving" | "stable" | "worsening"
  mitigationPlan: MitigationAction[]
}

export interface PatternLocation {
  file: string
  startLine: number
  endLine?: number
  column?: number
  context: string
  snippet: string
}

export interface CodeExample {
  title: string
  code: string
  language: string
  explanation: string
}

export interface ArchitecturalImplementation {
  layers: string[]
  components: string[]
  dependencies: string[]
  violations: string[]
  adherence: number // 0-100
}

export interface ArchitecturalViolation {
  type: string
  description: string
  location: string
  severity: "low" | "medium" | "high"
  impact: string
  resolution: string
}

export interface AntiPatternImpact {
  maintainability: number // -10 to +10
  performance: number
  security: number
  scalability: number
  testability: number
}

export interface ResolutionStrategy {
  approach: string
  steps: string[]
  effort: "low" | "medium" | "high"
  timeframe: string
  risks: string[]
}

export interface RefactoringStrategy {
  technique: string
  steps: string[]
  preconditions: string[]
  benefits: string[]
  risks: string[]
}

export interface SmellImpact {
  readability: number // -5 to +5
  maintainability: number
  testability: number
  performance: number
}

export interface DesignPatternImplementation {
  participants: string[]
  structure: string
  collaborations: string[]
  consequences: string[]
}

export interface CriticalPattern {
  patternId: string
  name: string
  riskLevel: number // 0-10
  frequency: number
  impact: string
  urgency: "immediate" | "high" | "medium" | "low"
}

export interface MitigationAction {
  action: string
  priority: "immediate" | "high" | "medium" | "low"
  effort: "low" | "medium" | "high"
  timeline: string
  owner: string
}

export class PatternAnalyzer {
  private config: PatternAnalyzerConfig
  private projectRoot: string
  private patterns: Map<string, CodePattern> = new Map()
  private antiPatterns: Map<string, AntiPattern> = new Map()
  private codeSmells: Map<string, CodeSmell> = new Map()

  constructor(config: PatternAnalyzerConfig, projectRoot: string) {
    this.config = config
    this.projectRoot = projectRoot
    this.initializePatternLibrary()
  }

  /**
   * מבצע ניתוח מקיף של דפוסים בקוד
   */
  public async analyzePatterns(data: CollectedData): Promise<PatternAnalysisResult> {
    console.log("🔍 מתחיל ניתוח דפוסים מתקדם...")

    const results: PatternAnalysisResult = {
      codePatterns: [],
      architecturalPatterns: [],
      antiPatterns: [],
      codeSmells: [],
      designPatterns: [],
      optimizationOpportunities: [],
      patternTrends: [],
      riskAssessment: {
        overallRisk: 0,
        riskByCategory: {},
        criticalPatterns: [],
        riskTrend: "stable",
        mitigationPlan: [],
      },
    }

    try {
      // ריצה מקבילה של כל סוגי הניתוחים
      const [codePatterns, architecturalPatterns, antiPatterns, codeSmells, designPatterns] = await Promise.all([
        this.config.analyzeCodePatterns ? this.analyzeCodePatterns() : [],
        this.config.analyzeArchitecturalPatterns ? this.analyzeArchitecturalPatterns(data) : [],
        this.config.detectAntiPatterns ? this.detectAntiPatterns() : [],
        this.config.identifyCodeSmells ? this.identifyCodeSmells() : [],
        this.config.analyzeDesignPatterns ? this.analyzeDesignPatterns() : [],
      ])

      results.codePatterns = codePatterns
      results.architecturalPatterns = architecturalPatterns
      results.antiPatterns = antiPatterns
      results.codeSmells = codeSmells
      results.designPatterns = designPatterns

      // חישוב הזדמנויות אופטימיזציה
      results.optimizationOpportunities = this.identifyOptimizationOpportunities(results)

      // ניתוח מגמות דפוסים
      if (this.config.trackPatternEvolution) {
        results.patternTrends = await this.analyzePatternTrends(results)
      }

      // הערכת סיכונים
      results.riskAssessment = this.assessPatternRisks(results)

      console.log("✅ ניתוח דפוסים הושלם בהצלחה")
      this.logPatternSummary(results)

      return results
    } catch (error) {
      console.error("❌ שגיאה בניתוח דפוסים:", error)
      throw error
    }
  }

  /**
   * מנתח דפוסי קוד
   */
  private async analyzeCodePatterns(): Promise<CodePattern[]> {
    const patterns: CodePattern[] = []

    // ניתוח קבצי TypeScript/JavaScript
    const codeFiles = await this.getCodeFiles([".ts", ".tsx", ".js", ".jsx"])

    for (const file of codeFiles) {
      const content = await fs.readFile(file, "utf8")
      const filePatterns = await this.analyzeFilePatterns(file, content)
      patterns.push(...filePatterns)
    }

    // ניתוח דפוסי React
    const reactPatterns = await this.analyzeReactPatterns(codeFiles)
    patterns.push(...reactPatterns)

    // ניתוח דפוסי TypeScript
    const tsPatterns = await this.analyzeTypeScriptPatterns(codeFiles)
    patterns.push(...tsPatterns)

    return this.consolidatePatterns(patterns)
  }

  /**
   * מנתח דפוסים ארכיטקטוניים
   */
  private async analyzeArchitecturalPatterns(data: CollectedData): Promise<ArchitecturalPattern[]> {
    const patterns: ArchitecturalPattern[] = []

    // ניתוח מבנה תיקיות
    const folderStructure = await this.analyzeFolderStructure()
    patterns.push(...this.identifyArchitecturalPatternsFromStructure(folderStructure))

    // ניתוח תלויות
    const dependencyPatterns = this.analyzeDependencyPatterns(data.dependencies)
    patterns.push(...dependencyPatterns)

    // ניתוח שכבות
    const layerPatterns = await this.analyzeLayerPatterns()
    patterns.push(...layerPatterns)

    return patterns
  }

  /**
   * מזהה anti-patterns
   */
  private async detectAntiPatterns(): Promise<AntiPattern[]> {
    const antiPatterns: AntiPattern[] = []

    // זיהוי anti-patterns נפוצים
    antiPatterns.push(...(await this.detectCommonAntiPatterns()))

    // זיהוי anti-patterns ספציפיים ל-React
    antiPatterns.push(...(await this.detectReactAntiPatterns()))

    // זיהוי anti-patterns ארכיטקטוניים
    antiPatterns.push(...(await this.detectArchitecturalAntiPatterns()))

    // זיהוי anti-patterns ביצועים
    antiPatterns.push(...(await this.detectPerformanceAntiPatterns()))

    return this.prioritizeAntiPatterns(antiPatterns)
  }

  /**
   * מזהה code smells
   */
  private async identifyCodeSmells(): Promise<CodeSmell[]> {
    const smells: CodeSmell[] = []

    const codeFiles = await this.getCodeFiles([".ts", ".tsx", ".js", ".jsx"])

    for (const file of codeFiles) {
      const content = await fs.readFile(file, "utf8")
      const fileSmells = await this.analyzeFileSmells(file, content)
      smells.push(...fileSmells)
    }

    return this.categorizeSmells(smells)
  }

  /**
   * מנתח design patterns
   */
  private async analyzeDesignPatterns(): Promise<DesignPattern[]> {
    const patterns: DesignPattern[] = []

    // זיהוי Creational Patterns
    patterns.push(...(await this.identifyCreationalPatterns()))

    // זיהוי Structural Patterns
    patterns.push(...(await this.identifyStructuralPatterns()))

    // זיהוי Behavioral Patterns
    patterns.push(...(await this.identifyBehavioralPatterns()))

    return patterns
  }

  /**
   * אתחול ספריית הדפוסים
   */
  private initializePatternLibrary(): void {
    // React Patterns
    this.patterns.set("react-hooks-rules", {
      id: "react-hooks-rules",
      name: "React Hooks Rules",
      type: "good_practice",
      category: "react",
      description: "Proper usage of React Hooks following rules of hooks",
      locations: [],
      frequency: 0,
      impact: "medium",
      recommendation: "Follow React Hooks rules consistently",
      examples: [
        {
          title: "Correct Hook Usage",
          code: "const [state, setState] = useState(initialValue);",
          language: "typescript",
          explanation: "Hooks should be called at the top level",
        },
      ],
    })

    // TypeScript Patterns
    this.patterns.set("strict-typing", {
      id: "strict-typing",
      name: "Strict TypeScript Typing",
      type: "good_practice",
      category: "typescript",
      description: "Using strict type definitions instead of 'any'",
      locations: [],
      frequency: 0,
      impact: "high",
      recommendation: "Define explicit types for better type safety",
      examples: [],
    })

    // Anti-patterns
    this.antiPatterns.set("god-component", {
      id: "god-component",
      name: "God Component",
      category: "architecture",
      description: "Component with too many responsibilities",
      locations: [],
      severity: "high",
      impact: {
        maintainability: -8,
        performance: -3,
        security: 0,
        scalability: -6,
        testability: -7,
      },
      resolution: {
        approach: "Break down into smaller, focused components",
        steps: [
          "Identify distinct responsibilities",
          "Extract logical components",
          "Define clear interfaces",
          "Test component interactions",
        ],
        effort: "medium",
        timeframe: "1-2 weeks",
        risks: ["Potential breaking changes", "Need for integration testing"],
      },
      priority: 8,
    })

    // Code Smells
    this.codeSmells.set("large-class", {
      id: "large-class",
      name: "Large Class",
      type: "bloaters",
      description: "Class or component with too many lines of code",
      locations: [],
      severity: "major",
      refactoringStrategy: {
        technique: "Extract Class/Component",
        steps: [
          "Identify cohesive groups of methods/properties",
          "Extract related functionality into new class",
          "Update references and dependencies",
        ],
        preconditions: ["Comprehensive test coverage"],
        benefits: ["Better maintainability", "Improved readability"],
        risks: ["Potential API changes"],
      },
      effort: "medium",
      impact: {
        readability: -4,
        maintainability: -5,
        testability: -3,
        performance: 0,
      },
    })
  }

  /**
   * מקבל רשימת קבצי קוד
   */
  private async getCodeFiles(extensions: string[]): Promise<string[]> {
    const files: string[] = []

    const scanDirectory = async (dir: string): Promise<void> => {
      const items = await fs.readdir(dir, { withFileTypes: true })

      for (const item of items) {
        const fullPath = path.join(dir, item.name)

        if (item.isDirectory() && !this.shouldSkipDirectory(item.name)) {
          await scanDirectory(fullPath)
        } else if (item.isFile() && extensions.some((ext) => item.name.endsWith(ext))) {
          files.push(fullPath)
        }
      }
    }

    await scanDirectory(this.projectRoot)
    return files
  }

  private shouldSkipDirectory(name: string): boolean {
    const skipDirs = ["node_modules", ".git", ".next", "dist", "build", "coverage"]
    return skipDirs.includes(name) || name.startsWith(".")
  }

  /**
   * מנתח דפוסים בקובץ בודד
   */
  private async analyzeFilePatterns(file: string, content: string): Promise<CodePattern[]> {
    const patterns: CodePattern[] = []

    // בדיקת דפוסים מותאמים אישית
    for (const customPattern of this.config.customPatterns) {
      const matches = content.matchAll(new RegExp(customPattern.regex.source, "gm"))
      for (const match of matches) {
        if (match.index !== undefined) {
          const lineNumber = content.substring(0, match.index).split("\n").length
          patterns.push({
            id: `${customPattern.name}-${file}-${lineNumber}`,
            name: customPattern.name,
            type: customPattern.category === "good" ? "good_practice" : "anti_pattern",
            category: "typescript",
            description: customPattern.description,
            locations: [
              {
                file,
                startLine: lineNumber,
                context: this.getContext(content, match.index, 50),
                snippet: match[0],
              },
            ],
            frequency: 1,
            impact: customPattern.severity,
            recommendation: customPattern.suggestion,
            examples: [],
          })
        }
      }
    }

    // בדיקת שימוש ב-any type
    const anyMatches = content.matchAll(/:\s*any\b/gm)
    for (const match of anyMatches) {
      if (match.index !== undefined) {
        const lineNumber = content.substring(0, match.index).split("\n").length
        patterns.push({
          id: `any-type-${file}-${lineNumber}`,
          name: "Any Type Usage",
          type: "anti_pattern",
          category: "typescript",
          description: "Using 'any' type reduces type safety",
          locations: [
            {
              file,
              startLine: lineNumber,
              context: this.getContext(content, match.index, 50),
              snippet: match[0],
            },
          ],
          frequency: 1,
          impact: "medium",
          recommendation: "Use specific types instead of 'any'",
          examples: [],
        })
      }
    }

    return patterns
  }

  /**
   * מנתח דפוסי React
   */
  private async analyzeReactPatterns(files: string[]): Promise<CodePattern[]> {
    const patterns: CodePattern[] = []

    for (const file of files) {
      if (!file.endsWith(".tsx") && !file.endsWith(".jsx")) continue

      const content = await fs.readFile(file, "utf8")

      // בדיקת שימוש נכון ב-hooks
      const hookPatterns = this.analyzeHookUsage(file, content)
      patterns.push(...hookPatterns)

      // בדיקת component composition
      const compositionPatterns = this.analyzeComponentComposition(file, content)
      patterns.push(...compositionPatterns)
    }

    return patterns
  }

  /**
   * מנתח דפוסי TypeScript
   */
  private async analyzeTypeScriptPatterns(files: string[]): Promise<CodePattern[]> {
    const patterns: CodePattern[] = []

    for (const file of files) {
      if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue

      const content = await fs.readFile(file, "utf8")

      // בדיקת type safety
      const typeSafetyPatterns = this.analyzeTypeSafety(file, content)
      patterns.push(...typeSafetyPatterns)

      // בדיקת generic usage
      const genericPatterns = this.analyzeGenericUsage(file, content)
      patterns.push(...genericPatterns)
    }

    return patterns
  }

  // Helper methods for specific pattern analysis
  private analyzeHookUsage(file: string, content: string): CodePattern[] {
    // Implementation for React hooks analysis
    return []
  }

  private analyzeComponentComposition(file: string, content: string): CodePattern[] {
    // Implementation for component composition analysis
    return []
  }

  private analyzeTypeSafety(file: string, content: string): CodePattern[] {
    // Implementation for TypeScript type safety analysis
    return []
  }

  private analyzeGenericUsage(file: string, content: string): CodePattern[] {
    // Implementation for generic usage analysis
    return []
  }

  private async analyzeFolderStructure(): Promise<any> {
    // Implementation for folder structure analysis
    return {}
  }

  private identifyArchitecturalPatternsFromStructure(structure: any): ArchitecturalPattern[] {
    // Implementation for architectural pattern identification
    return []
  }

  private analyzeDependencyPatterns(dependencies: any): ArchitecturalPattern[] {
    // Implementation for dependency pattern analysis
    return []
  }

  private async analyzeLayerPatterns(): Promise<ArchitecturalPattern[]> {
    // Implementation for layer pattern analysis
    return []
  }

  private async detectCommonAntiPatterns(): Promise<AntiPattern[]> {
    // Implementation for common anti-pattern detection
    return []
  }

  private async detectReactAntiPatterns(): Promise<AntiPattern[]> {
    // Implementation for React anti-pattern detection
    return []
  }

  private async detectArchitecturalAntiPatterns(): Promise<AntiPattern[]> {
    // Implementation for architectural anti-pattern detection
    return []
  }

  private async detectPerformanceAntiPatterns(): Promise<AntiPattern[]> {
    // Implementation for performance anti-pattern detection
    return []
  }

  private async analyzeFileSmells(file: string, content: string): Promise<CodeSmell[]> {
    const smells: CodeSmell[] = []

    // בדיקת גודל קובץ
    const lines = content.split("\n").length
    if (lines > 500) {
      smells.push({
        id: `large-file-${file}`,
        name: "Large File",
        type: "bloaters",
        description: `File has ${lines} lines, which exceeds recommended limit`,
        locations: [{ file, startLine: 1, context: "Entire file", snippet: "" }],
        severity: "major",
        refactoringStrategy: {
          technique: "Extract Module",
          steps: ["Identify logical groups", "Extract to separate files", "Update imports"],
          preconditions: ["Good test coverage"],
          benefits: ["Better organization", "Easier navigation"],
          risks: ["Import path changes"],
        },
        effort: "medium",
        impact: {
          readability: -3,
          maintainability: -4,
          testability: -2,
          performance: 0,
        },
      })
    }

    // בדיקת פונקציות גדולות
    const functionMatches = content.matchAll(/function\s+\w+[^{]*\{/gm)
    for (const match of functionMatches) {
      if (match.index !== undefined) {
        const functionBody = this.extractFunctionBody(content, match.index)
        const functionLines = functionBody.split("\n").length

        if (functionLines > 50) {
          const lineNumber = content.substring(0, match.index).split("\n").length
          smells.push({
            id: `large-function-${file}-${lineNumber}`,
            name: "Large Function",
            type: "bloaters",
            description: `Function has ${functionLines} lines`,
            locations: [
              {
                file,
                startLine: lineNumber,
                context: this.getContext(content, match.index, 100),
                snippet: match[0],
              },
            ],
            severity: "major",
            refactoringStrategy: {
              technique: "Extract Method",
              steps: ["Identify coherent code blocks", "Extract to separate functions"],
              preconditions: ["Unit tests for the function"],
              benefits: ["Better readability", "Improved testability"],
              risks: ["Function interface changes"],
            },
            effort: "low",
            impact: {
              readability: -4,
              maintainability: -3,
              testability: -5,
              performance: 0,
            },
          })
        }
      }
    }

    return smells
  }

  private async identifyCreationalPatterns(): Promise<DesignPattern[]> {
    // Implementation for creational pattern identification
    return []
  }

  private async identifyStructuralPatterns(): Promise<DesignPattern[]> {
    // Implementation for structural pattern identification
    return []
  }

  private async identifyBehavioralPatterns(): Promise<DesignPattern[]> {
    // Implementation for behavioral pattern identification
    return []
  }

  private consolidatePatterns(patterns: CodePattern[]): CodePattern[] {
    // מיזוג דפוסים דומים וחישוב תדירות
    const consolidated = new Map<string, CodePattern>()

    patterns.forEach((pattern) => {
      const key = `${pattern.name}-${pattern.category}`
      if (consolidated.has(key)) {
        const existing = consolidated.get(key)!
        existing.frequency += 1
        existing.locations.push(...pattern.locations)
      } else {
        consolidated.set(key, { ...pattern })
      }
    })

    return Array.from(consolidated.values())
  }

  private prioritizeAntiPatterns(antiPatterns: AntiPattern[]): AntiPattern[] {
    return antiPatterns.sort((a, b) => b.priority - a.priority)
  }

  private categorizeSmells(smells: CodeSmell[]): CodeSmell[] {
    return smells.sort((a, b) => {
      const severityOrder = { critical: 3, major: 2, minor: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })
  }

  private identifyOptimizationOpportunities(results: PatternAnalysisResult): OptimizationOpportunity[] {
    const opportunities: OptimizationOpportunity[] = []

    // הזדמנויות על בסיס anti-patterns
    results.antiPatterns.forEach((antiPattern) => {
      opportunities.push({
        id: `opt-${antiPattern.id}`,
        type: "maintainability",
        description: `Address ${antiPattern.name} anti-pattern`,
        locations: antiPattern.locations,
        expectedBenefit: `Improve maintainability by resolving ${antiPattern.name}`,
        effort: antiPattern.resolution.effort,
        priority: antiPattern.priority,
        implementation: antiPattern.resolution.steps,
      })
    })

    // הזדמנויות על בסיס code smells
    results.codeSmells.forEach((smell) => {
      opportunities.push({
        id: `opt-${smell.id}`,
        type: "maintainability",
        description: `Refactor ${smell.name} code smell`,
        locations: smell.locations,
        expectedBenefit: smell.refactoringStrategy.benefits.join(", "),
        effort: smell.effort,
        priority: smell.severity === "critical" ? 9 : smell.severity === "major" ? 6 : 3,
        implementation: smell.refactoringStrategy.steps,
      })
    })

    return opportunities.sort((a, b) => b.priority - a.priority)
  }

  private async analyzePatternTrends(results: PatternAnalysisResult): Promise<PatternTrend[]> {
    // ניתוח מגמות יצריך נתונים היסטוריים
    return []
  }

  private assessPatternRisks(results: PatternAnalysisResult): PatternRiskAssessment {
    const criticalAntiPatterns = results.antiPatterns.filter((ap) => ap.severity === "critical").length
    const highSeveritySmells = results.codeSmells.filter((cs) => cs.severity === "critical").length

    const overallRisk = Math.min(10, (criticalAntiPatterns * 2 + highSeveritySmells) * 0.5)

    const criticalPatterns: CriticalPattern[] = results.antiPatterns
      .filter((ap) => ap.severity === "critical")
      .map((ap) => ({
        patternId: ap.id,
        name: ap.name,
        riskLevel: ap.priority,
        frequency: ap.locations.length,
        impact: `${ap.impact.maintainability} maintainability impact`,
        urgency: "high",
      }))

    return {
      overallRisk,
      riskByCategory: {
        code: results.codeSmells.length,
        architecture: results.antiPatterns.filter((ap) => ap.category === "architecture").length,
        performance: results.antiPatterns.filter((ap) => ap.category === "performance").length,
        security: results.antiPatterns.filter((ap) => ap.category === "security").length,
      },
      criticalPatterns,
      riskTrend: "stable",
      mitigationPlan: this.generateMitigationPlan(results),
    }
  }

  private generateMitigationPlan(results: PatternAnalysisResult): MitigationAction[] {
    const actions: MitigationAction[] = []

    // פעולות עבור anti-patterns קריטיים
    results.antiPatterns
      .filter((ap) => ap.severity === "critical")
      .forEach((ap) => {
        actions.push({
          action: `Resolve ${ap.name} anti-pattern`,
          priority: "immediate",
          effort: ap.resolution.effort,
          timeline: ap.resolution.timeframe,
          owner: "Development Team",
        })
      })

    return actions
  }

  // Utility methods
  private getContext(content: string, index: number, length: number): string {
    const start = Math.max(0, index - length)
    const end = Math.min(content.length, index + length)
    return content.substring(start, end)
  }

  private extractFunctionBody(content: string, startIndex: number): string {
    let braceCount = 0
    let i = startIndex
    let started = false

    while (i < content.length) {
      if (content[i] === "{") {
        braceCount++
        started = true
      } else if (content[i] === "}") {
        braceCount--
      }

      if (started && braceCount === 0) {
        return content.substring(startIndex, i + 1)
      }
      i++
    }

    return ""
  }

  private logPatternSummary(results: PatternAnalysisResult): void {
    console.log("📋 סיכום ניתוח דפוסים:")
    console.log(`├── 🎯 דפוסי קוד: ${results.codePatterns.length}`)
    console.log(`├── 🏗️ דפוסים ארכיטקטוניים: ${results.architecturalPatterns.length}`)
    console.log(`├── ⚠️ Anti-patterns: ${results.antiPatterns.length}`)
    console.log(`├── 👃 Code smells: ${results.codeSmells.length}`)
    console.log(`├── 🎨 Design patterns: ${results.designPatterns.length}`)
    console.log(`├── ⚡ הזדמנויות שיפור: ${results.optimizationOpportunities.length}`)
    console.log(`└── 🚨 סיכון כללי: ${results.riskAssessment.overallRisk}/10`)
  }

  /**
   * מייצא דוח דפוסים מפורט
   */
  public generatePatternReport(results: PatternAnalysisResult): string {
    return JSON.stringify(
      {
        summary: {
          totalPatterns: results.codePatterns.length,
          antiPatterns: results.antiPatterns.length,
          codeSmells: results.codeSmells.length,
          riskLevel: results.riskAssessment.overallRisk,
        },
        details: results,
        recommendations: results.optimizationOpportunities.slice(0, 10), // Top 10
      },
      null,
      2
    )
  }
}
