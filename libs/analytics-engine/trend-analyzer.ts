/**
 * Trend Analyzer - מנתח מגמות וחיזויים
 * מזהה דפוסים היסטוריים ומנבא מגמות עתידיות
 */

import { AnalyticsConfig, AnalyticsData, TrendAnalysisResult, VelocityTrend, QualityTrend, IssueTrend, PerformanceTrend, PredictiveInsight } from './index';

export interface TrendData {
  timestamp: Date;
  metrics: TrendMetrics;
}

export interface TrendMetrics {
  developmentVelocity: number;
  codeQuality: number;
  issueResolution: number;
  performance: number;
  security: number;
  teamProductivity: number;
  technicalDebt: number;
}

export interface TrendPrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: number; // days
  confidence: number; // 0-1
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SeasonalPattern {
  metric: string;
  pattern: 'weekly' | 'monthly' | 'quarterly';
  peaks: Date[];
  valleys: Date[];
  averageVariation: number;
}

export interface AnomalyDetection {
  timestamp: Date;
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  possibleCauses: string[];
}

export class TrendAnalyzer {
  private config: AnalyticsConfig;
  private historicalData: TrendData[] = [];
  private patterns: Map<string, SeasonalPattern> = new Map();
  private anomalies: AnomalyDetection[] = [];

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  /**
   * ניתוח מגמות מקיף על בסיס נתונים היסטוריים
   */
  public async analyzeTrends(historicalAnalytics: AnalyticsData[]): Promise<TrendAnalysisResult> {
    console.log('📈 מנתח מגמות היסטוריות...');

    try {
      // המרת נתונים לפורמט מגמות
      this.historicalData = this.convertToTrendData(historicalAnalytics);

      if (this.historicalData.length < 3) {
        console.log('⚠️ לא מספיק נתונים היסטוריים לניתוח מגמות מלא');
        return this.getBasicTrendAnalysis();
      }

      const [
        developmentVelocity,
        codeQualityTrend,
        issueResolutionTrend,
        performanceTrend,
        predictiveInsights
      ] = await Promise.all([
        this.analyzeDevelopmentVelocityTrend(),
        this.analyzeCodeQualityTrend(),
        this.analyzeIssueResolutionTrend(),
        this.analyzePerformanceTrend(),
        this.generatePredictiveInsights()
      ]);

      // זיהוי דפוסים עונתיים
      await this.detectSeasonalPatterns();

      // זיהוי חריגות
      await this.detectAnomalies();

      return {
        developmentVelocity,
        codeQualityTrend,
        issueResolutionTrend,
        performanceTrend,
        predictiveInsights
      };

    } catch (error) {
      console.error('❌ שגיאה בניתוח מגמות:', error);
      return this.getBasicTrendAnalysis();
    }
  }

  /**
   * ניתוח מגמת מהירות פיתוח
   */
  private async analyzeDevelopmentVelocityTrend(): Promise<VelocityTrend> {
    const velocityData = this.historicalData.map(d => d.metrics.developmentVelocity);
    
    if (velocityData.length < 2) {
      return { trend: 'stable', velocity: 0 };
    }

    const trend = this.calculateTrend(velocityData);
    const currentVelocity = velocityData[velocityData.length - 1];
    const averageVelocity = velocityData.reduce((a, b) => a + b, 0) / velocityData.length;

    // חישוב מגמה מתקדם
    const movingAverage = this.calculateMovingAverage(velocityData, 7); // שבוע
    const volatility = this.calculateVolatility(velocityData);
    
    return {
      trend: trend.direction,
      velocity: currentVelocity,
      average: averageVelocity,
      movingAverage: movingAverage[movingAverage.length - 1],
      volatility,
      prediction: this.predictNextValue(velocityData, 7) // חיזוי לשבוע הבא
    };
  }

  /**
   * ניתוח מגמת איכות קוד
   */
  private async analyzeCodeQualityTrend(): Promise<QualityTrend> {
    const qualityData = this.historicalData.map(d => d.metrics.codeQuality);
    
    if (qualityData.length < 2) {
      return { trend: 'stable', score: 0 };
    }

    const trend = this.calculateTrend(qualityData);
    const currentScore = qualityData[qualityData.length - 1];
    const qualityImprovement = this.calculateImprovement(qualityData);

    return {
      trend: trend.direction,
      score: currentScore,
      improvement: qualityImprovement,
      regressionRisk: this.calculateRegressionRisk(qualityData),
      targetScore: this.calculateOptimalTarget(qualityData),
      timeToTarget: this.estimateTimeToTarget(qualityData, trend.slope)
    };
  }

