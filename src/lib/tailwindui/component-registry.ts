/**
 * TailwindUI Component Registry
 * 
 * Maps TailwindUI component categories, provides metadata, and includes
 * integration hooks for the frontend-designer agent.
 */

import type { ComponentType, ReactNode } from 'react'

// Base component metadata interface
export interface TailwindUIComponent {
  id: string
  name: string
  category: TailwindUICategory
  subcategory: string
  description: string
  complexity: 'simple' | 'medium' | 'complex'
  responsive: boolean
  interactive: boolean
  accessibility: AccessibilityFeatures
  terminalAdaptations: TerminalAdaptation[]
  dependencies: string[]
  examples: ComponentExample[]
  variants: ComponentVariant[]
}

// Component categories
export type TailwindUICategory = 'marketing' | 'application' | 'ecommerce'

// Accessibility features
export interface AccessibilityFeatures {
  keyboardNavigation: boolean
  screenReaderSupport: boolean
  focusManagement: boolean
  colorContrast: 'AA' | 'AAA'
  ariaLabels: string[]
}

// Terminal theme adaptations
export interface TerminalAdaptation {
  type: 'color' | 'animation' | 'typography' | 'layout' | 'effects'
  description: string
  implementation: string
  cssClasses: string[]
}

// Component examples
export interface ComponentExample {
  name: string
  description: string
  code: string
  preview?: string
}

// Component variants
export interface ComponentVariant {
  name: string
  description: string
  modifierClasses: string[]
  useCases: string[]
}

// Marketing Components Registry
export const MARKETING_COMPONENTS: TailwindUIComponent[] = [
  {
    id: 'hero-centered',
    name: 'Centered Hero',
    category: 'marketing',
    subcategory: 'heroes',
    description: 'Centered hero section with headline, description, and call-to-action buttons',
    complexity: 'medium',
    responsive: true,
    interactive: true,
    accessibility: {
      keyboardNavigation: true,
      screenReaderSupport: true,
      focusManagement: true,
      colorContrast: 'AA',
      ariaLabels: ['main-heading', 'cta-button', 'secondary-action']
    },
    terminalAdaptations: [
      {
        type: 'color',
        description: 'Apply terminal background and text colors',
        implementation: 'Replace white background with terminal-bg, adjust text to terminal-text',
        cssClasses: ['bg-terminal-bg', 'text-terminal-text']
      },
      {
        type: 'effects',
        description: 'Add subtle glow effects to CTA buttons',
        implementation: 'Apply glow-cyan shadow to primary buttons',
        cssClasses: ['shadow-glow-cyan', 'hover:shadow-glow-gold']
      },
      {
        type: 'animation',
        description: 'Integrate data-flow animation for visual interest',
        implementation: 'Add animated background elements',
        cssClasses: ['animate-pulse-glow']
      }
    ],
    dependencies: ['@/components/ui/button', '@/lib/utils'],
    examples: [
      {
        name: 'Terminal Command Hero',
        description: 'Hero section styled as a terminal interface',
        code: `
export function TerminalHero() {
  return (
    <div className="relative isolate bg-terminal-bg px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-terminal-cyan sm:text-6xl font-terminal">
            LIONSPACE INTELLIGENCE
          </h1>
          <p className="mt-6 text-lg leading-8 text-terminal-text">
            Advanced neural network processing for next-generation applications
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button variant="terminal" size="lg" className="shadow-glow-cyan">
              Initialize System
            </Button>
            <Button variant="terminal-outline" size="lg">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}`
      }
    ],
    variants: [
      {
        name: 'Command Interface',
        description: 'Hero styled as a terminal command interface',
        modifierClasses: ['font-terminal', 'text-terminal-cyan', 'bg-terminal-bg'],
        useCases: ['Technical products', 'Developer tools', 'System dashboards']
      },
      {
        name: 'Data Visualization',
        description: 'Hero with animated data visualization background',
        modifierClasses: ['relative', 'overflow-hidden', 'animate-grid-fade'],
        useCases: ['Analytics platforms', 'Monitoring tools', 'AI services']
      }
    ]
  },
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    category: 'marketing',
    subcategory: 'features',
    description: 'Grid layout showcasing product features with icons and descriptions',
    complexity: 'simple',
    responsive: true,
    interactive: false,
    accessibility: {
      keyboardNavigation: false,
      screenReaderSupport: true,
      focusManagement: false,
      colorContrast: 'AA',
      ariaLabels: ['feature-list', 'feature-item']
    },
    terminalAdaptations: [
      {
        type: 'layout',
        description: 'Apply terminal grid styling with borders',
        implementation: 'Add terminal-line borders to grid items',
        cssClasses: ['border-terminal-line', 'bg-terminal-bg']
      },
      {
        type: 'typography',
        description: 'Use terminal font for feature titles',
        implementation: 'Apply font-terminal to headings',
        cssClasses: ['font-terminal', 'text-terminal-cyan']
      }
    ],
    dependencies: ['@/components/ui/card'],
    examples: [
      {
        name: 'System Capabilities Grid',
        description: 'Feature grid showing system capabilities',
        code: `
export function SystemCapabilities() {
  return (
    <div className="bg-terminal-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-terminal-gold">SYSTEM OVERVIEW</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-terminal-cyan sm:text-4xl font-terminal">
            Advanced Intelligence Capabilities
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative border border-terminal-line rounded-lg p-6 bg-terminal-bg/50">
                <dt className="text-base font-semibold leading-7 text-terminal-cyan font-terminal">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-terminal-text">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}`
      }
    ],
    variants: [
      {
        name: 'Technical Specifications',
        description: 'Feature grid with technical specification styling',
        modifierClasses: ['font-mono', 'text-xs', 'uppercase', 'tracking-wider'],
        useCases: ['Technical documentation', 'System specs', 'API features']
      }
    ]
  }
]

