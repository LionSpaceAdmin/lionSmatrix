/**
 * Report Generator - מחולל דוחות מתקדם עבור מנוע האנליטיקה
 * יוצר דוחות מקיפים במספר פורמטים עם תמיכה בעברית ואנגלית
 */

import * as fs from "fs/promises"
import * as path from "path"
import { CollectedData } from "./data-collector"
import { CalculatedMetrics } from "./metrics-calculator"
import { PatternAnalysisResult } from "./pattern-analyzer"
import { ComprehensiveForecast } from "./trend-predictor"

export interface ReportConfig {
  outputDirectory: string
  supportedFormats: ReportFormat[]
  includeSummary: boolean
  includeCharts: boolean
  includeRecommendations: boolean
  includeHistoricalData: boolean
  language: "he" | "en" | "both"
  theme: "light" | "dark" | "military"
  branding: BrandingConfig
  scheduling: SchedulingConfig
}

export interface BrandingConfig {
  projectName: string
  organization: string
  logo?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    warning: string
    success: string
    danger: string
  }
  customCSS?: string
}

export interface SchedulingConfig {
  enabled: boolean
  frequency: "daily" | "weekly" | "monthly" | "quarterly"
  recipients: string[]
  autoExport: boolean
  retention: number // days
}

export type ReportFormat = "html" | "pdf" | "markdown" | "json" | "excel" | "csv"

export interface ReportData {
  metadata: ReportMetadata
  summary: ExecutiveSummary
  dataCollection: CollectedData
  metrics: CalculatedMetrics
  patterns?: PatternAnalysisResult
  forecast?: ComprehensiveForecast
  charts: ChartData[]
  recommendations: ReportRecommendation[]
  appendices: Appendix[]
}

export interface ReportMetadata {
  id: string
  title: string
  generatedAt: Date
  period: {
    start: Date
    end: Date
  }
  version: string
  author: string
  classification: "public" | "internal" | "confidential" | "restricted"
  tags: string[]
}

export interface ExecutiveSummary {
  overallHealth: HealthIndicator
  keyMetrics: KeyMetric[]
  criticalIssues: CriticalIssue[]
  topAchievements: Achievement[]
  recommendations: string[]
  riskAssessment: RiskSummary
  futureOutlook: string
}

export interface HealthIndicator {
  score: number
  trend: "improving" | "stable" | "declining"
  status: "excellent" | "good" | "fair" | "poor" | "critical"
  description: string
}

export interface KeyMetric {
  name: string
  value: number | string
  unit?: string
  trend: number // percentage change
  benchmark?: number
  status: "good" | "warning" | "critical"
  description: string
}

export interface CriticalIssue {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  category: string
  description: string
  impact: string
  recommendation: string
  priority: number
}

export interface Achievement {
  title: string
  description: string
  metric: string
  improvement: string
  category: string
}

export interface RiskSummary {
  overallRisk: number
  riskLevel: "low" | "medium" | "high" | "critical"
  topRisks: Risk[]
  mitigation: string[]
}

export interface Risk {
  risk: string
  probability: number
  impact: string
  category: string
}

export interface ChartData {
  id: string
  type: "line" | "bar" | "pie" | "area" | "scatter" | "heatmap"
  title: string
  data: any
  config: ChartConfig
}

export interface ChartConfig {
  width: number
  height: number
  colors: string[]
  showLegend: boolean
  showGrid: boolean
  responsive: boolean
  animation: boolean
}

export interface ReportRecommendation {
  id: string
  category: string
  priority: "immediate" | "high" | "medium" | "low"
  title: string
  description: string
  actionItems: ActionItem[]
  expectedBenefit: string
  effort: string
  timeline: string
  owner: string
  successCriteria: string[]
}

export interface ActionItem {
  action: string
  responsible: string
  dueDate?: Date
  status: "pending" | "in_progress" | "completed" | "blocked"
}

export interface Appendix {
  title: string
  content: string
  type: "table" | "chart" | "text" | "code" | "image"
  data?: any
}

export interface GeneratedReport {
  metadata: ReportMetadata
  content: string
  format: ReportFormat
  filePath: string
  size: number
}

export class ReportGenerator {
  private config: ReportConfig

  constructor(config: ReportConfig) {
    this.config = config
  }

  /**
   * יוצר דוח מקיף מכל המידע שנאסף
   */
  public async generateComprehensiveReport(
    data: CollectedData,
    metrics: CalculatedMetrics,
    patterns?: PatternAnalysisResult,
    forecast?: ComprehensiveForecast
  ): Promise<GeneratedReport[]> {
    console.log("📋 מתחיל יצירת דוח מקיף...")

    // הכנת נתוני הדוח
    const reportData = this.prepareReportData(data, metrics, patterns, forecast)

    // יצירת דוחות בפורמטים השונים
    const reports: GeneratedReport[] = []

    for (const format of this.config.supportedFormats) {
      try {
        const report = await this.generateReportInFormat(reportData, format)
        reports.push(report)
        console.log(`✅ דוח ${format.toUpperCase()} נוצר בהצלחה: ${report.filePath}`)
      } catch (error) {
        console.error(`❌ שגיאה ביצירת דוח ${format}:`, error)
      }
    }

    // שמירת metadata
    await this.saveReportMetadata(reportData.metadata, reports)

    console.log(`🎉 יצירת דוחות הושלמה - נוצרו ${reports.length} דוחות`)
    return reports
  }

