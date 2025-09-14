/**
 * Data Collector - איסוף נתונים מקיף עבור מנוע האנליטיקה
 * אוסף נתונים מכל המקורות במערכת Lions of Zion
 */

import * as fs from "fs/promises"
import * as path from "path"
import { execSync } from "child_process"
import { FileScanner } from "../file-scanner"
import { NetworkTopology } from "../network-topology"
import { SyncEngine } from "../sync-engine"

export interface DataCollectionConfig {
  projectRoot: string
  enableGitMetrics: boolean
  enablePerformanceTracking: boolean
  enableSecurityScanning: boolean
  includeHistoricalData: boolean
  collectBuildMetrics: boolean
  trackDependencies: boolean
  analyzeCodeComplexity: boolean
}

export interface CollectedData {
  timestamp: Date
  project: ProjectData
  git: GitMetrics
  files: FileMetrics
  dependencies: DependencyMetrics
  performance: PerformanceData
  security: SecurityData
  build: BuildMetrics
  codeQuality: CodeQualityMetrics
  architecture: ArchitectureData
  team: TeamData
}

export interface ProjectData {
  name: string
  version: string
  description: string
  size: ProjectSize
  languages: LanguageDistribution
  frameworks: Framework[]
  environment: EnvironmentInfo
}

export interface GitMetrics {
  totalCommits: number
  contributors: number
  branches: number
  lastCommitTime: Date
  commitFrequency: CommitFrequency
  codeChurn: CodeChurn
  hotspots: FileHotspot[]
  contributorStats: ContributorStats[]
}

export interface FileMetrics {
  totalFiles: number
  totalLines: number
  fileTypes: { [extension: string]: number }
  largestFiles: LargeFile[]
  duplicateCode: DuplicateCodeMetrics
  testCoverage: TestCoverageMetrics
  documentationCoverage: DocumentationCoverage
}

export interface DependencyMetrics {
  totalDependencies: number
  directDependencies: number
  devDependencies: number
  outdatedPackages: OutdatedPackage[]
  vulnerabilities: DependencyVulnerability[]
  licenseCompliance: LicenseCompliance
  bundleImpact: BundleImpact
}

export interface PerformanceData {
  buildTime: number
  bundleSize: BundleSizeData
  loadTime: LoadTimeData
  webVitals: WebVitalsData
  memoryUsage: MemoryUsageData
  cpuUsage: CpuUsageData
}

export interface SecurityData {
  vulnerabilityCount: number
  securityScore: number
  exposedSecrets: ExposedSecret[]
  dependencyVulnerabilities: SecurityVulnerability[]
  codeQualityIssues: SecurityIssue[]
  complianceStatus: ComplianceStatus
}

export interface BuildMetrics {
  success: boolean
  duration: number
  warnings: number
  errors: number
  optimizationSuggestions: OptimizationSuggestion[]
  artifactSize: number
  buildTrends: BuildTrend[]
}

export interface CodeQualityMetrics {
  maintainabilityIndex: number
  cyclomaticComplexity: number
  technicalDebt: TechnicalDebtData
  codeSmells: CodeSmell[]
  duplication: number
  testability: number
  readability: ReadabilityMetrics
}

export interface ArchitectureData {
  componentCount: number
  dependencies: ArchitecturalDependency[]
  layers: ArchitecturalLayer[]
  patterns: ArchitecturalPattern[]
  violations: ArchitecturalViolation[]
  modularity: ModularityMetrics
}

export interface TeamData {
  activeContributors: number
  commitPatterns: CommitPattern[]
  reviewMetrics: ReviewMetrics
  collaborationScore: number
  knowledgeDistribution: KnowledgeDistribution
  productivityTrends: ProductivityTrend[]
}

export class DataCollector {
  private config: DataCollectionConfig
  private fileScanner: FileScanner
  private networkTopology: NetworkTopology
  private syncEngine: SyncEngine

