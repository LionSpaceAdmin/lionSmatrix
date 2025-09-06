# TailwindUI Integration Guide

## Overview

This directory contains the TailwindUI integration setup for the modern-nextjs-app project, providing a comprehensive system for using TailwindUI components with the existing LionSpace futuristic intelligence terminal design system.

## Available TailwindUI Component Categories

### Marketing Components
- **Heroes**: Landing page hero sections with CTA buttons
- **Feature Sections**: Product feature showcases and comparisons
- **Testimonials**: Customer testimonials and social proof
- **Pricing**: Pricing tables and subscription plans
- **FAQ**: Frequently asked questions sections
- **Call-to-Actions**: Conversion-focused sections
- **Headers**: Navigation headers and mega menus
- **Footers**: Site footers with links and contact information
- **Newsletter**: Email signup forms and newsletter sections
- **Statistics**: Data visualization and metrics displays

### Application UI Components
- **Layout**: Sidebar layouts, stacked layouts, multi-column layouts
- **Navigation**: Tabs, breadcrumbs, pagination, steps
- **Forms**: Form layouts, input groups, form sections
- **Lists**: Description lists, stacked lists, feeds
- **Headings**: Page headings, section headings, card headers
- **Data Display**: Tables, description lists, key-value pairs
- **Feedback**: Alerts, notifications, empty states
- **Overlays**: Modals, slide-overs, dialogs
- **Elements**: Buttons, badges, avatars, dividers

### Ecommerce Components
- **Product Lists**: Product grids, product listings with filters
- **Product Overviews**: Product detail pages, image galleries
- **Category Previews**: Category showcase sections
- **Shopping Carts**: Cart summaries, cart flyouts
- **Checkout Forms**: Multi-step checkout, billing forms
- **Order Summaries**: Order confirmation, receipt layouts
- **Promo Sections**: Discount banners, promotional content
- **Store Navigation**: Category navigation, search interfaces
- **Reviews**: Product reviews, rating systems
- **Wishlists**: Saved items, favorites management

## Using TailwindUI Components in the Project

### 1. Component Selection and Adaptation

```typescript
// Import the component registry for metadata and guidance
import { getComponentInfo, adaptToTerminalTheme } from '@/lib/tailwindui/component-registry'

// Get component specifications
const heroInfo = getComponentInfo('marketing', 'hero')
```

### 2. Integration with Existing Design System

All TailwindUI components should be adapted to work with the LionSpace terminal aesthetic:

```tsx
// Example: Adapting a TailwindUI hero component
import { cn } from '@/lib/utils'
import { TERMINAL_DESIGN_TOKENS } from '@/lib/tailwindui/design-tokens'

export function TerminalHero() {
  return (
    <div className={cn(
      // TailwindUI base classes
      "relative isolate px-6 pt-14 lg:px-8",
      // Terminal theme adaptations
      "bg-terminal-bg",
      "text-terminal-text",
      "border border-terminal-line"
    )}>
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-terminal-cyan to-terminal-gold opacity-20" />
      </div>
      {/* Component content */}
    </div>
  )
}
```

### 3. Color System Integration

Use the existing terminal color palette with TailwindUI components:

```css
/* Terminal-specific color mappings for TailwindUI */
.tailwindui-primary → terminal-cyan (#6EE7B7)
.tailwindui-secondary → terminal-gold (#FFB700)
.tailwindui-destructive → terminal-red (#D43F3F)
.tailwindui-background → terminal-bg (#030712)
.tailwindui-foreground → terminal-text (#E5E7EB)
```

### 4. Animation Integration

Leverage existing terminal animations with TailwindUI components:

```tsx
// Using terminal animations with TailwindUI components
<div className="animate-pulse-glow">
  {/* TailwindUI component content */}
</div>

<div className="animate-data-flow">
  {/* Animated data visualization */}
</div>
```

## Integration with Frontend Designer Agent

The frontend-designer agent can utilize TailwindUI components through the following workflow:

### 1. Component Discovery

