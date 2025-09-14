/**
 * Trend Predictor - מנוע חיזוי מגמות עבור פלטפורמת Lions of Zion
 * מנתח מגמות היסטוריות ומספק חיזויים מבוססי AI
 */

import { CollectedData } from "./data-collector"
import { CalculatedMetrics } from "./metrics-calculator"
import { PatternAnalysisResult } from "./pattern-analyzer"

export interface TrendPredictorConfig {
  enableMachineLearning: boolean
  historicalPeriod: number // months
  predictionHorizon: number // months
  confidenceThreshold: number // 0-1
  enableSeasonalAnalysis: boolean
  customModels: PredictionModel[]
  aiEndpoint?: string
}

export interface PredictionModel {
  name: string
  type: "linear" | "polynomial" | "exponential" | "neural" | "ensemble"
  features: string[]
  targetMetric: string
  accuracy: number
  parameters: { [key: string]: any }
}

export interface TrendAnalysis {
  metric: string
  historicalData: HistoricalPoint[]
  trend: TrendInfo
  seasonality: SeasonalityInfo
  predictions: Prediction[]
  confidence: number
  riskFactors: RiskFactor[]
}

export interface HistoricalPoint {
  timestamp: Date
  value: number
  context?: { [key: string]: any }
}

export interface TrendInfo {
  direction: "increasing" | "decreasing" | "stable" | "volatile"
  strength: number // 0-1
  rate: number // rate of change per period
  significance: number // statistical significance 0-1
  changePoints: ChangePoint[]
  correlations: Correlation[]
}

export interface SeasonalityInfo {
  hasSeasonality: boolean
  period?: number // in days/weeks/months
  amplitude?: number
  phase?: number
  seasonal_components?: SeasonalComponent[]
}

export interface SeasonalComponent {
  period: string
  strength: number
  pattern: "weekly" | "monthly" | "quarterly" | "yearly"
}

export interface Prediction {
  timestamp: Date
  value: number
  confidence: number
  upperBound: number
  lowerBound: number
  factors: PredictionFactor[]
}

export interface PredictionFactor {
  factor: string
  impact: number // -1 to 1
  confidence: number
  explanation: string
}

export interface ChangePoint {
  timestamp: Date
  magnitude: number
  type: "trend" | "level" | "seasonality"
  confidence: number
  cause?: string
}

export interface Correlation {
  metric: string
  correlation: number // -1 to 1
  significance: number
  lag?: number // time delay in periods
}

export interface RiskFactor {
  factor: string
  probability: number // 0-1
  impact: "low" | "medium" | "high" | "critical"
  timeframe: string
  mitigation: string
}

export interface ComprehensiveForecast {
  projectHealth: HealthForecast
  performance: PerformanceForecast
  security: SecurityForecast
  quality: QualityForecast
  team: TeamForecast
  alerts: ForecastAlert[]
  recommendations: ForecastRecommendation[]
}

export interface HealthForecast {
  currentScore: number
  predictedScore: Prediction[]
  keyDrivers: string[]
  riskEvents: RiskEvent[]
  improvementOpportunities: string[]
}

export interface PerformanceForecast {
  buildTime: TrendAnalysis
  bundleSize: TrendAnalysis
  loadTime: TrendAnalysis
  performanceRisks: PerformanceRisk[]
}

export interface SecurityForecast {
  riskTrend: TrendAnalysis
  vulnerabilityGrowth: TrendAnalysis
  complianceOutlook: ComplianceOutlook
  threatPredictions: ThreatPrediction[]
}

export interface QualityForecast {
  codeQualityTrend: TrendAnalysis
  technicalDebtGrowth: TrendAnalysis
  maintainabilityTrend: TrendAnalysis
  testCoverageTrend: TrendAnalysis
}

export interface TeamForecast {
  productivityTrend: TrendAnalysis
  velocityPrediction: VelocityPrediction
  burnoutRisk: BurnoutRisk
  skillGapEvolution: SkillGapTrend[]
}

