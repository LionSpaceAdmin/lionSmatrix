/**
 * Dependency Changes Monitoring for Lions of Zion Sync Engine
 *
 * Features:
 * - Real-time package.json changes detection
 * - Lock file monitoring (pnpm-lock.yaml, yarn.lock, package-lock.json)
 * - Version update notifications with semver analysis
 * - Workspace dependency changes tracking
 * - Security vulnerability detection
 * - Bundle size impact analysis
 * - Dependency tree analysis
 * - Installation status monitoring
 */

import { EventEmitter } from "events"
import * as fs from "fs/promises"
import * as path from "path"
import * as crypto from "crypto"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export interface DependencyTrackerConfig {
  projectRoot: string
  enabled: boolean
  watchPackageJson?: boolean
  watchLockFiles?: boolean
  watchWorkspaces?: boolean
  enableSecurityCheck?: boolean
  enableBundleAnalysis?: boolean
  pollInterval?: number
}

export interface DependencyChangeEvent {
  id: string
  type: "dependency"
  operation: "added" | "removed" | "updated" | "installed" | "vulnerability" | "workspace-change"
  target: string
  metadata: {
    packageName: string
    oldVersion?: string
    newVersion?: string
    dependencyType: "dependency" | "devDependency" | "peerDependency" | "optionalDependency"
    workspace?: string
    lockFile?: string
    vulnerabilities?: SecurityVulnerability[]
    sizeImpact?: BundleSizeImpact
    semverType?: "major" | "minor" | "patch" | "prerelease"
    breaking?: boolean
    reason?: string
  }
  timestamp: number
  source: string
  priority: "low" | "medium" | "high" | "critical"
}

export interface PackageInfo {
  name: string
  version: string
  type: "dependency" | "devDependency" | "peerDependency" | "optionalDependency"
  workspace?: string
  description?: string
  repository?: string
  license?: string
  size?: number
  dependencies?: string[]
}

export interface SecurityVulnerability {
  id: string
  severity: "low" | "moderate" | "high" | "critical"
  title: string
  description: string
  packageName: string
  vulnerableVersions: string
  patchedVersions: string
  reference: string
}

export interface BundleSizeImpact {
  before: number
  after: number
  diff: number
  percentage: number
  gzipped?: {
    before: number
    after: number
    diff: number
    percentage: number
  }
}

export interface DependencyTree {
  name: string
  version: string
  dependencies: Map<string, DependencyTree>
  size: number
  licenseIssues: string[]
}

export interface WorkspaceInfo {
  name: string
  path: string
  packageJson: any
  dependencies: Map<string, PackageInfo>
}

export class DependencyTracker extends EventEmitter {
  private config: DependencyTrackerConfig
  private isInitialized = false
  private isMonitoring = false
  private packageCache = new Map<string, PackageInfo>()
  private lockFileHashes = new Map<string, string>()
  private workspaces = new Map<string, WorkspaceInfo>()
  private pollTimer: NodeJS.Timeout | null = null
  private securityCache = new Map<string, SecurityVulnerability[]>()
  private bundleSizeCache = new Map<string, number>()

