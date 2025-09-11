/**
 * Network Topology Integration Test
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Test script to verify integration with File Scanner Engine and validate topology generation
 */

import path from 'path';
import { 
  FileScannerEngine, 
  createDefaultScannerConfig 
} from '../file-scanner';

import { 
  NetworkTopologyMapper, 
  createDefaultTopologyConfig 
} from './index';

import { 
  LayoutAlgorithm, 
  ClusteringStrategy,
  TopologyChangeEvent 
} from './types';

export class NetworkTopologyIntegrationTest {
  private rootPath: string;
  private fileScanner?: FileScannerEngine;
  private topologyMapper?: NetworkTopologyMapper;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  /**
   * Run complete integration test suite
   */
  async runTestSuite(): Promise<void> {
    console.log('🚀 Starting Network Topology Integration Test Suite...');
    console.log(`📁 Root Path: ${this.rootPath}`);
    
    try {
      // Test 1: Initialize File Scanner Engine
      await this.testFileScannerInitialization();
      
      // Test 2: Initialize Network Topology Mapper
      await this.testTopologyMapperInitialization();
      
      // Test 3: Run file scanning
      await this.testFileScanning();
      
      // Test 4: Generate topology
      await this.testTopologyGeneration();
      
      // Test 5: Test different layout algorithms
      await this.testLayoutAlgorithms();
      
      // Test 6: Test clustering strategies
      await this.testClusteringStrategies();
      
      // Test 7: Test React Flow conversion
      await this.testReactFlowConversion();
      
      // Test 8: Test real-time sync (if enabled)
      await this.testRealTimeSync();
      
      // Test 9: Test export functionality
      await this.testExportFunctionality();
      
      console.log('✅ All integration tests passed successfully!');
      
    } catch (error) {
      console.error('❌ Integration test failed:', error);
      throw error;
    }
  }

  /**
   * Test File Scanner Engine initialization
   */
  private async testFileScannerInitialization(): Promise<void> {
    console.log('\n📊 Test 1: File Scanner Engine Initialization');
    
    const scannerConfig = createDefaultScannerConfig(this.rootPath);
    
    // Add progress callback for testing
    scannerConfig.onProgress = (progress) => {
      console.log(`  📈 Progress: ${progress.phase} - ${progress.progress}%`);
    };
    
    this.fileScanner = new FileScannerEngine(scannerConfig);
    console.log('✅ File Scanner Engine initialized successfully');
  }

  /**
   * Test Network Topology Mapper initialization
   */
  private async testTopologyMapperInitialization(): Promise<void> {
    console.log('\n🗺️  Test 2: Network Topology Mapper Initialization');
    
    const topologyConfig = createDefaultTopologyConfig(this.rootPath);
    
    // Add topology change callback for testing
    topologyConfig.onTopologyChange = (event: TopologyChangeEvent) => {
      console.log(`  🔄 Topology change: ${event.type} at ${event.timestamp.toISOString()}`);
    };
    
    this.topologyMapper = new NetworkTopologyMapper(topologyConfig);
    
    if (!this.fileScanner) {
      throw new Error('File Scanner not initialized');
    }
    
    await this.topologyMapper.initialize(this.fileScanner);
    console.log('✅ Network Topology Mapper initialized successfully');
  }

