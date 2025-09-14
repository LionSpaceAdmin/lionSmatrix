/**
 * Component Analyzer - React Component Hierarchy
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Analyzes React component hierarchy, usage patterns, and server/client component relationships
 */

import path from 'path';
import { ComponentMap, ComponentInfo, ComponentUsage, FileNode } from '../file-scanner/types';
import {
  ComponentTopology,
  ComponentAnalysis,
  ComponentHierarchy,
  ComponentCluster,
  ComponentRelationship,
  PropFlowAnalysis,
  ContextUsageAnalysis,
  ComponentMetrics,
  ComponentAnalyzerConfig,
  ComponentPattern,
  UIComponentMapping,
  HookUsageAnalysis
} from './types';

export class ComponentAnalyzer {
  private config: ComponentAnalyzerConfig;

  constructor(config: ComponentAnalyzerConfig) {
    this.config = config;
  }

  /**
   * Analyze React component hierarchy and relationships
   */
  async analyzeComponents(
    componentMap: ComponentMap,
    componentDependencies: any[]
  ): Promise<ComponentTopology> {
    const startTime = performance.now();

    // Step 1: Build component hierarchy
    const hierarchy = this.buildComponentHierarchy(componentMap);

    // Step 2: Identify component clusters and patterns
    const clusters = this.identifyComponentClusters(componentMap);
    const patterns = this.identifyComponentPatterns(componentMap);

    // Step 3: Analyze component relationships
    const relationships = this.analyzeComponentRelationships(componentMap, componentDependencies);

    // Step 4: Analyze prop flow and data flow
    const propFlowAnalysis = this.analyzePropFlow(componentMap);

    // Step 5: Analyze context usage
    const contextUsage = this.analyzeContextUsage(componentMap);

    // Step 6: Analyze hook usage patterns
    const hookUsage = this.analyzeHookUsage(componentMap);

    // Step 7: Map UI component library usage (shadcn/ui)
    const uiComponentMapping = this.mapUIComponents(componentMap);

    // Step 8: Calculate component metrics
    const metrics = this.calculateComponentMetrics(componentMap, relationships);

    const endTime = performance.now();

    return {
      hierarchy,
      clusters,
      patterns,
      relationships,
      propFlowAnalysis,
      contextUsage,
      hookUsage,
      uiComponentMapping,
      metrics,
      serverClientAnalysis: this.analyzeServerClientSplit(componentMap),
      totalComponents: componentMap.components.size,
      analysisTime: endTime - startTime,
      analyzedAt: new Date()
    };
  }

  /**
   * Build comprehensive component hierarchy
   */
  private buildComponentHierarchy(componentMap: ComponentMap): ComponentHierarchy {
    const hierarchy: ComponentHierarchy = {
      roots: [],
      levels: new Map(),
      parentChildMap: new Map(),
      childParentMap: new Map(),
      leafComponents: [],
      maxDepth: 0
    };

    // Build parent-child relationships based on component usage
    for (const [componentPath, componentInfo] of componentMap.components) {
      const usages = componentMap.usage.get(componentPath) || [];
      
      usages.forEach(usage => {
        // Parent uses this component
        const parentPath = usage.usedInFile;
        
        if (!hierarchy.parentChildMap.has(parentPath)) {
          hierarchy.parentChildMap.set(parentPath, []);
        }
        hierarchy.parentChildMap.get(parentPath)!.push(componentPath);
        
        if (!hierarchy.childParentMap.has(componentPath)) {
          hierarchy.childParentMap.set(componentPath, []);
        }
        hierarchy.childParentMap.get(componentPath)!.push(parentPath);
      });
    }

    // Identify root components (components not used by others)
    const usedComponents = new Set<string>();
    for (const usages of componentMap.usage.values()) {
      usages.forEach(usage => usedComponents.add(usage.componentName));
    }

    hierarchy.roots = Array.from(componentMap.components.keys())
      .filter(componentPath => !usedComponents.has(componentPath));

    // Calculate levels and depth
    this.calculateComponentLevels(hierarchy);

    // Identify leaf components (components that don't use others)
    hierarchy.leafComponents = Array.from(componentMap.components.keys())
      .filter(componentPath => !hierarchy.parentChildMap.has(componentPath) || 
                              hierarchy.parentChildMap.get(componentPath)!.length === 0);

    return hierarchy;
  }

