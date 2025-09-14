/**
 * Security Scanner
 * Advanced security vulnerability detection and assessment
 */

import { SmartIndicator, IndicatorThresholds, IndicatorLevel } from './index';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

interface SecurityVulnerability {
  id: string;
  severity: IndicatorLevel.CRITICAL | 'high' | 'medium' | 'low';
  category: 'xss' | 'injection' | 'auth' | 'data-exposure' | 'dependency' | 'configuration';
  title: string;
  description: string;
  file: string;
  line?: number;
  cwe?: string; // Common Weakness Enumeration
  owasp?: string; // OWASP Top 10 reference
  impact: string;
  remediation: string;
  confidence: 'high' | 'medium' | 'low';
}

interface DependencyVulnerability {
  package: string;
  version: string;
  vulnerability: {
    id: string;
    severity: string;
    title: string;
    description: string;
    references: string[];
  };
  patchVersion?: string;
}

interface AuthenticationGaps {
  missingAuthentication: string[];
  weakPasswordPolicies: string[];
  insecureSessionHandling: string[];
  missingRoleBasedAccess: string[];
}

interface DataExposureRisks {
  hardcodedSecrets: { file: string; type: string; line: number }[];
  loggingSensitiveData: string[];
  unsecuredApiEndpoints: string[];
  clientSideSecrets: string[];
}

interface ConfigurationIssues {
  insecureDefaults: string[];
  missingSecurityHeaders: string[];
  debugModeInProduction: string[];
  insecureCommunication: string[];
}

export class SecurityScanner {
  private thresholds: IndicatorThresholds;
  private projectRoot: string;
  private packageJsonPath: string;
  private envFiles: string[] = ['.env', '.env.local', '.env.production', '.env.development'];

