/**
 * Visual Indicators System
 * Advanced visual representations and UI components for smart indicators
 */

import { SmartIndicator, IndicatorLevel } from './index';

interface VisualPreferences {
  enableAnimations: boolean;
  colorScheme: 'dark' | 'light' | 'auto';
  compactMode: boolean;
}

interface IndicatorTheme {
  colors: {
    critical: string;
    warning: string;
    info: string;
    success: string;
    background: string;
    text: string;
    border: string;
  };
  gradients: {
    critical: string;
    warning: string;
    info: string;
    success: string;
  };
  shadows: {
    subtle: string;
    glow: string;
  };
}

interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  repeat?: boolean;
}

interface VisualComponent {
  id: string;
  type: 'card' | 'badge' | 'chart' | 'progress' | 'alert' | 'tooltip';
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    background: string;
    color: string;
    border: string;
    borderRadius: string;
    shadow: string;
    animation?: string;
  };
  content: {
    title: string;
    value: string;
    description: string;
    icon: string;
    trend?: 'up' | 'down' | 'stable';
  };
  interactions: {
    hover: boolean;
    click: boolean;
    tooltip: string;
  };
}

interface HealthVisualization {
  overall: {
    score: number;
    color: string;
    animation: string;
    components: string[];
  };
  categories: {
    [key: string]: {
      score: number;
      issues: number;
      trend: 'up' | 'down' | 'stable';
      visualization: 'radial' | 'linear' | 'dots';
    };
  };
}

interface NetworkVisualization {
  nodes: {
    id: string;
    type: 'file' | 'component' | 'service' | 'issue';
    health: number;
    connections: string[];
    position: { x: number; y: number };
    visual: {
      size: number;
      color: string;
      pulse: boolean;
      glow: boolean;
    };
  }[];
  edges: {
    from: string;
    to: string;
    type: 'import' | 'dependency' | 'issue';
    strength: number;
    visual: {
      width: number;
      color: string;
      dashed: boolean;
      animated: boolean;
    };
  }[];
}

export class VisualIndicators {
  private preferences: VisualPreferences;
  private theme: IndicatorTheme;
  private animations: Map<string, AnimationConfig> = new Map();

  constructor(preferences: VisualPreferences) {
    this.preferences = preferences;
    this.theme = this.createTheme(preferences.colorScheme);
    this.initializeAnimations();
  }

  /**
   * Get visual configuration for an indicator
   */
  getIndicatorVisuals(indicator: SmartIndicator): VisualComponent {
    const baseStyle = this.getBaseStyle(indicator.level);
    const animation = this.preferences.enableAnimations ? this.getAnimation(indicator) : undefined;

    return {
      id: indicator.id,
      type: this.getComponentType(indicator),
      position: { x: 0, y: 0 }, // Will be set by layout engine
      size: this.getComponentSize(indicator),
      style: {
        background: baseStyle.background,
        color: baseStyle.color,
        border: baseStyle.border,
        borderRadius: this.preferences.compactMode ? '4px' : '8px',
        shadow: baseStyle.shadow,
        animation
      },
      content: {
        title: indicator.title,
        value: this.formatValue(indicator.value, indicator.unit),
        description: indicator.description,
        icon: indicator.visualConfig?.icon || this.getDefaultIcon(indicator.type),
        trend: indicator.trend
      },
      interactions: {
        hover: true,
        click: indicator.actionable,
        tooltip: this.createTooltip(indicator)
      }
    };
  }

  /**
   * Generate health visualization components
   */
  generateHealthVisualization(indicators: SmartIndicator[]): HealthVisualization {
    const overallScore = this.calculateOverallHealthScore(indicators);
    const categories = this.categorizeIndicators(indicators);

    return {
      overall: {
        score: overallScore,
        color: this.getScoreColor(overallScore),
        animation: this.getHealthAnimation(overallScore),
        components: Object.keys(categories)
      },
      categories: Object.entries(categories).reduce((acc, [category, categoryIndicators]) => {
        const categoryScore = this.calculateCategoryScore(categoryIndicators);
        const issues = categoryIndicators.filter(i => i.level === IndicatorLevel.CRITICAL || i.level === IndicatorLevel.WARNING).length;
        const trend = this.calculateTrend(categoryIndicators);

        acc[category] = {
          score: categoryScore,
          issues,
          trend,
          visualization: this.getVisualizationType(category, categoryIndicators.length)
        };

        return acc;
      }, {} as HealthVisualization['categories'])
    };
  }

