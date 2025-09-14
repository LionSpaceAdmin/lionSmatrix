/**
 * Route Analyzer - Next.js App Router
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Comprehensive analysis of Next.js 15 App Router structure with route groups and relationships
 */

import path from 'path';
import { RouteGraph, RouteNode, RouteType, FileNode } from '../file-scanner/types';
import {
  RouteTopology,
  RouteAnalysis,
  RouteGroup,
  RouteRelationship,
  LayoutHierarchy,
  RouteMetrics,
  RoutePattern,
  RouteAnalyzerConfig,
  NavigationFlow,
  ProtectionLevel
} from './types';

export class RouteAnalyzer {
  private config: RouteAnalyzerConfig;

  constructor(config: RouteAnalyzerConfig) {
    this.config = config;
  }

  /**
   * Analyze Next.js App Router structure and create route topology
   */
  async analyzeRoutes(
    routeGraph: RouteGraph,
    fileMap: Map<string, FileNode>
  ): Promise<RouteTopology> {
    const startTime = performance.now();

    // Step 1: Identify and analyze route groups
    const routeGroups = this.analyzeRouteGroups(routeGraph, fileMap);

    // Step 2: Build layout hierarchy
    const layoutHierarchy = this.buildLayoutHierarchy(routeGraph, fileMap);

    // Step 3: Analyze route relationships and navigation flows
    const routeRelationships = this.analyzeRouteRelationships(routeGraph, fileMap);

    // Step 4: Identify route patterns
    const routePatterns = this.identifyRoutePatterns(routeGraph);

    // Step 5: Analyze navigation flows
    const navigationFlows = this.analyzeNavigationFlows(routeGraph, fileMap);

    // Step 6: Calculate route metrics
    const metrics = this.calculateRouteMetrics(routeGraph, routeGroups);

    // Step 7: Analyze route protection levels
    const protectionAnalysis = this.analyzeRouteProtection(routeGraph, fileMap);

    const endTime = performance.now();

    return {
      routeGroups,
      layoutHierarchy,
      routeRelationships,
      routePatterns,
      navigationFlows,
      protectionAnalysis,
      metrics,
      totalRoutes: routeGraph.routes.size,
      analysisTime: endTime - startTime,
      analyzedAt: new Date()
    };
  }

  /**
   * Analyze Lions of Zion route groups: (public), (auth), (dashboard), etc.
   */
  private analyzeRouteGroups(
    routeGraph: RouteGraph,
    fileMap: Map<string, FileNode>
  ): RouteGroup[] {
    const groups: RouteGroup[] = [];
    
    // Define Lions of Zion route groups based on CLAUDE.md
    const lionspaceRouteGroups = [
      {
        pattern: /\/app\/\(public\)/,
        name: 'Public Pages',
        id: 'public',
        description: 'Publicly accessible pages',
        protection: ProtectionLevel.PUBLIC
      },
      {
        pattern: /\/app\/\(auth\)/,
        name: 'Authentication',
        id: 'auth',
        description: 'Authentication and authorization flows',
        protection: ProtectionLevel.UNAUTHENTICATED
      },
      {
        pattern: /\/app\/\(dashboard\)/,
        name: 'Dashboard',
        id: 'dashboard',
        description: 'Protected dashboard interface',
        protection: ProtectionLevel.AUTHENTICATED
      },
      {
        pattern: /\/app\/\(academy\)/,
        name: 'Knowledge Base',
        id: 'academy',
        description: 'Educational content and resources',
        protection: ProtectionLevel.PUBLIC
      },
      {
        pattern: /\/app\/\(trust\)/,
        name: 'Trust Center',
        id: 'trust',
        description: 'Trust and security information',
        protection: ProtectionLevel.PUBLIC
      },
      {
        pattern: /\/app\/\(enterprise\)/,
        name: 'Enterprise Features',
        id: 'enterprise',
        description: 'Enterprise-specific functionality',
        protection: ProtectionLevel.ROLE_BASED
      }
    ];

    // Analyze each route group
    for (const groupDef of lionspaceRouteGroups) {
      const routes = Array.from(routeGraph.routes.values())
        .filter(route => groupDef.pattern.test(route.path));

      if (routes.length > 0) {
        const groupRoutes = routes.map(route => route.path);
        const layouts = this.findGroupLayouts(groupRoutes, routeGraph, fileMap);
        const pages = this.findGroupPages(groupRoutes, routeGraph, fileMap);
        const apiRoutes = this.findGroupApiRoutes(groupRoutes, routeGraph);

        groups.push({
          id: groupDef.id,
          name: groupDef.name,
          description: groupDef.description,
          pattern: groupDef.pattern.source,
          routes: groupRoutes,
          layouts,
          pages,
          apiRoutes,
          protection: groupDef.protection,
          middleware: this.findGroupMiddleware(groupRoutes, fileMap),
          metadata: this.extractGroupMetadata(routes, fileMap)
        });
      }
    }

    // Add ungrouped routes
    const allGroupedRoutes = new Set(
      groups.flatMap(group => group.routes)
    );
    
    const ungroupedRoutes = Array.from(routeGraph.routes.values())
      .filter(route => !allGroupedRoutes.has(route.path))
      .map(route => route.path);

    if (ungroupedRoutes.length > 0) {
      groups.push({
        id: 'ungrouped',
        name: 'Ungrouped Routes',
        description: 'Routes not belonging to any specific group',
        pattern: '.*',
        routes: ungroupedRoutes,
        layouts: this.findGroupLayouts(ungroupedRoutes, routeGraph, fileMap),
        pages: this.findGroupPages(ungroupedRoutes, routeGraph, fileMap),
        apiRoutes: this.findGroupApiRoutes(ungroupedRoutes, routeGraph),
        protection: ProtectionLevel.UNKNOWN,
        middleware: [],
        metadata: {}
      });
    }

    return groups;
  }