  // Security patterns to detect
  private sensitivePatterns = {
    secrets: [
      { name: 'API Key', pattern: /(?:api[_-]?key|apikey|secret[_-]?key)\s*[=:]\s*['"]\w{10,}['"]/, severity: IndicatorLevel.CRITICAL as const },
      { name: 'Database Password', pattern: /(?:db[_-]?pass|database[_-]?password|mysql[_-]?pass)\s*[=:]\s*['"]\w{6,}['"]/, severity: IndicatorLevel.CRITICAL as const },
      { name: 'JWT Secret', pattern: /(?:jwt[_-]?secret|token[_-]?secret)\s*[=:]\s*['"]\w{16,}['"]/, severity: IndicatorLevel.CRITICAL as const },
      { name: 'Private Key', pattern: /-----BEGIN (?:RSA )?PRIVATE KEY-----/, severity: IndicatorLevel.CRITICAL as const },
      { name: 'OAuth Token', pattern: /(?:oauth[_-]?token|access[_-]?token)\s*[=:]\s*['"]\w{20,}['"]/, severity: 'high' as const },
      { name: 'Email Credentials', pattern: /(?:smtp[_-]?pass|email[_-]?pass|mail[_-]?pass)\s*[=:]\s*['"]\w{6,}['"]/, severity: 'high' as const },
    ],
    xssVulnerable: [
      { name: 'Dangerous innerHTML', pattern: /\.innerHTML\s*=\s*[^'"]*\+/, severity: 'high' as const },
      { name: 'Direct DOM manipulation', pattern: /document\.write\s*\(/, severity: 'medium' as const },
      { name: 'Eval usage', pattern: /eval\s*\(/, severity: 'high' as const },
      { name: 'Function constructor', pattern: /new\s+Function\s*\(/, severity: 'medium' as const },
    ],
    injection: [
      { name: 'SQL Injection Risk', pattern: /(['"]).*\+.*\1.*(?:SELECT|INSERT|UPDATE|DELETE)/i, severity: IndicatorLevel.CRITICAL as const },
      { name: 'Command Injection', pattern: /exec\s*\(\s*[^)]*\+/, severity: IndicatorLevel.CRITICAL as const },
      { name: 'Path Traversal', pattern: /(?:\.\.\/|\.\.\\)+/, severity: 'medium' as const },
    ],
    insecureAuth: [
      { name: 'Hardcoded Password', pattern: /password\s*[=:]\s*['"][^'"]{1,}['"]/, severity: IndicatorLevel.CRITICAL as const },
      { name: 'Weak Session ID', pattern: /sessionid\s*[=:]\s*['"][^'"]{'<'10}['"]/, severity: 'high' as const },
      { name: 'Insecure Random', pattern: /Math\.random\(\)/, severity: 'low' as const },
    ],
    dataExposure: [
      { name: 'Console.log sensitive', pattern: /console\.log\s*\([^)]*(?:password|token|key|secret)/i, severity: 'medium' as const },
      { name: 'Alert sensitive', pattern: /alert\s*\([^)]*(?:password|token|key|secret)/i, severity: 'high' as const },
      { name: 'Fetch without auth', pattern: /fetch\s*\(\s*['"][^'"]*api[^'"]*['"]\s*\)/, severity: 'low' as const },
    ]
  };

  private secureHeaders = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Strict-Transport-Security'
  ];

  constructor(thresholds: IndicatorThresholds) {
    this.thresholds = thresholds;
    this.projectRoot = process.cwd();
    this.packageJsonPath = join(this.projectRoot, 'package.json');
  }

  async initialize(): Promise<void> {
    // Validate project structure for security scanning
    if (!existsSync(this.packageJsonPath)) {
      console.warn('No package.json found - dependency vulnerability scanning will be limited');
    }
  }

  async analyze(): Promise<SmartIndicator[]> {
    const indicators: SmartIndicator[] = [];

    try {
      // Overall security score
      const overallScore = await this.calculateOverallSecurityScore();
      indicators.push(this.createIndicator({
        id: 'security-score-overall',
        type: 'security',
        title: 'Overall Security Score',
        description: 'Comprehensive security assessment score',
        value: overallScore,
        unit: '%',
        category: 'overview'
      }));

      // Vulnerability scanning
      const vulnerabilities = await this.scanForVulnerabilities();
      indicators.push(...this.createVulnerabilityIndicators(vulnerabilities));

      // Dependency security check
      const dependencyVulns = await this.checkDependencyVulnerabilities();
      indicators.push(...this.createDependencyVulnerabilityIndicators(dependencyVulns));

      // Authentication gaps assessment
      const authGaps = await this.assessAuthenticationGaps();
      indicators.push(...this.createAuthenticationGapIndicators(authGaps));

      // Data exposure risks
      const dataRisks = await this.identifyDataExposureRisks();
      indicators.push(...this.createDataExposureIndicators(dataRisks));

      // Configuration security issues
      const configIssues = await this.checkConfigurationSecurity();
      indicators.push(...this.createConfigurationIndicators(configIssues));

      // Environment variable security
      const envSecurity = await this.auditEnvironmentVariables();
      indicators.push(...envSecurity);

      // OWASP Top 10 compliance
      const owaspCompliance = await this.assessOwaspCompliance(vulnerabilities);
      indicators.push(...this.createOwaspComplianceIndicators(owaspCompliance));

    } catch (error) {
      console.error('Security analysis failed:', error);
      indicators.push(this.createErrorIndicator('security-analysis-failed', error));
    }

    return indicators;
  }

  private async calculateOverallSecurityScore(): Promise<number> {
    const factors = await Promise.allSettled([
      this.getVulnerabilityScore(),
      this.getDependencySecurityScore(),
      this.getAuthenticationScore(),
      this.getDataProtectionScore(),
      this.getConfigurationSecurityScore()
    ]);

    const validScores = factors
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<number>).value);

    if (validScores.length === 0) return 0;

    // Weighted average (security-focused)
    const weights = [0.3, 0.25, 0.2, 0.15, 0.1]; // Vulnerabilities, Dependencies, Auth, Data, Config
    let weightedSum = 0;
    let totalWeight = 0;

    validScores.forEach((score, index) => {
      if (index < weights.length) {
        weightedSum += score * weights[index];
        totalWeight += weights[index];
      }
    });

    return Math.round(weightedSum / totalWeight);
  }

  private async scanForVulnerabilities(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    try {
      const sourceFiles = await this.getSourceFiles();
      
      for (const file of sourceFiles) {
        try {
          const content = readFileSync(file, 'utf-8');
          const lines = content.split('\n');
          const relativePath = file.replace(this.projectRoot, '');

          // Scan for different types of vulnerabilities
          vulnerabilities.push(...this.scanForSecrets(content, lines, relativePath));
          vulnerabilities.push(...this.scanForXSSVulnerabilities(content, lines, relativePath));
          vulnerabilities.push(...this.scanForInjectionVulnerabilities(content, lines, relativePath));
          vulnerabilities.push(...this.scanForInsecureAuthentication(content, lines, relativePath));
          vulnerabilities.push(...this.scanForDataExposure(content, lines, relativePath));

        } catch (error) {
          console.error(`Failed to scan file ${file}:`, error);
        }
      }

      // Scan configuration files
      vulnerabilities.push(...await this.scanConfigurationFiles());

    } catch (error) {
      console.error('Vulnerability scanning failed:', error);
    }

    return vulnerabilities;
  }

  private scanForSecrets(content: string, lines: string[], file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    for (const pattern of this.sensitivePatterns.secrets) {
      const matches = content.matchAll(new RegExp(pattern.pattern.source, 'gi'));
      
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        vulnerabilities.push({
          id: `secret-${pattern.name.toLowerCase().replace(/\s+/g, '-')}-${file}-${lineNumber}`,
          severity: pattern.severity,
          category: 'data-exposure',
          title: `Hardcoded ${pattern.name}`,
          description: `Potential hardcoded ${pattern.name.toLowerCase()} detected`,
          file,
          line: lineNumber,
          cwe: 'CWE-798',
          owasp: 'A02:2021 – Cryptographic Failures',
          impact: 'Exposure of sensitive credentials could lead to unauthorized access',
          remediation: 'Move sensitive values to environment variables or secure configuration',
          confidence: 'high'
        });
      }
    }
    
    return vulnerabilities;
  }

  private scanForXSSVulnerabilities(content: string, lines: string[], file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    for (const pattern of this.sensitivePatterns.xssVulnerable) {
      const matches = content.matchAll(new RegExp(pattern.pattern.source, 'gi'));
      
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        vulnerabilities.push({
          id: `xss-${pattern.name.toLowerCase().replace(/\s+/g, '-')}-${file}-${lineNumber}`,
          severity: pattern.severity,
          category: 'xss',
          title: pattern.name,
          description: 'Potential Cross-Site Scripting (XSS) vulnerability',
          file,
          line: lineNumber,
          cwe: 'CWE-79',
          owasp: 'A03:2021 – Injection',
          impact: 'Could allow attackers to execute malicious scripts in user browsers',
          remediation: 'Sanitize user input and use safe DOM manipulation methods',
          confidence: 'medium'
        });
      }
    }
    
    return vulnerabilities;
  }

  private scanForInjectionVulnerabilities(content: string, lines: string[], file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    for (const pattern of this.sensitivePatterns.injection) {
      const matches = content.matchAll(new RegExp(pattern.pattern.source, 'gi'));
      
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        vulnerabilities.push({
          id: `injection-${pattern.name.toLowerCase().replace(/\s+/g, '-')}-${file}-${lineNumber}`,
          severity: pattern.severity,
          category: 'injection',
          title: pattern.name,
          description: 'Potential injection vulnerability detected',
          file,
          line: lineNumber,
          cwe: pattern.name.includes('SQL') ? 'CWE-89' : 'CWE-78',
          owasp: 'A03:2021 – Injection',
          impact: 'Could allow attackers to execute unauthorized commands or queries',
          remediation: 'Use parameterized queries and input validation',
          confidence: 'high'
        });
      }
    }
    
    return vulnerabilities;
  }

  private scanForInsecureAuthentication(content: string, lines: string[], file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    for (const pattern of this.sensitivePatterns.insecureAuth) {
      const matches = content.matchAll(new RegExp(pattern.pattern.source, 'gi'));
      
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        vulnerabilities.push({
          id: `auth-${pattern.name.toLowerCase().replace(/\s+/g, '-')}-${file}-${lineNumber}`,
          severity: pattern.severity,
          category: 'auth',
          title: pattern.name,
          description: 'Insecure authentication practice detected',
          file,
          line: lineNumber,
          cwe: 'CWE-287',
          owasp: 'A07:2021 – Identification and Authentication Failures',
          impact: 'Could compromise user authentication security',
          remediation: 'Use secure authentication libraries and practices',
          confidence: 'medium'
        });
      }
    }
    
    return vulnerabilities;
  }

  private scanForDataExposure(content: string, lines: string[], file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    for (const pattern of this.sensitivePatterns.dataExposure) {
      const matches = content.matchAll(new RegExp(pattern.pattern.source, 'gi'));
      
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        vulnerabilities.push({
          id: `exposure-${pattern.name.toLowerCase().replace(/\s+/g, '-')}-${file}-${lineNumber}`,
          severity: pattern.severity,
          category: 'data-exposure',
          title: pattern.name,
          description: 'Potential sensitive data exposure',
          file,
          line: lineNumber,
          cwe: 'CWE-200',
          owasp: 'A01:2021 – Broken Access Control',
          impact: 'Could expose sensitive information to unauthorized parties',
          remediation: 'Remove or secure sensitive data logging',
          confidence: 'medium'
        });
      }
    }
    
    return vulnerabilities;
  }

  private async scanConfigurationFiles(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    try {
      // Check Next.js configuration
      const nextConfigPath = join(this.projectRoot, 'next.config.js');
      if (existsSync(nextConfigPath)) {
        const content = readFileSync(nextConfigPath, 'utf-8');
        
        if (content.includes('xPoweredBy: true') || !content.includes('xPoweredBy: false')) {
          vulnerabilities.push({
            id: 'config-x-powered-by',
            severity: 'low',
            category: 'configuration',
            title: 'X-Powered-By Header Exposed',
            description: 'X-Powered-By header reveals technology stack',
            file: '/next.config.js',
            cwe: 'CWE-200',
            owasp: 'A01:2021 – Broken Access Control',
            impact: 'Information disclosure about technology stack',
            remediation: 'Set xPoweredBy: false in Next.js configuration',
            confidence: 'high'
          });
        }
      }

      // Check for debug mode in production
      const packageJsonContent = existsSync(this.packageJsonPath) ? 
        JSON.parse(readFileSync(this.packageJsonPath, 'utf-8')) : {};
      
      if (packageJsonContent.scripts?.start?.includes('--debug') ||
          packageJsonContent.scripts?.build?.includes('--debug')) {
        vulnerabilities.push({
          id: 'config-debug-mode',
          severity: 'medium',
          category: 'configuration',
          title: 'Debug Mode in Production',
          description: 'Debug mode may be enabled in production scripts',
          file: '/package.json',
          cwe: 'CWE-489',
          owasp: 'A05:2021 – Security Misconfiguration',
          impact: 'Could expose sensitive debugging information',
          remediation: 'Remove debug flags from production scripts',
          confidence: 'high'
        });
      }

    } catch (error) {
      console.error('Configuration scanning failed:', error);
    }
    
    return vulnerabilities;
  }

  private async checkDependencyVulnerabilities(): Promise<DependencyVulnerability[]> {
    // In a real implementation, this would integrate with npm audit, Snyk, or similar services
    // For now, we'll simulate some common vulnerability patterns
    
    const vulnerabilities: DependencyVulnerability[] = [];
    
    try {
      if (!existsSync(this.packageJsonPath)) return vulnerabilities;
      
      const packageJson = JSON.parse(readFileSync(this.packageJsonPath, 'utf-8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Mock vulnerability data based on common issues
      const knownVulnerablePackages = [
        { name: 'lodash', versions: ['<4.17.21'], severity: 'high' },
        { name: 'moment', versions: ['<2.29.2'], severity: 'medium' },
        { name: 'axios', versions: ['<0.21.2'], severity: 'high' },
        { name: 'serialize-javascript', versions: ['<3.1.0'], severity: 'high' },
        { name: 'marked', versions: ['<4.0.10'], severity: 'high' }
      ];
      
      for (const [pkg, version] of Object.entries(dependencies)) {
        const vulnInfo = knownVulnerablePackages.find(v => v.name === pkg);
        if (vulnInfo) {
          vulnerabilities.push({
            package: pkg,
            version: version as string,
            vulnerability: {
              id: `CVE-2021-${Math.floor(Math.random() * 10000)}`, // Mock CVE
              severity: vulnInfo.severity,
              title: `Security vulnerability in ${pkg}`,
              description: `Known security vulnerability in ${pkg} version ${version}`,
              references: [`https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-${Math.floor(Math.random() * 10000)}`]
            },
            patchVersion: 'latest'
          });
        }
      }
      
    } catch (error) {
      console.error('Dependency vulnerability check failed:', error);
    }
    
    return vulnerabilities;
  }

  private async assessAuthenticationGaps(): Promise<AuthenticationGaps> {
    const gaps: AuthenticationGaps = {
      missingAuthentication: [],
      weakPasswordPolicies: [],
      insecureSessionHandling: [],
      missingRoleBasedAccess: []
    };
    
    try {
      const sourceFiles = await this.getSourceFiles();
      
      // Check for API routes without authentication
      for (const file of sourceFiles) {
        if (file.includes('/api/') && file.includes('.ts')) {
          const content = readFileSync(file, 'utf-8');
          const relativePath = file.replace(this.projectRoot, '');
          
          // Simple check for authentication patterns
          const hasAuth = /(?:authenticate|auth|jwt|session|token)/i.test(content);
          const isPublicRoute = /(?:public|login|register|health|status)/i.test(file);
          
          if (!hasAuth && !isPublicRoute) {
            gaps.missingAuthentication.push(relativePath);
          }
          
          // Check for weak session handling
          if (content.includes('Math.random()') && content.includes('session')) {
            gaps.insecureSessionHandling.push(relativePath);
          }
        }
      }
      
      // Check authentication configuration
      const authFiles = sourceFiles.filter(f => 
        f.includes('auth') || f.includes('middleware') || f.includes('session')
      );
      
      for (const file of authFiles) {
        const content = readFileSync(file, 'utf-8');
        const relativePath = file.replace(this.projectRoot, '');
        
        // Check for role-based access control
        const hasRBAC = /(?:role|permission|authorize|can|ability)/i.test(content);
        if (!hasRBAC && content.includes('auth')) {
          gaps.missingRoleBasedAccess.push(relativePath);
        }
      }
      
    } catch (error) {
      console.error('Authentication gap assessment failed:', error);
    }
    
    return gaps;
  }

  private async identifyDataExposureRisks(): Promise<DataExposureRisks> {
    const risks: DataExposureRisks = {
      hardcodedSecrets: [],
      loggingSensitiveData: [],
      unsecuredApiEndpoints: [],
      clientSideSecrets: []
    };
    
    try {
      const sourceFiles = await this.getSourceFiles();
      
      for (const file of sourceFiles) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        const relativePath = file.replace(this.projectRoot, '');
        
        // Check for hardcoded secrets
        for (const pattern of this.sensitivePatterns.secrets) {
          const matches = content.matchAll(new RegExp(pattern.pattern.source, 'gi'));
          for (const match of matches) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            risks.hardcodedSecrets.push({
              file: relativePath,
              type: pattern.name,
              line: lineNumber
            });
          }
        }
        
        // Check for sensitive data logging
        const sensitiveLogging = /console\.log\s*\([^)]*(?:password|token|secret|key|credential)/gi;
        if (sensitiveLogging.test(content)) {
          risks.loggingSensitiveData.push(relativePath);
        }
        
        // Check for client-side secrets (in frontend files)
        if (file.includes('/components/') || file.includes('/pages/') || file.includes('/app/')) {
          const hasSecrets = /(?:api[_-]?key|secret[_-]?key|private[_-]?key)\s*[=:]/i.test(content);
          if (hasSecrets) {
            risks.clientSideSecrets.push(relativePath);
          }
        }
        
        // Check for unsecured API endpoints
        if (file.includes('/api/')) {
          const hasValidation = /(?:validate|sanitize|escape|filter)/i.test(content);
          const hasInputHandling = /req\.body|req\.query|req\.params/i.test(content);
          
          if (hasInputHandling && !hasValidation) {
            risks.unsecuredApiEndpoints.push(relativePath);
          }
        }
      }
      
    } catch (error) {
      console.error('Data exposure risk identification failed:', error);
    }
    
    return risks;
  }

  private async checkConfigurationSecurity(): Promise<ConfigurationIssues> {
    const issues: ConfigurationIssues = {
      insecureDefaults: [],
      missingSecurityHeaders: [],
      debugModeInProduction: [],
      insecureCommunication: []
    };
    
    try {
      // Check Next.js middleware for security headers
      const middlewarePath = join(this.projectRoot, 'middleware.ts');
      if (existsSync(middlewarePath)) {
        const content = readFileSync(middlewarePath, 'utf-8');
        
        for (const header of this.secureHeaders) {
          if (!content.includes(header)) {
            issues.missingSecurityHeaders.push(header);
          }
        }
      } else {
        issues.missingSecurityHeaders.push(...this.secureHeaders);
      }
      
      // Check environment files for insecure settings
      for (const envFile of this.envFiles) {
        const envPath = join(this.projectRoot, envFile);
        if (existsSync(envPath)) {
          const content = readFileSync(envPath, 'utf-8');
          
          // Check for debug mode
          if (content.includes('NODE_ENV=development') && envFile.includes('production')) {
            issues.debugModeInProduction.push(envFile);
          }
          
          // Check for insecure communication
          if (content.includes('http://') && !content.includes('localhost')) {
            issues.insecureCommunication.push(envFile);
          }
        }
      }
      
      // Check package.json for insecure defaults
      if (existsSync(this.packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(this.packageJsonPath, 'utf-8'));
        
        if (packageJson.scripts?.start?.includes('--unsafe')) {
          issues.insecureDefaults.push('Unsafe flags in start script');
        }
      }
      
    } catch (error) {
      console.error('Configuration security check failed:', error);
    }
    
    return issues;
  }

  private async auditEnvironmentVariables(): Promise<SmartIndicator[]> {
    const indicators: SmartIndicator[] = [];
    
    try {
      let secureVars = 0;
      let insecureVars = 0;
      let totalVars = 0;
      
      for (const envFile of this.envFiles) {
        const envPath = join(this.projectRoot, envFile);
        if (existsSync(envPath)) {
          const content = readFileSync(envPath, 'utf-8');
          const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
          
          totalVars += lines.length;
          
          for (const line of lines) {
            const [key, value] = line.split('=');
            
            if (key && value) {
              // Check if sensitive variables are properly handled
              const isSensitive = /(?:key|secret|password|token|credential)/i.test(key);
              const hasSecureValue = value.startsWith('"') && value.endsWith('"') && value.length > 10;
              
              if (isSensitive) {
                if (hasSecureValue) {
                  secureVars++;
                } else {
                  insecureVars++;
                }
              } else {
                secureVars++; // Non-sensitive vars are considered secure
              }
            }
          }
        }
      }
      
      if (totalVars > 0) {
        const securityRatio = (secureVars / totalVars) * 100;
        
        indicators.push(this.createIndicator({
          id: 'environment-variable-security',
          type: 'security',
          title: 'Environment Variable Security',
          description: 'Security assessment of environment variables',
          value: Math.round(securityRatio),
          unit: '%',
          category: 'configuration',
          level: securityRatio < 80 ? IndicatorLevel.WARNING : IndicatorLevel.INFO
        }));
        
        if (insecureVars > 0) {
          indicators.push(this.createIndicator({
            id: 'insecure-environment-variables',
            type: 'security',
            title: 'Insecure Environment Variables',
            description: `${insecureVars} environment variables may be insecurely configured`,
            value: insecureVars,
            category: 'configuration',
            level: IndicatorLevel.WARNING,
            actionable: true,
            suggestion: 'Ensure sensitive environment variables are properly quoted and validated'
          }));
        }
      }
      
    } catch (error) {
      console.error('Environment variable audit failed:', error);
    }
    
    return indicators;
  }

  private async assessOwaspCompliance(vulnerabilities: SecurityVulnerability[]): Promise<{ [key: string]: number }> {
    const owaspCategories = {
      'A01:2021 – Broken Access Control': 0,
      'A02:2021 – Cryptographic Failures': 0,
      'A03:2021 – Injection': 0,
      'A04:2021 – Insecure Design': 0,
      'A05:2021 – Security Misconfiguration': 0,
      'A06:2021 – Vulnerable Components': 0,
      'A07:2021 – Identification and Authentication Failures': 0,
      'A08:2021 – Software Integrity Failures': 0,
      'A09:2021 – Security Logging Monitoring Failures': 0,
      'A10:2021 – Server-Side Request Forgery': 0
    };
    
    // Count vulnerabilities by OWASP category
    for (const vuln of vulnerabilities) {
      if (vuln.owasp && owaspCategories.hasOwnProperty(vuln.owasp)) {
        owaspCategories[vuln.owasp]++;
      }
    }
    
    // Convert counts to compliance scores (0-100)
    const complianceScores: { [key: string]: number } = {};
    for (const [category, count] of Object.entries(owaspCategories)) {
      // Higher count = lower compliance score
      complianceScores[category] = Math.max(0, 100 - (count * 20));
    }
    
    return complianceScores;
  }

  // Score calculation methods
  private async getVulnerabilityScore(): Promise<number> {
    const vulnerabilities = await this.scanForVulnerabilities();
    
    let score = 100;
    
    for (const vuln of vulnerabilities) {
      const penalty = {
        critical: 30,
        high: 20,
        medium: 10,
        low: 5
      }[vuln.severity];
      
      score -= penalty;
    }
    
    return Math.max(0, score);
  }

  private async getDependencySecurityScore(): Promise<number> {
    const depVulns = await this.checkDependencyVulnerabilities();
    
    let score = 100;
    score -= depVulns.length * 15; // 15 points per vulnerable dependency
    
    return Math.max(0, score);
  }

  private async getAuthenticationScore(): Promise<number> {
    const authGaps = await this.assessAuthenticationGaps();
    
    let score = 100;
    score -= authGaps.missingAuthentication.length * 20;
    score -= authGaps.weakPasswordPolicies.length * 15;
    score -= authGaps.insecureSessionHandling.length * 25;
    score -= authGaps.missingRoleBasedAccess.length * 10;
    
    return Math.max(0, score);
  }

  private async getDataProtectionScore(): Promise<number> {
    const dataRisks = await this.identifyDataExposureRisks();
    
    let score = 100;
    score -= dataRisks.hardcodedSecrets.length * 25;
    score -= dataRisks.loggingSensitiveData.length * 15;
    score -= dataRisks.clientSideSecrets.length * 20;
    score -= dataRisks.unsecuredApiEndpoints.length * 10;
    
    return Math.max(0, score);
  }

  private async getConfigurationSecurityScore(): Promise<number> {
    const configIssues = await this.checkConfigurationSecurity();
    
    let score = 100;
    score -= configIssues.missingSecurityHeaders.length * 5;
    score -= configIssues.debugModeInProduction.length * 20;
    score -= configIssues.insecureCommunication.length * 15;
    score -= configIssues.insecureDefaults.length * 10;
    
    return Math.max(0, score);
  }

  // Helper methods
  private async getSourceFiles(): Promise<string[]> {
    return new Promise((resolve) => {
      glob('**/*.{ts,tsx,js,jsx}', {
        cwd: this.projectRoot,
        ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
      }, (err, files) => {
        if (err) {
          console.error('Error finding source files:', err);
          resolve([]);
        } else {
          resolve(files.map(file => join(this.projectRoot, file)));
        }
      });
    });
  }

  // Indicator creation methods
  private createVulnerabilityIndicators(vulnerabilities: SecurityVulnerability[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    const criticalVulns = vulnerabilities.filter(v => v.severity === IndicatorLevel.CRITICAL);
    const highVulns = vulnerabilities.filter(v => v.severity === 'high');
    const mediumVulns = vulnerabilities.filter(v => v.severity === 'medium');
    const lowVulns = vulnerabilities.filter(v => v.severity === 'low');

    if (criticalVulns.length > 0) {
      indicators.push(this.createIndicator({
        id: 'critical-vulnerabilities',
        type: 'security',
        title: 'Critical Security Vulnerabilities',
        description: `${criticalVulns.length} critical security issues found`,
        value: criticalVulns.length,
        category: 'vulnerabilities',
        level: IndicatorLevel.CRITICAL,
        actionable: true,
        suggestion: 'Immediate action required - fix critical vulnerabilities first'
      }));
    }

    if (highVulns.length > 0) {
      indicators.push(this.createIndicator({
        id: 'high-vulnerabilities',
        type: 'security',
        title: 'High Priority Vulnerabilities',
        description: `${highVulns.length} high-priority security issues`,
        value: highVulns.length,
        category: 'vulnerabilities',
        level: IndicatorLevel.WARNING,
        actionable: true,
        suggestion: 'Address high-priority vulnerabilities as soon as possible'
      }));
    }

    if (mediumVulns.length + lowVulns.length > 0) {
      indicators.push(this.createIndicator({
        id: 'medium-low-vulnerabilities',
        type: 'security',
        title: 'Medium & Low Priority Issues',
        description: `${mediumVulns.length + lowVulns.length} medium and low priority security issues`,
        value: mediumVulns.length + lowVulns.length,
        category: 'vulnerabilities',
        level: IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Address these issues during regular maintenance cycles'
      }));
    }

    return indicators;
  }

  private createDependencyVulnerabilityIndicators(vulnerabilities: DependencyVulnerability[]): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (vulnerabilities.length > 0) {
      const highSeverity = vulnerabilities.filter(v => v.vulnerability.severity === 'high').length;
      const mediumSeverity = vulnerabilities.filter(v => v.vulnerability.severity === 'medium').length;
      
      indicators.push(this.createIndicator({
        id: 'dependency-vulnerabilities',
        type: 'security',
        title: 'Vulnerable Dependencies',
        description: `${vulnerabilities.length} dependencies have known vulnerabilities`,
        value: vulnerabilities.length,
        category: 'dependencies',
        level: highSeverity > 0 ? IndicatorLevel.CRITICAL : mediumSeverity > 0 ? IndicatorLevel.WARNING : IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Update vulnerable dependencies to latest secure versions'
      }));
    }

    return indicators;
  }

  private createAuthenticationGapIndicators(gaps: AuthenticationGaps): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (gaps.missingAuthentication.length > 0) {
      indicators.push(this.createIndicator({
        id: 'missing-authentication',
        type: 'security',
        title: 'Missing Authentication',
        description: `${gaps.missingAuthentication.length} endpoints lack authentication`,
        value: gaps.missingAuthentication.length,
        category: 'authentication',
        level: IndicatorLevel.CRITICAL,
        actionable: true,
        suggestion: 'Add authentication middleware to protected endpoints'
      }));
    }

    if (gaps.insecureSessionHandling.length > 0) {
      indicators.push(this.createIndicator({
        id: 'insecure-session-handling',
        type: 'security',
        title: 'Insecure Session Handling',
        description: `${gaps.insecureSessionHandling.length} files have insecure session practices`,
        value: gaps.insecureSessionHandling.length,
        category: 'authentication',
        level: IndicatorLevel.WARNING,
        actionable: true,
        suggestion: 'Use cryptographically secure random number generation for sessions'
      }));
    }

    if (gaps.missingRoleBasedAccess.length > 0) {
      indicators.push(this.createIndicator({
        id: 'missing-rbac',
        type: 'security',
        title: 'Missing Role-Based Access Control',
        description: `${gaps.missingRoleBasedAccess.length} auth files lack RBAC implementation`,
        value: gaps.missingRoleBasedAccess.length,
        category: 'authentication',
        level: IndicatorLevel.INFO,
        actionable: true,
        suggestion: 'Implement role-based access control for better security'
      }));
    }

    return indicators;
  }

  private createDataExposureIndicators(risks: DataExposureRisks): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (risks.hardcodedSecrets.length > 0) {
      indicators.push(this.createIndicator({
        id: 'hardcoded-secrets',
        type: 'security',
        title: 'Hardcoded Secrets',
        description: `${risks.hardcodedSecrets.length} hardcoded secrets detected`,
        value: risks.hardcodedSecrets.length,
        category: 'data-exposure',
        level: IndicatorLevel.CRITICAL,
        actionable: true,
        suggestion: 'Move all secrets to environment variables immediately'
      }));
    }

    if (risks.clientSideSecrets.length > 0) {
      indicators.push(this.createIndicator({
        id: 'client-side-secrets',
        type: 'security',
        title: 'Client-Side Secrets',
        description: `${risks.clientSideSecrets.length} files contain client-exposed secrets`,
        value: risks.clientSideSecrets.length,
        category: 'data-exposure',
        level: IndicatorLevel.CRITICAL,
        actionable: true,
        suggestion: 'Never include secrets in client-side code'
      }));
    }

    if (risks.loggingSensitiveData.length > 0) {
      indicators.push(this.createIndicator({
        id: 'logging-sensitive-data',
        type: 'security',
        title: 'Sensitive Data Logging',
        description: `${risks.loggingSensitiveData.length} files log sensitive information`,
        value: risks.loggingSensitiveData.length,
        category: 'data-exposure',
        level: IndicatorLevel.WARNING,
        actionable: true,
        suggestion: 'Remove or sanitize sensitive data from logs'
      }));
    }

    return indicators;
  }

  private createConfigurationIndicators(issues: ConfigurationIssues): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    if (issues.missingSecurityHeaders.length > 0) {
      indicators.push(this.createIndicator({
        id: 'missing-security-headers',
        type: 'security',
        title: 'Missing Security Headers',
        description: `${issues.missingSecurityHeaders.length} recommended security headers missing`,
        value: issues.missingSecurityHeaders.length,
        category: 'configuration',
        level: IndicatorLevel.WARNING,
        actionable: true,
        suggestion: 'Add missing security headers to middleware configuration'
      }));
    }

    if (issues.debugModeInProduction.length > 0) {
      indicators.push(this.createIndicator({
        id: 'debug-mode-production',
        type: 'security',
        title: 'Debug Mode in Production',
        description: 'Debug mode may be enabled in production environment',
        value: issues.debugModeInProduction.length,
        category: 'configuration',
        level: IndicatorLevel.WARNING,
        actionable: true,
        suggestion: 'Disable debug mode in production configurations'
      }));
    }

    return indicators;
  }

  private createOwaspComplianceIndicators(compliance: { [key: string]: number }): SmartIndicator[] {
    const indicators: SmartIndicator[] = [];
    
    const avgCompliance = Object.values(compliance).reduce((sum, score) => sum + score, 0) / Object.keys(compliance).length;
    
    indicators.push(this.createIndicator({
      id: 'owasp-top10-compliance',
      type: 'security',
      title: 'OWASP Top 10 Compliance',
      description: 'Overall compliance with OWASP Top 10 security standards',
      value: Math.round(avgCompliance),
      unit: '%',
      category: 'compliance',
      level: avgCompliance < 70 ? IndicatorLevel.WARNING : IndicatorLevel.INFO
    }));

    // Add indicators for the worst compliance categories
    const sortedCompliance = Object.entries(compliance).sort(([,a], [,b]) => a - b);
    const worstCategories = sortedCompliance.slice(0, 3).filter(([,score]) => score < 80);
    
    worstCategories.forEach(([category, score]) => {
      indicators.push(this.createIndicator({
        id: `owasp-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        type: 'security',
        title: `OWASP: ${category.split('–')[1].trim()}`,
        description: `Compliance score for ${category}`,
        value: Math.round(score),
        unit: '%',
        category: 'compliance',
        level: score < 60 ? IndicatorLevel.WARNING : IndicatorLevel.INFO,
        actionable: true,
        suggestion: `Address vulnerabilities related to ${category}`
      }));
    });

    return indicators;
  }

  private createIndicator(config: Partial<SmartIndicator> & { 
    id: string; 
    type: SmartIndicator['type']; 
    title: string; 
    description: string; 
    value: number | string; 
    category: string; 
  }): SmartIndicator {
    const level = config.level || IndicatorLevel.INFO;
    
    return {
      id: config.id,
      type: config.type,
      level,
      title: config.title,
      description: config.description,
      value: config.value,
      unit: config.unit,
      trend: config.trend,
      category: config.category,
      timestamp: new Date(),
      actionable: config.actionable || false,
      suggestion: config.suggestion,
      visualConfig: {
        color: this.getLevelColor(level),
        icon: this.getTypeIcon(config.type),
        animation: level === IndicatorLevel.CRITICAL ? 'pulse' : undefined
      }
    };
  }

  private createErrorIndicator(id: string, error: any): SmartIndicator {
    return this.createIndicator({
      id,
      type: 'security',
      title: 'Security Analysis Error',
      description: `Security analysis encountered an error: ${error.message}`,
      value: 'Error',
      category: 'system',
      level: IndicatorLevel.CRITICAL,
      actionable: true,
      suggestion: 'Check system permissions and file access'
    });
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

  private getTypeIcon(type: SmartIndicator['type']): string {
    const icons = {
      health: '❤️',
      connection: '🔗',
      performance: '⚡',
      security: '🛡️',
      suggestion: '💡'
    };
    return icons[type] || '📊';
  }

  updateThresholds(thresholds: IndicatorThresholds): void {
    this.thresholds = thresholds;
  }
}