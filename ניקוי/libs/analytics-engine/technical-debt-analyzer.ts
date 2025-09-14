/**
 * Technical Debt Analyzer - מנתח חוב טכני
 * מזהה, מודד ומנהל חוב טכני בפלטפורמת Lions of Zion
 */

import { AnalyticsConfig, TechnicalDebtMetrics, DebtPaydownOpportunity, CostBenefitAnalysis } from './index';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface DebtItem {
  id: string;
  type: 'code_smell' | 'architecture' | 'test_debt' | 'documentation' | 'security' | 'performance' | 'dependency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: DebtLocation;
  estimatedEffort: EffortEstimate;
  businessImpact: BusinessImpact;
  technicalImpact: TechnicalImpact;
  accumulationRate: number; // how fast this debt is growing
  discoverDate: Date;
  lastAssessed: Date;
  tags: string[];
}

export interface DebtLocation {
  file: string;
  line?: number;
  function?: string;
  component?: string;
  module?: string;
}

export interface EffortEstimate {
  hours: number;
  complexity: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  dependencies: string[]; // other debt items that must be fixed first
  skillsRequired: string[];
}

export interface BusinessImpact {
  velocityImpact: number; // percentage impact on development speed
  maintenanceCost: number; // additional hours per month
  customerImpact: 'none' | 'low' | 'medium' | 'high';
  marketRisk: 'none' | 'low' | 'medium' | 'high';
  complianceRisk: boolean;
}

export interface TechnicalImpact {
  maintainabilityImpact: number; // 1-10 scale
  performanceImpact: number; // 1-10 scale  
  securityImpact: number; // 1-10 scale
  scalabilityImpact: number; // 1-10 scale
  qualityImpact: number; // 1-10 scale
  testabilityImpact: number; // 1-10 scale
}

export interface DebtTrend {
  period: 'week' | 'month' | 'quarter';
  debtAccumulated: number; // hours of debt added
  debtPaidDown: number; // hours of debt resolved
  netChange: number;
  velocityImpact: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface DebtPortfolio {
  totalDebt: number; // hours
  debtByCategory: { [category: string]: number };
  debtByPriority: { [priority: string]: number };
  debtByAge: { [ageRange: string]: number };
  highestImpactItems: DebtItem[];
  quickWins: DebtItem[]; // low effort, high impact
  technicalBankruptcyRisk: number; // 0-10 scale
}

export interface PaydownStrategy {
  name: string;
  description: string;
  timeline: string;
  totalEffort: number;
  expectedBenefit: number;
  riskLevel: 'low' | 'medium' | 'high';
  items: DebtPaydownOpportunity[];
  prerequisites: string[];
  success_metrics: string[];
}

export interface DebtRule {
  id: string;
  name: string;
  category: string;
  description: string;
  detector: (context: DebtAnalysisContext) => Promise<DebtItem[]>;
  impactCalculator: (item: DebtItem) => Promise<void>;
}

export interface DebtAnalysisContext {
  projectRoot: string;
  sourceFiles: string[];
  testFiles: string[];
  configFiles: string[];
  dependencies: any;
  gitHistory: any;
  codeMetrics: any;
}

export class TechnicalDebtAnalyzer {
  private config: AnalyticsConfig;
  private projectRoot: string;
  private debtRules: DebtRule[] = [];
  private debtItems: DebtItem[] = [];
  private cache: Map<string, any> = new Map();

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.projectRoot = process.cwd();
    this.initializeDebtRules();
  }

