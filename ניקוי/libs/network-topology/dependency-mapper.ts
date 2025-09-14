/**
 * Dependency Mapper
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Maps all import/export relationships and cross-package dependencies with circular detection
 */

import path from 'path';
import { 
  DependencyGraph, 
  DependencyEdge, 
  FileNode, 
  DependencyType 
} from '../file-scanner/types';
import {
  DependencyMapping,
  CrossPackageDependency,
  CircularDependency,
  DependencyCluster,
  ImportAnalysis,
  ExportAnalysis,
  DependencyMapperConfig,
  DependencyStrength,
  ComponentDependency
} from './types';

export class DependencyMapper {
  private config: DependencyMapperConfig;

  constructor(config: DependencyMapperConfig) {
    this.config = config;
  }

  /**
   * Map all dependencies and create comprehensive dependency analysis
   */
  async mapDependencies(
    dependencyGraph: DependencyGraph,
    workspaceMap: Map<string, any>
  ): Promise<DependencyMapping> {
    const startTime = performance.now();

    // Step 1: Analyze import/export relationships
    const importAnalysis = this.analyzeImports(dependencyGraph);
    const exportAnalysis = this.analyzeExports(dependencyGraph);

    // Step 2: Map cross-package dependencies
    const crossPackageDeps = this.mapCrossPackageDependencies(
      dependencyGraph, 
      workspaceMap
    );

    // Step 3: Detect circular dependencies
    const circularDeps = this.detectCircularDependencies(dependencyGraph);

    // Step 4: Create dependency clusters
    const clusters = this.createDependencyClusters(dependencyGraph, workspaceMap);

    // Step 5: Analyze dependency strength
    const dependencyStrengths = this.analyzeDependencyStrength(dependencyGraph);

    // Step 6: Map component dependencies specifically
    const componentDependencies = this.mapComponentDependencies(dependencyGraph);

    // Step 7: Identify external dependencies
    const externalDependencies = this.identifyExternalDependencies(dependencyGraph);

    const endTime = performance.now();

    return {
      importAnalysis,
      exportAnalysis,
      crossPackageDependencies: crossPackageDeps,
      circularDependencies: circularDeps,
      dependencyStrengths,
      clusters,
      componentDependencies,
      externalDependencies,
      orphanedFiles: dependencyGraph.orphanedFiles,
      entryPoints: dependencyGraph.entryPoints,
      totalDependencies: dependencyGraph.edges.size,
      mappingTime: endTime - startTime,
      mappedAt: new Date()
    };
  }

  /**
   * Analyze all import statements and relationships
   */
  private analyzeImports(dependencyGraph: DependencyGraph): ImportAnalysis {
    const importsByFile = new Map<string, DependencyEdge[]>();
    const importsByType = new Map<DependencyType, DependencyEdge[]>();
    const dynamicImports: DependencyEdge[] = [];
    const typeOnlyImports: DependencyEdge[] = [];

    // Group imports by file and type
    for (const [edgeId, edge] of dependencyGraph.edges) {
      // Group by source file
      if (!importsByFile.has(edge.source)) {
        importsByFile.set(edge.source, []);
      }
      importsByFile.get(edge.source)!.push(edge);

      // Group by dependency type
      if (!importsByType.has(edge.type)) {
        importsByType.set(edge.type, []);
      }
      importsByType.get(edge.type)!.push(edge);

      // Collect special types
      if (edge.isDynamic) {
        dynamicImports.push(edge);
      }
      if (edge.isTypeOnly) {
        typeOnlyImports.push(edge);
      }
    }

    // Find most imported files
    const importCounts = new Map<string, number>();
    for (const edge of dependencyGraph.edges.values()) {
      importCounts.set(edge.target, (importCounts.get(edge.target) || 0) + 1);
    }

    const mostImported = Array.from(importCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([filePath, count]) => ({ filePath, count }));

    return {
      importsByFile,
      importsByType,
      dynamicImports,
      typeOnlyImports,
      mostImported,
      totalImports: dependencyGraph.edges.size
    };
  }