  /**
   * ניתוח מגמת פתרון בעיות
   */
  private async analyzeIssueResolutionTrend(): Promise<IssueTrend> {
    const resolutionData = this.historicalData.map(d => d.metrics.issueResolution);
    
    if (resolutionData.length < 2) {
      return { trend: 'stable', resolution: 0 };
    }

    const trend = this.calculateTrend(resolutionData);
    const currentResolution = resolutionData[resolutionData.length - 1];
    const efficiency = this.calculateResolutionEfficiency(resolutionData);

    return {
      trend: trend.direction,
      resolution: currentResolution,
      efficiency,
      bottlenecks: this.identifyBottlenecks(resolutionData),
      improvementOpportunities: this.identifyImprovementOpportunities(resolutionData)
    };
  }

  /**
   * ניתוח מגמת ביצועים
   */
  private async analyzePerformanceTrend(): Promise<PerformanceTrend> {
    const performanceData = this.historicalData.map(d => d.metrics.performance);
    
    if (performanceData.length < 2) {
      return { trend: 'stable', metrics: {} };
    }

    const trend = this.calculateTrend(performanceData);
    const currentPerformance = performanceData[performanceData.length - 1];
    const degradationRisk = this.calculateDegradationRisk(performanceData);

    return {
      trend: trend.direction,
      metrics: {
        current: currentPerformance,
        average: performanceData.reduce((a, b) => a + b, 0) / performanceData.length,
        best: Math.max(...performanceData),
        worst: Math.min(...performanceData)
      },
      degradationRisk,
      optimizationPotential: this.calculateOptimizationPotential(performanceData),
      criticalThresholds: this.identifyCriticalThresholds(performanceData)
    };
  }

