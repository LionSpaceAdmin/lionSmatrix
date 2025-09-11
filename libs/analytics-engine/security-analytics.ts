/**
 * Security Analytics - מנתח אבטחה מתקדם עבור Lions of Zion
 * מבצע הערכת אבטחה מקיפה ומזהה איומים ופרצות
 */

import { AnalyticsConfig, SecurityAssessment, Vulnerability, AttackSurfaceAnalysis, ComplianceGap, SecurityPosture, ThreatTrend } from './index';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

export interface SecurityRule {
  id: string;
  name: string;
  category: 'vulnerability' | 'configuration' | 'dependency' | 'code_practice' | 'authentication' | 'authorization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  check: (context: SecurityContext) => Promise<SecurityFinding[]>;
  remediation: string;
  references: string[];
}

export interface SecurityContext {
  projectRoot: string;
  packageJson: any;
  dependencies: DependencyInfo[];
  sourceFiles: string[];
  configFiles: ConfigFileInfo[];
  environmentVars: string[];
}

export interface SecurityFinding {
  ruleId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location?: string;
  line?: number;
  column?: number;
  evidence?: string;
  recommendation: string;
  cweId?: string;
  cvssScore?: number;
}

export interface DependencyInfo {
  name: string;
  version: string;
  isDirect: boolean;
  vulnerabilities: DependencyVulnerability[];
  licenses: string[];
  isDevDependency: boolean;
}

export interface DependencyVulnerability {
  id: string;
  severity: string;
  title: string;
  description: string;
  patchedVersions: string[];
  vulnerableVersions: string[];
  cweId?: string;
  cvssScore?: number;
}

export interface ConfigFileInfo {
  path: string;
  type: 'env' | 'config' | 'docker' | 'nginx' | 'database' | 'other';
  permissions: string;
  containsSecrets: boolean;
  issues: string[];
}

export interface ThreatModel {
  assets: Asset[];
  threats: Threat[];
  vulnerabilities: ModelVulnerability[];
  mitigations: Mitigation[];
  riskScore: number;
}

export interface Asset {
  id: string;
  name: string;
  type: 'data' | 'service' | 'infrastructure' | 'user';
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  location: string;
}

export interface Threat {
  id: string;
  name: string;
  category: 'spoofing' | 'tampering' | 'repudiation' | 'information_disclosure' | 'denial_of_service' | 'elevation_of_privilege';
  likelihood: number; // 1-5
  impact: number; // 1-5
  affectedAssets: string[];
}

export interface ModelVulnerability {
  id: string;
  name: string;
  description: string;
  exploitability: number; // 1-5
  discoverability: number; // 1-5
  affectedAssets: string[];
}

export interface Mitigation {
  id: string;
  name: string;
  description: string;
  effectiveness: number; // 1-5
  implementationEffort: number; // 1-5
  mitigatedThreats: string[];
}

