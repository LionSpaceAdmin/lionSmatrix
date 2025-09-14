/**
 * Recommendation Engine - מנוע המלצות מתקדם
 * מייצר המלצות מותאמות אישית לשיפור פלטפורמת Lions of Zion
 */

import { AnalyticsConfig, RecommendationResult, SuggestedAction, ProjectHealthMetrics, TrendAnalysisResult, PatternDetectionResult, PerformanceMetrics, SecurityAssessment, TeamMetrics, TechnicalDebtMetrics } from './index';

export interface RecommendationContext {
  projectHealth: ProjectHealthMetrics;
  trends: TrendAnalysisResult;
  patterns: PatternDetectionResult;
  performance: PerformanceMetrics;
  security: SecurityAssessment;
  team: TeamMetrics;
  technicalDebt: TechnicalDebtMetrics;
}

export interface RecommendationRule {
  id: string;
  name: string;
  category: 'refactoring' | 'performance' | 'security' | 'architecture' | 'best_practice';
  priority: 'critical' | 'high' | 'medium' | 'low';
  condition: (context: RecommendationContext) => boolean;
  generateRecommendation: (context: RecommendationContext) => Partial<RecommendationResult>;
  weight: number; // משקל חשיבות
}

export interface RecommendationTemplate {
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  actions: SuggestedAction[];
  relatedFiles?: string[];
  automatable?: boolean;
  confidence?: number;
}

