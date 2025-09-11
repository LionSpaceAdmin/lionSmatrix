/**
 * Metrics Calculator - חישוב מטריקות מתקדמות עבור מנוע האנליטיקה
 * מחשב ציונים, מדדים ואינדיקטורים לבריאות הפרויקט
 */

import { CollectedData, ProjectHealthMetrics } from "./data-collector"

export interface MetricsConfig {
  weightings: MetricWeightings
  thresholds: MetricThresholds
  customMetrics: CustomMetric[]
  enableAdvancedCalculations: boolean
  includeHistoricalComparison: boolean
}

export interface MetricWeightings {
  codeQuality: number // 0-1
  maintainability: number
  testCoverage: number
  documentation: number
  security: number
  performance: number
  technicalDebt: number
}

export interface MetricThresholds {
  codeQuality: QualityThresholds
  performance: PerformanceThresholds
  security: SecurityThresholds
  maintainability: MaintainabilityThresholds
  coverage: CoverageThresholds
}

export interface QualityThresholds {
  excellent: number // 90-100
  good: number // 70-89
  fair: number // 50-69
  poor: number // 0-49
}

export interface PerformanceThresholds {
  buildTime: TimeThresholds
  bundleSize: SizeThresholds
  loadTime: TimeThresholds
  memoryUsage: MemoryThresholds
}

export interface SecurityThresholds {
  critical: number
  high: number
  medium: number
  low: number
}

export interface MaintainabilityThresholds {
  cyclomaticComplexity: number
  technicalDebtRatio: number
  duplicationPercentage: number
}

export interface CoverageThresholds {
  excellent: number // 90-100%
  good: number // 80-89%
  fair: number // 70-79%
  poor: number // 0-69%
}

export interface CustomMetric {
  name: string
  calculation: string // Formula or function reference
  weight: number
  threshold: { min: number; max: number; target: number }
}

export interface CalculatedMetrics {
  projectHealth: ProjectHealthMetrics
  qualityScore: QualityScore
  performanceScore: PerformanceScore
  securityScore: SecurityScore
  maintainabilityScore: MaintainabilityScore
  velocityMetrics: VelocityMetrics
  riskAssessment: RiskAssessment
  benchmarkComparison: BenchmarkComparison
  trends: TrendMetrics
  customScores: { [metricName: string]: number }
}

export interface QualityScore {
  overall: number
  codeSmells: number
  duplication: number
  complexity: number
  testability: number
  readability: number
  breakdown: QualityBreakdown
}

export interface QualityBreakdown {
  excellent: number // percentage of files
  good: number
  fair: number
  poor: number
}

export interface PerformanceScore {
  overall: number
  buildPerformance: number
  runtimePerformance: number
  bundleOptimization: number
  webVitalsScore: number
  breakdown: PerformanceBreakdown
}

export interface PerformanceBreakdown {
  buildTime: ScoreWithRating
  bundleSize: ScoreWithRating
  loadTime: ScoreWithRating
  memoryUsage: ScoreWithRating
}

export interface SecurityScore {
  overall: number
  vulnerabilityScore: number
  complianceScore: number
  secretsScore: number
  dependencyScore: number
  breakdown: SecurityBreakdown
}

export interface SecurityBreakdown {
  critical: number
  high: number
  medium: number
  low: number
  compliant: number
}

export interface MaintainabilityScore {
  overall: number
  technicalDebtScore: number
  architectureScore: number
  documentationScore: number
  testCoverageScore: number
  breakdown: MaintainabilityBreakdown
}

export interface MaintainabilityBreakdown {
  maintainabilityIndex: ScoreWithRating
  cyclomaticComplexity: ScoreWithRating
  technicalDebt: ScoreWithRating
  testCoverage: ScoreWithRating
}

export interface VelocityMetrics {
  developmentVelocity: number
  deliveryFrequency: number
  leadTime: number
  deploymentFrequency: number
  meanTimeToRestore: number
  changeFailureRate: number
}