  /**
   * Build comprehensive layout hierarchy
   */
  private buildLayoutHierarchy(
    routeGraph: RouteGraph,
    fileMap: Map<string, FileNode>
  ): LayoutHierarchy {
    const hierarchy: LayoutHierarchy = {
      rootLayout: null,
      groupLayouts: [],
      nestedLayouts: [],
      layoutInheritance: new Map()
    };

    // Find root layout
    const rootLayoutPath = this.findRootLayout(routeGraph, fileMap);
    if (rootLayoutPath) {
      hierarchy.rootLayout = {
        path: rootLayoutPath,
        file: fileMap.get(rootLayoutPath),
        appliesTo: Array.from(routeGraph.routes.keys()),
        metadata: this.extractLayoutMetadata(rootLayoutPath, fileMap)
      };
    }

    // Find group layouts
    for (const [groupId, routePaths] of routeGraph.routeGroups) {
      const layoutPath = this.findGroupLayout(routePaths, routeGraph, fileMap);
      if (layoutPath) {
        hierarchy.groupLayouts.push({
          groupId,
          path: layoutPath,
          file: fileMap.get(layoutPath),
          appliesTo: routePaths,
          metadata: this.extractLayoutMetadata(layoutPath, fileMap)
        });
      }
    }

    // Build inheritance map
    this.buildLayoutInheritanceMap(hierarchy, routeGraph);

    return hierarchy;
  }

  /**
   * Analyze relationships between routes
   */
  private analyzeRouteRelationships(
    routeGraph: RouteGraph,
    fileMap: Map<string, FileNode>
  ): RouteRelationship[] {
    const relationships: RouteRelationship[] = [];

    for (const [routePath, routeNode] of routeGraph.routes) {
      // Parent-child relationships
      if (routeNode.parentRoute) {
        relationships.push({
          id: `parent-${routePath}`,
          type: 'parent-child',
          source: routeNode.parentRoute,
          target: routePath,
          strength: 1.0,
          description: 'Parent-child route relationship'
        });
      }

      // Sibling relationships
      routeNode.childRoutes.forEach((childRoute, index) => {
        routeNode.childRoutes.slice(index + 1).forEach(siblingRoute => {
          relationships.push({
            id: `sibling-${childRoute}-${siblingRoute}`,
            type: 'sibling',
            source: childRoute,
            target: siblingRoute,
            strength: 0.5,
            description: 'Sibling routes under same parent'
          });
        });
      });

      // Navigation relationships (found in code)
      const navigationRefs = this.findNavigationReferences(routePath, fileMap);
      navigationRefs.forEach(ref => {
        relationships.push({
          id: `nav-${routePath}-${ref}`,
          type: 'navigation',
          source: routePath,
          target: ref,
          strength: 0.7,
          description: 'Navigation reference in code'
        });
      });

      // API relationships
      const apiRefs = this.findApiReferences(routePath, fileMap);
      apiRefs.forEach(ref => {
        relationships.push({
          id: `api-${routePath}-${ref}`,
          type: 'api-call',
          source: routePath,
          target: ref,
          strength: 0.8,
          description: 'API endpoint reference'
        });
      });
    }

    return relationships;
  }