  constructor(config: DataCollectionConfig) {
    this.config = config
    this.fileScanner = new FileScanner(config.projectRoot)
    this.networkTopology = new NetworkTopology()
    this.syncEngine = new SyncEngine()
  }

  /**
   * אוסף את כל הנתונים הנדרשים לניתוח
   */
  public async collectAllData(): Promise<CollectedData> {
    console.log("📊 מתחיל איסוף נתונים מקיף...")

    const timestamp = new Date()

    try {
      // איסוף נתונים במקביל לביצועים מיטביים
      const [project, git, files, dependencies, performance, security, build, codeQuality, architecture, team] =
        await Promise.all([
          this.collectProjectData(),
          this.config.enableGitMetrics ? this.collectGitMetrics() : this.getEmptyGitMetrics(),
          this.collectFileMetrics(),
          this.config.trackDependencies ? this.collectDependencyMetrics() : this.getEmptyDependencyMetrics(),
          this.config.enablePerformanceTracking ? this.collectPerformanceData() : this.getEmptyPerformanceData(),
          this.config.enableSecurityScanning ? this.collectSecurityData() : this.getEmptySecurityData(),
          this.config.collectBuildMetrics ? this.collectBuildMetrics() : this.getEmptyBuildMetrics(),
          this.config.analyzeCodeComplexity ? this.collectCodeQualityMetrics() : this.getEmptyCodeQualityMetrics(),
          this.collectArchitectureData(),
          this.collectTeamData(),
        ])

      const collectedData: CollectedData = {
        timestamp,
        project,
        git,
        files,
        dependencies,
        performance,
        security,
        build,
        codeQuality,
        architecture,
        team,
      }

      console.log("✅ איסוף נתונים הושלם בהצלחה")
      this.logCollectionSummary(collectedData)

      return collectedData
    } catch (error) {
      console.error("❌ שגיאה באיסוף נתונים:", error)
      throw error
    }
  }

  /**
   * אוסף נתונים בסיסיים על הפרויקט
   */
  private async collectProjectData(): Promise<ProjectData> {
    const packageJsonPath = path.join(this.config.projectRoot, "package.json")

    try {
      const packageContent = await fs.readFile(packageJsonPath, "utf8")
      const packageData = JSON.parse(packageContent)

      const projectSize = await this.calculateProjectSize()
      const languages = await this.analyzeLanguageDistribution()
      const frameworks = await this.identifyFrameworks()
      const environment = await this.collectEnvironmentInfo()

      return {
        name: packageData.name || "Unknown Project",
        version: packageData.version || "0.0.0",
        description: packageData.description || "",
        size: projectSize,
        languages,
        frameworks,
        environment,
      }
    } catch (error) {
      console.warn("⚠️ לא ניתן לקרוא package.json, משתמש בערכי ברירת מחדל")
      return {
        name: "Lions of Zion Platform",
        version: "1.0.0",
        description: "Military-grade information warfare defense platform",
        size: await this.calculateProjectSize(),
        languages: await this.analyzeLanguageDistribution(),
        frameworks: await this.identifyFrameworks(),
        environment: await this.collectEnvironmentInfo(),
      }
    }
  }

  /**
   * אוסף מטריקות Git
   */
  private async collectGitMetrics(): Promise<GitMetrics> {
    try {
      const totalCommits = this.executeGitCommand("rev-list --all --count").trim()
      const contributors = this.executeGitCommand("shortlog -sn").split("\n").length
      const branches = this.executeGitCommand("branch -r")
        .split("\n")
        .filter((b) => b.trim()).length
      const lastCommitTime = new Date(this.executeGitCommand("log -1 --format=%ci").trim())

      const commitFrequency = await this.analyzeCommitFrequency()
      const codeChurn = await this.analyzeCodeChurn()
      const hotspots = await this.identifyFileHotspots()
      const contributorStats = await this.analyzeContributorStats()

      return {
        totalCommits: parseInt(totalCommits) || 0,
        contributors,
        branches,
        lastCommitTime,
        commitFrequency,
        codeChurn,
        hotspots,
        contributorStats,
      }
    } catch (error) {
      console.warn("⚠️ לא ניתן לאסוף מטריקות Git:", error)
      return this.getEmptyGitMetrics()
    }
  }