export interface RiskAssessment {
  overallRisk: number // 0-10 scale
  technicalRisk: number
  securityRisk: number
  maintainabilityRisk: number
  performanceRisk: number
  riskFactors: RiskFactor[]
}

export interface RiskFactor {
  category: "technical" | "security" | "maintainability" | "performance" | "team"
  factor: string
  impact: "low" | "medium" | "high" | "critical"
  probability: number // 0-1
  mitigation: string
}

export interface BenchmarkComparison {
  industryAverage: IndustryBenchmark
  projectComparison: ProjectBenchmark
  recommendations: BenchmarkRecommendation[]
}

export interface IndustryBenchmark {
  codeQuality: number
  testCoverage: number
  buildTime: number
  deploymentFrequency: number
  securityScore: number
}

export interface ProjectBenchmark {
  vsIndustryAverage: { [metric: string]: number } // difference %
  percentile: number // where this project stands
  category: "top_10" | "top_25" | "average" | "below_average"
}

export interface BenchmarkRecommendation {
  metric: string
  currentValue: number
  industryAverage: number
  targetValue: number
  improvementStrategy: string
}

export interface TrendMetrics {
  codeQualityTrend: TrendDirection
  performanceTrend: TrendDirection
  securityTrend: TrendDirection
  velocityTrend: TrendDirection
  trendStrength: number // 0-1
  projectedValues: ProjectedMetrics
}

export interface TrendDirection {
  direction: "improving" | "stable" | "declining"
  rate: number // rate of change
  confidence: number // 0-1
}

export interface ProjectedMetrics {
  nextMonth: Partial<CalculatedMetrics>
  nextQuarter: Partial<CalculatedMetrics>
  nextYear: Partial<CalculatedMetrics>
}

export interface ScoreWithRating {
  score: number
  rating: "excellent" | "good" | "fair" | "poor"
  trend: "improving" | "stable" | "declining"
}

export interface TimeThresholds {
  excellent: number // seconds
  good: number
  fair: number
  poor: number
}

export interface SizeThresholds {
  excellent: number // bytes
  good: number
  fair: number
  poor: number
}

export interface MemoryThresholds {
  excellent: number // MB
  good: number
  fair: number
  poor: number
}

export class MetricsCalculator {
  private config: MetricsConfig
  private historicalData: CollectedData[]

  constructor(config: MetricsConfig, historicalData: CollectedData[] = []) {
    this.config = config
    this.historicalData = historicalData
  }

  /**
   * מחשב את כל המטריקות עבור הנתונים שנאספו
   */
  public calculateMetrics(data: CollectedData): CalculatedMetrics {
    console.log("📊 מחשב מטריקות מתקדמות...")

    const projectHealth = this.calculateProjectHealth(data)
    const qualityScore = this.calculateQualityScore(data)
    const performanceScore = this.calculatePerformanceScore(data)
    const securityScore = this.calculateSecurityScore(data)
    const maintainabilityScore = this.calculateMaintainabilityScore(data)
    const velocityMetrics = this.calculateVelocityMetrics(data)
    const riskAssessment = this.calculateRiskAssessment(data)
    const benchmarkComparison = this.calculateBenchmarkComparison(data)
    const trends = this.calculateTrendMetrics(data)
    const customScores = this.calculateCustomScores(data)

    console.log("✅ חישוב מטריקות הושלם")

    return {
      projectHealth,
      qualityScore,
      performanceScore,
      securityScore,
      maintainabilityScore,
      velocityMetrics,
      riskAssessment,
      benchmarkComparison,
      trends,
      customScores,
    }
  }