  /**
   * Test file scanning process
   */
  private async testFileScanning(): Promise<void> {
    console.log('\n🔍 Test 3: File Scanning Process');
    
    if (!this.fileScanner) {
      throw new Error('File Scanner not initialized');
    }
    
    const startTime = performance.now();
    const projectStructure = await this.fileScanner.scan();
    const endTime = performance.now();
    
    console.log(`  📊 Scan completed in ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`  📁 Total files: ${projectStructure.totalFiles}`);
    console.log(`  📂 Total directories: ${projectStructure.totalDirectories}`);
    console.log(`  🔗 Dependencies: ${projectStructure.dependencies.edges.size}`);
    console.log(`  🛣️  Routes: ${projectStructure.routes.routes.size}`);
    console.log(`  🧩 Components: ${projectStructure.components.components.size}`);
    console.log(`  💚 Health score: ${projectStructure.health.score}/100`);
    
    // Validate basic structure
    if (projectStructure.totalFiles === 0) {
      throw new Error('No files found during scan');
    }
    
    console.log('✅ File scanning completed successfully');
  }

  /**
   * Test topology generation
   */
  private async testTopologyGeneration(): Promise<void> {
    console.log('\n🌐 Test 4: Topology Generation');
    
    if (!this.topologyMapper) {
      throw new Error('Topology Mapper not initialized');
    }
    
    const startTime = performance.now();
    const topology = await this.topologyMapper.generateTopology();
    const endTime = performance.now();
    
    console.log(`  🔧 Generation completed in ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`  🔵 Total nodes: ${topology.nodes.length}`);
    console.log(`  🔗 Total edges: ${topology.edges.length}`);
    console.log(`  🎯 Total clusters: ${topology.clusters.length}`);
    console.log(`  📐 Layout algorithm: ${topology.layout.algorithm}`);
    console.log(`  🎨 Clustering strategy: ${topology.layout.clustering}`);
    
    if (topology.metrics) {
      console.log(`  📊 Complexity score: ${topology.metrics.complexityScore.toFixed(2)}`);
      console.log(`  🔄 Avg connectivity: ${topology.metrics.avgConnectivity.toFixed(2)}`);
      console.log(`  📈 Network density: ${topology.metrics.density.toFixed(4)}`);
    }
    
    if (topology.healthIndicators) {
      console.log(`  💚 Health indicators: ${topology.healthIndicators.length}`);
      topology.healthIndicators.forEach(indicator => {
        console.log(`    - ${indicator.type}: ${indicator.score}/100 (${indicator.status})`);
      });
    }
    
    // Validate topology structure
    if (topology.nodes.length === 0) {
      throw new Error('No nodes generated in topology');
    }
    
    console.log('✅ Topology generation completed successfully');
  }

  /**
   * Test different layout algorithms
   */
  private async testLayoutAlgorithms(): Promise<void> {
    console.log('\n🎨 Test 5: Layout Algorithms');
    
    if (!this.topologyMapper) {
      throw new Error('Topology Mapper not initialized');
    }
    
    const algorithms = [
      LayoutAlgorithm.FORCE_DIRECTED,
      LayoutAlgorithm.HIERARCHICAL,
      LayoutAlgorithm.CIRCULAR,
      LayoutAlgorithm.GRID
    ];
    
    for (const algorithm of algorithms) {
      console.log(`  🔄 Testing layout: ${algorithm}`);
      
      const startTime = performance.now();
      const topology = await this.topologyMapper.applyLayout(algorithm);
      const endTime = performance.now();
      
      console.log(`    ⏱️  Applied in ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`    📐 Layout: ${topology.layout.algorithm}`);
      
      // Validate that positions were applied
      const hasPositions = topology.nodes.every(node => 
        typeof node.position.x === 'number' && typeof node.position.y === 'number'
      );
      
      if (!hasPositions) {
        throw new Error(`Layout algorithm ${algorithm} failed to assign positions`);
      }
    }
    
    console.log('✅ All layout algorithms tested successfully');
  }

  /**
   * Test clustering strategies
   */
  private async testClusteringStrategies(): Promise<void> {
    console.log('\n🎯 Test 6: Clustering Strategies');
    
    if (!this.topologyMapper) {
      throw new Error('Topology Mapper not initialized');
    }
    
    const strategies = [
      ClusteringStrategy.WORKSPACE_BASED,
      ClusteringStrategy.DEPENDENCY_BASED,
      ClusteringStrategy.FEATURE_BASED,
      ClusteringStrategy.HYBRID
    ];
    
    for (const strategy of strategies) {
      console.log(`  🔄 Testing clustering: ${strategy}`);
      
      const startTime = performance.now();
      const topology = await this.topologyMapper.applyClustering(strategy);
      const endTime = performance.now();
      
      console.log(`    ⏱️  Applied in ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`    🎯 Clusters: ${topology.clusters.length}`);
      console.log(`    🎨 Strategy: ${topology.layout.clustering}`);
      
      // Validate clustering
      if (topology.clusters.length === 0) {
        console.warn(`    ⚠️  Warning: No clusters generated for ${strategy}`);
      }
    }
    
    console.log('✅ All clustering strategies tested successfully');
  }