  /**
   * Identify component clusters based on usage patterns and location
   */
  private identifyComponentClusters(componentMap: ComponentMap): ComponentCluster[] {
    const clusters: ComponentCluster[] = [];

    // Cluster 1: UI Components (shadcn/ui and custom UI)
    const uiComponents = this.identifyUIComponents(componentMap);
    if (uiComponents.length > 0) {
      clusters.push({
        id: 'ui-components',
        name: 'UI Components',
        type: 'ui',
        components: uiComponents,
        description: 'Reusable UI components including shadcn/ui',
        cohesion: this.calculateClusterCohesion(uiComponents, componentMap),
        coupling: this.calculateClusterCoupling(uiComponents, componentMap)
      });
    }

    // Cluster 2: Layout Components
    const layoutComponents = this.identifyLayoutComponents(componentMap);
    if (layoutComponents.length > 0) {
      clusters.push({
        id: 'layout-components',
        name: 'Layout Components',
        type: 'layout',
        components: layoutComponents,
        description: 'Layout and structural components',
        cohesion: this.calculateClusterCohesion(layoutComponents, componentMap),
        coupling: this.calculateClusterCoupling(layoutComponents, componentMap)
      });
    }

    // Cluster 3: Page Components
    const pageComponents = this.identifyPageComponents(componentMap);
    if (pageComponents.length > 0) {
      clusters.push({
        id: 'page-components',
        name: 'Page Components',
        type: 'page',
        components: pageComponents,
        description: 'Top-level page components',
        cohesion: this.calculateClusterCohesion(pageComponents, componentMap),
        coupling: this.calculateClusterCoupling(pageComponents, componentMap)
      });
    }

    // Cluster 4: Feature-specific clusters
    const featureClusters = this.identifyFeatureClusters(componentMap);
    clusters.push(...featureClusters);

    return clusters;
  }

  /**
   * Identify common component patterns
   */
  private identifyComponentPatterns(componentMap: ComponentMap): ComponentPattern[] {
    const patterns: ComponentPattern[] = [];

    // Pattern 1: Container/Presentation pattern
    const containerPresentationPairs = this.identifyContainerPresentationPattern(componentMap);
    if (containerPresentationPairs.length > 0) {
      patterns.push({
        id: 'container-presentation',
        name: 'Container/Presentation Pattern',
        type: 'architectural',
        components: containerPresentationPairs.flat(),
        description: 'Components following container/presentation pattern',
        examples: containerPresentationPairs.slice(0, 3)
      });
    }

    // Pattern 2: Compound Components
    const compoundComponents = this.identifyCompoundComponents(componentMap);
    if (compoundComponents.length > 0) {
      patterns.push({
        id: 'compound-components',
        name: 'Compound Components',
        type: 'composition',
        components: compoundComponents,
        description: 'Components with sub-components for flexible composition',
        examples: compoundComponents.slice(0, 3)
      });
    }

    // Pattern 3: Higher-Order Components (HOCs)
    const hocs = this.identifyHOCs(componentMap);
    if (hocs.length > 0) {
      patterns.push({
        id: 'higher-order-components',
        name: 'Higher-Order Components',
        type: 'enhancement',
        components: hocs,
        description: 'Components that enhance other components',
        examples: hocs.slice(0, 3)
      });
    }

    // Pattern 4: Render Props
    const renderPropComponents = this.identifyRenderPropComponents(componentMap);
    if (renderPropComponents.length > 0) {
      patterns.push({
        id: 'render-props',
        name: 'Render Props Pattern',
        type: 'data-sharing',
        components: renderPropComponents,
        description: 'Components using render props for data sharing',
        examples: renderPropComponents.slice(0, 3)
      });
    }

    return patterns;
  }

