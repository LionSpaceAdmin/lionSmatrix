/**
 * Smart Indicators System - Main Engine
 * Advanced intelligent insights and health monitoring for Lions of Zion Network Canvas
 */

import { HealthIndicatorsEngine } from './health-indicators';
import { ConnectionAnalyzer } from './connection-analyzer';
import { PerformanceMetrics } from './performance-metrics';
import { SecurityScanner } from './security-scanner';
import { AISuggestions } from './ai-suggestions';
import { VisualIndicators } from './visual-indicators';

export interface IndicatorLevel {
  CRITICAL: 'critical';
  WARNING: 'warning';
  INFO: 'info';
  SUCCESS: 'success';
}

export interface SmartIndicator {
  id: string;
  type: 'health' | 'connection' | 'performance' | 'security' | 'suggestion';
  level: keyof IndicatorLevel;
  title: string;
  description: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  category: string;
  timestamp: Date;
  actionable: boolean;
  suggestion?: string;
  visualConfig?: {
    color: string;
    icon: string;
    animation?: 'pulse' | 'glow' | 'bounce';
  };
}

export interface IndicatorThresholds {
  critical: number;
  warning: number;
  good: number;
  excellent: number;
}

export interface SmartIndicatorsConfig {
  refreshInterval: number; // milliseconds
  enableRealTimeUpdates: boolean;
  enableAIAnalysis: boolean;
  enablePredictiveInsights: boolean;
  thresholds: {
    health: IndicatorThresholds;
    performance: IndicatorThresholds;
    security: IndicatorThresholds;
  };
  visualPreferences: {
    enableAnimations: boolean;
    colorScheme: 'dark' | 'light' | 'auto';
    compactMode: boolean;
  };
}

export class SmartIndicatorsEngine {
  private healthEngine: HealthIndicatorsEngine;
  private connectionAnalyzer: ConnectionAnalyzer;
  private performanceMetrics: PerformanceMetrics;
  private securityScanner: SecurityScanner;
  private aiSuggestions: AISuggestions;
  private visualIndicators: VisualIndicators;
  private config: SmartIndicatorsConfig;
  private indicators: Map<string, SmartIndicator> = new Map();
  private subscribers: Set<(indicators: SmartIndicator[]) => void> = new Set();
  private refreshTimer?: NodeJS.Timeout;

  constructor(config: Partial<SmartIndicatorsConfig> = {}) {
    this.config = {
      refreshInterval: 5000,
      enableRealTimeUpdates: true,
      enableAIAnalysis: true,
      enablePredictiveInsights: true,
      thresholds: {
        health: { critical: 50, warning: 70, good: 85, excellent: 95 },
        performance: { critical: 50, warning: 70, good: 85, excellent: 95 },
        security: { critical: 60, warning: 80, good: 90, excellent: 98 }
      },
      visualPreferences: {
        enableAnimations: true,
        colorScheme: 'dark',
        compactMode: false
      },
      ...config
    };

    // Initialize engines
    this.healthEngine = new HealthIndicatorsEngine(this.config.thresholds.health);
    this.connectionAnalyzer = new ConnectionAnalyzer();
    this.performanceMetrics = new PerformanceMetrics(this.config.thresholds.performance);
    this.securityScanner = new SecurityScanner(this.config.thresholds.security);
    this.aiSuggestions = new AISuggestions();
    this.visualIndicators = new VisualIndicators(this.config.visualPreferences);
  }

  /**
   * Initialize the Smart Indicators System
   */
  async initialize(): Promise<void> {
    await Promise.all([
      this.healthEngine.initialize(),
      this.connectionAnalyzer.initialize(),
      this.performanceMetrics.initialize(),
      this.securityScanner.initialize(),
      this.aiSuggestions.initialize()
    ]);

    if (this.config.enableRealTimeUpdates) {
      this.startRealTimeUpdates();
    }

    // Perform initial scan
    await this.runFullAnalysis();
  }