  /**
   * Generate network topology visualization
   */
  generateNetworkVisualization(indicators: SmartIndicator[]): NetworkVisualization {
    const nodes: NetworkVisualization['nodes'] = [];
    const edges: NetworkVisualization['edges'] = [];

    // Create nodes for different types of indicators
    const fileNodes = this.createFileNodes(indicators);
    const issueNodes = this.createIssueNodes(indicators);
    const componentNodes = this.createComponentNodes(indicators);

    nodes.push(...fileNodes, ...issueNodes, ...componentNodes);

    // Create edges for connections
    const connectionEdges = this.createConnectionEdges(indicators, nodes);
    const issueEdges = this.createIssueEdges(indicators, nodes);

    edges.push(...connectionEdges, ...issueEdges);

    return { nodes, edges };
  }

  /**
   * Create real-time animation effects
   */
  createRealtimeAnimation(indicator: SmartIndicator): string {
    const animations: { [key: string]: string } = {
      pulse: `
        @keyframes pulse-${indicator.level} {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        animation: pulse-${indicator.level} 2s ease-in-out infinite;
      `,
      glow: `
        @keyframes glow-${indicator.level} {
          0%, 100% { box-shadow: 0 0 5px ${this.theme.colors[indicator.level]}; }
          50% { box-shadow: 0 0 20px ${this.theme.colors[indicator.level]}; }
        }
        animation: glow-${indicator.level} 3s ease-in-out infinite;
      `,
      bounce: `
        @keyframes bounce-${indicator.level} {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        animation: bounce-${indicator.level} 2s infinite;
      `,
      fadeIn: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        animation: fadeIn 0.5s ease-out;
      `
    };

    const animationType = indicator.visualConfig?.animation || 'fadeIn';
    return animations[animationType] || animations.fadeIn;
  }

  /**
   * Generate CSS for indicator styling
   */
  generateCSS(indicators: SmartIndicator[]): string {
    let css = this.generateBaseCSS();

    // Add theme-specific styles
    css += this.generateThemeCSS();

    // Add animation keyframes
    if (this.preferences.enableAnimations) {
      css += this.generateAnimationCSS(indicators);
    }

    // Add responsive styles
    css += this.generateResponsiveCSS();

    return css;
  }

  /**
   * Create interactive tooltip content
   */
  createTooltip(indicator: SmartIndicator): string {
    const parts = [
      `<div class="tooltip-header">`,
      `<span class="tooltip-icon">${indicator.visualConfig?.icon || '📊'}</span>`,
      `<span class="tooltip-title">${indicator.title}</span>`,
      `</div>`,
      `<div class="tooltip-content">`,
      `<p class="tooltip-description">${indicator.description}</p>`,
      `<div class="tooltip-meta">`,
      `<span class="tooltip-value">${this.formatValue(indicator.value, indicator.unit)}</span>`,
      indicator.trend ? `<span class="tooltip-trend tooltip-trend-${indicator.trend}">
        ${indicator.trend === 'up' ? '↗️' : indicator.trend === 'down' ? '↘️' : '→'}
      </span>` : '',
      `</div>`,
      indicator.suggestion ? `<div class="tooltip-suggestion">
        <strong>💡 Suggestion:</strong> ${indicator.suggestion}
      </div>` : '',
      `<div class="tooltip-footer">`,
      `<span class="tooltip-category">${indicator.category}</span>`,
      `<span class="tooltip-timestamp">${this.formatTimestamp(indicator.timestamp)}</span>`,
      `</div>`,
      `</div>`
    ];

    return parts.filter(Boolean).join('');
  }

  /**
   * Generate indicator card component
   */
  generateIndicatorCard(indicator: SmartIndicator): string {
    const visual = this.getIndicatorVisuals(indicator);
    const animation = this.preferences.enableAnimations ? visual.style.animation : '';

    return `
      <div 
        id="indicator-${indicator.id}"
        class="indicator-card indicator-${indicator.level} ${this.preferences.compactMode ? 'compact' : ''}"
        style="
          background: ${visual.style.background};
          color: ${visual.style.color};
          border: ${visual.style.border};
          border-radius: ${visual.style.borderRadius};
          box-shadow: ${visual.style.shadow};
          ${animation}
        "
        data-tooltip="${this.escapeHtml(visual.interactions.tooltip)}"
        data-actionable="${indicator.actionable}"
      >
        <div class="indicator-header">
          <span class="indicator-icon">${visual.content.icon}</span>
          <span class="indicator-title">${visual.content.title}</span>
          ${visual.content.trend ? `<span class="indicator-trend indicator-trend-${visual.content.trend}">
            ${visual.content.trend === 'up' ? '↗️' : visual.content.trend === 'down' ? '↘️' : '→'}
          </span>` : ''}
        </div>
        <div class="indicator-value">${visual.content.value}</div>
        <div class="indicator-description">${visual.content.description}</div>
        ${indicator.actionable ? `<div class="indicator-actions">
          <button class="indicator-action-btn" onclick="handleIndicatorAction('${indicator.id}')">
            Take Action
          </button>
        </div>` : ''}
      </div>
    `;
  }

  /**
   * Generate dashboard layout with indicators
   */
  generateDashboard(indicators: SmartIndicator[]): string {
    const healthViz = this.generateHealthVisualization(indicators);
    const criticalIndicators = indicators.filter(i => i.level === IndicatorLevel.CRITICAL);
    const warningIndicators = indicators.filter(i => i.level === IndicatorLevel.WARNING);
    const suggestions = indicators.filter(i => i.type === 'suggestion');

    return `
      <div class="smart-indicators-dashboard ${this.preferences.colorScheme}-theme">
        <!-- Overall Health Section -->
        <div class="dashboard-section health-overview">
          <h2>System Health Overview</h2>
          <div class="health-score" style="color: ${healthViz.overall.color}">
            <div class="health-score-value">${healthViz.overall.score}</div>
            <div class="health-score-label">Overall Health Score</div>
          </div>
          <div class="health-categories">
            ${Object.entries(healthViz.categories).map(([category, data]) => `
              <div class="health-category">
                <span class="category-name">${category}</span>
                <div class="category-score" style="color: ${this.getScoreColor(data.score)}">
                  ${data.score}%
                </div>
                ${data.issues > 0 ? `<span class="category-issues">${data.issues} issues</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Critical Issues Section -->
        ${criticalIndicators.length > 0 ? `
        <div class="dashboard-section critical-issues">
          <h2>🚨 Critical Issues (${criticalIndicators.length})</h2>
          <div class="indicators-grid">
            ${criticalIndicators.map(indicator => this.generateIndicatorCard(indicator)).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Warnings Section -->
        ${warningIndicators.length > 0 ? `
        <div class="dashboard-section warnings">
          <h2>⚠️ Warnings (${warningIndicators.length})</h2>
          <div class="indicators-grid">
            ${warningIndicators.slice(0, 6).map(indicator => this.generateIndicatorCard(indicator)).join('')}
          </div>
        </div>
        ` : ''}

        <!-- AI Suggestions Section -->
        ${suggestions.length > 0 ? `
        <div class="dashboard-section suggestions">
          <h2>💡 AI Recommendations (${suggestions.length})</h2>
          <div class="suggestions-list">
            ${suggestions.slice(0, 5).map(suggestion => this.generateIndicatorCard(suggestion)).join('')}
          </div>
        </div>
        ` : ''}

        <!-- All Indicators Section -->
        <div class="dashboard-section all-indicators">
          <h2>All Indicators (${indicators.length})</h2>
          <div class="indicators-grid">
            ${indicators.slice(0, 20).map(indicator => this.generateIndicatorCard(indicator)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Private helper methods

  private createTheme(colorScheme: 'dark' | 'light' | 'auto'): IndicatorTheme {
    const isDark = colorScheme === 'dark' || (colorScheme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return {
      colors: {
        critical: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        success: '#10b981',
        background: isDark ? '#1f2937' : '#ffffff',
        text: isDark ? '#f9fafb' : '#111827',
        border: isDark ? '#374151' : '#e5e7eb'
      },
      gradients: {
        critical: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        warning: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
        info: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        success: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
      },
      shadows: {
        subtle: isDark ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        glow: '0 0 20px rgba(59, 130, 246, 0.4)'
      }
    };
  }

  private initializeAnimations(): void {
    this.animations.set('pulse', {
      duration: 2000,
      easing: 'ease-in-out',
      repeat: true
    });

    this.animations.set('glow', {
      duration: 3000,
      easing: 'ease-in-out',
      repeat: true
    });

    this.animations.set('bounce', {
      duration: 2000,
      easing: 'ease-in-out',
      repeat: true
    });

    this.animations.set('fadeIn', {
      duration: 500,
      easing: 'ease-out',
      repeat: false
    });
  }

  private getBaseStyle(level: SmartIndicator['level']): { background: string; color: string; border: string; shadow: string } {
    const isDark = this.preferences.colorScheme === 'dark';
    
    return {
      background: isDark ? this.theme.colors.background : this.theme.gradients[level],
      color: isDark ? this.theme.colors.text : this.theme.colors.text,
      border: `1px solid ${this.theme.colors[level]}`,
      shadow: level === IndicatorLevel.CRITICAL ? this.theme.shadows.glow : this.theme.shadows.subtle
    };
  }

  private getAnimation(indicator: SmartIndicator): string {
    if (!this.preferences.enableAnimations) return '';
    
    const animationType = indicator.visualConfig?.animation;
    if (!animationType) return 'fadeIn 0.5s ease-out';

    const config = this.animations.get(animationType);
    if (!config) return '';

    return `${animationType} ${config.duration}ms ${config.easing} ${config.repeat ? 'infinite' : ''}`;
  }

  private getComponentType(indicator: SmartIndicator): VisualComponent['type'] {
    if (indicator.level === IndicatorLevel.CRITICAL) return 'alert';
    if (indicator.type === 'suggestion') return 'card';
    if (typeof indicator.value === 'number' && indicator.unit === '%') return 'progress';
    return 'card';
  }

  private getComponentSize(indicator: SmartIndicator): { width: number; height: number } {
    if (this.preferences.compactMode) {
      return { width: 200, height: 80 };
    }
    
    return indicator.level === IndicatorLevel.CRITICAL ? { width: 300, height: 120 } : { width: 250, height: 100 };
  }

  private formatValue(value: number | string, unit?: string): string {
    if (typeof value === 'number') {
      if (unit === '%') {
        return `${Math.round(value)}%`;
      }
      if (unit === 'MB' || unit === 'KB') {
        return `${value}${unit}`;
      }
      if (unit === 'ms') {
        return `${value}ms`;
      }
      return value.toString();
    }
    return value;
  }

  private getDefaultIcon(type: SmartIndicator['type']): string {
    const icons = {
      health: '❤️',
      connection: '🔗',
      performance: '⚡',
      security: '🛡️',
      suggestion: '💡'
    };
    return icons[type] || '📊';
  }

  private calculateOverallHealthScore(indicators: SmartIndicator[]): number {
    if (indicators.length === 0) return 0;
    
    const criticalCount = indicators.filter(i => i.level === IndicatorLevel.CRITICAL).length;
    const warningCount = indicators.filter(i => i.level === IndicatorLevel.WARNING).length;
    
    let score = 100;
    score -= criticalCount * 20; // 20 points per critical issue
    score -= warningCount * 10;  // 10 points per warning

    return Math.max(0, score);
  }

  private categorizeIndicators(indicators: SmartIndicator[]): { [key: string]: SmartIndicator[] } {
    return indicators.reduce((acc, indicator) => {
      const category = indicator.category || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(indicator);
      return acc;
    }, {} as { [key: string]: SmartIndicator[] });
  }

  private calculateCategoryScore(indicators: SmartIndicator[]): number {
    if (indicators.length === 0) return 100;
    
    const criticalCount = indicators.filter(i => i.level === IndicatorLevel.CRITICAL).length;
    const warningCount = indicators.filter(i => i.level === IndicatorLevel.WARNING).length;
    
    let score = 100;
    score -= criticalCount * 25;
    score -= warningCount * 10;
    
    return Math.max(0, score);
  }

  private calculateTrend(indicators: SmartIndicator[]): 'up' | 'down' | 'stable' {
    const trends = indicators.map(i => i.trend).filter(Boolean);
    if (trends.length === 0) return 'stable';
    
    const upCount = trends.filter(t => t === 'up').length;
    const downCount = trends.filter(t => t === 'down').length;
    
    if (upCount > downCount) return 'up';
    if (downCount > upCount) return 'down';
    return 'stable';
  }

  private getScoreColor(score: number): string {
    if (score >= 90) return this.theme.colors.success;
    if (score >= 70) return this.theme.colors.info;
    if (score >= 50) return this.theme.colors.warning;
    return this.theme.colors.critical;
  }

  private getHealthAnimation(score: number): string {
    if (score < 50) return 'pulse';
    if (score < 70) return 'glow';
    return '';
  }

  private getVisualizationType(category: string, count: number): 'radial' | 'linear' | 'dots' {
    if (count <= 3) return 'dots';
    if (count <= 10) return 'linear';
    return 'radial';
  }

  private createFileNodes(_indicators: SmartIndicator[]): NetworkVisualization['nodes'] {
    // Implementation would create nodes based on file-related indicators
    return [];
  }

  private createIssueNodes(indicators: SmartIndicator[]): NetworkVisualization['nodes'] {
    return indicators
      .filter(i => i.level === IndicatorLevel.CRITICAL || i.level === IndicatorLevel.WARNING)
      .map(indicator => ({
        id: `issue-${indicator.id}`,
        type: 'issue' as const,
        health: indicator.level === IndicatorLevel.CRITICAL ? 10 : 50,
        connections: [],
        position: { x: Math.random() * 800, y: Math.random() * 600 },
        visual: {
          size: indicator.level === IndicatorLevel.CRITICAL ? 15 : 10,
          color: this.theme.colors[indicator.level],
          pulse: indicator.level === IndicatorLevel.CRITICAL,
          glow: indicator.level === IndicatorLevel.CRITICAL
        }
      }));
  }

  private createComponentNodes(_indicators: SmartIndicator[]): NetworkVisualization['nodes'] {
    // Implementation would create nodes based on component-related indicators
    return [];
  }

  private createConnectionEdges(_indicators: SmartIndicator[], _nodes: NetworkVisualization['nodes']): NetworkVisualization['edges'] {
    // Implementation would create edges based on connection indicators
    return [];
  }

  private createIssueEdges(_indicators: SmartIndicator[], _nodes: NetworkVisualization['nodes']): NetworkVisualization['edges'] {
    // Implementation would create edges connecting issues to affected components
    return [];
  }

  private generateBaseCSS(): string {
    return `
      .smart-indicators-dashboard {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        padding: 20px;
        background: ${this.theme.colors.background};
        color: ${this.theme.colors.text};
        min-height: 100vh;
      }

      .dashboard-section {
        margin-bottom: 40px;
      }

      .dashboard-section h2 {
        margin-bottom: 20px;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .indicators-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }

      .indicator-card {
        padding: 16px;
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .indicator-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .indicator-card.compact {
        padding: 12px;
      }

      .indicator-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .indicator-icon {
        font-size: 1.2rem;
        margin-right: 8px;
      }

      .indicator-title {
        font-weight: 500;
        flex-grow: 1;
      }

      .indicator-trend {
        font-size: 0.9rem;
      }

      .indicator-value {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 8px;
      }

      .indicator-description {
        font-size: 0.9rem;
        opacity: 0.8;
        margin-bottom: 12px;
      }

      .indicator-actions {
        display: flex;
        justify-content: flex-end;
      }

      .indicator-action-btn {
        background: ${this.theme.colors.info};
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .indicator-action-btn:hover {
        background: #2563eb;
      }
    `;
  }

  private generateThemeCSS(): string {
    const isDark = this.preferences.colorScheme === 'dark';
    
    return `
      .${this.preferences.colorScheme}-theme {
        --color-critical: ${this.theme.colors.critical};
        --color-warning: ${this.theme.colors.warning};
        --color-info: ${this.theme.colors.info};
        --color-success: ${this.theme.colors.success};
        --color-background: ${this.theme.colors.background};
        --color-text: ${this.theme.colors.text};
        --color-border: ${this.theme.colors.border};
      }

      .health-overview {
        text-align: center;
        margin-bottom: 40px;
      }

      .health-score {
        display: inline-block;
        padding: 20px;
        border-radius: 50%;
        border: 4px solid currentColor;
        margin-bottom: 20px;
      }

      .health-score-value {
        font-size: 3rem;
        font-weight: bold;
      }

      .health-score-label {
        font-size: 0.9rem;
        margin-top: 8px;
      }

      .health-categories {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
      }

      .health-category {
        text-align: center;
        padding: 15px;
        border-radius: 8px;
        background: ${isDark ? '#374151' : '#f9fafb'};
        border: 1px solid ${this.theme.colors.border};
      }

      .category-name {
        display: block;
        font-weight: 500;
        margin-bottom: 8px;
        text-transform: capitalize;
      }

      .category-score {
        font-size: 1.5rem;
        font-weight: bold;
      }

      .category-issues {
        display: block;
        font-size: 0.8rem;
        margin-top: 4px;
        opacity: 0.7;
      }
    `;
  }

  private generateAnimationCSS(indicators: SmartIndicator[]): string {
    const uniqueAnimations = new Set<string>();
    indicators.forEach(indicator => {
      if (indicator.visualConfig?.animation) {
        uniqueAnimations.add(indicator.visualConfig.animation);
      }
    });

    let css = '';
    uniqueAnimations.forEach(animation => {
      css += this.createAnimationKeyframes(animation);
    });

    return css;
  }

  private createAnimationKeyframes(animation: string): string {
    const keyframes = {
      pulse: `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `,
      glow: `
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px currentColor; }
          50% { box-shadow: 0 0 20px currentColor; }
        }
      `,
      bounce: `
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `
    };

    return keyframes[animation as keyof typeof keyframes] || '';
  }

  private generateResponsiveCSS(): string {
    return `
      @media (max-width: 768px) {
        .smart-indicators-dashboard {
          padding: 12px;
        }

        .indicators-grid {
          grid-template-columns: 1fr;
        }

        .health-categories {
          flex-direction: column;
          gap: 15px;
        }

        .indicator-card {
          padding: 12px;
        }

        .indicator-value {
          font-size: 1.5rem;
        }
      }

      @media (max-width: 480px) {
        .dashboard-section h2 {
          font-size: 1.2rem;
        }

        .health-score-value {
          font-size: 2rem;
        }

        .indicator-value {
          font-size: 1.3rem;
        }
      }
    `;
  }

  private formatTimestamp(timestamp: Date): string {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((timestamp.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Update visual preferences
   */
  updatePreferences(preferences: Partial<VisualPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.theme = this.createTheme(this.preferences.colorScheme);
  }

  /**
   * Generate export data for external visualization tools
   */
  exportVisualizationData(indicators: SmartIndicator[]): {
    theme: IndicatorTheme;
    healthVisualization: HealthVisualization;
    networkVisualization: NetworkVisualization;
    indicators: VisualComponent[];
  } {
    return {
      theme: this.theme,
      healthVisualization: this.generateHealthVisualization(indicators),
      networkVisualization: this.generateNetworkVisualization(indicators),
      indicators: indicators.map(indicator => this.getIndicatorVisuals(indicator))
    };
  }
}