export class SecurityAnalytics {
  private config: AnalyticsConfig;
  private projectRoot: string;
  private securityRules: SecurityRule[] = [];
  private cache: Map<string, any> = new Map();

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.projectRoot = process.cwd();
    this.initializeSecurityRules();
  }

  /**
   * הערכת אבטחה מקיפה
   */
  public async assessSecurity(): Promise<SecurityAssessment> {
    console.log('🔒 מבצע הערכת אבטחה מקיפה ל-Lions of Zion...');

    try {
      const securityContext = await this.buildSecurityContext();
      
      const [
        vulnerabilities,
        attackSurface,
        complianceGaps,
        securityPosture,
        threatTrends
      ] = await Promise.all([
        this.scanVulnerabilities(securityContext),
        this.analyzeAttackSurface(securityContext),
        this.assessCompliance(securityContext),
        this.evaluateSecurityPosture(securityContext),
        this.analyzeThreatTrends(securityContext)
      ]);

      const overallRiskScore = this.calculateOverallRiskScore(vulnerabilities, attackSurface);

      console.log('✅ הערכת אבטחה הושלמה');
      console.log(`🔍 נמצאו ${vulnerabilities.length} פרצות`);
      console.log(`⚠️ ציון סיכון כללי: ${overallRiskScore}/10`);

      return {
        overallRiskScore,
        vulnerabilities,
        attackSurface,
        complianceGaps,
        securityPosture,
        threatTrends,
        recommendations: await this.generateSecurityRecommendations(vulnerabilities, attackSurface),
        threatModel: await this.generateThreatModel(securityContext)
      };

    } catch (error) {
      console.error('❌ שגיאה בהערכת אבטחה:', error);
      return this.getDefaultSecurityAssessment();
    }
  }

  /**
   * סריקה מהירה של אבטחה
   */
  public async quickSecurityScan(): Promise<SecurityAssessment> {
    console.log('🔒 סריקת אבטחה מהירה...');

    try {
      const criticalChecks = await this.performCriticalSecurityChecks();
      const dependencyVulnerabilities = await this.quickDependencyCheck();
      
      return {
        overallRiskScore: criticalChecks.riskScore,
        vulnerabilities: dependencyVulnerabilities,
        attackSurface: { score: 5, vectors: ['web', 'api'] },
        complianceGaps: [],
        securityPosture: { score: 70, improvements: [] },
        threatTrends: [],
        recommendations: [],
        threatModel: this.getBasicThreatModel()
      };

    } catch (error) {
      console.error('❌ שגיאה בסריקה מהירה:', error);
      return this.getDefaultSecurityAssessment();
    }
  }

  /**
   * בניית קונטקסט אבטחה
   */
  private async buildSecurityContext(): Promise<SecurityContext> {
    const [packageJson, dependencies, sourceFiles, configFiles, environmentVars] = await Promise.all([
      this.loadPackageJson(),
      this.analyzeDependencies(),
      this.findSourceFiles(),
      this.analyzeConfigFiles(),
      this.findEnvironmentVariables()
    ]);

    return {
      projectRoot: this.projectRoot,
      packageJson,
      dependencies,
      sourceFiles,
      configFiles,
      environmentVars
    };
  }

  /**
   * סריקת פרצות אבטחה
   */
  private async scanVulnerabilities(context: SecurityContext): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];

    // רץ על כל חוקי האבטחה
    for (const rule of this.securityRules) {
      try {
        const findings = await rule.check(context);
        
        for (const finding of findings) {
          vulnerabilities.push({
            id: finding.ruleId + '_' + this.generateId(),
            severity: finding.severity,
            title: finding.title,
            description: finding.description,
            location: finding.location,
            cweId: finding.cweId,
            cvssScore: finding.cvssScore,
            recommendation: finding.recommendation,
            category: rule.category,
            discovered: new Date(),
            status: 'open'
          });
        }
      } catch (error) {
        console.warn(`⚠️ שגיאה בחוקה ${rule.id}:`, error);
      }
    }

    // סינון וסידור לפי חומרה
    return vulnerabilities.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * ניתוח משטח התקפה
   */
  private async analyzeAttackSurface(context: SecurityContext): Promise<AttackSurfaceAnalysis> {
    const vectors: string[] = [];
    let score = 0;

    // בדיקת endpoints
    const apiEndpoints = await this.findAPIEndpoints(context.sourceFiles);
    if (apiEndpoints.length > 0) {
      vectors.push('API endpoints');
      score += Math.min(apiEndpoints.length * 0.5, 3);
    }

    // בדיקת forms
    const forms = await this.findForms(context.sourceFiles);
    if (forms.length > 0) {
      vectors.push('User input forms');
      score += Math.min(forms.length * 0.3, 2);
    }

    // בדיקת file uploads
    const fileUploads = await this.findFileUploads(context.sourceFiles);
    if (fileUploads.length > 0) {
      vectors.push('File uploads');
      score += Math.min(fileUploads.length * 1, 3);
    }

    // בדיקת external integrations
    const externalAPIs = await this.findExternalAPIUsage(context.sourceFiles);
    if (externalAPIs.length > 0) {
      vectors.push('External API integrations');
      score += Math.min(externalAPIs.length * 0.2, 1);
    }

    // בדיקת database connections
    const dbConnections = await this.findDatabaseConnections(context.sourceFiles);
    if (dbConnections.length > 0) {
      vectors.push('Database connections');
      score += Math.min(dbConnections.length * 0.5, 2);
    }

    return {
      score: Math.min(score, 10),
      vectors,
      endpoints: apiEndpoints.length,
      userInputs: forms.length + fileUploads.length,
      externalConnections: externalAPIs.length,
      dataExposure: this.assessDataExposure(context),
      recommendations: this.generateAttackSurfaceRecommendations(vectors, score)
    };
  }

  /**
   * הערכת תאימות
   */
  private async assessCompliance(context: SecurityContext): Promise<ComplianceGap[]> {
    const gaps: ComplianceGap[] = [];

    // OWASP Top 10 compliance
    const owaspGaps = await this.checkOWASPCompliance(context);
    gaps.push(...owaspGaps);

    // GDPR compliance (if applicable)
    const gdprGaps = await this.checkGDPRCompliance(context);
    gaps.push(...gdprGaps);

    // Security headers compliance
    const headersGaps = await this.checkSecurityHeaders(context);
    gaps.push(...headersGaps);

    return gaps;
  }

  /**
   * הערכת יציבות אבטחה
   */
  private async evaluateSecurityPosture(context: SecurityContext): Promise<SecurityPosture> {
    let score = 100;
    const improvements: string[] = [];

    // בדיקת authentication
    const authImplementation = await this.checkAuthImplementation(context);
    if (!authImplementation.isSecure) {
      score -= 20;
      improvements.push('שיפור מנגנון authentication');
    }

    // בדיקת authorization
    const authzImplementation = await this.checkAuthzImplementation(context);
    if (!authzImplementation.isSecure) {
      score -= 15;
      improvements.push('שיפור מנגנון authorization');
    }

    // בדיקת input validation
    const inputValidation = await this.checkInputValidation(context);
    if (!inputValidation.isSecure) {
      score -= 15;
      improvements.push('הוספת validation לכל inputs');
    }

    // בדיקת data encryption
    const encryption = await this.checkEncryption(context);
    if (!encryption.isSecure) {
      score -= 20;
      improvements.push('הוספת הצפנה לנתונים רגישים');
    }

    // בדיקת security headers
    const securityHeaders = await this.checkSecurityHeadersImplementation(context);
    if (!securityHeaders.isSecure) {
      score -= 10;
      improvements.push('הוספת security headers');
    }

    return {
      score: Math.max(0, score),
      maturityLevel: this.getMaturityLevel(score),
      strengths: this.identifySecurityStrengths(context),
      weaknesses: improvements,
      improvements: improvements.map(imp => ({
        area: imp,
        priority: 'high',
        effort: 'medium',
        impact: 'high'
      })),
      trend: await this.calculateSecurityTrend()
    };
  }

  /**
   * ניתוח מגמות איומים
   */
  private async analyzeThreatTrends(context: SecurityContext): Promise<ThreatTrend[]> {
    return [
      {
        type: 'dependency_vulnerabilities',
        trend: 'increasing',
        risk: 'high',
        description: 'עלייה במספר פרצות ב-dependencies',
        mitigation: 'עדכון תלויות באופן קבוע'
      },
      {
        type: 'supply_chain_attacks',
        trend: 'increasing',
        risk: 'medium',
        description: 'עלייה בהתקפות supply chain',
        mitigation: 'בדיקת integrity של packages'
      }
    ];
  }

  /**
   * אתחול חוקי אבטחה
   */
  private initializeSecurityRules(): void {
    this.securityRules = [
      // Dependency vulnerabilities
      {
        id: 'dependency_vulnerabilities',
        name: 'פרצות בתלויות',
        category: 'dependency',
        severity: 'high',
        description: 'בדיקת פרצות אבטחה בתלויות',
        check: async (context) => this.checkDependencyVulnerabilities(context),
        remediation: 'עדכן תלויות לגרסאות בטוחות',
        references: ['https://snyk.io/', 'https://github.com/advisories']
      },
      
      // Insecure secrets handling
      {
        id: 'hardcoded_secrets',
        name: 'סודות קשיחים בקוד',
        category: 'code_practice',
        severity: 'critical',
        description: 'זיהוי סודות וסיסמאות בקוד',
        check: async (context) => this.checkHardcodedSecrets(context),
        remediation: 'העבר סודות למשתני סביבה או vault',
        references: ['https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure']
      },

      // SQL Injection
      {
        id: 'sql_injection',
        name: 'פוטנציאל ל-SQL Injection',
        category: 'vulnerability',
        severity: 'critical',
        description: 'זיהוי קוד פגיע ל-SQL injection',
        check: async (context) => this.checkSQLInjection(context),
        remediation: 'השתמש ב-prepared statements או ORM',
        references: ['https://owasp.org/www-project-top-ten/2017/A1_2017-Injection']
      },

      // XSS vulnerabilities
      {
        id: 'xss_vulnerability',
        name: 'פוטנציאל ל-XSS',
        category: 'vulnerability',
        severity: 'high',
        description: 'זיהוי קוד פגיע ל-XSS attacks',
        check: async (context) => this.checkXSSVulnerabilities(context),
        remediation: 'השתמש ב-output encoding ו-CSP headers',
        references: ['https://owasp.org/www-project-top-ten/2017/A7_2017-Cross-Site_Scripting_(XSS)']
      },

      // Insecure authentication
      {
        id: 'weak_authentication',
        name: 'authentication חלש',
        category: 'authentication',
        severity: 'high',
        description: 'בדיקת חוזק מנגנון האימות',
        check: async (context) => this.checkWeakAuthentication(context),
        remediation: 'הוסף MFA ומנגנוני אימות חזקים',
        references: ['https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication']
      },

      // Missing security headers
      {
        id: 'missing_security_headers',
        name: 'security headers חסרים',
        category: 'configuration',
        severity: 'medium',
        description: 'בדיקת security headers בתגובות HTTP',
        check: async (context) => this.checkMissingSecurityHeaders(context),
        remediation: 'הוסף CSP, HSTS, X-Frame-Options ועוד',
        references: ['https://owasp.org/www-project-secure-headers/']
      },

      // Insecure file permissions
      {
        id: 'insecure_file_permissions',
        name: 'הרשאות קבצים לא בטוחות',
        category: 'configuration',
        severity: 'medium',
        description: 'בדיקת הרשאות קבצים רגישים',
        check: async (context) => this.checkFilePermissions(context),
        remediation: 'הגדר הרשאות מינימליות נדרשות',
        references: ['https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration']
      }
    ];
  }

  // Security check implementations
  private async checkDependencyVulnerabilities(context: SecurityContext): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    
    for (const dep of context.dependencies) {
      for (const vuln of dep.vulnerabilities) {
        findings.push({
          ruleId: 'dependency_vulnerabilities',
          severity: this.mapSeverity(vuln.severity),
          title: `פרצת אבטחה ב-${dep.name}`,
          description: `${vuln.title}: ${vuln.description}`,
          location: 'package.json',
          recommendation: `עדכן ${dep.name} לגרסה ${vuln.patchedVersions[0] || 'מתוקנת'}`,
          cweId: vuln.cweId,
          cvssScore: vuln.cvssScore
        });
      }
    }
    
    return findings;
  }

  private async checkHardcodedSecrets(context: SecurityContext): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    const secretPatterns = [
      /(?i)(password|pwd|secret|key|token|api[_-]?key)\s*[:=]\s*['"']([^'"'\s]{8,})['"']/g,
      /(?i)(access[_-]?token|auth[_-]?token)\s*[:=]\s*['"']([^'"'\s]{20,})['"']/g,
      /(?i)(database[_-]?url|db[_-]?url)\s*[:=]\s*['"']([^'"'\s]{10,})['"']/g
    ];

    for (const filePath of context.sourceFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        for (const pattern of secretPatterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lines = content.substring(0, match.index).split('\n');
            
            findings.push({
              ruleId: 'hardcoded_secrets',
              severity: 'critical',
              title: 'סוד קשיח נמצא בקוד',
              description: `נמצא ${match[1]} קשיח בקובץ`,
              location: filePath,
              line: lines.length,
              evidence: match[0].replace(match[2], '***'),
              recommendation: 'העבר למשתני סביבה או secrets manager'
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return findings;
  }

  private async checkSQLInjection(context: SecurityContext): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    const sqlInjectionPatterns = [
      /(?i)(query|execute)\s*\(\s*['"'][^'"]*\$\{[^}]+\}[^'"]*['"']/g,
      /(?i)(query|execute)\s*\(\s*['"'][^'"]*\+[^'"]*['"']/g
    ];

    for (const filePath of context.sourceFiles) {
      if (!filePath.match(/\.(ts|js|tsx|jsx)$/)) continue;
      
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        for (const pattern of sqlInjectionPatterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lines = content.substring(0, match.index).split('\n');
            
            findings.push({
              ruleId: 'sql_injection',
              severity: 'critical',
              title: 'פוטנציאל ל-SQL Injection',
              description: 'שאילתת SQL עם קלט משתמש לא מוגן',
              location: filePath,
              line: lines.length,
              evidence: match[0],
              recommendation: 'השתמש ב-prepared statements או parameterized queries'
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return findings;
  }

  private async checkXSSVulnerabilities(context: SecurityContext): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    const xssPatterns = [
      /dangerouslySetInnerHTML\s*=\s*\{\{?\s*__html\s*:\s*[^}]*\}\}?/g,
      /innerHTML\s*=\s*[^;]*[+${}]/g
    ];

    for (const filePath of context.sourceFiles) {
      if (!filePath.match(/\.(ts|js|tsx|jsx)$/)) continue;
      
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        for (const pattern of xssPatterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lines = content.substring(0, match.index).split('\n');
            
            findings.push({
              ruleId: 'xss_vulnerability',
              severity: 'high',
              title: 'פוטנציאל ל-XSS',
              description: 'הכנסת HTML דינמי ללא sanitization',
              location: filePath,
              line: lines.length,
              evidence: match[0],
              recommendation: 'השתמש ב-DOMPurify או שיטות בטוחות אחרות'
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return findings;
  }

  private async checkWeakAuthentication(context: SecurityContext): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    
    // Check for weak password requirements
    const authFiles = context.sourceFiles.filter(f => 
      f.includes('auth') || f.includes('login') || f.includes('password')
    );

    for (const filePath of authFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Check for weak password validation
        if (content.includes('password') && !content.includes('strength') && !content.includes('complexity')) {
          findings.push({
            ruleId: 'weak_authentication',
            severity: 'medium',
            title: 'validation סיסמה חלש',
            description: 'לא נמצאו בדיקות חוזק סיסמה',
            location: filePath,
            recommendation: 'הוסף בדיקות חוזק סיסמה ו-MFA'
          });
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return findings;
  }

  private async checkMissingSecurityHeaders(context: SecurityContext): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    
    // Look for Next.js config or middleware files
    const configFiles = context.sourceFiles.filter(f => 
      f.includes('next.config') || f.includes('middleware')
    );

    for (const filePath of configFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        const requiredHeaders = [
          'Content-Security-Policy',
          'X-Frame-Options', 
          'X-Content-Type-Options',
          'Referrer-Policy',
          'Strict-Transport-Security'
        ];

        const missingHeaders = requiredHeaders.filter(header => 
          !content.includes(header)
        );

        if (missingHeaders.length > 0) {
          findings.push({
            ruleId: 'missing_security_headers',
            severity: 'medium',
            title: `חסרים ${missingHeaders.length} security headers`,
            description: `Headers חסרים: ${missingHeaders.join(', ')}`,
            location: filePath,
            recommendation: 'הוסף security headers ל-Next.js config'
          });
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return findings;
  }

  private async checkFilePermissions(context: SecurityContext): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    
    for (const configFile of context.configFiles) {
      if (configFile.containsSecrets && configFile.permissions.includes('r--r--r--')) {
        findings.push({
          ruleId: 'insecure_file_permissions',
          severity: 'medium',
          title: 'הרשאות קובץ לא בטוחות',
          description: `קובץ עם סודות ${configFile.path} קריא לכולם`,
          location: configFile.path,
          recommendation: 'הגדר הרשאות 600 (רק לבעלים)'
        });
      }
    }

    return findings;
  }

  // Helper methods
  private generateId(): string {
    return crypto.randomBytes(4).toString('hex');
  }

  private mapSeverity(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (severity.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high'; 
      case 'medium': case 'moderate': return 'medium';
      case 'low': case 'info': return 'low';
      default: return 'medium';
    }
  }

  private calculateOverallRiskScore(vulnerabilities: Vulnerability[], attackSurface: AttackSurfaceAnalysis): number {
    let score = 0;
    
    // Score based on vulnerabilities
    for (const vuln of vulnerabilities) {
      switch (vuln.severity) {
        case 'critical': score += 4; break;
        case 'high': score += 3; break;
        case 'medium': score += 2; break;
        case 'low': score += 1; break;
      }
    }
    
    // Add attack surface score
    score += attackSurface.score;
    
    // Normalize to 0-10 scale
    return Math.min(10, score / 2);
  }

  private getMaturityLevel(score: number): string {
    if (score >= 90) return 'advanced';
    if (score >= 70) return 'intermediate';
    if (score >= 50) return 'basic';
    return 'initial';
  }

  // Stub implementations for complex checks
  private async loadPackageJson(): Promise<any> {
    try {
      const content = await fs.readFile(path.join(this.projectRoot, 'package.json'), 'utf-8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  private async analyzeDependencies(): Promise<DependencyInfo[]> {
    // Placeholder implementation
    return [];
  }

  private async findSourceFiles(): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async analyzeConfigFiles(): Promise<ConfigFileInfo[]> {
    // Placeholder implementation
    return [];
  }

  private async findEnvironmentVariables(): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async performCriticalSecurityChecks(): Promise<{ riskScore: number }> {
    return { riskScore: 5 };
  }

  private async quickDependencyCheck(): Promise<Vulnerability[]> {
    return [];
  }

  private getBasicThreatModel(): ThreatModel {
    return {
      assets: [],
      threats: [],
      vulnerabilities: [],
      mitigations: [],
      riskScore: 5
    };
  }

  private async generateSecurityRecommendations(vulnerabilities: Vulnerability[], attackSurface: AttackSurfaceAnalysis): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (vulnerabilities.length > 0) {
      recommendations.push('תקן פרצות אבטחה קריטיות מידיית');
    }
    
    if (attackSurface.score > 7) {
      recommendations.push('צמצם את משטח ההתקפה');
    }
    
    return recommendations;
  }

  private async generateThreatModel(context: SecurityContext): Promise<ThreatModel> {
    return this.getBasicThreatModel();
  }

  private getDefaultSecurityAssessment(): SecurityAssessment {
    return {
      overallRiskScore: 5,
      vulnerabilities: [],
      attackSurface: { score: 5, vectors: [] },
      complianceGaps: [],
      securityPosture: { score: 50, improvements: [] },
      threatTrends: [],
      recommendations: [],
      threatModel: this.getBasicThreatModel()
    };
  }

  // Additional stub methods
  private async findAPIEndpoints(sourceFiles: string[]): Promise<string[]> { return []; }
  private async findForms(sourceFiles: string[]): Promise<string[]> { return []; }
  private async findFileUploads(sourceFiles: string[]): Promise<string[]> { return []; }
  private async findExternalAPIUsage(sourceFiles: string[]): Promise<string[]> { return []; }
  private async findDatabaseConnections(sourceFiles: string[]): Promise<string[]> { return []; }
  private assessDataExposure(context: SecurityContext): string { return 'low'; }
  private generateAttackSurfaceRecommendations(vectors: string[], score: number): string[] { return []; }
  private async checkOWASPCompliance(context: SecurityContext): Promise<ComplianceGap[]> { return []; }
  private async checkGDPRCompliance(context: SecurityContext): Promise<ComplianceGap[]> { return []; }
  private async checkSecurityHeaders(context: SecurityContext): Promise<ComplianceGap[]> { return []; }
  private async checkAuthImplementation(context: SecurityContext): Promise<{ isSecure: boolean }> { return { isSecure: true }; }
  private async checkAuthzImplementation(context: SecurityContext): Promise<{ isSecure: boolean }> { return { isSecure: true }; }
  private async checkInputValidation(context: SecurityContext): Promise<{ isSecure: boolean }> { return { isSecure: true }; }
  private async checkEncryption(context: SecurityContext): Promise<{ isSecure: boolean }> { return { isSecure: true }; }
  private async checkSecurityHeadersImplementation(context: SecurityContext): Promise<{ isSecure: boolean }> { return { isSecure: true }; }
  private identifySecurityStrengths(context: SecurityContext): string[] { return []; }
  private async calculateSecurityTrend(): Promise<string> { return 'stable'; }
}