  /**
   * Analyze relationships between components
   */
  private analyzeComponentRelationships(
    componentMap: ComponentMap,
    componentDependencies: any[]
  ): ComponentRelationship[] {
    const relationships: ComponentRelationship[] = [];

    // Usage relationships
    for (const [componentPath, usages] of componentMap.usage) {
      usages.forEach(usage => {
        relationships.push({
          id: `usage-${componentPath}-${usage.usedInFile}`,
          type: 'usage',
          source: usage.usedInFile,
          target: componentPath,
          strength: this.calculateUsageStrength(usage),
          metadata: {
            line: usage.line,
            props: usage.props,
            isServerComponent: usage.isServerComponent,
            isClientComponent: usage.isClientComponent
          }
        });
      });
    }

    // Composition relationships
    const compositionRels = this.identifyCompositionRelationships(componentMap);
    relationships.push(...compositionRels);

    // Data flow relationships
    const dataFlowRels = this.identifyDataFlowRelationships(componentMap);
    relationships.push(...dataFlowRels);

    return relationships;
  }

  /**
   * Analyze prop flow and data flow patterns
   */
  private analyzePropFlow(componentMap: ComponentMap): PropFlowAnalysis {
    const propChains: string[][] = [];
    const propDrilling: Array<{ component: string; depth: number; props: string[] }> = [];
    const dataTransformations: Array<{ component: string; transforms: string[] }> = [];

    // Analyze prop drilling patterns
    for (const [componentPath, componentInfo] of componentMap.components) {
      const propDrillingDepth = this.calculatePropDrillingDepth(componentPath, componentMap);
      if (propDrillingDepth > 3) { // Threshold for prop drilling
        propDrilling.push({
          component: componentPath,
          depth: propDrillingDepth,
          props: componentInfo.props.map(p => p.name)
        });
      }
    }

    return {
      propChains,
      propDrilling,
      dataTransformations,
      complexDataFlows: this.identifyComplexDataFlows(componentMap)
    };
  }

  /**
   * Analyze React Context usage patterns
   */
  private analyzeContextUsage(componentMap: ComponentMap): ContextUsageAnalysis {
    const contextProviders: string[] = [];
    const contextConsumers: string[] = [];
    const contextBoundaries: Array<{ provider: string; consumers: string[] }> = [];

    // Identify context providers and consumers
    for (const [componentPath, componentInfo] of componentMap.components) {
      if (this.isContextProvider(componentInfo)) {
        contextProviders.push(componentPath);
      }
      if (this.isContextConsumer(componentInfo)) {
        contextConsumers.push(componentPath);
      }
    }

    // Map context boundaries
    contextProviders.forEach(provider => {
      const consumers = this.findContextConsumers(provider, componentMap);
      if (consumers.length > 0) {
        contextBoundaries.push({ provider, consumers });
      }
    });

    return {
      contextProviders,
      contextConsumers,
      contextBoundaries,
      overusedContexts: this.identifyOverusedContexts(contextBoundaries)
    };
  }

  /**
   * Analyze custom hook usage patterns
   */
  private analyzeHookUsage(componentMap: ComponentMap): HookUsageAnalysis {
    const customHooks: string[] = [];
    const hookUsageByComponent = new Map<string, string[]>();
    const mostUsedHooks: Array<{ hook: string; usageCount: number }> = [];

    // Identify custom hooks and their usage
    for (const [componentPath, componentInfo] of componentMap.components) {
      const hooks = this.extractHookUsage(componentInfo);
      if (hooks.length > 0) {
        hookUsageByComponent.set(componentPath, hooks);
      }

      if (this.isCustomHook(componentInfo)) {
        customHooks.push(componentPath);
      }
    }

    // Calculate most used hooks
    const hookCounts = new Map<string, number>();
    for (const hooks of hookUsageByComponent.values()) {
      hooks.forEach(hook => {
        hookCounts.set(hook, (hookCounts.get(hook) || 0) + 1);
      });
    }

    for (const [hook, count] of hookCounts) {
      mostUsedHooks.push({ hook, usageCount: count });
    }
    mostUsedHooks.sort((a, b) => b.usageCount - a.usageCount);

    return {
      customHooks,
      hookUsageByComponent,
      mostUsedHooks: mostUsedHooks.slice(0, 10),
      hookPatterns: this.identifyHookPatterns(hookUsageByComponent)
    };
  }

