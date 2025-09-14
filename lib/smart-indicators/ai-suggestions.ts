/**
 * AI-Powered Suggestions Engine
 * Intelligent recommendations and optimization insights
 */

import { SmartIndicator, IndicatorLevel } from './index';

interface SuggestionContext {
  projectType: 'web-app' | 'api' | 'library' | 'fullstack';
  framework: 'nextjs' | 'react' | 'nodejs' | 'typescript' | 'unknown';
  size: 'small' | 'medium' | 'large' | 'enterprise';
  complexity: 'low' | 'medium' | 'high' | 'very-high';
  techStack: string[];
  patterns: string[];
}

interface SuggestionRule {
  id: string;
  name: string;
  description: string;
  category: 'architecture' | 'performance' | 'security' | 'maintainability' | 'best-practices';
  priority: IndicatorLevel.CRITICAL | 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  conditions: (indicators: SmartIndicator[], context: SuggestionContext) => boolean;
  generate: (indicators: SmartIndicator[], context: SuggestionContext) => AISuggestionResult;
}

interface AISuggestionResult {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
  steps: string[];
  resources: { title: string; url: string; type: 'documentation' | 'tool' | 'article' | 'video' }[];
  codeExamples?: { language: string; before?: string; after: string; description: string }[];
  metrics: { before: string; after: string; improvement: string }[];
}

interface PatternAnalysis {
  antiPatterns: { pattern: string; severity: 'high' | 'medium' | 'low'; files: string[] }[];
  goodPatterns: { pattern: string; usage: number; examples: string[] }[];
  missingPatterns: { pattern: string; benefit: string; priority: 'high' | 'medium' | 'low' }[];
}

interface TrendAnalysis {
  degradingMetrics: { metric: string; trend: number; projection: string }[];
  improvingMetrics: { metric: string; trend: number; projection: string }[];
  predictions: { metric: string; timeframe: string; confidence: number; prediction: string }[];
}

export class AISuggestions {
  private context: SuggestionContext;
  private suggestionRules: SuggestionRule[] = [];
  private patternDatabase: Map<string, any> = new Map();
  private historicalData: Map<string, number[]> = new Map();

  constructor() {
    this.context = {
      projectType: 'fullstack',
      framework: 'nextjs',
      size: 'medium',
      complexity: 'medium',
      techStack: [],
      patterns: []
    };

    this.initializeSuggestionRules();
    this.loadPatternDatabase();
  }

  async initialize(): Promise<void> {
    this.context = await this.analyzeProjectContext();
  }

  async generateSuggestions(indicators: SmartIndicator[]): Promise<SmartIndicator[]> {
    const suggestions: SmartIndicator[] = [];

    try {
      // Analyze current state and patterns
      const patternAnalysis = this.analyzePatterns(indicators);
      const trendAnalysis = this.analyzeTrends(indicators);

      // Generate contextual suggestions
      const contextualSuggestions = await this.generateContextualSuggestions(indicators, patternAnalysis, trendAnalysis);
      suggestions.push(...contextualSuggestions);

      // Generate rule-based suggestions
      const ruleBased = this.generateRuleBasedSuggestions(indicators);
      suggestions.push(...ruleBased);

      // Generate predictive suggestions
      const predictive = this.generatePredictiveSuggestions(indicators, trendAnalysis);
      suggestions.push(...predictive);

      // Generate best practice recommendations
      const bestPractices = this.generateBestPracticeRecommendations(indicators, patternAnalysis);
      suggestions.push(...bestPractices);

      // Generate optimization opportunities
      const optimizations = this.generateOptimizationOpportunities(indicators);
      suggestions.push(...optimizations);

      // Sort suggestions by priority and impact
      return this.prioritizeSuggestions(suggestions);

    } catch (error) {
      console.error('AI suggestion generation failed:', error);
      return [this.createErrorSuggestion(error)];
    }
  }

