/**
 * Analytics Engine - Main orchestrator for Lions of Zion Intelligence Layer
 * ממנה את כל מנתחי הנתונים ומספק תובנות מתקדמות
 */

import { DataCollector } from "./data-collector"
import { MetricsCalculator } from "./metrics-calculator"
import { PatternAnalyzer } from "./pattern-analyzer"
import { TrendPredictor } from "./trend-predictor"
import { ReportGenerator } from "./report-generator"
import { AISuggestionsEngine } from "./ai-suggestions-engine"

// Legacy imports for backward compatibility
import { ProjectAnalytics } from "./project-analytics"
import { TrendAnalyzer } from "./trend-analyzer"
import { PatternDetector } from "./pattern-detector"
import { RecommendationEngine } from "./recommendation-engine"
import { PerformanceAnalyzer } from "./performance-analyzer"
import { SecurityAnalytics } from "./security-analytics"
import { TeamInsights } from "./team-insights"
import { TechnicalDebtAnalyzer } from "./technical-debt-analyzer"

export interface AnalyticsConfig {
  enableRealTimeAnalysis: boolean
  historicalDataRetention: number // days
  aiModelEndpoint?: string
  performanceThresholds: {
    loadTime: number
    bundleSize: number
    memoryUsage: number
  }
  securityScanLevel: "basic" | "advanced" | "military_grade"
  teamAnalyticsEnabled: boolean
}

export interface AnalyticsData {
  timestamp: Date
  projectHealth: ProjectHealthMetrics
  trends: TrendAnalysisResult
  patterns: PatternDetectionResult
  recommendations: RecommendationResult[]
  performance: PerformanceMetrics
  security: SecurityAssessment
  team: TeamMetrics
  technicalDebt: TechnicalDebtMetrics
  aiSuggestions: AISuggestion[]
}

export interface ProjectHealthMetrics {
  overallScore: number // 0-100
  codeQuality: number
  maintainability: number
  testCoverage: number
  documentation: number
  security: number
  performance: number
  technicalDebt: number
  trend: "improving" | "stable" | "declining"
}

export interface TrendAnalysisResult {
  developmentVelocity: VelocityTrend
  codeQualityTrend: QualityTrend
  issueResolutionTrend: IssueTrend
  performanceTrend: PerformanceTrend
  predictiveInsights: PredictiveInsight[]
}

export interface PatternDetectionResult {
  antiPatterns: AntiPattern[]
  architecturePatterns: ArchitecturePattern[]
  codeSmells: CodeSmell[]
  designPatterns: DesignPattern[]
  optimizationOpportunities: OptimizationOpportunity[]
}

export interface RecommendationResult {
  id: string
  type: "refactoring" | "performance" | "security" | "architecture" | "best_practice"
  priority: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  effort: "low" | "medium" | "high"
  automatable: boolean
  aiGenerated: boolean
  confidence: number // 0-1
  relatedFiles: string[]
  suggestedActions: SuggestedAction[]
}

export interface PerformanceMetrics {
  bundleSize: BundleSizeMetrics
  loadTime: LoadTimeMetrics
  runtime: RuntimeMetrics
  memory: MemoryMetrics
  criticalPath: CriticalPathMetrics
  webVitals: WebVitalsMetrics
}

export interface SecurityAssessment {
  overallRiskScore: number // 0-10
  vulnerabilities: Vulnerability[]
  attackSurface: AttackSurfaceAnalysis
  complianceGaps: ComplianceGap[]
  securityPosture: SecurityPosture
  threatTrends: ThreatTrend[]
}

export interface TeamMetrics {
  productivity: ProductivityMetrics
  collaboration: CollaborationMetrics
  knowledgeDistribution: KnowledgeDistribution
  skillGaps: SkillGap[]
  onboardingEffectiveness: OnboardingMetrics
  codeReviewEffectiveness: CodeReviewMetrics
}

export interface TechnicalDebtMetrics {
  overallDebtScore: number // 0-100
  debtByCategory: { [category: string]: number }
  velocityImpact: number // percentage
  paydownOpportunities: DebtPaydownOpportunity[]
  costBenefitAnalysis: CostBenefitAnalysis
  debtTrend: "increasing" | "stable" | "decreasing"
}

