/**
 * Network Topology Mapper - Main Entry Point
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Advanced network topology analysis and visualization system for comprehensive project mapping
 */

import { 
  FileScannerEngine, 
  ProjectStructure, 
  FileNode, 
  DependencyGraph,
  RouteGraph,
  ComponentMap,
  ReactFlowNode,
  ReactFlowEdge,
  VisualizationData
} from '../file-scanner';

import { ProjectAnalyzer } from './project-analyzer';
import { DependencyMapper } from './dependency-mapper';
import { RouteAnalyzer } from './route-analyzer';
import { ComponentAnalyzer } from './component-analyzer';
import { TopologyBuilder } from './topology-builder';

import {
  NetworkTopology,
  TopologyConfig,
  NetworkCluster,
  NetworkNode,
  NetworkEdge,
  LayoutAlgorithm,
  TopologyMetrics,
  RealTimeSync,
  ConnectionPattern,
  HealthIndicator,
  TopologyChangeEvent,
  ClusteringStrategy
} from './types';

export class NetworkTopologyMapper {
  private projectAnalyzer: ProjectAnalyzer;
  private dependencyMapper: DependencyMapper;
  private routeAnalyzer: RouteAnalyzer;
  private componentAnalyzer: ComponentAnalyzer;
  private topologyBuilder: TopologyBuilder;
  
  private config: TopologyConfig;
  private fileScanner?: FileScannerEngine;
  private currentTopology?: NetworkTopology;
  private realTimeSync?: RealTimeSync;

  constructor(config: TopologyConfig) {
    this.config = config;
    
    // Initialize analyzers
    this.projectAnalyzer = new ProjectAnalyzer(config.projectConfig);
    this.dependencyMapper = new DependencyMapper(config.dependencyConfig);
    this.routeAnalyzer = new RouteAnalyzer(config.routeConfig);
    this.componentAnalyzer = new ComponentAnalyzer(config.componentConfig);
    this.topologyBuilder = new TopologyBuilder(config.builderConfig);
  }

  /**
   * Initialize with File Scanner Engine for real-time integration
   */
  async initialize(fileScanner: FileScannerEngine): Promise<void> {
    this.fileScanner = fileScanner;
    
    // Set up real-time sync if enabled
    if (this.config.enableRealTimeSync) {
      this.realTimeSync = {
        enabled: true,
        updateInterval: this.config.syncInterval || 1000,
        batchUpdates: this.config.batchUpdates || true,
        onTopologyChange: this.config.onTopologyChange
      };
    }
  }

  /**
   * Generate comprehensive network topology from project structure
   */
  async generateTopology(): Promise<NetworkTopology> {
    if (!this.fileScanner) {
      throw new Error('File scanner not initialized. Call initialize() first.');
    }

    const projectStructure = this.fileScanner.getLastScanResult();
    if (!projectStructure) {
      throw new Error('No project structure available. Run file scanner first.');
    }

    const startTime = performance.now();

    // Step 1: Analyze project structure and create workspace clusters
    const projectAnalysis = await this.projectAnalyzer.analyzeProject(projectStructure);
    
    // Step 2: Map all dependency relationships
    const dependencyMapping = await this.dependencyMapper.mapDependencies(
      projectStructure.dependencies,
      projectAnalysis.workspaceMap
    );

    // Step 3: Analyze routes and create route topology
    const routeTopology = await this.routeAnalyzer.analyzeRoutes(
      projectStructure.routes,
      projectAnalysis.fileMap
    );

    // Step 4: Analyze components and their relationships
    const componentTopology = await this.componentAnalyzer.analyzeComponents(
      projectStructure.components,
      dependencyMapping.componentDependencies
    );

    // Step 5: Build comprehensive network topology
    const topology = await this.topologyBuilder.buildTopology({
      projectAnalysis,
      dependencyMapping,
      routeTopology,
      componentTopology,
      layoutAlgorithm: this.config.defaultLayout || LayoutAlgorithm.FORCE_DIRECTED,
      clusteringStrategy: this.config.clustering || ClusteringStrategy.WORKSPACE_BASED
    });

    // Step 6: Calculate topology metrics
    const metrics = this.calculateTopologyMetrics(topology);

    // Step 7: Apply health indicators
    const healthIndicators = this.generateHealthIndicators(
      topology,
      projectStructure.health
    );

    const endTime = performance.now();

    this.currentTopology = {
      ...topology,
      metrics,
      healthIndicators,
      generatedAt: new Date(),
      generationTime: endTime - startTime,
      version: this.generateTopologyVersion()
    };

    // Emit topology change event
    if (this.realTimeSync?.onTopologyChange) {
      this.realTimeSync.onTopologyChange({
        type: 'generation',
        topology: this.currentTopology,
        timestamp: new Date(),
        changes: ['full-regeneration']
      });
    }

    return this.currentTopology;
  }