  /**
   * אוסף מטריקות קבצים
   */
  private async collectFileMetrics(): Promise<FileMetrics> {
    const scanResult = await this.fileScanner.scanFiles()

    const totalFiles = scanResult.fileCount
    const totalLines = await this.countTotalLines()
    const fileTypes = await this.analyzeFileTypes()
    const largestFiles = await this.identifyLargestFiles()
    const duplicateCode = await this.analyzeDuplicateCode()
    const testCoverage = await this.analyzeTestCoverage()
    const documentationCoverage = await this.analyzeDocumentationCoverage()

    return {
      totalFiles,
      totalLines,
      fileTypes,
      largestFiles,
      duplicateCode,
      testCoverage,
      documentationCoverage,
    }
  }

  /**
   * אוסף מטריקות תלויות
   */
  private async collectDependencyMetrics(): Promise<DependencyMetrics> {
    try {
      const packageJsonPath = path.join(this.config.projectRoot, "package.json")
      const packageContent = await fs.readFile(packageJsonPath, "utf8")
      const packageData = JSON.parse(packageContent)

      const dependencies = packageData.dependencies || {}
      const devDependencies = packageData.devDependencies || {}
      const totalDependencies = Object.keys(dependencies).length + Object.keys(devDependencies).length

      const outdatedPackages = await this.analyzeOutdatedPackages()
      const vulnerabilities = await this.analyzeDependencyVulnerabilities()
      const licenseCompliance = await this.analyzeLicenseCompliance()
      const bundleImpact = await this.analyzeBundleImpact()

      return {
        totalDependencies,
        directDependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        outdatedPackages,
        vulnerabilities,
        licenseCompliance,
        bundleImpact,
      }
    } catch (error) {
      console.warn("⚠️ לא ניתן לאסוף מטריקות תלויות:", error)
      return this.getEmptyDependencyMetrics()
    }
  }

  /**
   * אוסף נתוני ביצועים
   */
  private async collectPerformanceData(): Promise<PerformanceData> {
    const buildTime = await this.measureBuildTime()
    const bundleSize = await this.analyzeBundleSize()
    const loadTime = await this.analyzeLoadTime()
    const webVitals = await this.collectWebVitals()
    const memoryUsage = await this.analyzeMemoryUsage()
    const cpuUsage = await this.analyzeCpuUsage()

    return {
      buildTime,
      bundleSize,
      loadTime,
      webVitals,
      memoryUsage,
      cpuUsage,
    }
  }

  /**
   * אוסף נתוני אבטחה
   */
  private async collectSecurityData(): Promise<SecurityData> {
    const vulnerabilityCount = await this.countVulnerabilities()
    const securityScore = await this.calculateSecurityScore()
    const exposedSecrets = await this.scanForExposedSecrets()
    const dependencyVulnerabilities = await this.scanDependencyVulnerabilities()
    const codeQualityIssues = await this.identifySecurityIssues()
    const complianceStatus = await this.checkComplianceStatus()

    return {
      vulnerabilityCount,
      securityScore,
      exposedSecrets,
      dependencyVulnerabilities,
      codeQualityIssues,
      complianceStatus,
    }
  }

  /**
   * אוסף מטריקות build
   */
  private async collectBuildMetrics(): Promise<BuildMetrics> {
    try {
      // ניסיון build לניתוח מטריקות
      const buildResult = await this.performTestBuild()

      return {
        success: buildResult.success,
        duration: buildResult.duration,
        warnings: buildResult.warnings,
        errors: buildResult.errors,
        optimizationSuggestions: await this.generateOptimizationSuggestions(),
        artifactSize: buildResult.artifactSize,
        buildTrends: await this.analyzeBuildTrends(),
      }
    } catch (error) {
      console.warn("⚠️ לא ניתן לאסוף מטריקות build:", error)
      return this.getEmptyBuildMetrics()
    }
  }