export interface AISuggestion {
  id: string
  type: "code_generation" | "architecture" | "optimization" | "fix" | "enhancement"
  confidence: number // 0-1
  suggestion: string
  explanation: string
  codeExample?: string
  relatedFiles: string[]
  estimatedBenefit: string
  implementationGuide: string[]
}

export class AnalyticsEngine {
  private config: AnalyticsConfig
  private projectAnalytics: ProjectAnalytics
  private trendAnalyzer: TrendAnalyzer
  private patternDetector: PatternDetector
  private recommendationEngine: RecommendationEngine
  private performanceAnalyzer: PerformanceAnalyzer
  private securityAnalytics: SecurityAnalytics
  private teamInsights: TeamInsights
  private technicalDebtAnalyzer: TechnicalDebtAnalyzer
  private aiSuggestionsEngine: AISuggestionsEngine

  private historicalData: AnalyticsData[] = []
  private lastAnalysis: AnalyticsData | null = null
  private analysisInterval: NodeJS.Timeout | null = null

  constructor(config: AnalyticsConfig) {
    this.config = config
    this.initializeAnalyzers()
  }

  private initializeAnalyzers(): void {
    this.projectAnalytics = new ProjectAnalytics(this.config)
    this.trendAnalyzer = new TrendAnalyzer(this.config)
    this.patternDetector = new PatternDetector(this.config)
    this.recommendationEngine = new RecommendationEngine(this.config)
    this.performanceAnalyzer = new PerformanceAnalyzer(this.config)
    this.securityAnalytics = new SecurityAnalytics(this.config)
    this.teamInsights = new TeamInsights(this.config)
    this.technicalDebtAnalyzer = new TechnicalDebtAnalyzer(this.config)
    this.aiSuggestionsEngine = new AISuggestionsEngine(this.config)
  }

