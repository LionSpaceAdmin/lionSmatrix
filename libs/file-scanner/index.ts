/**
 * File Scanner Engine - Main Entry Point
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Advanced file scanning system for comprehensive project analysis and visualization
 */

import fs from 'fs/promises';
import path from 'path';
import { performance } from 'perf_hooks';
import chokidar from 'chokidar';
import { glob } from 'glob';

import {
  FileNode,
  ProjectStructure,
  ScanOptions,
  ScannerConfig,
  FileType,
  ScanPhase,
  ScanProgress,
  FileChangeEvent,
  DependencyGraph,
  RouteGraph,
  ComponentMap,
  ProjectHealth,
  VisualizationData,
  ReactFlowNode,
  ReactFlowEdge
} from './types';

import { DependencyAnalyzer } from './dependency-analyzer';
import { HealthMonitor } from './health-monitor';
import { AgentPromptsAnalyzer } from './agent-prompts-analyzer';

export class FileScannerEngine {
  private config: ScannerConfig;
  private dependencyAnalyzer: DependencyAnalyzer;
  private healthMonitor: HealthMonitor;
  private agentPromptsAnalyzer: AgentPromptsAnalyzer;
  private watcher?: chokidar.FSWatcher;
  private scanInProgress: boolean = false;
  private lastScanResult?: ProjectStructure;

  constructor(config: ScannerConfig) {
    this.config = config;
    this.dependencyAnalyzer = new DependencyAnalyzer();
    this.healthMonitor = new HealthMonitor();
    this.agentPromptsAnalyzer = new AgentPromptsAnalyzer(config.rootPath);
  }

  /**
   * Main scanning method - performs comprehensive project analysis
   */
  async scan(): Promise<ProjectStructure> {
    if (this.scanInProgress) {
      throw new Error('Scan already in progress');
    }

    this.scanInProgress = true;
    const startTime = performance.now();

    try {
      const progress: ScanProgress = {
        phase: ScanPhase.INITIALIZING,
        progress: 0,
        totalFiles: 0,
        processedFiles: 0,
        errors: [],
        warnings: []
      };

      this.reportProgress(progress);

      // Phase 1: Discover all files
      progress.phase = ScanPhase.SCANNING_FILES;
      progress.progress = 10;
      this.reportProgress(progress);

      const fileNodes = await this.scanFileSystem();
      progress.totalFiles = this.countFiles(fileNodes);
      progress.progress = 25;
      this.reportProgress(progress);

      // Phase 2: Parse file contents and ASTs
      progress.phase = ScanPhase.PARSING_CONTENT;
      progress.progress = 30;
      this.reportProgress(progress);

      const enrichedNodes = await this.parseFileContents(fileNodes, progress);
      progress.progress = 50;
      this.reportProgress(progress);

      // Phase 3: Build dependency graph
      progress.phase = ScanPhase.BUILDING_GRAPH;
      progress.progress = 55;
      this.reportProgress(progress);

      const dependencyGraph = await this.dependencyAnalyzer.buildDependencyGraph(enrichedNodes);
      progress.progress = 70;
      this.reportProgress(progress);

      // Phase 4: Analyze routes and components
      progress.phase = ScanPhase.ANALYZING_DEPENDENCIES;
      progress.progress = 75;
      this.reportProgress(progress);

      const routeGraph = await this.analyzeRoutes(enrichedNodes);
      const componentMap = await this.analyzeComponents(enrichedNodes, dependencyGraph);
      progress.progress = 85;
      this.reportProgress(progress);

      // Phase 5: Health analysis
      progress.phase = ScanPhase.HEALTH_CHECK;
      progress.progress = 85;
      this.reportProgress(progress);

      const health = await this.healthMonitor.analyzeProjectHealth({
        files: enrichedNodes,
        dependencies: dependencyGraph,
        routes: routeGraph,
        components: componentMap
      });

      // Phase 6: Agent prompts analysis
      progress.progress = 90;
      this.reportProgress(progress);

      await this.agentPromptsAnalyzer.analyzeProject({
        files: enrichedNodes,
        routes: routeGraph.routes,
        components: componentMap.components
      });

      // Phase 7: Complete
      progress.phase = ScanPhase.COMPLETED;
      progress.progress = 100;
      this.reportProgress(progress);

      const endTime = performance.now();
      const result: ProjectStructure = {
        rootPath: this.config.rootPath,
        totalFiles: progress.totalFiles,
        totalDirectories: this.countDirectories(fileNodes),
        filesByType: this.categorizeFilesByType(enrichedNodes),
        dependencies: dependencyGraph,
        routes: routeGraph,
        components: componentMap,
        health,
        lastScanned: new Date(),
        scanDuration: endTime - startTime
      };

      this.lastScanResult = result;
      return result;

    } finally {
      this.scanInProgress = false;
    }
  }

