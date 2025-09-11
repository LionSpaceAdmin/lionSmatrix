/**
 * Advanced File System Monitoring for Lions of Zion Sync Engine
 *
 * Features:
 * - High-performance file watching with chokidar
 * - Intelligent debouncing to prevent excessive updates
 * - Diff detection for meaningful changes only
 * - File type specific handling and filtering
 * - Symlink and node_modules exclusion
 * - Memory efficient change tracking
 * - Graceful error handling and recovery
 */

import { EventEmitter } from "events"
import * as chokidar from "chokidar"
import * as fs from "fs/promises"
import * as path from "path"
import * as crypto from "crypto"
import { glob } from "glob"

export interface FileWatcherConfig {
  projectRoot: string
  watchPatterns: string[]
  ignorePatterns: string[]
  debounceMs: number
  usePolling?: boolean
  pollingInterval?: number
  binaryFiles?: string[]
  maxFileSize?: number
  enableDiffDetection?: boolean
}

export interface FileChangeEvent {
  id: string
  type: "file"
  operation: "created" | "modified" | "deleted" | "moved"
  target: string
  metadata: {
    size?: number
    modified?: number
    hash?: string
    fileType: string
    isDirectory: boolean
    oldPath?: string // For move operations
    diff?: string // Content diff for text files
    encoding?: string
  }
  timestamp: number
  source: string
  priority: "low" | "medium" | "high" | "critical"
}

export interface FileSystemStats {
  totalFiles: number
  watchedFiles: number
  totalSize: number
  lastScanTime: number
  changeCount: number
  errorCount: number
}

export class FileWatcher extends EventEmitter {
  private config: FileWatcherConfig
  private watcher: chokidar.FSWatcher | null = null
  private isInitialized = false
  private isWatching = false
  private fileCache = new Map<string, FileMetadata>()
  private pendingChanges = new Map<string, NodeJS.Timeout>()
  private stats: FileSystemStats = {
    totalFiles: 0,
    watchedFiles: 0,
    totalSize: 0,
    lastScanTime: 0,
    changeCount: 0,
    errorCount: 0,
  }

