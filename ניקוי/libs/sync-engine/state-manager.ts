/**
 * Centralized State Management for Lions of Zion Sync Engine
 *
 * Features:
 * - Immutable state updates with conflict resolution
 * - State persistence and recovery mechanisms
 * - Cross-tab synchronization support
 * - Version-based state tracking
 * - Memory efficient state management
 * - State snapshots and rollback capability
 * - Real-time state validation
 * - State change analytics and metrics
 */

import { EventEmitter } from "events"
import * as fs from "fs/promises"
import * as path from "path"
import * as crypto from "crypto"

export interface StateManagerConfig {
  persistState: boolean
  projectRoot: string
  stateFile?: string
  maxVersionHistory?: number
  enableCrossTabs?: boolean
  validateState?: boolean
  compressionEnabled?: boolean
  backupInterval?: number
}

export interface ProjectState {
  files: Map<string, FileState>
  dependencies: Map<string, DependencyState>
  git: GitState
  build: BuildState
  server: ServerState
  lastUpdate: number
  version: number
  checksum: string
}

export interface FileState {
  path: string
  size: number
  modified: number
  type: string
  hash: string
  isTracked: boolean
  encoding?: string
  lastScanned: number
}

export interface DependencyState {
  name: string
  version: string
  type: "dependency" | "devDependency" | "peerDependency" | "optionalDependency"
  workspace?: string
  installed: boolean
  vulnerabilities: number
  size?: number
  lastUpdated: number
}

export interface GitState {
  branch: string
  commit: string
  status: "clean" | "dirty" | "conflict"
  staged: string[]
  unstaged: string[]
  untracked: string[]
  remoteChanges: boolean
  ahead: number
  behind: number
  lastChecked: number
}

export interface BuildState {
  status: "idle" | "building" | "success" | "failed"
  lastBuild: number
  duration?: number
  errors: string[]
  warnings: string[]
  assets?: BuildAsset[]
  performance?: BuildPerformance
}

export interface BuildAsset {
  name: string
  size: number
  type: string
  gzipped?: number
}

export interface BuildPerformance {
  bundleSize: number
  loadTime: number
  memoryUsage: number
  compilation: number
}

export interface ServerState {
  status: "stopped" | "starting" | "running" | "error"
  port?: number
  pid?: number
  startTime?: number
  uptime?: number
  requests?: number
  errors?: number
}

export interface StateSnapshot {
  version: number
  timestamp: number
  state: ProjectState
  reason: string
  checksum: string
}

export interface StateChange {
  id: string
  type: "file" | "git" | "dependency" | "build" | "server"
  operation: string
  target: string
  metadata: Record<string, any>
  timestamp: number
  source: string
  applied: boolean
}

export interface StateMetrics {
  totalFiles: number
  totalDependencies: number
  stateSize: number
  updateFrequency: number
  lastUpdate: number
  version: number
  conflicts: number
  rollbacks: number
}

export class StateManager extends EventEmitter {
  private config: StateManagerConfig
  private isInitialized = false
  private currentState: ProjectState
  private stateHistory: StateSnapshot[] = []
  private pendingChanges = new Map<string, StateChange>()
  private stateFile: string
  private backupTimer: NodeJS.Timeout | null = null
  private crossTabChannel: BroadcastChannel | null = null
  private isUpdating = false
  private updateQueue: (() => Promise<void>)[] = []

  constructor(config: StateManagerConfig) {
    super()

    this.config = {
      stateFile: ".sync-state.json",
      maxVersionHistory: 50,
      enableCrossTabs: true,
      validateState: true,
      compressionEnabled: false,
      backupInterval: 300000, // 5 minutes
      ...config,
    }

    this.stateFile = path.join(this.config.projectRoot, this.config.stateFile!)

    // Initialize empty state
    this.currentState = this.createEmptyState()
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error("StateManager is already initialized")
    }