  /**
   * Start real-time file monitoring
   */
  async startWatching(): Promise<void> {
    if (this.watcher) {
      await this.stopWatching();
    }

    const watchPaths = this.config.options.includePatterns.length > 0
      ? this.config.options.includePatterns.map(pattern => 
          path.join(this.config.rootPath, pattern))
      : [this.config.rootPath];

    this.watcher = chokidar.watch(watchPaths, {
      ignored: this.config.watcherOptions?.ignored || [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
        '**/dist/**',
        '**/build/**'
      ],
      persistent: this.config.watcherOptions?.persistent ?? true,
      ignoreInitial: this.config.watcherOptions?.ignoreInitial ?? true,
      followSymlinks: this.config.watcherOptions?.followSymlinks ?? false
    });

    // Set up event handlers
    this.watcher.on('add', (filePath) => this.handleFileChange('add', filePath));
    this.watcher.on('change', (filePath) => this.handleFileChange('change', filePath));
    this.watcher.on('unlink', (filePath) => this.handleFileChange('unlink', filePath));
    this.watcher.on('addDir', (dirPath) => this.handleFileChange('addDir', dirPath));
    this.watcher.on('unlinkDir', (dirPath) => this.handleFileChange('unlinkDir', dirPath));

    this.watcher.on('error', (error) => {
      console.error('File watcher error:', error);
    });
  }

