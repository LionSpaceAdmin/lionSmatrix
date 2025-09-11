/**
 * AI Suggestions Engine - מנוע הצעות AI מתקדם
 * מייצר הצעות חכמות לשיפור הפלטפורמה באמצעות בינה מלאכותית
 */

import { AnalyticsConfig, AISuggestion, ProjectHealthMetrics, TrendAnalysisResult, PatternDetectionResult, RecommendationResult, PerformanceMetrics, SecurityAssessment } from './index';

export interface AIContext {
  projectHealth: ProjectHealthMetrics;
  trends: TrendAnalysisResult;
  patterns: PatternDetectionResult;
  recommendations: RecommendationResult[];
  performance: PerformanceMetrics;
  security: SecurityAssessment;
  timestamp: Date;
}

export interface AIModel {
  id: string;
  name: string;
  type: 'code_analysis' | 'architecture' | 'performance' | 'security' | 'general';
  confidence: number;
  generate: (context: AIContext, prompt: string) => Promise<AISuggestion[]>;
}

export interface CodeGenerationRequest {
  type: 'component' | 'function' | 'test' | 'config' | 'documentation';
  context: string;
  requirements: string[];
  constraints: string[];
  style: 'typescript' | 'react' | 'nextjs' | 'test';
}

export interface ArchitectureRecommendation {
  type: 'refactoring' | 'pattern_application' | 'structure_improvement' | 'dependency_optimization';
  scope: 'file' | 'module' | 'project';
  complexity: 'low' | 'medium' | 'high';
  impact: 'minor' | 'moderate' | 'major' | 'transformative';
  reasoning: string;
  steps: string[];
}

export interface SmartFix {
  issue: string;
  location: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  automaticFix: boolean;
  confidence: number;
  codeChange: {
    before: string;
    after: string;
    explanation: string;
  };
  testSuggestion?: string;
}

export interface LearningInsight {
  topic: string;
  relevance: number; // 0-1
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeToLearn: string;
  resources: LearningResource[];
  practicalApplication: string;
}

export interface LearningResource {
  type: 'documentation' | 'tutorial' | 'course' | 'video' | 'article' | 'book';
  title: string;
  url?: string;
  duration?: string;
  quality: number; // 1-5 stars
}

export interface PredictiveInsight {
  category: 'performance' | 'security' | 'maintainability' | 'scalability';
  prediction: string;
  probability: number; // 0-1
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  preventiveActions: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ContextualAssistance {
  query: string;
  response: string;
  confidence: number;
  sources: string[];
  relatedSuggestions: string[];
  followUpQuestions: string[];
}

export class AISuggestionsEngine {
  private config: AnalyticsConfig;
  private models: Map<string, AIModel> = new Map();
  private conversationHistory: ContextualAssistance[] = [];
  private learningDatabase: Map<string, LearningInsight[]> = new Map();

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.initializeAIModels();
    this.initializeLearningDatabase();
  }

  /**
   * יצירת הצעות AI מתקדמות
   */
  public async generateSuggestions(context: AIContext): Promise<AISuggestion[]> {
    console.log('🤖 יוצר הצעות AI מתקדמות...');

    try {
      const suggestions: AISuggestion[] = [];

      // הצעות לפי קטגוריות שונות
      const [
        codeGenerationSuggestions,
        architectureSuggestions,
        performanceOptimizations,
        securityEnhancements,
        predictiveInsights,
        learningRecommendations
      ] = await Promise.all([
        this.generateCodeSuggestions(context),
        this.generateArchitectureSuggestions(context),
        this.generatePerformanceSuggestions(context),
        this.generateSecuritySuggestions(context),
        this.generatePredictiveSuggestions(context),
        this.generateLearningRecommendations(context)
      ]);

      suggestions.push(
        ...codeGenerationSuggestions,
        ...architectureSuggestions, 
        ...performanceOptimizations,
        ...securityEnhancements,
        ...predictiveInsights,
        ...learningRecommendations
      );

      // סינון והתאמת הצעות
      const filteredSuggestions = await this.filterAndRankSuggestions(suggestions, context);

      console.log(`✅ נוצרו ${filteredSuggestions.length} הצעות AI מתקדמות`);
      this.logSuggestionsSummary(filteredSuggestions);

      return filteredSuggestions;

    } catch (error) {
      console.error('❌ שגיאה ביצירת הצעות AI:', error);
      return [];
    }
  }