  /**
   * Analyze all export statements and relationships
   */
  private analyzeExports(dependencyGraph: DependencyGraph): ExportAnalysis {
    const exportsByFile = new Map<string, string[]>();
    const reExports = new Map<string, string[]>();
    const defaultExports: string[] = [];
    const namedExports = new Map<string, string[]>();

    // Analyze exports from dependency edges
    for (const [edgeId, edge] of dependencyGraph.edges) {
      if (edge.type === DependencyType.EXPORT) {
        if (!exportsByFile.has(edge.source)) {
          exportsByFile.set(edge.source, []);
        }
        exportsByFile.get(edge.source)!.push(edge.target);

        // Analyze export specifiers
        edge.importSpecifiers.forEach(specifier => {
          if (specifier === 'default') {
            defaultExports.push(edge.source);
          } else {
            if (!namedExports.has(edge.source)) {
              namedExports.set(edge.source, []);
            }
            namedExports.get(edge.source)!.push(specifier);
          }
        });
      }
    }

    // Find most exported files
    const exportCounts = new Map<string, number>();
    for (const [file, exports] of exportsByFile) {
      exportCounts.set(file, exports.length);
    }

    const mostExported = Array.from(exportCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([filePath, count]) => ({ filePath, count }));

    return {
      exportsByFile,
      reExports,
      defaultExports,
      namedExports,
      mostExported,
      totalExports: exportsByFile.size
    };
  }

  /**
   * Map dependencies that cross package boundaries
   */
  private mapCrossPackageDependencies(
    dependencyGraph: DependencyGraph,
    workspaceMap: Map<string, any>
  ): CrossPackageDependency[] {
    const crossPackageDeps: CrossPackageDependency[] = [];

    for (const [edgeId, edge] of dependencyGraph.edges) {
      const sourceWorkspace = this.getFileWorkspace(edge.source, workspaceMap);
      const targetWorkspace = this.getFileWorkspace(edge.target, workspaceMap);

      if (sourceWorkspace && targetWorkspace && sourceWorkspace.id !== targetWorkspace.id) {
        crossPackageDeps.push({
          id: edgeId,
          sourceWorkspace: sourceWorkspace.id,
          targetWorkspace: targetWorkspace.id,
          sourceFile: edge.source,
          targetFile: edge.target,
          dependencyType: edge.type,
          importSpecifiers: edge.importSpecifiers,
          isDynamic: edge.isDynamic,
          isTypeOnly: edge.isTypeOnly,
          strength: this.calculateDependencyStrength(edge)
        });
      }
    }

    return crossPackageDeps;
  }

  /**
   * Detect circular dependencies in the project
   */
  private detectCircularDependencies(dependencyGraph: DependencyGraph): CircularDependency[] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const circularDeps: CircularDependency[] = [];

    const dfs = (node: string, path: string[] = []): void => {
      if (recursionStack.has(node)) {
        // Found a cycle
        const cycleStart = path.indexOf(node);
        const cycle = path.slice(cycleStart);
        cycle.push(node); // Complete the cycle

        circularDeps.push({
          id: `circular-${circularDeps.length}`,
          cycle,
          length: cycle.length - 1,
          severity: this.calculateCircularDependencySeverity(cycle),
          involvedFiles: cycle,
          suggestedBreakPoint: this.suggestCircularDependencyBreakPoint(cycle, dependencyGraph)
        });
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      recursionStack.add(node);

      const dependencies = dependencyGraph.adjacencyList.get(node) || [];
      for (const dep of dependencies) {
        dfs(dep, [...path, node]);
      }

      recursionStack.delete(node);
    };

    // Check all nodes for cycles
    for (const [filePath] of dependencyGraph.nodes) {
      if (!visited.has(filePath)) {
        dfs(filePath);
      }
    }

    return circularDeps;
  }

