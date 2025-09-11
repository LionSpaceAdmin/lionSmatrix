/**
 * WebSocket/SSE Client for Lions of Zion Sync Engine
 *
 * Features:
 * - Robust WebSocket connection with automatic reconnection
 * - Server-Sent Events (SSE) fallback support
 * - Connection health monitoring and heartbeat
 * - Message queuing during disconnection
 * - Connection state management and recovery
 * - Protocol negotiation and version compatibility
 * - Real-time bi-directional communication
 * - Error handling and graceful degradation
 */

import { EventEmitter } from "events"

export interface SyncClientConfig {
  websocketUrl?: string
  sseUrl?: string
  fallbackToSSE: boolean
  projectRoot: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  messageQueueSize?: number
  connectionTimeout?: number
  enableCompression?: boolean
  protocolVersion?: string
}

export interface ConnectionState {
  status: "disconnected" | "connecting" | "connected" | "reconnecting" | "failed"
  type: "websocket" | "sse" | "none"
  lastConnected?: number
  lastDisconnected?: number
  reconnectAttempts: number
  latency?: number
  messagesQueued: number
  messagesSent: number
  messagesReceived: number
  bytesTransferred: number
}

export interface SyncMessage {
  id: string
  type: "state-update" | "ping" | "pong" | "error" | "sync-request" | "heartbeat"
  payload: any
  timestamp: number
  source: string
  priority: "low" | "medium" | "high" | "critical"
  requiresAck?: boolean
  compressed?: boolean
}

export interface SyncStats {
  connectionUptime: number
  totalReconnects: number
  averageLatency: number
  messagesPerSecond: number
  errorRate: number
  compressionRatio?: number
}

export class SyncClient extends EventEmitter {
  private config: SyncClientConfig
  private isInitialized = false
  private connectionState: ConnectionState
  private websocket: WebSocket | null = null
  private eventSource: EventSource | null = null
  private messageQueue: SyncMessage[] = []
  private pendingAcks = new Map<string, { message: SyncMessage; timeout: NodeJS.Timeout }>()
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private lastHeartbeat = 0
  private connectionStartTime = 0
  private stats: SyncStats

  constructor(config: SyncClientConfig) {
    super()

    this.config = {
      reconnectInterval: 5000, // 5 seconds
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000, // 30 seconds
      messageQueueSize: 1000,
      connectionTimeout: 10000, // 10 seconds
      enableCompression: true,
      protocolVersion: "1.0",
      ...config,
    }

    // Initialize connection state
    this.connectionState = {
      status: "disconnected",
      type: "none",
      reconnectAttempts: 0,
      messagesQueued: 0,
      messagesSent: 0,
      messagesReceived: 0,
      bytesTransferred: 0,
    }

    // Initialize stats
    this.stats = {
      connectionUptime: 0,
      totalReconnects: 0,
      averageLatency: 0,
      messagesPerSecond: 0,
      errorRate: 0,
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error("SyncClient is already initialized")
    }

    try {
      // Validate configuration
      await this.validateConfig()

      // Setup periodic stats collection
      this.setupStatsCollection()

      this.isInitialized = true
      this.log("info", "SyncClient initialized successfully")
    } catch (error) {
      this.log("error", "Failed to initialize SyncClient:", error)
      throw error
    }
  }

  async connect(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.connectionState.status === "connected" || this.connectionState.status === "connecting") {
      this.log("warn", "SyncClient is already connected or connecting")
      return
    }