  /**
   * Stop file monitoring
   */
  async stopWatching(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = undefined;
    }
  }

  /**
   * Generate visualization data for React Flow
   */
  generateVisualizationData(): VisualizationData {
    if (!this.lastScanResult) {
      throw new Error('No scan results available. Run scan() first.');
    }

    const nodes: ReactFlowNode[] = [];
    const edges: ReactFlowEdge[] = [];

    // Convert file nodes to React Flow nodes
    for (const [filePath, fileNode] of this.lastScanResult.dependencies.nodes) {
      const dependencies = this.lastScanResult.dependencies.adjacencyList.get(filePath)?.length || 0;
      const dependents = this.lastScanResult.dependencies.reverseAdjacencyList.get(filePath)?.length || 0;

      nodes.push({
        id: fileNode.id,
        type: fileNode.isDirectory ? 'directory' : 'file',
        position: { x: 0, y: 0 }, // Will be calculated by layout algorithm
        data: {
          label: fileNode.name,
          file: fileNode,
          health: this.lastScanResult.health.issues.filter(issue => issue.file === filePath),
          dependencies,
          dependents
        },
        className: this.getNodeClassName(fileNode, dependencies, dependents)
      });
    }

    // Convert dependency edges to React Flow edges
    for (const [edgeId, dependencyEdge] of this.lastScanResult.dependencies.edges) {
      edges.push({
        id: edgeId,
        source: dependencyEdge.source,
        target: dependencyEdge.target,
        type: 'dependency',
        animated: dependencyEdge.isDynamic,
        data: {
          dependency: dependencyEdge,
          strength: dependencyEdge.importSpecifiers.length,
          type: dependencyEdge.type
        }
      });
    }

    return {
      nodes,
      edges,
      layout: {
        algorithm: 'force',
        spacing: 100,
        direction: 'TB',
        rankSeparation: 150,
        nodeSeparation: 100
      },
      filters: {
        fileTypes: Object.values(FileType),
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
   * Get the last scan result
   */
  getLastScanResult(): ProjectStructure | undefined {
    return this.lastScanResult;
  }

  /**
   * Check if a scan is currently in progress
   */
  isScanInProgress(): boolean {
    return this.scanInProgress;
  }

  /**
   * Get agent prompts analysis
   */
  getAgentPromptsAnalysis() {
    return this.agentPromptsAnalyzer.getLastAnalysis();
  }

  /**
   * Generate comprehensive implementation report
   */
  generateImplementationReport(): string {
    return this.agentPromptsAnalyzer.generateImplementationReport();
  }

  /**
   * Get context for a specific route
   */
  getRouteContext(route: string) {
    return this.agentPromptsAnalyzer.getRouteContext(route);
  }

  /**
   * Get implementation suggestions for a route
   */
  getImplementationSuggestions(route: string): string[] {
    return this.agentPromptsAnalyzer.getImplementationSuggestions(route);
  }

  /**
   * Export comprehensive project data for external analysis
   */
  exportProjectData(): {
    structure: ProjectStructure | undefined;
    agentAnalysis: any;
    visualizationData: VisualizationData | null;
  } {
    return {
      structure: this.lastScanResult,
      agentAnalysis: this.agentPromptsAnalyzer.getLastAnalysis(),
      visualizationData: this.lastScanResult ? this.generateVisualizationData() : null
    };
  }

  // Private methods

  private async scanFileSystem(): Promise<FileNode[]> {
    const patterns = this.config.options.includePatterns.length > 0
      ? this.config.options.includePatterns
      : ['**/*'];

    const allPaths: string[] = [];

    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: this.config.rootPath,
        ignore: this.config.options.excludePatterns,
        dot: false,
        absolute: true,
        followSymbolicLinks: this.config.options.followSymlinks
      });
      allPaths.push(...matches);
    }

    // Remove duplicates and sort
    const uniquePaths = [...new Set(allPaths)].sort();

    // Convert to FileNode structure
    const nodes: FileNode[] = [];
    
    for (const filePath of uniquePaths) {
      try {
        const stats = await fs.stat(filePath);
        const relativePath = path.relative(this.config.rootPath, filePath);
        const name = path.basename(filePath);
        const extension = path.extname(filePath).slice(1);

        const node: FileNode = {
          id: this.generateNodeId(filePath),
          path: filePath,
          relativePath,
          name,
          extension,
          size: stats.size,
          lastModified: stats.mtime,
          type: this.getFileType(extension),
          isDirectory: stats.isDirectory(),
          depth: relativePath.split(path.sep).length - 1
        };

        nodes.push(node);
      } catch (error) {
        console.warn(`Failed to process file: ${filePath}`, error);
      }
    }

    return this.buildFileHierarchy(nodes);
  }

  private async parseFileContents(
    nodes: FileNode[], 
    progress: ScanProgress
  ): Promise<FileNode[]> {
    const enrichedNodes: FileNode[] = [];
    let processedCount = 0;

    for (const node of nodes) {
      if (node.isDirectory) {
        enrichedNodes.push(node);
        continue;
      }

      try {
        if (this.shouldParseContent(node)) {
          const content = await fs.readFile(node.path, 'utf-8');
          node.content = content;

          if (this.config.options.parseAST && this.isCodeFile(node)) {
            // AST parsing would go here - for now, we'll skip it
            // node.ast = await this.parseAST(content, node.type);
          }
        }

        enrichedNodes.push(node);
        processedCount++;

        // Update progress
        progress.processedFiles = processedCount;
        progress.currentFile = node.relativePath;
        progress.progress = 30 + (processedCount / nodes.length) * 20;
        this.reportProgress(progress);

      } catch (error) {
        progress.errors.push(`Failed to parse ${node.relativePath}: ${error}`);
        enrichedNodes.push(node);
      }
    }

    return enrichedNodes;
  }

  private async analyzeRoutes(nodes: FileNode[]): Promise<RouteGraph> {
    // This would implement Next.js App Router analysis
    // For now, return empty structure
    return {
      routes: new Map(),
      routeGroups: new Map(),
      layoutHierarchy: new Map(),
      apiRoutes: [],
      dynamicRoutes: [],
      catchAllRoutes: []
    };
  }

  private async analyzeComponents(
    nodes: FileNode[], 
    dependencyGraph: DependencyGraph
  ): Promise<ComponentMap> {
    // This would implement React component analysis
    // For now, return empty structure
    return {
      components: new Map(),
      usage: new Map(),
      serverComponents: [],
      clientComponents: [],
      hybridComponents: []
    };
  }

  private buildFileHierarchy(nodes: FileNode[]): FileNode[] {
    // Build parent-child relationships
    const nodeMap = new Map<string, FileNode>();
    const rootNodes: FileNode[] = [];

    // First pass: index all nodes
    for (const node of nodes) {
      nodeMap.set(node.path, node);
    }

    // Second pass: build hierarchy
    for (const node of nodes) {
      const parentPath = path.dirname(node.path);
      const parent = nodeMap.get(parentPath);

      if (parent && parent.isDirectory) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      } else if (path.dirname(node.relativePath) === '.') {
        rootNodes.push(node);
      }
    }

    return rootNodes;
  }

  private getFileType(extension: string): FileType {
    const ext = extension.toLowerCase();
    
    switch (ext) {
      case 'ts': return FileType.TYPESCRIPT;
      case 'tsx': return FileType.TSX;
      case 'js': return FileType.JAVASCRIPT;
      case 'jsx': return FileType.JSX;
      case 'css': return FileType.CSS;
      case 'scss': return FileType.SCSS;
      case 'less': return FileType.LESS;
      case 'html': return FileType.HTML;
      case 'md': case 'mdx': return FileType.MARKDOWN;
      case 'json': return FileType.JSON;
      case 'yaml': case 'yml': return FileType.YAML;
      case 'xml': return FileType.XML;
      case 'svg': return FileType.SVG;
      case 'png': case 'jpg': case 'jpeg': case 'gif': case 'webp': return FileType.IMAGE;
      case 'woff': case 'woff2': case 'ttf': case 'eot': return FileType.FONT;
      default: return FileType.OTHER;
    }
  }

  private shouldParseContent(node: FileNode): boolean {
    if (!this.config.options.includeContent) return false;
    if (node.isDirectory) return false;
    if (node.size > 1024 * 1024) return false; // Skip files > 1MB

    const parseableTypes = [
      FileType.TYPESCRIPT,
      FileType.JAVASCRIPT,
      FileType.TSX,
      FileType.JSX,
      FileType.CSS,
      FileType.SCSS,
      FileType.HTML,
      FileType.MARKDOWN,
      FileType.JSON,
      FileType.YAML
    ];

    return parseableTypes.includes(node.type);
  }

  private isCodeFile(node: FileNode): boolean {
    return [
      FileType.TYPESCRIPT,
      FileType.JAVASCRIPT,
      FileType.TSX,
      FileType.JSX
    ].includes(node.type);
  }

  private countFiles(nodes: FileNode[]): number {
    let count = 0;
    for (const node of nodes) {
      if (!node.isDirectory) {
        count++;
      }
      if (node.children) {
        count += this.countFiles(node.children);
      }
    }
    return count;
  }

  private countDirectories(nodes: FileNode[]): number {
    let count = 0;
    for (const node of nodes) {
      if (node.isDirectory) {
        count++;
        if (node.children) {
          count += this.countDirectories(node.children);
        }
      }
    }
    return count;
  }

  private categorizeFilesByType(nodes: FileNode[]): Record<FileType, number> {
    const counts: Record<FileType, number> = {} as Record<FileType, number>;
    
    // Initialize all types to 0
    for (const type of Object.values(FileType)) {
      counts[type] = 0;
    }

    const countRecursive = (nodeList: FileNode[]) => {
      for (const node of nodeList) {
        if (!node.isDirectory) {
          counts[node.type]++;
        }
        if (node.children) {
          countRecursive(node.children);
        }
      }
    };

    countRecursive(nodes);
    return counts;
  }

  private generateNodeId(filePath: string): string {
    return Buffer.from(filePath).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
  }

  private getNodeClassName(
    node: FileNode, 
    dependencies: number, 
    dependents: number
  ): string {
    const classes: string[] = ['file-node'];
    
    classes.push(`file-type-${node.type}`);
    
    if (dependencies > 10) classes.push('high-dependencies');
    if (dependents > 5) classes.push('high-dependents');
    if (dependencies === 0 && dependents === 0) classes.push('orphaned');
    
    return classes.join(' ');
  }

  private reportProgress(progress: ScanProgress): void {
    if (this.config.onProgress) {
      this.config.onProgress(progress);
    }
  }

  private handleFileChange(
    type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir',
    filePath: string
  ): void {
    const event: FileChangeEvent = {
      type,
      path: filePath,
      timestamp: new Date()
    };

    if (this.config.onChange) {
      this.config.onChange(event);
    }

    // Optionally trigger incremental re-scan
    // This could be debounced to avoid too frequent updates
  }
}