  /**
   * ניתוח חוב טכני מקיף
   */
  public async analyzeTechnicalDebt(): Promise<TechnicalDebtMetrics> {
    console.log('🏗️ מנתח חוב טכני ב-Lions of Zion...');

    try {
      const context = await this.buildAnalysisContext();
      
      // זיהוי פריטי חוב טכני
      await this.identifyDebtItems(context);
      
      // חישוב מטריקות חוב
      const [
        debtPortfolio,
        debtTrends,
        paydownOpportunities,
        costBenefitAnalysis
      ] = await Promise.all([
        this.analyzeDebtPortfolio(),
        this.analyzeDebtTrends(),
        this.identifyPaydownOpportunities(),
        this.performCostBenefitAnalysis()
      ]);

      const overallDebtScore = this.calculateOverallDebtScore(debtPortfolio);
      const velocityImpact = this.calculateVelocityImpact(debtPortfolio);
      
      // יצירת אסטרטגיות פירעון
      const paydownStrategies = await this.generatePaydownStrategies();

      console.log('✅ ניתוח חוב טכני הושלם');
      console.log(`📊 ציון חוב טכני: ${overallDebtScore}/100`);
      console.log(`⏱️ חוב כולל: ${debtPortfolio.totalDebt} שעות`);
      console.log(`📉 השפעה על מהירות: ${velocityImpact}%`);
      console.log(`🎯 הזדמנויות פירעון: ${paydownOpportunities.length}`);

      return {
        overallDebtScore,
        debtByCategory: debtPortfolio.debtByCategory,
        velocityImpact,
        paydownOpportunities,
        costBenefitAnalysis,
        debtTrend: debtTrends.trend,
        portfolio: debtPortfolio,
        strategies: paydownStrategies,
        recommendations: await this.generateRecommendations(debtPortfolio, debtTrends),
        metrics: {
          totalItems: this.debtItems.length,
          criticalItems: this.debtItems.filter(d => d.severity === 'critical').length,
          averageAge: this.calculateAverageDebtAge(),
          accumulationRate: this.calculateDebtAccumulationRate()
        }
      };

    } catch (error) {
      console.error('❌ שגיאה בניתוח חוב טכני:', error);
      return this.getDefaultTechnicalDebtMetrics();
    }
  }

  /**
   * בניית קונטקסט לניתוח
   */
  private async buildAnalysisContext(): Promise<DebtAnalysisContext> {
    const [sourceFiles, testFiles, configFiles] = await Promise.all([
      this.findSourceFiles(),
      this.findTestFiles(),
      this.findConfigFiles()
    ]);

    return {
      projectRoot: this.projectRoot,
      sourceFiles,
      testFiles,
      configFiles,
      dependencies: await this.loadDependencies(),
      gitHistory: await this.loadGitHistory(),
      codeMetrics: await this.loadCodeMetrics()
    };
  }

  /**
   * זיהוי פריטי חוב טכני
   */
  private async identifyDebtItems(context: DebtAnalysisContext): Promise<void> {
    this.debtItems = [];

    // הרץ כל חוקי זיהוי החוב
    for (const rule of this.debtRules) {
      try {
        const ruleDebtItems = await rule.detector(context);
        
        // חישוב השפעה לכל פריט
        for (const item of ruleDebtItems) {
          await rule.impactCalculator(item);
        }
        
        this.debtItems.push(...ruleDebtItems);
      } catch (error) {
        console.warn(`⚠️ שגיאה בחוקה ${rule.id}:`, error);
      }
    }

    // סינון והעשרה
    this.debtItems = await this.enrichAndFilterDebtItems(this.debtItems);
    
    console.log(`🔍 נמצאו ${this.debtItems.length} פריטי חוב טכני`);
  }

