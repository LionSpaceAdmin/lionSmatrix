/**
 * Dependency Analyzer
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Advanced dependency graph builder and analyzer for TypeScript/JavaScript projects
 */

import path from 'path';
import {
  FileNode,
  DependencyGraph,
  DependencyEdge,
  DependencyType,
  FileType,
  ComponentUsage,
  ComponentInfo
} from './types';

export class DependencyAnalyzer {
  private importRegexes = {
    // ES6 imports
    namedImport: /import\s*{([^}]+)}\s*from\s*['"`]([^'"`]+)['"`]/g,
    defaultImport: /import\s+(\w+)\s*from\s*['"`]([^'"`]+)['"`]/g,
    namespaceImport: /import\s*\*\s*as\s+(\w+)\s*from\s*['"`]([^'"`]+)['"`]/g,
    sideEffectImport: /import\s*['"`]([^'"`]+)['"`]/g,
    
    // Dynamic imports
    dynamicImport: /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    
    // CommonJS
    require: /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    
    // Type imports
    typeImport: /import\s+type\s*{([^}]+)}\s*from\s*['"`]([^'"`]+)['"`]/g,
    
    // Exports
    namedExport: /export\s*{([^}]+)}\s*from\s*['"`]([^'"`]+)['"`]/g,
    reExport: /export\s*\*\s*from\s*['"`]([^'"`]+)['"`]/g,
    
    // React component usage
    componentUsage: /<(\w+)(?:\s+[^>]*)?(?:\/?>|>[\s\S]*?<\/\1>)/g,
    
    // Next.js specific
    nextImage: /from\s*['"`]next\/image['"`]/g,
    nextLink: /from\s*['"`]next\/link['"`]/g,
    nextRouter: /from\s*['"`]next\/router['"`]|from\s*['"`]next\/navigation['"`]/g,
    
    // Asset imports
    assetImport: /import\s+\w+\s*from\s*['"`]([^'"`]*\.(png|jpg|jpeg|gif|svg|css|scss|less|woff|woff2|ttf|eot))['"`]/g
  };

  /**
   * Build comprehensive dependency graph from file nodes
   */
  async buildDependencyGraph(nodes: FileNode[]): Promise<DependencyGraph> {
    const dependencyGraph: DependencyGraph = {
      nodes: new Map(),
      edges: new Map(),
      adjacencyList: new Map(),
      reverseAdjacencyList: new Map(),
      cycles: [],
      orphanedFiles: [],
      entryPoints: []
    };

    // Index all nodes
    for (const node of nodes) {
      if (!node.isDirectory) {
        dependencyGraph.nodes.set(node.path, node);
        dependencyGraph.adjacencyList.set(node.path, []);
        dependencyGraph.reverseAdjacencyList.set(node.path, []);
      }
    }

    // Analyze dependencies for each code file
    for (const node of nodes) {
      if (this.isAnalyzableFile(node) && node.content) {
        await this.analyzeDependencies(node, dependencyGraph);
      }
    }

    // Detect cycles
    dependencyGraph.cycles = this.detectCycles(dependencyGraph);
    
    // Find orphaned files
    dependencyGraph.orphanedFiles = this.findOrphanedFiles(dependencyGraph);
    
    // Identify entry points
    dependencyGraph.entryPoints = this.identifyEntryPoints(dependencyGraph);

    return dependencyGraph;
  }

  /**
   * Analyze dependencies for a single file
   */
  private async analyzeDependencies(
    node: FileNode, 
    graph: DependencyGraph
  ): Promise<void> {
    if (!node.content) return;

    const dependencies = this.extractDependencies(node.content, node.path);

    for (const dep of dependencies) {
      const resolvedPath = this.resolveDependencyPath(dep.importPath, node.path, graph);
      
      if (resolvedPath && graph.nodes.has(resolvedPath)) {
        const edgeId = `${node.path}->${resolvedPath}`;
        
        const edge: DependencyEdge = {
          id: edgeId,
          source: node.path,
          target: resolvedPath,
          type: dep.type,
          line: dep.line,
          column: dep.column,
          isNamedImport: dep.isNamedImport,
          importSpecifiers: dep.specifiers,
          isDynamic: dep.isDynamic,
          isTypeOnly: dep.isTypeOnly
        };

        graph.edges.set(edgeId, edge);
        
        // Update adjacency lists
        const sourceAdj = graph.adjacencyList.get(node.path) || [];
        if (!sourceAdj.includes(resolvedPath)) {
          sourceAdj.push(resolvedPath);
          graph.adjacencyList.set(node.path, sourceAdj);
        }

        const targetRevAdj = graph.reverseAdjacencyList.get(resolvedPath) || [];
        if (!targetRevAdj.includes(node.path)) {
          targetRevAdj.push(node.path);
          graph.reverseAdjacencyList.set(resolvedPath, targetRevAdj);
        }
      }
    }
  }

  /**
   * Extract all dependencies from file content
   */
  private extractDependencies(content: string, filePath: string): ExtractedDependency[] {
    const dependencies: ExtractedDependency[] = [];
    const lines = content.split('\n');

    // ES6 Named Imports
    let match;
    while ((match = this.importRegexes.namedImport.exec(content)) !== null) {
      const specifiers = match[1].split(',').map(s => s.trim().split(' as ')[0]);
      const lineNumber = this.getLineNumber(content, match.index);
      
      dependencies.push({
        importPath: match[2],
        type: DependencyType.IMPORT,
        specifiers,
        isNamedImport: true,
        isDynamic: false,
        isTypeOnly: false,
        line: lineNumber,
        column: match.index - content.lastIndexOf('\n', match.index)
      });
    }

    // Reset regex
    this.importRegexes.namedImport.lastIndex = 0;

    // ES6 Default Imports
    while ((match = this.importRegexes.defaultImport.exec(content)) !== null) {
      const lineNumber = this.getLineNumber(content, match.index);
      
      dependencies.push({
        importPath: match[2],
        type: DependencyType.IMPORT,
        specifiers: [match[1]],
        isNamedImport: false,
        isDynamic: false,
        isTypeOnly: false,
        line: lineNumber,
        column: match.index - content.lastIndexOf('\n', match.index)
      });
    }

    this.importRegexes.defaultImport.lastIndex = 0;

    // Namespace Imports
    while ((match = this.importRegexes.namespaceImport.exec(content)) !== null) {
      const lineNumber = this.getLineNumber(content, match.index);
      
      dependencies.push({
        importPath: match[2],
        type: DependencyType.IMPORT,
        specifiers: [match[1]],
        isNamedImport: false,
        isDynamic: false,
        isTypeOnly: false,
        line: lineNumber,
        column: match.index - content.lastIndexOf('\n', match.index)
      });
    }

    this.importRegexes.namespaceImport.lastIndex = 0;

    // Side Effect Imports
    while ((match = this.importRegexes.sideEffectImport.exec(content)) !== null) {
      const lineNumber = this.getLineNumber(content, match.index);
      
      dependencies.push({
        importPath: match[1],
        type: DependencyType.IMPORT,
        specifiers: [],
        isNamedImport: false,
        isDynamic: false,
        isTypeOnly: false,
        line: lineNumber,
        column: match.index - content.lastIndexOf('\n', match.index)
      });
    }

    this.importRegexes.sideEffectImport.lastIndex = 0;

    // Dynamic Imports
    while ((match = this.importRegexes.dynamicImport.exec(content)) !== null) {
      const lineNumber = this.getLineNumber(content, match.index);
      
      dependencies.push({
        importPath: match[1],
        type: DependencyType.DYNAMIC_IMPORT,
        specifiers: [],
        isNamedImport: false,
        isDynamic: true,
        isTypeOnly: false,
        line: lineNumber,
        column: match.index - content.lastIndexOf('\n', match.index)
      });
    }

    this.importRegexes.dynamicImport.lastIndex = 0;

    // Type Imports
    while ((match = this.importRegexes.typeImport.exec(content)) !== null) {
      const specifiers = match[1].split(',').map(s => s.trim());
      const lineNumber = this.getLineNumber(content, match.index);
      
      dependencies.push({
        importPath: match[2],
        type: DependencyType.TYPE_IMPORT,
        specifiers,
        isNamedImport: true,
        isDynamic: false,
        isTypeOnly: true,
        line: lineNumber,
        column: match.index - content.lastIndexOf('\n', match.index)
      });
    }

    this.importRegexes.typeImport.lastIndex = 0;

    // CommonJS Requires
    while ((match = this.importRegexes.require.exec(content)) !== null) {
      const lineNumber = this.getLineNumber(content, match.index);
      
      dependencies.push({
        importPath: match[1],
        type: DependencyType.REQUIRE,
        specifiers: [],
        isNamedImport: false,
        isDynamic: false,
        isTypeOnly: false,
        line: lineNumber,
        column: match.index - content.lastIndexOf('\n', match.index)
      });
    }

    this.importRegexes.require.lastIndex = 0;

    // Asset Imports
    while ((match = this.importRegexes.assetImport.exec(content)) !== null) {
      const lineNumber = this.getLineNumber(content, match.index);
      
      dependencies.push({
        importPath: match[1],
        type: DependencyType.ASSET_REFERENCE,
        specifiers: [],
        isNamedImport: false,
        isDynamic: false,
        isTypeOnly: false,
        line: lineNumber,
        column: match.index - content.lastIndexOf('\n', match.index)
      });
    }

    this.importRegexes.assetImport.lastIndex = 0;

    return dependencies;
  }

  /**
   * Resolve dependency path to absolute path
   */
  private resolveDependencyPath(
    importPath: string, 
    fromFile: string, 
    graph: DependencyGraph
  ): string | null {
    // Skip node_modules dependencies
    if (!importPath.startsWith('.')) {
      return null;
    }

    const fromDir = path.dirname(fromFile);
    let resolvedPath = path.resolve(fromDir, importPath);

    // Try different extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.d.ts'];
    
    // Check if it's already a complete path
    if (graph.nodes.has(resolvedPath)) {
      return resolvedPath;
    }

    // Try with extensions
    for (const ext of extensions) {
      const withExt = resolvedPath + ext;
      if (graph.nodes.has(withExt)) {
        return withExt;
      }
    }

    // Try index files
    for (const ext of extensions) {
      const indexPath = path.join(resolvedPath, `index${ext}`);
      if (graph.nodes.has(indexPath)) {
        return indexPath;
      }
    }

    return null;
  }

  /**
   * Detect circular dependencies
   */
  private detectCycles(graph: DependencyGraph): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const pathStack: string[] = [];

    const dfs = (node: string): boolean => {
      if (recStack.has(node)) {
        // Found cycle
        const cycleStart = pathStack.indexOf(node);
        const cycle = pathStack.slice(cycleStart).concat([node]);
        cycles.push(cycle);
        return true;
      }

      if (visited.has(node)) {
        return false;
      }

      visited.add(node);
      recStack.add(node);
      pathStack.push(node);

      const neighbors = graph.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        dfs(neighbor);
      }

      recStack.delete(node);
      pathStack.pop();
      return false;
    };

    for (const node of graph.nodes.keys()) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }

    return cycles;
  }

  /**
   * Find files with no dependencies or dependents
   */
  private findOrphanedFiles(graph: DependencyGraph): string[] {
    const orphaned: string[] = [];

    for (const [filePath, node] of graph.nodes) {
      const deps = graph.adjacencyList.get(filePath) || [];
      const dependents = graph.reverseAdjacencyList.get(filePath) || [];

      // Skip certain types of files that are naturally entry points
      if (this.isNaturalEntryPoint(node)) {
        continue;
      }

      if (deps.length === 0 && dependents.length === 0) {
        orphaned.push(filePath);
      }
    }

    return orphaned;
  }

  /**
   * Identify entry points (files with no dependents but have dependencies)
   */
  private identifyEntryPoints(graph: DependencyGraph): string[] {
    const entryPoints: string[] = [];

    for (const [filePath, node] of graph.nodes) {
      const dependents = graph.reverseAdjacencyList.get(filePath) || [];
      
      if (dependents.length === 0 && this.isNaturalEntryPoint(node)) {
        entryPoints.push(filePath);
      }
    }

    return entryPoints;
  }

  /**
   * Check if file is analyzable for dependencies
   */
  private isAnalyzableFile(node: FileNode): boolean {
    if (node.isDirectory) return false;
    
    return [
      FileType.TYPESCRIPT,
      FileType.JAVASCRIPT,
      FileType.TSX,
      FileType.JSX
    ].includes(node.type);
  }

  /**
   * Check if file is a natural entry point
   */
  private isNaturalEntryPoint(node: FileNode): boolean {
    const entryPointPatterns = [
      /page\.(ts|tsx|js|jsx)$/,
      /layout\.(ts|tsx|js|jsx)$/,
      /loading\.(ts|tsx|js|jsx)$/,
      /error\.(ts|tsx|js|jsx)$/,
      /not-found\.(ts|tsx|js|jsx)$/,
      /route\.(ts|js)$/,
      /middleware\.(ts|js)$/,
      /^index\.(ts|tsx|js|jsx)$/,
      /^app\.(ts|tsx|js|jsx)$/,
      /^main\.(ts|tsx|js|jsx)$/
    ];

    return entryPointPatterns.some(pattern => pattern.test(node.name));
  }

  /**
   * Get line number from character index
   */
  private getLineNumber(content: string, index: number): number {
    const beforeIndex = content.substring(0, index);
    return beforeIndex.split('\n').length;
  }

  /**
   * Analyze React component usage patterns
   */
  analyzeComponentUsage(nodes: FileNode[]): Map<string, ComponentUsage[]> {
    const usage = new Map<string, ComponentUsage[]>();

    for (const node of nodes) {
      if (!this.isAnalyzableFile(node) || !node.content) continue;

      const componentUsages = this.extractComponentUsage(node.content, node.path);
      
      for (const componentUsage of componentUsages) {
        const existing = usage.get(componentUsage.componentName) || [];
        existing.push(componentUsage);
        usage.set(componentUsage.componentName, existing);
      }
    }

    return usage;
  }

  /**
   * Extract component usage from file content
   */
  private extractComponentUsage(content: string, filePath: string): ComponentUsage[] {
    const usages: ComponentUsage[] = [];
    const isClientComponent = content.includes("'use client'") || content.includes('"use client"');
    
    let match;
    while ((match = this.importRegexes.componentUsage.exec(content)) !== null) {
      const componentName = match[1];
      
      // Skip HTML elements
      if (componentName.toLowerCase() === componentName) {
        continue;
      }

      const lineNumber = this.getLineNumber(content, match.index);
      
      usages.push({
        componentName,
        usedInFile: filePath,
        line: lineNumber,
        column: match.index - content.lastIndexOf('\n', match.index),
        isServerComponent: !isClientComponent,
        isClientComponent
      });
    }

    this.importRegexes.componentUsage.lastIndex = 0;
    return usages;
  }

  /**
   * Get dependency statistics
   */
  getDependencyStats(graph: DependencyGraph): DependencyStats {
    const stats: DependencyStats = {
      totalFiles: graph.nodes.size,
      totalDependencies: graph.edges.size,
      averageDependencies: 0,
      maxDependencies: 0,
      filesWithMostDependencies: [],
      circularDependencies: graph.cycles.length,
      orphanedFiles: graph.orphanedFiles.length,
      entryPoints: graph.entryPoints.length
    };

    let totalDeps = 0;
    let maxDeps = 0;
    let fileWithMaxDeps = '';

    for (const [filePath, deps] of graph.adjacencyList) {
      const depCount = deps.length;
      totalDeps += depCount;
      
      if (depCount > maxDeps) {
        maxDeps = depCount;
        fileWithMaxDeps = filePath;
      }
    }

    stats.averageDependencies = totalDeps / graph.nodes.size;
    stats.maxDependencies = maxDeps;
    stats.filesWithMostDependencies = [fileWithMaxDeps];

    return stats;
  }
}

// Supporting interfaces
interface ExtractedDependency {
  importPath: string;
  type: DependencyType;
  specifiers: string[];
  isNamedImport: boolean;
  isDynamic: boolean;
  isTypeOnly: boolean;
  line: number;
  column: number;
}

interface DependencyStats {
  totalFiles: number;
  totalDependencies: number;
  averageDependencies: number;
  maxDependencies: number;
  filesWithMostDependencies: string[];
  circularDependencies: number;
  orphanedFiles: number;
  entryPoints: number;
}