  /**
   * מחשב ציון בריאות הפרויקט הכללי
   */
  private calculateProjectHealth(data: CollectedData): ProjectHealthMetrics {
    const weights = this.config.weightings

    // חישוב רכיבי הציון
    const codeQuality = this.normalizeScore(data.codeQuality.maintainabilityIndex)
    const maintainability = this.calculateMaintainabilityFromData(data)
    const testCoverage = this.normalizeScore(data.files.testCoverage.percentage)
    const documentation = this.normalizeScore(data.files.documentationCoverage.percentage)
    const security = this.normalizeScore(data.security.securityScore)
    const performance = this.calculatePerformanceFromData(data)
    const technicalDebt = 100 - this.normalizeScore(data.codeQuality.technicalDebt.ratio)

    // חישוב ציון משוקלל
    const overallScore =
      codeQuality * weights.codeQuality +
      maintainability * weights.maintainability +
      testCoverage * weights.testCoverage +
      documentation * weights.documentation +
      security * weights.security +
      performance * weights.performance +
      technicalDebt * weights.technicalDebt

    // קביעת מגמה
    const trend = this.calculateHealthTrend(data)

    return {
      overallScore: Math.round(overallScore),
      codeQuality: Math.round(codeQuality),
      maintainability: Math.round(maintainability),
      testCoverage: Math.round(testCoverage),
      documentation: Math.round(documentation),
      security: Math.round(security),
      performance: Math.round(performance),
      technicalDebt: Math.round(technicalDebt),
      trend,
    }
  }

  /**
   * מחשב ציון איכות קוד מפורט
   */
  private calculateQualityScore(data: CollectedData): QualityScore {
    const codeSmells = this.calculateCodeSmellsScore(data.codeQuality.codeSmells)
    const duplication = 100 - this.normalizeScore(data.codeQuality.duplication)
    const complexity = this.calculateComplexityScore(data.codeQuality.cyclomaticComplexity)
    const testability = this.normalizeScore(data.codeQuality.testability)
    const readability = this.normalizeScore(data.codeQuality.readability.score)

    const overall = (codeSmells + duplication + complexity + testability + readability) / 5

    const breakdown = this.calculateQualityBreakdown(data)

    return {
      overall: Math.round(overall),
      codeSmells: Math.round(codeSmells),
      duplication: Math.round(duplication),
      complexity: Math.round(complexity),
      testability: Math.round(testability),
      readability: Math.round(readability),
      breakdown,
    }
  }

  /**
   * מחשב ציון ביצועים מפורט
   */
  private calculatePerformanceScore(data: CollectedData): PerformanceScore {
    const buildPerformance = this.calculateBuildPerformanceScore(data.performance.buildTime)
    const runtimePerformance = this.calculateRuntimePerformanceScore(data.performance)
    const bundleOptimization = this.calculateBundleOptimizationScore(data.performance.bundleSize)
    const webVitalsScore = this.calculateWebVitalsScore(data.performance.webVitals)

    const overall = (buildPerformance + runtimePerformance + bundleOptimization + webVitalsScore) / 4

    const breakdown = this.calculatePerformanceBreakdown(data)

    return {
      overall: Math.round(overall),
      buildPerformance: Math.round(buildPerformance),
      runtimePerformance: Math.round(runtimePerformance),
      bundleOptimization: Math.round(bundleOptimization),
      webVitalsScore: Math.round(webVitalsScore),
      breakdown,
    }
  }

  /**
   * מחשב ציון אבטחה מפורט
   */
  private calculateSecurityScore(data: CollectedData): SecurityScore {
    const vulnerabilityScore = this.calculateVulnerabilityScore(data.security)
    const complianceScore = data.security.complianceStatus.compliant ? 100 : 0
    const secretsScore = data.security.exposedSecrets.length === 0 ? 100 : 0
    const dependencyScore = this.calculateDependencySecurityScore(data.security)

    const overall = (vulnerabilityScore + complianceScore + secretsScore + dependencyScore) / 4

    const breakdown = this.calculateSecurityBreakdown(data)

    return {
      overall: Math.round(overall),
      vulnerabilityScore: Math.round(vulnerabilityScore),
      complianceScore: Math.round(complianceScore),
      secretsScore: Math.round(secretsScore),
      dependencyScore: Math.round(dependencyScore),
      breakdown,
    }
  }