  /**
   * Identify common route patterns
   */
  private identifyRoutePatterns(routeGraph: RouteGraph): RoutePattern[] {
    const patterns: RoutePattern[] = [];

    // Dynamic route patterns
    const dynamicRoutes = routeGraph.dynamicRoutes;
    const dynamicPatterns = this.groupDynamicRoutes(dynamicRoutes);
    patterns.push(...dynamicPatterns);

    // Catch-all route patterns
    const catchAllRoutes = routeGraph.catchAllRoutes;
    const catchAllPatterns = this.groupCatchAllRoutes(catchAllRoutes);
    patterns.push(...catchAllPatterns);

    // API route patterns
    const apiPatterns = this.analyzeApiRoutePatterns(routeGraph.apiRoutes);
    patterns.push(...apiPatterns);

    // CRUD patterns
    const crudPatterns = this.identifyCRUDPatterns(routeGraph);
    patterns.push(...crudPatterns);

    return patterns;
  }

  /**
   * Analyze navigation flows through the application
   */
  private analyzeNavigationFlows(
    routeGraph: RouteGraph,
    fileMap: Map<string, FileNode>
  ): NavigationFlow[] {
    const flows: NavigationFlow[] = [];

    // Authentication flow
    const authFlow = this.analyzeAuthenticationFlow(routeGraph, fileMap);
    if (authFlow) flows.push(authFlow);

    // Onboarding flow
    const onboardingFlow = this.analyzeOnboardingFlow(routeGraph, fileMap);
    if (onboardingFlow) flows.push(onboardingFlow);

    // Dashboard navigation flow
    const dashboardFlow = this.analyzeDashboardFlow(routeGraph, fileMap);
    if (dashboardFlow) flows.push(dashboardFlow);

    // User journey flows
    const userJourneys = this.analyzeUserJourneys(routeGraph, fileMap);
    flows.push(...userJourneys);

    return flows;
  }

