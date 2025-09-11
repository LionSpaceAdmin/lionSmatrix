/**
 * Topology Builder - React Flow Integration
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Builds comprehensive network topology with intelligent clustering and React Flow integration
 */

import { 
  ReactFlowNode, 
  ReactFlowEdge, 
  VisualizationData, 
  LayoutOptions 
} from '../file-scanner/types';

import {
  NetworkTopology,
  NetworkNode,
  NetworkEdge,
  NetworkCluster,
  TopologyBuilderConfig,
  LayoutAlgorithm,
  ClusteringStrategy,
  ConnectionPattern,
  TopologyBuildRequest,
  NodePosition,
  EdgeLayout,
  ClusterLayout
} from './types';

export class TopologyBuilder {
  private config: TopologyBuilderConfig;

  constructor(config: TopologyBuilderConfig) {
    this.config = config;
  }

  /**
   * Build comprehensive network topology from all analysis data
   */
  async buildTopology(request: TopologyBuildRequest): Promise<NetworkTopology> {
    const startTime = performance.now();

    // Step 1: Create network nodes from all analysis sources
    const nodes = this.createNetworkNodes(request);

    // Step 2: Create network edges from relationships
    const edges = this.createNetworkEdges(request, nodes);

    // Step 3: Create clusters based on strategy
    const clusters = this.createClusters(request, nodes, edges);

    // Step 4: Apply layout algorithm
    const positionedNodes = await this.applyLayoutAlgorithm(
      nodes, 
      edges, 
      clusters, 
      request.layoutAlgorithm
    );

    // Step 5: Optimize edge routing
    const optimizedEdges = this.optimizeEdgeRouting(edges, positionedNodes, clusters);

    // Step 6: Apply clustering strategy
    const finalClusters = this.applyClustering(
      clusters, 
      positionedNodes, 
      request.clusteringStrategy
    );

    const endTime = performance.now();

    return {
      id: this.generateTopologyId(),
      nodes: positionedNodes,
      edges: optimizedEdges,
      clusters: finalClusters,
      layout: {
        algorithm: request.layoutAlgorithm,
        clustering: request.clusteringStrategy,
        spacing: this.config.defaultSpacing,
        applied: true
      },
      connectionPatterns: this.findConnectionPatterns({ 
        nodes: positionedNodes, 
        edges: optimizedEdges, 
        clusters: finalClusters 
      }),
      buildTime: endTime - startTime,
      builtAt: new Date()
    };
  }