  /**
   * הכנת נתוני הדוח
   */
  private prepareReportData(
    data: CollectedData,
    metrics: CalculatedMetrics,
    patterns?: PatternAnalysisResult,
    forecast?: ComprehensiveForecast
  ): ReportData {
    const metadata = this.createReportMetadata()
    const summary = this.createExecutiveSummary(metrics, patterns, forecast)
    const charts = this.generateChartData(data, metrics, patterns, forecast)
    const recommendations = this.generateRecommendations(metrics, patterns, forecast)
    const appendices = this.generateAppendices(data, metrics, patterns, forecast)

    return {
      metadata,
      summary,
      dataCollection: data,
      metrics,
      patterns,
      forecast,
      charts,
      recommendations,
      appendices,
    }
  }

  /**
   * יצירת metadata לדוח
   */
  private createReportMetadata(): ReportMetadata {
    const now = new Date()
    const oneMonthAgo = new Date(now)
    oneMonthAgo.setMonth(now.getMonth() - 1)

    return {
      id: `report-${now.toISOString().split("T")[0]}-${Date.now()}`,
      title: `${this.config.branding.projectName} - Analytics Report`,
      generatedAt: now,
      period: {
        start: oneMonthAgo,
        end: now,
      },
      version: "1.0.0",
      author: "Lions of Zion Analytics Engine",
      classification: "internal",
      tags: ["analytics", "health", "performance", "security", "quality"],
    }
  }

  /**
   * יצירת סיכום מנהלים
   */
  private createExecutiveSummary(
    metrics: CalculatedMetrics,
    patterns?: PatternAnalysisResult,
    forecast?: ComprehensiveForecast
  ): ExecutiveSummary {
    const overallHealth = this.calculateOverallHealth(metrics)
    const keyMetrics = this.extractKeyMetrics(metrics)
    const criticalIssues = this.identifyCriticalIssues(metrics, patterns)
    const topAchievements = this.identifyAchievements(metrics)
    const recommendations = this.extractTopRecommendations(forecast)
    const riskAssessment = this.summarizeRisks(metrics, patterns)
    const futureOutlook = this.generateFutureOutlook(forecast)

    return {
      overallHealth,
      keyMetrics,
      criticalIssues,
      topAchievements,
      recommendations,
      riskAssessment,
      futureOutlook,
    }
  }

  /**
   * חישוב בריאות כללית
   */
  private calculateOverallHealth(metrics: CalculatedMetrics): HealthIndicator {
    const score = metrics.projectHealth.overallScore
    const trend = metrics.projectHealth.trend

    let status: HealthIndicator["status"]
    if (score >= 90) status = "excellent"
    else if (score >= 80) status = "good"
    else if (score >= 70) status = "fair"
    else if (score >= 60) status = "poor"
    else status = "critical"

    return {
      score,
      trend,
      status,
      description: this.getHealthDescription(score, trend),
    }
  }

  private getHealthDescription(score: number, trend: "improving" | "stable" | "declining"): string {
    if (this.config.language === "he") {
      if (score >= 90) return `בריאות מצוינת של הפרויקט (${score}/100). המערכת פועלת ברמה גבוהה.`
      if (score >= 80) return `בריאות טובה של הפרויקט (${score}/100). יש מקום לשיפורים קלים.`
      if (score >= 70) return `בריאות סבירה של הפרויקט (${score}/100). נדרשים שיפורים ממוקדים.`
      if (score >= 60) return `בריאות נמוכה של הפרויקט (${score}/100). נדרש טיפול דחוף.`
      return `בריאות קריטית של הפרויקט (${score}/100). נדרשות פעולות מיידיות.`
    } else {
      if (score >= 90) return `Excellent project health (${score}/100). System is performing at a high level.`
      if (score >= 80) return `Good project health (${score}/100). Minor improvements needed.`
      if (score >= 70) return `Fair project health (${score}/100). Focused improvements required.`
      if (score >= 60) return `Poor project health (${score}/100). Urgent attention needed.`
      return `Critical project health (${score}/100). Immediate action required.`
    }
  }