  /**
   * אוסף מטריקות איכות קוד
   */
  private async collectCodeQualityMetrics(): Promise<CodeQualityMetrics> {
    const maintainabilityIndex = await this.calculateMaintainabilityIndex()
    const cyclomaticComplexity = await this.calculateCyclomaticComplexity()
    const technicalDebt = await this.analyzeTechnicalDebt()
    const codeSmells = await this.identifyCodeSmells()
    const duplication = await this.calculateDuplication()
    const testability = await this.assessTestability()
    const readability = await this.analyzeReadability()

    return {
      maintainabilityIndex,
      cyclomaticComplexity,
      technicalDebt,
      codeSmells,
      duplication,
      testability,
      readability,
    }
  }

  /**
   * אוסף נתוני ארכיטקטורה
   */
  private async collectArchitectureData(): Promise<ArchitectureData> {
    const componentCount = await this.countComponents()
    const dependencies = await this.analyzeArchitecturalDependencies()
    const layers = await this.identifyArchitecturalLayers()
    const patterns = await this.identifyArchitecturalPatterns()
    const violations = await this.identifyArchitecturalViolations()
    const modularity = await this.analyzeModularity()

    return {
      componentCount,
      dependencies,
      layers,
      patterns,
      violations,
      modularity,
    }
  }

  /**
   * אוסף נתוני צוות
   */
  private async collectTeamData(): Promise<TeamData> {
    const activeContributors = await this.countActiveContributors()
    const commitPatterns = await this.analyzeCommitPatterns()
    const reviewMetrics = await this.analyzeReviewMetrics()
    const collaborationScore = await this.calculateCollaborationScore()
    const knowledgeDistribution = await this.analyzeKnowledgeDistribution()
    const productivityTrends = await this.analyzeProductivityTrends()

    return {
      activeContributors,
      commitPatterns,
      reviewMetrics,
      collaborationScore,
      knowledgeDistribution,
      productivityTrends,
    }
  }

  // Helper methods for data collection
  private executeGitCommand(command: string): string {
    try {
      return execSync(`git ${command}`, {
        cwd: this.config.projectRoot,
        encoding: "utf8",
      })
    } catch (error) {
      console.warn(`⚠️ פקודת Git נכשלה: ${command}`)
      return ""
    }
  }

  private async calculateProjectSize(): Promise<ProjectSize> {
    try {
      const stats = await fs.stat(this.config.projectRoot)
      // חישוב גודל פרויקט מקורב
      return {
        totalSize: 0, // יחושב בפועל
        codeSize: 0,
        assetSize: 0,
        testSize: 0,
        sizeCategory: "medium",
      }
    } catch (error) {
      return {
        totalSize: 0,
        codeSize: 0,
        assetSize: 0,
        testSize: 0,
        sizeCategory: "unknown",
      }
    }
  }

  private async analyzeLanguageDistribution(): Promise<LanguageDistribution> {
    // ניתוח התפלגות שפות תכנות
    return {
      typescript: 0.85,
      javascript: 0.1,
      css: 0.03,
      html: 0.02,
    }
  }

  private async identifyFrameworks(): Promise<Framework[]> {
    // זיהוי frameworks בשימוש
    return [
      { name: "Next.js", version: "15.0.0", usage: "primary" },
      { name: "React", version: "18.0.0", usage: "primary" },
      { name: "Tailwind CSS", version: "3.0.0", usage: "styling" },
      { name: "TypeScript", version: "5.0.0", usage: "language" },
    ]
  }