// Application UI Components Registry
export const APPLICATION_COMPONENTS: TailwindUIComponent[] = [
  {
    id: 'sidebar-layout',
    name: 'Sidebar Layout',
    category: 'application',
    subcategory: 'layout',
    description: 'Application layout with collapsible sidebar navigation',
    complexity: 'complex',
    responsive: true,
    interactive: true,
    accessibility: {
      keyboardNavigation: true,
      screenReaderSupport: true,
      focusManagement: true,
      colorContrast: 'AA',
      ariaLabels: ['navigation', 'main-content', 'sidebar-toggle']
    },
    terminalAdaptations: [
      {
        type: 'color',
        description: 'Apply terminal color scheme to sidebar and main content',
        implementation: 'Use terminal-bg for sidebar, secondary for content areas',
        cssClasses: ['bg-terminal-bg', 'border-terminal-line']
      },
      {
        type: 'effects',
        description: 'Add subtle scan-line animation to sidebar',
        implementation: 'Overlay scan-line animation on sidebar background',
        cssClasses: ['relative', 'overflow-hidden']
      }
    ],
    dependencies: ['@/components/ui/button', '@/components/ui/sheet'],
    examples: [
      {
        name: 'Command Center Layout',
        description: 'Sidebar layout styled as a command center interface',
        code: `
export function CommandCenterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="flex w-72 flex-col border-r border-terminal-line bg-terminal-bg/80">
          <div className="flex h-16 shrink-0 items-center border-b border-terminal-line px-4">
            <div className="text-terminal-cyan font-terminal font-bold">LIONSPACE</div>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {/* Navigation items */}
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center border-b border-terminal-line bg-terminal-bg px-4">
            <div className="text-terminal-text">System Status: OPERATIONAL</div>
          </header>
          <main className="flex-1 overflow-auto bg-secondary/5 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}`
      }
    ],
    variants: [
      {
        name: 'Monitoring Dashboard',
        description: 'Layout optimized for monitoring and analytics',
        modifierClasses: ['grid', 'grid-cols-12', 'gap-6'],
        useCases: ['System monitoring', 'Analytics dashboards', 'Control panels']
      }
    ]
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'application',
    subcategory: 'data-display',
    description: 'Sortable data table with filtering and pagination',
    complexity: 'complex',
    responsive: true,
    interactive: true,
    accessibility: {
      keyboardNavigation: true,
      screenReaderSupport: true,
      focusManagement: true,
      colorContrast: 'AA',
      ariaLabels: ['data-table', 'sort-button', 'pagination']
    },
    terminalAdaptations: [
      {
        type: 'typography',
        description: 'Use monospace font for data display',
        implementation: 'Apply font-mono to table cells for alignment',
        cssClasses: ['font-mono', 'text-sm']
      },
      {
        type: 'color',
        description: 'Apply terminal color scheme with zebra striping',
        implementation: 'Alternate row colors with terminal palette',
        cssClasses: ['even:bg-terminal-line/20', 'hover:bg-terminal-line/40']
      }
    ],
    dependencies: ['@tanstack/react-table', '@/components/ui/table'],
    examples: [
      {
        name: 'System Metrics Table',
        description: 'Data table displaying system metrics and status',
        code: `
export function SystemMetricsTable() {
  return (
    <div className="border border-terminal-line rounded-lg bg-terminal-bg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-terminal-cyan font-terminal">
          SYSTEM METRICS
        </h3>
        <div className="mt-6 overflow-hidden shadow ring-1 ring-terminal-line rounded-md">
          <table className="min-w-full divide-y divide-terminal-line">
            <thead className="bg-terminal-line/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-terminal-gold uppercase tracking-wider font-terminal">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-terminal-gold uppercase tracking-wider font-terminal">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-terminal-gold uppercase tracking-wider font-terminal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-terminal-bg divide-y divide-terminal-line">
              {metrics.map((metric) => (
                <tr key={metric.id} className="hover:bg-terminal-line/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-terminal-text">
                    {metric.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-terminal-cyan">
                    {metric.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-terminal-cyan/20 text-terminal-cyan">
                      {metric.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}`
      }
    ],
    variants: [
      {
        name: 'Log Viewer',
        description: 'Table styled for viewing system logs',
        modifierClasses: ['font-mono', 'text-xs', 'max-h-96', 'overflow-auto'],
        useCases: ['System logs', 'Error tracking', 'Audit trails']
      }
    ]
  }
]