  /**
   * חילוץ מטריקות מפתח
   */
  private extractKeyMetrics(metrics: CalculatedMetrics): KeyMetric[] {
    return [
      {
        name: this.config.language === "he" ? "ציון איכות קוד" : "Code Quality Score",
        value: metrics.qualityScore.overall,
        unit: "/100",
        trend: 0, // Would need historical data
        status:
          metrics.qualityScore.overall >= 80 ? "good" : metrics.qualityScore.overall >= 60 ? "warning" : "critical",
        description: this.config.language === "he" ? "ציון כללי לאיכות הקוד" : "Overall code quality rating",
      },
      {
        name: this.config.language === "he" ? "ציון ביצועים" : "Performance Score",
        value: metrics.performanceScore.overall,
        unit: "/100",
        trend: 0,
        status:
          metrics.performanceScore.overall >= 80
            ? "good"
            : metrics.performanceScore.overall >= 60
              ? "warning"
              : "critical",
        description: this.config.language === "he" ? "ציון כללי לביצועי המערכת" : "Overall system performance rating",
      },
      {
        name: this.config.language === "he" ? "ציון אבטחה" : "Security Score",
        value: metrics.securityScore.overall,
        unit: "/100",
        trend: 0,
        status:
          metrics.securityScore.overall >= 90 ? "good" : metrics.securityScore.overall >= 70 ? "warning" : "critical",
        description: this.config.language === "he" ? "ציון אבטחת המערכת" : "System security rating",
      },
      {
        name: this.config.language === "he" ? "מהירות פיתוח" : "Development Velocity",
        value: metrics.velocityMetrics.developmentVelocity,
        unit: "commits/week",
        trend: 0,
        status: metrics.velocityMetrics.developmentVelocity >= 20 ? "good" : "warning",
        description: this.config.language === "he" ? "מהירות הפיתוח השבועית" : "Weekly development velocity",
      },
    ]
  }

  /**
   * זיהוי בעיות קריטיות
   */
  private identifyCriticalIssues(metrics: CalculatedMetrics, patterns?: PatternAnalysisResult): CriticalIssue[] {
    const issues: CriticalIssue[] = []

    // בעיות מבוססות על מטריקות
    if (metrics.securityScore.overall < 70) {
      issues.push({
        id: "security-low",
        title: this.config.language === "he" ? "ציון אבטחה נמוך" : "Low Security Score",
        severity: "critical",
        category: "Security",
        description:
          this.config.language === "he"
            ? "ציון האבטחה נמוך מהסף הנדרש"
            : "Security score is below acceptable threshold",
        impact: this.config.language === "he" ? "סיכון לפגיעות אבטחה" : "Risk of security vulnerabilities",
        recommendation:
          this.config.language === "he"
            ? "בצע סקירת אבטחה מקיפה ותקן פגיעויות"
            : "Conduct comprehensive security audit and fix vulnerabilities",
        priority: 9,
      })
    }

    if (metrics.performanceScore.overall < 60) {
      issues.push({
        id: "performance-poor",
        title: this.config.language === "he" ? "ביצועים ירודים" : "Poor Performance",
        severity: "high",
        category: "Performance",
        description:
          this.config.language === "he" ? "ביצועי המערכת נמוכים מהנדרש" : "System performance is below requirements",
        impact: this.config.language === "he" ? "חוויית משתמש ירודה ואיטיות" : "Poor user experience and sluggishness",
        recommendation:
          this.config.language === "he" ? "אופטם את הקוד ושפר את הביצועים" : "Optimize code and improve performance",
        priority: 8,
      })
    }

    // בעיות מבוססות על דפוסים
    if (patterns) {
      patterns.antiPatterns
        .filter((ap) => ap.severity === "critical")
        .forEach((ap) => {
          issues.push({
            id: `pattern-${ap.id}`,
            title: ap.name,
            severity: "high",
            category: "Code Quality",
            description: ap.description,
            impact: `Maintainability impact: ${ap.impact.maintainability}`,
            recommendation: ap.resolution.approach,
            priority: ap.priority,
          })
        })
    }

    return issues.sort((a, b) => b.priority - a.priority).slice(0, 5) // Top 5 critical issues
  }

  /**
   * זיהוי הישגים
   */
  private identifyAchievements(metrics: CalculatedMetrics): Achievement[] {
    const achievements: Achievement[] = []

    if (metrics.qualityScore.overall >= 90) {
      achievements.push({
        title: this.config.language === "he" ? "איכות קוד מצוינת" : "Excellent Code Quality",
        description:
          this.config.language === "he"
            ? "הפרויקט השיג ציון איכות קוד מעולה"
            : "Project achieved excellent code quality score",
        metric: "Code Quality",
        improvement: `${metrics.qualityScore.overall}/100`,
        category: "Quality",
      })
    }

    if (metrics.securityScore.overall >= 95) {
      achievements.push({
        title: this.config.language === "he" ? "אבטחה מקסימלית" : "Maximum Security",
        description:
          this.config.language === "he" ? "המערכת עומדת ברמת אבטחה גבוהה" : "System meets high security standards",
        metric: "Security",
        improvement: `${metrics.securityScore.overall}/100`,
        category: "Security",
      })
    }

    return achievements
  }

  /**
   * חילוץ המלצות עליונות
   */
  private extractTopRecommendations(forecast?: ComprehensiveForecast): string[] {
    if (!forecast) {
      return [
        this.config.language === "he"
          ? "אסוף נתונים היסטוריים לחיזוי מגמות"
          : "Collect historical data for trend prediction",
        this.config.language === "he" ? "שפר כיסוי בדיקות" : "Improve test coverage",
        this.config.language === "he" ? "צמצם חוב טכני" : "Reduce technical debt",
      ]
    }

    return forecast.recommendations.slice(0, 5).map((rec) => (this.config.language === "he" ? rec.action : rec.action))
  }