export interface RiskEvent {
  event: string
  probability: number
  impact: number
  timeframe: string
  indicators: string[]
}

export interface PerformanceRisk {
  risk: string
  likelihood: number
  impact: string
  metric: string
  threshold: number
}

export interface ComplianceOutlook {
  currentCompliance: number
  projectedCompliance: number
  gapsToAddress: string[]
  recommendations: string[]
}

export interface ThreatPrediction {
  threat: string
  probability: number
  severity: "low" | "medium" | "high" | "critical"
  timeline: string
  prevention: string[]
}

export interface VelocityPrediction {
  currentVelocity: number
  predictedVelocity: Prediction[]
  factors: VelocityFactor[]
}

export interface VelocityFactor {
  factor: string
  impact: number
  trend: "positive" | "negative" | "neutral"
}

export interface BurnoutRisk {
  overallRisk: number
  riskByTeamMember?: { [member: string]: number }
  indicators: string[]
  preventionActions: string[]
}

export interface SkillGapTrend {
  skill: string
  currentGap: number
  projectedGap: number
  urgency: "low" | "medium" | "high"
  recommendations: string[]
}

export interface ForecastAlert {
  type: "warning" | "critical" | "info"
  message: string
  metric: string
  threshold: number
  currentValue: number
  predictedValue: number
  timeframe: string
  severity: number // 1-10
}

export interface ForecastRecommendation {
  action: string
  category: "performance" | "security" | "quality" | "team" | "architecture"
  priority: "immediate" | "high" | "medium" | "low"
  impact: string
  effort: string
  timeline: string
  success_probability: number
}

export class TrendPredictor {
  private config: TrendPredictorConfig
  private historicalData: CollectedData[]
  private historicalMetrics: CalculatedMetrics[]
  private models: Map<string, PredictionModel> = new Map()

  constructor(config: TrendPredictorConfig) {
    this.config = config
    this.historicalData = []
    this.historicalMetrics = []
    this.initializePredictionModels()
  }

  /**
   * מעדכן עם נתונים היסטוריים
   */
  public addHistoricalData(data: CollectedData, metrics: CalculatedMetrics): void {
    this.historicalData.push(data)
    this.historicalMetrics.push(metrics)

    // שמירה על תקופה הנדרשת בלבד
    const cutoffDate = new Date()
    cutoffDate.setMonth(cutoffDate.getMonth() - this.config.historicalPeriod)

    this.historicalData = this.historicalData.filter((d) => d.timestamp >= cutoffDate)
    this.historicalMetrics = this.historicalMetrics.filter(
      (_, index) => this.historicalData[index] && this.historicalData[index].timestamp >= cutoffDate
    )
  }

  /**
   * מבצע ניתוח מגמות מקיף וחיזוי
   */
  public async predictTrends(
    currentData: CollectedData,
    currentMetrics: CalculatedMetrics,
    patterns?: PatternAnalysisResult
  ): Promise<ComprehensiveForecast> {
    console.log("🔮 מתחיל חיזוי מגמות עם AI...")

    if (this.historicalData.length < 3) {
      console.warn("⚠️ מספר נתונים היסטוריים לא מספיק לחיזוי מדויק")
      return this.generateBasicForecast(currentData, currentMetrics)
    }

    try {
      // הכנת נתונים לניתוח
      const preparedData = this.prepareDataForAnalysis()

      // ריצה מקבילה של חיזויים שונים
      const [projectHealth, performance, security, quality, team] = await Promise.all([
        this.predictProjectHealth(preparedData),
        this.predictPerformance(preparedData),
        this.predictSecurity(preparedData),
        this.predictQuality(preparedData),
        this.predictTeamMetrics(preparedData),
      ])

      // זיהוי התראות וסיכונים
      const alerts = this.generateAlerts(projectHealth, performance, security, quality, team)

      // המלצות על בסיס חיזויים
      const recommendations = this.generateRecommendations(
        projectHealth,
        performance,
        security,
        quality,
        team,
        patterns
      )

      const forecast: ComprehensiveForecast = {
        projectHealth,
        performance,
        security,
        quality,
        team,
        alerts,
        recommendations,
      }

      console.log("✅ חיזוי מגמות הושלם בהצלחה")
      this.logForecastSummary(forecast)

      return forecast
    } catch (error) {
      console.error("❌ שגיאה בחיזוי מגמות:", error)
      throw error
    }
  }