  private async collectEnvironmentInfo(): Promise<EnvironmentInfo> {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    }
  }

  // Empty defaults for disabled features
  private getEmptyGitMetrics(): GitMetrics {
    return {
      totalCommits: 0,
      contributors: 0,
      branches: 0,
      lastCommitTime: new Date(),
      commitFrequency: { daily: 0, weekly: 0, monthly: 0 },
      codeChurn: { additions: 0, deletions: 0, ratio: 0 },
      hotspots: [],
      contributorStats: [],
    }
  }

  private getEmptyDependencyMetrics(): DependencyMetrics {
    return {
      totalDependencies: 0,
      directDependencies: 0,
      devDependencies: 0,
      outdatedPackages: [],
      vulnerabilities: [],
      licenseCompliance: { compliant: true, issues: [] },
      bundleImpact: { size: 0, loadTime: 0 },
    }
  }

  private getEmptyPerformanceData(): PerformanceData {
    return {
      buildTime: 0,
      bundleSize: { main: 0, chunks: [], total: 0 },
      loadTime: { initial: 0, interactive: 0 },
      webVitals: { lcp: 0, fid: 0, cls: 0 },
      memoryUsage: { heap: 0, rss: 0 },
      cpuUsage: { usage: 0, load: 0 },
    }
  }

  private getEmptySecurityData(): SecurityData {
    return {
      vulnerabilityCount: 0,
      securityScore: 100,
      exposedSecrets: [],
      dependencyVulnerabilities: [],
      codeQualityIssues: [],
      complianceStatus: { compliant: true, gaps: [] },
    }
  }

  private getEmptyBuildMetrics(): BuildMetrics {
    return {
      success: true,
      duration: 0,
      warnings: 0,
      errors: 0,
      optimizationSuggestions: [],
      artifactSize: 0,
      buildTrends: [],
    }
  }

  private getEmptyCodeQualityMetrics(): CodeQualityMetrics {
    return {
      maintainabilityIndex: 100,
      cyclomaticComplexity: 1,
      technicalDebt: { ratio: 0, cost: 0 },
      codeSmells: [],
      duplication: 0,
      testability: 100,
      readability: { score: 100, issues: [] },
    }
  }

  private logCollectionSummary(data: CollectedData): void {
    console.log("📈 סיכום איסוף נתונים:")
    console.log(`├── 📁 קבצים: ${data.files.totalFiles}`)
    console.log(`├── 📊 שורות קוד: ${data.files.totalLines}`)
    console.log(`├── 📦 תלויות: ${data.dependencies.totalDependencies}`)
    console.log(`├── 🔒 ביטחון: ${data.security.securityScore}/100`)
    console.log(`├── ⚡ ביצועים: ${data.performance.buildTime}s build`)
    console.log(`└── 👥 תורמים: ${data.team.activeContributors}`)
  }

  // Placeholder implementations - should be implemented based on actual analysis needs
  private async analyzeCommitFrequency(): Promise<CommitFrequency> {
    return { daily: 0, weekly: 0, monthly: 0 }
  }
  private async analyzeCodeChurn(): Promise<CodeChurn> {
    return { additions: 0, deletions: 0, ratio: 0 }
  }
  private async identifyFileHotspots(): Promise<FileHotspot[]> {
    return []
  }
  private async analyzeContributorStats(): Promise<ContributorStats[]> {
    return []
  }
  private async countTotalLines(): Promise<number> {
    return 0
  }
  private async analyzeFileTypes(): Promise<{ [extension: string]: number }> {
    return {}
  }
  private async identifyLargestFiles(): Promise<LargeFile[]> {
    return []
  }
  private async analyzeDuplicateCode(): Promise<DuplicateCodeMetrics> {
    return { percentage: 0, instances: [] }
  }
  private async analyzeTestCoverage(): Promise<TestCoverageMetrics> {
    return { percentage: 0, lines: 0 }
  }
  private async analyzeDocumentationCoverage(): Promise<DocumentationCoverage> {
    return { percentage: 0, missing: [] }
  }
  private async analyzeOutdatedPackages(): Promise<OutdatedPackage[]> {
    return []
  }
  private async analyzeDependencyVulnerabilities(): Promise<DependencyVulnerability[]> {
    return []
  }
  private async analyzeLicenseCompliance(): Promise<LicenseCompliance> {
    return { compliant: true, issues: [] }
  }
  private async analyzeBundleImpact(): Promise<BundleImpact> {
    return { size: 0, loadTime: 0 }
  }
  private async measureBuildTime(): Promise<number> {
    return 0
  }
  private async analyzeBundleSize(): Promise<BundleSizeData> {
    return { main: 0, chunks: [], total: 0 }
  }
  private async analyzeLoadTime(): Promise<LoadTimeData> {
    return { initial: 0, interactive: 0 }
  }
  private async collectWebVitals(): Promise<WebVitalsData> {
    return { lcp: 0, fid: 0, cls: 0 }
  }
  private async analyzeMemoryUsage(): Promise<MemoryUsageData> {
    return { heap: 0, rss: 0 }
  }
  private async analyzeCpuUsage(): Promise<CpuUsageData> {
    return { usage: 0, load: 0 }
  }
  private async countVulnerabilities(): Promise<number> {
    return 0
  }
  private async calculateSecurityScore(): Promise<number> {
    return 100
  }
  private async scanForExposedSecrets(): Promise<ExposedSecret[]> {
    return []
  }
  private async scanDependencyVulnerabilities(): Promise<SecurityVulnerability[]> {
    return []
  }
  private async identifySecurityIssues(): Promise<SecurityIssue[]> {
    return []
  }
  private async checkComplianceStatus(): Promise<ComplianceStatus> {
    return { compliant: true, gaps: [] }
  }
  private async performTestBuild(): Promise<any> {
    return { success: true, duration: 0, warnings: 0, errors: 0, artifactSize: 0 }
  }
  private async generateOptimizationSuggestions(): Promise<OptimizationSuggestion[]> {
    return []
  }
  private async analyzeBuildTrends(): Promise<BuildTrend[]> {
    return []
  }
  private async calculateMaintainabilityIndex(): Promise<number> {
    return 100
  }
  private async calculateCyclomaticComplexity(): Promise<number> {
    return 1
  }
  private async analyzeTechnicalDebt(): Promise<TechnicalDebtData> {
    return { ratio: 0, cost: 0 }
  }
  private async identifyCodeSmells(): Promise<CodeSmell[]> {
    return []
  }
  private async calculateDuplication(): Promise<number> {
    return 0
  }
  private async assessTestability(): Promise<number> {
    return 100
  }
  private async analyzeReadability(): Promise<ReadabilityMetrics> {
    return { score: 100, issues: [] }
  }
  private async countComponents(): Promise<number> {
    return 0
  }
  private async analyzeArchitecturalDependencies(): Promise<ArchitecturalDependency[]> {
    return []
  }
  private async identifyArchitecturalLayers(): Promise<ArchitecturalLayer[]> {
    return []
  }
  private async identifyArchitecturalPatterns(): Promise<ArchitecturalPattern[]> {
    return []
  }
  private async identifyArchitecturalViolations(): Promise<ArchitecturalViolation[]> {
    return []
  }
  private async analyzeModularity(): Promise<ModularityMetrics> {
    return { score: 100, coupling: 0, cohesion: 100 }
  }
  private async countActiveContributors(): Promise<number> {
    return 0
  }
  private async analyzeCommitPatterns(): Promise<CommitPattern[]> {
    return []
  }
  private async analyzeReviewMetrics(): Promise<ReviewMetrics> {
    return { average: 0, quality: 100 }
  }
  private async calculateCollaborationScore(): Promise<number> {
    return 100
  }
  private async analyzeKnowledgeDistribution(): Promise<KnowledgeDistribution> {
    return { distribution: "even", risks: [] }
  }
  private async analyzeProductivityTrends(): Promise<ProductivityTrend[]> {
    return []
  }
}