  /**
   * סיכום סיכונים
   */
  private summarizeRisks(metrics: CalculatedMetrics, patterns?: PatternAnalysisResult): RiskSummary {
    const overallRisk = metrics.riskAssessment.overallRisk
    let riskLevel: RiskSummary["riskLevel"]

    if (overallRisk <= 3) riskLevel = "low"
    else if (overallRisk <= 6) riskLevel = "medium"
    else if (overallRisk <= 8) riskLevel = "high"
    else riskLevel = "critical"

    const topRisks: Risk[] = [
      {
        risk: this.config.language === "he" ? "סיכון טכני" : "Technical Risk",
        probability: metrics.riskAssessment.technicalRisk / 10,
        impact: this.config.language === "he" ? "השפעה על תחזוקה" : "Impact on maintainability",
        category: "Technical",
      },
      {
        risk: this.config.language === "he" ? "סיכון ביצועים" : "Performance Risk",
        probability: metrics.riskAssessment.performanceRisk / 10,
        impact: this.config.language === "he" ? "השפעה על חוויית משתמש" : "Impact on user experience",
        category: "Performance",
      },
    ]

    return {
      overallRisk,
      riskLevel,
      topRisks,
      mitigation: [
        this.config.language === "he" ? "ביצוע סקירות קוד קבועות" : "Conduct regular code reviews",
        this.config.language === "he" ? "יישום בדיקות אוטומטיות" : "Implement automated testing",
      ],
    }
  }

  /**
   * יצירת תחזית עתידית
   */
  private generateFutureOutlook(forecast?: ComprehensiveForecast): string {
    if (!forecast) {
      return this.config.language === "he"
        ? "נדרשים נתונים היסטוריים נוספים ליצירת תחזית מדויקת"
        : "Additional historical data required for accurate forecasting"
    }

    const alerts = forecast.alerts.filter((alert) => alert.severity >= 7)
    if (alerts.length > 0) {
      return this.config.language === "he"
        ? "צפויות בעיות קריטיות בתקופה הקרובה - נדרשת התערבות מיידית"
        : "Critical issues expected in near future - immediate intervention required"
    }

    return this.config.language === "he"
      ? "הפרויקט צפוי להמשיך במגמה יציבה עם שיפורים הדרגתיים"
      : "Project expected to continue stable trend with gradual improvements"
  }

  /**
   * יצירת נתוני תרשימים
   */
  private generateChartData(
    data: CollectedData,
    metrics: CalculatedMetrics,
    patterns?: PatternAnalysisResult,
    forecast?: ComprehensiveForecast
  ): ChartData[] {
    const charts: ChartData[] = []

    // תרשים בריאות פרויקט
    charts.push({
      id: "project-health",
      type: "pie",
      title: this.config.language === "he" ? "התפלגות בריאות פרויקט" : "Project Health Distribution",
      data: {
        labels: [
          this.config.language === "he" ? "איכות קוד" : "Code Quality",
          this.config.language === "he" ? "ביצועים" : "Performance",
          this.config.language === "he" ? "אבטחה" : "Security",
          this.config.language === "he" ? "תחזוקתיות" : "Maintainability",
        ],
        datasets: [
          {
            data: [
              metrics.projectHealth.codeQuality,
              metrics.projectHealth.performance,
              metrics.projectHealth.security,
              metrics.projectHealth.maintainability,
            ],
            backgroundColor: this.config.branding.colors
              ? [
                  this.config.branding.colors.primary,
                  this.config.branding.colors.secondary,
                  this.config.branding.colors.accent,
                  this.config.branding.colors.success,
                ]
              : ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
          },
        ],
      },
      config: {
        width: 400,
        height: 300,
        colors: [],
        showLegend: true,
        showGrid: false,
        responsive: true,
        animation: true,
      },
    })

    // תרשים מטריקות זמן
    if (forecast && forecast.projectHealth.predictedScore.length > 0) {
      charts.push({
        id: "health-trend",
        type: "line",
        title: this.config.language === "he" ? "מגמת בריאות פרויקט" : "Project Health Trend",
        data: {
          labels: forecast.projectHealth.predictedScore.map((p) => p.timestamp.toLocaleDateString()),
          datasets: [
            {
              label: this.config.language === "he" ? "ציון בריאות" : "Health Score",
              data: forecast.projectHealth.predictedScore.map((p) => p.value),
              borderColor: this.config.branding.colors?.primary || "#3B82F6",
              backgroundColor: (this.config.branding.colors?.primary || "#3B82F6") + "20",
              fill: true,
            },
          ],
        },
        config: {
          width: 600,
          height: 300,
          colors: [],
          showLegend: true,
          showGrid: true,
          responsive: true,
          animation: true,
        },
      })
    }

    // תרשים דפוסים
    if (patterns) {
      const patternCategories = this.categorizePatterns(patterns)
      charts.push({
        id: "pattern-distribution",
        type: "bar",
        title: this.config.language === "he" ? "התפלגות דפוסים" : "Pattern Distribution",
        data: {
          labels: Object.keys(patternCategories),
          datasets: [
            {
              label: this.config.language === "he" ? "מספר דפוסים" : "Number of Patterns",
              data: Object.values(patternCategories),
              backgroundColor: this.config.branding.colors?.accent || "#F59E0B",
            },
          ],
        },
        config: {
          width: 500,
          height: 300,
          colors: [],
          showLegend: false,
          showGrid: true,
          responsive: true,
          animation: true,
        },
      })
    }

    return charts
  }