  /**
   * Map UI component library usage (shadcn/ui, etc.)
   */
  private mapUIComponents(componentMap: ComponentMap): UIComponentMapping {
    const shadcnComponents: string[] = [];
    const customUIComponents: string[] = [];
    const thirdPartyComponents: string[] = [];

    for (const [componentPath, componentInfo] of componentMap.components) {
      if (this.isShadcnComponent(componentPath)) {
        shadcnComponents.push(componentPath);
      } else if (this.isCustomUIComponent(componentPath)) {
        customUIComponents.push(componentPath);
      } else if (this.isThirdPartyUIComponent(componentInfo)) {
        thirdPartyComponents.push(componentPath);
      }
    }

    return {
      shadcnComponents,
      customUIComponents,
      thirdPartyComponents,
      uiComponentUsage: this.calculateUIComponentUsage(componentMap),
      designSystemCoverage: this.calculateDesignSystemCoverage(shadcnComponents, customUIComponents)
    };
  }

  /**
   * Calculate comprehensive component metrics
   */
  private calculateComponentMetrics(
    componentMap: ComponentMap,
    relationships: ComponentRelationship[]
  ): ComponentMetrics {
    const totalComponents = componentMap.components.size;
    const serverComponents = componentMap.serverComponents.length;
    const clientComponents = componentMap.clientComponents.length;
    const hybridComponents = componentMap.hybridComponents.length;

    // Calculate reusability metrics
    const usageCounts = Array.from(componentMap.usage.values())
      .map(usages => usages.length);
    const avgReusability = usageCounts.length > 0 
      ? usageCounts.reduce((a, b) => a + b, 0) / usageCounts.length 
      : 0;

    // Calculate complexity metrics
    const complexityScores = Array.from(componentMap.components.values())
      .map(component => this.calculateComponentComplexity(component));
    const avgComplexity = complexityScores.length > 0
      ? complexityScores.reduce((a, b) => a + b, 0) / complexityScores.length
      : 0;

    return {
      totalComponents,
      serverComponents,
      clientComponents,
      hybridComponents,
      avgReusability,
      avgComplexity,
      mostReusedComponents: this.findMostReusedComponents(componentMap),
      leastUsedComponents: this.findLeastUsedComponents(componentMap),
      componentsByType: this.categorizeComponentsByType(componentMap)
    };
  }

  /**
   * Analyze server/client component split
   */
  private analyzeServerClientSplit(componentMap: ComponentMap): {
    serverComponentRatio: number;
    clientComponentRatio: number;
    hybridComponentRatio: number;
    recommendations: string[];
  } {
    const total = componentMap.components.size;
    const serverRatio = componentMap.serverComponents.length / total;
    const clientRatio = componentMap.clientComponents.length / total;
    const hybridRatio = componentMap.hybridComponents.length / total;

    const recommendations: string[] = [];
    
    if (clientRatio > 0.6) {
      recommendations.push('Consider converting more components to server components for better performance');
    }
    if (hybridRatio > 0.3) {
      recommendations.push('Review hybrid components for potential optimization');
    }

    return {
      serverComponentRatio: serverRatio,
      clientComponentRatio: clientRatio,
      hybridComponentRatio: hybridRatio,
      recommendations
    };
  }

  // Helper methods

  private calculateComponentLevels(hierarchy: ComponentHierarchy): void {
    const visited = new Set<string>();
    const calculateLevel = (componentPath: string, level: number): void => {
      if (visited.has(componentPath)) return;
      visited.add(componentPath);

      if (!hierarchy.levels.has(level)) {
        hierarchy.levels.set(level, []);
      }
      hierarchy.levels.get(level)!.push(componentPath);

      hierarchy.maxDepth = Math.max(hierarchy.maxDepth, level);

      const children = hierarchy.parentChildMap.get(componentPath) || [];
      children.forEach(child => calculateLevel(child, level + 1));
    };

    hierarchy.roots.forEach(root => calculateLevel(root, 0));
  }

