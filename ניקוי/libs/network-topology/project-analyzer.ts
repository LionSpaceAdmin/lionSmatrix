/**
 * Project Structure Analyzer
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Analyzes Lions of Zion monorepo structure and creates hierarchical relationships
 */

import path from 'path';
import { FileNode, ProjectStructure, FileType } from '../file-scanner/types';
import {
  ProjectAnalysis,
  WorkspaceInfo,
  WorkspaceType,
  FileCategory,
  ProjectHierarchy,
  ProjectAnalyzerConfig
} from './types';

export class ProjectAnalyzer {
  private config: ProjectAnalyzerConfig;

  constructor(config: ProjectAnalyzerConfig) {
    this.config = config;
  }

  /**
   * Analyze the complete Lions of Zion project structure
   */
  async analyzeProject(projectStructure: ProjectStructure): Promise<ProjectAnalysis> {
    const startTime = performance.now();

    // Step 1: Detect workspace boundaries
    const workspaces = this.detectWorkspaces(projectStructure);
    
    // Step 2: Categorize all files by type and purpose
    const fileCategories = this.categorizeFiles(projectStructure);
    
    // Step 3: Build hierarchical relationships
    const hierarchy = this.buildHierarchy(projectStructure, workspaces);
    
    // Step 4: Create file mapping for quick lookups
    const fileMap = this.createFileMap(projectStructure);
    
    // Step 5: Create workspace mapping
    const workspaceMap = this.createWorkspaceMap(workspaces);

    const endTime = performance.now();

    return {
      workspaces,
      fileCategories,
      hierarchy,
      fileMap,
      workspaceMap,
      totalFiles: projectStructure.totalFiles,
      totalDirectories: projectStructure.totalDirectories,
      analysisTime: endTime - startTime,
      analyzedAt: new Date()
    };
  }