  /**
   * Create dependency clusters based on coupling strength
   */
  private createDependencyClusters(
    dependencyGraph: DependencyGraph,
    workspaceMap: Map<string, any>
  ): DependencyCluster[] {
    const clusters: DependencyCluster[] = [];
    const processedNodes = new Set<string>();

    // Create workspace-based clusters
    for (const [workspaceId, workspace] of workspaceMap) {
      const workspaceFiles = Array.from(dependencyGraph.nodes.values())
        .filter(node => workspace.files.includes(node.path))
        .map(node => node.path);

      if (workspaceFiles.length > 0) {
        clusters.push({
          id: `workspace-${workspaceId}`,
          name: workspace.name,
          type: 'workspace',
          files: workspaceFiles,
          internalDependencies: this.getInternalDependencies(workspaceFiles, dependencyGraph),
          externalDependencies: this.getExternalDependencies(workspaceFiles, dependencyGraph),
          cohesion: this.calculateCohesion(workspaceFiles, dependencyGraph),
          coupling: this.calculateCoupling(workspaceFiles, dependencyGraph)
        });

        workspaceFiles.forEach(file => processedNodes.add(file));
      }
    }

    // Create feature-based clusters for tightly coupled files
    const remainingNodes = Array.from(dependencyGraph.nodes.keys())
      .filter(node => !processedNodes.has(node));

    const featureClusters = this.identifyFeatureClusters(remainingNodes, dependencyGraph);
    clusters.push(...featureClusters);

    return clusters;
  }

  /**
   * Analyze the strength of dependencies
   */
  private analyzeDependencyStrength(dependencyGraph: DependencyGraph): DependencyStrength[] {
    const strengths: DependencyStrength[] = [];

    for (const [edgeId, edge] of dependencyGraph.edges) {
      const strength = this.calculateDependencyStrength(edge);
      
      strengths.push({
        id: edgeId,
        source: edge.source,
        target: edge.target,
        strength,
        type: edge.type,
        reasons: this.getDependencyStrengthReasons(edge, strength)
      });
    }

    // Sort by strength (highest first)
    return strengths.sort((a, b) => b.strength - a.strength);
  }

  /**
   * Map React component specific dependencies
   */
  private mapComponentDependencies(dependencyGraph: DependencyGraph): ComponentDependency[] {
    const componentDeps: ComponentDependency[] = [];

    for (const [filePath, node] of dependencyGraph.nodes) {
      if (this.isComponentFile(node)) {
        const dependencies = dependencyGraph.adjacencyList.get(filePath) || [];
        const dependents = dependencyGraph.reverseAdjacencyList.get(filePath) || [];

        componentDeps.push({
          componentFile: filePath,
          dependencies: dependencies.filter(dep => this.isComponentFile(dependencyGraph.nodes.get(dep))),
          dependents: dependents.filter(dep => this.isComponentFile(dependencyGraph.nodes.get(dep))),
          imports: this.getComponentImports(filePath, dependencyGraph),
          exports: this.getComponentExports(filePath, dependencyGraph),
          isServerComponent: this.isServerComponent(node),
          isClientComponent: this.isClientComponent(node),
          usageCount: dependents.length
        });
      }
    }

    return componentDeps;
  }

  /**
   * Identify external dependencies (npm packages)
   */
  private identifyExternalDependencies(dependencyGraph: DependencyGraph): Map<string, number> {
    const externalDeps = new Map<string, number>();

    for (const [edgeId, edge] of dependencyGraph.edges) {
      if (this.isExternalDependency(edge.target)) {
        const packageName = this.extractPackageName(edge.target);
        externalDeps.set(packageName, (externalDeps.get(packageName) || 0) + 1);
      }
    }

    return externalDeps;
  }

  // Helper methods

  private getFileWorkspace(filePath: string, workspaceMap: Map<string, any>): any {
    for (const [workspaceId, workspace] of workspaceMap) {
      if (workspace.files.includes(filePath)) {
        return workspace;
      }
    }
    return null;
  }

  private calculateDependencyStrength(edge: DependencyEdge): number {
    let strength = 1;

    // Base strength on import specifiers count
    strength += edge.importSpecifiers.length * 0.5;

    // Dynamic imports are weaker
    if (edge.isDynamic) strength *= 0.7;

    // Type-only imports are weaker
    if (edge.isTypeOnly) strength *= 0.5;

    // Named imports are stronger than default
    if (edge.isNamedImport) strength *= 1.2;

    return Math.round(strength * 100) / 100;
  }

  private calculateCircularDependencySeverity(cycle: string[]): 'low' | 'medium' | 'high' {
    if (cycle.length <= 3) return 'high';
    if (cycle.length <= 5) return 'medium';
    return 'low';
  }