```typescript
// Agent queries available components
const marketingComponents = getComponentsByCategory('marketing')
const applicationComponents = getComponentsByCategory('application')
```

### 2. Design Token Mapping

The agent automatically maps design requirements to TailwindUI components while maintaining terminal aesthetics:

```json
{
  "componentRequest": {
    "category": "application",
    "type": "modal",
    "variant": "terminal-styled",
    "requirements": [
      "Dark terminal background",
      "Cyan accent colors",
      "Monospace typography for data display",
      "Subtle glow effects"
    ]
  }
}
```

### 3. Automatic Adaptation

The agent uses the design tokens to automatically adapt TailwindUI components:

```typescript
// Agent-generated component with terminal adaptations
export function TerminalModal({ children, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        // TailwindUI base styles
        "sm:max-w-[425px]",
        // Terminal adaptations applied automatically
        "bg-terminal-bg border-terminal-line",
        "text-terminal-text shadow-glow-cyan"
      )}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
```

## Best Practices for Component Customization

### 1. Maintain Design Consistency

- Always use terminal color palette
- Preserve existing spacing and typography scales
- Apply terminal-specific animations where appropriate
- Maintain accessibility standards from both systems

### 2. Progressive Enhancement

```tsx
// Start with TailwindUI base, enhance with terminal theme
const baseClasses = "px-4 py-2 rounded-md font-medium" // TailwindUI
const terminalEnhancements = "bg-terminal-bg border border-terminal-line text-terminal-cyan hover:shadow-glow-cyan transition-all duration-300"

const combinedClasses = cn(baseClasses, terminalEnhancements)
```

### 3. Component Composition

```tsx
// Compose TailwindUI patterns with terminal components
import { Button } from '@/components/ui/button' // Terminal-styled button
import { Badge } from '@/components/ui/badge'   // Terminal-styled badge

export function TailwindUICard() {
  return (
    <div className="bg-terminal-bg border border-terminal-line rounded-lg p-6">
      {/* TailwindUI layout pattern */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="terminal">Status</Badge>
          <h3 className="text-terminal-text font-terminal">Component Title</h3>
        </div>
        <Button variant="terminal" size="sm">Action</Button>
      </div>
    </div>
  )
}
```

### 4. Responsive Design Integration

Maintain TailwindUI responsive patterns while applying terminal aesthetics:

```tsx
<div className={cn(
  // TailwindUI responsive pattern
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  // Terminal styling
  "p-6 bg-terminal-bg border border-terminal-line"
)}>
  {/* Responsive grid content with terminal styling */}
</div>
```

### 5. Accessibility Considerations

- Ensure sufficient contrast ratios with terminal colors
- Maintain ARIA labels and roles from TailwindUI patterns
- Test keyboard navigation with terminal styling
- Verify screen reader compatibility

## File Structure

```
src/lib/tailwindui/
├── README.md                 # This documentation
├── component-registry.ts     # Component metadata and mappings
├── design-tokens.ts         # Terminal-specific design tokens
├── adapters/               # Component adaptation utilities
│   ├── marketing.ts        # Marketing component adapters
│   ├── application.ts      # Application UI component adapters
│   └── ecommerce.ts       # Ecommerce component adapters
└── examples/              # Example implementations
    ├── hero-sections.tsx   # Terminal-styled hero examples
    ├── dashboard-layouts.tsx # Application layout examples
    └── product-cards.tsx   # Ecommerce component examples
```

## Getting Started

1. **Choose a TailwindUI component** from the official TailwindUI library
2. **Copy the base HTML/React structure** into your project
3. **Apply terminal design tokens** using the provided utilities
4. **Test responsiveness and accessibility** with the terminal theme
5. **Document any customizations** for future reference

## Resources

- [TailwindUI Official Documentation](https://tailwindui.com/documentation)
- [LionSpace Design System Guide](../../../components/ui/README.md)
- [Frontend Designer Agent Documentation](../../../.claude/agents/frontend-designer.md)
- [Accessibility Guidelines](./accessibility-guidelines.md)