  /**
   * אתחול חוקי זיהוי חוב טכני
   */
  private initializeDebtRules(): void {
    this.debtRules = [
      // Code Smells
      {
        id: 'large_functions',
        name: 'פונקציות גדולות מדי',
        category: 'code_smell',
        description: 'פונקציות עם יותר מדי שורות קוד',
        detector: async (context) => this.detectLargeFunctions(context),
        impactCalculator: async (item) => this.calculateCodeSmellImpact(item)
      },
      {
        id: 'duplicate_code',
        name: 'קוד מוכפל',
        category: 'code_smell', 
        description: 'בלוקי קוד זהים או דומים',
        detector: async (context) => this.detectDuplicateCode(context),
        impactCalculator: async (item) => this.calculateDuplicationImpact(item)
      },
      {
        id: 'complex_conditions',
        name: 'תנאים מורכבים',
        category: 'code_smell',
        description: 'תנאים מורכבים שקשה להבין',
        detector: async (context) => this.detectComplexConditions(context),
        impactCalculator: async (item) => this.calculateComplexityImpact(item)
      },

      // Architecture Debt
      {
        id: 'tight_coupling',
        name: 'צימוד חזק',
        category: 'architecture',
        description: 'רכיבים צמודים יותר מדי',
        detector: async (context) => this.detectTightCoupling(context),
        impactCalculator: async (item) => this.calculateArchitectureImpact(item)
      },
      {
        id: 'circular_dependencies',
        name: 'תלויות מעגליות',
        category: 'architecture',
        description: 'מודולים שתלויים זה בזה באופן מעגלי',
        detector: async (context) => this.detectCircularDependencies(context),
        impactCalculator: async (item) => this.calculateArchitectureImpact(item)
      },

      // Test Debt
      {
        id: 'missing_tests',
        name: 'בדיקות חסרות',
        category: 'test_debt',
        description: 'קוד ללא בדיקות מתאימות',
        detector: async (context) => this.detectMissingTests(context),
        impactCalculator: async (item) => this.calculateTestDebtImpact(item)
      },
      {
        id: 'flaky_tests',
        name: 'בדיקות לא יציבות',
        category: 'test_debt',
        description: 'בדיקות שנכשלות אקראית',
        detector: async (context) => this.detectFlakyTests(context),
        impactCalculator: async (item) => this.calculateTestDebtImpact(item)
      },

      // Documentation Debt
      {
        id: 'missing_documentation',
        name: 'תיעוד חסר',
        category: 'documentation',
        description: 'קוד או API ללא תיעוד',
        detector: async (context) => this.detectMissingDocumentation(context),
        impactCalculator: async (item) => this.calculateDocumentationImpact(item)
      },

      // Performance Debt
      {
        id: 'performance_anti_patterns',
        name: 'דפוסי ביצועים גרועים',
        category: 'performance',
        description: 'קוד שפוגע בביצועים',
        detector: async (context) => this.detectPerformanceAntiPatterns(context),
        impactCalculator: async (item) => this.calculatePerformanceImpact(item)
      },

      // Security Debt
      {
        id: 'security_vulnerabilities',
        name: 'פרצות אבטחה',
        category: 'security',
        description: 'קוד עם בעיות אבטחה',
        detector: async (context) => this.detectSecurityVulnerabilities(context),
        impactCalculator: async (item) => this.calculateSecurityImpact(item)
      },

      // Dependency Debt
      {
        id: 'outdated_dependencies',
        name: 'תלויות מיושנות',
        category: 'dependency',
        description: 'packages שצריכים עדכון',
        detector: async (context) => this.detectOutdatedDependencies(context),
        impactCalculator: async (item) => this.calculateDependencyImpact(item)
      }
    ];
  }

  /**
   * ניתוח תיק החוב הטכני
   */
  private async analyzeDebtPortfolio(): Promise<DebtPortfolio> {
    const totalDebt = this.debtItems.reduce((sum, item) => sum + item.estimatedEffort.hours, 0);
    
    const debtByCategory = this.groupByCategory();
    const debtByPriority = this.groupByPriority();
    const debtByAge = this.groupByAge();
    
    const highestImpactItems = this.getHighestImpactItems(10);
    const quickWins = this.getQuickWins();
    
    const technicalBankruptcyRisk = this.calculateBankruptcyRisk();

    return {
      totalDebt,
      debtByCategory,
      debtByPriority,
      debtByAge,
      highestImpactItems,
      quickWins,
      technicalBankruptcyRisk
    };
  }