// Ecommerce Components Registry
export const ECOMMERCE_COMPONENTS: TailwindUIComponent[] = [
  {
    id: 'product-grid',
    name: 'Product Grid',
    category: 'ecommerce',
    subcategory: 'product-lists',
    description: 'Responsive grid layout for displaying products with images and details',
    complexity: 'medium',
    responsive: true,
    interactive: true,
    accessibility: {
      keyboardNavigation: true,
      screenReaderSupport: true,
      focusManagement: true,
      colorContrast: 'AA',
      ariaLabels: ['product-grid', 'product-card', 'add-to-cart']
    },
    terminalAdaptations: [
      {
        type: 'color',
        description: 'Apply terminal color scheme to product cards',
        implementation: 'Use terminal-bg for cards, terminal-line for borders',
        cssClasses: ['bg-terminal-bg', 'border-terminal-line']
      },
      {
        type: 'effects',
        description: 'Add subtle glow effect on hover',
        implementation: 'Apply glow-cyan shadow on card hover',
        cssClasses: ['hover:shadow-glow-cyan', 'transition-shadow']
      }
    ],
    dependencies: ['@/components/ui/card', '@/components/ui/button'],
    examples: [
      {
        name: 'Software Modules Grid',
        description: 'Product grid for software modules/packages',
        code: `
export function SoftwareModulesGrid() {
  return (
    <div className="bg-terminal-bg">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-terminal-cyan font-terminal">
          AVAILABLE MODULES
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {modules.map((module) => (
            <div key={module.id} className="group relative border border-terminal-line rounded-lg bg-terminal-bg hover:shadow-glow-cyan transition-shadow">
              <div className="p-6">
                <h3 className="text-sm font-terminal text-terminal-gold">
                  {module.name}
                </h3>
                <p className="mt-1 text-lg font-medium text-terminal-cyan">
                  v{module.version}
                </p>
                <p className="mt-2 text-sm text-terminal-text">
                  {module.description}
                </p>
                <div className="mt-4">
                  <Button variant="terminal" size="sm" className="w-full">
                    Install Module
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`
      }
    ],
    variants: [
      {
        name: 'Service Packages',
        description: 'Grid for displaying service packages/subscriptions',
        modifierClasses: ['max-w-sm', 'mx-auto', 'text-center'],
        useCases: ['SaaS pricing', 'Service tiers', 'Software licenses']
      }
    ]
  }
]

