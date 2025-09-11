/**
 * Lions of Zion Real-time Sync Engine
 * Main orchestrator for real-time synchronization with project state
 *
 * Features:
 * - File system monitoring with intelligent debouncing
 * - Git operations tracking and status monitoring
 * - Dependency changes detection and notification
 * - Centralized state management with conflict resolution
 * - Real-time WebSocket/SSE communication
 * - Performance optimized for large projects
 */

import { EventEmitter } from "events"
import { FileWatcher } from "./file-watcher"
import { GitMonitor } from "./git-monitor"
import { DependencyTracker } from "./dependency-tracker"
import { StateManager } from "./state-manager"
import { ChangeProcessor } from "./change-processor"
import { SyncClient } from "./sync-client"

export interface SyncEngineConfig {
  projectRoot: string
  watchPatterns: string[]
  ignorePatterns: string[]
  debounceMs: number
  maxConcurrentChanges: number
  enableGitMonitoring: boolean
  enableDependencyTracking: boolean
  enableRealTimeSync: boolean
  websocketUrl?: string
  fallbackToSSE: boolean
  persistState: boolean
  logLevel: "debug" | "info" | "warn" | "error"
}

export interface SyncEvent {
  id: string
  type: "file" | "git" | "dependency" | "build" | "server"
  operation:
    | "created"
    | "modified"
    | "deleted"
    | "moved"
    | "commit"
    | "branch"
    | "merge"
    | "added"
    | "removed"
    | "updated"
    | "started"
    | "stopped"
    | "failed"
  target: string
  metadata: Record<string, any>
  timestamp: number
  source: string
  priority: "low" | "medium" | "high" | "critical"
  batchId?: string
}

export interface ProjectState {
  files: Map<string, FileState>
  dependencies: Map<string, DependencyState>
  git: GitState
  build: BuildState
  server: ServerState
  lastUpdate: number
  version: number
}

export interface FileState {
  path: string
  size: number
  modified: number
  type: string
  hash: string
  isTracked: boolean
}

export interface DependencyState {
  name: string
  version: string
  type: "dependency" | "devDependency" | "peerDependency"
  workspace?: string
}

export interface GitState {
  branch: string
  commit: string
  status: "clean" | "dirty" | "conflict"
  staged: string[]
  unstaged: string[]
  untracked: string[]
  remoteChanges: boolean
}

export interface BuildState {
  status: "idle" | "building" | "success" | "failed"
  lastBuild: number
  errors: string[]
  warnings: string[]
}

export interface ServerState {
  status: "stopped" | "starting" | "running" | "error"
  port?: number
  pid?: number
  startTime?: number
}

export class SyncEngine extends EventEmitter {
  private config: SyncEngineConfig
  private fileWatcher: FileWatcher
  private gitMonitor: GitMonitor
  private dependencyTracker: DependencyTracker
  private stateManager: StateManager
  private changeProcessor: ChangeProcessor
  private syncClient: SyncClient
  private isInitialized = false
  private isRunning = false
  private startTime: number | null = null

  constructor(config: Partial<SyncEngineConfig> = {}) {
    super()

    // Default configuration with performance optimizations
    this.config = {
      projectRoot: process.cwd(),
      watchPatterns: [
        "**/*.{ts,tsx,js,jsx,json,md,yaml,yml}",
        "**/package.json",
        "**/pnpm-lock.yaml",
        "**/yarn.lock",
        "**/package-lock.json",
        "**/.env*",
        "**/tsconfig*.json",
        "**/turbo.json",
        "**/next.config.*",
        "**/tailwind.config.*",
      ],
      ignorePatterns: [
        "**/node_modules/**",
        "**/.git/**",
        "**/.next/**",
        "**/.turbo/**",
        "**/dist/**",
        "**/build/**",
        "**/.cache/**",
        "**/coverage/**",
        "**/*.log",
        "**/tmp/**",
        "**/temp/**",
      ],
      debounceMs: 300,
      maxConcurrentChanges: 50,
      enableGitMonitoring: true,
      enableDependencyTracking: true,
      enableRealTimeSync: true,
      fallbackToSSE: true,
      persistState: true,
      logLevel: "info",
      ...config,
    }

    this.initializeComponents()
    this.setupEventHandlers()
  }

  private initializeComponents(): void {
    this.stateManager = new StateManager({
      persistState: this.config.persistState,
      projectRoot: this.config.projectRoot,
    })

    this.fileWatcher = new FileWatcher({
      projectRoot: this.config.projectRoot,
      watchPatterns: this.config.watchPatterns,
      ignorePatterns: this.config.ignorePatterns,
      debounceMs: this.config.debounceMs,
    })

    this.gitMonitor = new GitMonitor({
      projectRoot: this.config.projectRoot,
      enabled: this.config.enableGitMonitoring,
    })

    this.dependencyTracker = new DependencyTracker({
      projectRoot: this.config.projectRoot,
      enabled: this.config.enableDependencyTracking,
    })

    this.changeProcessor = new ChangeProcessor({
      maxConcurrentChanges: this.config.maxConcurrentChanges,
      stateManager: this.stateManager,
    })

    if (this.config.enableRealTimeSync) {
      this.syncClient = new SyncClient({
        websocketUrl: this.config.websocketUrl,
        fallbackToSSE: this.config.fallbackToSSE,
        projectRoot: this.config.projectRoot,
      })
    }
  }