  /**
   * קטגוריזציה של דפוסים
   */
  private categorizePatterns(patterns: PatternAnalysisResult): { [category: string]: number } {
    const categories: { [category: string]: number } = {}

    patterns.codePatterns.forEach((pattern) => {
      categories[pattern.category] = (categories[pattern.category] || 0) + 1
    })

    patterns.antiPatterns.forEach((antiPattern) => {
      const category = `Anti-${antiPattern.category}`
      categories[category] = (categories[category] || 0) + 1
    })

    return categories
  }

  /**
   * יצירת המלצות לדוח
   */
  private generateRecommendations(
    metrics: CalculatedMetrics,
    patterns?: PatternAnalysisResult,
    forecast?: ComprehensiveForecast
  ): ReportRecommendation[] {
    const recommendations: ReportRecommendation[] = []

    // המלצות על בסיס מטריקות
    if (metrics.qualityScore.overall < 80) {
      recommendations.push({
        id: "improve-code-quality",
        category: "Quality",
        priority: "high",
        title: this.config.language === "he" ? "שיפור איכות הקוד" : "Improve Code Quality",
        description:
          this.config.language === "he"
            ? "ציון איכות הקוד נמוך מהרצוי ונדרש שיפור"
            : "Code quality score is below desired level and needs improvement",
        actionItems: [
          {
            action: this.config.language === "he" ? "ביצוע רפקטורינג לקוד בעייתי" : "Refactor problematic code",
            responsible: "Development Team",
            status: "pending",
          },
          {
            action: this.config.language === "he" ? "הוספת בדיקות יחידה" : "Add unit tests",
            responsible: "QA Team",
            status: "pending",
          },
        ],
        expectedBenefit:
          this.config.language === "he" ? "שיפור תחזוקתיות והפחתת באגים" : "Improved maintainability and reduced bugs",
        effort: "Medium",
        timeline: "2-3 sprints",
        owner: "Tech Lead",
        successCriteria: [
          this.config.language === "he" ? "ציון איכות > 80" : "Quality score > 80",
          this.config.language === "he" ? "כיסוי בדיקות > 85%" : "Test coverage > 85%",
        ],
      })
    }

    // המלצות מחיזוי
    if (forecast) {
      forecast.recommendations.slice(0, 3).forEach((rec, index) => {
        recommendations.push({
          id: `forecast-${index}`,
          category: rec.category,
          priority: rec.priority,
          title: rec.action,
          description: rec.impact,
          actionItems: [
            {
              action: rec.action,
              responsible: "Team",
              status: "pending",
            },
          ],
          expectedBenefit: rec.impact,
          effort: rec.effort,
          timeline: rec.timeline,
          owner: "Project Manager",
          successCriteria: [`Success probability: ${rec.success_probability * 100}%`],
        })
      })
    }

    return recommendations
  }

  /**
   * יצירת נספחים
   */
  private generateAppendices(
    data: CollectedData,
    metrics: CalculatedMetrics,
    patterns?: PatternAnalysisResult,
    forecast?: ComprehensiveForecast
  ): Appendix[] {
    const appendices: Appendix[] = []

    // נספח נתונים טכניים
    appendices.push({
      title: this.config.language === "he" ? "נתונים טכניים מפורטים" : "Detailed Technical Data",
      content: JSON.stringify(metrics, null, 2),
      type: "code",
      data: metrics,
    })

    // נספח דפוסים
    if (patterns) {
      appendices.push({
        title: this.config.language === "he" ? "ניתוח דפוסים מפורט" : "Detailed Pattern Analysis",
        content: this.generatePatternsTable(patterns),
        type: "table",
        data: patterns,
      })
    }

    // נספח גלוסריום
    appendices.push({
      title: this.config.language === "he" ? "גלוסריום" : "Glossary",
      content: this.generateGlossary(),
      type: "text",
    })

    return appendices
  }

  /**
   * יצירת טבלת דפוסים
   */
  private generatePatternsTable(patterns: PatternAnalysisResult): string {
    let table =
      this.config.language === "he"
        ? "| דפוס | סוג | רמת חומרה | מיקום | המלצה |\n|------|------|-----------|--------|-------|\n"
        : "| Pattern | Type | Severity | Location | Recommendation |\n|---------|------|----------|----------|----------------|\n"

    patterns.antiPatterns.slice(0, 10).forEach((pattern) => {
      const location = pattern.locations.length > 0 ? pattern.locations[0].file : "N/A"
      table += `| ${pattern.name} | ${pattern.category} | ${pattern.severity} | ${location} | ${pattern.resolution.approach} |\n`
    })

    return table
  }