  /**
   * Convert topology to React Flow compatible format
   */
  generateReactFlowData(): VisualizationData {
    if (!this.currentTopology) {
      throw new Error('No topology available. Generate topology first.');
    }

    return this.topologyBuilder.convertToReactFlow(this.currentTopology);
  }

  /**
   * Apply specific layout algorithm to topology
   */
  async applyLayout(algorithm: LayoutAlgorithm): Promise<NetworkTopology> {
    if (!this.currentTopology) {
      throw new Error('No topology available. Generate topology first.');
    }

    const updatedTopology = await this.topologyBuilder.applyLayout(
      this.currentTopology,
      algorithm
    );

    this.currentTopology = updatedTopology;
    return updatedTopology;
  }

  /**
   * Update topology with clustering strategy
   */
  async applyClustering(strategy: ClusteringStrategy): Promise<NetworkTopology> {
    if (!this.currentTopology) {
      throw new Error('No topology available. Generate topology first.');
    }

    const updatedTopology = await this.topologyBuilder.applyClustering(
      this.currentTopology,
      strategy
    );

    this.currentTopology = updatedTopology;
    return updatedTopology;
  }

  /**
   * Get specific cluster from topology
   */
  getCluster(clusterId: string): NetworkCluster | undefined {
    if (!this.currentTopology) return undefined;
    return this.currentTopology.clusters.find(cluster => cluster.id === clusterId);
  }

  /**
   * Get nodes in specific cluster
   */
  getClusterNodes(clusterId: string): NetworkNode[] {
    const cluster = this.getCluster(clusterId);
    if (!cluster) return [];
    
    return this.currentTopology?.nodes.filter(node => 
      cluster.nodeIds.includes(node.id)
    ) || [];
  }

  /**
   * Find connection patterns in topology
   */
  findConnectionPatterns(): ConnectionPattern[] {
    if (!this.currentTopology) return [];
    
    return this.topologyBuilder.findConnectionPatterns(this.currentTopology);
  }

  /**
   * Get topology metrics
   */
  getMetrics(): TopologyMetrics | undefined {
    return this.currentTopology?.metrics;
  }

  /**
   * Get health indicators
   */
  getHealthIndicators(): HealthIndicator[] {
    return this.currentTopology?.healthIndicators || [];
  }

  /**
   * Export topology data for external analysis
   */
  exportTopology(): {
    topology: NetworkTopology | undefined;
    reactFlowData: VisualizationData | null;
    metrics: TopologyMetrics | undefined;
    healthIndicators: HealthIndicator[];
  } {
    return {
      topology: this.currentTopology,
      reactFlowData: this.currentTopology ? this.generateReactFlowData() : null,
      metrics: this.getMetrics(),
      healthIndicators: this.getHealthIndicators()
    };
  }

  /**
   * Start real-time topology monitoring
   */
  async startRealTimeSync(): Promise<void> {
    if (!this.fileScanner || !this.realTimeSync) {
      throw new Error('Real-time sync not configured or file scanner not available');
    }

    // Set up file watching integration
    await this.fileScanner.startWatching();
    
    // Set up periodic topology updates
    if (this.realTimeSync.updateInterval > 0) {
      setInterval(async () => {
        try {
          await this.updateTopologyIncremental();
        } catch (error) {
          console.error('Failed to update topology:', error);
        }
      }, this.realTimeSync.updateInterval);
    }
  }

  /**
   * Stop real-time topology monitoring
   */
  async stopRealTimeSync(): Promise<void> {
    if (this.fileScanner) {
      await this.fileScanner.stopWatching();
    }
  }

  /**
   * Get current topology
   */
  getCurrentTopology(): NetworkTopology | undefined {
    return this.currentTopology;
  }

  /**
   * Check if topology is available
   */
  hasTopology(): boolean {
    return !!this.currentTopology;
  }

  // Private methods

  private async updateTopologyIncremental(): Promise<void> {
    if (!this.fileScanner || !this.currentTopology) return;

    // Get updated project structure
    const updatedStructure = this.fileScanner.getLastScanResult();
    if (!updatedStructure) return;

    // Perform incremental update (simplified for now)
    // In a full implementation, this would diff the changes and update only affected parts
    await this.generateTopology();
  }