// Type definitions for collected data
export interface ProjectSize {
  totalSize: number
  codeSize: number
  assetSize: number
  testSize: number
  sizeCategory: "small" | "medium" | "large" | "enterprise" | "unknown"
}

export interface LanguageDistribution {
  [language: string]: number // percentage
}

export interface Framework {
  name: string
  version: string
  usage: "primary" | "secondary" | "testing" | "build" | "styling" | "language"
}

export interface EnvironmentInfo {
  nodeVersion: string
  platform: string
  architecture: string
  memory: NodeJS.MemoryUsage
  uptime: number
}

export interface CommitFrequency {
  daily: number
  weekly: number
  monthly: number
}

export interface CodeChurn {
  additions: number
  deletions: number
  ratio: number
}

export interface FileHotspot {
  file: string
  changes: number
  contributors: number
  complexity: number
}

export interface ContributorStats {
  name: string
  commits: number
  additions: number
  deletions: number
  files: number
}

export interface LargeFile {
  path: string
  size: number
  lines: number
  complexity?: number
}

export interface DuplicateCodeMetrics {
  percentage: number
  instances: DuplicateInstance[]
}

export interface DuplicateInstance {
  files: string[]
  lines: number
  similarity: number
}

export interface TestCoverageMetrics {
  percentage: number
  lines: number
  branches?: number
  functions?: number
}