  /**
   * מתחיל ניתוח רציף של הפרויקט
   */
  public async startContinuousAnalysis(intervalMinutes: number = 15): Promise<void> {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval)
    }

    // ניתוח ראשוני
    await this.runFullAnalysis()

    if (this.config.enableRealTimeAnalysis) {
      this.analysisInterval = setInterval(
        async () => {
          await this.runIncrementalAnalysis()
        },
        intervalMinutes * 60 * 1000
      )
    }
  }

  /**
   * מבצע ניתוח מלא של הפרויקט
   */
  public async runFullAnalysis(): Promise<AnalyticsData> {
    console.log("🧠 מתחיל ניתוח מלא של פלטפורמת Lions of Zion...")

    try {
      const timestamp = new Date()

      // ריצה מקבילה של כל המנתחים לביצועים מיטביים
      const [projectHealth, trends, patterns, performance, security, team, technicalDebt] = await Promise.all([
        this.projectAnalytics.analyzeProjectHealth(),
        this.trendAnalyzer.analyzeTrends(this.historicalData),
        this.patternDetector.detectPatterns(),
        this.performanceAnalyzer.analyzePerformance(),
        this.securityAnalytics.assessSecurity(),
        this.teamInsights.analyzeTeam(),
        this.technicalDebtAnalyzer.analyzeTechnicalDebt(),
      ])

      // יצירת המלצות על בסיס כל הנתונים
      const recommendations = await this.recommendationEngine.generateRecommendations({
        projectHealth,
        trends,
        patterns,
        performance,
        security,
        team,
        technicalDebt,
      })

      // יצירת הצעות AI מתקדמות
      const aiSuggestions = await this.aiSuggestionsEngine.generateSuggestions({
        projectHealth,
        trends,
        patterns,
        recommendations,
        performance,
        security,
      })

      const analysisData: AnalyticsData = {
        timestamp,
        projectHealth,
        trends,
        patterns,
        recommendations,
        performance,
        security,
        team,
        technicalDebt,
        aiSuggestions,
      }

      this.lastAnalysis = analysisData
      this.addToHistoricalData(analysisData)

      console.log("✅ ניתוח מלא הושלם בהצלחה")
      console.log(`📊 ציון בריאות פרויקט: ${projectHealth.overallScore}/100`)
      console.log(`🎯 נמצאו ${recommendations.length} המלצות לשיפור`)
      console.log(`🤖 נוצרו ${aiSuggestions.length} הצעות AI מתקדמות`)

      return analysisData
    } catch (error) {
      console.error("❌ שגיאה בניתוח מלא:", error)
      throw error
    }
  }

  /**
   * מבצע ניתוח מצומצם עבור עדכונים מהירים
   */
  public async runIncrementalAnalysis(): Promise<Partial<AnalyticsData>> {
    console.log("🔄 מבצע ניתוח מצומצם...")

    try {
      const timestamp = new Date()

      // ניתוח מצומצם של נתונים קריטיים בלבד
      const [projectHealth, performance, security] = await Promise.all([
        this.projectAnalytics.quickHealthCheck(),
        this.performanceAnalyzer.quickPerformanceCheck(),
        this.securityAnalytics.quickSecurityScan(),
      ])

      const incrementalData: Partial<AnalyticsData> = {
        timestamp,
        projectHealth,
        performance,
        security,
      }

      console.log("✅ ניתוח מצומצם הושלם")
      return incrementalData
    } catch (error) {
      console.error("❌ שגיאה בניתוח מצומצם:", error)
      throw error
    }
  }

  /**
   * מחזיר תובנות מותאמות אישית לפי קריטריונים
   */
  public getCustomInsights(criteria: {
    timeRange?: { start: Date; end: Date }
    categories?: string[]
    priority?: string[]
    includeAI?: boolean
  }): CustomInsights {
    if (!this.lastAnalysis) {
      throw new Error("לא בוצע ניתוח עדיין")
    }

    return {
      summary: this.generateInsightsSummary(criteria),
      recommendations: this.filterRecommendations(criteria),
      trends: this.filterTrends(criteria),
      aiSuggestions: criteria.includeAI ? this.filterAISuggestions(criteria) : [],
      actionableItems: this.getActionableItems(criteria),
    }
  }

  /**
   * מייצא דוח מלא לצורכי ניטור ודיווח
   */
  public exportAnalyticsReport(format: "json" | "markdown" | "html" = "json"): string {
    if (!this.lastAnalysis) {
      throw new Error("לא בוצע ניתוח עדיין")
    }

    switch (format) {
      case "json":
        return JSON.stringify(this.lastAnalysis, null, 2)
      case "markdown":
        return this.generateMarkdownReport()
      case "html":
        return this.generateHtmlReport()
      default:
        throw new Error(`פורמט לא נתמך: ${format}`)
    }
  }

  /**
   * מחזיר סטטוס ריאל-טיים של מערכת האנליטיקה
   */
  public getAnalyticsStatus(): AnalyticsStatus {
    return {
      isRunning: this.analysisInterval !== null,
      lastAnalysisTime: this.lastAnalysis?.timestamp || null,
      historicalDataCount: this.historicalData.length,
      analysisHealth: this.getAnalysisHealth(),
      activeAnalyzers: this.getActiveAnalyzers(),
    }
  }

  /**
   * עוצר את הניתוח הרציף וניקוי משאבים
   */
  public stopAnalysis(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval)
      this.analysisInterval = null
    }
    console.log("🛑 ניתוח רציף הופסק")
  }

  // Private helper methods
  private addToHistoricalData(data: AnalyticsData): void {
    this.historicalData.push(data)

    // ניקוי נתונים ישנים לפי תצורה
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - this.config.historicalDataRetention)

    this.historicalData = this.historicalData.filter((item) => item.timestamp >= cutoffDate)
  }

  private generateInsightsSummary(criteria: any): string {
    // לוגיקה ליצירת סיכום תובנות מותאם
    return "סיכום תובנות מותאם אישית"
  }

  private filterRecommendations(criteria: any): RecommendationResult[] {
    // לוגיקה לסינון המלצות לפי קריטריונים
    return this.lastAnalysis?.recommendations || []
  }

  private filterTrends(criteria: any): TrendAnalysisResult | null {
    // לוגיקה לסינון מגמות לפי קריטריונים
    return this.lastAnalysis?.trends || null
  }

  private filterAISuggestions(criteria: any): AISuggestion[] {
    // לוגיקה לסינון הצעות AI לפי קריטריונים
    return this.lastAnalysis?.aiSuggestions || []
  }

  private getActionableItems(criteria: any): ActionableItem[] {
    // לוגיקה ליצירת פריטים פעילים
    return []
  }

  private generateMarkdownReport(): string {
    // לוגיקה ליצירת דוח Markdown
    return "# דוח אנליטיקה - Lions of Zion\n\n"
  }

  private generateHtmlReport(): string {
    // לוגיקה ליצירת דוח HTML
    return "<html><head><title>דוח אנליטיקה</title></head><body></body></html>"
  }

  private getAnalysisHealth(): "healthy" | "warning" | "error" {
    // לוגיקה לבדיקת בריאות הניתוח
    return "healthy"
  }

  private getActiveAnalyzers(): string[] {
    return [
      "ProjectAnalytics",
      "TrendAnalyzer",
      "PatternDetector",
      "RecommendationEngine",
      "PerformanceAnalyzer",
      "SecurityAnalytics",
      "TeamInsights",
      "TechnicalDebtAnalyzer",
      "AISuggestionsEngine",
    ]
  }
}