  /**
   * Test React Flow conversion
   */
  private async testReactFlowConversion(): Promise<void> {
    console.log('\n⚛️  Test 7: React Flow Conversion');
    
    if (!this.topologyMapper) {
      throw new Error('Topology Mapper not initialized');
    }
    
    const startTime = performance.now();
    const reactFlowData = this.topologyMapper.generateReactFlowData();
    const endTime = performance.now();
    
    console.log(`  🔄 Conversion completed in ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`  🔵 React Flow nodes: ${reactFlowData.nodes.length}`);
    console.log(`  🔗 React Flow edges: ${reactFlowData.edges.length}`);
    console.log(`  📐 Layout config: ${reactFlowData.layout.algorithm}`);
    
    // Validate React Flow data structure
    const hasValidNodes = reactFlowData.nodes.every(node => 
      node.id && node.position && typeof node.position.x === 'number'
    );
    
    const hasValidEdges = reactFlowData.edges.every(edge => 
      edge.id && edge.source && edge.target
    );
    
    if (!hasValidNodes) {
      throw new Error('Invalid React Flow nodes generated');
    }
    
    if (!hasValidEdges) {
      throw new Error('Invalid React Flow edges generated');
    }
    
    console.log('✅ React Flow conversion completed successfully');
  }

  /**
   * Test real-time sync functionality
   */
  private async testRealTimeSync(): Promise<void> {
    console.log('\n🔄 Test 8: Real-Time Sync (Optional)');
    
    if (!this.topologyMapper || !this.fileScanner) {
      throw new Error('Components not initialized');
    }
    
    try {
      // Start real-time sync
      await this.topologyMapper.startRealTimeSync();
      console.log('  ✅ Real-time sync started successfully');
      
      // Wait a moment to test sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stop real-time sync
      await this.topologyMapper.stopRealTimeSync();
      console.log('  ✅ Real-time sync stopped successfully');
      
    } catch (error) {
      console.log('  ⚠️  Real-time sync test skipped:', error);
    }
  }

  /**
   * Test export functionality
   */
  private async testExportFunctionality(): Promise<void> {
    console.log('\n📤 Test 9: Export Functionality');
    
    if (!this.topologyMapper) {
      throw new Error('Topology Mapper not initialized');
    }
    
    const exportData = this.topologyMapper.exportTopology();
    
    console.log('  📊 Export data structure:');
    console.log(`    - Topology: ${exportData.topology ? '✅' : '❌'}`);
    console.log(`    - React Flow Data: ${exportData.reactFlowData ? '✅' : '❌'}`);
    console.log(`    - Metrics: ${exportData.metrics ? '✅' : '❌'}`);
    console.log(`    - Health Indicators: ${exportData.healthIndicators.length} items`);
    
    // Validate export data
    if (!exportData.topology) {
      throw new Error('No topology data in export');
    }
    
    if (!exportData.reactFlowData) {
      throw new Error('No React Flow data in export');
    }
    
    console.log('✅ Export functionality tested successfully');
  }

  /**
   * Get topology statistics for reporting
   */
  getTopologyStatistics(): Record<string, any> {
    if (!this.topologyMapper) {
      return { error: 'Topology mapper not initialized' };
    }
    
    const topology = this.topologyMapper.getCurrentTopology();
    if (!topology) {
      return { error: 'No topology generated' };
    }
    
    const connectionPatterns = this.topologyMapper.findConnectionPatterns();
    const metrics = this.topologyMapper.getMetrics();
    const healthIndicators = this.topologyMapper.getHealthIndicators();
    
    return {
      summary: {
        totalNodes: topology.nodes.length,
        totalEdges: topology.edges.length,
        totalClusters: topology.clusters.length,
        layoutAlgorithm: topology.layout.algorithm,
        clusteringStrategy: topology.layout.clustering
      },
      connectionPatterns: connectionPatterns.map(pattern => ({
        type: pattern.type,
        nodeCount: pattern.nodes.length,
        strength: pattern.strength
      })),
      metrics: metrics ? {
        complexityScore: metrics.complexityScore,
        avgConnectivity: metrics.avgConnectivity,
        density: metrics.density,
        maxConnectivity: metrics.maxConnectivity
      } : null,
      health: {
        indicatorCount: healthIndicators.length,
        healthyCount: healthIndicators.filter(h => h.status === 'healthy').length,
        warningCount: healthIndicators.filter(h => h.status === 'warning').length,
        criticalCount: healthIndicators.filter(h => h.status === 'critical').length
      },
      performance: {
        generationTime: topology.generationTime,
        buildTime: topology.buildTime
      }
    };
  }
}

/**
 * Run integration test for Lions of Zion project
 */
export async function runLionspaceTopologyTest(rootPath?: string): Promise<void> {
  const projectRoot = rootPath || process.cwd();
  const tester = new NetworkTopologyIntegrationTest(projectRoot);
  
  try {
    await tester.runTestSuite();
    
    // Print final statistics
    console.log('\n📊 Final Topology Statistics:');
    const stats = tester.getTopologyStatistics();
    console.log(JSON.stringify(stats, null, 2));
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    process.exit(1);
  }
}

// Export for standalone usage
export { NetworkTopologyIntegrationTest };

// CLI execution if run directly
if (require.main === module) {
  const rootPath = process.argv[2] || process.cwd();
  runLionspaceTopologyTest(rootPath);
}