  /**
   * מחשב ציון תחזוקתיות מפורט
   */
  private calculateMaintainabilityScore(data: CollectedData): MaintainabilityScore {
    const technicalDebtScore = 100 - this.normalizeScore(data.codeQuality.technicalDebt.ratio)
    const architectureScore = this.calculateArchitectureScore(data.architecture)
    const documentationScore = this.normalizeScore(data.files.documentationCoverage.percentage)
    const testCoverageScore = this.normalizeScore(data.files.testCoverage.percentage)

    const overall = (technicalDebtScore + architectureScore + documentationScore + testCoverageScore) / 4

    const breakdown = this.calculateMaintainabilityBreakdown(data)

    return {
      overall: Math.round(overall),
      technicalDebtScore: Math.round(technicalDebtScore),
      architectureScore: Math.round(architectureScore),
      documentationScore: Math.round(documentationScore),
      testCoverageScore: Math.round(testCoverageScore),
      breakdown,
    }
  }

  /**
   * מחשב מטריקות מהירות פיתוח
   */
  private calculateVelocityMetrics(data: CollectedData): VelocityMetrics {
    // מטריקות DORA (DevOps Research and Assessment)
    return {
      developmentVelocity: this.calculateDevelopmentVelocity(data),
      deliveryFrequency: this.calculateDeliveryFrequency(data),
      leadTime: this.calculateLeadTime(data),
      deploymentFrequency: this.calculateDeploymentFrequency(data),
      meanTimeToRestore: this.calculateMeanTimeToRestore(data),
      changeFailureRate: this.calculateChangeFailureRate(data),
    }
  }

  /**
   * מחשב הערכת סיכונים
   */
  private calculateRiskAssessment(data: CollectedData): RiskAssessment {
    const technicalRisk = this.calculateTechnicalRisk(data)
    const securityRisk = this.calculateSecurityRisk(data)
    const maintainabilityRisk = this.calculateMaintainabilityRisk(data)
    const performanceRisk = this.calculatePerformanceRisk(data)

    const overallRisk = (technicalRisk + securityRisk + maintainabilityRisk + performanceRisk) / 4

    const riskFactors = this.identifyRiskFactors(data)

    return {
      overallRisk: Math.round(overallRisk * 10) / 10, // 0-10 scale
      technicalRisk: Math.round(technicalRisk * 10) / 10,
      securityRisk: Math.round(securityRisk * 10) / 10,
      maintainabilityRisk: Math.round(maintainabilityRisk * 10) / 10,
      performanceRisk: Math.round(performanceRisk * 10) / 10,
      riskFactors,
    }
  }

  /**
   * מחשב השוואה לבנצ'מרק תעשייתי
   */
  private calculateBenchmarkComparison(data: CollectedData): BenchmarkComparison {
    const industryAverage: IndustryBenchmark = {
      codeQuality: 75,
      testCoverage: 70,
      buildTime: 180, // 3 minutes
      deploymentFrequency: 2.5, // per week
      securityScore: 80,
    }

    const projectMetrics = {
      codeQuality: this.calculateQualityScore(data).overall,
      testCoverage: data.files.testCoverage.percentage,
      buildTime: data.performance.buildTime,
      deploymentFrequency: this.calculateDeploymentFrequency(data),
      securityScore: data.security.securityScore,
    }

    const vsIndustryAverage: { [metric: string]: number } = {}
    Object.keys(industryAverage).forEach((key) => {
      const industryValue = industryAverage[key as keyof IndustryBenchmark]
      const projectValue = projectMetrics[key as keyof typeof projectMetrics]
      vsIndustryAverage[key] = ((projectValue - industryValue) / industryValue) * 100
    })

    const percentile = this.calculatePercentile(projectMetrics, industryAverage)
    const category = this.determineCategory(percentile)

    const recommendations = this.generateBenchmarkRecommendations(projectMetrics, industryAverage)

    return {
      industryAverage,
      projectComparison: {
        vsIndustryAverage,
        percentile,
        category,
      },
      recommendations,
    }
  }