export class RecommendationEngine {
  private config: AnalyticsConfig;
  private rules: RecommendationRule[] = [];
  private templates: Map<string, RecommendationTemplate> = new Map();

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.initializeRules();
    this.initializeTemplates();
  }

  /**
   * יצירת המלצות מותאמות אישית
   */
  public async generateRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    console.log('🎯 יוצר המלצות מותאמות אישית...');

    try {
      const recommendations: RecommendationResult[] = [];

      // יישום כל החוקים
      for (const rule of this.rules) {
        if (rule.condition(context)) {
          const recommendation = await this.applyRule(rule, context);
          if (recommendation) {
            recommendations.push(recommendation);
          }
        }
      }

      // המלצות מבוססות דפוסים
      const patternRecommendations = await this.generatePatternBasedRecommendations(context);
      recommendations.push(...patternRecommendations);

      // המלצות מבוססות מגמות
      const trendRecommendations = await this.generateTrendBasedRecommendations(context);
      recommendations.push(...trendRecommendations);

      // סינון וסידור לפי עדיפות
      const filteredRecommendations = this.filterAndPrioritize(recommendations);

      console.log(`✅ נוצרו ${filteredRecommendations.length} המלצות מותאמות`);
      this.logRecommendationsSummary(filteredRecommendations);

      return filteredRecommendations;

    } catch (error) {
      console.error('❌ שגיאה ביצירת המלצות:', error);
      return [];
    }
  }

  /**
   * יישום חוקה ויצירת המלצה
   */
  private async applyRule(rule: RecommendationRule, context: RecommendationContext): Promise<RecommendationResult | null> {
    try {
      const baseRecommendation = rule.generateRecommendation(context);
      const template = this.templates.get(rule.id);

      const recommendation: RecommendationResult = {
        id: rule.id,
        type: rule.category,
        priority: rule.priority,
        title: baseRecommendation.title || template?.title || rule.name,
        description: baseRecommendation.description || template?.description || 'לא זמין תיאור',
        impact: baseRecommendation.impact || template?.impact || 'שיפור כללי',
        effort: baseRecommendation.effort || template?.effort || 'medium',
        automatable: baseRecommendation.automatable ?? template?.automatable ?? false,
        aiGenerated: false,
        confidence: baseRecommendation.confidence || template?.confidence || rule.weight,
        relatedFiles: baseRecommendation.relatedFiles || template?.relatedFiles || [],
        suggestedActions: this.generateSuggestedActions(rule, context, template)
      };

      return recommendation;

    } catch (error) {
      console.warn(`⚠️ שגיאה ביישום חוקה ${rule.id}:`, error);
      return null;
    }
  }

  /**
   * אתחול חוקי המלצות
   */
  private initializeRules(): void {
    this.rules = [
      // חוקי ביצועים
      {
        id: 'improve_bundle_size',
        name: 'שיפור גודל Bundle',
        category: 'performance',
        priority: 'high',
        condition: (context) => context.performance.bundleSize.total > 5000000, // 5MB
        generateRecommendation: (context) => ({
          title: 'צמצום גודל Bundle',
          description: `גודל ה-Bundle הנוכחי (${Math.round(context.performance.bundleSize.total / 1000000)}MB) גבוה מדי`,
          impact: 'שיפור זמני טעינה ב-30-50%',
          effort: 'medium'
        }),
        weight: 0.8
      },
      {
        id: 'optimize_load_time',
        name: 'אופטימיזציה זמני טעינה',
        category: 'performance',
        priority: 'critical',
        condition: (context) => context.performance.loadTime.average > 3000,
        generateRecommendation: (context) => ({
          title: 'שיפור זמני טעינה',
          description: `זמן טעינה ממוצע של ${context.performance.loadTime.average}ms גבוה מדי`,
          impact: 'שיפור משמעותי בחוויית משתמש',
          effort: 'high'
        }),
        weight: 0.9
      },

      // חוקי איכות קוד
      {
        id: 'improve_code_quality',
        name: 'שיפור איכות קוד',
        category: 'refactoring',
        priority: 'medium',
        condition: (context) => context.projectHealth.codeQuality < 70,
        generateRecommendation: (context) => ({
          title: 'שיפור איכות קוד',
          description: `ציון איכות קוד נוכחי: ${context.projectHealth.codeQuality}/100`,
          impact: 'הפחתת bugs ושיפור תחזוקה',
          effort: 'medium'
        }),
        weight: 0.7
      },
      {
        id: 'increase_test_coverage',
        name: 'הגדלת כיסוי בדיקות',
        category: 'best_practice',
        priority: 'high',
        condition: (context) => context.projectHealth.testCoverage < 80,
        generateRecommendation: (context) => ({
          title: 'הגדלת כיסוי בדיקות',
          description: `כיסוי בדיקות נוכחי: ${context.projectHealth.testCoverage}%`,
          impact: 'הפחתת bugs ושיפור יציבות',
          effort: 'high'
        }),
        weight: 0.8
      },

      // חוקי אבטחה
      {
        id: 'fix_security_vulnerabilities',
        name: 'תיקון פרצות אבטחה',
        category: 'security',
        priority: 'critical',
        condition: (context) => context.security.vulnerabilities.length > 0,
        generateRecommendation: (context) => ({
          title: 'תיקון פרצות אבטחה',
          description: `נמצאו ${context.security.vulnerabilities.length} פרצות אבטחה`,
          impact: 'הגנה על נתונים רגישים',
          effort: 'high',
          confidence: 0.9
        }),
        weight: 1.0
      },
      {
        id: 'improve_security_posture',
        name: 'שיפור יציבות אבטחה',
        category: 'security',
        priority: 'medium',
        condition: (context) => context.security.overallRiskScore > 6,
        generateRecommendation: (context) => ({
          title: 'שיפור יציבות אבטחה',
          description: `ציון סיכון אבטחה: ${context.security.overallRiskScore}/10`,
          impact: 'הפחתת סיכוני אבטחה',
          effort: 'medium'
        }),
        weight: 0.8
      },

      // חוקי ארכיטקטורה
      {
        id: 'reduce_technical_debt',
        name: 'צמצום חוב טכני',
        category: 'refactoring',
        priority: 'medium',
        condition: (context) => context.technicalDebt.overallDebtScore > 30,
        generateRecommendation: (context) => ({
          title: 'צמצום חוב טכני',
          description: `ציון חוב טכני: ${context.technicalDebt.overallDebtScore}/100`,
          impact: `שיפור מהירות פיתוח ב-${context.technicalDebt.velocityImpact}%`,
          effort: 'high'
        }),
        weight: 0.7
      },
      {
        id: 'improve_maintainability',
        name: 'שיפור יכולת תחזוקה',
        category: 'architecture',
        priority: 'medium',
        condition: (context) => context.projectHealth.maintainability < 70,
        generateRecommendation: (context) => ({
          title: 'שיפור יכולת תחזוקה',
          description: `ציון תחזוקה נוכחי: ${context.projectHealth.maintainability}/100`,
          impact: 'הפחתת זמן פיתוח תכונות חדשות',
          effort: 'medium'
        }),
        weight: 0.6
      },

      // חוקי צוות
      {
        id: 'improve_team_productivity',
        name: 'שיפור פרודוקטיביות צוות',
        category: 'best_practice',
        priority: 'medium',
        condition: (context) => context.team.productivity.score < 70,
        generateRecommendation: (context) => ({
          title: 'שיפור פרודוקטיביות צוות',
          description: `ציון פרודוקטיביות: ${context.team.productivity.score}/100`,
          impact: 'זירוז תהליכי פיתוח',
          effort: 'medium'
        }),
        weight: 0.6
      },

      // חוקי מגמות
      {
        id: 'address_declining_performance',
        name: 'טיפול בירידת ביצועים',
        category: 'performance',
        priority: 'high',
        condition: (context) => context.trends.performanceTrend.trend === 'decreasing',
        generateRecommendation: (context) => ({
          title: 'עצירת ירידת ביצועים',
          description: 'ביצועי המערכת מציגים מגמת ירידה',
          impact: 'מניעת הרעה נוספת בחוויית משתמש',
          effort: 'high'
        }),
        weight: 0.9
      }
    ];
  }

  /**
   * אתחול תבניות המלצות
   */
  private initializeTemplates(): void {
    const templates = [
      {
        id: 'improve_bundle_size',
        template: {
          title: 'צמצום גודל Bundle',
          description: 'גודל ה-Bundle גבוה מדי ופוגע בזמני הטעינה',
          impact: 'שיפור זמני טעינה ב-30-50%',
          effort: 'medium' as const,
          actions: [
            { action: 'הפעלת Tree Shaking', description: 'הסר קוד לא בשימוש מה-bundle' },
            { action: 'Code Splitting', description: 'פצל את הקוד למספר chunks קטנים' },
            { action: 'Dynamic Imports', description: 'השתמש ב-lazy loading לרכיבים כבדים' },
            { action: 'אנליזת Bundle', description: 'השתמש ב-webpack-bundle-analyzer לזיהוי בעיות' }
          ],
          automatable: true,
          confidence: 0.8
        }
      },
      {
        id: 'increase_test_coverage',
        template: {
          title: 'הגדלת כיסוי בדיקות',
          description: 'כיסוי הבדיקות נמוך מהמומלץ (80%)',
          impact: 'הפחתת bugs ב-40-60%',
          effort: 'high' as const,
          actions: [
            { action: 'בדיקות יחידה', description: 'כתוב בדיקות לפונקציות קריטיות' },
            { action: 'בדיקות אינטגרציה', description: 'בדוק תהליכים מקצה לקצה' },
            { action: 'בדיקות רכיבים', description: 'השתמש ב-React Testing Library' },
            { action: 'בדיקות E2E', description: 'הוסף בדיקות Playwright לתרחישים קריטיים' }
          ],
          confidence: 0.9
        }
      }
    ];

    templates.forEach(t => this.templates.set(t.id, t.template));
  }

  /**
   * המלצות מבוססות דפוסים
   */
  private async generatePatternBasedRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = [];

    // המלצות על בסיס anti-patterns
    for (const antiPattern of context.patterns.antiPatterns) {
      recommendations.push({
        id: `fix_antipattern_${antiPattern.name.toLowerCase().replace(/\s+/g, '_')}`,
        type: 'refactoring',
        priority: antiPattern.severity === 'critical' ? 'critical' : 'high',
        title: `תיקון ${antiPattern.name}`,
        description: antiPattern.description,
        impact: 'שיפור איכות קוד ותחזוקה',
        effort: antiPattern.severity === 'critical' ? 'high' : 'medium',
        automatable: false,
        aiGenerated: false,
        confidence: 0.8,
        relatedFiles: [antiPattern.location],
        suggestedActions: [
          { action: 'רפקטורינג', description: antiPattern.suggestion }
        ]
      });
    }

    // המלצות על בסיס code smells
    const criticalSmells = context.patterns.codeSmells.filter(s => s.severity === 'high' || s.severity === 'critical');
    if (criticalSmells.length > 0) {
      recommendations.push({
        id: 'fix_critical_code_smells',
        type: 'refactoring',
        priority: 'high',
        title: 'תיקון Code Smells קריטיים',
        description: `נמצאו ${criticalSmells.length} ריחות קוד קריטיים`,
        impact: 'שיפור קריאות ותחזוקת הקוד',
        effort: 'medium',
        automatable: criticalSmells.some(s => s.type.includes('magic') || s.type.includes('duplicate')),
        aiGenerated: false,
        confidence: 0.7,
        relatedFiles: criticalSmells.map(s => s.location),
        suggestedActions: criticalSmells.map(s => ({
          action: `תיקון ${s.type}`,
          description: s.suggestion
        }))
      });
    }

    return recommendations;
  }

  /**
   * המלצות מבוססות מגמות
   */
  private async generateTrendBasedRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = [];

    // המלצות על בסיס מגמת איכות קוד
    if (context.trends.codeQualityTrend.trend === 'decreasing') {
      recommendations.push({
        id: 'reverse_quality_decline',
        type: 'best_practice',
        priority: 'high',
        title: 'עצירת ירידה באיכות קוד',
        description: 'איכות הקוד מציגה מגמת ירידה מתמשכת',
        impact: 'מניעת הרעה נוספת באיכות',
        effort: 'high',
        automatable: false,
        aiGenerated: false,
        confidence: 0.8,
        relatedFiles: [],
        suggestedActions: [
          { action: 'Code Review מחמיר יותר', description: 'הגדל את רף הדרישות ב-PR reviews' },
          { action: 'Linting חזק יותר', description: 'הוסף חוקי ESLint ו-TypeScript מחמירים' },
          { action: 'בדיקות איכות אוטומטיות', description: 'הוסף בדיקות איכות לCI/CD' }
        ]
      });
    }

    // המלצות על בסיס מגמת ביצועים
    if (context.trends.performanceTrend.degradationRisk > 60) {
      recommendations.push({
        id: 'prevent_performance_degradation',
        type: 'performance',
        priority: 'critical',
        title: 'מניעת ירידת ביצועים',
        description: `סיכון ירידת ביצועים: ${context.trends.performanceTrend.degradationRisk}%`,
        impact: 'מניעת פגיעה קריטית בחוויית משתמש',
        effort: 'high',
        automatable: false,
        aiGenerated: false,
        confidence: 0.9,
        relatedFiles: [],
        suggestedActions: [
          { action: 'ניטור ביצועים מתמיד', description: 'הוסף מדדי ביצועים לדשבורד' },
          { action: 'בדיקות ביצועים אוטומטיות', description: 'הוסף performance tests ל-CI' },
          { action: 'אופטימיזציה מידית', description: 'טפל בבעיות ביצועים מידיות' }
        ]
      });
    }

    return recommendations;
  }

  /**
   * יצירת פעולות מוצעות
   */
  private generateSuggestedActions(rule: RecommendationRule, context: RecommendationContext, template?: RecommendationTemplate): SuggestedAction[] {
    const actions: SuggestedAction[] = [];

    // פעולות מהתבנית
    if (template?.actions) {
      actions.push(...template.actions);
    }

    // פעולות ספציפיות לפי קטגוריה
    switch (rule.category) {
      case 'performance':
        actions.push(
          { action: 'מדידת ביצועים', description: 'מדוד ביצועים לפני ואחרי השיפור' },
          { action: 'אמות מידה', description: 'קבע יעדי ביצועים ברורים' }
        );
        break;
      case 'security':
        actions.push(
          { action: 'סריקת אבטחה', description: 'בצע סריקה מקיפה נוספת' },
          { action: 'עדכון תלויות', description: 'עדכן כל התלויות לגרסאות בטוחות' }
        );
        break;
      case 'refactoring':
        actions.push(
          { action: 'בדיקות רגרסיה', description: 'וודא שהרפקטורינג לא פוגע בפונקציונליות' },
          { action: 'רפקטורינג מדורג', description: 'בצע את השינויים בשלבים קטנים' }
        );
        break;
    }

    return actions;
  }

  /**
   * סינון וסידור לפי עדיפות
   */
  private filterAndPrioritize(recommendations: RecommendationResult[]): RecommendationResult[] {
    // הסרת כפילויות
    const uniqueRecommendations = this.removeDuplicates(recommendations);

    // סינון לפי רמת ביטחון
    const highConfidenceRecommendations = uniqueRecommendations.filter(r => r.confidence >= 0.6);

    // סידור לפי עדיפות ובטחון
    return highConfidenceRecommendations.sort((a, b) => {
      const priorityA = this.getPriorityWeight(a.priority);
      const priorityB = this.getPriorityWeight(b.priority);
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // עדיפות גבוהה יותר קודם
      }
      
      return b.confidence - a.confidence; // ביטחון גבוה יותר קודם
    });
  }

  /**
   * הסרת המלצות כפולות
   */
  private removeDuplicates(recommendations: RecommendationResult[]): RecommendationResult[] {
    const seen = new Set<string>();
    return recommendations.filter(recommendation => {
      const key = `${recommendation.type}_${recommendation.title}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * משקל עדיפות
   */
  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  /**
   * לוג סיכום המלצות
   */
  private logRecommendationsSummary(recommendations: RecommendationResult[]): void {
    const summary = {
      critical: recommendations.filter(r => r.priority === 'critical').length,
      high: recommendations.filter(r => r.priority === 'high').length,
      medium: recommendations.filter(r => r.priority === 'medium').length,
      low: recommendations.filter(r => r.priority === 'low').length,
      automatable: recommendations.filter(r => r.automatable).length
    };

    console.log('📋 סיכום המלצות:');
    console.log(`   🔴 קריטי: ${summary.critical}`);
    console.log(`   🟠 גבוה: ${summary.high}`);
    console.log(`   🟡 בינוני: ${summary.medium}`);
    console.log(`   🟢 נמוך: ${summary.low}`);
    console.log(`   🤖 אוטומטי: ${summary.automatable}`);
  }
}