  private suggestCircularDependencyBreakPoint(
    cycle: string[], 
    dependencyGraph: DependencyGraph
  ): string {
    // Suggest breaking the dependency with the weakest connection
    let weakestEdge: DependencyEdge | null = null;
    let weakestStrength = Infinity;

    for (let i = 0; i < cycle.length - 1; i++) {
      const source = cycle[i];
      const target = cycle[i + 1];
      
      const edge = Array.from(dependencyGraph.edges.values())
        .find(e => e.source === source && e.target === target);
      
      if (edge) {
        const strength = this.calculateDependencyStrength(edge);
        if (strength < weakestStrength) {
          weakestStrength = strength;
          weakestEdge = edge;
        }
      }
    }

    return weakestEdge ? `${weakestEdge.source} -> ${weakestEdge.target}` : cycle[0];
  }

  private getInternalDependencies(files: string[], dependencyGraph: DependencyGraph): number {
    let count = 0;
    for (const file of files) {
      const deps = dependencyGraph.adjacencyList.get(file) || [];
      count += deps.filter(dep => files.includes(dep)).length;
    }
    return count;
  }

  private getExternalDependencies(files: string[], dependencyGraph: DependencyGraph): number {
    let count = 0;
    for (const file of files) {
      const deps = dependencyGraph.adjacencyList.get(file) || [];
      count += deps.filter(dep => !files.includes(dep)).length;
    }
    return count;
  }

  private calculateCohesion(files: string[], dependencyGraph: DependencyGraph): number {
    const internal = this.getInternalDependencies(files, dependencyGraph);
    const total = files.length * (files.length - 1);
    return total > 0 ? internal / total : 0;
  }

  private calculateCoupling(files: string[], dependencyGraph: DependencyGraph): number {
    const external = this.getExternalDependencies(files, dependencyGraph);
    const totalPossible = files.length * (dependencyGraph.nodes.size - files.length);
    return totalPossible > 0 ? external / totalPossible : 0;
  }

  private identifyFeatureClusters(nodes: string[], dependencyGraph: DependencyGraph): DependencyCluster[] {
    // Implementation for identifying feature-based clusters
    // This would use clustering algorithms like connected components
    return [];
  }

  private getDependencyStrengthReasons(edge: DependencyEdge, strength: number): string[] {
    const reasons: string[] = [];
    
    if (edge.importSpecifiers.length > 1) {
      reasons.push(`Multiple imports (${edge.importSpecifiers.length})`);
    }
    if (edge.isDynamic) reasons.push('Dynamic import');
    if (edge.isTypeOnly) reasons.push('Type-only import');
    if (edge.isNamedImport) reasons.push('Named import');

    return reasons;
  }

  private isComponentFile(node: FileNode | undefined): boolean {
    if (!node) return false;
    return node.extension === 'tsx' || node.extension === 'jsx';
  }

  private getComponentImports(filePath: string, dependencyGraph: DependencyGraph): string[] {
    const dependencies = dependencyGraph.adjacencyList.get(filePath) || [];
    return dependencies.filter(dep => this.isComponentFile(dependencyGraph.nodes.get(dep)));
  }

  private getComponentExports(filePath: string, dependencyGraph: DependencyGraph): string[] {
    // Find what this component exports
    return Array.from(dependencyGraph.edges.values())
      .filter(edge => edge.source === filePath && edge.type === DependencyType.EXPORT)
      .flatMap(edge => edge.importSpecifiers);
  }

  private isServerComponent(node: FileNode): boolean {
    // Check if component has "use client" directive
    return !node.content?.includes('"use client"') && !node.content?.includes("'use client'");
  }

  private isClientComponent(node: FileNode): boolean {
    return node.content?.includes('"use client"') || node.content?.includes("'use client'") || false;
  }

  private isExternalDependency(target: string): boolean {
    // Check if it's a node_modules dependency
    return !target.startsWith('.') && !target.startsWith('/') && !target.startsWith('@/');
  }

  private extractPackageName(importPath: string): string {
    if (importPath.startsWith('@')) {
      const parts = importPath.split('/');
      return parts.slice(0, 2).join('/');
    }
    return importPath.split('/')[0];
  }
}