  /**
   * יצירת גלוסריום
   */
  private generateGlossary(): string {
    if (this.config.language === "he") {
      return `
**מונחים מרכזיים:**

- **ציון בריאות פרויקט**: ציון כללי המשקף את מצב הפרויקט (0-100)
- **איכות קוד**: מדד לאיכות הקוד המבוסס על סטנדרטים מקובלים
- **חוב טכני**: כמות העבודה הנדרשת לשיפור הקוד הקיים
- **Anti-Pattern**: דפוס קוד לא מומלץ שעלול לגרום לבעיות
- **Code Smell**: אינדיקציה לבעיה אפשרית בקוד
- **מטריקת ביצועים**: מדידות של ביצועי המערכת
      `
    } else {
      return `
**Key Terms:**

- **Project Health Score**: Overall score reflecting project state (0-100)
- **Code Quality**: Measure of code quality based on established standards
- **Technical Debt**: Amount of work needed to improve existing code
- **Anti-Pattern**: Unrecommended code pattern that may cause issues
- **Code Smell**: Indication of potential code problem
- **Performance Metric**: System performance measurements
      `
    }
  }

  /**
   * יצירת דוח בפורמט ספציפי
   */
  private async generateReportInFormat(reportData: ReportData, format: ReportFormat): Promise<GeneratedReport> {
    const fileName = `${reportData.metadata.id}.${format}`
    const filePath = path.join(this.config.outputDirectory, fileName)

    let content: string
    switch (format) {
      case "html":
        content = await this.generateHTMLReport(reportData)
        break
      case "markdown":
        content = this.generateMarkdownReport(reportData)
        break
      case "json":
        content = JSON.stringify(reportData, null, 2)
        break
      case "csv":
        content = this.generateCSVReport(reportData)
        break
      default:
        throw new Error(`Unsupported format: ${format}`)
    }

    // יצירת התיקייה אם לא קיימת
    await fs.mkdir(path.dirname(filePath), { recursive: true })

    // שמירת הקובץ
    await fs.writeFile(filePath, content, "utf8")

    const stats = await fs.stat(filePath)

    return {
      metadata: reportData.metadata,
      content,
      format,
      filePath,
      size: stats.size,
    }
  }

  /**
   * יצירת דוח HTML
   */
  private async generateHTMLReport(reportData: ReportData): Promise<string> {
    const themeColors = this.getThemeColors()

    return `
<!DOCTYPE html>
<html dir="${this.config.language === "he" ? "rtl" : "ltr"}" lang="${this.config.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.metadata.title}</title>
    <style>
        ${this.getHTMLStyles(themeColors)}
        ${this.config.branding.customCSS || ""}
    </style>
</head>
<body class="${this.config.theme}">
    <header>
        <div class="container">
            <h1>${reportData.metadata.title}</h1>
            <div class="report-info">
                <span>${this.config.language === "he" ? "נוצר ב" : "Generated on"}: ${reportData.metadata.generatedAt.toLocaleString()}</span>
                <span class="classification ${reportData.metadata.classification}">${reportData.metadata.classification}</span>
            </div>
        </div>
    </header>

    <main class="container">
        ${this.generateExecutiveSummaryHTML(reportData.summary)}
        ${this.generateMetricsHTML(reportData.metrics)}
        ${this.generateChartsHTML(reportData.charts)}
        ${this.generateRecommendationsHTML(reportData.recommendations)}
        ${reportData.patterns ? this.generatePatternsHTML(reportData.patterns) : ""}
        ${reportData.forecast ? this.generateForecastHTML(reportData.forecast) : ""}
    </main>

    <footer>
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${this.config.branding.organization}. ${this.config.language === "he" ? "כל הזכויות שמורות" : "All rights reserved"}.</p>
        </div>
    </footer>

    <script>
        ${this.getChartJavaScript()}
    </script>
</body>
</html>
    `
  }