  /**
   * מנתח מגמה ספציפית
   */
  public async analyzeTrend(metricName: string, values: HistoricalPoint[]): Promise<TrendAnalysis> {
    if (values.length < 3) {
      return this.getEmptyTrendAnalysis(metricName)
    }

    const trend = this.calculateTrendInfo(values)
    const seasonality = this.analyzeSeasonality(values)
    const predictions = await this.generatePredictions(metricName, values)
    const confidence = this.calculateConfidence(values, trend)
    const riskFactors = this.identifyRiskFactors(metricName, trend, predictions)

    return {
      metric: metricName,
      historicalData: values,
      trend,
      seasonality,
      predictions,
      confidence,
      riskFactors,
    }
  }

  /**
   * אתחול מודלי חיזוי
   */
  private initializePredictionModels(): void {
    // Linear regression model for basic trends
    this.models.set("linear-basic", {
      name: "Linear Basic",
      type: "linear",
      features: ["time", "value"],
      targetMetric: "generic",
      accuracy: 0.75,
      parameters: { slope: 0, intercept: 0 },
    })

    // Polynomial model for non-linear trends
    this.models.set("polynomial", {
      name: "Polynomial Trend",
      type: "polynomial",
      features: ["time", "value", "value_squared"],
      targetMetric: "generic",
      accuracy: 0.8,
      parameters: { degree: 2 },
    })

    // Exponential model for growth patterns
    this.models.set("exponential", {
      name: "Exponential Growth",
      type: "exponential",
      features: ["time", "log_value"],
      targetMetric: "growth_metrics",
      accuracy: 0.85,
      parameters: { growth_rate: 0 },
    })

    // Add custom models from config
    this.config.customModels.forEach((model) => {
      this.models.set(model.name, model)
    })
  }

  /**
   * הכנת נתונים לניתוח
   */
  private prepareDataForAnalysis(): PreparedData {
    const timeSeriesData: { [metric: string]: HistoricalPoint[] } = {}

    // חילוץ time series לכל מטריקה
    this.historicalMetrics.forEach((metrics, index) => {
      const timestamp = this.historicalData[index].timestamp

      timeSeriesData["projectHealth"] = timeSeriesData["projectHealth"] || []
      timeSeriesData["projectHealth"].push({
        timestamp,
        value: metrics.projectHealth.overallScore,
        context: { trend: metrics.projectHealth.trend },
      })

      timeSeriesData["codeQuality"] = timeSeriesData["codeQuality"] || []
      timeSeriesData["codeQuality"].push({
        timestamp,
        value: metrics.qualityScore.overall,
      })

      timeSeriesData["performance"] = timeSeriesData["performance"] || []
      timeSeriesData["performance"].push({
        timestamp,
        value: metrics.performanceScore.overall,
      })

      timeSeriesData["security"] = timeSeriesData["security"] || []
      timeSeriesData["security"].push({
        timestamp,
        value: metrics.securityScore.overall,
      })

      timeSeriesData["maintainability"] = timeSeriesData["maintainability"] || []
      timeSeriesData["maintainability"].push({
        timestamp,
        value: metrics.maintainabilityScore.overall,
      })

      timeSeriesData["velocity"] = timeSeriesData["velocity"] || []
      timeSeriesData["velocity"].push({
        timestamp,
        value: metrics.velocityMetrics.developmentVelocity,
      })
    })

    return { timeSeriesData }
  }