  /**
   * Run comprehensive analysis across all systems
   */
  async runFullAnalysis(): Promise<SmartIndicator[]> {
    const analysisPromises = [
      this.healthEngine.analyze(),
      this.connectionAnalyzer.analyze(),
      this.performanceMetrics.analyze(),
      this.securityScanner.analyze()
    ];

    const results = await Promise.allSettled(analysisPromises);
    const allIndicators: SmartIndicator[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allIndicators.push(...result.value);
      } else {
        console.error(`Analysis failed for engine ${index}:`, result.reason);
      }
    });

    // Generate AI suggestions based on findings
    if (this.config.enableAIAnalysis) {
      try {
        const suggestions = await this.aiSuggestions.generateSuggestions(allIndicators);
        allIndicators.push(...suggestions);
      } catch (error) {
        console.error('AI suggestions generation failed:', error);
      }
    }

    // Update indicators map
    allIndicators.forEach(indicator => {
      this.indicators.set(indicator.id, indicator);
    });

    // Notify subscribers
    this.notifySubscribers();

    return allIndicators;
  }

  /**
   * Get overall system health score (0-100)
   */
  getOverallHealthScore(): number {
    const indicators = Array.from(this.indicators.values());
    if (indicators.length === 0) return 0;

    const scores = indicators
      .filter(indicator => typeof indicator.value === 'number')
      .map(indicator => {
        const value = indicator.value as number;
        // Weight by severity
        const severityWeight = {
          critical: 3,
          warning: 2,
          info: 1,
          success: 1
        }[indicator.level];
        
        return value * severityWeight;
      });

    const totalWeight = indicators.length * 3; // Max weight per indicator
    const weightedSum = scores.reduce((sum, score) => sum + score, 0);
    
    return Math.round((weightedSum / totalWeight) * 100);
  }

  /**
   * Get critical issues that need immediate attention
   */
  getCriticalIssues(): SmartIndicator[] {
    return Array.from(this.indicators.values())
      .filter(indicator => indicator.level === 'critical')
      .sort((a, b) => {
        // Sort by timestamp (newest first)
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  /**
   * Get actionable suggestions
   */
  getActionableSuggestions(): SmartIndicator[] {
    return Array.from(this.indicators.values())
      .filter(indicator => indicator.actionable && indicator.suggestion)
      .slice(0, 10); // Limit to top 10 suggestions
  }

  /**
   * Get indicators by category
   */
  getIndicatorsByCategory(category: string): SmartIndicator[] {
    return Array.from(this.indicators.values())
      .filter(indicator => indicator.category === category);
  }

  /**
   * Get trending indicators (showing improvement or degradation)
   */
  getTrendingIndicators(): SmartIndicator[] {
    return Array.from(this.indicators.values())
      .filter(indicator => indicator.trend && indicator.trend !== 'stable')
      .sort((a, b) => {
        // Prioritize degrading trends
        if (a.trend === 'down' && b.trend === 'up') return -1;
        if (a.trend === 'up' && b.trend === 'down') return 1;
        return 0;
      });
  }

  /**
   * Subscribe to indicator updates
   */
  subscribe(callback: (indicators: SmartIndicator[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Send current indicators immediately
    callback(Array.from(this.indicators.values()));
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Force refresh all indicators
   */
  async refresh(): Promise<void> {
    await this.runFullAnalysis();
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SmartIndicatorsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update engines with new thresholds
    if (newConfig.thresholds) {
      this.healthEngine.updateThresholds(newConfig.thresholds.health || this.config.thresholds.health);
      this.performanceMetrics.updateThresholds(newConfig.thresholds.performance || this.config.thresholds.performance);
      this.securityScanner.updateThresholds(newConfig.thresholds.security || this.config.thresholds.security);
    }

    // Update visual preferences
    if (newConfig.visualPreferences) {
      this.visualIndicators.updatePreferences(newConfig.visualPreferences);
    }

    // Restart real-time updates if interval changed
    if (newConfig.refreshInterval || newConfig.enableRealTimeUpdates !== undefined) {
      this.stopRealTimeUpdates();
      if (this.config.enableRealTimeUpdates) {
        this.startRealTimeUpdates();
      }
    }
  }

  /**
   * Get visual configuration for an indicator
   */
  getVisualConfig(indicator: SmartIndicator): any {
    return this.visualIndicators.getIndicatorVisuals(indicator);
  }

  /**
   * Export indicators for external use
   */
  exportIndicators(): {
    timestamp: Date;
    overallHealth: number;
    indicators: SmartIndicator[];
    summary: {
      total: number;
      critical: number;
      warnings: number;
      actionable: number;
    };
  } {
    const indicators = Array.from(this.indicators.values());
    
    return {
      timestamp: new Date(),
      overallHealth: this.getOverallHealthScore(),
      indicators,
      summary: {
        total: indicators.length,
        critical: indicators.filter(i => i.level === 'critical').length,
        warnings: indicators.filter(i => i.level === 'warning').length,
        actionable: indicators.filter(i => i.actionable).length
      }
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopRealTimeUpdates();
    this.subscribers.clear();
    this.indicators.clear();
  }

  private startRealTimeUpdates(): void {
    this.refreshTimer = setInterval(() => {
      this.runFullAnalysis().catch(error => {
        console.error('Real-time update failed:', error);
      });
    }, this.config.refreshInterval);
  }

  private stopRealTimeUpdates(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  private notifySubscribers(): void {
    const indicators = Array.from(this.indicators.values());
    this.subscribers.forEach(callback => {
      try {
        callback(indicators);
      } catch (error) {
        console.error('Subscriber callback failed:', error);
      }
    });
  }
}

// Export singleton instance
export const smartIndicators = new SmartIndicatorsEngine();

// Export types and utilities
export * from './health-indicators';
export * from './connection-analyzer';
export * from './performance-metrics';
export * from './security-scanner';
export * from './ai-suggestions';
export * from './visual-indicators';