// Utility functions
export function createDefaultScanOptions(rootPath: string): ScanOptions {
  return {
    rootPath,
    includePatterns: [
      'apps/**/*.{ts,tsx,js,jsx}',
      'libs/**/*.{ts,tsx,js,jsx}',
      'packages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'src/**/*.{ts,tsx,js,jsx}'
    ],
    excludePatterns: [
      '**/node_modules/**',
      '**/.git/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/*.d.ts',
      '**/.turbo/**'
    ],
    followSymlinks: false,
    maxDepth: 20,
    parseAST: true,
    includeContent: true,
    enableTypeChecking: true,
    enablePerformanceAnalysis: true,
    enableSecurityAnalysis: true
  };
}

export function createDefaultScannerConfig(rootPath: string): ScannerConfig {
  return {
    rootPath,
    options: createDefaultScanOptions(rootPath),
    watcherOptions: {
      debounceMs: 300,
      ignoreInitial: true,
      followSymlinks: false,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
        '**/dist/**',
        '**/build/**'
      ],
      persistent: true
    }
  };
}

// Export main class and utilities
export { DependencyAnalyzer } from './dependency-analyzer';
export { HealthMonitor } from './health-monitor';
export { AgentPromptsAnalyzer } from './agent-prompts-analyzer';
export * from './types';