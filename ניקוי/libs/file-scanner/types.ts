/**
 * File Scanner Engine Types
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Comprehensive TypeScript definitions for the file scanning and dependency analysis system
 */

import { Position } from 'react-flow-renderer';

export interface FileNode {
  id: string;
  path: string;
  relativePath: string;
  name: string;
  extension: string;
  size: number;
  lastModified: Date;
  type: FileType;
  isDirectory: boolean;
  children?: FileNode[];
  depth: number;
  content?: string;
  ast?: any; // AST representation for code files
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  type: DependencyType;
  line?: number;
  column?: number;
  isNamedImport: boolean;
  importSpecifiers: string[];
  isDynamic: boolean;
  isTypeOnly: boolean;
}

export interface ComponentUsage {
  componentName: string;
  usedInFile: string;
  line: number;
  column: number;
  props?: Record<string, any>;
  isServerComponent: boolean;
  isClientComponent: boolean;
}

export interface RouteNode {
  id: string;
  path: string;
  route: string;
  type: RouteType;
  isLayoutFile: boolean;
  isPageFile: boolean;
  isApiRoute: boolean;
  routeGroup?: string;
  metadata?: RouteMetadata;
  parentRoute?: string;
  childRoutes: string[];
}

export interface ProjectStructure {
  rootPath: string;
  totalFiles: number;
  totalDirectories: number;
  filesByType: Record<FileType, number>;
  dependencies: DependencyGraph;
  routes: RouteGraph;
  components: ComponentMap;
  health: ProjectHealth;
  lastScanned: Date;
  scanDuration: number;
}

export interface DependencyGraph {
  nodes: Map<string, FileNode>;
  edges: Map<string, DependencyEdge>;
  adjacencyList: Map<string, string[]>;
  reverseAdjacencyList: Map<string, string[]>;
  cycles: string[][];
  orphanedFiles: string[];
  entryPoints: string[];
}

export interface RouteGraph {
  routes: Map<string, RouteNode>;
  routeGroups: Map<string, string[]>;
  layoutHierarchy: Map<string, string[]>;
  apiRoutes: string[];
  dynamicRoutes: string[];
  catchAllRoutes: string[];
}

export interface ComponentMap {
  components: Map<string, ComponentInfo>;
  usage: Map<string, ComponentUsage[]>;
  serverComponents: string[];
  clientComponents: string[];
  hybridComponents: string[];
}

export interface ComponentInfo {
  name: string;
  filePath: string;
  isExported: boolean;
  isDefault: boolean;
  props: PropDefinition[];
  dependencies: string[];
  usages: ComponentUsage[];
  type: ComponentType;
}

export interface PropDefinition {
  name: string;
  type: string;
  isRequired: boolean;
  defaultValue?: any;
  description?: string;
}

export interface ProjectHealth {
  score: number; // 0-100
  issues: HealthIssue[];
  missingDependencies: MissingDependency[];
  orphanedFiles: string[];
  deadCode: DeadCodeInfo[];
  typeErrors: TypeScriptError[];
  performanceIssues: PerformanceIssue[];
  securityIssues: SecurityIssue[];
}

export interface HealthIssue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  file: string;
  line?: number;
  column?: number;
  message: string;
  suggestion?: string;
  fixable: boolean;
}

export interface MissingDependency {
  importPath: string;
  usedInFiles: string[];
  suggestedPackage?: string;
  isDevDependency: boolean;
}

export interface DeadCodeInfo {
  file: string;
  type: DeadCodeType;
  name: string;
  line: number;
  reason: string;
}