  private setupEventHandlers(): void {
    // File system events
    this.fileWatcher.on("change", (event: SyncEvent) => {
      this.handleEvent(event)
    })

    // Git events
    this.gitMonitor.on("change", (event: SyncEvent) => {
      this.handleEvent(event)
    })

    // Dependency events
    this.dependencyTracker.on("change", (event: SyncEvent) => {
      this.handleEvent(event)
    })

    // State changes
    this.stateManager.on("stateChange", (state: ProjectState) => {
      this.emit("stateUpdate", state)
      if (this.syncClient) {
        this.syncClient.sendStateUpdate(state)
      }
    })

    // Change processor events
    this.changeProcessor.on("processed", (event: SyncEvent) => {
      this.emit("changeProcessed", event)
    })

    this.changeProcessor.on("batchProcessed", (events: SyncEvent[]) => {
      this.emit("batchProcessed", events)
    })

    // Sync client events
    if (this.syncClient) {
      this.syncClient.on("connected", () => {
        this.log("info", "Real-time sync client connected")
        this.emit("syncConnected")
      })

      this.syncClient.on("disconnected", () => {
        this.log("warn", "Real-time sync client disconnected")
        this.emit("syncDisconnected")
      })

      this.syncClient.on("error", (error: Error) => {
        this.log("error", "Sync client error:", error)
        this.emit("syncError", error)
      })

      this.syncClient.on("remoteChange", (event: SyncEvent) => {
        this.handleRemoteEvent(event)
      })
    }

    // Performance monitoring
    this.setupPerformanceMonitoring()
  }

  private setupPerformanceMonitoring(): void {
    const memoryCheckInterval = setInterval(() => {
      const usage = process.memoryUsage()
      const mb = (bytes: number) => Math.round(bytes / 1024 / 1024)

      if (usage.heapUsed > 500 * 1024 * 1024) {
        // 500MB threshold
        this.log("warn", `High memory usage: ${mb(usage.heapUsed)}MB heap, ${mb(usage.rss)}MB RSS`)
      }

      // Emit memory stats for monitoring
      this.emit("memoryUsage", {
        heapUsed: usage.heapUsed,
        heapTotal: usage.heapTotal,
        external: usage.external,
        rss: usage.rss,
      })
    }, 30000) // Check every 30 seconds

    // Cleanup on shutdown
    this.once("shutdown", () => {
      clearInterval(memoryCheckInterval)
    })
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error("Sync engine is already initialized")
    }