  /**
   * Detect workspace boundaries in Lions of Zion monorepo
   */
  private detectWorkspaces(projectStructure: ProjectStructure): WorkspaceInfo[] {
    const workspaces: WorkspaceInfo[] = [];
    
    // Convert Map to array for processing
    const fileNodes = Array.from(projectStructure.dependencies.nodes.values());
    
    // Define Lions of Zion workspace patterns
    const workspacePatterns = [
      { pattern: /^apps\/web/, type: WorkspaceType.APP, name: 'Web Application' },
      { pattern: /^packages\/@lionspace\/ui/, type: WorkspaceType.SHARED_UI, name: 'UI Components' },
      { pattern: /^packages\/@lionspace\/core/, type: WorkspaceType.CORE_LOGIC, name: 'Core Business Logic' },
      { pattern: /^packages\/@lionspace\/agents/, type: WorkspaceType.AGENTS, name: 'AI Agent Configurations' },
      { pattern: /^packages\/@lionspace\/mock-data/, type: WorkspaceType.MOCK_DATA, name: 'Mock Data' },
      { pattern: /^services\//, type: WorkspaceType.MICROSERVICE, name: 'Microservices' },
      { pattern: /^infrastructure\//, type: WorkspaceType.INFRASTRUCTURE, name: 'Infrastructure' },
      { pattern: /^docs\//, type: WorkspaceType.DOCUMENTATION, name: 'Documentation' },
      { pattern: /^libs\//, type: WorkspaceType.LIBRARY, name: 'Libraries' },
      { pattern: /^scripts\//, type: WorkspaceType.TOOLING, name: 'Scripts & Tooling' }
    ];

    // Detect workspaces based on directory structure
    const detectedWorkspaces = new Map<string, WorkspaceInfo>();

    fileNodes.forEach(node => {
      if (!node.isDirectory) return;

      for (const { pattern, type, name } of workspacePatterns) {
        if (pattern.test(node.relativePath)) {
          const workspaceId = this.generateWorkspaceId(node.relativePath, type);
          
          if (!detectedWorkspaces.has(workspaceId)) {
            const workspace: WorkspaceInfo = {
              id: workspaceId,
              name: this.generateWorkspaceName(node.relativePath, name),
              type,
              rootPath: node.path,
              relativePath: node.relativePath,
              files: [],
              dependencies: [],
              routes: [],
              components: [],
              packageJson: this.findPackageJson(node, fileNodes),
              tsConfig: this.findTsConfig(node, fileNodes),
              isMonorepoRoot: false
            };
            
            detectedWorkspaces.set(workspaceId, workspace);
          }
          break;
        }
      }
    });

    // Add monorepo root workspace
    const rootWorkspace: WorkspaceInfo = {
      id: 'root',
      name: 'Lions of Zion Platform (Root)',
      type: WorkspaceType.MONOREPO_ROOT,
      rootPath: projectStructure.rootPath,
      relativePath: '.',
      files: [],
      dependencies: [],
      routes: [],
      components: [],
      packageJson: this.findRootPackageJson(fileNodes),
      tsConfig: this.findRootTsConfig(fileNodes),
      isMonorepoRoot: true
    };
    
    workspaces.push(rootWorkspace);
    workspaces.push(...detectedWorkspaces.values());

    // Populate files for each workspace
    this.populateWorkspaceFiles(workspaces, fileNodes);

    return workspaces;
  }

  /**
   * Categorize files by their type and purpose in the Lions of Zion project
   */
  private categorizeFiles(projectStructure: ProjectStructure): Map<FileCategory, FileNode[]> {
    const categories = new Map<FileCategory, FileNode[]>();
    
    // Initialize categories
    Object.values(FileCategory).forEach(category => {
      categories.set(category, []);
    });

    const fileNodes = Array.from(projectStructure.dependencies.nodes.values());

    fileNodes.forEach(node => {
      if (node.isDirectory) return;

      const category = this.categorizeFile(node);
      const existingFiles = categories.get(category) || [];
      categories.set(category, [...existingFiles, node]);
    });

    return categories;
  }

  /**
   * Categorize a single file based on its path and type
   */
  private categorizeFile(node: FileNode): FileCategory {
    const relativePath = node.relativePath.toLowerCase();
    const fileName = node.name.toLowerCase();

    // Route files (Next.js App Router)
    if (relativePath.includes('/app/') && (
      fileName === 'page.tsx' || fileName === 'page.ts' ||
      fileName === 'layout.tsx' || fileName === 'layout.ts' ||
      fileName === 'loading.tsx' || fileName === 'loading.ts' ||
      fileName === 'error.tsx' || fileName === 'error.ts' ||
      fileName === 'not-found.tsx' || fileName === 'not-found.ts'
    )) {
      return FileCategory.ROUTE;
    }

    // API routes
    if (relativePath.includes('/api/') && (
      node.type === FileType.TYPESCRIPT || node.type === FileType.JAVASCRIPT
    )) {
      return FileCategory.API;
    }

    // React components
    if ((node.type === FileType.TSX || node.type === FileType.JSX) && 
        !relativePath.includes('/app/')) {
      return FileCategory.COMPONENT;
    }

    // UI components (shadcn/ui)
    if (relativePath.includes('/components/ui/') || relativePath.includes('/ui/')) {
      return FileCategory.UI_COMPONENT;
    }

    // Middleware
    if (fileName === 'middleware.ts' || fileName === 'middleware.js') {
      return FileCategory.MIDDLEWARE;
    }

    // Configuration files
    if (this.isConfigFile(fileName)) {
      return FileCategory.CONFIG;
    }

    // Test files
    if (fileName.includes('.test.') || fileName.includes('.spec.') || 
        relativePath.includes('/__tests__/') || relativePath.includes('/tests/')) {
      return FileCategory.TEST;
    }

    // Documentation
    if (node.type === FileType.MARKDOWN || relativePath.includes('/docs/')) {
      return FileCategory.DOCUMENTATION;
    }

    // Assets
    if ([FileType.IMAGE, FileType.FONT, FileType.SVG].includes(node.type)) {
      return FileCategory.ASSET;
    }

    // Styles
    if ([FileType.CSS, FileType.SCSS, FileType.LESS].includes(node.type)) {
      return FileCategory.STYLE;
    }

    // Types
    if (fileName.endsWith('.d.ts') || relativePath.includes('/types/')) {
      return FileCategory.TYPE;
    }

    // Utilities
    if (relativePath.includes('/utils/') || relativePath.includes('/lib/') ||
        relativePath.includes('/helpers/')) {
      return FileCategory.UTILITY;
    }

    // Hooks
    if (relativePath.includes('/hooks/') || fileName.startsWith('use')) {
      return FileCategory.HOOK;
    }

    // Context
    if (relativePath.includes('/context/') || fileName.includes('context')) {
      return FileCategory.CONTEXT;
    }

    // Build/tooling
    if (this.isBuildFile(fileName) || relativePath.includes('/scripts/')) {
      return FileCategory.BUILD;
    }

    // Package files
    if (fileName === 'package.json' || fileName.includes('pnpm') || 
        fileName.includes('yarn') || fileName.includes('npm')) {
      return FileCategory.PACKAGE;
    }

    // Default to source code
    if ([FileType.TYPESCRIPT, FileType.JAVASCRIPT].includes(node.type)) {
      return FileCategory.SOURCE;
    }

    return FileCategory.OTHER;
  }

  /**
   * Build hierarchical relationships in the project
   */
  private buildHierarchy(
    projectStructure: ProjectStructure, 
    workspaces: WorkspaceInfo[]
  ): ProjectHierarchy {
    const fileNodes = Array.from(projectStructure.dependencies.nodes.values());
    
    return {
      root: {
        id: 'root',
        name: 'Lions of Zion Platform',
        type: 'root',
        children: this.buildHierarchyChildren(fileNodes, projectStructure.rootPath),
        path: projectStructure.rootPath,
        relativePath: '.',
        workspace: 'root'
      },
      workspaceHierarchy: this.buildWorkspaceHierarchy(workspaces),
      routeHierarchy: this.buildRouteHierarchy(projectStructure.routes),
      componentHierarchy: this.buildComponentHierarchy(projectStructure.components)
    };
  }

  /**
   * Create file mapping for quick lookups
   */
  private createFileMap(projectStructure: ProjectStructure): Map<string, FileNode> {
    return new Map(projectStructure.dependencies.nodes);
  }

  /**
   * Create workspace mapping for quick lookups
   */
  private createWorkspaceMap(workspaces: WorkspaceInfo[]): Map<string, WorkspaceInfo> {
    const map = new Map<string, WorkspaceInfo>();
    workspaces.forEach(workspace => {
      map.set(workspace.id, workspace);
    });
    return map;
  }

  // Helper methods

  private generateWorkspaceId(relativePath: string, type: WorkspaceType): string {
    const parts = relativePath.split('/').filter(Boolean);
    return `${type}-${parts.join('-')}`.toLowerCase();
  }

  private generateWorkspaceName(relativePath: string, baseName: string): string {
    const parts = relativePath.split('/').filter(Boolean);
    if (parts.length > 1) {
      return `${baseName} (${parts[parts.length - 1]})`;
    }
    return baseName;
  }

  private findPackageJson(workspace: FileNode, fileNodes: FileNode[]): string | undefined {
    return fileNodes.find(node => 
      node.name === 'package.json' && 
      node.path.startsWith(workspace.path)
    )?.path;
  }

  private findTsConfig(workspace: FileNode, fileNodes: FileNode[]): string | undefined {
    return fileNodes.find(node => 
      node.name === 'tsconfig.json' && 
      node.path.startsWith(workspace.path)
    )?.path;
  }

  private findRootPackageJson(fileNodes: FileNode[]): string | undefined {
    return fileNodes.find(node => 
      node.name === 'package.json' && 
      node.depth === 0
    )?.path;
  }

  private findRootTsConfig(fileNodes: FileNode[]): string | undefined {
    return fileNodes.find(node => 
      node.name === 'tsconfig.json' && 
      node.depth === 0
    )?.path;
  }

  private populateWorkspaceFiles(workspaces: WorkspaceInfo[], fileNodes: FileNode[]): void {
    fileNodes.forEach(node => {
      const workspace = workspaces.find(ws => 
        ws.rootPath === node.path || node.path.startsWith(ws.rootPath + '/')
      );
      
      if (workspace) {
        workspace.files.push(node.path);
      }
    });
  }

  private isConfigFile(fileName: string): boolean {
    const configPatterns = [
      'tsconfig', 'eslint', 'prettier', 'babel', 'webpack', 'vite', 'turbo',
      'next.config', 'tailwind.config', 'postcss.config', '.env', 'docker',
      'vercel.json', 'netlify', 'gitignore', 'gitattributes'
    ];
    
    return configPatterns.some(pattern => fileName.includes(pattern));
  }

  private isBuildFile(fileName: string): boolean {
    const buildPatterns = [
      'build', 'dist', 'deploy', 'release', 'publish', 'bundle',
      'Dockerfile', 'docker-compose', 'makefile', 'gulpfile', 'gruntfile'
    ];
    
    return buildPatterns.some(pattern => fileName.toLowerCase().includes(pattern));
  }

  private buildHierarchyChildren(fileNodes: FileNode[], basePath: string): any[] {
    // Implementation for building hierarchy children
    // This would recursively build the file tree structure
    return [];
  }

  private buildWorkspaceHierarchy(workspaces: WorkspaceInfo[]): any {
    // Implementation for building workspace hierarchy
    return {};
  }

  private buildRouteHierarchy(routes: any): any {
    // Implementation for building route hierarchy
    return {};
  }

  private buildComponentHierarchy(components: any): any {
    // Implementation for building component hierarchy
    return {};
  }
}