  // File type detection patterns
  private readonly fileTypes = {
    source: /\.(ts|tsx|js|jsx|vue|py|java|cpp|c|cs|php|rb|go|rs)$/i,
    config: /\.(json|yaml|yml|toml|ini|env|config)$/i,
    style: /\.(css|scss|sass|less|styl)$/i,
    markup: /\.(html|htm|xml|md|mdx|jsx|tsx)$/i,
    asset: /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|otf|eot)$/i,
    doc: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i,
    binary: /\.(exe|dll|so|dylib|bin|zip|tar|gz|rar|7z)$/i,
  }

  private readonly binaryExtensions = new Set([
    ".exe",
    ".dll",
    ".so",
    ".dylib",
    ".bin",
    ".zip",
    ".tar",
    ".gz",
    ".rar",
    ".7z",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".bmp",
    ".tiff",
    ".webp",
    ".mp4",
    ".avi",
    ".mov",
    ".wmv",
    ".flv",
    ".mkv",
    ".webm",
    ".mp3",
    ".wav",
    ".flac",
    ".aac",
    ".ogg",
    ".wma",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
  ])

  constructor(config: FileWatcherConfig) {
    super()

    this.config = {
      usePolling: false,
      pollingInterval: 1000,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      enableDiffDetection: true,
      ...config,
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error("FileWatcher is already initialized")
    }

    try {
      // Verify project root exists
      await fs.access(this.config.projectRoot)

      // Setup chokidar watcher with optimized configuration
      this.watcher = chokidar.watch([], {
        cwd: this.config.projectRoot,
        ignored: this.config.ignorePatterns,
        ignoreInitial: false,
        followSymlinks: false,
        disableGlobbing: false,
        usePolling: this.config.usePolling,
        interval: this.config.pollingInterval,
        binaryInterval: this.config.pollingInterval * 2,
        alwaysStat: true,
        depth: undefined,
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 50,
        },
        atomic: true,
      })

      this.setupWatcherEvents()
      this.isInitialized = true

      this.log("info", "FileWatcher initialized successfully")
    } catch (error) {
      this.log("error", "Failed to initialize FileWatcher:", error)
      throw error
    }
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.isWatching) {
      this.log("warn", "FileWatcher is already watching")
      return
    }

    try {
      // Add watch patterns
      for (const pattern of this.config.watchPatterns) {
        const fullPattern = path.resolve(this.config.projectRoot, pattern)
        this.watcher!.add(fullPattern)
        this.log("debug", `Added watch pattern: ${pattern}`)
      }

      this.isWatching = true
      this.log("info", "FileWatcher started successfully")
      this.emit("started")
    } catch (error) {
      this.log("error", "Failed to start FileWatcher:", error)
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this.isWatching) {
      this.log("warn", "FileWatcher is not watching")
      return
    }

    try {
      if (this.watcher) {
        await this.watcher.close()
      }

      // Clear pending changes
      for (const timeout of this.pendingChanges.values()) {
        clearTimeout(timeout)
      }
      this.pendingChanges.clear()

      this.isWatching = false
      this.log("info", "FileWatcher stopped successfully")
      this.emit("stopped")
    } catch (error) {
      this.log("error", "Failed to stop FileWatcher:", error)
      throw error
    }
  }

  async performFullScan(): Promise<void> {
    this.log("info", "Performing full file system scan...")
    const startTime = Date.now()

    try {
      // Reset stats
      this.stats.totalFiles = 0
      this.stats.totalSize = 0
      this.stats.changeCount = 0

      // Scan each pattern
      for (const pattern of this.config.watchPatterns) {
        const fullPattern = path.resolve(this.config.projectRoot, pattern)
        const files = await glob(fullPattern, {
          ignore: this.config.ignorePatterns,
          absolute: true,
          dot: false,
        })

        for (const filePath of files) {
          try {
            await this.processFileForScan(filePath)
          } catch (error) {
            this.log("error", `Failed to scan file ${filePath}:`, error)
            this.stats.errorCount++
          }
        }
      }

      this.stats.lastScanTime = Date.now()
      const duration = this.stats.lastScanTime - startTime

      this.log(
        "info",
        `Full scan completed in ${duration}ms. Files: ${this.stats.totalFiles}, Size: ${this.formatSize(this.stats.totalSize)}`
      )
      this.emit("scanComplete", this.stats)
    } catch (error) {
      this.log("error", "Full scan failed:", error)
      this.emit("scanError", error)
      throw error
    }
  }

  private async processFileForScan(filePath: string): Promise<void> {
    try {
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        return // Skip directories in scan
      }

      const metadata = await this.createFileMetadata(filePath, stat)
      const relativePath = path.relative(this.config.projectRoot, filePath)

      // Update cache
      const existingMetadata = this.fileCache.get(relativePath)
      this.fileCache.set(relativePath, metadata)

      // Update stats
      this.stats.totalFiles++
      this.stats.totalSize += stat.size

      // Emit change event if file is new or modified
      if (!existingMetadata || existingMetadata.hash !== metadata.hash) {
        const event = await this.createChangeEvent(existingMetadata ? "modified" : "created", filePath, metadata, stat)

        this.emit("change", event)
        this.stats.changeCount++
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error
      }
      // File was deleted during scan, ignore
    }
  }

  private setupWatcherEvents(): void {
    if (!this.watcher) return

    this.watcher.on("add", (filePath: string, stats?: fs.Stats) => {
      this.handleFileEvent("created", filePath, stats)
    })

    this.watcher.on("change", (filePath: string, stats?: fs.Stats) => {
      this.handleFileEvent("modified", filePath, stats)
    })

    this.watcher.on("unlink", (filePath: string) => {
      this.handleFileEvent("deleted", filePath)
    })

    this.watcher.on("addDir", (dirPath: string, stats?: fs.Stats) => {
      this.handleDirectoryEvent("created", dirPath, stats)
    })

    this.watcher.on("unlinkDir", (dirPath: string) => {
      this.handleDirectoryEvent("deleted", dirPath)
    })

    this.watcher.on("error", (error: Error) => {
      this.log("error", "Watcher error:", error)
      this.stats.errorCount++
      this.emit("error", error)
    })

    this.watcher.on("ready", () => {
      this.log("info", "Initial scan complete, watching for changes...")
      this.stats.watchedFiles = this.watcher!.getWatched()
        ? Object.values(this.watcher!.getWatched()).reduce((acc, files) => acc + files.length, 0)
        : 0
      this.emit("ready")
    })
  }

  private handleFileEvent(operation: "created" | "modified" | "deleted", filePath: string, stats?: fs.Stats): void {
    const absolutePath = path.resolve(this.config.projectRoot, filePath)
    const relativePath = path.relative(this.config.projectRoot, absolutePath)

    // Skip if file should be ignored
    if (this.shouldIgnoreFile(relativePath)) {
      return
    }

    // Debounce changes
    this.debounceChange(relativePath, async () => {
      try {
        if (operation === "deleted") {
          await this.handleFileDeleted(absolutePath, relativePath)
        } else {
          await this.handleFileChanged(operation, absolutePath, relativePath, stats)
        }
      } catch (error) {
        this.log("error", `Failed to handle ${operation} for ${relativePath}:`, error)
        this.stats.errorCount++
      }
    })
  }

  private handleDirectoryEvent(operation: "created" | "deleted", dirPath: string, stats?: fs.Stats): void {
    const absolutePath = path.resolve(this.config.projectRoot, dirPath)
    const relativePath = path.relative(this.config.projectRoot, absolutePath)

    // Emit directory events with lower priority
    const event: FileChangeEvent = {
      id: this.generateEventId(),
      type: "file",
      operation,
      target: relativePath,
      metadata: {
        fileType: "directory",
        isDirectory: true,
        size: stats?.size,
        modified: stats?.mtime?.getTime(),
      },
      timestamp: Date.now(),
      source: "file-watcher",
      priority: "low",
    }

    this.emit("change", event)
  }

  private async handleFileDeleted(absolutePath: string, relativePath: string): Promise<void> {
    const metadata = this.fileCache.get(relativePath)
    this.fileCache.delete(relativePath)

    const event: FileChangeEvent = {
      id: this.generateEventId(),
      type: "file",
      operation: "deleted",
      target: relativePath,
      metadata: {
        fileType: metadata?.type || "unknown",
        isDirectory: false,
      },
      timestamp: Date.now(),
      source: "file-watcher",
      priority: this.getFilePriority(relativePath),
    }

    this.emit("change", event)
    this.stats.changeCount++
  }

  private async handleFileChanged(
    operation: "created" | "modified",
    absolutePath: string,
    relativePath: string,
    stats?: fs.Stats
  ): Promise<void> {
    try {
      const currentStats = stats || (await fs.stat(absolutePath))
      const metadata = await this.createFileMetadata(absolutePath, currentStats)

      // Check if file actually changed
      const existingMetadata = this.fileCache.get(relativePath)
      if (existingMetadata && existingMetadata.hash === metadata.hash) {
        return // No actual change
      }

      // Update cache
      this.fileCache.set(relativePath, metadata)

      // Create change event
      const event = await this.createChangeEvent(operation, absolutePath, metadata, currentStats, existingMetadata)

      this.emit("change", event)
      this.stats.changeCount++
    } catch (error) {
      if (error.code === "ENOENT") {
        // File was deleted during processing
        await this.handleFileDeleted(absolutePath, relativePath)
      } else {
        throw error
      }
    }
  }

  private async createChangeEvent(
    operation: "created" | "modified",
    absolutePath: string,
    metadata: FileMetadata,
    stats: fs.Stats,
    existingMetadata?: FileMetadata
  ): Promise<FileChangeEvent> {
    const relativePath = path.relative(this.config.projectRoot, absolutePath)
    let diff: string | undefined

    // Generate diff for text files if enabled
    if (
      this.config.enableDiffDetection &&
      operation === "modified" &&
      existingMetadata &&
      this.isTextFile(relativePath) &&
      stats.size < this.config.maxFileSize!
    ) {
      try {
        diff = await this.generateDiff(absolutePath, existingMetadata.content, metadata.content)
      } catch (error) {
        this.log("debug", `Could not generate diff for ${relativePath}:`, error)
      }
    }

    return {
      id: this.generateEventId(),
      type: "file",
      operation,
      target: relativePath,
      metadata: {
        size: stats.size,
        modified: stats.mtime.getTime(),
        hash: metadata.hash,
        fileType: metadata.type,
        isDirectory: false,
        diff,
        encoding: metadata.encoding,
      },
      timestamp: Date.now(),
      source: "file-watcher",
      priority: this.getFilePriority(relativePath),
    }
  }

  private async createFileMetadata(filePath: string, stats: fs.Stats): Promise<FileMetadata> {
    const ext = path.extname(filePath)
    const type = this.getFileType(filePath)
    let hash = ""
    let content: string | undefined
    let encoding: string | undefined

    try {
      if (stats.size > 0 && stats.size < this.config.maxFileSize!) {
        if (this.isTextFile(filePath)) {
          // Read and hash text files
          content = await fs.readFile(filePath, "utf8")
          hash = crypto.createHash("sha256").update(content).digest("hex")
          encoding = "utf8"
        } else if (!this.binaryExtensions.has(ext.toLowerCase())) {
          // Hash binary files without reading content
          const buffer = await fs.readFile(filePath)
          hash = crypto.createHash("sha256").update(buffer).digest("hex")
          encoding = "binary"
        }
      }
    } catch (error) {
      this.log("debug", `Could not read file ${filePath}:`, error)
    }

    return {
      path: filePath,
      size: stats.size,
      modified: stats.mtime.getTime(),
      type,
      hash,
      content,
      encoding,
    }
  }

  private debounceChange(filePath: string, callback: () => Promise<void>): void {
    // Clear existing timeout
    const existingTimeout = this.pendingChanges.get(filePath)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Set new timeout
    const timeout = setTimeout(async () => {
      this.pendingChanges.delete(filePath)
      await callback()
    }, this.config.debounceMs)

    this.pendingChanges.set(filePath, timeout)
  }

  private shouldIgnoreFile(filePath: string): boolean {
    // Check against ignore patterns
    for (const pattern of this.config.ignorePatterns) {
      if (this.matchesPattern(filePath, pattern)) {
        return true
      }
    }

    // Ignore very large files
    const absolutePath = path.resolve(this.config.projectRoot, filePath)
    try {
      const stats = fs.statSync(absolutePath)
      if (stats.size > this.config.maxFileSize!) {
        return true
      }
    } catch {
      // Ignore if can't stat
    }

    return false
  }

  private matchesPattern(filePath: string, pattern: string): boolean {
    // Simple glob-like pattern matching
    const regexPattern = pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]")

    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(filePath)
  }

  private getFileType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase()

    for (const [type, pattern] of Object.entries(this.fileTypes)) {
      if (pattern.test(filePath)) {
        return type
      }
    }

    return "other"
  }

  private isTextFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase()
    return !this.binaryExtensions.has(ext)
  }

  private getFilePriority(filePath: string): "low" | "medium" | "high" | "critical" {
    const fileName = path.basename(filePath)
    const type = this.getFileType(filePath)

    // Critical files
    if (/^(package\.json|package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/.test(fileName)) {
      return "critical"
    }

    // High priority files
    if (type === "config" || /\.(env|config)/.test(fileName)) {
      return "high"
    }

    // Medium priority for source files
    if (type === "source") {
      return "medium"
    }

    // Low priority for assets and docs
    return "low"
  }

  private async generateDiff(
    filePath: string,
    oldContent: string | undefined,
    newContent: string | undefined
  ): Promise<string | undefined> {
    if (!oldContent || !newContent) {
      return undefined
    }

    // Simple line-based diff
    const oldLines = oldContent.split("\n")
    const newLines = newContent.split("\n")
    const diffLines: string[] = []

    const maxLines = Math.max(oldLines.length, newLines.length)
    let changeCount = 0

    for (let i = 0; i < maxLines && changeCount < 50; i++) {
      const oldLine = oldLines[i] || ""
      const newLine = newLines[i] || ""

      if (oldLine !== newLine) {
        if (oldLine) {
          diffLines.push(`- ${oldLine}`)
        }
        if (newLine) {
          diffLines.push(`+ ${newLine}`)
        }
        changeCount++
      }
    }

    return diffLines.length > 0 ? diffLines.join("\n") : undefined
  }

  private generateEventId(): string {
    return crypto.randomBytes(8).toString("hex")
  }

  private formatSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  getStats(): FileSystemStats {
    return { ...this.stats }
  }

  getWatchedFiles(): string[] {
    return Array.from(this.fileCache.keys())
  }

  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [FileWatcher:${level.toUpperCase()}]`
    console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](prefix, message, ...args)
  }
}

interface FileMetadata {
  path: string
  size: number
  modified: number
  type: string
  hash: string
  content?: string
  encoding?: string
}