export interface TypeScriptError {
  file: string;
  line: number;
  column: number;
  code: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface PerformanceIssue {
  file: string;
  type: PerformanceIssueType;
  description: string;
  impact: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface SecurityIssue {
  file: string;
  type: SecurityIssueType;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cwe?: string;
}

export interface ScanOptions {
  rootPath: string;
  includePatterns: string[];
  excludePatterns: string[];
  followSymlinks: boolean;
  maxDepth: number;
  parseAST: boolean;
  includeContent: boolean;
  enableTypeChecking: boolean;
  enablePerformanceAnalysis: boolean;
  enableSecurityAnalysis: boolean;
}

export interface FileWatcherOptions {
  debounceMs: number;
  ignoreInitial: boolean;
  followSymlinks: boolean;
  ignored: string[];
  persistent: boolean;
}

export interface ReactFlowNode {
  id: string;
  type: 'file' | 'directory' | 'component' | 'route';
  position: Position;
  data: {
    label: string;
    file?: FileNode;
    component?: ComponentInfo;
    route?: RouteNode;
    health?: HealthIssue[];
    dependencies?: number;
    dependents?: number;
  };
  style?: React.CSSProperties;
  className?: string;
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  type: 'dependency' | 'route' | 'component-usage';
  animated?: boolean;
  style?: React.CSSProperties;
  data?: {
    dependency?: DependencyEdge;
    strength?: number;
    type?: string;
  };
}

export interface VisualizationData {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  layout: LayoutOptions;
  filters: FilterOptions;
}

export interface LayoutOptions {
  algorithm: 'force' | 'hierarchical' | 'circular' | 'grid';
  spacing: number;
  direction: 'TB' | 'BT' | 'LR' | 'RL';
  rankSeparation: number;
  nodeSeparation: number;
}

export interface FilterOptions {
  fileTypes: FileType[];
  routeTypes: RouteType[];
  componentTypes: ComponentType[];
  showOrphanedFiles: boolean;
  showDeadCode: boolean;
  minDependencies: number;
  maxDependencies: number;
  healthScoreRange: [number, number];
}

export interface AgentPromptContext {
  pageType: string;
  designPrinciples: string[];
  performanceTargets: PerformanceTargets;
  i18nConfig: I18nConfig;
  components: string[];
  ctas: string[];
  features: string[];
}

export interface PerformanceTargets {
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  a11yScore: number; // Accessibility score
}

export interface I18nConfig {
  supportedLanguages: string[];
  rtlLanguages: string[];
  defaultLanguage: string;
}

export interface RouteMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: OpenGraphData;
  canonical?: string;
  robots?: string;
}

export interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

// Enums
export enum FileType {
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  TSX = 'tsx',
  JSX = 'jsx',
  CSS = 'css',
  SCSS = 'scss',
  LESS = 'less',
  HTML = 'html',
  MARKDOWN = 'markdown',
  JSON = 'json',
  YAML = 'yaml',
  XML = 'xml',
  SVG = 'svg',
  IMAGE = 'image',
  FONT = 'font',
  OTHER = 'other'
}

export enum DependencyType {
  IMPORT = 'import',
  EXPORT = 'export',
  DYNAMIC_IMPORT = 'dynamic_import',
  REQUIRE = 'require',
  TYPE_IMPORT = 'type_import',
  COMPONENT_USAGE = 'component_usage',
  ASSET_REFERENCE = 'asset_reference'
}

export enum RouteType {
  PAGE = 'page',
  LAYOUT = 'layout',
  LOADING = 'loading',
  ERROR = 'error',
  NOT_FOUND = 'not_found',
  API = 'api',
  MIDDLEWARE = 'middleware'
}

export enum ComponentType {
  SERVER_COMPONENT = 'server_component',
  CLIENT_COMPONENT = 'client_component',
  HYBRID_COMPONENT = 'hybrid_component',
  UTILITY_COMPONENT = 'utility_component',
  LAYOUT_COMPONENT = 'layout_component',
  PAGE_COMPONENT = 'page_component'
}

export enum IssueType {
  MISSING_DEPENDENCY = 'missing_dependency',
  ORPHANED_FILE = 'orphaned_file',
  DEAD_CODE = 'dead_code',
  TYPE_ERROR = 'type_error',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  ACCESSIBILITY = 'accessibility',
  SEO = 'seo'
}

export enum IssueSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum DeadCodeType {
  UNUSED_IMPORT = 'unused_import',
  UNUSED_EXPORT = 'unused_export',
  UNUSED_FUNCTION = 'unused_function',
  UNUSED_VARIABLE = 'unused_variable',
  UNUSED_COMPONENT = 'unused_component',
  UNREACHABLE_CODE = 'unreachable_code'
}

export enum PerformanceIssueType {
  LARGE_BUNDLE = 'large_bundle',
  BLOCKING_RESOURCE = 'blocking_resource',
  INEFFICIENT_RENDER = 'inefficient_render',
  MEMORY_LEAK = 'memory_leak',
  SLOW_IMPORT = 'slow_import'
}

export enum SecurityIssueType {
  XSS_VULNERABILITY = 'xss_vulnerability',
  UNSAFE_EVAL = 'unsafe_eval',
  HARDCODED_SECRET = 'hardcoded_secret',
  INSECURE_DEPENDENCY = 'insecure_dependency',
  DANGEROUS_PROPS = 'dangerous_props'
}

// Event types for real-time monitoring
export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
  path: string;
  stats?: any;
  timestamp: Date;
}

export interface ScanProgress {
  phase: ScanPhase;
  progress: number; // 0-100
  currentFile?: string;
  totalFiles: number;
  processedFiles: number;
  errors: string[];
  warnings: string[];
}

export enum ScanPhase {
  INITIALIZING = 'initializing',
  SCANNING_FILES = 'scanning_files',
  PARSING_CONTENT = 'parsing_content',
  BUILDING_GRAPH = 'building_graph',
  ANALYZING_DEPENDENCIES = 'analyzing_dependencies',
  HEALTH_CHECK = 'health_check',
  GENERATING_VISUALIZATION = 'generating_visualization',
  COMPLETED = 'completed'
}

// Callback types
export type ScanProgressCallback = (progress: ScanProgress) => void;
export type FileChangeCallback = (event: FileChangeEvent) => void;
export type HealthCheckCallback = (health: ProjectHealth) => void;

// Configuration interfaces
export interface ScannerConfig {
  rootPath: string;
  options: ScanOptions;
  watcherOptions?: FileWatcherOptions;
  onProgress?: ScanProgressCallback;
  onChange?: FileChangeCallback;
  onHealthChange?: HealthCheckCallback;
}

export interface AnalyzerConfig {
  enableTypeChecking: boolean;
  enablePerformanceAnalysis: boolean;
  enableSecurityAnalysis: boolean;
  customRules: AnalyzerRule[];
}

export interface AnalyzerRule {
  id: string;
  name: string;
  description: string;
  category: IssueType;
  severity: IssueSeverity;
  pattern?: RegExp;
  check: (node: FileNode) => HealthIssue[];
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type FileFilter = (file: FileNode) => boolean;
export type DependencyFilter = (edge: DependencyEdge) => boolean;
export type ComponentFilter = (component: ComponentInfo) => boolean;