    try {
      this.log("info", "Initializing Lions of Zion Sync Engine...")

      // Initialize state manager first
      await this.stateManager.initialize()

      // Initialize file watcher
      await this.fileWatcher.initialize()

      // Initialize git monitor
      if (this.config.enableGitMonitoring) {
        await this.gitMonitor.initialize()
      }

      // Initialize dependency tracker
      if (this.config.enableDependencyTracking) {
        await this.dependencyTracker.initialize()
      }

      // Initialize change processor
      await this.changeProcessor.initialize()

      // Initialize sync client
      if (this.syncClient) {
        await this.syncClient.initialize()
      }

      this.isInitialized = true
      this.log("info", "Sync engine initialized successfully")
      this.emit("initialized")
    } catch (error) {
      this.log("error", "Failed to initialize sync engine:", error)
      throw error
    }
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.isRunning) {
      this.log("warn", "Sync engine is already running")
      return
    }

    try {
      this.log("info", "Starting sync engine...")
      this.startTime = Date.now()

      // Start file watching
      await this.fileWatcher.start()

      // Start git monitoring
      if (this.config.enableGitMonitoring) {
        await this.gitMonitor.start()
      }

      // Start dependency tracking
      if (this.config.enableDependencyTracking) {
        await this.dependencyTracker.start()
      }

      // Start change processor
      await this.changeProcessor.start()

      // Connect sync client
      if (this.syncClient) {
        await this.syncClient.connect()
      }

      this.isRunning = true
      this.log("info", "Sync engine started successfully")
      this.emit("started")

      // Perform initial state scan
      await this.performInitialScan()
    } catch (error) {
      this.log("error", "Failed to start sync engine:", error)
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.log("warn", "Sync engine is not running")
      return
    }

    try {
      this.log("info", "Stopping sync engine...")

      // Stop sync client first
      if (this.syncClient) {
        await this.syncClient.disconnect()
      }

      // Stop change processor
      await this.changeProcessor.stop()

      // Stop monitoring components
      if (this.config.enableDependencyTracking) {
        await this.dependencyTracker.stop()
      }

      if (this.config.enableGitMonitoring) {
        await this.gitMonitor.stop()
      }

      // Stop file watcher last
      await this.fileWatcher.stop()

      this.isRunning = false
      this.startTime = null
      this.log("info", "Sync engine stopped successfully")
      this.emit("stopped")
    } catch (error) {
      this.log("error", "Failed to stop sync engine:", error)
      throw error
    }
  }

  async shutdown(): Promise<void> {
    try {
      this.log("info", "Shutting down sync engine...")

      if (this.isRunning) {
        await this.stop()
      }

      // Cleanup resources
      await this.stateManager.shutdown()

      this.isInitialized = false
      this.emit("shutdown")
      this.removeAllListeners()

      this.log("info", "Sync engine shutdown complete")
    } catch (error) {
      this.log("error", "Failed to shutdown sync engine:", error)
      throw error
    }
  }

  private async performInitialScan(): Promise<void> {
    this.log("info", "Performing initial project scan...")

    try {
      // Trigger initial file scan
      const initialState = await this.stateManager.getState()

      // Force file system scan
      await this.fileWatcher.performFullScan()

      // Update git state
      if (this.config.enableGitMonitoring) {
        await this.gitMonitor.updateStatus()
      }

      // Update dependency state
      if (this.config.enableDependencyTracking) {
        await this.dependencyTracker.scanDependencies()
      }

      this.log("info", "Initial scan completed")
      this.emit("initialScanComplete", initialState)
    } catch (error) {
      this.log("error", "Initial scan failed:", error)
      this.emit("initialScanError", error)
    }
  }

  private async handleEvent(event: SyncEvent): Promise<void> {
    try {
      // Add to change processor queue
      await this.changeProcessor.processChange(event)

      // Update state
      await this.stateManager.applyChange(event)

      // Emit event for listeners
      this.emit("change", event)

      this.log("debug", `Processed ${event.type} event:`, {
        target: event.target,
        operation: event.operation,
        priority: event.priority,
      })
    } catch (error) {
      this.log("error", "Failed to handle event:", error)
      this.emit("eventError", event, error)
    }
  }

  private async handleRemoteEvent(event: SyncEvent): Promise<void> {
    try {
      // Handle remote changes with conflict resolution
      const currentState = await this.stateManager.getState()
      const hasConflict = await this.stateManager.checkForConflicts(event, currentState)

      if (hasConflict) {
        this.log("warn", "Detected conflict with remote change:", event)
        this.emit("conflict", event, currentState)
        return
      }

      // Apply remote change
      await this.handleEvent({
        ...event,
        source: "remote",
      })
    } catch (error) {
      this.log("error", "Failed to handle remote event:", error)
      this.emit("remoteEventError", event, error)
    }
  }

  // Public API methods
  async getState(): Promise<ProjectState> {
    return this.stateManager.getState()
  }

  async getFileState(filePath: string): Promise<FileState | null> {
    const state = await this.getState()
    return state.files.get(filePath) || null
  }

  async getDependencyState(packageName: string): Promise<DependencyState | null> {
    const state = await this.getState()
    return state.dependencies.get(packageName) || null
  }

  getStatus(): {
    isInitialized: boolean
    isRunning: boolean
    startTime: number | null
    uptime: number | null
    config: SyncEngineConfig
  } {
    return {
      isInitialized: this.isInitialized,
      isRunning: this.isRunning,
      startTime: this.startTime,
      uptime: this.startTime ? Date.now() - this.startTime : null,
      config: { ...this.config },
    }
  }

  async forceFileRescan(): Promise<void> {
    if (this.isRunning) {
      await this.fileWatcher.performFullScan()
    }
  }

  async forceGitUpdate(): Promise<void> {
    if (this.isRunning && this.config.enableGitMonitoring) {
      await this.gitMonitor.updateStatus()
    }
  }

  async forceDependencyUpdate(): Promise<void> {
    if (this.isRunning && this.config.enableDependencyTracking) {
      await this.dependencyTracker.scanDependencies()
    }
  }

  private log(level: string, message: string, ...args: any[]): void {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 }
    const currentLevel = levels[this.config.logLevel]
    const messageLevel = levels[level]

    if (messageLevel >= currentLevel) {
      const timestamp = new Date().toISOString()
      const prefix = `[${timestamp}] [SyncEngine:${level.toUpperCase()}]`
      console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](prefix, message, ...args)

      // Emit log event for external logging systems
      this.emit("log", {
        level,
        message,
        args,
        timestamp,
      })
    }
  }
}

// Export types and main class
export default SyncEngine
export * from "./file-watcher"
export * from "./git-monitor"
export * from "./dependency-tracker"
export * from "./state-manager"
export * from "./change-processor"
export * from "./sync-client"