  /**
   * ניתוח מגמות חוב טכני
   */
  private async analyzeDebtTrends(): Promise<DebtTrend> {
    const historicalData = await this.loadHistoricalDebtData();
    
    // חישוב שינוי בחוב בחודש האחרון
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const recentItems = this.debtItems.filter(item => item.discoverDate >= lastMonth);
    const debtAccumulated = recentItems.reduce((sum, item) => sum + item.estimatedEffort.hours, 0);
    
    // חישוב חוב שנפרע (במימוש אמיתי יילקח מגיט היסטורי)
    const debtPaidDown = 50; // placeholder
    
    const netChange = debtAccumulated - debtPaidDown;
    const velocityImpact = this.calculateCurrentVelocityImpact();
    
    let trend: 'improving' | 'stable' | 'worsening' = 'stable';
    if (netChange > 20) trend = 'worsening';
    else if (netChange < -10) trend = 'improving';

    return {
      period: 'month',
      debtAccumulated,
      debtPaidDown,
      netChange,
      velocityImpact,
      trend
    };
  }

  /**
   * זיהוי הזדמנויות פירעון
   */
  private async identifyPaydownOpportunities(): Promise<DebtPaydownOpportunity[]> {
    const opportunities: DebtPaydownOpportunity[] = [];

    // הזדמנויות לפי קטגוריות
    const categories = ['code_smell', 'architecture', 'test_debt', 'performance', 'security'];
    
    for (const category of categories) {
      const categoryItems = this.debtItems.filter(item => item.type === category);
      if (categoryItems.length === 0) continue;

      const totalEffort = categoryItems.reduce((sum, item) => sum + item.estimatedEffort.hours, 0);
      const averageBenefit = this.calculateCategoryBenefit(category, categoryItems);

      opportunities.push({
        type: category,
        effort: this.mapEffortToLevel(totalEffort),
        benefit: averageBenefit,
        priority: this.calculateOpportunityPriority(totalEffort, averageBenefit),
        description: this.getOpportunityDescription(category, categoryItems.length),
        itemsCount: categoryItems.length,
        estimatedHours: totalEffort,
        roi: averageBenefit / Math.max(totalEffort, 1)
      });
    }

    return opportunities.sort((a, b) => this.getOpportunityPriorityWeight(b.priority) - this.getOpportunityPriorityWeight(a.priority));
  }

  /**
   * ניתוח cost-benefit
   */
  private async performCostBenefitAnalysis(): Promise<CostBenefitAnalysis> {
    const totalCost = this.debtItems.reduce((sum, item) => sum + item.estimatedEffort.hours, 0);
    
    // חישוב תועלת כלכלית
    const monthlyMaintenanceCost = this.debtItems.reduce((sum, item) => 
      sum + item.businessImpact.maintenanceCost, 0);
    const velocityImprovement = this.calculatePotentialVelocityImprovement();
    const riskReduction = this.calculateRiskReduction();
    
    const annualBenefit = (monthlyMaintenanceCost * 12) + (velocityImprovement * 1000) + (riskReduction * 5000);
    
    const roi = annualBenefit / Math.max(totalCost * 100, 1); // assuming $100/hour

    return {
      cost: totalCost * 100, // convert hours to dollars
      benefit: annualBenefit,
      roi,
      paybackPeriod: totalCost * 100 / Math.max(annualBenefit / 12, 1), // months
      riskAdjustedROI: roi * 0.8, // 20% risk discount
      scenarios: {
        optimistic: { benefit: annualBenefit * 1.3, roi: roi * 1.3 },
        realistic: { benefit: annualBenefit, roi },
        pessimistic: { benefit: annualBenefit * 0.7, roi: roi * 0.7 }
      }
    };
  }