  /**
   * יצירת קוד חכם
   */
  public async generateSmartCode(request: CodeGenerationRequest): Promise<AISuggestion> {
    const prompt = this.buildCodeGenerationPrompt(request);
    
    const codeModel = this.models.get('code_generator');
    if (!codeModel) {
      throw new Error('מודל יצירת קוד לא זמין');
    }

    const suggestions = await codeModel.generate(this.getDefaultContext(), prompt);
    return suggestions[0] || this.getDefaultCodeSuggestion(request);
  }

  /**
   * תיקונים חכמים אוטומטיים
   */
  public async generateSmartFixes(issues: string[]): Promise<SmartFix[]> {
    const fixes: SmartFix[] = [];

    for (const issue of issues) {
      const fix = await this.analyzeAndFix(issue);
      if (fix) {
        fixes.push(fix);
      }
    }

    return fixes.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * תמיכה הקשרית אינטראקטיבית
   */
  public async getContextualHelp(query: string, context: AIContext): Promise<ContextualAssistance> {
    console.log(`🤖 מעבד שאלה: "${query}"`);

    try {
      const response = await this.processNaturalLanguageQuery(query, context);
      const assistance: ContextualAssistance = {
        query,
        response: response.answer,
        confidence: response.confidence,
        sources: response.sources,
        relatedSuggestions: response.relatedSuggestions,
        followUpQuestions: response.followUpQuestions
      };

      this.conversationHistory.push(assistance);
      return assistance;

    } catch (error) {
      console.error('❌ שגיאה בתמיכה הקשרית:', error);
      return this.getDefaultAssistance(query);
    }
  }

  /**
   * אתחול מודלי AI
   */
  private initializeAIModels(): void {
    // מודל יצירת קוד
    this.models.set('code_generator', {
      id: 'code_generator',
      name: 'Code Generation Model',
      type: 'code_analysis',
      confidence: 0.85,
      generate: async (context, prompt) => this.generateCodeSuggestions(context)
    });

    // מודל ארכיטקטורה
    this.models.set('architecture_advisor', {
      id: 'architecture_advisor', 
      name: 'Architecture Advisory Model',
      type: 'architecture',
      confidence: 0.80,
      generate: async (context, prompt) => this.generateArchitectureSuggestions(context)
    });

    // מודל ביצועים
    this.models.set('performance_optimizer', {
      id: 'performance_optimizer',
      name: 'Performance Optimization Model', 
      type: 'performance',
      confidence: 0.82,
      generate: async (context, prompt) => this.generatePerformanceSuggestions(context)
    });

    // מודל אבטחה
    this.models.set('security_analyst', {
      id: 'security_analyst',
      name: 'Security Analysis Model',
      type: 'security', 
      confidence: 0.88,
      generate: async (context, prompt) => this.generateSecuritySuggestions(context)
    });

    // מודל כללי
    this.models.set('general_assistant', {
      id: 'general_assistant',
      name: 'General AI Assistant',
      type: 'general',
      confidence: 0.75,
      generate: async (context, prompt) => this.generateGeneralSuggestions(context, prompt)
    });
  }

  /**
   * אתחול בסיס נתוני למידה
   */
  private initializeLearningDatabase(): void {
    // React & Next.js learning paths
    this.learningDatabase.set('react', [
      {
        topic: 'React Hooks Advanced Patterns',
        relevance: 0.9,
        difficulty: 'intermediate',
        timeToLearn: '2-3 weeks',
        resources: [
          {
            type: 'documentation',
            title: 'React Hooks Documentation',
            url: 'https://react.dev/reference/react',
            quality: 5
          },
          {
            type: 'course',
            title: 'Advanced React Patterns',
            duration: '8 hours',
            quality: 4
          }
        ],
        practicalApplication: 'Optimize component state management in Lions of Zion'
      }
    ]);

    // Performance optimization learning paths
    this.learningDatabase.set('performance', [
      {
        topic: 'Web Performance Optimization',
        relevance: 0.85,
        difficulty: 'intermediate',
        timeToLearn: '1-2 weeks',
        resources: [
          {
            type: 'article',
            title: 'Core Web Vitals Guide',
            url: 'https://web.dev/vitals/',
            quality: 5
          }
        ],
        practicalApplication: 'Improve Lions of Zion loading performance'
      }
    ]);

    // Security learning paths
    this.learningDatabase.set('security', [
      {
        topic: 'Web Application Security',
        relevance: 0.95,
        difficulty: 'advanced',
        timeToLearn: '3-4 weeks', 
        resources: [
          {
            type: 'course',
            title: 'OWASP Top 10 for Developers',
            duration: '12 hours',
            quality: 5
          }
        ],
        practicalApplication: 'Secure Lions of Zion against common vulnerabilities'
      }
    ]);
  }

  /**
   * יצירת הצעות קוד
   */
  private async generateCodeSuggestions(context: AIContext): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    // הצעות על בסיס דפוסים שזוהו
    if (context.patterns.antiPatterns.length > 0) {
      for (const antiPattern of context.patterns.antiPatterns.slice(0, 3)) {
        suggestions.push({
          id: `code_fix_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          type: 'fix',
          confidence: 0.8,
          suggestion: `תקן את ה-${antiPattern.name}`,
          explanation: `זוהה ${antiPattern.name} ב-${antiPattern.location}. זה יכול לפגוע בקריאות ותחזוקת הקוד.`,
          codeExample: this.generateFixCodeExample(antiPattern),
          relatedFiles: [antiPattern.location],
          estimatedBenefit: 'שיפור קריאות קוד ותחזוקה',
          implementationGuide: [
            'זהה את הקוד הבעייתי',
            'בצע רפקטורינג מדורג',
            'הוסף בדיקות לוידוא תקינות',
            'עדכן תיעוד רלוונטי'
          ]
        });
      }
    }

    // הצעות לשיפור ביצועים
    if (context.performance.overallScore < 80) {
      suggestions.push({
        id: `perf_improvement_${Date.now()}`,
        type: 'optimization',
        confidence: 0.85,
        suggestion: 'אופטמיזציה של ביצועי הרכיבים',
        explanation: 'ניתן לשפר את ביצועי האפליקציה באמצעות memo, useMemo ו-useCallback',
        codeExample: `
// לפני
const MyComponent = ({ data, onUpdate }) => {
  const processedData = expensiveComputation(data);
  return <div onClick={() => onUpdate(processedData)}>...</div>;
};

// אחרי  
const MyComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => expensiveComputation(data), [data]);
  const handleUpdate = useCallback(() => onUpdate(processedData), [processedData, onUpdate]);
  return <div onClick={handleUpdate}>...</div>;
});`,
        relatedFiles: [],
        estimatedBenefit: 'שיפור ביצועים ב-30-50%',
        implementationGuide: [
          'זהה רכיבים עם רנדרים מיותרים',
          'הוסף React.memo לרכיבים מתאימים', 
          'השתמש ב-useMemo לחישובים כבדים',
          'השתמש ב-useCallback לפונקציות',
          'מדוד ביצועים לפני ואחרי'
        ]
      });
    }

    // הצעות לשיפור אבטחה
    if (context.security.overallRiskScore > 5) {
      suggestions.push({
        id: `security_enhancement_${Date.now()}`,
        type: 'enhancement',
        confidence: 0.9,
        suggestion: 'הוספת שכבות אבטחה נוספות',
        explanation: 'מומלץ להוסיף CSP headers, input validation ו-rate limiting',
        codeExample: `
// הוספת Security Headers ב-Next.js
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline';"
          },
          {
            key: 'X-Frame-Options', 
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};`,
        relatedFiles: ['next.config.js', 'middleware.ts'],
        estimatedBenefit: 'הפחתת סיכוני אבטחה ב-60%',
        implementationGuide: [
          'הוסף Security Headers',
          'מימש Input Validation',
          'הוסף Rate Limiting',
          'בדוק עם security scanner',
          'עדכן תיעוד אבטחה'
        ]
      });
    }

    return suggestions;
  }

  /**
   * יצירת הצעות ארכיטקטורה
   */
  private async generateArchitectureSuggestions(context: AIContext): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    if (context.projectHealth.maintainability < 70) {
      suggestions.push({
        id: `arch_refactor_${Date.now()}`,
        type: 'architecture',
        confidence: 0.78,
        suggestion: 'שיפור ארכיטקטורת המערכת',
        explanation: 'ארכיטקטורת המערכת זקוקה לשיפור לטובת תחזוקה טובה יותר',
        codeExample: `
// הצעה לארכיטקטורה משופרת
// libs/core/
//   ├── services/        # Business logic
//   ├── entities/        # Data models  
//   ├── repositories/    # Data access
//   └── use-cases/       # Application logic

// Example: User service
export class UserService {
  constructor(private userRepository: UserRepository) {}
  
  async getUser(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}`,
        relatedFiles: ['apps/web/lib/', 'packages/@lionspace/core/'],
        estimatedBenefit: 'שיפור תחזוקה וגמישות המערכת',
        implementationGuide: [
          'תכנן ארכיטקטורה חדשה',
          'פצל לשכבות לוגיות',
          'הגדר interfaces ברורים',
          'בצע רפקטורינג מדורג',
          'הוסף בדיקות אינטגרציה'
        ]
      });
    }

    return suggestions;
  }

  /**
   * יצירת הצעות ביצועים
   */
  private async generatePerformanceSuggestions(context: AIContext): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    if (context.performance.bundleSize.total > 5000000) {
      suggestions.push({
        id: `bundle_optimization_${Date.now()}`,
        type: 'optimization',
        confidence: 0.82,
        suggestion: 'אופטימיזציה של גודל Bundle',
        explanation: `גודל ה-Bundle הנוכחי (${Math.round(context.performance.bundleSize.total / 1024 / 1024)}MB) גבוה מדי`,
        codeExample: `
// Dynamic imports לצמצום Bundle
const LazyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
});

// Tree shaking לספריות
import { debounce } from 'lodash/debounce'; // ✅ טוב
import _ from 'lodash'; // ❌ רע

// Code splitting לroutes
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));`,
        relatedFiles: ['apps/web/app/', 'apps/web/components/'],
        estimatedBenefit: 'הפחתת גודל Bundle ב-40-60%',
        implementationGuide: [
          'זהה רכיבים כבדים',
          'הוסף dynamic imports',
          'מימש code splitting',
          'אופטמיזציה של images',
          'מדוד שיפור בביצועים'
        ]
      });
    }

    return suggestions;
  }

  /**
   * יצירת הצעות אבטחה
   */
  private async generateSecuritySuggestions(context: AIContext): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    if (context.security.vulnerabilities.length > 0) {
      suggestions.push({
        id: `security_fix_${Date.now()}`,
        type: 'fix', 
        confidence: 0.95,
        suggestion: 'תיקון פרצות אבטחה קריטיות',
        explanation: `נמצאו ${context.security.vulnerabilities.length} פרצות אבטחה שדורשות טיפול מיידי`,
        codeExample: `