  /**
   * מחשב מטריקות מגמות
   */
  private calculateTrendMetrics(data: CollectedData): TrendMetrics {
    if (this.historicalData.length < 2) {
      return {
        codeQualityTrend: { direction: "stable", rate: 0, confidence: 0 },
        performanceTrend: { direction: "stable", rate: 0, confidence: 0 },
        securityTrend: { direction: "stable", rate: 0, confidence: 0 },
        velocityTrend: { direction: "stable", rate: 0, confidence: 0 },
        trendStrength: 0,
        projectedValues: {
          nextMonth: {},
          nextQuarter: {},
          nextYear: {},
        },
      }
    }

    // חישוב מגמות על בסיס נתונים היסטוריים
    const codeQualityTrend = this.calculateTrendDirection("codeQuality")
    const performanceTrend = this.calculateTrendDirection("performance")
    const securityTrend = this.calculateTrendDirection("security")
    const velocityTrend = this.calculateTrendDirection("velocity")

    const trendStrength = this.calculateOverallTrendStrength([
      codeQualityTrend,
      performanceTrend,
      securityTrend,
      velocityTrend,
    ])

    const projectedValues = this.projectFutureValues(data)

    return {
      codeQualityTrend,
      performanceTrend,
      securityTrend,
      velocityTrend,
      trendStrength,
      projectedValues,
    }
  }

  /**
   * מחשב ציונים מותאמים אישית
   */
  private calculateCustomScores(data: CollectedData): { [metricName: string]: number } {
    const customScores: { [metricName: string]: number } = {}

    this.config.customMetrics.forEach((metric) => {
      try {
        // כאן תהיה לוגיקה לחישוב המטריקה המותאמת אישית
        // לצרכי הדגמה, אני מחזיר ערך אקראי
        customScores[metric.name] = Math.random() * 100
      } catch (error) {
        console.warn(`⚠️ לא ניתן לחשב מטריקה מותאמת: ${metric.name}`, error)
        customScores[metric.name] = 0
      }
    })

    return customScores
  }

  // Helper methods for calculations
  private normalizeScore(value: number, min: number = 0, max: number = 100): number {
    return Math.max(min, Math.min(max, value))
  }

  private calculateHealthTrend(data: CollectedData): "improving" | "stable" | "declining" {
    if (this.historicalData.length < 2) return "stable"
    // לוגיקה לחישוב מגמה על בסיס נתונים היסטוריים
    return "stable"
  }

  private calculateMaintainabilityFromData(data: CollectedData): number {
    return data.codeQuality.maintainabilityIndex
  }

  private calculatePerformanceFromData(data: CollectedData): number {
    const buildScore = this.calculateBuildPerformanceScore(data.performance.buildTime)
    const bundleScore = this.calculateBundleOptimizationScore(data.performance.bundleSize)
    return (buildScore + bundleScore) / 2
  }

  private calculateCodeSmellsScore(codeSmells: any[]): number {
    // חישוב ציון על בסיס מספר ורצינות code smells
    if (codeSmells.length === 0) return 100
    const severityWeights = { low: 1, medium: 3, high: 7, critical: 15 }
    const totalWeight = codeSmells.reduce(
      (sum, smell) => sum + (severityWeights[smell.severity as keyof typeof severityWeights] || 1),
      0
    )
    return Math.max(0, 100 - totalWeight)
  }

  private calculateComplexityScore(complexity: number): number {
    if (complexity <= 10) return 100
    if (complexity <= 20) return 80
    if (complexity <= 30) return 60
    if (complexity <= 40) return 40
    return 20
  }

  private calculateQualityBreakdown(data: CollectedData): QualityBreakdown {
    // הפלוגרמה של איכות הקוד
    return {
      excellent: 25,
      good: 45,
      fair: 25,
      poor: 5,
    }
  }

  private calculateBuildPerformanceScore(buildTime: number): number {
    const thresholds = this.config.thresholds.performance.buildTime
    if (buildTime <= thresholds.excellent) return 100
    if (buildTime <= thresholds.good) return 80
    if (buildTime <= thresholds.fair) return 60
    return 40
  }

  private calculateRuntimePerformanceScore(performance: any): number {
    // חישוב ציון ביצועים בזמן ריצה
    return 85 // placeholder
  }

