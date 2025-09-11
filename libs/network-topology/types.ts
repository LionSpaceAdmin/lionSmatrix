/**
 * Network Topology Types
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Comprehensive TypeScript definitions for the network topology mapping system
 */

import React from 'react';
import { FileNode, ComponentInfo, RouteNode } from '../file-scanner/types';

// Core Topology Types

export interface NetworkTopology {
  id: string;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  clusters: NetworkCluster[];
  layout: TopologyLayout;
  connectionPatterns: ConnectionPattern[];
  metrics?: TopologyMetrics;
  healthIndicators?: HealthIndicator[];
  generatedAt?: Date;
  generationTime?: number;
  version?: string;
  buildTime: number;
  builtAt: Date;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: NetworkNodeType;
  position: NodePosition;
  size: number;
  importance: number; // 0-1 scale
  clusterId: string;
  file?: FileNode;
  component?: ComponentReference;
  route?: RouteReference;
  health?: HealthIndicator[];
  metadata?: Record<string, any>;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: NetworkEdgeType;
  strength: number; // 0-1 scale
  label?: string;
  metadata?: Record<string, any>;
}

export interface NetworkCluster {
  id: string;
  label: string;
  type: ClusterType;
  nodeIds: string[];
  position: NodePosition;
  size: number;
  color: string;
  metadata?: Record<string, any>;
}

export interface NodePosition {
  x: number;
  y: number;
  z?: number;
}

// Configuration Types

export interface TopologyConfig {
  rootPath: string;
  enableRealTimeSync: boolean;
  syncInterval?: number;
  batchUpdates?: boolean;
  defaultLayout: LayoutAlgorithm;
  clustering: ClusteringStrategy;
  onTopologyChange?: (event: TopologyChangeEvent) => void;
  
  projectConfig: ProjectAnalyzerConfig;
  dependencyConfig: DependencyMapperConfig;
  routeConfig: RouteAnalyzerConfig;
  componentConfig: ComponentAnalyzerConfig;
  builderConfig: TopologyBuilderConfig;
}

export interface ProjectAnalyzerConfig {
  enableWorkspaceDetection: boolean;
  enableRouteGrouping: boolean;
  enableComponentHierarchy: boolean;
  maxDepth: number;
}

export interface DependencyMapperConfig {
  includeExternalDeps: boolean;
  includeDevDeps: boolean;
  includeTypeOnlyImports: boolean;
  includeDynamicImports: boolean;
  detectCircularDeps: boolean;
}

export interface RouteAnalyzerConfig {
  enableAppRouter: boolean;
  enablePagesRouter: boolean;
  includeApiRoutes: boolean;
  includeStaticRoutes: boolean;
  includeDynamicRoutes: boolean;
}

export interface ComponentAnalyzerConfig {
  includeServerComponents: boolean;
  includeClientComponents: boolean;
  includeUtilityComponents: boolean;
  analyzeProps: boolean;
  analyzeUsage: boolean;
}

export interface TopologyBuilderConfig {
  enableClustering: boolean;
  enablePositioning: boolean;
  enableEdgeOptimization: boolean;
  defaultSpacing: number;
  clusterPadding: number;
}

// Analysis Result Types

export interface ProjectAnalysis {
  workspaces: WorkspaceInfo[];
  fileCategories: Map<FileCategory, FileNode[]>;
  hierarchy: ProjectHierarchy;
  fileMap: Map<string, FileNode>;
  workspaceMap: Map<string, WorkspaceInfo>;
  totalFiles: number;
  totalDirectories: number;
  analysisTime: number;
  analyzedAt: Date;
}

export interface DependencyMapping {
  importAnalysis: ImportAnalysis;
  exportAnalysis: ExportAnalysis;
  crossPackageDependencies: CrossPackageDependency[];
  circularDependencies: CircularDependency[];
  dependencyStrengths: DependencyStrength[];
  clusters: DependencyCluster[];
  componentDependencies: ComponentDependency[];
  externalDependencies: Map<string, number>;
  orphanedFiles: string[];
  entryPoints: string[];
  totalDependencies: number;
  mappingTime: number;
  mappedAt: Date;
}