    try {
      this.connectionState.status = "connecting"
      this.connectionStartTime = Date.now()

      // Try WebSocket first, then fall back to SSE
      let connected = false

      if (this.config.websocketUrl) {
        connected = await this.connectWebSocket()
      }

      if (!connected && this.config.fallbackToSSE && this.config.sseUrl) {
        connected = await this.connectSSE()
      }

      if (!connected) {
        throw new Error("Failed to establish any connection")
      }

      this.connectionState.status = "connected"
      this.connectionState.lastConnected = Date.now()
      this.connectionState.reconnectAttempts = 0

      // Start heartbeat
      this.startHeartbeat()

      // Process queued messages
      await this.processMessageQueue()

      this.log("info", `Connected via ${this.connectionState.type}`)
      this.emit("connected", this.connectionState)
    } catch (error) {
      this.connectionState.status = "failed"
      this.log("error", "Failed to connect:", error)
      this.emit("error", error)

      // Schedule reconnection
      this.scheduleReconnect()
      throw error
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.connectionState.status = "disconnected"

      // Stop heartbeat
      this.stopHeartbeat()

      // Cancel reconnection attempts
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }

      // Close connections
      if (this.websocket) {
        this.websocket.close(1000, "Normal closure")
        this.websocket = null
      }

      if (this.eventSource) {
        this.eventSource.close()
        this.eventSource = null
      }

      this.connectionState.lastDisconnected = Date.now()
      this.connectionState.type = "none"