// Component registry map
export const COMPONENT_REGISTRY = new Map<string, TailwindUIComponent[]>([
  ['marketing', MARKETING_COMPONENTS],
  ['application', APPLICATION_COMPONENTS],
  ['ecommerce', ECOMMERCE_COMPONENTS]
])

// Utility functions for frontend-designer agent integration

/**
 * Get components by category
 */
export function getComponentsByCategory(category: TailwindUICategory): TailwindUIComponent[] {
  return COMPONENT_REGISTRY.get(category) || []
}

/**
 * Get component information by ID
 */
export function getComponentInfo(category: TailwindUICategory, id: string): TailwindUIComponent | undefined {
  const components = getComponentsByCategory(category)
  return components.find(component => component.id === id)
}

/**
 * Search components by keyword
 */
export function searchComponents(query: string): TailwindUIComponent[] {
  const allComponents = Array.from(COMPONENT_REGISTRY.values()).flat()
  const lowercaseQuery = query.toLowerCase()
  
  return allComponents.filter(component =>
    component.name.toLowerCase().includes(lowercaseQuery) ||
    component.description.toLowerCase().includes(lowercaseQuery) ||
    component.subcategory.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Get components by complexity level
 */
export function getComponentsByComplexity(complexity: 'simple' | 'medium' | 'complex'): TailwindUIComponent[] {
  const allComponents = Array.from(COMPONENT_REGISTRY.values()).flat()
  return allComponents.filter(component => component.complexity === complexity)
}

/**
 * Get terminal adaptation suggestions for a component
 */
export function getTerminalAdaptations(componentId: string): TerminalAdaptation[] {
  const allComponents = Array.from(COMPONENT_REGISTRY.values()).flat()
  const component = allComponents.find(c => c.id === componentId)
  return component?.terminalAdaptations || []
}

/**
 * Generate component with terminal adaptations applied
 */
export function adaptToTerminalTheme(
  baseComponent: string,
  adaptations: TerminalAdaptation[]
): string {
  let adaptedComponent = baseComponent
  
  adaptations.forEach(adaptation => {
    // Apply CSS class transformations based on adaptation type
    adaptation.cssClasses.forEach(cssClass => {
      // Simple implementation - in production, this would be more sophisticated
      adaptedComponent = adaptedComponent.replace(
        /className="([^"]*)"/, 
        `className="$1 ${cssClass}"`
      )
    })
  })
  
  return adaptedComponent
}

/**
 * Get recommended components for a use case
 */
export function getRecommendedComponents(useCase: string): TailwindUIComponent[] {
  const allComponents = Array.from(COMPONENT_REGISTRY.values()).flat()
  const useCaseLower = useCase.toLowerCase()
  
  return allComponents.filter(component =>
    component.variants.some(variant =>
      variant.useCases.some(uc => uc.toLowerCase().includes(useCaseLower))
    )
  )
}

/**
 * Export all component metadata for agent consumption
 */
export function getComponentMetadata() {
  return {
    categories: Array.from(COMPONENT_REGISTRY.keys()),
    totalComponents: Array.from(COMPONENT_REGISTRY.values()).flat().length,
    componentsByCategory: Object.fromEntries(
      Array.from(COMPONENT_REGISTRY.entries()).map(([category, components]) => [
        category,
        components.map(c => ({ id: c.id, name: c.name, complexity: c.complexity }))
      ])
    )
  }
}