  private calculateTopologyMetrics(topology: NetworkTopology): TopologyMetrics {
    const totalNodes = topology.nodes.length;
    const totalEdges = topology.edges.length;
    const totalClusters = topology.clusters.length;

    // Calculate connectivity metrics
    const nodeConnections = new Map<string, number>();
    topology.edges.forEach(edge => {
      nodeConnections.set(edge.source, (nodeConnections.get(edge.source) || 0) + 1);
      nodeConnections.set(edge.target, (nodeConnections.get(edge.target) || 0) + 1);
    });

    const connectivityScores = Array.from(nodeConnections.values());
    const avgConnectivity = connectivityScores.length > 0 
      ? connectivityScores.reduce((a, b) => a + b, 0) / connectivityScores.length 
      : 0;
    const maxConnectivity = Math.max(...connectivityScores, 0);

    // Calculate cluster metrics
    const clusterSizes = topology.clusters.map(cluster => cluster.nodeIds.length);
    const avgClusterSize = clusterSizes.length > 0
      ? clusterSizes.reduce((a, b) => a + b, 0) / clusterSizes.length
      : 0;

    // Calculate complexity score (simplified)
    const complexityScore = Math.min(
      100,
      (totalNodes * 0.1) + (totalEdges * 0.05) + (totalClusters * 2)
    );

    return {
      totalNodes,
      totalEdges,
      totalClusters,
      avgConnectivity,
      maxConnectivity,
      avgClusterSize,
      complexityScore,
      density: totalNodes > 0 ? totalEdges / (totalNodes * (totalNodes - 1)) : 0
    };
  }

  private generateHealthIndicators(
    topology: NetworkTopology,
    projectHealth: any
  ): HealthIndicator[] {
    const indicators: HealthIndicator[] = [];

    // Overall health based on project health score
    indicators.push({
      id: 'overall-health',
      type: 'overall',
      score: projectHealth.score,
      status: this.getHealthStatus(projectHealth.score),
      message: `Project health: ${projectHealth.score}/100`,
      affectedNodes: []
    });

    // Connectivity health
    const avgConnectivity = topology.metrics?.avgConnectivity || 0;
    const connectivityScore = Math.min(100, avgConnectivity * 10);
    indicators.push({
      id: 'connectivity-health',
      type: 'connectivity',
      score: connectivityScore,
      status: this.getHealthStatus(connectivityScore),
      message: `Average connectivity: ${avgConnectivity.toFixed(1)} connections/node`,
      affectedNodes: []
    });

    // Add specific health indicators for orphaned files, dead code, etc.
    if (projectHealth.orphanedFiles?.length > 0) {
      indicators.push({
        id: 'orphaned-files',
        type: 'orphaned',
        score: Math.max(0, 100 - projectHealth.orphanedFiles.length * 5),
        status: 'warning',
        message: `${projectHealth.orphanedFiles.length} orphaned files detected`,
        affectedNodes: projectHealth.orphanedFiles
      });
    }

    return indicators;
  }

  private getHealthStatus(score: number): 'healthy' | 'warning' | 'critical' {
    if (score >= 80) return 'healthy';
    if (score >= 60) return 'warning';
    return 'critical';
  }

  private generateTopologyVersion(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Utility functions for creating default configurations

export function createDefaultTopologyConfig(rootPath: string): TopologyConfig {
  return {
    rootPath,
    enableRealTimeSync: true,
    syncInterval: 2000,
    batchUpdates: true,
    defaultLayout: LayoutAlgorithm.FORCE_DIRECTED,
    clustering: ClusteringStrategy.WORKSPACE_BASED,
    
    projectConfig: {
      enableWorkspaceDetection: true,
      enableRouteGrouping: true,
      enableComponentHierarchy: true,
      maxDepth: 10
    },
    
    dependencyConfig: {
      includeExternalDeps: true,
      includeDevDeps: false,
      includeTypeOnlyImports: true,
      includeDynamicImports: true,
      detectCircularDeps: true
    },
    
    routeConfig: {
      enableAppRouter: true,
      enablePagesRouter: false,
      includeApiRoutes: true,
      includeStaticRoutes: true,
      includeDynamicRoutes: true
    },
    
    componentConfig: {
      includeServerComponents: true,
      includeClientComponents: true,
      includeUtilityComponents: true,
      analyzeProps: true,
      analyzeUsage: true
    },
    
    builderConfig: {
      enableClustering: true,
      enablePositioning: true,
      enableEdgeOptimization: true,
      defaultSpacing: 100,
      clusterPadding: 50
    }
  };
}

// Export all components
export { ProjectAnalyzer } from './project-analyzer';
export { DependencyMapper } from './dependency-mapper';
export { RouteAnalyzer } from './route-analyzer';
export { ComponentAnalyzer } from './component-analyzer';
export { TopologyBuilder } from './topology-builder';
export * from './types';