export interface RouteTopology {
  routeGroups: RouteGroup[];
  layoutHierarchy: LayoutHierarchy;
  routeRelationships: RouteRelationship[];
  routePatterns: RoutePattern[];
  navigationFlows: NavigationFlow[];
  protectionAnalysis: Map<string, ProtectionLevel>;
  metrics: RouteMetrics;
  totalRoutes: number;
  analysisTime: number;
  analyzedAt: Date;
}

export interface ComponentTopology {
  hierarchy: ComponentHierarchy;
  clusters: ComponentCluster[];
  patterns: ComponentPattern[];
  relationships: ComponentRelationship[];
  propFlowAnalysis: PropFlowAnalysis;
  contextUsage: ContextUsageAnalysis;
  hookUsage: HookUsageAnalysis;
  uiComponentMapping: UIComponentMapping;
  metrics: ComponentMetrics;
  serverClientAnalysis: ServerClientAnalysis;
  totalComponents: number;
  analysisTime: number;
  analyzedAt: Date;
}

// Workspace and Project Structure Types

export interface WorkspaceInfo {
  id: string;
  name: string;
  type: WorkspaceType;
  rootPath: string;
  relativePath: string;
  files: string[];
  dependencies: string[];
  routes: string[];
  components: string[];
  packageJson?: string;
  tsConfig?: string;
  isMonorepoRoot: boolean;
}

export interface ProjectHierarchy {
  root: HierarchyNode;
  workspaceHierarchy: Record<string, any>;
  routeHierarchy: Record<string, any>;
  componentHierarchy: Record<string, any>;
}

export interface HierarchyNode {
  id: string;
  name: string;
  type: string;
  children: HierarchyNode[];
  path: string;
  relativePath: string;
  workspace: string;
}

// Dependency Analysis Types

export interface ImportAnalysis {
  importsByFile: Map<string, any[]>;
  importsByType: Map<any, any[]>;
  dynamicImports: any[];
  typeOnlyImports: any[];
  mostImported: Array<{ filePath: string; count: number }>;
  totalImports: number;
}

export interface ExportAnalysis {
  exportsByFile: Map<string, string[]>;
  reExports: Map<string, string[]>;
  defaultExports: string[];
  namedExports: Map<string, string[]>;
  mostExported: Array<{ filePath: string; count: number }>;
  totalExports: number;
}

export interface CrossPackageDependency {
  id: string;
  sourceWorkspace: string;
  targetWorkspace: string;
  sourceFile: string;
  targetFile: string;
  dependencyType: any;
  importSpecifiers: string[];
  isDynamic: boolean;
  isTypeOnly: boolean;
  strength: number;
}

export interface CircularDependency {
  id: string;
  cycle: string[];
  length: number;
  severity: 'low' | 'medium' | 'high';
  involvedFiles: string[];
  suggestedBreakPoint: string;
}

export interface DependencyCluster {
  id: string;
  name: string;
  type: string;
  files: string[];
  internalDependencies: number;
  externalDependencies: number;
  cohesion: number;
  coupling: number;
}

export interface DependencyStrength {
  id: string;
  source: string;
  target: string;
  strength: number;
  type: any;
  reasons: string[];
}

export interface ComponentDependency {
  componentFile: string;
  dependencies: string[];
  dependents: string[];
  imports: string[];
  exports: string[];
  isServerComponent: boolean;
  isClientComponent: boolean;
  usageCount: number;
}

// Route Analysis Types

export interface RouteGroup {
  id: string;
  name: string;
  description: string;
  pattern: string;
  routes: string[];
  layouts: string[];
  pages: string[];
  apiRoutes: string[];
  protection: ProtectionLevel;
  middleware: string[];
  metadata: Record<string, any>;
}

export interface LayoutHierarchy {
  rootLayout: LayoutInfo | null;
  groupLayouts: GroupLayoutInfo[];
  nestedLayouts: NestedLayoutInfo[];
  layoutInheritance: Map<string, string[]>;
}

export interface LayoutInfo {
  path: string;
  file?: FileNode;
  appliesTo: string[];
  metadata: Record<string, any>;
}