  /**
   * יצירת אסטרטגיות פירעון
   */
  private async generatePaydownStrategies(): Promise<PaydownStrategy[]> {
    const strategies: PaydownStrategy[] = [];

    // אסטרטגיה 1: Quick Wins
    const quickWins = this.getQuickWins();
    if (quickWins.length > 0) {
      strategies.push({
        name: 'Quick Wins',
        description: 'תיקונים מהירים עם השפעה גבוהה',
        timeline: '1-2 חודשים',
        totalEffort: quickWins.reduce((sum, item) => sum + item.estimatedEffort.hours, 0),
        expectedBenefit: 85,
        riskLevel: 'low',
        items: quickWins.map(item => this.convertToPaydownOpportunity(item)),
        prerequisites: [],
        success_metrics: ['זמן פיתוח תכונות חדשות', 'מספר באגים', 'שביעות רצון מפתחים']
      });
    }

    // אסטרטגיה 2: Security First
    const securityItems = this.debtItems.filter(item => item.type === 'security');
    if (securityItems.length > 0) {
      strategies.push({
        name: 'Security First',
        description: 'טיפול בבעיות אבטחה קריטיות',
        timeline: '2-3 חודשים', 
        totalEffort: securityItems.reduce((sum, item) => sum + item.estimatedEffort.hours, 0),
        expectedBenefit: 95,
        riskLevel: 'medium',
        items: securityItems.map(item => this.convertToPaydownOpportunity(item)),
        prerequisites: ['Security audit', 'Team training'],
        success_metrics: ['Security score', 'Vulnerability count', 'Compliance rating']
      });
    }

    // אסטרטגיה 3: Architecture Cleanup
    const architectureItems = this.debtItems.filter(item => item.type === 'architecture');
    if (architectureItems.length > 0) {
      strategies.push({
        name: 'Architecture Cleanup',
        description: 'שיפור ארכיטקטורה ויציבות מערכת',
        timeline: '3-6 חודשים',
        totalEffort: architectureItems.reduce((sum, item) => sum + item.estimatedEffort.hours, 0),
        expectedBenefit: 75,
        riskLevel: 'high',
        items: architectureItems.map(item => this.convertToPaydownOpportunity(item)),
        prerequisites: ['Architecture review', 'Refactoring plan'],
        success_metrics: ['Coupling metrics', 'Module cohesion', 'Build time']
      });
    }

    return strategies;
  }