  private identifyUIComponents(componentMap: ComponentMap): string[] {
    return Array.from(componentMap.components.keys())
      .filter(componentPath => 
        componentPath.includes('/ui/') || 
        componentPath.includes('/components/ui/') ||
        this.isShadcnComponent(componentPath)
      );
  }

  private identifyLayoutComponents(componentMap: ComponentMap): string[] {
    return Array.from(componentMap.components.keys())
      .filter(componentPath => 
        componentPath.includes('/layout') ||
        componentPath.includes('Layout') ||
        componentPath.includes('Header') ||
        componentPath.includes('Footer') ||
        componentPath.includes('Sidebar')
      );
  }

  private identifyPageComponents(componentMap: ComponentMap): string[] {
    return Array.from(componentMap.components.keys())
      .filter(componentPath => 
        componentPath.includes('/app/') && 
        (componentPath.endsWith('page.tsx') || componentPath.includes('Page'))
      );
  }

  private identifyFeatureClusters(componentMap: ComponentMap): ComponentCluster[] {
    // Group components by feature/directory
    const featureGroups = new Map<string, string[]>();
    
    for (const componentPath of componentMap.components.keys()) {
      const pathParts = componentPath.split('/');
      const featurePart = pathParts.find(part => 
        ['dashboard', 'auth', 'academy', 'trust', 'enterprise'].includes(part)
      );
      
      if (featurePart) {
        if (!featureGroups.has(featurePart)) {
          featureGroups.set(featurePart, []);
        }
        featureGroups.get(featurePart)!.push(componentPath);
      }
    }

    return Array.from(featureGroups.entries()).map(([feature, components]) => ({
      id: `feature-${feature}`,
      name: `${feature.charAt(0).toUpperCase() + feature.slice(1)} Components`,
      type: 'feature',
      components,
      description: `Components related to ${feature} functionality`,
      cohesion: this.calculateClusterCohesion(components, componentMap),
      coupling: this.calculateClusterCoupling(components, componentMap)
    }));
  }

  private calculateClusterCohesion(components: string[], componentMap: ComponentMap): number {
    // Calculate internal relationships within cluster
    let internalConnections = 0;
    let totalPossible = components.length * (components.length - 1);

    for (const component of components) {
      const usages = componentMap.usage.get(component) || [];
      internalConnections += usages.filter(usage => 
        components.includes(usage.usedInFile)
      ).length;
    }

    return totalPossible > 0 ? internalConnections / totalPossible : 0;
  }

  private calculateClusterCoupling(components: string[], componentMap: ComponentMap): number {
    // Calculate external relationships outside cluster
    let externalConnections = 0;
    let totalPossible = components.length * (componentMap.components.size - components.length);

    for (const component of components) {
      const usages = componentMap.usage.get(component) || [];
      externalConnections += usages.filter(usage => 
        !components.includes(usage.usedInFile)
      ).length;
    }

    return totalPossible > 0 ? externalConnections / totalPossible : 0;
  }

  private identifyContainerPresentationPattern(componentMap: ComponentMap): string[][] {
    // Identify container/presentation pairs
    return [];
  }

  private identifyCompoundComponents(componentMap: ComponentMap): string[] {
    // Identify compound components
    return [];
  }

  private identifyHOCs(componentMap: ComponentMap): string[] {
    // Identify Higher-Order Components
    return [];
  }

  private identifyRenderPropComponents(componentMap: ComponentMap): string[] {
    // Identify render prop components
    return [];
  }

  private identifyCompositionRelationships(componentMap: ComponentMap): ComponentRelationship[] {
    // Identify composition relationships
    return [];
  }

  private identifyDataFlowRelationships(componentMap: ComponentMap): ComponentRelationship[] {
    // Identify data flow relationships
    return [];
  }

  private calculateUsageStrength(usage: ComponentUsage): number {
    let strength = 1;
    if (usage.props && Object.keys(usage.props).length > 0) strength += 0.5;
    if (usage.isServerComponent) strength += 0.3;
    return strength;
  }

  private calculatePropDrillingDepth(componentPath: string, componentMap: ComponentMap): number {
    // Calculate prop drilling depth
    return 0;
  }