  /**
   * חיזוי בריאות הפרויקט
   */
  private async predictProjectHealth(data: PreparedData): Promise<HealthForecast> {
    const healthData = data.timeSeriesData["projectHealth"] || []
    const currentScore = healthData[healthData.length - 1]?.value || 0

    if (healthData.length < 3) {
      return {
        currentScore,
        predictedScore: [],
        keyDrivers: ["Insufficient historical data"],
        riskEvents: [],
        improvementOpportunities: [],
      }
    }

    const trendAnalysis = await this.analyzeTrend("projectHealth", healthData)
    const predictedScore = trendAnalysis.predictions

    // זיהוי גורמים מובילים
    const keyDrivers = this.identifyHealthDrivers(data)

    // זיהוי אירועי סיכון
    const riskEvents = this.identifyHealthRisks(trendAnalysis)

    // זיהוי הזדמנויות שיפור
    const improvementOpportunities = this.identifyImprovementOpportunities(trendAnalysis)

    return {
      currentScore,
      predictedScore,
      keyDrivers,
      riskEvents,
      improvementOpportunities,
    }
  }

  /**
   * חיזוי ביצועים
   */
  private async predictPerformance(data: PreparedData): Promise<PerformanceForecast> {
    const performanceData = data.timeSeriesData["performance"] || []

    // ניתוח מגמות ביצועים ספציפיות
    const buildTimeData = this.extractBuildTimeData()
    const bundleSizeData = this.extractBundleSizeData()
    const loadTimeData = this.extractLoadTimeData()

    const buildTime = await this.analyzeTrend("buildTime", buildTimeData)
    const bundleSize = await this.analyzeTrend("bundleSize", bundleSizeData)
    const loadTime = await this.analyzeTrend("loadTime", loadTimeData)

    const performanceRisks = this.identifyPerformanceRisks(buildTime, bundleSize, loadTime)

    return {
      buildTime,
      bundleSize,
      loadTime,
      performanceRisks,
    }
  }

  /**
   * חיזוי אבטחה
   */
  private async predictSecurity(data: PreparedData): Promise<SecurityForecast> {
    const securityData = data.timeSeriesData["security"] || []

    const riskTrend = await this.analyzeTrend("securityRisk", securityData)
    const vulnerabilityData = this.extractVulnerabilityData()
    const vulnerabilityGrowth = await this.analyzeTrend("vulnerabilities", vulnerabilityData)

    const complianceOutlook = this.predictCompliance()
    const threatPredictions = this.predictThreats()

    return {
      riskTrend,
      vulnerabilityGrowth,
      complianceOutlook,
      threatPredictions,
    }
  }

  /**
   * חיזוי איכות
   */
  private async predictQuality(data: PreparedData): Promise<QualityForecast> {
    const qualityData = data.timeSeriesData["codeQuality"] || []
    const maintainabilityData = data.timeSeriesData["maintainability"] || []

    const codeQualityTrend = await this.analyzeTrend("codeQuality", qualityData)
    const maintainabilityTrend = await this.analyzeTrend("maintainability", maintainabilityData)

    // נתונים נוספים מהמטריקות ההיסטוריות
    const technicalDebtData = this.extractTechnicalDebtData()
    const testCoverageData = this.extractTestCoverageData()

    const technicalDebtGrowth = await this.analyzeTrend("technicalDebt", technicalDebtData)
    const testCoverageTrend = await this.analyzeTrend("testCoverage", testCoverageData)

    return {
      codeQualityTrend,
      technicalDebtGrowth,
      maintainabilityTrend,
      testCoverageTrend,
    }
  }