  /**
   * Convert topology to React Flow compatible format
   */
  convertToReactFlow(topology: NetworkTopology): VisualizationData {
    const reactFlowNodes: ReactFlowNode[] = topology.nodes.map(node => ({
      id: node.id,
      type: this.getReactFlowNodeType(node),
      position: { x: node.position.x, y: node.position.y },
      data: {
        label: node.label,
        file: node.file,
        component: node.component,
        route: node.route,
        health: node.health || [],
        dependencies: node.metadata?.dependencies || 0,
        dependents: node.metadata?.dependents || 0,
        cluster: node.clusterId,
        nodeType: node.type,
        size: node.size,
        importance: node.importance
      },
      style: this.getNodeStyle(node),
      className: this.getNodeClassName(node),
      draggable: true,
      selectable: true
    }));

    const reactFlowEdges: ReactFlowEdge[] = topology.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: this.getReactFlowEdgeType(edge),
      animated: edge.metadata?.animated || false,
      style: this.getEdgeStyle(edge),
      data: {
        strength: edge.strength,
        type: edge.type,
        label: edge.label,
        metadata: edge.metadata
      },
      markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20
      }
    }));

    return {
      nodes: reactFlowNodes,
      edges: reactFlowEdges,
      layout: {
        algorithm: topology.layout.algorithm as any,
        spacing: topology.layout.spacing || 100,
        direction: 'TB',
        rankSeparation: 150,
        nodeSeparation: 100
      },
      filters: {
        fileTypes: [],
        routeTypes: [],
        componentTypes: [],
        showOrphanedFiles: true,
        showDeadCode: true,
        minDependencies: 0,
        maxDependencies: 100,
        healthScoreRange: [0, 100]
      }
    };
  }

  /**
   * Apply specific layout algorithm to topology
   */
  async applyLayout(
    topology: NetworkTopology, 
    algorithm: LayoutAlgorithm
  ): Promise<NetworkTopology> {
    const positionedNodes = await this.applyLayoutAlgorithm(
      topology.nodes,
      topology.edges,
      topology.clusters,
      algorithm
    );

    return {
      ...topology,
      nodes: positionedNodes,
      layout: {
        ...topology.layout,
        algorithm
      }
    };
  }

  /**
   * Apply clustering strategy to topology
   */
  async applyClustering(
    topology: NetworkTopology,
    strategy: ClusteringStrategy
  ): Promise<NetworkTopology> {
    const clusters = this.applyClustering(
      topology.clusters,
      topology.nodes,
      strategy
    );

    return {
      ...topology,
      clusters,
      layout: {
        ...topology.layout,
        clustering: strategy
      }
    };
  }

  /**
   * Find connection patterns in topology
   */
  findConnectionPatterns(topology: NetworkTopology): ConnectionPattern[] {
    const patterns: ConnectionPattern[] = [];

    // Pattern 1: Hub pattern (nodes with many connections)
    const hubs = this.findHubNodes(topology);
    if (hubs.length > 0) {
      patterns.push({
        id: 'hub-pattern',
        type: 'hub',
        nodes: hubs.map(hub => hub.id),
        description: `${hubs.length} hub nodes with high connectivity`,
        strength: this.calculatePatternStrength(hubs, topology.edges)
      });
    }

    // Pattern 2: Chain pattern (linear dependencies)
    const chains = this.findChainPatterns(topology);
    patterns.push(...chains);

    // Pattern 3: Circular pattern (circular dependencies)
    const cycles = this.findCircularPatterns(topology);
    patterns.push(...cycles);

    // Pattern 4: Star pattern (central node with satellites)
    const stars = this.findStarPatterns(topology);
    patterns.push(...stars);

    // Pattern 5: Cluster interconnection patterns
    const clusterPatterns = this.findClusterInterconnectionPatterns(topology);
    patterns.push(...clusterPatterns);

    return patterns;
  }

  // Private methods

  private createNetworkNodes(request: TopologyBuildRequest): NetworkNode[] {
    const nodes: NetworkNode[] = [];
    let nodeIdCounter = 0;

    // Create nodes from file analysis
    for (const [filePath, fileNode] of request.projectAnalysis.fileMap) {
      const workspace = this.findNodeWorkspace(filePath, request.projectAnalysis.workspaceMap);
      
      nodes.push({
        id: `file-${nodeIdCounter++}`,
        label: fileNode.name,
        type: 'file',
        file: fileNode,
        position: { x: 0, y: 0 }, // Will be set by layout algorithm
        size: this.calculateFileNodeSize(fileNode),
        importance: this.calculateFileImportance(filePath, request),
        clusterId: workspace?.id || 'unknown',
        metadata: {
          workspace: workspace?.id,
          category: this.categorizeFileNode(fileNode),
          dependencies: request.dependencyMapping.importAnalysis.importsByFile.get(filePath)?.length || 0,
          dependents: this.countDependents(filePath, request.dependencyMapping)
        }
      });
    }

    // Create nodes from route analysis
    for (const routeGroup of request.routeTopology.routeGroups) {
      for (const routePath of routeGroup.routes) {
        nodes.push({
          id: `route-${nodeIdCounter++}`,
          label: this.extractRouteName(routePath),
          type: 'route',
          route: { 
            path: routePath, 
            group: routeGroup.id,
            protection: routeGroup.protection 
          },
          position: { x: 0, y: 0 },
          size: this.calculateRouteNodeSize(routePath),
          importance: this.calculateRouteImportance(routePath, request),
          clusterId: `route-group-${routeGroup.id}`,
          metadata: {
            routeGroup: routeGroup.id,
            protection: routeGroup.protection
          }
        });
      }
    }

    // Create nodes from component analysis
    for (const cluster of request.componentTopology.clusters) {
      for (const componentPath of cluster.components) {
        const componentInfo = request.projectAnalysis.fileMap.get(componentPath);
        if (componentInfo) {
          nodes.push({
            id: `component-${nodeIdCounter++}`,
            label: componentInfo.name,
            type: 'component',
            component: {
              path: componentPath,
              type: cluster.type,
              reusability: this.calculateComponentReusability(componentPath, request)
            },
            position: { x: 0, y: 0 },
            size: this.calculateComponentNodeSize(componentPath, request),
            importance: this.calculateComponentImportance(componentPath, request),
            clusterId: `component-${cluster.id}`,
            metadata: {
              clusterType: cluster.type,
              cohesion: cluster.cohesion,
              coupling: cluster.coupling
            }
          });
        }
      }
    }

    return nodes;
  }

  private createNetworkEdges(
    request: TopologyBuildRequest, 
    nodes: NetworkNode[]
  ): NetworkEdge[] {
    const edges: NetworkEdge[] = [];
    let edgeIdCounter = 0;

    // Create edges from dependency relationships
    for (const crossPackageDep of request.dependencyMapping.crossPackageDependencies) {
      const sourceNode = nodes.find(n => n.file?.path === crossPackageDep.sourceFile);
      const targetNode = nodes.find(n => n.file?.path === crossPackageDep.targetFile);

      if (sourceNode && targetNode) {
        edges.push({
          id: `dep-${edgeIdCounter++}`,
          source: sourceNode.id,
          target: targetNode.id,
          type: 'dependency',
          strength: crossPackageDep.strength,
          label: this.createDependencyLabel(crossPackageDep),
          metadata: {
            dependencyType: crossPackageDep.dependencyType,
            isDynamic: crossPackageDep.isDynamic,
            isTypeOnly: crossPackageDep.isTypeOnly,
            importSpecifiers: crossPackageDep.importSpecifiers
          }
        });
      }
    }

    // Create edges from route relationships
    for (const relationship of request.routeTopology.routeRelationships) {
      const sourceNode = nodes.find(n => n.route?.path === relationship.source);
      const targetNode = nodes.find(n => n.route?.path === relationship.target);

      if (sourceNode && targetNode) {
        edges.push({
          id: `route-${edgeIdCounter++}`,
          source: sourceNode.id,
          target: targetNode.id,
          type: 'route-relationship',
          strength: relationship.strength,
          label: relationship.type,
          metadata: {
            relationshipType: relationship.type,
            description: relationship.description
          }
        });
      }
    }

    // Create edges from component relationships
    for (const relationship of request.componentTopology.relationships) {
      const sourceNode = nodes.find(n => 
        n.component?.path === relationship.source || n.file?.path === relationship.source
      );
      const targetNode = nodes.find(n => 
        n.component?.path === relationship.target || n.file?.path === relationship.target
      );

      if (sourceNode && targetNode) {
        edges.push({
          id: `comp-${edgeIdCounter++}`,
          source: sourceNode.id,
          target: targetNode.id,
          type: 'component-relationship',
          strength: relationship.strength,
          label: relationship.type,
          metadata: {
            relationshipType: relationship.type,
            componentMetadata: relationship.metadata
          }
        });
      }
    }

    return edges;
  }

  private createClusters(
    request: TopologyBuildRequest,
    nodes: NetworkNode[],
    edges: NetworkEdge[]
  ): NetworkCluster[] {
    const clusters: NetworkCluster[] = [];

    // Create workspace clusters
    for (const [workspaceId, workspace] of request.projectAnalysis.workspaceMap) {
      const workspaceNodes = nodes.filter(node => node.clusterId === workspaceId);
      
      if (workspaceNodes.length > 0) {
        clusters.push({
          id: workspaceId,
          label: workspace.name,
          type: 'workspace',
          nodeIds: workspaceNodes.map(node => node.id),
          position: { x: 0, y: 0 }, // Will be calculated
          size: this.calculateClusterSize(workspaceNodes),
          color: this.getWorkspaceColor(workspace.type),
          metadata: {
            workspaceType: workspace.type,
            fileCount: workspace.files.length
          }
        });
      }
    }

    // Create route group clusters
    for (const routeGroup of request.routeTopology.routeGroups) {
      const routeNodes = nodes.filter(node => 
        node.clusterId === `route-group-${routeGroup.id}`
      );

      if (routeNodes.length > 0) {
        clusters.push({
          id: `route-group-${routeGroup.id}`,
          label: routeGroup.name,
          type: 'route-group',
          nodeIds: routeNodes.map(node => node.id),
          position: { x: 0, y: 0 },
          size: this.calculateClusterSize(routeNodes),
          color: this.getRouteGroupColor(routeGroup.protection),
          metadata: {
            protection: routeGroup.protection,
            routeCount: routeGroup.routes.length
          }
        });
      }
    }

    // Create component clusters
    for (const componentCluster of request.componentTopology.clusters) {
      const componentNodes = nodes.filter(node => 
        node.clusterId === `component-${componentCluster.id}`
      );

      if (componentNodes.length > 0) {
        clusters.push({
          id: `component-${componentCluster.id}`,
          label: componentCluster.name,
          type: 'component-cluster',
          nodeIds: componentNodes.map(node => node.id),
          position: { x: 0, y: 0 },
          size: this.calculateClusterSize(componentNodes),
          color: this.getComponentClusterColor(componentCluster.type),
          metadata: {
            componentType: componentCluster.type,
            cohesion: componentCluster.cohesion,
            coupling: componentCluster.coupling
          }
        });
      }
    }

    return clusters;
  }

  private async applyLayoutAlgorithm(
    nodes: NetworkNode[],
    edges: NetworkEdge[],
    clusters: NetworkCluster[],
    algorithm: LayoutAlgorithm
  ): Promise<NetworkNode[]> {
    switch (algorithm) {
      case LayoutAlgorithm.FORCE_DIRECTED:
        return this.applyForceDirectedLayout(nodes, edges, clusters);
      case LayoutAlgorithm.HIERARCHICAL:
        return this.applyHierarchicalLayout(nodes, edges, clusters);
      case LayoutAlgorithm.CIRCULAR:
        return this.applyCircularLayout(nodes, edges, clusters);
      case LayoutAlgorithm.GRID:
        return this.applyGridLayout(nodes, edges, clusters);
      default:
        return this.applyForceDirectedLayout(nodes, edges, clusters);
    }
  }

  private applyForceDirectedLayout(
    nodes: NetworkNode[],
    edges: NetworkEdge[],
    clusters: NetworkCluster[]
  ): NetworkNode[] {
    // Simplified force-directed layout
    const spacing = this.config.defaultSpacing || 100;
    const centerX = 0;
    const centerY = 0;

    // Group nodes by cluster for better positioning
    const clusterNodes = new Map<string, NetworkNode[]>();
    for (const node of nodes) {
      if (!clusterNodes.has(node.clusterId)) {
        clusterNodes.set(node.clusterId, []);
      }
      clusterNodes.get(node.clusterId)!.push(node);
    }

    // Position clusters in a circle
    const clusterPositions = new Map<string, { x: number; y: number }>();
    const clusterIds = Array.from(clusterNodes.keys());
    const angleStep = (2 * Math.PI) / clusterIds.length;

    clusterIds.forEach((clusterId, index) => {
      const angle = index * angleStep;
      const radius = Math.max(300, clusterIds.length * 50);
      clusterPositions.set(clusterId, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    });

    // Position nodes within clusters
    const positionedNodes: NetworkNode[] = [];
    for (const [clusterId, clusterNodeList] of clusterNodes) {
      const clusterCenter = clusterPositions.get(clusterId) || { x: 0, y: 0 };
      
      clusterNodeList.forEach((node, index) => {
        const localAngle = (index / clusterNodeList.length) * 2 * Math.PI;
        const localRadius = Math.min(100, clusterNodeList.length * 10);
        
        positionedNodes.push({
          ...node,
          position: {
            x: clusterCenter.x + Math.cos(localAngle) * localRadius,
            y: clusterCenter.y + Math.sin(localAngle) * localRadius
          }
        });
      });
    }

    return positionedNodes;
  }

  private applyHierarchicalLayout(
    nodes: NetworkNode[],
    edges: NetworkEdge[],
    clusters: NetworkCluster[]
  ): NetworkNode[] {
    // Hierarchical layout based on dependencies
    const levels = this.calculateNodeLevels(nodes, edges);
    const spacing = this.config.defaultSpacing || 100;
    
    const positionedNodes: NetworkNode[] = [];
    const levelCounts = new Map<number, number>();

    // Count nodes per level
    for (const node of nodes) {
      const level = levels.get(node.id) || 0;
      levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
    }

    const levelCounters = new Map<number, number>();
    
    for (const node of nodes) {
      const level = levels.get(node.id) || 0;
      const positionInLevel = levelCounters.get(level) || 0;
      const totalInLevel = levelCounts.get(level) || 1;
      
      levelCounters.set(level, positionInLevel + 1);
      
      positionedNodes.push({
        ...node,
        position: {
          x: (positionInLevel - totalInLevel / 2) * spacing * 1.5,
          y: level * spacing * 2
        }
      });
    }

    return positionedNodes;
  }

  private applyCircularLayout(
    nodes: NetworkNode[],
    edges: NetworkEdge[],
    clusters: NetworkCluster[]
  ): NetworkNode[] {
    // Circular layout
    const radius = Math.max(200, nodes.length * 15);
    const angleStep = (2 * Math.PI) / nodes.length;
    
    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: Math.cos(index * angleStep) * radius,
        y: Math.sin(index * angleStep) * radius
      }
    }));
  }

  private applyGridLayout(
    nodes: NetworkNode[],
    edges: NetworkEdge[],
    clusters: NetworkCluster[]
  ): NetworkNode[] {
    // Grid layout
    const spacing = this.config.defaultSpacing || 100;
    const columns = Math.ceil(Math.sqrt(nodes.length));
    
    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: (index % columns) * spacing,
        y: Math.floor(index / columns) * spacing
      }
    }));
  }

  private optimizeEdgeRouting(
    edges: NetworkEdge[],
    nodes: NetworkNode[],
    clusters: NetworkCluster[]
  ): NetworkEdge[] {
    // Add routing optimization metadata
    return edges.map(edge => ({
      ...edge,
      metadata: {
        ...edge.metadata,
        optimized: true,
        routingPoints: this.calculateRoutingPoints(edge, nodes, clusters)
      }
    }));
  }

  private applyClustering(
    clusters: NetworkCluster[],
    nodes: NetworkNode[],
    strategy: ClusteringStrategy
  ): NetworkCluster[] {
    switch (strategy) {
      case ClusteringStrategy.WORKSPACE_BASED:
        return this.applyWorkspaceBasedClustering(clusters, nodes);
      case ClusteringStrategy.DEPENDENCY_BASED:
        return this.applyDependencyBasedClustering(clusters, nodes);
      case ClusteringStrategy.FEATURE_BASED:
        return this.applyFeatureBasedClustering(clusters, nodes);
      case ClusteringStrategy.HYBRID:
        return this.applyHybridClustering(clusters, nodes);
      default:
        return clusters;
    }
  }

  // Helper methods for layout and clustering

  private calculateNodeLevels(nodes: NetworkNode[], edges: NetworkEdge[]): Map<string, number> {
    const levels = new Map<string, number>();
    const inDegree = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();

    // Initialize
    for (const node of nodes) {
      inDegree.set(node.id, 0);
      adjacencyList.set(node.id, []);
    }

    // Build graph
    for (const edge of edges) {
      adjacencyList.get(edge.source)!.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

    // Topological sort to assign levels
    const queue: string[] = [];
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
        levels.set(nodeId, 0);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentLevel = levels.get(current) || 0;
      
      for (const neighbor of adjacencyList.get(current) || []) {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        
        if (newDegree === 0) {
          queue.push(neighbor);
          levels.set(neighbor, currentLevel + 1);
        }
      }
    }

    return levels;
  }

  private findHubNodes(topology: NetworkTopology): NetworkNode[] {
    const connectionCounts = new Map<string, number>();
    
    for (const edge of topology.edges) {
      connectionCounts.set(edge.source, (connectionCounts.get(edge.source) || 0) + 1);
      connectionCounts.set(edge.target, (connectionCounts.get(edge.target) || 0) + 1);
    }

    const threshold = Math.max(5, topology.nodes.length * 0.1);
    return topology.nodes.filter(node => 
      (connectionCounts.get(node.id) || 0) >= threshold
    );
  }

  private findChainPatterns(topology: NetworkTopology): ConnectionPattern[] {
    // Implementation for finding chain patterns
    return [];
  }

  private findCircularPatterns(topology: NetworkTopology): ConnectionPattern[] {
    // Implementation for finding circular patterns
    return [];
  }

  private findStarPatterns(topology: NetworkTopology): ConnectionPattern[] {
    // Implementation for finding star patterns
    return [];
  }

  private findClusterInterconnectionPatterns(topology: NetworkTopology): ConnectionPattern[] {
    // Implementation for finding cluster interconnection patterns
    return [];
  }

  // Calculation helper methods

  private calculateFileNodeSize(fileNode: any): number {
    return Math.max(20, Math.min(100, (fileNode.size || 0) / 1000));
  }

  private calculateRouteNodeSize(routePath: string): number {
    return 30; // Base size for routes
  }

  private calculateComponentNodeSize(componentPath: string, request: TopologyBuildRequest): number {
    return 40; // Base size for components
  }

  private calculateFileImportance(filePath: string, request: TopologyBuildRequest): number {
    const dependencies = request.dependencyMapping.importAnalysis.importsByFile.get(filePath)?.length || 0;
    const dependents = this.countDependents(filePath, request.dependencyMapping);
    return Math.min(1, (dependencies + dependents) / 20);
  }

  private calculateRouteImportance(routePath: string, request: TopologyBuildRequest): number {
    return 0.5; // Base importance for routes
  }

  private calculateComponentImportance(componentPath: string, request: TopologyBuildRequest): number {
    return 0.6; // Base importance for components
  }

  private calculateComponentReusability(componentPath: string, request: TopologyBuildRequest): number {
    return 0.5; // Base reusability
  }

  private calculateClusterSize(nodes: NetworkNode[]): number {
    return Math.max(100, nodes.length * 50);
  }

  // Styling and appearance methods

  private getReactFlowNodeType(node: NetworkNode): string {
    switch (node.type) {
      case 'file': return 'default';
      case 'route': return 'input';
      case 'component': return 'output';
      default: return 'default';
    }
  }

  private getReactFlowEdgeType(edge: NetworkEdge): string {
    switch (edge.type) {
      case 'dependency': return 'smoothstep';
      case 'route-relationship': return 'step';
      case 'component-relationship': return 'straight';
      default: return 'default';
    }
  }

  private getNodeStyle(node: NetworkNode): React.CSSProperties {
    return {
      width: node.size,
      height: node.size,
      border: '2px solid #333',
      borderRadius: '50%',
      backgroundColor: this.getNodeColor(node),
      opacity: 0.8 + (node.importance * 0.2)
    };
  }

  private getEdgeStyle(edge: NetworkEdge): React.CSSProperties {
    return {
      stroke: this.getEdgeColor(edge),
      strokeWidth: Math.max(1, edge.strength * 3),
      opacity: 0.6 + (edge.strength * 0.4)
    };
  }

  private getNodeClassName(node: NetworkNode): string {
    const classes = ['network-node', `node-type-${node.type}`];
    if (node.importance > 0.7) classes.push('high-importance');
    if (node.clusterId) classes.push(`cluster-${node.clusterId}`);
    return classes.join(' ');
  }

  private getNodeColor(node: NetworkNode): string {
    switch (node.type) {
      case 'file': return '#4ade80';
      case 'route': return '#3b82f6';
      case 'component': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  private getEdgeColor(edge: NetworkEdge): string {
    switch (edge.type) {
      case 'dependency': return '#10b981';
      case 'route-relationship': return '#3b82f6';
      case 'component-relationship': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  private getWorkspaceColor(workspaceType: string): string {
    const colors: Record<string, string> = {
      'app': '#3b82f6',
      'shared-ui': '#10b981',
      'core-logic': '#f59e0b',
      'agents': '#8b5cf6',
      'microservice': '#ef4444',
      'infrastructure': '#6b7280',
      'documentation': '#06b6d4',
      'library': '#84cc16'
    };
    return colors[workspaceType] || '#6b7280';
  }

  private getRouteGroupColor(protection: string): string {
    const colors: Record<string, string> = {
      'public': '#10b981',
      'authenticated': '#f59e0b',
      'role-based': '#ef4444',
      'unauthenticated': '#3b82f6'
    };
    return colors[protection] || '#6b7280';
  }

  private getComponentClusterColor(clusterType: string): string {
    const colors: Record<string, string> = {
      'ui': '#06b6d4',
      'layout': '#8b5cf6',
      'page': '#3b82f6',
      'feature': '#f59e0b'
    };
    return colors[clusterType] || '#6b7280';
  }

  // Utility methods

  private generateTopologyId(): string {
    return `topology-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private findNodeWorkspace(filePath: string, workspaceMap: Map<string, any>): any {
    for (const [workspaceId, workspace] of workspaceMap) {
      if (workspace.files.includes(filePath)) {
        return workspace;
      }
    }
    return null;
  }

  private categorizeFileNode(fileNode: any): string {
    if (fileNode.extension === 'tsx' || fileNode.extension === 'jsx') return 'component';
    if (fileNode.name === 'page.tsx' || fileNode.name === 'layout.tsx') return 'route';
    if (fileNode.extension === 'ts' || fileNode.extension === 'js') return 'logic';
    return 'other';
  }

  private countDependents(filePath: string, dependencyMapping: any): number {
    return dependencyMapping.importAnalysis.importsByFile.get(filePath)?.length || 0;
  }

  private extractRouteName(routePath: string): string {
    return routePath.split('/').pop() || routePath;
  }

  private createDependencyLabel(dependency: any): string {
    return dependency.importSpecifiers.slice(0, 2).join(', ') + 
           (dependency.importSpecifiers.length > 2 ? '...' : '');
  }

  private calculateRoutingPoints(edge: NetworkEdge, nodes: NetworkNode[], clusters: NetworkCluster[]): any[] {
    // Calculate optimal routing points for edge
    return [];
  }

  private calculatePatternStrength(nodes: NetworkNode[], edges: NetworkEdge[]): number {
    return Math.min(1, nodes.length / 10);
  }

  // Clustering strategy implementations

  private applyWorkspaceBasedClustering(clusters: NetworkCluster[], nodes: NetworkNode[]): NetworkCluster[] {
    return clusters; // Already workspace-based
  }

  private applyDependencyBasedClustering(clusters: NetworkCluster[], nodes: NetworkNode[]): NetworkCluster[] {
    // Group by dependency strength
    return clusters;
  }

  private applyFeatureBasedClustering(clusters: NetworkCluster[], nodes: NetworkNode[]): NetworkCluster[] {
    // Group by feature/functionality
    return clusters;
  }

  private applyHybridClustering(clusters: NetworkCluster[], nodes: NetworkNode[]): NetworkCluster[] {
    // Combine multiple clustering strategies
    return clusters;
  }
}