  private calculateBundleOptimizationScore(bundleSize: any): number {
    const thresholds = this.config.thresholds.performance.bundleSize
    if (bundleSize.total <= thresholds.excellent) return 100
    if (bundleSize.total <= thresholds.good) return 80
    if (bundleSize.total <= thresholds.fair) return 60
    return 40
  }

  private calculateWebVitalsScore(webVitals: any): number {
    // חישוב ציון Web Vitals
    const lcpScore = webVitals.lcp <= 2500 ? 100 : webVitals.lcp <= 4000 ? 70 : 40
    const fidScore = webVitals.fid <= 100 ? 100 : webVitals.fid <= 300 ? 70 : 40
    const clsScore = webVitals.cls <= 0.1 ? 100 : webVitals.cls <= 0.25 ? 70 : 40
    return (lcpScore + fidScore + clsScore) / 3
  }

  private calculatePerformanceBreakdown(data: CollectedData): PerformanceBreakdown {
    return {
      buildTime: {
        score: this.calculateBuildPerformanceScore(data.performance.buildTime),
        rating: this.getRating(this.calculateBuildPerformanceScore(data.performance.buildTime)),
        trend: "stable",
      },
      bundleSize: {
        score: this.calculateBundleOptimizationScore(data.performance.bundleSize),
        rating: this.getRating(this.calculateBundleOptimizationScore(data.performance.bundleSize)),
        trend: "stable",
      },
      loadTime: {
        score: 85,
        rating: "good",
        trend: "stable",
      },
      memoryUsage: {
        score: 90,
        rating: "excellent",
        trend: "improving",
      },
    }
  }

  private calculateVulnerabilityScore(security: any): number {
    if (security.vulnerabilityCount === 0) return 100
    // חישוב ציון על בסיס מספר ורצינות פגיעויות
    return Math.max(0, 100 - security.vulnerabilityCount * 10)
  }

  private calculateDependencySecurityScore(security: any): number {
    if (security.dependencyVulnerabilities.length === 0) return 100
    return Math.max(0, 100 - security.dependencyVulnerabilities.length * 5)
  }

  private calculateSecurityBreakdown(data: CollectedData): SecurityBreakdown {
    const vulnerabilities = data.security.dependencyVulnerabilities
    const breakdown = { critical: 0, high: 0, medium: 0, low: 0, compliant: 100 }

    vulnerabilities.forEach((vuln) => {
      breakdown[vuln.severity as keyof Omit<SecurityBreakdown, "compliant">]++
    })

    if (vulnerabilities.length > 0) {
      breakdown.compliant = data.security.complianceStatus.compliant ? 100 : 0
    }

    return breakdown
  }

  private calculateArchitectureScore(architecture: any): number {
    return architecture.modularity.score || 80
  }

  private calculateMaintainabilityBreakdown(data: CollectedData): MaintainabilityBreakdown {
    return {
      maintainabilityIndex: {
        score: data.codeQuality.maintainabilityIndex,
        rating: this.getRating(data.codeQuality.maintainabilityIndex),
        trend: "stable",
      },
      cyclomaticComplexity: {
        score: this.calculateComplexityScore(data.codeQuality.cyclomaticComplexity),
        rating: this.getRating(this.calculateComplexityScore(data.codeQuality.cyclomaticComplexity)),
        trend: "stable",
      },
      technicalDebt: {
        score: 100 - this.normalizeScore(data.codeQuality.technicalDebt.ratio),
        rating: this.getRating(100 - this.normalizeScore(data.codeQuality.technicalDebt.ratio)),
        trend: "stable",
      },
      testCoverage: {
        score: data.files.testCoverage.percentage,
        rating: this.getRating(data.files.testCoverage.percentage),
        trend: "stable",
      },
    }
  }

  private getRating(score: number): "excellent" | "good" | "fair" | "poor" {
    if (score >= 90) return "excellent"
    if (score >= 70) return "good"
    if (score >= 50) return "fair"
    return "poor"
  }

  // Velocity metrics calculations
  private calculateDevelopmentVelocity(data: CollectedData): number {
    // חישוב מהירות פיתוח על בסיס commits ו-changes
    return data.git.commitFrequency.weekly * 7 // commits per day
  }