export interface GroupLayoutInfo extends LayoutInfo {
  groupId: string;
}

export interface NestedLayoutInfo extends LayoutInfo {
  parentLayout: string;
  nesting: number;
}

export interface RouteRelationship {
  id: string;
  type: RouteRelationshipType;
  source: string;
  target: string;
  strength: number;
  description: string;
}

export interface RoutePattern {
  id: string;
  type: RoutePatternType;
  pattern: string;
  routes: string[];
  description: string;
}

export interface NavigationFlow {
  id: string;
  name: string;
  type: NavigationFlowType;
  steps: NavigationStep[];
  entryPoints: string[];
  exitPoints: string[];
  description: string;
}

export interface NavigationStep {
  route: string;
  action: string;
  conditions?: string[];
  nextSteps: string[];
}

export interface RouteMetrics {
  totalRoutes: number;
  staticRoutes: number;
  dynamicRoutes: number;
  apiRoutes: number;
  avgDepth: number;
  maxDepth: number;
  groupDistribution: Record<string, number>;
  complexityScore: number;
}

// Component Analysis Types

export interface ComponentHierarchy {
  roots: string[];
  levels: Map<number, string[]>;
  parentChildMap: Map<string, string[]>;
  childParentMap: Map<string, string[]>;
  leafComponents: string[];
  maxDepth: number;
}

export interface ComponentCluster {
  id: string;
  name: string;
  type: ComponentClusterType;
  components: string[];
  description: string;
  cohesion: number;
  coupling: number;
}

export interface ComponentPattern {
  id: string;
  name: string;
  type: ComponentPatternType;
  components: string[];
  description: string;
  examples: string[];
}

export interface ComponentRelationship {
  id: string;
  type: ComponentRelationshipType;
  source: string;
  target: string;
  strength: number;
  metadata?: Record<string, any>;
}

export interface PropFlowAnalysis {
  propChains: string[][];
  propDrilling: Array<{ component: string; depth: number; props: string[] }>;
  dataTransformations: Array<{ component: string; transforms: string[] }>;
  complexDataFlows: Array<{ flow: string[]; complexity: number }>;
}

export interface ContextUsageAnalysis {
  contextProviders: string[];
  contextConsumers: string[];
  contextBoundaries: Array<{ provider: string; consumers: string[] }>;
  overusedContexts: string[];
}

export interface HookUsageAnalysis {
  customHooks: string[];
  hookUsageByComponent: Map<string, string[]>;
  mostUsedHooks: Array<{ hook: string; usageCount: number }>;
  hookPatterns: string[];
}

export interface UIComponentMapping {
  shadcnComponents: string[];
  customUIComponents: string[];
  thirdPartyComponents: string[];
  uiComponentUsage: Record<string, number>;
  designSystemCoverage: number;
}

export interface ComponentMetrics {
  totalComponents: number;
  serverComponents: number;
  clientComponents: number;
  hybridComponents: number;
  avgReusability: number;
  avgComplexity: number;
  mostReusedComponents: Array<{ component: string; usageCount: number }>;
  leastUsedComponents: string[];
  componentsByType: Record<string, number>;
}

export interface ServerClientAnalysis {
  serverComponentRatio: number;
  clientComponentRatio: number;
  hybridComponentRatio: number;
  recommendations: string[];
}

// Layout and Visualization Types

export interface TopologyLayout {
  algorithm: LayoutAlgorithm;
  clustering: ClusteringStrategy;
  spacing: number;
  applied: boolean;
}

export interface ConnectionPattern {
  id: string;
  type: ConnectionPatternType;
  nodes: string[];
  description: string;
  strength: number;
}

export interface TopologyMetrics {
  totalNodes: number;
  totalEdges: number;
  totalClusters: number;
  avgConnectivity: number;
  maxConnectivity: number;
  avgClusterSize: number;
  complexityScore: number;
  density: number;
}

export interface HealthIndicator {
  id: string;
  type: HealthIndicatorType;
  score: number;
  status: HealthStatus;
  message: string;
  affectedNodes: string[];
}