// Additional interfaces
export interface CustomInsights {
  summary: string
  recommendations: RecommendationResult[]
  trends: TrendAnalysisResult | null
  aiSuggestions: AISuggestion[]
  actionableItems: ActionableItem[]
}

export interface AnalyticsStatus {
  isRunning: boolean
  lastAnalysisTime: Date | null
  historicalDataCount: number
  analysisHealth: "healthy" | "warning" | "error"
  activeAnalyzers: string[]
}

export interface ActionableItem {
  id: string
  title: string
  description: string
  priority: "critical" | "high" | "medium" | "low"
  category: string
  estimatedEffort: string
  expectedImpact: string
}

// Type definitions for complex types
export interface VelocityTrend {
  trend: string
  velocity: number
}
export interface QualityTrend {
  trend: string
  score: number
}
export interface IssueTrend {
  trend: string
  resolution: number
}
export interface PerformanceTrend {
  trend: string
  metrics: any
}
export interface PredictiveInsight {
  type: string
  prediction: string
  confidence: number
}
export interface AntiPattern {
  name: string
  location: string
  severity: string
}
export interface ArchitecturePattern {
  name: string
  usage: string
  recommendation: string
}
export interface CodeSmell {
  type: string
  location: string
  severity: string
}
export interface DesignPattern {
  name: string
  usage: string
  optimization: string
}
export interface OptimizationOpportunity {
  type: string
  location: string
  benefit: string
}
export interface SuggestedAction {
  action: string
  description: string
}
export interface BundleSizeMetrics {
  total: number
  trend: string
}
export interface LoadTimeMetrics {
  average: number
  trend: string
}
export interface RuntimeMetrics {
  performance: number
  trend: string
}
export interface MemoryMetrics {
  usage: number
  trend: string
}
export interface CriticalPathMetrics {
  path: string
  optimization: string
}
export interface WebVitalsMetrics {
  lcp: number
  fid: number
  cls: number
}
export interface Vulnerability {
  id: string
  severity: string
  description: string
}
export interface AttackSurfaceAnalysis {
  score: number
  vectors: string[]
}
export interface ComplianceGap {
  standard: string
  gap: string
  priority: string
}
export interface SecurityPosture {
  score: number
  improvements: string[]
}
export interface ThreatTrend {
  type: string
  trend: string
  risk: string
}
export interface ProductivityMetrics {
  score: number
  trend: string
}
export interface CollaborationMetrics {
  score: number
  patterns: string[]
}
export interface KnowledgeDistribution {
  distribution: any
  recommendations: string[]
}
export interface SkillGap {
  skill: string
  gap: string
  priority: string
}
export interface OnboardingMetrics {
  effectiveness: number
  improvements: string[]
}
export interface CodeReviewMetrics {
  effectiveness: number
  recommendations: string[]
}
export interface DebtPaydownOpportunity {
  type: string
  effort: string
  benefit: string
}
export interface CostBenefitAnalysis {
  cost: number
  benefit: number
  roi: number
}

// Export new advanced analytics modules
export * from "./data-collector"
export * from "./metrics-calculator"
export * from "./pattern-analyzer"
export * from "./trend-predictor"
export * from "./report-generator"
export * from "./ai-suggestions-engine"

// Export legacy modules for backward compatibility
export * from "./project-analytics"
export * from "./trend-analyzer"
export * from "./pattern-detector"
export * from "./recommendation-engine"
export * from "./performance-analyzer"
export * from "./security-analytics"
export * from "./team-insights"
export * from "./technical-debt-analyzer"