  constructor(config: DependencyTrackerConfig) {
    super()

    this.config = {
      watchPackageJson: true,
      watchLockFiles: true,
      watchWorkspaces: true,
      enableSecurityCheck: true,
      enableBundleAnalysis: false, // Disabled by default due to performance impact
      pollInterval: 5000, // 5 seconds
      ...config,
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error("DependencyTracker is already initialized")
    }

    if (!this.config.enabled) {
      this.log("info", "DependencyTracker disabled in configuration")
      return
    }

    try {
      // Verify project has package.json
      await this.verifyPackageJson()

      // Initialize workspace detection
      if (this.config.watchWorkspaces) {
        await this.discoverWorkspaces()
      }

      // Load initial dependency state
      await this.loadInitialState()

      this.isInitialized = true
      this.log("info", "DependencyTracker initialized successfully")
    } catch (error) {
      this.log("error", "Failed to initialize DependencyTracker:", error)
      throw error
    }
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (!this.config.enabled) {
      return
    }

    if (this.isMonitoring) {
      this.log("warn", "DependencyTracker is already monitoring")
      return
    }

    try {
      // Start polling for changes
      this.startPolling()

      this.isMonitoring = true
      this.log("info", "DependencyTracker started successfully")
      this.emit("started")
    } catch (error) {
      this.log("error", "Failed to start DependencyTracker:", error)
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this.isMonitoring) {
      this.log("warn", "DependencyTracker is not monitoring")
      return
    }

    try {
      // Stop polling
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }

      this.isMonitoring = false
      this.log("info", "DependencyTracker stopped successfully")
      this.emit("stopped")
    } catch (error) {
      this.log("error", "Failed to stop DependencyTracker:", error)
      throw error
    }
  }

  async scanDependencies(): Promise<void> {
    try {
      await this.checkPackageJsonChanges()
      await this.checkLockFileChanges()

      if (this.config.enableSecurityCheck) {
        await this.performSecurityAudit()
      }

      if (this.config.enableBundleAnalysis) {
        await this.analyzeBundleSize()
      }
    } catch (error) {
      this.log("error", "Error during dependency scan:", error)
      throw error
    }
  }

  private async verifyPackageJson(): Promise<void> {
    const packageJsonPath = path.join(this.config.projectRoot, "package.json")
    try {
      await fs.access(packageJsonPath)
    } catch (error) {
      throw new Error(`No package.json found in ${this.config.projectRoot}`)
    }
  }

  private async discoverWorkspaces(): Promise<void> {
    try {
      const rootPackageJson = await this.readPackageJson(this.config.projectRoot)

      // Check for workspace configuration
      let workspacePatterns: string[] = []

      if (rootPackageJson.workspaces) {
        if (Array.isArray(rootPackageJson.workspaces)) {
          workspacePatterns = rootPackageJson.workspaces
        } else if (rootPackageJson.workspaces.packages) {
          workspacePatterns = rootPackageJson.workspaces.packages
        }
      }

      // Also check pnpm-workspace.yaml
      try {
        const pnpmWorkspaceFile = path.join(this.config.projectRoot, "pnpm-workspace.yaml")
        const pnpmContent = await fs.readFile(pnpmWorkspaceFile, "utf8")
        const pnpmWorkspaces = this.parsePnpmWorkspace(pnpmContent)
        workspacePatterns.push(...pnpmWorkspaces)
      } catch {
        // pnpm-workspace.yaml not found, ignore
      }

      // Discover actual workspace directories
      for (const pattern of workspacePatterns) {
        await this.findWorkspaceDirectories(pattern)
      }

      this.log("info", `Discovered ${this.workspaces.size} workspaces`)
    } catch (error) {
      this.log("warn", "Could not discover workspaces:", error)
    }
  }

  private parsePnpmWorkspace(content: string): string[] {
    const lines = content.split("\n")
    const packages: string[] = []
    let inPackagesSection = false

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed === "packages:") {
        inPackagesSection = true
        continue
      }

      if (inPackagesSection) {
        if (trimmed.startsWith("- ")) {
          packages.push(trimmed.substring(2).replace(/['"]/g, ""))
        } else if (trimmed.length > 0 && !trimmed.startsWith(" ")) {
          inPackagesSection = false
        }
      }
    }

    return packages
  }

  private async findWorkspaceDirectories(pattern: string): Promise<void> {
    try {
      // Simple glob implementation for workspace patterns
      const { glob } = await import("glob")
      const matches = await glob(pattern, {
        cwd: this.config.projectRoot,
        absolute: true,
      })

      for (const match of matches) {
        const packageJsonPath = path.join(match, "package.json")
        try {
          const packageJson = await this.readPackageJson(match)

          this.workspaces.set(packageJson.name || path.basename(match), {
            name: packageJson.name || path.basename(match),
            path: match,
            packageJson,
            dependencies: new Map(),
          })
        } catch {
          // No package.json in this directory, skip
        }
      }
    } catch (error) {
      this.log("debug", `Error finding workspace directories for pattern ${pattern}:`, error)
    }
  }

  private async loadInitialState(): Promise<void> {
    // Load root dependencies
    await this.loadPackageDependencies(this.config.projectRoot)

    // Load workspace dependencies
    for (const workspace of this.workspaces.values()) {
      await this.loadPackageDependencies(workspace.path, workspace.name)
    }

    // Cache lock file hashes
    await this.cacheLockFileHashes()
  }

  private async loadPackageDependencies(packagePath: string, workspaceName?: string): Promise<void> {
    try {
      const packageJson = await this.readPackageJson(packagePath)

      const depTypes = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]

      for (const depType of depTypes) {
        const deps = packageJson[depType] || {}

        for (const [name, version] of Object.entries(deps)) {
          const packageInfo: PackageInfo = {
            name,
            version: version as string,
            type: depType as any,
            workspace: workspaceName,
          }

          const key = workspaceName ? `${workspaceName}:${name}` : name
          this.packageCache.set(key, packageInfo)
        }
      }
    } catch (error) {
      this.log("debug", `Could not load dependencies from ${packagePath}:`, error)
    }
  }

  private async cacheLockFileHashes(): Promise<void> {
    const lockFiles = ["pnpm-lock.yaml", "yarn.lock", "package-lock.json"]

    for (const lockFile of lockFiles) {
      const lockFilePath = path.join(this.config.projectRoot, lockFile)
      try {
        const content = await fs.readFile(lockFilePath, "utf8")
        const hash = crypto.createHash("sha256").update(content).digest("hex")
        this.lockFileHashes.set(lockFile, hash)
      } catch {
        // Lock file doesn't exist, ignore
      }
    }
  }

  private startPolling(): void {
    this.pollTimer = setInterval(async () => {
      try {
        await this.scanDependencies()
      } catch (error) {
        this.log("error", "Error during dependency polling:", error)
      }
    }, this.config.pollInterval)
  }

  private async checkPackageJsonChanges(): Promise<void> {
    // Check root package.json
    await this.checkSinglePackageJson(this.config.projectRoot)

    // Check workspace package.json files
    for (const workspace of this.workspaces.values()) {
      await this.checkSinglePackageJson(workspace.path, workspace.name)
    }
  }

  private async checkSinglePackageJson(packagePath: string, workspaceName?: string): Promise<void> {
    try {
      const currentPackageJson = await this.readPackageJson(packagePath)
      const depTypes = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]

      for (const depType of depTypes) {
        const currentDeps = currentPackageJson[depType] || {}

        for (const [name, version] of Object.entries(currentDeps)) {
          const key = workspaceName ? `${workspaceName}:${name}` : name
          const cached = this.packageCache.get(key)

          if (!cached) {
            // New dependency
            await this.emitDependencyEvent("added", name, {
              newVersion: version as string,
              dependencyType: depType as any,
              workspace: workspaceName,
            })

            this.packageCache.set(key, {
              name,
              version: version as string,
              type: depType as any,
              workspace: workspaceName,
            })
          } else if (cached.version !== version) {
            // Updated dependency
            await this.emitDependencyEvent("updated", name, {
              oldVersion: cached.version,
              newVersion: version as string,
              dependencyType: depType as any,
              workspace: workspaceName,
              semverType: this.analyzeSemverChange(cached.version, version as string),
            })

            cached.version = version as string
          }
        }

        // Check for removed dependencies
        const currentDepNames = new Set(Object.keys(currentDeps))
        for (const [key, packageInfo] of this.packageCache.entries()) {
          if (
            packageInfo.type === depType &&
            packageInfo.workspace === workspaceName &&
            !currentDepNames.has(packageInfo.name)
          ) {
            await this.emitDependencyEvent("removed", packageInfo.name, {
              oldVersion: packageInfo.version,
              dependencyType: depType as any,
              workspace: workspaceName,
            })

            this.packageCache.delete(key)
          }
        }
      }
    } catch (error) {
      this.log("debug", `Error checking package.json changes in ${packagePath}:`, error)
    }
  }

  private async checkLockFileChanges(): Promise<void> {
    const lockFiles = ["pnpm-lock.yaml", "yarn.lock", "package-lock.json"]

    for (const lockFile of lockFiles) {
      const lockFilePath = path.join(this.config.projectRoot, lockFile)

      try {
        const content = await fs.readFile(lockFilePath, "utf8")
        const currentHash = crypto.createHash("sha256").update(content).digest("hex")
        const cachedHash = this.lockFileHashes.get(lockFile)

        if (cachedHash && cachedHash !== currentHash) {
          await this.emitDependencyEvent("installed", lockFile, {
            lockFile,
            reason: "Lock file changed - dependencies may have been installed/updated",
          })

          this.lockFileHashes.set(lockFile, currentHash)
        } else if (!cachedHash) {
          // New lock file
          this.lockFileHashes.set(lockFile, currentHash)
        }
      } catch {
        // Lock file doesn't exist or can't be read
        if (this.lockFileHashes.has(lockFile)) {
          // Lock file was deleted
          await this.emitDependencyEvent("removed", lockFile, {
            lockFile,
            reason: "Lock file deleted",
          })

          this.lockFileHashes.delete(lockFile)
        }
      }
    }
  }

  private async performSecurityAudit(): Promise<void> {
    try {
      // Try different audit commands based on package manager
      let auditCommand = ""
      let parseAudit: (output: string) => SecurityVulnerability[] = () => []

      if (await this.fileExists(path.join(this.config.projectRoot, "pnpm-lock.yaml"))) {
        auditCommand = "pnpm audit --json"
        parseAudit = this.parsePnpmAudit.bind(this)
      } else if (await this.fileExists(path.join(this.config.projectRoot, "yarn.lock"))) {
        auditCommand = "yarn audit --json"
        parseAudit = this.parseYarnAudit.bind(this)
      } else {
        auditCommand = "npm audit --json"
        parseAudit = this.parseNpmAudit.bind(this)
      }

      const { stdout } = await execAsync(auditCommand, {
        cwd: this.config.projectRoot,
        timeout: 30000, // 30 second timeout
      })

      const vulnerabilities = parseAudit(stdout)

      // Compare with cached vulnerabilities
      for (const vuln of vulnerabilities) {
        const cacheKey = `${vuln.packageName}:${vuln.id}`
        if (!this.securityCache.has(cacheKey)) {
          await this.emitDependencyEvent("vulnerability", vuln.packageName, {
            vulnerabilities: [vuln],
            packageName: vuln.packageName,
          })

          this.securityCache.set(cacheKey, [vuln])
        }
      }
    } catch (error) {
      this.log("debug", "Security audit failed:", error)
    }
  }

  private parsePnpmAudit(output: string): SecurityVulnerability[] {
    try {
      const data = JSON.parse(output)
      const vulnerabilities: SecurityVulnerability[] = []

      if (data.advisories) {
        for (const [id, advisory] of Object.entries(data.advisories as any)) {
          vulnerabilities.push({
            id,
            severity: advisory.severity,
            title: advisory.title,
            description: advisory.overview,
            packageName: advisory.module_name,
            vulnerableVersions: advisory.vulnerable_versions,
            patchedVersions: advisory.patched_versions,
            reference: advisory.url,
          })
        }
      }

      return vulnerabilities
    } catch {
      return []
    }
  }

  private parseYarnAudit(output: string): SecurityVulnerability[] {
    try {
      const lines = output.split("\n").filter((line) => line.trim())
      const vulnerabilities: SecurityVulnerability[] = []

      for (const line of lines) {
        const data = JSON.parse(line)
        if (data.type === "auditAdvisory") {
          const advisory = data.data.advisory
          vulnerabilities.push({
            id: advisory.id.toString(),
            severity: advisory.severity,
            title: advisory.title,
            description: advisory.overview,
            packageName: advisory.module_name,
            vulnerableVersions: advisory.vulnerable_versions,
            patchedVersions: advisory.patched_versions,
            reference: advisory.url,
          })
        }
      }

      return vulnerabilities
    } catch {
      return []
    }
  }

  private parseNpmAudit(output: string): SecurityVulnerability[] {
    try {
      const data = JSON.parse(output)
      const vulnerabilities: SecurityVulnerability[] = []

      if (data.vulnerabilities) {
        for (const [packageName, vulnData] of Object.entries(data.vulnerabilities as any)) {
          if (vulnData.via && Array.isArray(vulnData.via)) {
            for (const via of vulnData.via) {
              if (typeof via === "object" && via.id) {
                vulnerabilities.push({
                  id: via.id.toString(),
                  severity: via.severity,
                  title: via.title,
                  description: via.overview || via.title,
                  packageName,
                  vulnerableVersions: via.range,
                  patchedVersions: "",
                  reference: via.url,
                })
              }
            }
          }
        }
      }

      return vulnerabilities
    } catch {
      return []
    }
  }

  private async analyzeBundleSize(): Promise<void> {
    // This is a simplified bundle size analysis
    // In a real implementation, you'd integrate with webpack-bundle-analyzer or similar
    try {
      const nodeModulesPath = path.join(this.config.projectRoot, "node_modules")
      const stats = await fs.stat(nodeModulesPath)
      const currentSize = await this.getDirectorySize(nodeModulesPath)

      const cachedSize = this.bundleSizeCache.get("node_modules")
      if (cachedSize && cachedSize !== currentSize) {
        const impact: BundleSizeImpact = {
          before: cachedSize,
          after: currentSize,
          diff: currentSize - cachedSize,
          percentage: ((currentSize - cachedSize) / cachedSize) * 100,
        }

        await this.emitDependencyEvent("updated", "bundle-size", {
          sizeImpact: impact,
          reason: "Bundle size changed",
        })
      }

      this.bundleSizeCache.set("node_modules", currentSize)
    } catch (error) {
      this.log("debug", "Bundle size analysis failed:", error)
    }
  }

  private async getDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0

    try {
      const items = await fs.readdir(dirPath)

      for (const item of items) {
        const itemPath = path.join(dirPath, item)
        const stats = await fs.stat(itemPath)

        if (stats.isDirectory()) {
          totalSize += await this.getDirectorySize(itemPath)
        } else {
          totalSize += stats.size
        }
      }
    } catch {
      // Directory access error, ignore
    }

    return totalSize
  }

  private analyzeSemverChange(oldVersion: string, newVersion: string): "major" | "minor" | "patch" | "prerelease" {
    // Simple semver analysis
    const oldParts = oldVersion
      .replace(/^[^0-9]*/, "")
      .split(".")
      .map(Number)
    const newParts = newVersion
      .replace(/^[^0-9]*/, "")
      .split(".")
      .map(Number)

    if (newParts[0] > oldParts[0]) return "major"
    if (newParts[1] > oldParts[1]) return "minor"
    if (newParts[2] > oldParts[2]) return "patch"

    return "prerelease"
  }

  private async emitDependencyEvent(
    operation: DependencyChangeEvent["operation"],
    target: string,
    metadata: Partial<DependencyChangeEvent["metadata"]>
  ): Promise<void> {
    const priority = this.getDependencyPriority(operation, metadata)

    const event: DependencyChangeEvent = {
      id: this.generateEventId(),
      type: "dependency",
      operation,
      target,
      metadata: {
        packageName: target,
        dependencyType: "dependency",
        ...metadata,
      },
      timestamp: Date.now(),
      source: "dependency-tracker",
      priority,
    }

    this.emit("change", event)
  }

  private getDependencyPriority(
    operation: DependencyChangeEvent["operation"],
    metadata: Partial<DependencyChangeEvent["metadata"]>
  ): DependencyChangeEvent["priority"] {
    // Security vulnerabilities are always critical
    if (operation === "vulnerability") {
      const severity = metadata.vulnerabilities?.[0]?.severity
      switch (severity) {
        case "critical":
          return "critical"
        case "high":
          return "critical"
        case "moderate":
          return "high"
        default:
          return "medium"
      }
    }

    // Major version updates are high priority
    if (operation === "updated" && metadata.semverType === "major") {
      return "high"
    }

    // Production dependencies are higher priority than dev dependencies
    if (metadata.dependencyType === "dependency") {
      return "medium"
    }

    return "low"
  }

  private async readPackageJson(packagePath: string): Promise<any> {
    const packageJsonPath = path.join(packagePath, "package.json")
    const content = await fs.readFile(packageJsonPath, "utf8")
    return JSON.parse(content)
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  private generateEventId(): string {
    return crypto.randomBytes(8).toString("hex")
  }

  // Public API methods
  getDependencies(workspace?: string): Map<string, PackageInfo> {
    const result = new Map<string, PackageInfo>()

    for (const [key, packageInfo] of this.packageCache.entries()) {
      if (!workspace || packageInfo.workspace === workspace) {
        result.set(packageInfo.name, packageInfo)
      }
    }

    return result
  }

  getWorkspaces(): Map<string, WorkspaceInfo> {
    return new Map(this.workspaces)
  }

  async getSecurityVulnerabilities(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = []
    for (const vulns of this.securityCache.values()) {
      vulnerabilities.push(...vulns)
    }
    return vulnerabilities
  }

  async forceScan(): Promise<void> {
    await this.scanDependencies()
  }

  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [DependencyTracker:${level.toUpperCase()}]`
    console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](prefix, message, ...args)
  }
}