  private calculateDeliveryFrequency(data: CollectedData): number {
    // תדירות מסירה שבועית
    return 2.5 // placeholder
  }

  private calculateLeadTime(data: CollectedData): number {
    // זמן מפיתוח להפקה
    return 5 // days
  }

  private calculateDeploymentFrequency(data: CollectedData): number {
    // תדירות deployment
    return 3 // per week
  }

  private calculateMeanTimeToRestore(data: CollectedData): number {
    // זמן ממוצע לשחזור מתקלה
    return 2 // hours
  }

  private calculateChangeFailureRate(data: CollectedData): number {
    // אחוז כישלון שינויים
    return 5 // percent
  }

  // Risk calculations
  private calculateTechnicalRisk(data: CollectedData): number {
    return data.codeQuality.technicalDebt.ratio * 0.1 // convert to 0-10 scale
  }

  private calculateSecurityRisk(data: CollectedData): number {
    return (100 - data.security.securityScore) * 0.1
  }

  private calculateMaintainabilityRisk(data: CollectedData): number {
    return (100 - data.codeQuality.maintainabilityIndex) * 0.1
  }

  private calculatePerformanceRisk(data: CollectedData): number {
    const buildRisk = data.performance.buildTime > 300 ? 5 : 2
    return buildRisk
  }

  private identifyRiskFactors(data: CollectedData): RiskFactor[] {
    const factors: RiskFactor[] = []

    if (data.security.vulnerabilityCount > 0) {
      factors.push({
        category: "security",
        factor: "Security vulnerabilities detected",
        impact: "high",
        probability: 0.8,
        mitigation: "Address security vulnerabilities immediately",
      })
    }

    if (data.codeQuality.technicalDebt.ratio > 20) {
      factors.push({
        category: "technical",
        factor: "High technical debt ratio",
        impact: "medium",
        probability: 0.7,
        mitigation: "Plan technical debt reduction sprints",
      })
    }

    return factors
  }