  /**
   * יצירת תובנות חיזוי מתקדמות
   */
  private async generatePredictiveInsights(): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];

    // חיזוי איכות קוד
    const qualityPrediction = this.predictQualityTrend();
    if (qualityPrediction) {
      insights.push(qualityPrediction);
    }

    // חיזוי ביצועים
    const performancePrediction = this.predictPerformanceTrend();
    if (performancePrediction) {
      insights.push(performancePrediction);
    }

    // חיזוי חוב טכני
    const debtPrediction = this.predictTechnicalDebtTrend();
    if (debtPrediction) {
      insights.push(debtPrediction);
    }

    // זיהוי סיכונים עתידיים
    const riskInsights = this.predictFutureRisks();
    insights.push(...riskInsights);

    return insights;
  }

  /**
   * זיהוי דפוסים עונתיים
   */
  private async detectSeasonalPatterns(): Promise<void> {
    if (this.historicalData.length < 30) {
      return; // לא מספיק נתונים לזיהוי דפוסים עונתיים
    }

    const metrics = ['developmentVelocity', 'codeQuality', 'performance'];
    
    for (const metric of metrics) {
      const weeklyPattern = this.detectWeeklyPattern(metric);
      if (weeklyPattern) {
        this.patterns.set(`${metric}_weekly`, weeklyPattern);
      }

      const monthlyPattern = this.detectMonthlyPattern(metric);
      if (monthlyPattern) {
        this.patterns.set(`${metric}_monthly`, monthlyPattern);
      }
    }
  }

  /**
   * זיהוי חריגות בנתונים
   */
  private async detectAnomalies(): Promise<void> {
    const threshold = 2; // סטיות תקן
    
    for (const data of this.historicalData) {
      const anomalies = this.findAnomaliesInData(data, threshold);
      this.anomalies.push(...anomalies);
    }

    // סינון חריגות משמעותיות בלבד
    this.anomalies = this.anomalies.filter(a => a.severity !== 'minor');
  }

  // Helper methods for trend calculations
  private calculateTrend(data: number[]): { direction: string; slope: number; correlation: number } {
    if (data.length < 2) {
      return { direction: 'stable', slope: 0, correlation: 0 };
    }

    // חישוב רגרסיה ליניארית פשוטה
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const correlation = this.calculateCorrelation(x, y);

    let direction = 'stable';
    if (Math.abs(slope) > 0.1) {
      direction = slope > 0 ? 'increasing' : 'decreasing';
    }

    return { direction, slope, correlation };
  }

  private calculateMovingAverage(data: number[], window: number): number[] {
    const result: number[] = [];
    for (let i = window - 1; i < data.length; i++) {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
    return result;
  }

  private calculateVolatility(data: number[]): number {
    if (data.length < 2) return 0;
    
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator !== 0 ? numerator / denominator : 0;
  }

  private predictNextValue(data: number[], days: number): number {
    if (data.length < 3) return data[data.length - 1] || 0;

    const trend = this.calculateTrend(data);
    const lastValue = data[data.length - 1];
    
    return lastValue + (trend.slope * days);
  }

  private calculateImprovement(data: number[]): number {
    if (data.length < 2) return 0;
    
    const first = data[0];
    const last = data[data.length - 1];
    
    return ((last - first) / first) * 100;
  }

  private calculateRegressionRisk(data: number[]): number {
    const volatility = this.calculateVolatility(data);
    const trend = this.calculateTrend(data);
    
    // חישוב סיכון רגרסיה על בסיס תנודתיות ומגמה
    let risk = volatility * 10; // נורמליזציה
    
    if (trend.direction === 'decreasing') {
      risk += 20;
    }
    
    return Math.min(100, Math.max(0, risk));
  }

  private calculateOptimalTarget(data: number[]): number {
    const max = Math.max(...data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    
    // יעד אופטימלי = 90% מהדרך בין ממוצע למקסימום
    return avg + (max - avg) * 0.9;
  }

  private estimateTimeToTarget(data: number[], slope: number): number {
    if (slope <= 0) return Infinity;
    
    const current = data[data.length - 1];
    const target = this.calculateOptimalTarget(data);
    
    return Math.ceil((target - current) / slope);
  }

  private calculateResolutionEfficiency(data: number[]): number {
    // חישוב יעילות פתרון בעיות
    const trend = this.calculateTrend(data);
    const volatility = this.calculateVolatility(data);
    
    // יעילות גבוהה = מגמה חיובית + תנודתיות נמוכה
    return Math.max(0, 100 - volatility * 10 + (trend.slope > 0 ? 20 : 0));
  }

  private identifyBottlenecks(data: number[]): string[] {
    const bottlenecks: string[] = [];
    
    const trend = this.calculateTrend(data);
    if (trend.direction === 'decreasing') {
      bottlenecks.push('ירידה במהירות פתרון בעיות');
    }
    
    const volatility = this.calculateVolatility(data);
    if (volatility > 10) {
      bottlenecks.push('תנודתיות גבוהה בזמני פתרון');
    }
    
    return bottlenecks;
  }

  private identifyImprovementOpportunities(data: number[]): string[] {
    const opportunities: string[] = [];
    
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const max = Math.max(...data);
    
    if (max > avg * 1.5) {
      opportunities.push('פוטנציאל להגדלת עקביות בפתרון בעיות');
    }
    
    const recent = data.slice(-7); // שבוע אחרון
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    
    if (recentAvg < avg * 0.8) {
      opportunities.push('שיפור דחוף נדרש בביצועים האחרונים');
    }
    
    return opportunities;
  }

  private calculateDegradationRisk(data: number[]): number {
    const trend = this.calculateTrend(data);
    const volatility = this.calculateVolatility(data);
    
    let risk = 0;
    
    if (trend.direction === 'decreasing') {
      risk += 40;
    }
    
    risk += volatility * 5;
    
    return Math.min(100, Math.max(0, risk));
  }

  private calculateOptimizationPotential(data: number[]): number {
    const current = data[data.length - 1];
    const best = Math.max(...data);
    
    return ((best - current) / best) * 100;
  }

  private identifyCriticalThresholds(data: number[]): { warning: number; critical: number } {
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const std = this.calculateVolatility(data);
    
    return {
      warning: avg - std,
      critical: avg - (2 * std)
    };
  }

  private predictQualityTrend(): PredictiveInsight | null {
    const qualityData = this.historicalData.map(d => d.metrics.codeQuality);
    if (qualityData.length < 5) return null;

    const trend = this.calculateTrend(qualityData);
    const prediction = this.predictNextValue(qualityData, 30); // 30 ימים

    return {
      type: 'quality_prediction',
      prediction: `איכות הקוד צפויה ${trend.direction === 'increasing' ? 'לעלות' : 'לרדת'} ל-${prediction.toFixed(1)} בחודש הבא`,
      confidence: Math.abs(trend.correlation),
      timeline: '30 ימים',
      impact: trend.direction === 'decreasing' ? 'critical' : 'positive'
    };
  }

  private predictPerformanceTrend(): PredictiveInsight | null {
    const performanceData = this.historicalData.map(d => d.metrics.performance);
    if (performanceData.length < 5) return null;

    const trend = this.calculateTrend(performanceData);
    const degradationRisk = this.calculateDegradationRisk(performanceData);

    return {
      type: 'performance_prediction',
      prediction: `ביצועי המערכת מציגים מגמת ${trend.direction} עם סיכון ירידה של ${degradationRisk.toFixed(1)}%`,
      confidence: Math.abs(trend.correlation),
      timeline: '14 ימים',
      impact: degradationRisk > 50 ? 'critical' : 'moderate'
    };
  }

  private predictTechnicalDebtTrend(): PredictiveInsight | null {
    const debtData = this.historicalData.map(d => d.metrics.technicalDebt);
    if (debtData.length < 5) return null;

    const trend = this.calculateTrend(debtData);
    const prediction = this.predictNextValue(debtData, 30);

    return {
      type: 'debt_prediction',
      prediction: `החוב הטכני צפוי ${trend.direction === 'increasing' ? 'לעלות' : 'לרדת'} ל-${prediction.toFixed(1)}% בחודש הבא`,
      confidence: Math.abs(trend.correlation),
      timeline: '30 ימים',
      impact: prediction > 25 ? 'critical' : 'moderate'
    };
  }

  private predictFutureRisks(): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];

    // זיהוי סיכוני ביצועים
    const performanceData = this.historicalData.map(d => d.metrics.performance);
    if (performanceData.length >= 5) {
      const degradationRisk = this.calculateDegradationRisk(performanceData);
      if (degradationRisk > 60) {
        insights.push({
          type: 'performance_risk',
          prediction: 'סיכון גבוה לירידה משמעותית בביצועים בשבועיים הקרובים',
          confidence: 0.8,
          timeline: '14 ימים',
          impact: 'critical'
        });
      }
    }

    return insights;
  }

  private detectWeeklyPattern(metric: string): SeasonalPattern | null {
    // מימוש זיהוי דפוס שבועי
    return null;
  }

  private detectMonthlyPattern(metric: string): SeasonalPattern | null {
    // מימוש זיהוי דפוס חודשי
    return null;
  }

  private findAnomaliesInData(data: TrendData, threshold: number): AnomalyDetection[] {
    // מימוש זיהוי חריגות
    return [];
  }

  private convertToTrendData(analytics: AnalyticsData[]): TrendData[] {
    return analytics.map(data => ({
      timestamp: data.timestamp,
      metrics: {
        developmentVelocity: this.calculateDevelopmentVelocity(data),
        codeQuality: data.projectHealth.codeQuality,
        issueResolution: this.calculateIssueResolution(data),
        performance: data.projectHealth.performance,
        security: data.projectHealth.security,
        teamProductivity: this.calculateTeamProductivity(data),
        technicalDebt: data.projectHealth.technicalDebt
      }
    }));
  }

  private calculateDevelopmentVelocity(data: AnalyticsData): number {
    // חישוב מהירות פיתוח על בסיס נתונים קיימים
    return data.projectHealth.overallScore * 0.8 + data.projectHealth.testCoverage * 0.2;
  }

  private calculateIssueResolution(data: AnalyticsData): number {
    // חישוב יעילות פתרון בעיות
    return (data.projectHealth.codeQuality + data.projectHealth.maintainability) / 2;
  }

  private calculateTeamProductivity(data: AnalyticsData): number {
    // חישוב פרודוקטיביות צוות
    return data.projectHealth.overallScore * 0.9;
  }

  private getBasicTrendAnalysis(): TrendAnalysisResult {
    return {
      developmentVelocity: { trend: 'stable', velocity: 50 },
      codeQualityTrend: { trend: 'stable', score: 75 },
      issueResolutionTrend: { trend: 'stable', resolution: 60 },
      performanceTrend: { trend: 'stable', metrics: {} },
      predictiveInsights: []
    };
  }
}