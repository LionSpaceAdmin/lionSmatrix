/**
 * Git Changes Tracking for Lions of Zion Sync Engine
 *
 * Features:
 * - Real-time git status monitoring
 * - Branch switches and merge detection
 * - Commit and push tracking
 * - Remote changes monitoring
 * - Conflict detection and resolution
 * - Pull request status integration
 * - Efficient git operations with minimal overhead
 */

import { EventEmitter } from "events"
import { spawn, exec } from "child_process"
import { promisify } from "util"
import * as fs from "fs/promises"
import * as path from "path"
import * as crypto from "crypto"

const execAsync = promisify(exec)

export interface GitMonitorConfig {
  projectRoot: string
  enabled: boolean
  pollInterval?: number
  watchRefs?: boolean
  watchRemotes?: boolean
  enableConflictDetection?: boolean
  maxCommitHistory?: number
}

export interface GitChangeEvent {
  id: string
  type: "git"
  operation: "commit" | "branch" | "merge" | "pull" | "push" | "stash" | "reset" | "rebase" | "conflict" | "resolve"
  target: string
  metadata: {
    hash?: string
    author?: string
    message?: string
    timestamp?: number
    branch: string
    previousBranch?: string
    files?: string[]
    additions?: number
    deletions?: number
    remoteName?: string
    remoteUrl?: string
    conflictFiles?: string[]
    mergeBase?: string
    pullRequestId?: string
  }
  timestamp: number
  source: string
  priority: "low" | "medium" | "high" | "critical"
}

export interface GitStatus {
  branch: string
  commit: string
  status: "clean" | "dirty" | "conflict"
  staged: GitFileStatus[]
  unstaged: GitFileStatus[]
  untracked: string[]
  ahead: number
  behind: number
  remoteBranch?: string
  remoteUrl?: string
  hasConflicts: boolean
  isRebasing: boolean
  isMerging: boolean
  stashCount: number
}

export interface GitFileStatus {
  path: string
  status: "M" | "A" | "D" | "R" | "C" | "U" | "??"
  oldPath?: string // For renames
}

export interface GitCommit {
  hash: string
  shortHash: string
  author: string
  email: string
  timestamp: number
  message: string
  files: GitFileStatus[]
  additions: number
  deletions: number
}

export interface GitRemote {
  name: string
  url: string
  type: "fetch" | "push"
}

export class GitMonitor extends EventEmitter {
  private config: GitMonitorConfig
  private isInitialized = false
  private isMonitoring = false
  private currentStatus: GitStatus | null = null
  private pollTimer: NodeJS.Timeout | null = null
  private refsWatcher: fs.FSWatcher | null = null
  private headWatcher: fs.FSWatcher | null = null
  private gitDir: string = ""
  private lastHeadHash = ""
  private lastStatusHash = ""