// Real-time and Event Types

export interface RealTimeSync {
  enabled: boolean;
  updateInterval: number;
  batchUpdates: boolean;
  onTopologyChange?: (event: TopologyChangeEvent) => void;
}

export interface TopologyChangeEvent {
  type: TopologyChangeType;
  topology: NetworkTopology;
  timestamp: Date;
  changes: string[];
}

export interface TopologyBuildRequest {
  projectAnalysis: ProjectAnalysis;
  dependencyMapping: DependencyMapping;
  routeTopology: RouteTopology;
  componentTopology: ComponentTopology;
  layoutAlgorithm: LayoutAlgorithm;
  clusteringStrategy: ClusteringStrategy;
}

// Reference Types

export interface ComponentReference {
  path: string;
  type: string;
  reusability: number;
}

export interface RouteReference {
  path: string;
  group: string;
  protection: ProtectionLevel;
}

export interface EdgeLayout {
  routingPoints: NodePosition[];
  curvature: number;
  animation: boolean;
}

export interface ClusterLayout {
  shape: ClusterShape;
  padding: number;
  borderRadius: number;
  background: string;
}

// Enums

export enum NetworkNodeType {
  FILE = 'file',
  COMPONENT = 'component',
  ROUTE = 'route',
  CLUSTER = 'cluster',
  WORKSPACE = 'workspace',
  API_ENDPOINT = 'api-endpoint',
  EXTERNAL_DEPENDENCY = 'external-dependency'
}

export enum NetworkEdgeType {
  DEPENDENCY = 'dependency',
  ROUTE_RELATIONSHIP = 'route-relationship',
  COMPONENT_RELATIONSHIP = 'component-relationship',
  IMPORT = 'import',
  USAGE = 'usage',
  NAVIGATION = 'navigation',
  DATA_FLOW = 'data-flow'
}

export enum ClusterType {
  WORKSPACE = 'workspace',
  ROUTE_GROUP = 'route-group',
  COMPONENT_CLUSTER = 'component-cluster',
  FEATURE_CLUSTER = 'feature-cluster',
  DEPENDENCY_CLUSTER = 'dependency-cluster'
}

export enum WorkspaceType {
  MONOREPO_ROOT = 'monorepo-root',
  APP = 'app',
  SHARED_UI = 'shared-ui',
  CORE_LOGIC = 'core-logic',
  AGENTS = 'agents',
  MOCK_DATA = 'mock-data',
  MICROSERVICE = 'microservice',
  INFRASTRUCTURE = 'infrastructure',
  DOCUMENTATION = 'documentation',
  LIBRARY = 'library',
  TOOLING = 'tooling'
}

export enum FileCategory {
  ROUTE = 'route',
  COMPONENT = 'component',
  UI_COMPONENT = 'ui-component',
  API = 'api',
  MIDDLEWARE = 'middleware',
  CONFIG = 'config',
  TEST = 'test',
  DOCUMENTATION = 'documentation',
  ASSET = 'asset',
  STYLE = 'style',
  TYPE = 'type',
  UTILITY = 'utility',
  HOOK = 'hook',
  CONTEXT = 'context',
  BUILD = 'build',
  PACKAGE = 'package',
  SOURCE = 'source',
  OTHER = 'other'
}

export enum LayoutAlgorithm {
  FORCE_DIRECTED = 'force-directed',
  HIERARCHICAL = 'hierarchical',
  CIRCULAR = 'circular',
  GRID = 'grid',
  ORGANIC = 'organic',
  LAYERED = 'layered'
}

export enum ClusteringStrategy {
  WORKSPACE_BASED = 'workspace-based',
  DEPENDENCY_BASED = 'dependency-based',
  FEATURE_BASED = 'feature-based',
  COMPONENT_BASED = 'component-based',
  ROUTE_BASED = 'route-based',
  HYBRID = 'hybrid'
}

export enum ProtectionLevel {
  PUBLIC = 'public',
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated',
  ROLE_BASED = 'role-based',
  ADMIN_ONLY = 'admin-only',
  UNKNOWN = 'unknown'
}

