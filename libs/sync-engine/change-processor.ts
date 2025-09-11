/**
 * Change Event Processing for Lions of Zion Sync Engine
 *
 * Features:
 * - Priority-based event processing queue
 * - Intelligent batching for performance optimization
 * - Change impact analysis and categorization
 * - Notification filtering and aggregation
 * - Concurrency control and rate limiting
 * - Event deduplication and conflict resolution
 * - Performance metrics and monitoring
 * - Graceful error handling and recovery
 */

import { EventEmitter } from "events"
import { StateManager } from "./state-manager"

export interface ChangeProcessorConfig {
  maxConcurrentChanges: number
  batchSize?: number
  batchTimeout?: number
  maxQueueSize?: number
  enableDeduplication?: boolean
  enableBatching?: boolean
  priorityThresholds?: PriorityThresholds
  rateLimits?: RateLimits
}

export interface PriorityThresholds {
  critical: number // Max concurrent critical changes
  high: number // Max concurrent high priority changes
  medium: number // Max concurrent medium priority changes
  low: number // Max concurrent low priority changes
}

export interface RateLimits {
  changesPerSecond: number
  burstLimit: number
  windowMs: number
}

export interface ProcessingMetrics {
  totalProcessed: number
  currentQueueSize: number
  averageProcessingTime: number
  errorRate: number
  throughput: number
  batchesProcessed: number
  duplicatesFiltered: number
  priorityDistribution: Record<string, number>
}

export interface ChangeEvent {
  id: string
  type: "file" | "git" | "dependency" | "build" | "server"
  operation: string
  target: string
  metadata: Record<string, any>
  timestamp: number
  source: string
  priority: "low" | "medium" | "high" | "critical"
  batchId?: string
  processingStarted?: number
  processingCompleted?: number
  attempts?: number
  lastError?: string
}

export interface ProcessingBatch {
  id: string
  events: ChangeEvent[]
  priority: "low" | "medium" | "high" | "critical"
  created: number
  size: number
  category: string
}

export interface ChangeImpact {
  category: "minor" | "moderate" | "significant" | "critical"
  affectedSystems: string[]
  estimatedUsers: number
  recoveryComplexity: "simple" | "moderate" | "complex"
  rollbackPossible: boolean
  description: string
}

export class ChangeProcessor extends EventEmitter {
  private config: ChangeProcessorConfig
  private stateManager: StateManager
  private isInitialized = false
  private isProcessing = false
  private processingQueue: ChangeEvent[] = []
  private batchQueue: ProcessingBatch[] = []
  private activeProcessors = new Map<string, Promise<void>>()
  private batchTimer: NodeJS.Timeout | null = null
  private metrics: ProcessingMetrics
  private rateLimitTokens: number = 0
  private lastTokenRefill: number = Date.now()
  private eventHashes = new Set<string>()
  private processingHistory: ChangeEvent[] = []

  constructor(config: ChangeProcessorConfig) {
    super()

    this.config = {
      batchSize: 10,
      batchTimeout: 1000, // 1 second
      maxQueueSize: 1000,
      enableDeduplication: true,
      enableBatching: true,
      priorityThresholds: {
        critical: 5,
        high: 10,
        medium: 20,
        low: 50,
      },
      rateLimits: {
        changesPerSecond: 100,
        burstLimit: 200,
        windowMs: 1000,
      },
      ...config,
    }

    this.stateManager = config.stateManager
    this.rateLimitTokens = this.config.rateLimits!.burstLimit

    // Initialize metrics
    this.metrics = {
      totalProcessed: 0,
      currentQueueSize: 0,
      averageProcessingTime: 0,
      errorRate: 0,
      throughput: 0,
      batchesProcessed: 0,
      duplicatesFiltered: 0,
      priorityDistribution: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error("ChangeProcessor is already initialized")
    }

    try {
      // Setup batch processing timer
      if (this.config.enableBatching) {
        this.setupBatchTimer()
      }

      // Setup metrics collection
      this.setupMetricsCollection()

      this.isInitialized = true
      this.log("info", "ChangeProcessor initialized successfully")
    } catch (error) {
      this.log("error", "Failed to initialize ChangeProcessor:", error)
      throw error
    }
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.isProcessing) {
      this.log("warn", "ChangeProcessor is already processing")
      return
    }