  private initializeSuggestionRules(): void {
    this.suggestionRules = [
      // Performance Rules
      {
        id: 'large-bundle-optimization',
        name: 'Large Bundle Optimization',
        description: 'Optimize large JavaScript bundles for better performance',
        category: 'performance',
        priority: 'high',
        confidence: 90,
        conditions: (indicators, context) => {
          const bundleSize = indicators.find(i => i.id === 'bundle-size-total');
          return !!(bundleSize && typeof bundleSize.value === 'number' && bundleSize.value > 3);
        },
        generate: (indicators, context) => ({
          title: 'Optimize Large JavaScript Bundle',
          description: 'Your JavaScript bundle is larger than recommended. Implementing code splitting and lazy loading can significantly improve load times.',
          impact: 'high',
          effort: 'medium',
          category: 'performance',
          steps: [
            'Implement dynamic imports for route-based code splitting',
            'Use React.lazy() for component-level code splitting',
            'Analyze bundle with webpack-bundle-analyzer',
            'Remove unused dependencies and dead code',
            'Consider using lighter alternatives for heavy libraries'
          ],
          resources: [
            { title: 'Next.js Code Splitting', url: 'https://nextjs.org/docs/advanced-features/dynamic-import', type: 'documentation' },
            { title: 'Bundle Analyzer', url: 'https://www.npmjs.com/package/@next/bundle-analyzer', type: 'tool' }
          ],
          codeExamples: [{
            language: 'typescript',
            before: `import HeavyComponent from './HeavyComponent';`,
            after: `const HeavyComponent = React.lazy(() => import('./HeavyComponent'));`,
            description: 'Convert static imports to lazy loading'
          }],
          metrics: [
            { before: '> 3MB bundle', after: '< 1.5MB bundle', improvement: '50%+ load time improvement' },
            { before: '5+ second FCP', after: '< 2.5 second FCP', improvement: 'Better Core Web Vitals' }
          ]
        })
      },

      // Security Rules
      {
        id: 'critical-security-vulnerabilities',
        name: 'Critical Security Fix',
        description: 'Address critical security vulnerabilities immediately',
        category: 'security',
        priority: IndicatorLevel.CRITICAL,
        confidence: 95,
        conditions: (indicators, context) => {
          const criticalVulns = indicators.find(i => i.id === 'critical-vulnerabilities');
          return !!(criticalVulns && typeof criticalVulns.value === 'number' && criticalVulns.value > 0);
        },
        generate: (indicators, context) => ({
          title: 'Fix Critical Security Vulnerabilities',
          description: 'Critical security vulnerabilities detected that require immediate attention to prevent potential attacks.',
          impact: 'high',
          effort: 'high',
          category: 'security',
          steps: [
            'Review all detected vulnerabilities in security report',
            'Prioritize fixes based on CVSS scores and exploitability',
            'Update vulnerable dependencies to secure versions',
            'Implement input validation and sanitization',
            'Add security headers and configure CSP',
            'Perform security testing after fixes'
          ],
          resources: [
            { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', type: 'documentation' },
            { title: 'npm audit', url: 'https://docs.npmjs.com/cli/v8/commands/npm-audit', type: 'tool' },
            { title: 'Security Headers', url: 'https://securityheaders.com/', type: 'tool' }
          ],
          metrics: [
            { before: 'Critical vulnerabilities present', after: 'All critical issues resolved', improvement: 'Eliminated attack vectors' },
            { before: 'Low security score', after: '95%+ security compliance', improvement: 'Production-ready security' }
          ]
        })
      },

      // Code Quality Rules
      {
        id: 'high-complexity-refactoring',
        name: 'Reduce Code Complexity',
        description: 'Refactor complex code for better maintainability',
        category: 'maintainability',
        priority: 'medium',
        confidence: 80,
        conditions: (indicators, context) => {
          const complexity = indicators.find(i => i.id === 'code-complexity');
          return !!(complexity && typeof complexity.value === 'number' && complexity.value > 15);
        },
        generate: (indicators, context) => ({
          title: 'Reduce Code Complexity',
          description: 'High code complexity detected. Refactoring complex functions will improve maintainability and reduce bugs.',
          impact: 'medium',
          effort: 'high',
          category: 'maintainability',
          steps: [
            'Identify functions with high cyclomatic complexity',
            'Break down large functions into smaller, focused functions',
            'Extract repeated logic into utility functions',
            'Implement proper error handling patterns',
            'Add comprehensive unit tests for refactored code'
          ],
          resources: [
            { title: 'Clean Code Principles', url: 'https://blog.cleancoder.com/', type: 'article' },
            { title: 'Refactoring Guru', url: 'https://refactoring.guru/', type: 'documentation' }
          ],
          codeExamples: [{
            language: 'typescript',
            before: `function processUserData(user: any) {
  // 50+ lines of complex logic
  if (user && user.profile && user.profile.settings) {
    // Complex nested logic...
  }
}`,
            after: `function processUserData(user: User) {
  if (!isValidUser(user)) return null;
  
  const profile = getUserProfile(user);
  const settings = getProfileSettings(profile);
  
  return applyUserSettings(user, settings);
}`,
            description: 'Break down complex functions into smaller, focused functions'
          }],
          metrics: [
            { before: '15+ complexity score', after: '< 10 complexity score', improvement: '40% more maintainable' },
            { before: 'Hard to test code', after: 'Testable functions', improvement: 'Better test coverage' }
          ]
        })
      },

      // Architecture Rules
      {
        id: 'circular-dependency-elimination',
        name: 'Eliminate Circular Dependencies',
        description: 'Remove circular dependencies to improve architecture',
        category: 'architecture',
        priority: 'high',
        confidence: 85,
        conditions: (indicators, context) => {
          const circularDeps = indicators.find(i => i.id === 'circular-dependencies-critical');
          return !!(circularDeps && typeof circularDeps.value === 'number' && circularDeps.value > 0);
        },
        generate: (indicators, context) => ({
          title: 'Eliminate Circular Dependencies',
          description: 'Circular dependencies detected. Removing them will improve code architecture and build reliability.',
          impact: 'high',
          effort: 'medium',
          category: 'architecture',
          steps: [
            'Identify circular dependency chains',
            'Extract shared interfaces to separate modules',
            'Use dependency inversion principle',
            'Implement event-driven communication where appropriate',
            'Consider using a state management solution'
          ],
          resources: [
            { title: 'Dependency Inversion Principle', url: 'https://en.wikipedia.org/wiki/Dependency_inversion_principle', type: 'article' },
            { title: 'Madge - Circular Dependency Detector', url: 'https://github.com/pahen/madge', type: 'tool' }
          ],
          codeExamples: [{
            language: 'typescript',
            before: `// A.ts imports B.ts, B.ts imports A.ts
import { B } from './B';
export class A { b: B; }`,
            after: `// Extract interface to separate file
interface IShared { ... }
export class A implements IShared { ... }`,
            description: 'Break circular dependencies with interfaces'
          }],
          metrics: [
            { before: 'Circular dependencies present', after: 'Clean dependency graph', improvement: 'Better modularity' },
            { before: 'Build inconsistencies', after: 'Reliable builds', improvement: 'Stable development' }
          ]
        })
      },

      // Performance Optimization Rules
      {
        id: 'image-optimization',
        name: 'Optimize Images',
        description: 'Optimize images for better performance',
        category: 'performance',
        priority: 'medium',
        confidence: 90,
        conditions: (indicators, context) => {
          const imageOpt = indicators.find(i => i.id === 'image-optimization-score');
          return !!(imageOpt && typeof imageOpt.value === 'number' && imageOpt.value < 80);
        },
        generate: (indicators, context) => ({
          title: 'Optimize Images for Better Performance',
          description: 'Image optimization opportunities detected. Optimizing images can significantly improve page load times.',
          impact: 'medium',
          effort: 'low',
          category: 'performance',
          steps: [
            'Convert images to modern formats (WebP, AVIF)',
            'Implement responsive images with srcset',
            'Use Next.js Image component for automatic optimization',
            'Add lazy loading for below-the-fold images',
            'Compress images while maintaining quality'
          ],
          resources: [
            { title: 'Next.js Image Optimization', url: 'https://nextjs.org/docs/basic-features/image-optimization', type: 'documentation' },
            { title: 'WebP Converter', url: 'https://squoosh.app/', type: 'tool' }
          ],
          codeExamples: [{
            language: 'tsx',
            before: `<img src="/large-image.jpg" alt="Description" />`,
            after: `<Image 
  src="/large-image.jpg" 
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>`,
            description: 'Use Next.js Image component for automatic optimization'
          }],
          metrics: [
            { before: 'Large image files', after: '50-80% smaller files', improvement: 'Faster page loads' },
            { before: 'Poor LCP scores', after: 'Improved LCP by 30%', improvement: 'Better Core Web Vitals' }
          ]
        })
      }
    ];
  }

  private loadPatternDatabase(): void {
    // Load common patterns and anti-patterns
    this.patternDatabase.set('react-patterns', {
      goodPatterns: [
        'Custom hooks for reusable logic',
        'Component composition over inheritance',
        'Props drilling avoidance with context',
        'Memoization for expensive calculations'
      ],
      antiPatterns: [
        'Inline object/function props',
        'Missing dependency arrays in hooks',
        'Mutating props directly',
        'Complex nested conditional rendering'
      ]
    });

    this.patternDatabase.set('nextjs-patterns', {
      goodPatterns: [
        'Server-side rendering for static content',
        'API routes for backend logic',
        'Dynamic imports for code splitting',
        'Optimized images with Next/Image'
      ],
      antiPatterns: [
        'Client-side data fetching in SSR pages',
        'Large pages without code splitting',
        'Unoptimized images',
        'Missing meta tags for SEO'
      ]
    });

    this.patternDatabase.set('security-patterns', {
      goodPatterns: [
        'Input validation and sanitization',
        'Environment variables for secrets',
        'HTTPS-only communication',
        'CSP headers implementation'
      ],
      antiPatterns: [
        'Hardcoded credentials',
        'SQL injection vulnerabilities',
        'XSS vulnerability patterns',
        'Missing security headers'
      ]
    });
  }

  private async analyzeProjectContext(): Promise<SuggestionContext> {
    // In a real implementation, this would analyze the project structure
    // For now, we'll return default context
    return {
      projectType: 'fullstack',
      framework: 'nextjs',
      size: 'medium',
      complexity: 'medium',
      techStack: ['react', 'typescript', 'nextjs', 'tailwind'],
      patterns: ['hooks', 'components', 'api-routes']
    };
  }

  private analyzePatterns(indicators: SmartIndicator[]): PatternAnalysis {
    const analysis: PatternAnalysis = {
      antiPatterns: [],
      goodPatterns: [],
      missingPatterns: []
    };

    // Detect anti-patterns based on indicators
    const criticalIssues = indicators.filter(i => i.level === IndicatorLevel.CRITICAL);
    const warningIssues = indicators.filter(i => i.level === IndicatorLevel.WARNING);

    if (criticalIssues.some(i => i.category === 'security')) {
      analysis.antiPatterns.push({
        pattern: 'Security vulnerabilities',
        severity: 'high',
        files: criticalIssues.filter(i => i.category === 'security').map(i => i.title)
      });
    }

    if (warningIssues.some(i => i.category === 'performance')) {
      analysis.antiPatterns.push({
        pattern: 'Performance bottlenecks',
        severity: 'medium',
        files: warningIssues.filter(i => i.category === 'performance').map(i => i.title)
      });
    }

    // Detect missing patterns
    const hasTestCoverage = indicators.some(i => i.id === 'test-coverage');
    if (!hasTestCoverage || (typeof indicators.find(i => i.id === 'test-coverage')?.value === 'number' && indicators.find(i => i.id === 'test-coverage')?.value < 80)) {
      analysis.missingPatterns.push({
        pattern: 'Comprehensive testing',
        benefit: 'Improved code reliability and easier refactoring',
        priority: 'high'
      });
    }

    const hasDocumentation = indicators.some(i => i.id === 'documentation-quality');
    if (!hasDocumentation || (typeof indicators.find(i => i.id === 'documentation-quality')?.value === 'number' && indicators.find(i => i.id === 'documentation-quality')?.value < 70)) {
      analysis.missingPatterns.push({
        pattern: 'Documentation standards',
        benefit: 'Better developer onboarding and maintenance',
        priority: 'medium'
      });
    }

    return analysis;
  }

  private analyzeTrends(indicators: SmartIndicator[]): TrendAnalysis {
    const analysis: TrendAnalysis = {
      degradingMetrics: [],
      improvingMetrics: [],
      predictions: []
    };

    // In a real implementation, this would analyze historical data
    // For now, we'll simulate trend analysis
    indicators.forEach(indicator => {
      if (indicator.trend === 'down') {
        analysis.degradingMetrics.push({
          metric: indicator.title,
          trend: -10, // Mock trend
          projection: 'Continued degradation if not addressed'
        });
      } else if (indicator.trend === 'up') {
        analysis.improvingMetrics.push({
          metric: indicator.title,
          trend: 15, // Mock trend
          projection: 'Positive trend continuing'
        });
      }
    });

    return analysis;
  }

  private async generateContextualSuggestions(
    indicators: SmartIndicator[], 
    patterns: PatternAnalysis, 
    trends: TrendAnalysis
  ): Promise<SmartIndicator[]> {
    const suggestions: SmartIndicator[] = [];

    // Generate suggestions based on project context
    if (this.context.framework === 'nextjs') {
      // Next.js specific suggestions
      const hasImageOpt = indicators.find(i => i.id === 'image-optimization-score');
      if (hasImageOpt && typeof hasImageOpt.value === 'number' && hasImageOpt.value < 80) {
        suggestions.push(this.createSuggestionIndicator({
          id: 'nextjs-image-optimization',
          title: 'Use Next.js Image Component',
          description: 'Leverage Next.js automatic image optimization for better performance',
          impact: 'medium',
          effort: 'low',
          category: 'performance',
          suggestion: 'Replace <img> tags with Next.js Image component for automatic optimization'
        }));
      }
    }

    // Generate suggestions based on patterns
    patterns.antiPatterns.forEach(antiPattern => {
      if (antiPattern.severity === 'high') {
        suggestions.push(this.createSuggestionIndicator({
          id: `fix-${antiPattern.pattern.toLowerCase().replace(/\s+/g, '-')}`,
          title: `Fix ${antiPattern.pattern}`,
          description: `Address ${antiPattern.pattern.toLowerCase()} to improve code quality`,
          impact: 'high',
          effort: 'medium',
          category: 'architecture',
          suggestion: `Refactor code to eliminate ${antiPattern.pattern.toLowerCase()}`
        }));
      }
    });

    // Generate suggestions based on trends
    trends.degradingMetrics.forEach(metric => {
      suggestions.push(this.createSuggestionIndicator({
        id: `trend-${metric.metric.toLowerCase().replace(/\s+/g, '-')}`,
        title: `Address Degrading ${metric.metric}`,
        description: `${metric.metric} is showing a negative trend`,
        impact: 'medium',
        effort: 'medium',
        category: 'maintenance',
        suggestion: `Take action to reverse the negative trend in ${metric.metric.toLowerCase()}`
      }));
    });

    return suggestions;
  }

  private generateRuleBasedSuggestions(indicators: SmartIndicator[]): SmartIndicator[] {
    const suggestions: SmartIndicator[] = [];

    for (const rule of this.suggestionRules) {
      if (rule.conditions(indicators, this.context)) {
        const aiResult = rule.generate(indicators, this.context);
        
        suggestions.push(this.createSuggestionIndicator({
          id: rule.id,
          title: aiResult.title,
          description: aiResult.description,
          impact: aiResult.impact,
          effort: aiResult.effort,
          category: aiResult.category,
          suggestion: aiResult.steps.join('; '),
          confidence: rule.confidence
        }));
      }
    }

    return suggestions;
  }

  private generatePredictiveSuggestions(indicators: SmartIndicator[], trends: TrendAnalysis): SmartIndicator[] {
    const suggestions: SmartIndicator[] = [];

    // Predict potential future issues
    const performanceScore = indicators.find(i => i.id === 'performance-score-overall');
    if (performanceScore && typeof performanceScore.value === 'number' && performanceScore.value < 80) {
      suggestions.push(this.createSuggestionIndicator({
        id: 'predictive-performance-degradation',
        title: 'Prevent Performance Degradation',
        description: 'Current performance trends suggest potential future degradation',
        impact: 'medium',
        effort: 'low',
        category: 'performance',
        suggestion: 'Implement performance monitoring and set up alerts for key metrics'
      }));
    }

    const securityScore = indicators.find(i => i.id === 'security-score-overall');
    if (securityScore && typeof securityScore.value === 'number' && securityScore.value < 90) {
      suggestions.push(this.createSuggestionIndicator({
        id: 'predictive-security-risk',
        title: 'Enhance Security Posture',
        description: 'Security metrics indicate increased risk of vulnerabilities',
        impact: 'high',
        effort: 'medium',
        category: 'security',
        suggestion: 'Implement automated security scanning and regular security audits'
      }));
    }

    return suggestions;
  }

  private generateBestPracticeRecommendations(indicators: SmartIndicator[], patterns: PatternAnalysis): SmartIndicator[] {
    const suggestions: SmartIndicator[] = [];

    // Missing testing patterns
    if (patterns.missingPatterns.some(p => p.pattern === 'Comprehensive testing')) {
      suggestions.push(this.createSuggestionIndicator({
        id: 'implement-testing-strategy',
        title: 'Implement Comprehensive Testing Strategy',
        description: 'Add unit, integration, and end-to-end tests for better code reliability',
        impact: 'high',
        effort: 'high',
        category: 'best-practices',
        suggestion: 'Set up Jest for unit tests, React Testing Library for component tests, and Playwright for E2E tests'
      }));
    }

    // Missing documentation
    if (patterns.missingPatterns.some(p => p.pattern === 'Documentation standards')) {
      suggestions.push(this.createSuggestionIndicator({
        id: 'improve-documentation',
        title: 'Improve Project Documentation',
        description: 'Add comprehensive documentation for better maintainability',
        impact: 'medium',
        effort: 'medium',
        category: 'best-practices',
        suggestion: 'Create API documentation, component storybook, and developer guides'
      }));
    }

    // Code quality improvements
    const complexity = indicators.find(i => i.id === 'code-complexity');
    if (complexity && typeof complexity.value === 'number' && complexity.value > 10) {
      suggestions.push(this.createSuggestionIndicator({
        id: 'implement-code-quality-tools',
        title: 'Implement Code Quality Tools',
        description: 'Set up linting, formatting, and quality gates',
        impact: 'medium',
        effort: 'low',
        category: 'best-practices',
        suggestion: 'Configure ESLint, Prettier, Husky pre-commit hooks, and SonarQube analysis'
      }));
    }

    return suggestions;
  }

  private generateOptimizationOpportunities(indicators: SmartIndicator[]): SmartIndicator[] {
    const suggestions: SmartIndicator[] = [];

    // Bundle optimization
    const bundleSize = indicators.find(i => i.id === 'bundle-size-total');
    if (bundleSize && typeof bundleSize.value === 'number' && bundleSize.value > 2) {
      suggestions.push(this.createSuggestionIndicator({
        id: 'bundle-optimization-opportunity',
        title: 'Bundle Size Optimization Opportunity',
        description: 'Significant bundle size reduction possible through optimization techniques',
        impact: 'high',
        effort: 'medium',
        category: 'optimization',
        suggestion: 'Implement tree shaking, code splitting, and remove unused dependencies'
      }));
    }

    // Memory optimization
    const memoryLeaks = indicators.find(i => i.id === 'potential-memory-leaks');
    if (memoryLeaks && typeof memoryLeaks.value === 'number' && memoryLeaks.value > 0) {
      suggestions.push(this.createSuggestionIndicator({
        id: 'memory-optimization-opportunity',
        title: 'Memory Usage Optimization',
        description: 'Optimize memory usage by fixing potential leaks',
        impact: 'medium',
        effort: 'medium',
        category: 'optimization',
        suggestion: 'Add cleanup for event listeners, intervals, and implement proper component unmounting'
      }));
    }

    // Database query optimization (if applicable)
    const heavyComputations = indicators.find(i => i.id === 'heavy-computations');
    if (heavyComputations && typeof heavyComputations.value === 'number' && heavyComputations.value > 0) {
      suggestions.push(this.createSuggestionIndicator({
        id: 'computation-optimization-opportunity',
        title: 'Computation Optimization Opportunity',
        description: 'Optimize heavy computations for better performance',
        impact: 'medium',
        effort: 'high',
        category: 'optimization',
        suggestion: 'Implement memoization, move heavy computations to web workers, or use more efficient algorithms'
      }));
    }

    return suggestions;
  }

  private prioritizeSuggestions(suggestions: SmartIndicator[]): SmartIndicator[] {
    return suggestions
      .sort((a, b) => {
        // Sort by level first (critical > warning > info > success)
        const levelPriority = { critical: 4, warning: 3, info: 2, success: 1 };
        const levelDiff = levelPriority[b.level] - levelPriority[a.level];
        if (levelDiff !== 0) return levelDiff;

        // Then by actionability
        if (a.actionable !== b.actionable) {
          return b.actionable ? 1 : -1;
        }

        // Then by timestamp (newer first)
        return b.timestamp.getTime() - a.timestamp.getTime();
      })
      .slice(0, 20); // Limit to top 20 suggestions
  }

  private createSuggestionIndicator(config: {
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
    category: string;
    suggestion: string;
    confidence?: number;
  }): SmartIndicator {
    // Determine level based on impact and effort
    let level: SmartIndicator['level'] = IndicatorLevel.INFO;
    if (config.impact === 'high' && config.effort === 'low') {
      level = IndicatorLevel.SUCCESS; // High impact, low effort = quick win
    } else if (config.impact === 'high') {
      level = IndicatorLevel.WARNING; // High impact = important
    } else if (config.impact === 'medium' && config.effort === 'low') {
      level = IndicatorLevel.INFO; // Medium impact, low effort = good to do
    }

    return {
      id: config.id,
      type: 'suggestion',
      level,
      title: config.title,
      description: config.description,
      value: `${config.impact} impact, ${config.effort} effort`,
      category: config.category,
      timestamp: new Date(),
      actionable: true,
      suggestion: config.suggestion,
      visualConfig: {
        color: this.getLevelColor(level),
        icon: '💡',
        animation: level === 'success' ? 'glow' : undefined
      }
    };
  }

  private createErrorSuggestion(error: any): SmartIndicator {
    return {
      id: 'ai-suggestion-error',
      type: 'suggestion',
      level: IndicatorLevel.WARNING,
      title: 'AI Suggestion Generation Error',
      description: `Failed to generate AI suggestions: ${error.message}`,
      value: 'Error',
      category: 'system',
      timestamp: new Date(),
      actionable: false,
      suggestion: 'Check system configuration and try again',
      visualConfig: {
        color: '#f59e0b',
        icon: '⚠️'
      }
    };
  }

  private getLevelColor(level: SmartIndicator['level']): string {
    const colors = {
      critical: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      success: '#10b981'
    };
    return colors[level];
  }

  // Update historical data for trend analysis
  updateHistoricalData(indicators: SmartIndicator[]): void {
    indicators.forEach(indicator => {
      if (typeof indicator.value === 'number') {
        const history = this.historicalData.get(indicator.id) || [];
        history.push(indicator.value);
        
        // Keep only last 100 data points
        if (history.length > 100) {
          history.shift();
        }
        
        this.historicalData.set(indicator.id, history);
      }
    });
  }

  // Get suggestion by ID with full details
  getSuggestionDetails(suggestionId: string): AISuggestionResult | null {
    const rule = this.suggestionRules.find(r => r.id === suggestionId);
    if (!rule) return null;

    // This would normally check conditions and generate the full suggestion
    // For now, return a placeholder
    return {
      title: rule.name,
      description: rule.description,
      impact: 'medium',
      effort: 'medium',
      category: rule.category,
      steps: ['Step 1', 'Step 2', 'Step 3'],
      resources: [],
      metrics: []
    };
  }
}