  private identifyComplexDataFlows(componentMap: ComponentMap): Array<{ flow: string[]; complexity: number }> {
    // Identify complex data flows
    return [];
  }

  private isContextProvider(componentInfo: ComponentInfo): boolean {
    return componentInfo.name.includes('Provider') || 
           componentInfo.filePath.includes('context') ||
           componentInfo.filePath.includes('Context');
  }

  private isContextConsumer(componentInfo: ComponentInfo): boolean {
    // Check if component uses useContext or Context.Consumer
    return false; // Simplified
  }

  private findContextConsumers(provider: string, componentMap: ComponentMap): string[] {
    // Find components that consume from this provider
    return [];
  }

  private identifyOverusedContexts(contextBoundaries: Array<{ provider: string; consumers: string[] }>): string[] {
    return contextBoundaries
      .filter(boundary => boundary.consumers.length > 10)
      .map(boundary => boundary.provider);
  }

  private extractHookUsage(componentInfo: ComponentInfo): string[] {
    // Extract hooks used in component
    return [];
  }

  private isCustomHook(componentInfo: ComponentInfo): boolean {
    return componentInfo.name.startsWith('use') && 
           !componentInfo.name.startsWith('useState') &&
           !componentInfo.name.startsWith('useEffect');
  }

  private identifyHookPatterns(hookUsageByComponent: Map<string, string[]>): string[] {
    // Identify common hook usage patterns
    return [];
  }

  private isShadcnComponent(componentPath: string): boolean {
    return componentPath.includes('/components/ui/') || 
           componentPath.includes('@/components/ui/');
  }

  private isCustomUIComponent(componentPath: string): boolean {
    return componentPath.includes('/ui/') && !this.isShadcnComponent(componentPath);
  }

  private isThirdPartyUIComponent(componentInfo: ComponentInfo): boolean {
    // Check if component imports from third-party UI libraries
    return false; // Simplified
  }

  private calculateUIComponentUsage(componentMap: ComponentMap): Record<string, number> {
    // Calculate usage statistics for UI components
    return {};
  }

  private calculateDesignSystemCoverage(shadcnComponents: string[], customComponents: string[]): number {
    const totalUIComponents = shadcnComponents.length + customComponents.length;
    return totalUIComponents > 0 ? shadcnComponents.length / totalUIComponents : 0;
  }

  private calculateComponentComplexity(component: ComponentInfo): number {
    // Calculate complexity based on props, dependencies, etc.
    return component.props.length + component.dependencies.length;
  }

  private findMostReusedComponents(componentMap: ComponentMap): Array<{ component: string; usageCount: number }> {
    const usageCounts = Array.from(componentMap.usage.entries())
      .map(([component, usages]) => ({ component, usageCount: usages.length }))
      .sort((a, b) => b.usageCount - a.usageCount);
    
    return usageCounts.slice(0, 10);
  }

  private findLeastUsedComponents(componentMap: ComponentMap): string[] {
    return Array.from(componentMap.components.keys())
      .filter(component => {
        const usages = componentMap.usage.get(component) || [];
        return usages.length <= 1;
      });
  }

  private categorizeComponentsByType(componentMap: ComponentMap): Record<string, number> {
    const categories = {
      'UI Components': 0,
      'Layout Components': 0,
      'Page Components': 0,
      'Feature Components': 0,
      'Utility Components': 0,
      'Other': 0
    };

    for (const componentPath of componentMap.components.keys()) {
      if (this.isShadcnComponent(componentPath) || componentPath.includes('/ui/')) {
        categories['UI Components']++;
      } else if (componentPath.includes('Layout') || componentPath.includes('Header') || componentPath.includes('Footer')) {
        categories['Layout Components']++;
      } else if (componentPath.includes('page.tsx') || componentPath.includes('Page')) {
        categories['Page Components']++;
      } else if (componentPath.includes('/dashboard/') || componentPath.includes('/auth/')) {
        categories['Feature Components']++;
      } else if (componentPath.includes('/utils/') || componentPath.includes('/helpers/')) {
        categories['Utility Components']++;
      } else {
        categories['Other']++;
      }
    }

    return categories;
  }
}