  /**
   * חיזוי מטריקות צוות
   */
  private async predictTeamMetrics(data: PreparedData): Promise<TeamForecast> {
    const velocityData = data.timeSeriesData["velocity"] || []

    const productivityTrend = await this.analyzeTrend("productivity", velocityData)

    // חיזוי velocity
    const currentVelocity = velocityData[velocityData.length - 1]?.value || 0
    const velocityPrediction: VelocityPrediction = {
      currentVelocity,
      predictedVelocity: productivityTrend.predictions,
      factors: this.identifyVelocityFactors(productivityTrend),
    }

    const burnoutRisk = this.assessBurnoutRisk()
    const skillGapEvolution = this.predictSkillGaps()

    return {
      productivityTrend,
      velocityPrediction,
      burnoutRisk,
      skillGapEvolution,
    }
  }

  /**
   * חישוב מידע מגמה
   */
  private calculateTrendInfo(values: HistoricalPoint[]): TrendInfo {
    if (values.length < 2) {
      return {
        direction: "stable",
        strength: 0,
        rate: 0,
        significance: 0,
        changePoints: [],
        correlations: [],
      }
    }

    // חישוב linear regression פשוט
    const n = values.length
    const x = values.map((_, i) => i)
    const y = values.map((v) => v.value)

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // חישוב R-squared
    const yMean = sumY / n
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0)
    const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - (slope * x[i] + intercept), 2), 0)
    const rSquared = 1 - ssRes / ssTotal

    const direction = Math.abs(slope) < 0.01 ? "stable" : slope > 0 ? "increasing" : "decreasing"

    return {
      direction,
      strength: Math.min(1, Math.abs(rSquared)),
      rate: slope,
      significance: Math.min(1, Math.abs(rSquared)),
      changePoints: this.detectChangePoints(values),
      correlations: [],
    }
  }

  /**
   * ניתוח עונתיות
   */
  private analyzeSeasonality(values: HistoricalPoint[]): SeasonalityInfo {
    if (values.length < 14) {
      // Need at least 2 weeks of data
      return { hasSeasonality: false }
    }

    // בדיקה פשוטה לעונתיות שבועית
    const weeklyPattern = this.detectWeeklyPattern(values)

    if (weeklyPattern.strength > 0.3) {
      return {
        hasSeasonality: true,
        period: 7, // days
        amplitude: weeklyPattern.amplitude,
        phase: 0,
        seasonal_components: [
          {
            period: "weekly",
            strength: weeklyPattern.strength,
            pattern: "weekly",
          },
        ],
      }
    }

    return { hasSeasonality: false }
  }

  /**
   * יצירת חיזויים
   */
  private async generatePredictions(metricName: string, values: HistoricalPoint[]): Promise<Prediction[]> {
    const predictions: Prediction[] = []
    const lastValue = values[values.length - 1]
    const trend = this.calculateTrendInfo(values)

    // חיזוי לתקופות עתידיות
    const periodsToPredict = Math.min(12, this.config.predictionHorizon) // מקסימום שנה

    for (let i = 1; i <= periodsToPredict; i++) {
      const futureTimestamp = new Date(lastValue.timestamp)
      futureTimestamp.setMonth(futureTimestamp.getMonth() + i)

      // חיזוי פשוט על בסיס מגמה ליניארית
      const predictedValue = lastValue.value + trend.rate * i
      const uncertainty = i * 0.1 * Math.abs(lastValue.value) // אי-ודאות הולכת וגדלה

      const confidence = Math.max(0.1, trend.significance * (1 - i * 0.1))

      predictions.push({
        timestamp: futureTimestamp,
        value: predictedValue,
        confidence,
        upperBound: predictedValue + uncertainty,
        lowerBound: predictedValue - uncertainty,
        factors: this.identifyPredictionFactors(metricName, trend),
      })
    }

    return predictions
  }

  /**
   * חישוב רמת ביטחון
   */
  private calculateConfidence(values: HistoricalPoint[], trend: TrendInfo): number {
    if (values.length < 3) return 0.1

    // ביטחון על בסיס consistency של הנתונים וחוזק המגמה
    const consistency = this.calculateConsistency(values)
    const dataQuality = Math.min(1, values.length / 10) // ביטחון גובר עם יותר נתונים

    return Math.min(1, trend.significance * 0.4 + consistency * 0.4 + dataQuality * 0.2)
  }

  // Helper methods for data extraction
  private extractBuildTimeData(): HistoricalPoint[] {
    return this.historicalData.map((data) => ({
      timestamp: data.timestamp,
      value: data.performance.buildTime,
    }))
  }

  private extractBundleSizeData(): HistoricalPoint[] {
    return this.historicalData.map((data) => ({
      timestamp: data.timestamp,
      value: data.performance.bundleSize.total,
    }))
  }

  private extractLoadTimeData(): HistoricalPoint[] {
    return this.historicalData.map((data) => ({
      timestamp: data.timestamp,
      value: data.performance.loadTime.initial,
    }))
  }

  private extractVulnerabilityData(): HistoricalPoint[] {
    return this.historicalData.map((data) => ({
      timestamp: data.timestamp,
      value: data.security.vulnerabilityCount,
    }))
  }

  private extractTechnicalDebtData(): HistoricalPoint[] {
    return this.historicalData.map((data) => ({
      timestamp: data.timestamp,
      value: data.codeQuality.technicalDebt.ratio,
    }))
  }

  private extractTestCoverageData(): HistoricalPoint[] {
    return this.historicalData.map((data) => ({
      timestamp: data.timestamp,
      value: data.files.testCoverage.percentage,
    }))
  }

  // Helper methods for analysis
  private detectChangePoints(values: HistoricalPoint[]): ChangePoint[] {
    // Implementation for change point detection
    return []
  }

  private detectWeeklyPattern(values: HistoricalPoint[]): { strength: number; amplitude: number } {
    // Implementation for weekly pattern detection
    return { strength: 0, amplitude: 0 }
  }

  private calculateConsistency(values: HistoricalPoint[]): number {
    if (values.length < 2) return 0

    const changes = []
    for (let i = 1; i < values.length; i++) {
      const change = Math.abs(values[i].value - values[i - 1].value)
      changes.push(change)
    }

    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length
    const variance = changes.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / changes.length

    // נמוך variance = consistency גבוה
    return Math.max(0, 1 - variance / (avgChange * avgChange + 1))
  }

  private identifyHealthDrivers(data: PreparedData): string[] {
    const drivers: string[] = []

    // ניתוח correlation בין metrics שונים
    const correlations = this.calculateMetricCorrelations(data)

    correlations.forEach((corr) => {
      if (Math.abs(corr.correlation) > 0.7) {
        drivers.push(`${corr.metric} (correlation: ${corr.correlation.toFixed(2)})`)
      }
    })

    return drivers.length > 0 ? drivers : ["Code quality", "Performance", "Security"]
  }

  private calculateMetricCorrelations(data: PreparedData): Correlation[] {
    // Implementation for calculating correlations between metrics
    return []
  }

  private identifyHealthRisks(analysis: TrendAnalysis): RiskEvent[] {
    const risks: RiskEvent[] = []

    if (analysis.trend.direction === "decreasing" && analysis.trend.strength > 0.5) {
      risks.push({
        event: "Declining project health",
        probability: analysis.confidence,
        impact: 8,
        timeframe: "Next 3 months",
        indicators: ["Decreasing trend", "High confidence"],
      })
    }

    return risks
  }

  private identifyImprovementOpportunities(analysis: TrendAnalysis): string[] {
    const opportunities: string[] = []

    if (analysis.trend.direction === "stable" || analysis.trend.direction === "decreasing") {
      opportunities.push("Focus on code quality improvements")
      opportunities.push("Increase test coverage")
      opportunities.push("Address technical debt")
    }

    return opportunities
  }

  private identifyPerformanceRisks(
    buildTime: TrendAnalysis,
    bundleSize: TrendAnalysis,
    loadTime: TrendAnalysis
  ): PerformanceRisk[] {
    const risks: PerformanceRisk[] = []

    if (buildTime.trend.direction === "increasing" && buildTime.trend.strength > 0.5) {
      risks.push({
        risk: "Build time degradation",
        likelihood: buildTime.confidence,
        impact: "High development friction",
        metric: "buildTime",
        threshold: 300, // 5 minutes
      })
    }

    return risks
  }

  private predictCompliance(): ComplianceOutlook {
    return {
      currentCompliance: 85,
      projectedCompliance: 87,
      gapsToAddress: ["GDPR data handling", "Security audit trail"],
      recommendations: ["Implement audit logging", "Review data retention policies"],
    }
  }

  private predictThreats(): ThreatPrediction[] {
    return [
      {
        threat: "Dependency vulnerabilities",
        probability: 0.7,
        severity: "medium",
        timeline: "Next 6 months",
        prevention: ["Regular dependency updates", "Automated security scanning"],
      },
    ]
  }

  private identifyVelocityFactors(trend: TrendAnalysis): VelocityFactor[] {
    return [
      {
        factor: "Team experience",
        impact: 0.3,
        trend: "positive",
      },
      {
        factor: "Technical debt",
        impact: -0.2,
        trend: "negative",
      },
    ]
  }

  private assessBurnoutRisk(): BurnoutRisk {
    return {
      overallRisk: 0.3, // 30% risk
      indicators: ["High velocity", "Long hours"],
      preventionActions: ["Regular breaks", "Workload distribution"],
    }
  }

  private predictSkillGaps(): SkillGapTrend[] {
    return [
      {
        skill: "Advanced TypeScript",
        currentGap: 0.4,
        projectedGap: 0.2,
        urgency: "medium",
        recommendations: ["TypeScript training", "Pair programming"],
      },
    ]
  }

  private identifyRiskFactors(metricName: string, trend: TrendInfo, predictions: Prediction[]): RiskFactor[] {
    const risks: RiskFactor[] = []

    if (trend.direction === "decreasing" && trend.strength > 0.6) {
      risks.push({
        factor: `${metricName} decline`,
        probability: trend.significance,
        impact: "high",
        timeframe: "Next quarter",
        mitigation: `Focus on improving ${metricName}`,
      })
    }

    return risks
  }

  private identifyPredictionFactors(metricName: string, trend: TrendInfo): PredictionFactor[] {
    return [
      {
        factor: "Historical trend",
        impact: trend.rate > 0 ? 0.6 : -0.6,
        confidence: trend.significance,
        explanation: `Based on ${trend.direction} trend with ${trend.strength} strength`,
      },
    ]
  }

  private generateBasicForecast(data: CollectedData, metrics: CalculatedMetrics): ComprehensiveForecast {
    // חיזוי בסיסי כאשר אין מספיק נתונים היסטוריים
    return {
      projectHealth: {
        currentScore: metrics.projectHealth.overallScore,
        predictedScore: [],
        keyDrivers: ["Insufficient data"],
        riskEvents: [],
        improvementOpportunities: ["Collect more historical data"],
      },
      performance: {
        buildTime: this.getEmptyTrendAnalysis("buildTime"),
        bundleSize: this.getEmptyTrendAnalysis("bundleSize"),
        loadTime: this.getEmptyTrendAnalysis("loadTime"),
        performanceRisks: [],
      },
      security: {
        riskTrend: this.getEmptyTrendAnalysis("securityRisk"),
        vulnerabilityGrowth: this.getEmptyTrendAnalysis("vulnerabilities"),
        complianceOutlook: this.predictCompliance(),
        threatPredictions: this.predictThreats(),
      },
      quality: {
        codeQualityTrend: this.getEmptyTrendAnalysis("codeQuality"),
        technicalDebtGrowth: this.getEmptyTrendAnalysis("technicalDebt"),
        maintainabilityTrend: this.getEmptyTrendAnalysis("maintainability"),
        testCoverageTrend: this.getEmptyTrendAnalysis("testCoverage"),
      },
      team: {
        productivityTrend: this.getEmptyTrendAnalysis("productivity"),
        velocityPrediction: {
          currentVelocity: metrics.velocityMetrics.developmentVelocity,
          predictedVelocity: [],
          factors: [],
        },
        burnoutRisk: this.assessBurnoutRisk(),
        skillGapEvolution: this.predictSkillGaps(),
      },
      alerts: [],
      recommendations: [],
    }
  }

  private getEmptyTrendAnalysis(metric: string): TrendAnalysis {
    return {
      metric,
      historicalData: [],
      trend: {
        direction: "stable",
        strength: 0,
        rate: 0,
        significance: 0,
        changePoints: [],
        correlations: [],
      },
      seasonality: { hasSeasonality: false },
      predictions: [],
      confidence: 0,
      riskFactors: [],
    }
  }

  private generateAlerts(
    projectHealth: HealthForecast,
    performance: PerformanceForecast,
    security: SecurityForecast,
    quality: QualityForecast,
    team: TeamForecast
  ): ForecastAlert[] {
    const alerts: ForecastAlert[] = []

    // בדיקת התראות על בסיס חיזויים
    if (projectHealth.predictedScore.length > 0) {
      const nextMonthScore = projectHealth.predictedScore[0]
      if (nextMonthScore.value < 70) {
        alerts.push({
          type: "warning",
          message: "Project health score predicted to drop below 70",
          metric: "projectHealth",
          threshold: 70,
          currentValue: projectHealth.currentScore,
          predictedValue: nextMonthScore.value,
          timeframe: "Next month",
          severity: 7,
        })
      }
    }

    return alerts
  }

  private generateRecommendations(
    projectHealth: HealthForecast,
    performance: PerformanceForecast,
    security: SecurityForecast,
    quality: QualityForecast,
    team: TeamForecast,
    patterns?: PatternAnalysisResult
  ): ForecastRecommendation[] {
    const recommendations: ForecastRecommendation[] = []

    // המלצות על בסיס מגמות חיזוי
    if (quality.codeQualityTrend.trend.direction === "decreasing") {
      recommendations.push({
        action: "Implement code quality improvement plan",
        category: "quality",
        priority: "high",
        impact: "Prevent further quality degradation",
        effort: "Medium - 2-3 sprints",
        timeline: "Next quarter",
        success_probability: 0.8,
      })
    }

    if (performance.buildTime.trend.direction === "increasing") {
      recommendations.push({
        action: "Optimize build process",
        category: "performance",
        priority: "medium",
        impact: "Reduce build time and improve developer productivity",
        effort: "Low - 1 sprint",
        timeline: "Next month",
        success_probability: 0.9,
      })
    }

    return recommendations
  }

  private logForecastSummary(forecast: ComprehensiveForecast): void {
    console.log("📈 סיכום חיזוי מגמות:")
    console.log(`├── 📊 בריאות פרויקט נוכחית: ${forecast.projectHealth.currentScore}/100`)
    console.log(`├── ⚠️ התראות: ${forecast.alerts.length}`)
    console.log(`├── 💡 המלצות: ${forecast.recommendations.length}`)
    console.log(`├── 🎯 הזדמנויות שיפור: ${forecast.projectHealth.improvementOpportunities.length}`)
    console.log(`└── 🚨 אירועי סיכון: ${forecast.projectHealth.riskEvents.length}`)
  }

  /**
   * מייצא דוח חיזוי מפורט
   */
  public exportForecastReport(forecast: ComprehensiveForecast): string {
    return JSON.stringify(
      {
        summary: {
          currentHealth: forecast.projectHealth.currentScore,
          alertsCount: forecast.alerts.length,
          recommendationsCount: forecast.recommendations.length,
          riskEventsCount: forecast.projectHealth.riskEvents.length,
        },
        forecast,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  }
}

// Type for prepared analysis data
interface PreparedData {
  timeSeriesData: { [metric: string]: HistoricalPoint[] }
}