  /**
   * יצירת דוח Markdown
   */
  private generateMarkdownReport(reportData: ReportData): string {
    const lang = this.config.language === "he"

    return `
# ${reportData.metadata.title}

**${lang ? "נוצר ב" : "Generated on"}:** ${reportData.metadata.generatedAt.toLocaleString()}
**${lang ? "תקופה" : "Period"}:** ${reportData.metadata.period.start.toLocaleDateString()} - ${reportData.metadata.period.end.toLocaleDateString()}

## ${lang ? "סיכום מנהלים" : "Executive Summary"}

### ${lang ? "בריאות כללית" : "Overall Health"}
- **${lang ? "ציון" : "Score"}:** ${reportData.summary.overallHealth.score}/100
- **${lang ? "מגמה" : "Trend"}:** ${reportData.summary.overallHealth.trend}
- **${lang ? "סטטוס" : "Status"}:** ${reportData.summary.overallHealth.status}

### ${lang ? "מטריקות מפתח" : "Key Metrics"}
${reportData.summary.keyMetrics.map((metric) => `- **${metric.name}:** ${metric.value}${metric.unit || ""} (${metric.status})`).join("\n")}

### ${lang ? "בעיות קריטיות" : "Critical Issues"}
${reportData.summary.criticalIssues
  .map(
    (issue) => `
#### ${issue.title} (${issue.severity})
${issue.description}
**${lang ? "המלצה" : "Recommendation"}:** ${issue.recommendation}
`
  )
  .join("\n")}

## ${lang ? "המלצות" : "Recommendations"}
${reportData.recommendations
  .map(
    (rec, index) => `
### ${index + 1}. ${rec.title}
- **${lang ? "עדיפות" : "Priority"}:** ${rec.priority}
- **${lang ? "קטגוריה" : "Category"}:** ${rec.category}
- **${lang ? "תיאור" : "Description"}:** ${rec.description}
- **${lang ? "מאמץ" : "Effort"}:** ${rec.effort}
- **${lang ? "לוח זמנים" : "Timeline"}:** ${rec.timeline}
`
  )
  .join("\n")}

---
*${lang ? "דוח זה נוצר אוטומטית על ידי מנוע האנליטיקה של Lions of Zion" : "This report was automatically generated by Lions of Zion Analytics Engine"}*
    `
  }

  /**
   * יצירת דוח CSV
   */
  private generateCSVReport(reportData: ReportData): string {
    const lang = this.config.language === "he"
    let csv = ""

    // כותרות
    csv += `${lang ? "מטריקה,ערך,יחידה,סטטוס" : "Metric,Value,Unit,Status"}\n`

    // מטריקות מפתח
    reportData.summary.keyMetrics.forEach((metric) => {
      csv += `"${metric.name}",${metric.value},"${metric.unit || ""}","${metric.status}"\n`
    })

    return csv
  }

  /**
   * קבלת צבעי ערכת נושא
   */
  private getThemeColors(): any {
    if (this.config.theme === "military") {
      return {
        primary: "#1F2937",
        secondary: "#374151",
        accent: "#D97706",
        background: "#111827",
        text: "#F9FAFB",
        success: "#059669",
        warning: "#D97706",
        danger: "#DC2626",
      }
    } else if (this.config.theme === "dark") {
      return {
        primary: "#3B82F6",
        secondary: "#6B7280",
        accent: "#F59E0B",
        background: "#1F2937",
        text: "#F9FAFB",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      }
    } else {
      return {
        primary: "#2563EB",
        secondary: "#64748B",
        accent: "#0EA5E9",
        background: "#FFFFFF",
        text: "#1F2937",
        success: "#059669",
        warning: "#D97706",
        danger: "#DC2626",
      }
    }
  }

  // HTML generation helper methods
  private getHTMLStyles(colors: any): string {
    return `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: ${colors.text};
            background-color: ${colors.background};
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: ${colors.primary}; color: white; padding: 2rem 0; }
        .report-info { margin-top: 1rem; }
        .classification { 
            padding: 0.25rem 0.5rem; 
            border-radius: 0.25rem; 
            background: ${colors.accent}; 
            color: white; 
            font-size: 0.875rem; 
        }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .metric-card { 
            background: ${colors.background === "#FFFFFF" ? "#F8FAFC" : "#374151"}; 
            padding: 1.5rem; 
            border-radius: 0.5rem; 
            border: 1px solid ${colors.secondary}; 
        }
        .chart-container { margin: 2rem 0; }
        footer { background: ${colors.secondary}; color: ${colors.text}; padding: 2rem 0; margin-top: 3rem; }
        h1, h2, h3 { margin-bottom: 1rem; }
        section { margin: 3rem 0; }
        .recommendation { 
            background: ${colors.background === "#FFFFFF" ? "#F0F9FF" : "#1E3A8A"}; 
            padding: 1.5rem; 
            border-radius: 0.5rem; 
            margin: 1rem 0; 
        }
        .critical-issue { 
            background: ${colors.danger}20; 
            border-left: 4px solid ${colors.danger}; 
            padding: 1rem; 
            margin: 0.5rem 0; 
        }
    `
  }

  private generateExecutiveSummaryHTML(summary: ExecutiveSummary): string {
    const lang = this.config.language === "he"
    return `
        <section>
            <h2>${lang ? "סיכום מנהלים" : "Executive Summary"}</h2>
            <div class="metric-grid">
                <div class="metric-card">
                    <h3>${lang ? "בריאות כללית" : "Overall Health"}</h3>
                    <div class="health-score ${summary.overallHealth.status}">
                        ${summary.overallHealth.score}/100
                    </div>
                    <p>${summary.overallHealth.description}</p>
                </div>
            </div>
            
            <h3>${lang ? "בעיות קריטיות" : "Critical Issues"}</h3>
            ${summary.criticalIssues
              .map(
                (issue) => `
                <div class="critical-issue">
                    <h4>${issue.title} <span class="severity-${issue.severity}">[${issue.severity}]</span></h4>
                    <p>${issue.description}</p>
                    <strong>${lang ? "המלצה" : "Recommendation"}:</strong> ${issue.recommendation}
                </div>
            `
              )
              .join("")}
        </section>
    `
  }