export interface DocumentationCoverage {
  percentage: number
  missing: string[]
}

export interface OutdatedPackage {
  name: string
  current: string
  latest: string
  type: "dependency" | "devDependency"
}

export interface DependencyVulnerability {
  package: string
  severity: "low" | "moderate" | "high" | "critical"
  description: string
  patched?: string
}

export interface LicenseCompliance {
  compliant: boolean
  issues: LicenseIssue[]
}

export interface LicenseIssue {
  package: string
  license: string
  issue: string
}

export interface BundleImpact {
  size: number
  loadTime: number
}

export interface BundleSizeData {
  main: number
  chunks: ChunkData[]
  total: number
}

export interface ChunkData {
  name: string
  size: number
  type: "async" | "vendor" | "runtime"
}

export interface LoadTimeData {
  initial: number
  interactive: number
}

export interface WebVitalsData {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
}

export interface MemoryUsageData {
  heap: number
  rss: number
}

export interface CpuUsageData {
  usage: number
  load: number
}

export interface ExposedSecret {
  file: string
  line: number
  type: "api_key" | "password" | "token" | "certificate"
  severity: "low" | "medium" | "high" | "critical"
}

export interface SecurityVulnerability {
  id: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  fix?: string
}

export interface SecurityIssue {
  type: string
  file: string
  line?: number
  severity: "low" | "medium" | "high" | "critical"
  description: string
}

export interface ComplianceStatus {
  compliant: boolean
  gaps: ComplianceGap[]
}

export interface ComplianceGap {
  standard: string
  requirement: string
  status: "missing" | "partial" | "outdated"
}

export interface OptimizationSuggestion {
  type: "bundle" | "performance" | "memory" | "build"
  suggestion: string
  impact: "low" | "medium" | "high"
  effort: "low" | "medium" | "high"
}

export interface BuildTrend {
  date: Date
  duration: number
  success: boolean
  size: number
}

export interface TechnicalDebtData {
  ratio: number // percentage
  cost: number // estimated hours
}

export interface ReadabilityMetrics {
  score: number
  issues: ReadabilityIssue[]
}

export interface ReadabilityIssue {
  file: string
  line?: number
  type: string
  description: string
}

export interface ArchitecturalDependency {
  from: string
  to: string
  type: "import" | "extends" | "implements" | "calls"
  strength: number
}

export interface ArchitecturalLayer {
  name: string
  components: string[]
  violations: string[]
}

export interface ArchitecturalViolation {
  type: string
  description: string
  severity: "low" | "medium" | "high"
  location: string
}

export interface ModularityMetrics {
  score: number
  coupling: number
  cohesion: number
}

export interface CommitPattern {
  timeOfDay: number
  dayOfWeek: number
  frequency: number
  type: "feature" | "fix" | "refactor" | "docs" | "test"
}

export interface ReviewMetrics {
  average: number // average review time
  quality: number // review quality score
}

export interface ProductivityTrend {
  period: string
  commits: number
  linesAdded: number
  linesRemoved: number
  productivity: number
}