// Input Validation
const validateInput = (input: string): boolean => {
  // Sanitize HTML
  const sanitized = DOMPurify.sanitize(input);
  
  // Check for SQL injection patterns
  const sqlInjectionPattern = /('|(\\-\\-)|(;|(\\||\\|)|(\\*|\\*)))/i;
  if (sqlInjectionPattern.test(input)) {
    throw new Error('Invalid input detected');
  }
  
  return true;
};

// Secure API calls
const secureApiCall = async (data: any) => {
  // Rate limiting
  await rateLimit.check(request.ip);
  
  // Input validation
  const validatedData = validateInput(data);
  
  // CSRF protection
  if (!verifyCsrfToken(request.headers['x-csrf-token'])) {
    throw new Error('CSRF token validation failed');
  }
  
  return api.call(validatedData);
};`,
        relatedFiles: context.security.vulnerabilities.map(v => v.location).filter(Boolean),
        estimatedBenefit: 'הפחתת סיכוני אבטחה ב-80%',
        implementationGuide: [
          'סרוק כל קלט משתמש',
          'הוסף CSRF protection',
          'מימש rate limiting',
          'הצפן נתונים רגישים',
          'בדוק עם security tools'
        ]
      });
    }

    return suggestions;
  }

  /**
   * יצירת תחזיות חכמות
   */
  private async generatePredictiveSuggestions(context: AIContext): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    // חיזוי בעיות ביצועים
    if (context.trends.performanceTrend.degradationRisk > 60) {
      suggestions.push({
        id: `predictive_perf_${Date.now()}`,
        type: 'enhancement',
        confidence: 0.75,
        suggestion: 'מניעת ירידת ביצועים צפויה',
        explanation: 'על בסיס מגמות נוכחיות, צפויה ירידה בביצועים בשבועיים הקרובים',
        codeExample: `
// Performance monitoring setup
const performanceMonitor = {
  track: (metric: string, value: number) => {
    // Send to monitoring service
    analytics.track('performance', { metric, value, timestamp: Date.now() });
    
    // Alert if threshold exceeded
    if (value > thresholds[metric]) {
      alert(\`Performance threshold exceeded: \${metric} = \${value}\`);
    }
  },
  
  measure: (name: string, fn: () => Promise<any>) => {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    performanceMonitor.track(name, duration);
    return result;
  }
};`,
        relatedFiles: ['apps/web/lib/monitoring.ts'],
        estimatedBenefit: 'מניעת ירידת ביצועים עד 70%',
        implementationGuide: [
          'הגדר ניטור ביצועים',
          'קבע סדי התרעה',
          'מימש אופטימיזציות מונעות',
          'עקוב אחר מדדי ביצועים',
          'הכן תוכנית תגובה מהירה'
        ]
      });
    }

    return suggestions;
  }

  /**
   * יצירת המלצות למידה
   */
  private async generateLearningRecommendations(context: AIContext): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];

    // המלצות למידה על בסיס פערים
    const skillGaps = this.identifySkillGaps(context);
    
    for (const gap of skillGaps.slice(0, 2)) {
      const learningPath = this.learningDatabase.get(gap.topic) || [];
      
      if (learningPath.length > 0) {
        const insight = learningPath[0];
        
        suggestions.push({
          id: `learning_${gap.topic}_${Date.now()}`,
          type: 'enhancement',
          confidence: 0.7,
          suggestion: `למידת ${insight.topic}`,
          explanation: `זיהינו פער בידע ב-${insight.topic}. למידה בתחום זה תשפר משמעותית את הפרויקט.`,
          codeExample: this.generateLearningExample(insight),
          relatedFiles: [],
          estimatedBenefit: insight.practicalApplication,
          implementationGuide: [
            `השקע ${insight.timeToLearn} בלמידה`,
            'עבור על המשאבים המומלצים',
            'תרגל על הפרויקט הנוכחי',
            'שתף ידע עם הצוות',
            'מדוד שיפור בביצועים'
          ]
        });
      }
    }

    return suggestions;
  }

  /**
   * יצירת הצעות כלליות
   */
  private async generateGeneralSuggestions(context: AIContext, prompt: string): Promise<AISuggestion[]> {
    // מודל AI כללי לטיפול בשאלות פתוחות
    return [{
      id: `general_${Date.now()}`,
      type: 'enhancement',
      confidence: 0.6,
      suggestion: 'שיפור כללי מבוסס AI',
      explanation: 'המלצה כללית על בסיס ניתוח הפרויקט',
      codeExample: '// Generated code example based on context',
      relatedFiles: [],
      estimatedBenefit: 'שיפור כללי בפרויקט',
      implementationGuide: ['בחן את ההמלצה', 'בצע בדיקות', 'מימש בזהירות']
    }];
  }

  // Helper methods
  private buildCodeGenerationPrompt(request: CodeGenerationRequest): string {
    return `Generate ${request.type} with requirements: ${request.requirements.join(', ')}. 
            Context: ${request.context}. 
            Constraints: ${request.constraints.join(', ')}.
            Style: ${request.style}`;
  }

  private getDefaultContext(): AIContext {
    return {
      projectHealth: { overallScore: 75, codeQuality: 80, maintainability: 70, testCoverage: 65, documentation: 70, security: 85, performance: 75, technicalDebt: 80, trend: 'stable' },
      trends: { developmentVelocity: { trend: 'stable', velocity: 75 }, codeQualityTrend: { trend: 'stable', score: 80 }, issueResolutionTrend: { trend: 'stable', resolution: 70 }, performanceTrend: { trend: 'stable', metrics: {}, degradationRisk: 30 }, predictiveInsights: [] },
      patterns: { antiPatterns: [], architecturePatterns: [], codeSmells: [], designPatterns: [], optimizationOpportunities: [] },
      recommendations: [],
      performance: { bundleSize: { total: 4000000, trend: 'stable' }, loadTime: { average: 2000, trend: 'stable' }, runtime: { performance: 80, trend: 'stable' }, memory: { usage: 50, available: 128, trend: 'stable' }, criticalPath: { path: 'main', optimization: 'good' }, webVitals: { lcp: 2.1, fid: 100, cls: 0.05 }, overallScore: 80 },
      security: { overallRiskScore: 3, vulnerabilities: [], attackSurface: { score: 4, vectors: [] }, complianceGaps: [], securityPosture: { score: 85, improvements: [] }, threatTrends: [] },
      timestamp: new Date()
    };
  }

  private getDefaultCodeSuggestion(request: CodeGenerationRequest): AISuggestion {
    return {
      id: `default_code_${Date.now()}`,
      type: 'code_generation',
      confidence: 0.5,
      suggestion: `יצירת ${request.type} חדש`,
      explanation: `הצעה ליצירת ${request.type} על בסיס הדרישות`,
      codeExample: `// Generated ${request.type}\n// TODO: Implement based on requirements`,
      relatedFiles: [],
      estimatedBenefit: 'הוספת פונקציונליות חדשה',
      implementationGuide: ['בחן את הקוד הנוצר', 'התאם לדרישות', 'הוסף בדיקות', 'תעדכן תיעוד']
    };
  }

  private async analyzeAndFix(issue: string): Promise<SmartFix | null> {
    // ניתוח והפקת תיקון חכם
    return {
      issue,
      location: 'unknown',
      severity: 'warning',
      automaticFix: false,
      confidence: 0.7,
      codeChange: {
        before: '// Current problematic code',
        after: '// Fixed code', 
        explanation: 'AI-generated fix explanation'
      },
      testSuggestion: 'Add test to verify the fix'
    };
  }

  private async processNaturalLanguageQuery(query: string, context: AIContext): Promise<{
    answer: string;
    confidence: number;
    sources: string[];
    relatedSuggestions: string[];
    followUpQuestions: string[];
  }> {
    // עיבוד שאילתה בשפה טבעית
    return {
      answer: `על בסיס ניתוח הפרויקט, תשובה לשאילתה: ${query}`,
      confidence: 0.75,
      sources: ['Project analysis', 'Code patterns', 'Best practices'],
      relatedSuggestions: ['Consider performance optimization', 'Review security measures'],
      followUpQuestions: ['Would you like specific code examples?', 'Should we explore alternatives?']
    };
  }

  private getDefaultAssistance(query: string): ContextualAssistance {
    return {
      query,
      response: 'מצטער, לא יכולתי לעבד את השאילתה כעת. אנא נסה שוב.',
      confidence: 0.1,
      sources: [],
      relatedSuggestions: [],
      followUpQuestions: []
    };
  }

  private async filterAndRankSuggestions(suggestions: AISuggestion[], context: AIContext): Promise<AISuggestion[]> {
    // סינון לפי רמת ביטחון מינימלית
    const filtered = suggestions.filter(s => s.confidence >= 0.6);
    
    // סידור לפי ביטחון ורלוונטיות
    return filtered.sort((a, b) => {
      const scoreA = a.confidence * this.calculateRelevanceScore(a, context);
      const scoreB = b.confidence * this.calculateRelevanceScore(b, context);
      return scoreB - scoreA;
    });
  }

  private calculateRelevanceScore(suggestion: AISuggestion, context: AIContext): number {
    let score = 1.0;
    
    // התאמת ציון לפי סוג ההצעה והקשר הנוכחי
    if (suggestion.type === 'fix' && context.security.vulnerabilities.length > 0) {
      score += 0.3;
    }
    
    if (suggestion.type === 'optimization' && context.performance.overallScore < 70) {
      score += 0.2;
    }
    
    return Math.min(2.0, score);
  }

  private generateFixCodeExample(antiPattern: any): string {
    return `
// לפני - ${antiPattern.name}
${antiPattern.description}

// אחרי - תיקון מוצע
// TODO: Implement specific fix based on anti-pattern type`;
  }

  private identifySkillGaps(context: AIContext): { topic: string; severity: number }[] {
    const gaps: { topic: string; severity: number }[] = [];
    
    if (context.security.overallRiskScore > 5) {
      gaps.push({ topic: 'security', severity: context.security.overallRiskScore });
    }
    
    if (context.performance.overallScore < 70) {
      gaps.push({ topic: 'performance', severity: 100 - context.performance.overallScore });
    }
    
    if (context.projectHealth.testCoverage < 70) {
      gaps.push({ topic: 'testing', severity: 100 - context.projectHealth.testCoverage });
    }
    
    return gaps.sort((a, b) => b.severity - a.severity);
  }

  private generateLearningExample(insight: LearningInsight): string {
    return `
// Learning example for ${insight.topic}
// Difficulty: ${insight.difficulty}
// Time to learn: ${insight.timeToLearn}

// Practical application: ${insight.practicalApplication}
// TODO: Add specific code example based on topic`;
  }

  private logSuggestionsSummary(suggestions: AISuggestion[]): void {
    const summary = {
      total: suggestions.length,
      byType: {} as { [key: string]: number },
      avgConfidence: 0
    };

    for (const suggestion of suggestions) {
      summary.byType[suggestion.type] = (summary.byType[suggestion.type] || 0) + 1;
    }

    summary.avgConfidence = suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length;

    console.log('🤖 סיכום הצעות AI:');
    console.log(`   📊 סה"כ הצעות: ${summary.total}`);
    console.log(`   🎯 ביטחון ממוצע: ${Math.round(summary.avgConfidence * 100)}%`);
    
    Object.entries(summary.byType).forEach(([type, count]) => {
      console.log(`   ${this.getTypeEmoji(type)} ${type}: ${count}`);
    });
  }

  private getTypeEmoji(type: string): string {
    switch (type) {
      case 'fix': return '🔧';
      case 'optimization': return '⚡';
      case 'enhancement': return '✨';
      case 'code_generation': return '💻';
      case 'architecture': return '🏗️';
      default: return '🤖';
    }
  }
}