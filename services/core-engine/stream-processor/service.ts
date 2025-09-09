import { EventEmitter } from 'events';

export interface StreamData {
  id: string;
  type: 'intelligence' | 'threat' | 'network' | 'behavioral';
  payload: any;
  timestamp: Date;
  source: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface ProcessedData extends StreamData {
  processed: boolean;
  processingTime: number;
  enrichments: Record<string, any>;
  correlations: string[];
}

export interface StreamMetrics {
  throughput: number;
  latency: number;
  errorRate: number;
  backpressure: number;
  activeStreams: number;
}

export class StreamProcessorService extends EventEmitter {
  private buffer: StreamData[] = [];
  private processing = false;
  private metrics: StreamMetrics = {
    throughput: 0,
    latency: 0,
    errorRate: 0,
    backpressure: 0,
    activeStreams: 0,
  };

  async processIntelligenceStream(data: StreamData): Promise<ProcessedData> {
    const startTime = Date.now();
    
    // Add to buffer for batch processing
    this.buffer.push(data);
    
    // Check backpressure
    if (this.buffer.length > 1000) {
      this.handleBackpressure(1000);
    }

    // Process data
    const enrichments = await this.enrichData(data);
    const correlations = await this.findCorrelations(data);
    
    const processed: ProcessedData = {
      ...data,
      processed: true,
      processingTime: Date.now() - startTime,
      enrichments,
      correlations,
    };

    // Update metrics
    this.updateMetrics(processed.processingTime);
    
    // Emit processed event
    this.emit('data:processed', processed);
    
    return processed;
  }

  handleBackpressure(threshold: number): void {
    this.metrics.backpressure = this.buffer.length / threshold;
    
    if (this.metrics.backpressure > 0.8) {
      this.emit('backpressure:high', {
        current: this.buffer.length,
        threshold,
        pressure: this.metrics.backpressure,
      });
      
      // Apply backpressure strategies
      this.applyBackpressureStrategy();
    }
  }

  getMetrics(): StreamMetrics {
    return { ...this.metrics };
  }

  async startBatchProcessing(): Promise<void> {
    if (this.processing) return;
    
    this.processing = true;
    this.metrics.activeStreams++;
    
    while (this.processing) {
      if (this.buffer.length === 0) {
        await this.sleep(100);
        continue;
      }

      const batch = this.buffer.splice(0, Math.min(100, this.buffer.length));
      
      try {
        await Promise.all(
          batch.map(data => this.processSingleItem(data))
        );
      } catch (error) {
        this.metrics.errorRate++;
        this.emit('error', error);
      }
    }
    
    this.metrics.activeStreams--;
  }

  stopBatchProcessing(): void {
    this.processing = false;
  }

  private async enrichData(data: StreamData): Promise<Record<string, any>> {
    const enrichments: Record<string, any> = {};
    
    // Add geolocation for IP addresses
    if (data.type === 'network' && data.payload.ip) {
      enrichments.geolocation = await this.getGeolocation(data.payload.ip);
    }
    
    // Add threat intelligence
    if (data.type === 'threat') {
      enrichments.threatIntel = await this.getThreatIntelligence(data.payload);
    }
    
    // Add behavioral analysis
    if (data.type === 'behavioral') {
      enrichments.behaviorProfile = await this.analyzeBehavior(data.payload);
    }
    
    return enrichments;
  }

  private async findCorrelations(data: StreamData): Promise<string[]> {
    const correlations: string[] = [];
    
    // Find related events in buffer
    const related = this.buffer.filter(item => {
      if (item.id === data.id) return false;
      
      // Check temporal correlation (within 5 minutes)
      const timeDiff = Math.abs(item.timestamp.getTime() - data.timestamp.getTime());
      if (timeDiff > 5 * 60 * 1000) return false;
      
      // Check source correlation
      if (item.source === data.source) {
        correlations.push(`same-source:${item.id}`);
        return true;
      }
      
      // Check payload similarity
      if (this.checkPayloadSimilarity(item.payload, data.payload)) {
        correlations.push(`similar-payload:${item.id}`);
        return true;
      }
      
      return false;
    });
    
    return correlations;
  }

  private checkPayloadSimilarity(payload1: any, payload2: any): boolean {
    // Simple similarity check - can be enhanced with ML
    const keys1 = Object.keys(payload1);
    const keys2 = Object.keys(payload2);
    
    const commonKeys = keys1.filter(key => keys2.includes(key));
    const similarity = commonKeys.length / Math.max(keys1.length, keys2.length);
    
    return similarity > 0.7;
  }

  private async processSingleItem(data: StreamData): Promise<void> {
    // Process individual item
    const startTime = Date.now();
    
    try {
      // Simulate processing
      await this.sleep(10);
      
      const processingTime = Date.now() - startTime;
      this.updateMetrics(processingTime);
      
    } catch (error) {
      this.metrics.errorRate++;
      throw error;
    }
  }

  private updateMetrics(processingTime: number): void {
    // Update throughput (items per second)
    this.metrics.throughput = 1000 / processingTime;
    
    // Update latency (rolling average)
    this.metrics.latency = (this.metrics.latency * 0.9) + (processingTime * 0.1);
  }

  private applyBackpressureStrategy(): void {
    // Drop low priority items
    const highPriorityBuffer = this.buffer.filter(
      item => item.priority === 'critical' || item.priority === 'high'
    );
    
    const dropped = this.buffer.length - highPriorityBuffer.length;
    if (dropped > 0) {
      this.emit('backpressure:dropped', { count: dropped });
      this.buffer = highPriorityBuffer;
    }
  }

  private async getGeolocation(ip: string): Promise<any> {
    // Mock geolocation lookup
    return {
      country: 'US',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
    };
  }

  private async getThreatIntelligence(payload: any): Promise<any> {
    // Mock threat intelligence lookup
    return {
      reputation: 'malicious',
      firstSeen: new Date('2024-01-01'),
      lastSeen: new Date(),
      associatedCampaigns: ['APT28', 'Lazarus'],
    };
  }

  private async analyzeBehavior(payload: any): Promise<any> {
    // Mock behavioral analysis
    return {
      anomalyScore: Math.random() * 100,
      patterns: ['lateral-movement', 'data-exfiltration'],
      riskLevel: 'high',
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}