  /**
   * Calculate comprehensive route metrics
   */
  private calculateRouteMetrics(
    routeGraph: RouteGraph,
    routeGroups: RouteGroup[]
  ): RouteMetrics {
    const totalRoutes = routeGraph.routes.size;
    const dynamicRoutes = routeGraph.dynamicRoutes.length;
    const staticRoutes = totalRoutes - dynamicRoutes;
    const apiRoutes = routeGraph.apiRoutes.length;

    // Calculate depth metrics
    const routeDepths = Array.from(routeGraph.routes.values())
      .map(route => route.route.split('/').filter(Boolean).length);
    
    const avgDepth = routeDepths.length > 0 
      ? routeDepths.reduce((a, b) => a + b, 0) / routeDepths.length 
      : 0;
    const maxDepth = Math.max(...routeDepths, 0);

    // Calculate group distribution
    const groupDistribution = routeGroups.reduce((acc, group) => {
      acc[group.id] = group.routes.length;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRoutes,
      staticRoutes,
      dynamicRoutes,
      apiRoutes,
      avgDepth,
      maxDepth,
      groupDistribution,
      complexityScore: this.calculateRouteComplexity(routeGraph)
    };
  }

  /**
   * Analyze route protection levels and middleware
   */
  private analyzeRouteProtection(
    routeGraph: RouteGraph,
    fileMap: Map<string, FileNode>
  ): Map<string, ProtectionLevel> {
    const protection = new Map<string, ProtectionLevel>();

    for (const [routePath, routeNode] of routeGraph.routes) {
      const protectionLevel = this.determineProtectionLevel(routePath, routeNode, fileMap);
      protection.set(routePath, protectionLevel);
    }

    return protection;
  }

  // Helper methods

  private findGroupLayouts(
    routes: string[],
    routeGraph: RouteGraph,
    fileMap: Map<string, FileNode>
  ): string[] {
    const layouts: string[] = [];
    
    for (const route of routes) {
      const layoutPath = route.replace(/(page|layout)\.tsx?$/, 'layout.tsx');
      if (fileMap.has(layoutPath)) {
        layouts.push(layoutPath);
      }
    }

    return [...new Set(layouts)];
  }

  private findGroupPages(
    routes: string[],
    routeGraph: RouteGraph,
    fileMap: Map<string, FileNode>
  ): string[] {
    return routes.filter(route => {
      const routeNode = routeGraph.routes.get(route);
      return routeNode?.isPageFile;
    });
  }

  private findGroupApiRoutes(routes: string[], routeGraph: RouteGraph): string[] {
    return routes.filter(route => {
      const routeNode = routeGraph.routes.get(route);
      return routeNode?.isApiRoute;
    });
  }

  private findGroupMiddleware(routes: string[], fileMap: Map<string, FileNode>): string[] {
    const middleware: string[] = [];
    
    // Look for middleware.ts files in route directories
    for (const route of routes) {
      const dir = path.dirname(route);
      const middlewarePath = path.join(dir, 'middleware.ts');
      if (fileMap.has(middlewarePath)) {
        middleware.push(middlewarePath);
      }
    }

    return middleware;
  }

  private extractGroupMetadata(routes: any[], fileMap: Map<string, FileNode>): Record<string, any> {
    // Extract common metadata from routes in this group
    return {};
  }

  private findRootLayout(routeGraph: RouteGraph, fileMap: Map<string, FileNode>): string | null {
    // Look for app/layout.tsx
    const possiblePaths = [
      'app/layout.tsx',
      'app/layout.ts',
      'src/app/layout.tsx',
      'src/app/layout.ts'
    ];

    for (const path of possiblePaths) {
      if (fileMap.has(path)) {
        return path;
      }
    }

    return null;
  }

  private findGroupLayout(
    routePaths: string[],
    routeGraph: RouteGraph,
    fileMap: Map<string, FileNode>
  ): string | null {
    // Find layout.tsx in the group directory
    for (const route of routePaths) {
      const dir = path.dirname(route);
      const layoutPath = path.join(dir, 'layout.tsx');
      if (fileMap.has(layoutPath)) {
        return layoutPath;
      }
    }
    return null;
  }

  private extractLayoutMetadata(layoutPath: string, fileMap: Map<string, FileNode>): Record<string, any> {
    const file = fileMap.get(layoutPath);
    if (!file?.content) return {};

    // Extract metadata from layout file content
    const metadata: Record<string, any> = {};
    
    // Look for export const metadata
    const metadataMatch = file.content.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?});/);
    if (metadataMatch) {
      try {
        // This is a simplified extraction - in practice, you'd want proper AST parsing
        metadata.hasMetadata = true;
      } catch (error) {
        // Ignore parsing errors
      }
    }

    return metadata;
  }

  private buildLayoutInheritanceMap(hierarchy: LayoutHierarchy, routeGraph: RouteGraph): void {
    // Build map of which layouts apply to which routes
    for (const [routePath] of routeGraph.routes) {
      const inheritedLayouts: string[] = [];
      
      if (hierarchy.rootLayout) {
        inheritedLayouts.push(hierarchy.rootLayout.path);
      }

      // Find applicable group layouts
      const applicableGroupLayouts = hierarchy.groupLayouts.filter(groupLayout =>
        groupLayout.appliesTo.includes(routePath)
      );
      inheritedLayouts.push(...applicableGroupLayouts.map(gl => gl.path));

      hierarchy.layoutInheritance.set(routePath, inheritedLayouts);
    }
  }

  private findNavigationReferences(routePath: string, fileMap: Map<string, FileNode>): string[] {
    const file = fileMap.get(routePath);
    if (!file?.content) return [];

    const references: string[] = [];
    
    // Look for Link components and router.push calls
    const linkPattern = /<Link\s+href=["']([^"']+)["']/g;
    const routerPattern = /router\.push\(["']([^"']+)["']\)/g;
    const useRouterPattern = /navigate\(["']([^"']+)["']\)/g;

    let match;
    while ((match = linkPattern.exec(file.content)) !== null) {
      references.push(match[1]);
    }
    while ((match = routerPattern.exec(file.content)) !== null) {
      references.push(match[1]);
    }
    while ((match = useRouterPattern.exec(file.content)) !== null) {
      references.push(match[1]);
    }

    return references;
  }

  private findApiReferences(routePath: string, fileMap: Map<string, FileNode>): string[] {
    const file = fileMap.get(routePath);
    if (!file?.content) return [];

    const references: string[] = [];
    
    // Look for fetch calls and API references
    const fetchPattern = /fetch\(["']([^"']+)["']/g;
    const apiPattern = /["']\/api\/([^"']+)["']/g;

    let match;
    while ((match = fetchPattern.exec(file.content)) !== null) {
      if (match[1].startsWith('/api/')) {
        references.push(match[1]);
      }
    }
    while ((match = apiPattern.exec(file.content)) !== null) {
      references.push(`/api/${match[1]}`);
    }

    return references;
  }

  private groupDynamicRoutes(dynamicRoutes: string[]): RoutePattern[] {
    // Group dynamic routes by pattern
    const patterns: RoutePattern[] = [];
    const groups = new Map<string, string[]>();

    for (const route of dynamicRoutes) {
      const pattern = route.replace(/\[.*?\]/g, '[param]');
      if (!groups.has(pattern)) {
        groups.set(pattern, []);
      }
      groups.get(pattern)!.push(route);
    }

    for (const [pattern, routes] of groups) {
      patterns.push({
        id: `dynamic-${pattern.replace(/[^a-z0-9]/gi, '-')}`,
        type: 'dynamic',
        pattern,
        routes,
        description: `Dynamic routes following pattern: ${pattern}`
      });
    }

    return patterns;
  }

  private groupCatchAllRoutes(catchAllRoutes: string[]): RoutePattern[] {
    return [{
      id: 'catch-all',
      type: 'catch-all',
      pattern: '[...slug]',
      routes: catchAllRoutes,
      description: 'Catch-all routes'
    }];
  }

  private analyzeApiRoutePatterns(apiRoutes: string[]): RoutePattern[] {
    // Analyze API route patterns
    return [];
  }

  private identifyCRUDPatterns(routeGraph: RouteGraph): RoutePattern[] {
    // Identify CRUD operation patterns
    return [];
  }

  private analyzeAuthenticationFlow(routeGraph: RouteGraph, fileMap: Map<string, FileNode>): NavigationFlow | null {
    // Analyze authentication flow
    return null;
  }

  private analyzeOnboardingFlow(routeGraph: RouteGraph, fileMap: Map<string, FileNode>): NavigationFlow | null {
    // Analyze onboarding flow
    return null;
  }

  private analyzeDashboardFlow(routeGraph: RouteGraph, fileMap: Map<string, FileNode>): NavigationFlow | null {
    // Analyze dashboard navigation flow
    return null;
  }

  private analyzeUserJourneys(routeGraph: RouteGraph, fileMap: Map<string, FileNode>): NavigationFlow[] {
    // Analyze user journey flows
    return [];
  }

  private calculateRouteComplexity(routeGraph: RouteGraph): number {
    const totalRoutes = routeGraph.routes.size;
    const dynamicRoutes = routeGraph.dynamicRoutes.length;
    const apiRoutes = routeGraph.apiRoutes.length;
    
    // Simple complexity calculation
    return Math.min(100, totalRoutes * 0.5 + dynamicRoutes * 2 + apiRoutes * 1.5);
  }

  private determineProtectionLevel(
    routePath: string,
    routeNode: any,
    fileMap: Map<string, FileNode>
  ): ProtectionLevel {
    // Determine protection level based on route group and middleware
    if (routePath.includes('(auth)')) return ProtectionLevel.UNAUTHENTICATED;
    if (routePath.includes('(dashboard)')) return ProtectionLevel.AUTHENTICATED;
    if (routePath.includes('(enterprise)')) return ProtectionLevel.ROLE_BASED;
    if (routePath.includes('(public)') || routePath.includes('(academy)') || routePath.includes('(trust)')) {
      return ProtectionLevel.PUBLIC;
    }
    
    return ProtectionLevel.UNKNOWN;
  }
}