  constructor(config: GitMonitorConfig) {
    super()

    this.config = {
      pollInterval: 2000, // 2 seconds
      watchRefs: true,
      watchRemotes: true,
      enableConflictDetection: true,
      maxCommitHistory: 100,
      ...config,
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error("GitMonitor is already initialized")
    }

    if (!this.config.enabled) {
      this.log("info", "GitMonitor disabled in configuration")
      return
    }

    try {
      // Check if we're in a git repository
      await this.verifyGitRepository()

      // Get git directory
      this.gitDir = await this.getGitDirectory()

      // Setup file watchers for efficient monitoring
      if (this.config.watchRefs) {
        await this.setupFileWatchers()
      }

      this.isInitialized = true
      this.log("info", "GitMonitor initialized successfully")
    } catch (error) {
      this.log("error", "Failed to initialize GitMonitor:", error)
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
      this.log("warn", "GitMonitor is already monitoring")
      return
    }

    try {
      // Get initial status
      await this.updateStatus()

      // Start polling for changes
      this.startPolling()

      this.isMonitoring = true
      this.log("info", "GitMonitor started successfully")
      this.emit("started")
    } catch (error) {
      this.log("error", "Failed to start GitMonitor:", error)
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this.isMonitoring) {
      this.log("warn", "GitMonitor is not monitoring")
      return
    }

    try {
      // Stop polling
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }

      // Stop file watchers
      if (this.refsWatcher) {
        await this.refsWatcher.close()
        this.refsWatcher = null
      }

      if (this.headWatcher) {
        await this.headWatcher.close()
        this.headWatcher = null
      }

      this.isMonitoring = false
      this.log("info", "GitMonitor stopped successfully")
      this.emit("stopped")
    } catch (error) {
      this.log("error", "Failed to stop GitMonitor:", error)
      throw error
    }
  }

  async updateStatus(): Promise<GitStatus> {
    try {
      const status = await this.getCurrentStatus()

      // Check if status actually changed
      const statusHash = this.hashObject(status)
      if (statusHash === this.lastStatusHash) {
        return status
      }

      const previousStatus = this.currentStatus
      this.currentStatus = status
      this.lastStatusHash = statusHash

      // Emit change events
      await this.detectAndEmitChanges(previousStatus, status)

      this.emit("statusUpdate", status)
      return status
    } catch (error) {
      this.log("error", "Failed to update git status:", error)
      throw error
    }
  }

  private async verifyGitRepository(): Promise<void> {
    try {
      await execAsync("git rev-parse --git-dir", { cwd: this.config.projectRoot })
    } catch (error) {
      throw new Error(`Not a git repository: ${this.config.projectRoot}`)
    }
  }

  private async getGitDirectory(): Promise<string> {
    try {
      const { stdout } = await execAsync("git rev-parse --git-dir", {
        cwd: this.config.projectRoot,
      })
      return path.resolve(this.config.projectRoot, stdout.trim())
    } catch (error) {
      throw new Error("Could not determine git directory")
    }
  }

  private async setupFileWatchers(): Promise<void> {
    try {
      // Watch HEAD file for branch changes
      const headFile = path.join(this.gitDir, "HEAD")
      if (await this.fileExists(headFile)) {
        this.headWatcher = fs.watch(headFile, () => {
          this.handleHeadChange()
        })
      }

      // Watch refs directory for branch/tag changes
      const refsDir = path.join(this.gitDir, "refs")
      if (await this.fileExists(refsDir)) {
        this.refsWatcher = fs.watch(refsDir, { recursive: true }, (eventType, filename) => {
          this.handleRefsChange(eventType, filename)
        })
      }
    } catch (error) {
      this.log("warn", "Could not setup file watchers:", error)
    }
  }

  private startPolling(): void {
    this.pollTimer = setInterval(async () => {
      try {
        await this.updateStatus()
      } catch (error) {
        this.log("error", "Error during status polling:", error)
      }
    }, this.config.pollInterval)
  }

  private async handleHeadChange(): Promise<void> {
    try {
      const headContent = await fs.readFile(path.join(this.gitDir, "HEAD"), "utf8")
      const headHash = crypto.createHash("sha256").update(headContent.trim()).digest("hex")

      if (headHash !== this.lastHeadHash) {
        this.lastHeadHash = headHash
        await this.updateStatus()
      }
    } catch (error) {
      this.log("debug", "Error handling HEAD change:", error)
    }
  }

  private async handleRefsChange(eventType: string, filename: string | null): Promise<void> {
    if (filename && (filename.includes("heads/") || filename.includes("remotes/"))) {
      // Debounce refs changes
      setTimeout(async () => {
        try {
          await this.updateStatus()
        } catch (error) {
          this.log("debug", "Error handling refs change:", error)
        }
      }, 100)
    }
  }

  private async getCurrentStatus(): Promise<GitStatus> {
    const [statusOutput, branchInfo, commitHash, remoteInfo, conflictCheck, stashCount] = await Promise.all([
      this.execGit(["status", "--porcelain=v1", "-b"]),
      this.getCurrentBranch(),
      this.getCurrentCommit(),
      this.getRemoteInfo(),
      this.checkForConflicts(),
      this.getStashCount(),
    ])

    const lines = statusOutput.split("\n").filter((line) => line.length > 0)
    const branchLine = lines.find((line) => line.startsWith("##"))

    // Parse branch information
    let ahead = 0
    let behind = 0
    let remoteBranch: string | undefined

    if (branchLine) {
      const aheadMatch = branchLine.match(/ahead (\d+)/)
      const behindMatch = branchLine.match(/behind (\d+)/)
      const remoteMatch = branchLine.match(/\.\.\.([\w\/\-]+)/)

      if (aheadMatch) ahead = parseInt(aheadMatch[1])
      if (behindMatch) behind = parseInt(behindMatch[1])
      if (remoteMatch) remoteBranch = remoteMatch[1]
    }

    // Parse file changes
    const fileLines = lines.filter((line) => !line.startsWith("##"))
    const staged: GitFileStatus[] = []
    const unstaged: GitFileStatus[] = []
    const untracked: string[] = []

    for (const line of fileLines) {
      const stagedStatus = line[0]
      const unstagedStatus = line[1]
      const filePath = line.substring(3)

      if (stagedStatus !== " " && stagedStatus !== "?") {
        staged.push({
          path: filePath,
          status: stagedStatus as any,
        })
      }

      if (unstagedStatus !== " " && unstagedStatus !== "?") {
        unstaged.push({
          path: filePath,
          status: unstagedStatus as any,
        })
      }

      if (stagedStatus === "?" && unstagedStatus === "?") {
        untracked.push(filePath)
      }
    }

    // Determine overall status
    let status: "clean" | "dirty" | "conflict" = "clean"
    if (conflictCheck.hasConflicts) {
      status = "conflict"
    } else if (staged.length > 0 || unstaged.length > 0 || untracked.length > 0) {
      status = "dirty"
    }

    return {
      branch: branchInfo.name,
      commit: commitHash,
      status,
      staged,
      unstaged,
      untracked,
      ahead,
      behind,
      remoteBranch,
      remoteUrl: remoteInfo?.url,
      hasConflicts: conflictCheck.hasConflicts,
      isRebasing: conflictCheck.isRebasing,
      isMerging: conflictCheck.isMerging,
      stashCount,
    }
  }

  private async getCurrentBranch(): Promise<{ name: string; isDetached: boolean }> {
    try {
      const { stdout } = await execAsync("git branch --show-current", {
        cwd: this.config.projectRoot,
      })

      const branchName = stdout.trim()
      if (branchName) {
        return { name: branchName, isDetached: false }
      }

      // Handle detached HEAD
      const { stdout: headOutput } = await execAsync("git rev-parse --short HEAD", {
        cwd: this.config.projectRoot,
      })
      return { name: `detached-${headOutput.trim()}`, isDetached: true }
    } catch (error) {
      return { name: "unknown", isDetached: false }
    }
  }

  private async getCurrentCommit(): Promise<string> {
    try {
      const { stdout } = await execAsync("git rev-parse HEAD", {
        cwd: this.config.projectRoot,
      })
      return stdout.trim()
    } catch (error) {
      return ""
    }
  }

  private async getRemoteInfo(): Promise<GitRemote | null> {
    try {
      const { stdout } = await execAsync("git remote -v", {
        cwd: this.config.projectRoot,
      })

      const lines = stdout.split("\n").filter((line) => line.includes("(fetch)"))
      if (lines.length > 0) {
        const [name, url] = lines[0].split("\t")[0].split(" ")
        return {
          name: name.trim(),
          url: url.replace(" (fetch)", "").trim(),
          type: "fetch",
        }
      }
      return null
    } catch (error) {
      return null
    }
  }

  private async checkForConflicts(): Promise<{
    hasConflicts: boolean
    isRebasing: boolean
    isMerging: boolean
    conflictFiles: string[]
  }> {
    try {
      // Check for merge/rebase state
      const mergeHeadExists = await this.fileExists(path.join(this.gitDir, "MERGE_HEAD"))
      const rebaseApplyExists = await this.fileExists(path.join(this.gitDir, "rebase-apply"))
      const rebaseMergeExists = await this.fileExists(path.join(this.gitDir, "rebase-merge"))

      // Check for conflict markers in files
      const { stdout } = await execAsync("git status --porcelain", {
        cwd: this.config.projectRoot,
      })

      const conflictFiles = stdout
        .split("\n")
        .filter((line) => line.startsWith("UU ") || line.startsWith("AA ") || line.startsWith("DD "))
        .map((line) => line.substring(3))

      return {
        hasConflicts: conflictFiles.length > 0,
        isRebasing: rebaseApplyExists || rebaseMergeExists,
        isMerging: mergeHeadExists,
        conflictFiles,
      }
    } catch (error) {
      return {
        hasConflicts: false,
        isRebasing: false,
        isMerging: false,
        conflictFiles: [],
      }
    }
  }

  private async getStashCount(): Promise<number> {
    try {
      const { stdout } = await execAsync("git stash list", {
        cwd: this.config.projectRoot,
      })
      return stdout.split("\n").filter((line) => line.length > 0).length
    } catch (error) {
      return 0
    }
  }

  private async detectAndEmitChanges(previous: GitStatus | null, current: GitStatus): Promise<void> {
    if (!previous) {
      // Initial status, emit a general update
      this.emitGitEvent(
        "branch",
        current.branch,
        {
          branch: current.branch,
          hash: current.commit,
        },
        "medium"
      )
      return
    }

    // Branch change
    if (previous.branch !== current.branch) {
      this.emitGitEvent(
        "branch",
        current.branch,
        {
          branch: current.branch,
          previousBranch: previous.branch,
          hash: current.commit,
        },
        "high"
      )
    }

    // Commit change
    if (previous.commit !== current.commit) {
      const commitInfo = await this.getCommitInfo(current.commit)
      this.emitGitEvent(
        "commit",
        current.commit,
        {
          branch: current.branch,
          hash: current.commit,
          author: commitInfo?.author,
          message: commitInfo?.message,
          timestamp: commitInfo?.timestamp,
          files: commitInfo?.files.map((f) => f.path),
          additions: commitInfo?.additions,
          deletions: commitInfo?.deletions,
        },
        "high"
      )
    }

    // Conflict detection
    if (!previous.hasConflicts && current.hasConflicts) {
      this.emitGitEvent(
        "conflict",
        "merge-conflict",
        {
          branch: current.branch,
          conflictFiles: current.staged.concat(current.unstaged).map((f) => f.path),
        },
        "critical"
      )
    }

    // Conflict resolution
    if (previous.hasConflicts && !current.hasConflicts) {
      this.emitGitEvent(
        "resolve",
        "conflict-resolved",
        {
          branch: current.branch,
        },
        "medium"
      )
    }

    // Remote changes (ahead/behind)
    if (previous.ahead !== current.ahead || previous.behind !== current.behind) {
      if (current.behind > previous.behind) {
        this.emitGitEvent(
          "pull",
          "remote-changes",
          {
            branch: current.branch,
            behind: current.behind,
            remoteName: current.remoteBranch,
          },
          "medium"
        )
      }
    }
  }

  private async getCommitInfo(hash: string): Promise<GitCommit | null> {
    try {
      const { stdout } = await execAsync(`git show --name-status --pretty=format:"%H|%h|%an|%ae|%ct|%s" ${hash}`, {
        cwd: this.config.projectRoot,
      })

      const lines = stdout.split("\n")
      const [commitLine, ...fileLines] = lines
      const [fullHash, shortHash, author, email, timestamp, message] = commitLine.split("|")

      const files: GitFileStatus[] = fileLines
        .filter((line) => line.includes("\t"))
        .map((line) => {
          const [status, path] = line.split("\t")
          return { path, status: status as any }
        })

      // Get stats
      const { stdout: statsOutput } = await execAsync(`git show --stat --format="" ${hash}`, {
        cwd: this.config.projectRoot,
      })

      const statsMatch = statsOutput.match(/(\d+) insertions?\(\+\), (\d+) deletions?\(\-\)/)
      const additions = statsMatch ? parseInt(statsMatch[1]) : 0
      const deletions = statsMatch ? parseInt(statsMatch[2]) : 0

      return {
        hash: fullHash,
        shortHash,
        author,
        email,
        timestamp: parseInt(timestamp) * 1000,
        message,
        files,
        additions,
        deletions,
      }
    } catch (error) {
      return null
    }
  }

  private emitGitEvent(
    operation: GitChangeEvent["operation"],
    target: string,
    metadata: Partial<GitChangeEvent["metadata"]>,
    priority: GitChangeEvent["priority"]
  ): void {
    const event: GitChangeEvent = {
      id: this.generateEventId(),
      type: "git",
      operation,
      target,
      metadata: {
        branch: this.currentStatus?.branch || "unknown",
        ...metadata,
      },
      timestamp: Date.now(),
      source: "git-monitor",
      priority,
    }

    this.emit("change", event)
  }

  private async execGit(args: string[]): Promise<string> {
    const { stdout } = await execAsync(`git ${args.join(" ")}`, {
      cwd: this.config.projectRoot,
    })
    return stdout
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  private hashObject(obj: any): string {
    return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex")
  }

  private generateEventId(): string {
    return crypto.randomBytes(8).toString("hex")
  }

  // Public API methods
  getStatus(): GitStatus | null {
    return this.currentStatus
  }

  async getBranches(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git branch --format="%(refname:short)"', {
        cwd: this.config.projectRoot,
      })
      return stdout.split("\n").filter((line) => line.length > 0)
    } catch (error) {
      return []
    }
  }

  async getRemoteBranches(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git branch -r --format="%(refname:short)"', {
        cwd: this.config.projectRoot,
      })
      return stdout.split("\n").filter((line) => line.length > 0 && !line.includes("HEAD"))
    } catch (error) {
      return []
    }
  }

  async getCommitHistory(limit: number = 50): Promise<GitCommit[]> {
    try {
      const { stdout } = await execAsync(`git log --pretty=format:"%H|%h|%an|%ae|%ct|%s" -n ${limit}`, {
        cwd: this.config.projectRoot,
      })

      const commits: GitCommit[] = []
      for (const line of stdout.split("\n")) {
        if (line.length === 0) continue

        const [hash, shortHash, author, email, timestamp, message] = line.split("|")
        commits.push({
          hash,
          shortHash,
          author,
          email,
          timestamp: parseInt(timestamp) * 1000,
          message,
          files: [], // Can be populated on demand
          additions: 0,
          deletions: 0,
        })
      }

      return commits
    } catch (error) {
      return []
    }
  }

  async forceUpdate(): Promise<void> {
    this.lastStatusHash = "" // Force status update
    await this.updateStatus()
  }

  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [GitMonitor:${level.toUpperCase()}]`
    console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](prefix, message, ...args)
  }
}