export enum RouteRelationshipType {
  PARENT_CHILD = 'parent-child',
  SIBLING = 'sibling',
  NAVIGATION = 'navigation',
  API_CALL = 'api-call',
  REDIRECT = 'redirect',
  MIDDLEWARE = 'middleware'
}

export enum RoutePatternType {
  DYNAMIC = 'dynamic',
  CATCH_ALL = 'catch-all',
  API = 'api',
  CRUD = 'crud',
  NESTED = 'nested'
}

export enum NavigationFlowType {
  AUTHENTICATION = 'authentication',
  ONBOARDING = 'onboarding',
  DASHBOARD = 'dashboard',
  USER_JOURNEY = 'user-journey',
  FEATURE_FLOW = 'feature-flow'
}

export enum ComponentClusterType {
  UI = 'ui',
  LAYOUT = 'layout',
  PAGE = 'page',
  FEATURE = 'feature',
  UTILITY = 'utility'
}

export enum ComponentPatternType {
  ARCHITECTURAL = 'architectural',
  COMPOSITION = 'composition',
  ENHANCEMENT = 'enhancement',
  DATA_SHARING = 'data-sharing',
  STATE_MANAGEMENT = 'state-management'
}

export enum ComponentRelationshipType {
  USAGE = 'usage',
  COMPOSITION = 'composition',
  INHERITANCE = 'inheritance',
  DATA_FLOW = 'data-flow',
  PROP_PASSING = 'prop-passing'
}

export enum ConnectionPatternType {
  HUB = 'hub',
  CHAIN = 'chain',
  STAR = 'star',
  MESH = 'mesh',
  TREE = 'tree',
  CIRCULAR = 'circular',
  CLUSTER_BRIDGE = 'cluster-bridge'
}

export enum HealthIndicatorType {
  OVERALL = 'overall',
  CONNECTIVITY = 'connectivity',
  PERFORMANCE = 'performance',
  MAINTAINABILITY = 'maintainability',
  SECURITY = 'security',
  ORPHANED = 'orphaned',
  CIRCULAR_DEPENDENCY = 'circular-dependency'
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown'
}

export enum TopologyChangeType {
  GENERATION = 'generation',
  UPDATE = 'update',
  LAYOUT_CHANGE = 'layout-change',
  CLUSTER_CHANGE = 'cluster-change',
  NODE_ADDED = 'node-added',
  NODE_REMOVED = 'node-removed',
  EDGE_ADDED = 'edge-added',
  EDGE_REMOVED = 'edge-removed'
}

export enum ClusterShape {
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle',
  ROUNDED_RECTANGLE = 'rounded-rectangle',
  ELLIPSE = 'ellipse',
  POLYGON = 'polygon'
}

// Utility Types

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type TopologyFilter = (topology: NetworkTopology) => boolean;
export type NodeFilter = (node: NetworkNode) => boolean;
export type EdgeFilter = (edge: NetworkEdge) => boolean;
export type ClusterFilter = (cluster: NetworkCluster) => boolean;

// Callback Types

export type TopologyChangeCallback = (event: TopologyChangeEvent) => void;
export type LayoutChangeCallback = (layout: TopologyLayout) => void;
export type ClusterChangeCallback = (clusters: NetworkCluster[]) => void;
export type HealthChangeCallback = (indicators: HealthIndicator[]) => void;

// Advanced Configuration Types

export interface AdvancedTopologyConfig extends TopologyConfig {
  performance: {
    enableVirtualization: boolean;
    maxNodesForRealTime: number;
    batchSize: number;
    updateThrottleMs: number;
  };
  visualization: {
    enableAnimations: boolean;
    enableTransitions: boolean;
    animationDuration: number;
    enableMinimap: boolean;
    enableZoom: boolean;
    enablePan: boolean;
  };
  interaction: {
    enableSelection: boolean;
    enableMultiSelection: boolean;
    enableDragAndDrop: boolean;
    enableEditing: boolean;
    enableContextMenu: boolean;
  };
  export: {
    enableImageExport: boolean;
    enableDataExport: boolean;
    enableReportGeneration: boolean;
    supportedFormats: string[];
  };
}