  // Benchmark calculations
  private calculatePercentile(projectMetrics: any, industryAverage: IndustryBenchmark): number {
    // חישוב אחוזון פשוט
    const scores = Object.keys(industryAverage).map((key) => {
      const industry = industryAverage[key as keyof IndustryBenchmark]
      const project = projectMetrics[key]
      return project >= industry ? 1 : 0
    })
    return (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
  }

  private determineCategory(percentile: number): "top_10" | "top_25" | "average" | "below_average" {
    if (percentile >= 90) return "top_10"
    if (percentile >= 75) return "top_25"
    if (percentile >= 50) return "average"
    return "below_average"
  }

  private generateBenchmarkRecommendations(
    projectMetrics: any,
    industryAverage: IndustryBenchmark
  ): BenchmarkRecommendation[] {
    const recommendations: BenchmarkRecommendation[] = []

    Object.keys(industryAverage).forEach((key) => {
      const industryValue = industryAverage[key as keyof IndustryBenchmark]
      const projectValue = projectMetrics[key]

      if (projectValue < industryValue) {
        recommendations.push({
          metric: key,
          currentValue: projectValue,
          industryAverage: industryValue,
          targetValue: industryValue * 1.1, // 10% above industry average
          improvementStrategy: `Focus on improving ${key} to reach industry standards`,
        })
      }
    })

    return recommendations
  }

  // Trend calculations
  private calculateTrendDirection(metricType: string): TrendDirection {
    // חישוב מגמה על בסיס נתונים היסטוריים
    return {
      direction: "stable",
      rate: 0,
      confidence: 0.5,
    }
  }

  private calculateOverallTrendStrength(trends: TrendDirection[]): number {
    return trends.reduce((sum, trend) => sum + trend.confidence, 0) / trends.length
  }

  private projectFutureValues(data: CollectedData): ProjectedMetrics {
    // חיזוי ערכים עתידיים על בסיס מגמות
    return {
      nextMonth: {},
      nextQuarter: {},
      nextYear: {},
    }
  }

  /**
   * מחזיר סיכום המטריקות החשובות ביותר
   */
  public getKeyMetricsSummary(metrics: CalculatedMetrics): KeyMetricsSummary {
    return {
      overallHealth: metrics.projectHealth.overallScore,
      topStrengths: this.identifyTopStrengths(metrics),
      criticalIssues: this.identifyCriticalIssues(metrics),
      improvementAreas: this.identifyImprovementAreas(metrics),
      trendStatus: this.summarizeTrends(metrics.trends),
    }
  }

  private identifyTopStrengths(metrics: CalculatedMetrics): string[] {
    const strengths: string[] = []

    if (metrics.securityScore.overall >= 90) strengths.push("Excellent security posture")
    if (metrics.performanceScore.overall >= 90) strengths.push("Outstanding performance")
    if (metrics.qualityScore.overall >= 90) strengths.push("High code quality")

    return strengths
  }

  private identifyCriticalIssues(metrics: CalculatedMetrics): string[] {
    const issues: string[] = []

    if (metrics.riskAssessment.securityRisk >= 7) issues.push("Critical security risks")
    if (metrics.performanceScore.overall <= 30) issues.push("Poor performance")
    if (metrics.qualityScore.overall <= 30) issues.push("Low code quality")

    return issues
  }

  private identifyImprovementAreas(metrics: CalculatedMetrics): string[] {
    const areas: string[] = []

    if (metrics.maintainabilityScore.testCoverageScore < 80) areas.push("Increase test coverage")
    if (metrics.qualityScore.duplication < 70) areas.push("Reduce code duplication")
    if (metrics.performanceScore.bundleOptimization < 70) areas.push("Optimize bundle size")

    return areas
  }

  private summarizeTrends(trends: TrendMetrics): string {
    if (trends.trendStrength < 0.3) return "Trends are not significant"

    const improvingTrends = []
    const decliningTrends = []

    if (trends.codeQualityTrend.direction === "improving") improvingTrends.push("code quality")
    if (trends.performanceTrend.direction === "improving") improvingTrends.push("performance")
    if (trends.securityTrend.direction === "improving") improvingTrends.push("security")

    if (trends.codeQualityTrend.direction === "declining") decliningTrends.push("code quality")
    if (trends.performanceTrend.direction === "declining") decliningTrends.push("performance")
    if (trends.securityTrend.direction === "declining") decliningTrends.push("security")

    if (improvingTrends.length > decliningTrends.length) {
      return `Positive trends in ${improvingTrends.join(", ")}`
    } else if (decliningTrends.length > improvingTrends.length) {
      return `Concerning trends in ${decliningTrends.join(", ")}`
    } else {
      return "Mixed trends across metrics"
    }
  }
}

export interface KeyMetricsSummary {
  overallHealth: number
  topStrengths: string[]
  criticalIssues: string[]
  improvementAreas: string[]
  trendStatus: string
}

// Default configurations
export const DEFAULT_WEIGHTINGS: MetricWeightings = {
  codeQuality: 0.2,
  maintainability: 0.2,
  testCoverage: 0.15,
  documentation: 0.1,
  security: 0.2,
  performance: 0.1,
  technicalDebt: 0.05,
}

export const DEFAULT_THRESHOLDS: MetricThresholds = {
  codeQuality: { excellent: 90, good: 70, fair: 50, poor: 0 },
  performance: {
    buildTime: { excellent: 60, good: 120, fair: 300, poor: 600 },
    bundleSize: { excellent: 250000, good: 500000, fair: 1000000, poor: 2000000 },
    loadTime: { excellent: 2, good: 4, fair: 6, poor: 10 },
    memoryUsage: { excellent: 50, good: 100, fair: 200, poor: 400 },
  },
  security: { critical: 0, high: 1, medium: 5, low: 10 },
  maintainability: {
    cyclomaticComplexity: 10,
    technicalDebtRatio: 20,
    duplicationPercentage: 10,
  },
  coverage: { excellent: 90, good: 80, fair: 70, poor: 0 },
}