  private generateMetricsHTML(metrics: CalculatedMetrics): string {
    const lang = this.config.language === "he"
    return `
        <section>
            <h2>${lang ? "מטריקות מפורטות" : "Detailed Metrics"}</h2>
            <div class="metric-grid">
                <div class="metric-card">
                    <h3>${lang ? "איכות קוד" : "Code Quality"}</h3>
                    <div class="score">${metrics.qualityScore.overall}/100</div>
                </div>
                <div class="metric-card">
                    <h3>${lang ? "ביצועים" : "Performance"}</h3>
                    <div class="score">${metrics.performanceScore.overall}/100</div>
                </div>
                <div class="metric-card">
                    <h3>${lang ? "אבטחה" : "Security"}</h3>
                    <div class="score">${metrics.securityScore.overall}/100</div>
                </div>
                <div class="metric-card">
                    <h3>${lang ? "תחזוקתיות" : "Maintainability"}</h3>
                    <div class="score">${metrics.maintainabilityScore.overall}/100</div>
                </div>
            </div>
        </section>
    `
  }

  private generateChartsHTML(charts: ChartData[]): string {
    return charts
      .map(
        (chart) => `
        <div class="chart-container">
            <h3>${chart.title}</h3>
            <canvas id="${chart.id}" width="${chart.config.width}" height="${chart.config.height}"></canvas>
        </div>
    `
      )
      .join("")
  }

  private generateRecommendationsHTML(recommendations: ReportRecommendation[]): string {
    const lang = this.config.language === "he"
    return `
        <section>
            <h2>${lang ? "המלצות" : "Recommendations"}</h2>
            ${recommendations
              .map(
                (rec) => `
                <div class="recommendation priority-${rec.priority}">
                    <h3>${rec.title}</h3>
                    <p><strong>${lang ? "קטגוריה" : "Category"}:</strong> ${rec.category}</p>
                    <p><strong>${lang ? "עדיפות" : "Priority"}:</strong> ${rec.priority}</p>
                    <p>${rec.description}</p>
                    <p><strong>${lang ? "תועלת צפויה" : "Expected Benefit"}:</strong> ${rec.expectedBenefit}</p>
                    <p><strong>${lang ? "מאמץ" : "Effort"}:</strong> ${rec.effort}</p>
                </div>
            `
              )
              .join("")}
        </section>
    `
  }

  private generatePatternsHTML(patterns: PatternAnalysisResult): string {
    const lang = this.config.language === "he"
    return `
        <section>
            <h2>${lang ? "ניתוח דפוסים" : "Pattern Analysis"}</h2>
            <p>${lang ? "נמצאו" : "Found"} ${patterns.antiPatterns.length} anti-patterns ${lang ? "ו" : "and"} ${patterns.codeSmells.length} code smells</p>
        </section>
    `
  }

  private generateForecastHTML(forecast: ComprehensiveForecast): string {
    const lang = this.config.language === "he"
    return `
        <section>
            <h2>${lang ? "חיזוי מגמות" : "Trend Forecast"}</h2>
            <p>${lang ? "ציון בריאות נוכחי" : "Current health score"}: ${forecast.projectHealth.currentScore}/100</p>
            <p>${lang ? "התראות" : "Alerts"}: ${forecast.alerts.length}</p>
        </section>
    `
  }

  private getChartJavaScript(): string {
    return `
        // Chart.js integration would go here
        console.log('Charts would be rendered here with Chart.js');
    `
  }

  /**
   * שמירת metadata של הדוחות
   */
  private async saveReportMetadata(metadata: ReportMetadata, reports: GeneratedReport[]): Promise<void> {
    const metadataPath = path.join(this.config.outputDirectory, `${metadata.id}-metadata.json`)
    const metadataContent = {
      ...metadata,
      reports: reports.map((r) => ({
        format: r.format,
        filePath: r.filePath,
        size: r.size,
      })),
    }

    await fs.writeFile(metadataPath, JSON.stringify(metadataContent, null, 2), "utf8")
  }

  /**
   * מייצא דוח מהיר לבדיקה
   */
  public async generateQuickReport(metrics: CalculatedMetrics): Promise<string> {
    const lang = this.config.language === "he"

    return `
${lang ? "דוח מהיר - בריאות פרויקט" : "Quick Report - Project Health"}
${"=".repeat(50)}

${lang ? "ציון כללי" : "Overall Score"}: ${metrics.projectHealth.overallScore}/100
${lang ? "איכות קוד" : "Code Quality"}: ${metrics.qualityScore.overall}/100
${lang ? "ביצועים" : "Performance"}: ${metrics.performanceScore.overall}/100
${lang ? "אבטחה" : "Security"}: ${metrics.securityScore.overall}/100

${lang ? "מגמה" : "Trend"}: ${metrics.projectHealth.trend}

${lang ? "נוצר ב" : "Generated at"}: ${new Date().toLocaleString()}
    `
  }
}