    try {
      this.isProcessing = true
      this.log("info", "ChangeProcessor started successfully")
      this.emit("started")
    } catch (error) {
      this.log("error", "Failed to start ChangeProcessor:", error)
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this.isProcessing) {
      this.log("warn", "ChangeProcessor is not processing")
      return
    }

    try {
      this.isProcessing = false

      // Wait for active processors to complete
      await Promise.all(Array.from(this.activeProcessors.values()))

      // Clear batch timer
      if (this.batchTimer) {
        clearTimeout(this.batchTimer)
        this.batchTimer = null
      }

      // Process remaining items in queue
      if (this.processingQueue.length > 0) {
        this.log("info", `Processing ${this.processingQueue.length} remaining items`)
        await this.flushQueue()
      }

      this.log("info", "ChangeProcessor stopped successfully")
      this.emit("stopped")
    } catch (error) {
      this.log("error", "Failed to stop ChangeProcessor:", error)
      throw error
    }
  }

  async processChange(event: ChangeEvent): Promise<void> {
    if (!this.isInitialized || !this.isProcessing) {
      throw new Error("ChangeProcessor not initialized or started")
    }

    try {
      // Apply rate limiting
      if (!this.checkRateLimit()) {
        this.log("warn", "Rate limit exceeded, dropping event:", event.id)
        return
      }

      // Deduplicate if enabled
      if (this.config.enableDeduplication && this.isDuplicate(event)) {
        this.metrics.duplicatesFiltered++
        this.log("debug", "Filtered duplicate event:", event.id)
        return
      }

      // Check queue size limits
      if (this.processingQueue.length >= this.config.maxQueueSize!) {
        this.log("warn", "Queue size limit exceeded, dropping oldest event")
        this.processingQueue.shift()
      }

      // Add to processing queue
      this.processingQueue.push(event)
      this.metrics.currentQueueSize = this.processingQueue.length

      // Update priority distribution
      this.metrics.priorityDistribution[event.priority]++

      // Process immediately or batch
      if (this.config.enableBatching) {
        await this.scheduleBatchProcessing()
      } else {
        await this.processSingleEvent(event)
      }
    } catch (error) {
      this.log("error", "Failed to process change:", error)
      this.emit("processingError", event, error)
      throw error
    }
  }

  private async processSingleEvent(event: ChangeEvent): Promise<void> {
    const startTime = Date.now()
    event.processingStarted = startTime
    event.attempts = (event.attempts || 0) + 1

    try {
      // Analyze change impact
      const impact = await this.analyzeChangeImpact(event)

      // Emit processing event
      this.emit("processing", event, impact)

      // Apply rate limiting based on priority
      await this.applyPriorityThrottling(event)

      // Process the change
      await this.executeChange(event)

      // Mark as completed
      event.processingCompleted = Date.now()
      const processingTime = event.processingCompleted - startTime

      // Update metrics
      this.updateProcessingMetrics(processingTime, true)

      // Remove from queue
      this.removeFromQueue(event)

      // Add to history
      this.addToHistory(event)

      // Emit completion
      this.emit("processed", event, impact)

      this.log("debug", `Processed event ${event.id} in ${processingTime}ms`)
    } catch (error) {
      event.lastError = error.message
      this.updateProcessingMetrics(Date.now() - startTime, false)

      // Retry logic for transient failures
      if (event.attempts! < 3 && this.isRetryableError(error)) {
        this.log("warn", `Retrying event ${event.id} (attempt ${event.attempts})`)
        setTimeout(() => this.processSingleEvent(event), 1000 * event.attempts!)
      } else {
        this.log("error", `Failed to process event ${event.id} after ${event.attempts} attempts:`, error)
        this.removeFromQueue(event)
        this.emit("processingError", event, error)
      }

      throw error
    }
  }

  private async scheduleBatchProcessing(): Promise<void> {
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(async () => {
        this.batchTimer = null
        await this.processBatches()
      }, this.config.batchTimeout)
    }

    // Check if we should process immediately based on queue size or priority
    const criticalEvents = this.processingQueue.filter((e) => e.priority === "critical")
    const highPriorityEvents = this.processingQueue.filter((e) => ["critical", "high"].includes(e.priority))

    if (
      criticalEvents.length > 0 ||
      this.processingQueue.length >= this.config.batchSize! ||
      highPriorityEvents.length >= this.config.batchSize! / 2
    ) {
      if (this.batchTimer) {
        clearTimeout(this.batchTimer)
        this.batchTimer = null
      }

      await this.processBatches()
    }
  }

  private async processBatches(): Promise<void> {
    if (this.processingQueue.length === 0) {
      return
    }

    try {
      // Create batches based on priority and type
      const batches = this.createBatches()

      // Process batches in priority order
      for (const batch of batches) {
        await this.processBatch(batch)
      }
    } catch (error) {
      this.log("error", "Error during batch processing:", error)
    }
  }

  private createBatches(): ProcessingBatch[] {
    const batches: ProcessingBatch[] = []
    const eventsByPriority = this.groupEventsByPriority()

    // Process each priority level
    for (const [priority, events] of Object.entries(eventsByPriority)) {
      if (events.length === 0) continue

      // Group by type for more efficient processing
      const eventsByType = this.groupEventsByType(events)

      for (const [type, typeEvents] of Object.entries(eventsByType)) {
        // Create batches of appropriate size
        for (let i = 0; i < typeEvents.length; i += this.config.batchSize!) {
          const batchEvents = typeEvents.slice(i, i + this.config.batchSize!)

          batches.push({
            id: this.generateBatchId(),
            events: batchEvents,
            priority: priority as any,
            created: Date.now(),
            size: batchEvents.length,
            category: type,
          })
        }
      }
    }

    // Sort by priority (critical first)
    return batches.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  private async processBatch(batch: ProcessingBatch): Promise<void> {
    const startTime = Date.now()

    try {
      this.log("info", `Processing batch ${batch.id} with ${batch.size} events (${batch.priority} priority)`)

      // Set batch ID on all events
      batch.events.forEach((event) => {
        event.batchId = batch.id
        event.processingStarted = startTime
      })

      // Apply rate limiting for the entire batch
      await this.applyBatchRateLimiting(batch)

      // Process events in parallel with concurrency limits
      const processingPromises = batch.events.map((event) => this.executeChangeWithThrottling(event, batch.priority))

      await Promise.all(processingPromises)

      // Update metrics
      const processingTime = Date.now() - startTime
      this.metrics.batchesProcessed++
      this.metrics.totalProcessed += batch.size

      // Remove processed events from queue
      batch.events.forEach((event) => this.removeFromQueue(event))

      // Add to history
      batch.events.forEach((event) => this.addToHistory(event))

      this.emit("batchProcessed", batch.events)

      this.log("info", `Batch ${batch.id} processed in ${processingTime}ms`)
    } catch (error) {
      this.log("error", `Failed to process batch ${batch.id}:`, error)

      // Handle partial failures - retry individual events
      for (const event of batch.events) {
        if (!event.processingCompleted) {
          await this.processSingleEvent(event)
        }
      }

      throw error
    }
  }

  private async executeChangeWithThrottling(event: ChangeEvent, batchPriority: string): Promise<void> {
    // Apply concurrency limits based on priority
    const activeCount = this.activeProcessors.size
    const threshold = this.config.priorityThresholds![batchPriority]

    if (activeCount >= threshold) {
      // Wait for a processor to become available
      await Promise.race(Array.from(this.activeProcessors.values()))
    }

    // Create processing promise
    const processingPromise = this.executeChange(event)
    this.activeProcessors.set(event.id, processingPromise)

    try {
      await processingPromise
    } finally {
      this.activeProcessors.delete(event.id)
    }
  }

  private async executeChange(event: ChangeEvent): Promise<void> {
    try {
      // Convert to StateManager format
      const stateChange = {
        id: event.id,
        type: event.type,
        operation: event.operation,
        target: event.target,
        metadata: event.metadata,
        timestamp: event.timestamp,
        source: event.source,
        applied: false,
      }

      // Apply the change to state manager
      await this.stateManager.applyChange(stateChange)

      event.processingCompleted = Date.now()
    } catch (error) {
      this.log("error", `Failed to execute change for event ${event.id}:`, error)
      throw error
    }
  }

  private async analyzeChangeImpact(event: ChangeEvent): Promise<ChangeImpact> {
    // Analyze the potential impact of this change
    let category: ChangeImpact["category"] = "minor"
    let affectedSystems: string[] = []
    let estimatedUsers = 0
    let recoveryComplexity: ChangeImpact["recoveryComplexity"] = "simple"

    switch (event.type) {
      case "file":
        affectedSystems.push("file-system")
        if (event.metadata.fileType === "config") {
          category = "moderate"
          affectedSystems.push("configuration")
        }
        if (event.metadata.fileType === "source") {
          category = "significant"
          affectedSystems.push("application")
          estimatedUsers = 100
        }
        break

      case "git":
        affectedSystems.push("version-control")
        if (event.operation === "conflict") {
          category = "critical"
          recoveryComplexity = "complex"
          estimatedUsers = 1000
        }
        break

      case "dependency":
        affectedSystems.push("package-management", "application")
        if (event.operation === "vulnerability") {
          category = "critical"
          recoveryComplexity = "moderate"
          estimatedUsers = 1000
        }
        if (event.metadata.semverType === "major") {
          category = "significant"
          recoveryComplexity = "moderate"
        }
        break

      case "build":
        affectedSystems.push("build-system")
        if (event.operation === "failed") {
          category = "significant"
          estimatedUsers = 50
        }
        break

      case "server":
        affectedSystems.push("runtime")
        if (event.operation === "error") {
          category = "critical"
          estimatedUsers = 1000
          recoveryComplexity = "complex"
        }
        break
    }

    return {
      category,
      affectedSystems,
      estimatedUsers,
      recoveryComplexity,
      rollbackPossible: category !== "critical",
      description: `${event.type} ${event.operation} on ${event.target}`,
    }
  }

  private checkRateLimit(): boolean {
    const now = Date.now()
    const timeDiff = now - this.lastTokenRefill

    // Refill tokens based on time elapsed
    if (timeDiff >= this.config.rateLimits!.windowMs) {
      this.rateLimitTokens = Math.min(
        this.config.rateLimits!.burstLimit,
        this.rateLimitTokens +
          Math.floor(timeDiff / this.config.rateLimits!.windowMs) * this.config.rateLimits!.changesPerSecond
      )
      this.lastTokenRefill = now
    }

    // Check if we have tokens available
    if (this.rateLimitTokens > 0) {
      this.rateLimitTokens--
      return true
    }

    return false
  }

  private isDuplicate(event: ChangeEvent): boolean {
    const eventHash = this.generateEventHash(event)

    if (this.eventHashes.has(eventHash)) {
      return true
    }

    this.eventHashes.add(eventHash)

    // Cleanup old hashes to prevent memory leak
    if (this.eventHashes.size > 10000) {
      const hashes = Array.from(this.eventHashes)
      this.eventHashes.clear()
      // Keep the most recent half
      hashes.slice(-5000).forEach((hash) => this.eventHashes.add(hash))
    }

    return false
  }

  private generateEventHash(event: ChangeEvent): string {
    const hashInput = `${event.type}:${event.operation}:${event.target}:${event.timestamp}`
    return Buffer.from(hashInput).toString("base64")
  }

  private async applyPriorityThrottling(event: ChangeEvent): Promise<void> {
    // Apply delays based on priority to prevent overwhelming the system
    const delays = {
      critical: 0,
      high: 10,
      medium: 50,
      low: 100,
    }

    const delay = delays[event.priority]
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  private async applyBatchRateLimiting(batch: ProcessingBatch): Promise<void> {
    // Apply rate limiting for batch processing
    const delay = Math.max(0, (batch.size / this.config.rateLimits!.changesPerSecond) * 1000)
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  private groupEventsByPriority(): Record<string, ChangeEvent[]> {
    const groups: Record<string, ChangeEvent[]> = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    }

    for (const event of this.processingQueue) {
      groups[event.priority].push(event)
    }

    return groups
  }

  private groupEventsByType(events: ChangeEvent[]): Record<string, ChangeEvent[]> {
    const groups: Record<string, ChangeEvent[]> = {}

    for (const event of events) {
      if (!groups[event.type]) {
        groups[event.type] = []
      }
      groups[event.type].push(event)
    }

    return groups
  }

  private removeFromQueue(event: ChangeEvent): void {
    const index = this.processingQueue.findIndex((e) => e.id === event.id)
    if (index !== -1) {
      this.processingQueue.splice(index, 1)
      this.metrics.currentQueueSize = this.processingQueue.length
    }
  }

  private addToHistory(event: ChangeEvent): void {
    this.processingHistory.push(event)

    // Limit history size
    if (this.processingHistory.length > 1000) {
      this.processingHistory.shift()
    }
  }

  private updateProcessingMetrics(processingTime: number, success: boolean): void {
    this.metrics.totalProcessed++

    // Update average processing time
    const currentAvg = this.metrics.averageProcessingTime
    this.metrics.averageProcessingTime =
      (currentAvg * (this.metrics.totalProcessed - 1) + processingTime) / this.metrics.totalProcessed

    // Update error rate
    if (!success) {
      const errors = this.metrics.totalProcessed * this.metrics.errorRate + 1
      this.metrics.errorRate = errors / this.metrics.totalProcessed
    } else {
      this.metrics.errorRate =
        (this.metrics.errorRate * (this.metrics.totalProcessed - 1)) / this.metrics.totalProcessed
    }

    // Calculate throughput (events per second over last minute)
    const recentEvents = this.processingHistory.filter((e) => e.processingCompleted! > Date.now() - 60000)
    this.metrics.throughput = recentEvents.length / 60
  }

  private isRetryableError(error: any): boolean {
    // Define which errors should trigger retries
    const retryableErrors = ["ENOENT", "ECONNREFUSED", "TIMEOUT", "NETWORK_ERROR"]

    return retryableErrors.some((errorType) => error.code === errorType || error.message.includes(errorType))
  }

  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupBatchTimer(): void {
    // Batch timer is created dynamically when needed
  }

  private setupMetricsCollection(): void {
    // Emit metrics periodically
    setInterval(() => {
      this.emit("metrics", { ...this.metrics })
    }, 30000) // Every 30 seconds
  }

  private async flushQueue(): Promise<void> {
    while (this.processingQueue.length > 0) {
      const event = this.processingQueue.shift()!
      try {
        await this.processSingleEvent(event)
      } catch (error) {
        this.log("error", `Failed to process queued event ${event.id}:`, error)
      }
    }
  }

  // Public API methods
  getMetrics(): ProcessingMetrics {
    return { ...this.metrics }
  }

  getQueueStatus(): {
    size: number
    priorityBreakdown: Record<string, number>
    oldestEvent?: ChangeEvent
  } {
    const priorityBreakdown = this.groupEventsByPriority()
    const priorityCounts = Object.fromEntries(
      Object.entries(priorityBreakdown).map(([priority, events]) => [priority, events.length])
    )

    return {
      size: this.processingQueue.length,
      priorityBreakdown: priorityCounts,
      oldestEvent: this.processingQueue[0],
    }
  }

  getProcessingHistory(limit: number = 100): ChangeEvent[] {
    return this.processingHistory.slice(-limit)
  }

  async pauseProcessing(): Promise<void> {
    this.isProcessing = false
    this.log("info", "Processing paused")
  }

  async resumeProcessing(): Promise<void> {
    this.isProcessing = true
    this.log("info", "Processing resumed")

    if (this.processingQueue.length > 0) {
      await this.processBatches()
    }
  }

  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [ChangeProcessor:${level.toUpperCase()}]`
    console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](prefix, message, ...args)
  }
}
