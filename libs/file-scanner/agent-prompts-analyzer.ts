/**
 * Agent Prompts Analyzer
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * Integration with agent prompts file for contextual project analysis
 */

import fs from 'fs/promises';
import path from 'path';
import {
  AgentPromptContext,
  PerformanceTargets,
  I18nConfig,
  FileNode,
  RouteNode,
  ComponentInfo
} from './types';

export interface AgentPrompt {
  route: string;
  role: string;
  objective: string;
  context: {
    route: string;
    design?: string;
    reusable_components?: string[];
    i18n?: string;
    seo?: string;
    components?: string[];
  };
  files_to_create?: string[];
  steps: string[];
  acceptance_criteria: string[];
  constraints: string[];
  testing?: string[];
  telemetry?: string[];
  progress_report?: string;
}

export interface PromptAnalysis {
  totalPrompts: number;
  routesCovered: string[];
  componentsMentioned: string[];
  designPrinciples: string[];
  performanceTargets: PerformanceTargets;
  i18nConfig: I18nConfig;
  testingPatterns: string[];
  constraintsFound: string[];
  missingRoutes: string[];
  unusedComponents: string[];
  implementationGaps: ImplementationGap[];
}

export interface ImplementationGap {
  route: string;
  type: 'missing_file' | 'missing_component' | 'missing_test' | 'missing_report';
  expectedPath: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export class AgentPromptsAnalyzer {
  private promptsFilePath: string;
  private parsedPrompts: Map<string, AgentPrompt> = new Map();
  private lastAnalysis?: PromptAnalysis;

  constructor(rootPath: string) {
    this.promptsFilePath = path.join(rootPath, 'lions_of_zion_agent_prompts_claude_spark_full_pack.md');
  }

  /**
   * Parse the agent prompts markdown file
   */
  async parseAgentPrompts(): Promise<Map<string, AgentPrompt>> {
    try {
      const content = await fs.readFile(this.promptsFilePath, 'utf-8');
      this.parsedPrompts = this.extractPromptsFromMarkdown(content);
      return this.parsedPrompts;
    } catch (error) {
      console.warn('Could not parse agent prompts file:', error);
      return new Map();
    }
  }

  /**
   * Analyze project against agent prompts
   */
  async analyzeProject(context: {
    files: FileNode[];
    routes: Map<string, RouteNode>;
    components: Map<string, ComponentInfo>;
  }): Promise<PromptAnalysis> {
    if (this.parsedPrompts.size === 0) {
      await this.parseAgentPrompts();
    }

    const analysis: PromptAnalysis = {
      totalPrompts: this.parsedPrompts.size,
      routesCovered: [],
      componentsMentioned: [],
      designPrinciples: [],
      performanceTargets: this.extractPerformanceTargets(),
      i18nConfig: this.extractI18nConfig(),
      testingPatterns: [],
      constraintsFound: [],
      missingRoutes: [],
      unusedComponents: [],
      implementationGaps: []
    };

    // Analyze each prompt
    for (const [route, prompt] of this.parsedPrompts) {
      analysis.routesCovered.push(route);

      // Collect components mentioned
      if (prompt.context.reusable_components) {
        analysis.componentsMentioned.push(...prompt.context.reusable_components);
      }
      if (prompt.context.components) {
        analysis.componentsMentioned.push(...prompt.context.components);
      }

      // Collect testing patterns
      if (prompt.testing) {
        analysis.testingPatterns.push(...prompt.testing);
      }

      // Collect constraints
      analysis.constraintsFound.push(...prompt.constraints);

      // Check for implementation gaps
      const gaps = await this.findImplementationGaps(prompt, context);
      analysis.implementationGaps.push(...gaps);
    }

    // Find missing routes
    analysis.missingRoutes = this.findMissingRoutes(context.routes, analysis.routesCovered);

    // Find unused components
    analysis.unusedComponents = this.findUnusedComponents(
      context.components,
      [...new Set(analysis.componentsMentioned)]
    );

    // Extract design principles
    analysis.designPrinciples = this.extractDesignPrinciples();

    // Remove duplicates
    analysis.componentsMentioned = [...new Set(analysis.componentsMentioned)];
    analysis.testingPatterns = [...new Set(analysis.testingPatterns)];
    analysis.constraintsFound = [...new Set(analysis.constraintsFound)];

    this.lastAnalysis = analysis;
    return analysis;
  }

  /**
   * Get context for a specific route
   */
  getRouteContext(route: string): AgentPromptContext | null {
    const prompt = this.parsedPrompts.get(route);
    if (!prompt) return null;

    return {
      pageType: this.extractPageType(route),
      designPrinciples: this.extractDesignPrinciples(),
      performanceTargets: this.extractPerformanceTargets(),
      i18nConfig: this.extractI18nConfig(),
      components: prompt.context.reusable_components || prompt.context.components || [],
      ctas: this.extractCTAs(),
      features: prompt.steps
    };
  }

  /**
   * Get implementation suggestions for a route
   */
  getImplementationSuggestions(route: string): string[] {
    const prompt = this.parsedPrompts.get(route);
    if (!prompt) return [];

    const suggestions: string[] = [];

    // Check if files exist
    if (prompt.files_to_create) {
      for (const filePath of prompt.files_to_create) {
        suggestions.push(`Create file: ${filePath}`);
      }
    }

    // Add testing suggestions
    if (prompt.testing) {
      for (const test of prompt.testing) {
        suggestions.push(`Implement test: ${test}`);
      }
    }

    // Add telemetry suggestions
    if (prompt.telemetry) {
      for (const telemetry of prompt.telemetry) {
        suggestions.push(`Add telemetry: ${telemetry}`);
      }
    }

    return suggestions;
  }

  /**
   * Generate implementation report
   */
  generateImplementationReport(): string {
    if (!this.lastAnalysis) {
      return 'No analysis available. Run analyzeProject() first.';
    }

    const analysis = this.lastAnalysis;
    const report: string[] = [];

    report.push('# Lions of Zion - Implementation Report');
    report.push('');
    report.push(`Generated: ${new Date().toISOString()}`);
    report.push('');

    // Summary
    report.push('## Summary');
    report.push(`- Total Prompts: ${analysis.totalPrompts}`);
    report.push(`- Routes Covered: ${analysis.routesCovered.length}`);
    report.push(`- Components Mentioned: ${analysis.componentsMentioned.length}`);
    report.push(`- Implementation Gaps: ${analysis.implementationGaps.length}`);
    report.push('');

    // Performance Targets
    report.push('## Performance Targets');
    report.push(`- LCP: ≤ ${analysis.performanceTargets.lcp}s`);
    report.push(`- CLS: < ${analysis.performanceTargets.cls}`);
    report.push(`- FID: ≤ ${analysis.performanceTargets.fid}ms`);
    report.push(`- A11y Score: ≥ ${analysis.performanceTargets.a11yScore}`);
    report.push('');

    // I18n Configuration
    report.push('## Internationalization');
    report.push(`- Default Language: ${analysis.i18nConfig.defaultLanguage}`);
    report.push(`- Supported Languages: ${analysis.i18nConfig.supportedLanguages.join(', ')}`);
    report.push(`- RTL Languages: ${analysis.i18nConfig.rtlLanguages.join(', ')}`);
    report.push('');

    // Implementation Gaps
    if (analysis.implementationGaps.length > 0) {
      report.push('## Implementation Gaps');
      report.push('');

      const gapsByPriority = {
        high: analysis.implementationGaps.filter(g => g.priority === 'high'),
        medium: analysis.implementationGaps.filter(g => g.priority === 'medium'),
        low: analysis.implementationGaps.filter(g => g.priority === 'low')
      };

      for (const [priority, gaps] of Object.entries(gapsByPriority)) {
        if (gaps.length > 0) {
          report.push(`### ${priority.toUpperCase()} Priority`);
          for (const gap of gaps) {
            report.push(`- **${gap.route}** (${gap.type}): ${gap.description}`);
            report.push(`  Expected: ${gap.expectedPath}`);
          }
          report.push('');
        }
      }
    }

    // Missing Routes
    if (analysis.missingRoutes.length > 0) {
      report.push('## Missing Routes');
      for (const route of analysis.missingRoutes) {
        report.push(`- ${route}`);
      }
      report.push('');
    }

    // Unused Components
    if (analysis.unusedComponents.length > 0) {
      report.push('## Potentially Unused Components');
      for (const component of analysis.unusedComponents) {
        report.push(`- ${component}`);
      }
      report.push('');
    }

    // Design Principles
    report.push('## Design Principles');
    for (const principle of analysis.designPrinciples) {
      report.push(`- ${principle}`);
    }
    report.push('');

    // Testing Patterns
    if (analysis.testingPatterns.length > 0) {
      report.push('## Testing Patterns');
      for (const pattern of analysis.testingPatterns) {
        report.push(`- ${pattern}`);
      }
      report.push('');
    }

    return report.join('\n');
  }

  // Private methods

  private extractPromptsFromMarkdown(content: string): Map<string, AgentPrompt> {
    const prompts = new Map<string, AgentPrompt>();
    
    // Find JSON blocks that contain prompts
    const jsonBlockRegex = /```json\n([\s\S]*?)\n```/g;
    let match;

    while ((match = jsonBlockRegex.exec(content)) !== null) {
      try {
        const jsonContent = match[1];
        const parsed = JSON.parse(jsonContent);
        
        if (parsed.role && parsed.objective && parsed.context?.route) {
          const route = parsed.context.route;
          prompts.set(route, parsed as AgentPrompt);
        }
      } catch (error) {
        // Skip invalid JSON blocks
        continue;
      }
    }

    return prompts;
  }

  private async findImplementationGaps(
    prompt: AgentPrompt,
    context: {
      files: FileNode[];
      routes: Map<string, RouteNode>;
      components: Map<string, ComponentInfo>;
    }
  ): Promise<ImplementationGap[]> {
    const gaps: ImplementationGap[] = [];
    const filePathsSet = new Set(context.files.map(f => f.path));

    // Check for missing files
    if (prompt.files_to_create) {
      for (const filePath of prompt.files_to_create) {
        const absolutePath = path.resolve(filePath);
        if (!filePathsSet.has(absolutePath)) {
          gaps.push({
            route: prompt.context.route,
            type: 'missing_file',
            expectedPath: filePath,
            description: `Expected file not found: ${path.basename(filePath)}`,
            priority: filePath.includes('page.tsx') ? 'high' : 'medium'
          });
        }
      }
    }

    // Check for missing components
    const mentionedComponents = [
      ...(prompt.context.reusable_components || []),
      ...(prompt.context.components || [])
    ];

    for (const componentName of mentionedComponents) {
      if (!context.components.has(componentName)) {
        gaps.push({
          route: prompt.context.route,
          type: 'missing_component',
          expectedPath: `components/${componentName}.tsx`,
          description: `Component ${componentName} mentioned but not found`,
          priority: 'medium'
        });
      }
    }

    // Check for missing progress reports
    if (prompt.progress_report) {
      const reportPath = path.resolve(prompt.progress_report);
      if (!filePathsSet.has(reportPath)) {
        gaps.push({
          route: prompt.context.route,
          type: 'missing_report',
          expectedPath: prompt.progress_report,
          description: 'Progress report file missing',
          priority: 'low'
        });
      }
    }

    return gaps;
  }

  private findMissingRoutes(
    implementedRoutes: Map<string, RouteNode>,
    promptRoutes: string[]
  ): string[] {
    const missing: string[] = [];
    
    for (const route of promptRoutes) {
      if (!implementedRoutes.has(route)) {
        missing.push(route);
      }
    }

    return missing;
  }

  private findUnusedComponents(
    implementedComponents: Map<string, ComponentInfo>,
    mentionedComponents: string[]
  ): string[] {
    const unused: string[] = [];
    
    for (const [componentName] of implementedComponents) {
      if (!mentionedComponents.includes(componentName)) {
        unused.push(componentName);
      }
    }

    return unused;
  }

  private extractPageType(route: string): string {
    if (route === '/') return 'landing';
    if (route.includes('/auth/')) return 'auth';
    if (route.includes('/dashboard/')) return 'dashboard';
    if (route.includes('/academy/')) return 'academy';
    if (route.includes('/trust/')) return 'trust';
    if (route.includes('/enterprise/')) return 'enterprise';
    return 'public';
  }

  private extractDesignPrinciples(): string[] {
    return [
      'Dark, modern, network/graph hero',
      'Bold typography, generous spacing',
      'Clear CTAs and trust-first cues',
      'A11y (WCAG 2.2 AA), keyboard-first',
      'RTL-ready for Hebrew and Arabic',
      'Performance-first (LCP ≤ 2.5s)',
      'Minimal choices, focused experience'
    ];
  }

  private extractPerformanceTargets(): PerformanceTargets {
    return {
      lcp: 2.5, // seconds
      cls: 0.1,  // cumulative layout shift
      fid: 200,  // milliseconds
      a11yScore: 95 // percentage
    };
  }

  private extractI18nConfig(): I18nConfig {
    return {
      supportedLanguages: ['EN', 'HE', 'ES', 'FR', 'DE', 'AR'],
      rtlLanguages: ['HE', 'AR'],
      defaultLanguage: 'EN'
    };
  }

  private extractCTAs(): string[] {
    return [
      'Join the fight — Free',
      'Explore the War Machine',
      'Fact‑Check',
      'Report Fake'
    ];
  }

  /**
   * Get the last analysis result
   */
  getLastAnalysis(): PromptAnalysis | undefined {
    return this.lastAnalysis;
  }

  /**
   * Get all parsed prompts
   */
  getAllPrompts(): Map<string, AgentPrompt> {
    return new Map(this.parsedPrompts);
  }

  /**
   * Check if a specific route has a prompt
   */
  hasPromptForRoute(route: string): boolean {
    return this.parsedPrompts.has(route);
  }

  /**
   * Get prompt for specific route
   */
  getPromptForRoute(route: string): AgentPrompt | undefined {
    return this.parsedPrompts.get(route);
  }
}