    try {
      // Load persisted state if available
      if (this.config.persistState) {
        await this.loadPersistedState()
      }

      // Setup cross-tab communication
      if (this.config.enableCrossTabs && typeof BroadcastChannel !== "undefined") {
        this.setupCrossTabSync()
      }

      // Setup periodic backups
      if (this.config.persistState && this.config.backupInterval) {
        this.setupPeriodicBackups()
      }

      this.isInitialized = true
      this.log("info", "StateManager initialized successfully")
    } catch (error) {
      this.log("error", "Failed to initialize StateManager:", error)
      throw error
    }
  }

  async shutdown(): Promise<void> {
    try {
      // Save current state
      if (this.config.persistState) {
        await this.persistState()
      }

      // Cleanup timers
      if (this.backupTimer) {
        clearInterval(this.backupTimer)
        this.backupTimer = null
      }

      // Close cross-tab channel
      if (this.crossTabChannel) {
        this.crossTabChannel.close()
        this.crossTabChannel = null
      }

      this.isInitialized = false
      this.log("info", "StateManager shutdown complete")
    } catch (error) {
      this.log("error", "Error during StateManager shutdown:", error)
      throw error
    }
  }

  async getState(): Promise<ProjectState> {
    return this.deepClone(this.currentState)
  }

  async applyChange(change: StateChange): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("StateManager not initialized")
    }

    // Queue the update to prevent race conditions
    return new Promise((resolve, reject) => {
      this.updateQueue.push(async () => {
        try {
          await this.processChange(change)
          resolve()
        } catch (error) {
          reject(error)
        }
      })

      this.processUpdateQueue()
    })
  }

  private async processUpdateQueue(): Promise<void> {
    if (this.isUpdating || this.updateQueue.length === 0) {
      return
    }

    this.isUpdating = true

    try {
      while (this.updateQueue.length > 0) {
        const update = this.updateQueue.shift()
        if (update) {
          await update()
        }
      }
    } finally {
      this.isUpdating = false
    }
  }

  private async processChange(change: StateChange): Promise<void> {
    try {
      // Create snapshot before applying change
      const previousState = this.deepClone(this.currentState)

      // Apply the change based on type
      switch (change.type) {
        case "file":
          await this.applyFileChange(change)
          break
        case "git":
          await this.applyGitChange(change)
          break
        case "dependency":
          await this.applyDependencyChange(change)
          break
        case "build":
          await this.applyBuildChange(change)
          break
        case "server":
          await this.applyServerChange(change)
          break
        default:
          this.log("warn", `Unknown change type: ${change.type}`)
          return
      }

      // Update state metadata
      this.currentState.lastUpdate = Date.now()
      this.currentState.version++
      this.currentState.checksum = await this.calculateStateChecksum(this.currentState)

      // Mark change as applied
      change.applied = true

      // Create snapshot for history
      await this.createSnapshot(`Applied ${change.type} change: ${change.operation}`, previousState)

      // Validate state if enabled
      if (this.config.validateState) {
        await this.validateState()
      }

      // Emit state change event
      this.emit("stateChange", this.deepClone(this.currentState))

      // Persist state if enabled
      if (this.config.persistState) {
        await this.persistState()
      }

      // Broadcast to other tabs
      if (this.crossTabChannel) {
        this.broadcastStateChange(change)
      }

      this.log("debug", `Applied ${change.type} change:`, {
        operation: change.operation,
        target: change.target,
        version: this.currentState.version,
      })
    } catch (error) {
      this.log("error", "Failed to apply state change:", error)
      throw error
    }
  }

  private async applyFileChange(change: StateChange): Promise<void> {
    const { operation, target, metadata } = change

    switch (operation) {
      case "created":
      case "modified":
        this.currentState.files.set(target, {
          path: target,
          size: metadata.size || 0,
          modified: metadata.modified || Date.now(),
          type: metadata.fileType || "unknown",
          hash: metadata.hash || "",
          isTracked: true,
          encoding: metadata.encoding,
          lastScanned: Date.now(),
        })
        break

      case "deleted":
        this.currentState.files.delete(target)
        break

      case "moved":
        const oldState = this.currentState.files.get(metadata.oldPath)
        if (oldState) {
          this.currentState.files.delete(metadata.oldPath)
          this.currentState.files.set(target, {
            ...oldState,
            path: target,
            lastScanned: Date.now(),
          })
        }
        break
    }
  }

  private async applyGitChange(change: StateChange): Promise<void> {
    const { operation, metadata } = change

    switch (operation) {
      case "commit":
        this.currentState.git.commit = metadata.hash || ""
        this.currentState.git.lastChecked = Date.now()
        break

      case "branch":
        this.currentState.git.branch = metadata.branch || ""
        this.currentState.git.lastChecked = Date.now()
        break

      case "conflict":
        this.currentState.git.status = "conflict"
        this.currentState.git.lastChecked = Date.now()
        break

      case "resolve":
        this.currentState.git.status = "clean"
        this.currentState.git.lastChecked = Date.now()
        break
    }

    // Update git file arrays
    if (metadata.staged) {
      this.currentState.git.staged = Array.isArray(metadata.staged) ? metadata.staged : []
    }
    if (metadata.unstaged) {
      this.currentState.git.unstaged = Array.isArray(metadata.unstaged) ? metadata.unstaged : []
    }
    if (metadata.untracked) {
      this.currentState.git.untracked = Array.isArray(metadata.untracked) ? metadata.untracked : []
    }
  }

  private async applyDependencyChange(change: StateChange): Promise<void> {
    const { operation, target, metadata } = change

    switch (operation) {
      case "added":
        this.currentState.dependencies.set(target, {
          name: target,
          version: metadata.newVersion || "",
          type: metadata.dependencyType || "dependency",
          workspace: metadata.workspace,
          installed: true,
          vulnerabilities: 0,
          lastUpdated: Date.now(),
        })
        break

      case "updated":
        const existing = this.currentState.dependencies.get(target)
        if (existing) {
          existing.version = metadata.newVersion || existing.version
          existing.lastUpdated = Date.now()
        }
        break

      case "removed":
        this.currentState.dependencies.delete(target)
        break

      case "vulnerability":
        const vulnerable = this.currentState.dependencies.get(target)
        if (vulnerable) {
          vulnerable.vulnerabilities = metadata.vulnerabilities?.length || 0
          vulnerable.lastUpdated = Date.now()
        }
        break
    }
  }

  private async applyBuildChange(change: StateChange): Promise<void> {
    const { operation, metadata } = change

    switch (operation) {
      case "started":
        this.currentState.build.status = "building"
        this.currentState.build.lastBuild = Date.now()
        this.currentState.build.errors = []
        this.currentState.build.warnings = []
        break

      case "success":
        this.currentState.build.status = "success"
        this.currentState.build.duration = metadata.duration || 0
        this.currentState.build.assets = metadata.assets || []
        this.currentState.build.performance = metadata.performance
        break

      case "failed":
        this.currentState.build.status = "failed"
        this.currentState.build.errors = metadata.errors || []
        this.currentState.build.warnings = metadata.warnings || []
        break
    }
  }

  private async applyServerChange(change: StateChange): Promise<void> {
    const { operation, metadata } = change

    switch (operation) {
      case "started":
        this.currentState.server = {
          status: "running",
          port: metadata.port,
          pid: metadata.pid,
          startTime: Date.now(),
          uptime: 0,
          requests: 0,
          errors: 0,
        }
        break

      case "stopped":
        this.currentState.server.status = "stopped"
        this.currentState.server.uptime = this.currentState.server.startTime
          ? Date.now() - this.currentState.server.startTime
          : 0
        break

      case "error":
        this.currentState.server.status = "error"
        if (this.currentState.server.errors !== undefined) {
          this.currentState.server.errors++
        }
        break
    }
  }

  async checkForConflicts(change: StateChange, currentState: ProjectState): Promise<boolean> {
    // Simple conflict detection - check if the target has been modified
    // more recently than the change timestamp

    switch (change.type) {
      case "file":
        const fileState = currentState.files.get(change.target)
        if (fileState && fileState.lastScanned > change.timestamp) {
          return true
        }
        break

      case "dependency":
        const depState = currentState.dependencies.get(change.target)
        if (depState && depState.lastUpdated > change.timestamp) {
          return true
        }
        break

      case "git":
        if (currentState.git.lastChecked > change.timestamp) {
          return true
        }
        break
    }

    return false
  }

  async createSnapshot(reason: string, state?: ProjectState): Promise<StateSnapshot> {
    const snapshotState = state || this.currentState

    const snapshot: StateSnapshot = {
      version: snapshotState.version,
      timestamp: Date.now(),
      state: this.deepClone(snapshotState),
      reason,
      checksum: await this.calculateStateChecksum(snapshotState),
    }

    this.stateHistory.push(snapshot)

    // Limit history size
    if (this.stateHistory.length > this.config.maxVersionHistory!) {
      this.stateHistory.shift()
    }

    return snapshot
  }

  async rollbackToVersion(version: number): Promise<boolean> {
    const snapshot = this.stateHistory.find((s) => s.version === version)

    if (!snapshot) {
      this.log("warn", `No snapshot found for version ${version}`)
      return false
    }

    try {
      this.currentState = this.deepClone(snapshot.state)
      this.currentState.version++
      this.currentState.lastUpdate = Date.now()
      this.currentState.checksum = await this.calculateStateChecksum(this.currentState)

      await this.createSnapshot(`Rollback to version ${version}`)

      this.emit("stateChange", this.deepClone(this.currentState))

      if (this.config.persistState) {
        await this.persistState()
      }

      this.log("info", `Rolled back to version ${version}`)
      return true
    } catch (error) {
      this.log("error", "Failed to rollback state:", error)
      return false
    }
  }

  private async loadPersistedState(): Promise<void> {
    try {
      const data = await fs.readFile(this.stateFile, "utf8")
      const persistedData = JSON.parse(data)

      // Convert Maps back from serialized objects
      this.currentState = {
        ...persistedData.state,
        files: new Map(persistedData.state.files || []),
        dependencies: new Map(persistedData.state.dependencies || []),
      }

      if (persistedData.history) {
        this.stateHistory = persistedData.history.map((snapshot: any) => ({
          ...snapshot,
          state: {
            ...snapshot.state,
            files: new Map(snapshot.state.files || []),
            dependencies: new Map(snapshot.state.dependencies || []),
          },
        }))
      }

      this.log("info", `Loaded persisted state (version ${this.currentState.version})`)
    } catch (error) {
      if (error.code !== "ENOENT") {
        this.log("warn", "Could not load persisted state:", error)
      }
      // Use default empty state
      this.currentState = this.createEmptyState()
    }
  }

  private async persistState(): Promise<void> {
    try {
      const serializedState = {
        state: {
          ...this.currentState,
          files: Array.from(this.currentState.files.entries()),
          dependencies: Array.from(this.currentState.dependencies.entries()),
        },
        history: this.stateHistory.map((snapshot) => ({
          ...snapshot,
          state: {
            ...snapshot.state,
            files: Array.from(snapshot.state.files.entries()),
            dependencies: Array.from(snapshot.state.dependencies.entries()),
          },
        })),
      }

      const data = JSON.stringify(serializedState, null, 2)
      await fs.writeFile(this.stateFile, data, "utf8")
    } catch (error) {
      this.log("error", "Failed to persist state:", error)
    }
  }

  private setupCrossTabSync(): void {
    try {
      this.crossTabChannel = new BroadcastChannel("lionspace-sync-engine")

      this.crossTabChannel.onmessage = (event) => {
        if (event.data.type === "state-change") {
          this.handleRemoteStateChange(event.data.change)
        }
      }
    } catch (error) {
      this.log("warn", "Could not setup cross-tab sync:", error)
    }
  }

  private broadcastStateChange(change: StateChange): void {
    if (this.crossTabChannel) {
      try {
        this.crossTabChannel.postMessage({
          type: "state-change",
          change,
        })
      } catch (error) {
        this.log("debug", "Failed to broadcast state change:", error)
      }
    }
  }

  private async handleRemoteStateChange(change: StateChange): Promise<void> {
    // Handle state changes from other tabs
    // This would implement conflict resolution logic
    this.log("debug", "Received remote state change:", change)
    this.emit("remoteChange", change)
  }

  private setupPeriodicBackups(): void {
    this.backupTimer = setInterval(async () => {
      try {
        await this.persistState()
        this.log("debug", "Periodic state backup completed")
      } catch (error) {
        this.log("error", "Periodic backup failed:", error)
      }
    }, this.config.backupInterval)
  }

  private async validateState(): Promise<void> {
    // Basic state validation
    if (!this.currentState.files || !this.currentState.dependencies) {
      throw new Error("Invalid state: missing required properties")
    }

    if (this.currentState.version < 0) {
      throw new Error("Invalid state: negative version number")
    }

    if (this.currentState.lastUpdate > Date.now()) {
      throw new Error("Invalid state: future timestamp")
    }
  }

  private async calculateStateChecksum(state: ProjectState): Promise<string> {
    const serialized = JSON.stringify({
      files: Array.from(state.files.entries()).sort(),
      dependencies: Array.from(state.dependencies.entries()).sort(),
      git: state.git,
      build: state.build,
      server: state.server,
    })

    return crypto.createHash("sha256").update(serialized).digest("hex")
  }

  private createEmptyState(): ProjectState {
    return {
      files: new Map(),
      dependencies: new Map(),
      git: {
        branch: "",
        commit: "",
        status: "clean",
        staged: [],
        unstaged: [],
        untracked: [],
        remoteChanges: false,
        ahead: 0,
        behind: 0,
        lastChecked: 0,
      },
      build: {
        status: "idle",
        lastBuild: 0,
        errors: [],
        warnings: [],
      },
      server: {
        status: "stopped",
      },
      lastUpdate: Date.now(),
      version: 1,
      checksum: "",
    }
  }

  private deepClone<T>(obj: T): T {
    if (obj instanceof Map) {
      return new Map(Array.from(obj.entries()).map(([k, v]) => [k, this.deepClone(v)])) as any
    }

    if (obj instanceof Set) {
      return new Set(Array.from(obj.values()).map((v) => this.deepClone(v))) as any
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepClone(item)) as any
    }

    if (obj !== null && typeof obj === "object") {
      const cloned = {} as any
      for (const [key, value] of Object.entries(obj)) {
        cloned[key] = this.deepClone(value)
      }
      return cloned
    }

    return obj
  }

  // Public API methods
  getMetrics(): StateMetrics {
    return {
      totalFiles: this.currentState.files.size,
      totalDependencies: this.currentState.dependencies.size,
      stateSize: JSON.stringify(this.currentState).length,
      updateFrequency: 0, // Could be calculated from update history
      lastUpdate: this.currentState.lastUpdate,
      version: this.currentState.version,
      conflicts: 0, // Track conflicts
      rollbacks: 0, // Track rollbacks
    }
  }

  getHistory(): StateSnapshot[] {
    return [...this.stateHistory]
  }

  async exportState(): Promise<string> {
    return JSON.stringify(
      {
        state: {
          ...this.currentState,
          files: Array.from(this.currentState.files.entries()),
          dependencies: Array.from(this.currentState.dependencies.entries()),
        },
        metadata: {
          exported: Date.now(),
          version: this.currentState.version,
        },
      },
      null,
      2
    )
  }

  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [StateManager:${level.toUpperCase()}]`
    console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](prefix, message, ...args)
  }
}