      this.log("info", "Disconnected successfully")
      this.emit("disconnected", this.connectionState)
    } catch (error) {
      this.log("error", "Error during disconnect:", error)
      throw error
    }
  }

  async sendStateUpdate(state: any): Promise<void> {
    const message: SyncMessage = {
      id: this.generateMessageId(),
      type: "state-update",
      payload: state,
      timestamp: Date.now(),
      source: "sync-client",
      priority: "medium",
      requiresAck: true,
    }

    await this.sendMessage(message)
  }

  async sendMessage(message: SyncMessage): Promise<void> {
    try {
      // Add to queue if not connected
      if (this.connectionState.status !== "connected") {
        this.queueMessage(message)
        return
      }

      // Compress message if enabled
      if (this.config.enableCompression && this.shouldCompressMessage(message)) {
        message = await this.compressMessage(message)
      }

      // Send via appropriate transport
      if (this.connectionState.type === "websocket" && this.websocket) {
        await this.sendWebSocketMessage(message)
      } else {
        // SSE is read-only, queue message for later WebSocket connection
        this.queueMessage(message)
      }

      // Handle acknowledgments
      if (message.requiresAck) {
        this.setupMessageAcknowledgment(message)
      }

      this.connectionState.messagesSent++
      this.updateStats("messageSent", message)
    } catch (error) {
      this.log("error", "Failed to send message:", error)
      this.queueMessage(message)
      throw error
    }
  }

  private async connectWebSocket(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const wsUrl = this.buildWebSocketUrl()
        this.websocket = new WebSocket(wsUrl)

        const connectionTimeout = setTimeout(() => {
          if (this.websocket) {
            this.websocket.close()
          }
          resolve(false)
        }, this.config.connectionTimeout)

        this.websocket.onopen = () => {
          clearTimeout(connectionTimeout)
          this.connectionState.type = "websocket"
          this.setupWebSocketHandlers()
          this.sendHandshake()
          resolve(true)
        }

        this.websocket.onerror = () => {
          clearTimeout(connectionTimeout)
          resolve(false)
        }

        this.websocket.onclose = () => {
          clearTimeout(connectionTimeout)
          if (this.connectionState.status === "connected") {
            this.handleDisconnection("WebSocket closed")
          }
        }
      } catch (error) {
        this.log("debug", "WebSocket connection failed:", error)
        resolve(false)
      }
    })
  }

  private async connectSSE(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const sseUrl = this.buildSSEUrl()
        this.eventSource = new EventSource(sseUrl)

        const connectionTimeout = setTimeout(() => {
          if (this.eventSource) {
            this.eventSource.close()
          }
          resolve(false)
        }, this.config.connectionTimeout)

        this.eventSource.onopen = () => {
          clearTimeout(connectionTimeout)
          this.connectionState.type = "sse"
          this.setupSSEHandlers()
          resolve(true)
        }

        this.eventSource.onerror = () => {
          clearTimeout(connectionTimeout)
          if (this.connectionState.status === "connected") {
            this.handleDisconnection("SSE connection error")
          } else {
            resolve(false)
          }
        }
      } catch (error) {
        this.log("debug", "SSE connection failed:", error)
        resolve(false)
      }
    })
  }

  private setupWebSocketHandlers(): void {
    if (!this.websocket) return

    this.websocket.onmessage = async (event) => {
      try {
        const message = await this.parseMessage(event.data)
        await this.handleIncomingMessage(message)
      } catch (error) {
        this.log("error", "Failed to handle WebSocket message:", error)
      }
    }

    this.websocket.onclose = (event) => {
      this.log("info", `WebSocket closed: ${event.code} - ${event.reason}`)
      this.handleDisconnection("WebSocket closed")
    }

    this.websocket.onerror = (error) => {
      this.log("error", "WebSocket error:", error)
      this.emit("error", error)
    }
  }

  private setupSSEHandlers(): void {
    if (!this.eventSource) return

    this.eventSource.onmessage = async (event) => {
      try {
        const message = await this.parseMessage(event.data)
        await this.handleIncomingMessage(message)
      } catch (error) {
        this.log("error", "Failed to handle SSE message:", error)
      }
    }

    // Listen for specific event types
    this.eventSource.addEventListener("state-update", async (event) => {
      try {
        const message = await this.parseMessage((event as MessageEvent).data)
        this.emit("remoteChange", message.payload)
      } catch (error) {
        this.log("error", "Failed to handle state-update:", error)
      }
    })

    this.eventSource.addEventListener("heartbeat", () => {
      this.lastHeartbeat = Date.now()
    })
  }

  private async handleIncomingMessage(message: SyncMessage): Promise<void> {
    this.connectionState.messagesReceived++
    this.updateStats("messageReceived", message)

    // Handle different message types
    switch (message.type) {
      case "state-update":
        this.emit("remoteChange", message.payload)
        break

      case "ping":
        await this.sendPong(message.id)
        break

      case "pong":
        this.handlePongResponse(message)
        break

      case "heartbeat":
        this.lastHeartbeat = Date.now()
        break

      case "error":
        this.log("error", "Received error message:", message.payload)
        this.emit("error", new Error(message.payload.message))
        break

      default:
        this.log("warn", "Unknown message type:", message.type)
    }

    // Send acknowledgment if required
    if (message.requiresAck) {
      await this.sendAcknowledgment(message.id)
    }
  }

  private async sendWebSocketMessage(message: SyncMessage): Promise<void> {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not ready")
    }

    const serialized = JSON.stringify(message)
    this.websocket.send(serialized)
    this.connectionState.bytesTransferred += serialized.length
  }

  private async sendHandshake(): Promise<void> {
    const handshake: SyncMessage = {
      id: this.generateMessageId(),
      type: "sync-request",
      payload: {
        protocolVersion: this.config.protocolVersion,
        clientType: "sync-client",
        projectRoot: this.config.projectRoot,
        capabilities: {
          compression: this.config.enableCompression,
          heartbeat: true,
        },
      },
      timestamp: Date.now(),
      source: "sync-client",
      priority: "high",
    }

    await this.sendMessage(handshake)
  }

  private async sendPong(pingId: string): Promise<void> {
    const pong: SyncMessage = {
      id: this.generateMessageId(),
      type: "pong",
      payload: { pingId },
      timestamp: Date.now(),
      source: "sync-client",
      priority: "high",
    }

    await this.sendMessage(pong)
  }

  private async sendAcknowledgment(messageId: string): Promise<void> {
    if (this.connectionState.type !== "websocket") return

    const ack: SyncMessage = {
      id: this.generateMessageId(),
      type: "ping", // Reuse ping type for acks
      payload: { ackFor: messageId },
      timestamp: Date.now(),
      source: "sync-client",
      priority: "high",
    }

    await this.sendMessage(ack)
  }

  private handlePongResponse(message: SyncMessage): void {
    const pingId = message.payload.pingId
    const ackData = this.pendingAcks.get(pingId)

    if (ackData) {
      clearTimeout(ackData.timeout)
      this.pendingAcks.delete(pingId)

      // Calculate latency
      const latency = Date.now() - ackData.message.timestamp
      this.updateLatency(latency)
    }
  }

  private queueMessage(message: SyncMessage): void {
    // Check queue size limit
    if (this.messageQueue.length >= this.config.messageQueueSize!) {
      // Remove oldest low priority message
      const lowPriorityIndex = this.messageQueue.findIndex((m) => m.priority === "low")
      if (lowPriorityIndex !== -1) {
        this.messageQueue.splice(lowPriorityIndex, 1)
      } else {
        this.messageQueue.shift() // Remove oldest
      }
    }

    this.messageQueue.push(message)
    this.connectionState.messagesQueued = this.messageQueue.length

    this.log("debug", `Queued message ${message.id} (queue size: ${this.messageQueue.length})`)
  }

  private async processMessageQueue(): Promise<void> {
    if (this.messageQueue.length === 0) return

    this.log("info", `Processing ${this.messageQueue.length} queued messages`)

    // Sort by priority and timestamp
    this.messageQueue.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      return priorityDiff !== 0 ? priorityDiff : a.timestamp - b.timestamp
    })

    // Process messages with rate limiting
    for (const message of this.messageQueue) {
      try {
        await this.sendMessage(message)
        await new Promise((resolve) => setTimeout(resolve, 10)) // Small delay
      } catch (error) {
        this.log("error", `Failed to send queued message ${message.id}:`, error)
      }
    }

    this.messageQueue = []
    this.connectionState.messagesQueued = 0
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(async () => {
      try {
        await this.sendHeartbeat()

        // Check if we've received a heartbeat recently
        const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeat
        if (timeSinceLastHeartbeat > this.config.heartbeatInterval! * 2) {
          this.log("warn", "Heartbeat timeout, connection may be stale")
          this.handleDisconnection("Heartbeat timeout")
        }
      } catch (error) {
        this.log("error", "Heartbeat failed:", error)
      }
    }, this.config.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private async sendHeartbeat(): Promise<void> {
    const heartbeat: SyncMessage = {
      id: this.generateMessageId(),
      type: "ping",
      payload: { heartbeat: true },
      timestamp: Date.now(),
      source: "sync-client",
      priority: "low",
    }

    await this.sendMessage(heartbeat)
  }

  private handleDisconnection(reason: string): void {
    this.log("warn", `Connection lost: ${reason}`)

    this.connectionState.status = "disconnected"
    this.connectionState.lastDisconnected = Date.now()
    this.connectionState.type = "none"

    this.stopHeartbeat()
    this.emit("disconnected", { reason, state: this.connectionState })

    // Schedule reconnection
    this.scheduleReconnect()
  }

  private scheduleReconnect(): void {
    if (this.connectionState.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      this.log("error", "Max reconnection attempts reached")
      this.connectionState.status = "failed"
      this.emit("connectionFailed", this.connectionState)
      return
    }

    // Exponential backoff
    const delay = Math.min(
      this.config.reconnectInterval! * Math.pow(2, this.connectionState.reconnectAttempts),
      30000 // Max 30 seconds
    )

    this.connectionState.reconnectAttempts++
    this.connectionState.status = "reconnecting"

    this.log("info", `Scheduling reconnection in ${delay}ms (attempt ${this.connectionState.reconnectAttempts})`)

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.connect()
        this.stats.totalReconnects++
      } catch (error) {
        this.log("error", "Reconnection failed:", error)
      }
    }, delay)
  }

  private setupMessageAcknowledgment(message: SyncMessage): void {
    const timeout = setTimeout(() => {
      this.log("warn", `Message ${message.id} acknowledgment timeout`)
      this.pendingAcks.delete(message.id)
    }, 10000) // 10 second timeout

    this.pendingAcks.set(message.id, { message, timeout })
  }

  private updateLatency(latency: number): void {
    this.connectionState.latency = latency

    // Update average latency
    const currentAvg = this.stats.averageLatency
    this.stats.averageLatency = currentAvg === 0 ? latency : (currentAvg + latency) / 2
  }

  private updateStats(event: "messageSent" | "messageReceived", message: SyncMessage): void {
    const now = Date.now()

    // Update connection uptime
    if (this.connectionState.lastConnected) {
      this.stats.connectionUptime = now - this.connectionState.lastConnected
    }

    // Calculate messages per second (over last minute)
    const recentMessages = this.connectionState.messagesSent + this.connectionState.messagesReceived
    const timeWindow = Math.min(this.stats.connectionUptime, 60000) // 1 minute
    this.stats.messagesPerSecond = timeWindow > 0 ? (recentMessages / timeWindow) * 1000 : 0
  }

  private async parseMessage(data: string): Promise<SyncMessage> {
    try {
      const message = JSON.parse(data)

      // Decompress if needed
      if (message.compressed) {
        message.payload = await this.decompressData(message.payload)
      }

      return message
    } catch (error) {
      throw new Error(`Failed to parse message: ${error.message}`)
    }
  }

  private shouldCompressMessage(message: SyncMessage): boolean {
    // Compress large payloads
    const serialized = JSON.stringify(message.payload)
    return serialized.length > 1024 // 1KB threshold
  }

  private async compressMessage(message: SyncMessage): Promise<SyncMessage> {
    // Simple compression simulation (in real implementation, use actual compression)
    const compressed = JSON.stringify(message.payload)
    return {
      ...message,
      payload: compressed,
      compressed: true,
    }
  }

  private async decompressData(data: any): Promise<any> {
    // Simple decompression simulation
    return typeof data === "string" ? JSON.parse(data) : data
  }

  private buildWebSocketUrl(): string {
    const url = new URL(this.config.websocketUrl!)
    url.searchParams.set("protocol", this.config.protocolVersion!)
    url.searchParams.set("project", encodeURIComponent(this.config.projectRoot))
    return url.toString()
  }

  private buildSSEUrl(): string {
    const url = new URL(this.config.sseUrl!)
    url.searchParams.set("protocol", this.config.protocolVersion!)
    url.searchParams.set("project", encodeURIComponent(this.config.projectRoot))
    return url.toString()
  }

  private async validateConfig(): Promise<void> {
    if (!this.config.websocketUrl && !this.config.sseUrl) {
      throw new Error("At least one connection URL (websocketUrl or sseUrl) must be provided")
    }

    if (!this.config.projectRoot) {
      throw new Error("Project root is required")
    }
  }

  private setupStatsCollection(): void {
    setInterval(() => {
      this.emit("stats", { ...this.stats })
    }, 60000) // Every minute
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Public API methods
  getConnectionState(): ConnectionState {
    return { ...this.connectionState }
  }

  getStats(): SyncStats {
    return { ...this.stats }
  }

  getQueueSize(): number {
    return this.messageQueue.length
  }

  async forceReconnect(): Promise<void> {
    await this.disconnect()
    this.connectionState.reconnectAttempts = 0
    await this.connect()
  }

  async ping(): Promise<number> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const pingId = this.generateMessageId()

      const ping: SyncMessage = {
        id: pingId,
        type: "ping",
        payload: { manual: true },
        timestamp: startTime,
        source: "sync-client",
        priority: "high",
        requiresAck: true,
      }

      // Setup response handler
      const responseHandler = (message: SyncMessage) => {
        if (message.type === "pong" && message.payload.pingId === pingId) {
          const latency = Date.now() - startTime
          this.off("message", responseHandler)
          resolve(latency)
        }
      }

      this.on("message", responseHandler)

      // Send ping
      this.sendMessage(ping).catch(reject)

      // Timeout after 5 seconds
      setTimeout(() => {
        this.off("message", responseHandler)
        reject(new Error("Ping timeout"))
      }, 5000)
    })
  }

  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [SyncClient:${level.toUpperCase()}]`
    console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](prefix, message, ...args)
  }
}