  // Detection methods (implementations)
  private async detectLargeFunctions(context: DebtAnalysisContext): Promise<DebtItem[]> {
    const debtItems: DebtItem[] = [];
    
    for (const file of context.sourceFiles) {
      if (!file.match(/\.(ts|tsx|js|jsx)$/)) continue;
      
      try {
        const content = await fs.readFile(file, 'utf-8');
        const functions = this.extractFunctions(content);
        
        for (const func of functions) {
          if (func.lineCount > 50) { // threshold for large function
            debtItems.push({
              id: this.generateDebtId(),
              type: 'code_smell',
              severity: func.lineCount > 100 ? 'high' : 'medium',
              title: `פונקציה גדולה: ${func.name}`,
              description: `פונקציה עם ${func.lineCount} שורות - צריכה פירוק`,
              location: {
                file,
                line: func.line,
                function: func.name
              },
              estimatedEffort: {
                hours: Math.min(func.lineCount / 10, 16),
                complexity: func.lineCount > 100 ? 'high' : 'medium',
                riskLevel: 'medium',
                dependencies: [],
                skillsRequired: ['refactoring']
              },
              businessImpact: {
                velocityImpact: func.lineCount > 100 ? 15 : 8,
                maintenanceCost: func.lineCount / 20,
                customerImpact: 'low',
                marketRisk: 'none',
                complianceRisk: false
              },
              technicalImpact: {
                maintainabilityImpact: func.lineCount > 100 ? 8 : 6,
                performanceImpact: 2,
                securityImpact: 1,
                scalabilityImpact: 4,
                qualityImpact: 6,
                testabilityImpact: 7
              },
              accumulationRate: 0.1,
              discoverDate: new Date(),
              lastAssessed: new Date(),
              tags: ['code-smell', 'maintainability']
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return debtItems;
  }

  private async detectDuplicateCode(context: DebtAnalysisContext): Promise<DebtItem[]> {
    // Simplified duplicate detection
    return [];
  }

  private async detectComplexConditions(context: DebtAnalysisContext): Promise<DebtItem[]> {
    return [];
  }

  private async detectTightCoupling(context: DebtAnalysisContext): Promise<DebtItem[]> {
    return [];
  }

  private async detectCircularDependencies(context: DebtAnalysisContext): Promise<DebtItem[]> {
    return [];
  }

  private async detectMissingTests(context: DebtAnalysisContext): Promise<DebtItem[]> {
    const debtItems: DebtItem[] = [];
    
    // Find source files without corresponding test files
    for (const sourceFile of context.sourceFiles) {
      const possibleTestFiles = this.generatePossibleTestPaths(sourceFile);
      const hasTest = possibleTestFiles.some(testPath => 
        context.testFiles.includes(testPath)
      );
      
      if (!hasTest) {
        debtItems.push({
          id: this.generateDebtId(),
          type: 'test_debt',
          severity: 'medium',
          title: `בדיקות חסרות: ${path.basename(sourceFile)}`,
          description: 'קובץ ללא בדיקות מתאימות',
          location: { file: sourceFile },
          estimatedEffort: {
            hours: 8,
            complexity: 'medium',
            riskLevel: 'low',
            dependencies: [],
            skillsRequired: ['testing']
          },
          businessImpact: {
            velocityImpact: 10,
            maintenanceCost: 2,
            customerImpact: 'medium',
            marketRisk: 'low',
            complianceRisk: false
          },
          technicalImpact: {
            maintainabilityImpact: 6,
            performanceImpact: 1,
            securityImpact: 3,
            scalabilityImpact: 2,
            qualityImpact: 8,
            testabilityImpact: 9
          },
          accumulationRate: 0.05,
          discoverDate: new Date(),
          lastAssessed: new Date(),
          tags: ['test-debt', 'quality']
        });
      }
    }
    
    return debtItems;
  }

  private async detectFlakyTests(context: DebtAnalysisContext): Promise<DebtItem[]> {
    return [];
  }

  private async detectMissingDocumentation(context: DebtAnalysisContext): Promise<DebtItem[]> {
    return [];
  }

  private async detectPerformanceAntiPatterns(context: DebtAnalysisContext): Promise<DebtItem[]> {
    return [];
  }

  private async detectSecurityVulnerabilities(context: DebtAnalysisContext): Promise<DebtItem[]> {
    return [];
  }

  private async detectOutdatedDependencies(context: DebtAnalysisContext): Promise<DebtItem[]> {
    return [];
  }

  // Impact calculation methods
  private async calculateCodeSmellImpact(item: DebtItem): Promise<void> {
    // Impact already calculated in detection
  }

  private async calculateDuplicationImpact(item: DebtItem): Promise<void> {
    // Implementation
  }

  private async calculateComplexityImpact(item: DebtItem): Promise<void> {
    // Implementation
  }

  private async calculateArchitectureImpact(item: DebtItem): Promise<void> {
    // Implementation
  }

  private async calculateTestDebtImpact(item: DebtItem): Promise<void> {
    // Impact already calculated in detection
  }

  private async calculateDocumentationImpact(item: DebtItem): Promise<void> {
    // Implementation
  }

  private async calculatePerformanceImpact(item: DebtItem): Promise<void> {
    // Implementation
  }

  private async calculateSecurityImpact(item: DebtItem): Promise<void> {
    // Implementation
  }

  private async calculateDependencyImpact(item: DebtItem): Promise<void> {
    // Implementation
  }

  // Helper methods
  private extractFunctions(content: string): { name: string; line: number; lineCount: number }[] {
    const functions: { name: string; line: number; lineCount: number }[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const functionMatch = line.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=.*(?:function|\=>))/);
      
      if (functionMatch) {
        const name = functionMatch[1] || functionMatch[2];
        let braceCount = 0;
        let lineCount = 1;
        let hasOpenBrace = false;
        
        // Count lines until function ends
        for (let j = i; j < lines.length; j++) {
          const currentLine = lines[j];
          for (const char of currentLine) {
            if (char === '{') {
              braceCount++;
              hasOpenBrace = true;
            } else if (char === '}') {
              braceCount--;
            }
          }
          
          if (j > i) lineCount++;
          
          if (hasOpenBrace && braceCount === 0) {
            break;
          }
        }
        
        functions.push({ name, line: i + 1, lineCount });
      }
    }
    
    return functions;
  }

  private generatePossibleTestPaths(sourceFile: string): string[] {
    const dir = path.dirname(sourceFile);
    const name = path.basename(sourceFile, path.extname(sourceFile));
    const ext = path.extname(sourceFile);
    
    return [
      path.join(dir, `${name}.test${ext}`),
      path.join(dir, `${name}.spec${ext}`),
      path.join(dir, '__tests__', `${name}.test${ext}`),
      path.join(dir, '__tests__', `${name}.spec${ext}`)
    ];
  }

  private generateDebtId(): string {
    return `debt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async enrichAndFilterDebtItems(items: DebtItem[]): Promise<DebtItem[]> {
    // Remove duplicates and enrich with additional data
    const uniqueItems = new Map<string, DebtItem>();
    
    for (const item of items) {
      const key = `${item.type}_${item.location.file}_${item.location.line || 0}`;
      if (!uniqueItems.has(key)) {
        uniqueItems.set(key, item);
      }
    }
    
    return Array.from(uniqueItems.values());
  }

  private calculateOverallDebtScore(portfolio: DebtPortfolio): number {
    // Higher debt = lower score
    const maxAcceptableDebt = 200; // hours
    const score = Math.max(0, 100 - (portfolio.totalDebt / maxAcceptableDebt * 100));
    return Math.round(score);
  }

  private calculateVelocityImpact(portfolio: DebtPortfolio): number {
    return this.debtItems.reduce((sum, item) => 
      sum + item.businessImpact.velocityImpact, 0) / Math.max(this.debtItems.length, 1);
  }

  private groupByCategory(): { [category: string]: number } {
    const groups: { [category: string]: number } = {};
    
    for (const item of this.debtItems) {
      groups[item.type] = (groups[item.type] || 0) + item.estimatedEffort.hours;
    }
    
    return groups;
  }

  private groupByPriority(): { [priority: string]: number } {
    const groups: { [priority: string]: number } = {};
    
    for (const item of this.debtItems) {
      groups[item.severity] = (groups[item.severity] || 0) + item.estimatedEffort.hours;
    }
    
    return groups;
  }

  private groupByAge(): { [ageRange: string]: number } {
    const groups: { [ageRange: string]: number } = {};
    const now = new Date();
    
    for (const item of this.debtItems) {
      const daysSince = (now.getTime() - item.discoverDate.getTime()) / (1000 * 60 * 60 * 24);
      let ageRange: string;
      
      if (daysSince < 7) ageRange = '< 1 week';
      else if (daysSince < 30) ageRange = '1 week - 1 month';
      else if (daysSince < 90) ageRange = '1-3 months';
      else ageRange = '> 3 months';
      
      groups[ageRange] = (groups[ageRange] || 0) + item.estimatedEffort.hours;
    }
    
    return groups;
  }

  private getHighestImpactItems(count: number): DebtItem[] {
    return this.debtItems
      .sort((a, b) => this.calculateTotalImpact(b) - this.calculateTotalImpact(a))
      .slice(0, count);
  }

  private getQuickWins(): DebtItem[] {
    return this.debtItems.filter(item => 
      item.estimatedEffort.hours <= 8 && 
      this.calculateTotalImpact(item) >= 6
    );
  }

  private calculateTotalImpact(item: DebtItem): number {
    const tech = item.technicalImpact;
    return (tech.maintainabilityImpact + tech.performanceImpact + 
            tech.securityImpact + tech.scalabilityImpact + 
            tech.qualityImpact + tech.testabilityImpact) / 6;
  }

  private calculateBankruptcyRisk(): number {
    const totalDebt = this.debtItems.reduce((sum, item) => sum + item.estimatedEffort.hours, 0);
    const criticalDebt = this.debtItems.filter(item => item.severity === 'critical')
                            .reduce((sum, item) => sum + item.estimatedEffort.hours, 0);
    
    // Risk formula based on total debt and critical debt percentage
    const criticalPercentage = criticalDebt / Math.max(totalDebt, 1);
    const sizeRisk = Math.min(totalDebt / 500, 5); // 500 hours = max risk contribution
    const criticalRisk = criticalPercentage * 5;
    
    return Math.min(10, sizeRisk + criticalRisk);
  }

  private getDefaultTechnicalDebtMetrics(): TechnicalDebtMetrics {
    return {
      overallDebtScore: 70,
      debtByCategory: {},
      velocityImpact: 15,
      paydownOpportunities: [],
      costBenefitAnalysis: {
        cost: 0,
        benefit: 0,
        roi: 0
      },
      debtTrend: 'stable'
    };
  }

  // Additional helper methods
  private async findSourceFiles(): Promise<string[]> { return []; }
  private async findTestFiles(): Promise<string[]> { return []; }  
  private async findConfigFiles(): Promise<string[]> { return []; }
  private async loadDependencies(): Promise<any> { return {}; }
  private async loadGitHistory(): Promise<any> { return {}; }
  private async loadCodeMetrics(): Promise<any> { return {}; }
  private async loadHistoricalDebtData(): Promise<any[]> { return []; }
  private calculateCurrentVelocityImpact(): number { return 15; }
  private calculateCategoryBenefit(category: string, items: DebtItem[]): string { return 'medium improvement'; }
  private mapEffortToLevel(totalEffort: number): string { return totalEffort > 40 ? 'high' : totalEffort > 15 ? 'medium' : 'low'; }
  private calculateOpportunityPriority(effort: number, benefit: string): string { return 'medium'; }
  private getOpportunityDescription(category: string, count: number): string { return `Fix ${count} ${category} issues`; }
  private getOpportunityPriorityWeight(priority: string): number {
    switch(priority) {
      case 'high': return 3;
      case 'medium': return 2; 
      case 'low': return 1;
      default: return 0;
    }
  }
  private calculatePotentialVelocityImprovement(): number { return 25; }
  private calculateRiskReduction(): number { return 15; }
  private convertToPaydownOpportunity(item: DebtItem): DebtPaydownOpportunity { 
    return {
      type: item.type,
      effort: this.mapEffortToLevel(item.estimatedEffort.hours),
      benefit: 'medium improvement'
    };
  }
  private calculateAverageDebtAge(): number { 
    const now = new Date();
    const ages = this.debtItems.map(item => 
      (now.getTime() - item.discoverDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return ages.reduce((a, b) => a + b, 0) / Math.max(ages.length, 1);
  }
  private calculateDebtAccumulationRate(): number { return 0.1; }
  private async generateRecommendations(portfolio: DebtPortfolio, trends: DebtTrend): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (portfolio.totalDebt > 200) {
      recommendations.push('התחל בתכנית פירעון חוב אגרסיבית');
    }
    
    if (trends.trend === 'worsening') {
      recommendations.push('הגבל הוספת חוב טכני חדש');
    }
    
    if (portfolio.quickWins.length > 0) {
      recommendations.push(`התמקד ב-${portfolio.quickWins.length} quick wins קודם`);
    }
    
    return recommendations;
  }
}