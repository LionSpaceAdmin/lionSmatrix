export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'behavioral' | 'network';
  value: string;
  confidence: number;
  source: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ThreatScore {
  overallScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'info';
  indicators: ThreatIndicator[];
  analysis: {
    category: string;
    confidence: number;
    impact: number;
    likelihood: number;
  };
  recommendations: string[];
  timestamp: Date;
}

export interface ThreatScoringService {
  calculateThreatScore(indicators: ThreatIndicator[]): Promise<ThreatScore>;
  updateScoringModel(modelData: any): Promise<void>;
  getHistoricalScores(entityId: string, timeRange?: { start: Date; end: Date }): Promise<ThreatScore[]>;
  compareScores(scores: ThreatScore[]): Promise<any>;
}

export class ThreatScoringEngine implements ThreatScoringService {
  private weights = {
    ip: 0.3,
    domain: 0.25,
    hash: 0.35,
    behavioral: 0.4,
    network: 0.3,
  };

  async calculateThreatScore(indicators: ThreatIndicator[]): Promise<ThreatScore> {
    if (!indicators.length) {
      return this.createEmptyScore();
    }

    const weightedScores = indicators.map(indicator => {
      const weight = this.weights[indicator.type] || 0.2;
      return indicator.confidence * weight;
    });

    const overallScore = Math.min(
      100,
      weightedScores.reduce((sum, score) => sum + score, 0) / indicators.length * 100
    );

    const riskLevel = this.determineRiskLevel(overallScore);
    const recommendations = this.generateRecommendations(riskLevel, indicators);

    return {
      overallScore,
      riskLevel,
      indicators,
      analysis: {
        category: this.categorizeThreats(indicators),
        confidence: this.calculateConfidence(indicators),
        impact: this.calculateImpact(overallScore),
        likelihood: this.calculateLikelihood(indicators),
      },
      recommendations,
      timestamp: new Date(),
    };
  }

  async updateScoringModel(modelData: any): Promise<void> {
    // Update scoring weights based on new model data
    if (modelData.weights) {
      Object.assign(this.weights, modelData.weights);
    }
  }

  async getHistoricalScores(
    entityId: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<ThreatScore[]> {
    // Fetch historical scores from database
    // This would connect to your database
    return [];
  }

  async compareScores(scores: ThreatScore[]): Promise<any> {
    if (!scores.length) return null;

    const avgScore = scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length;
    const trend = this.calculateTrend(scores);
    
    return {
      averageScore: avgScore,
      trend,
      highestRisk: Math.max(...scores.map(s => s.overallScore)),
      lowestRisk: Math.min(...scores.map(s => s.overallScore)),
      timeline: scores.map(s => ({
        score: s.overallScore,
        level: s.riskLevel,
        timestamp: s.timestamp,
      })),
    };
  }

  private determineRiskLevel(score: number): ThreatScore['riskLevel'] {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'info';
  }

  private categorizeThreats(indicators: ThreatIndicator[]): string {
    const types = indicators.map(i => i.type);
    const uniqueTypes = [...new Set(types)];
    
    if (uniqueTypes.includes('behavioral') && uniqueTypes.includes('network')) {
      return 'Advanced Persistent Threat';
    }
    if (uniqueTypes.includes('hash')) {
      return 'Malware Activity';
    }
    if (uniqueTypes.includes('domain') || uniqueTypes.includes('ip')) {
      return 'Network Threat';
    }
    return 'General Threat';
  }

  private calculateConfidence(indicators: ThreatIndicator[]): number {
    if (!indicators.length) return 0;
    return indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length;
  }

  private calculateImpact(score: number): number {
    return Math.min(100, score * 1.2);
  }

  private calculateLikelihood(indicators: ThreatIndicator[]): number {
    const recentIndicators = indicators.filter(i => {
      const hoursSince = (Date.now() - i.timestamp.getTime()) / (1000 * 60 * 60);
      return hoursSince < 24;
    });
    
    return (recentIndicators.length / Math.max(1, indicators.length)) * 100;
  }

  private generateRecommendations(
    level: ThreatScore['riskLevel'],
    indicators: ThreatIndicator[]
  ): string[] {
    const recommendations: string[] = [];

    switch (level) {
      case 'critical':
        recommendations.push('Immediate incident response required');
        recommendations.push('Isolate affected systems');
        recommendations.push('Activate security team escalation');
        break;
      case 'high':
        recommendations.push('Investigate suspicious activity');
        recommendations.push('Review security logs');
        recommendations.push('Consider preventive measures');
        break;
      case 'medium':
        recommendations.push('Monitor for escalation');
        recommendations.push('Update security rules');
        break;
      case 'low':
        recommendations.push('Continue standard monitoring');
        break;
    }

    // Add specific recommendations based on indicator types
    if (indicators.some(i => i.type === 'hash')) {
      recommendations.push('Scan systems for malware presence');
    }
    if (indicators.some(i => i.type === 'network')) {
      recommendations.push('Review firewall rules and network segmentation');
    }

    return recommendations;
  }

  private calculateTrend(scores: ThreatScore[]): 'increasing' | 'decreasing' | 'stable' {
    if (scores.length < 2) return 'stable';
    
    const recent = scores.slice(-5);
    const older = scores.slice(-10, -5);
    
    if (!older.length) return 'stable';
    
    const recentAvg = recent.reduce((sum, s) => sum + s.overallScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.overallScore, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (Math.abs(difference) < 5) return 'stable';
    return difference > 0 ? 'increasing' : 'decreasing';
  }

  private createEmptyScore(): ThreatScore {
    return {
      overallScore: 0,
      riskLevel: 'info',
      indicators: [],
      analysis: {
        category: 'None',
        confidence: 0,
        impact: 0,
        likelihood: 0,
      },
      recommendations: ['No threats detected'],
      timestamp: new Date(),
    };
  }
}