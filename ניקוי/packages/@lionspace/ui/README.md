# @lionspace/ui

## 🎨 Shared UI Component Library

Reusable React components following Atomic Design principles for the LionSpace platform.

## 📦 Installation

```bash
# From monorepo root
pnpm add @lionspace/ui --workspace

# In your app
import { Button, Card, Modal } from '@lionspace/ui'
```

## 🧩 Components

### Atoms (Basic Building Blocks)

#### Button
```tsx
import { Button } from '@lionspace/ui'

<Button 
  variant="primary" // primary | secondary | danger | ghost
  size="medium"     // small | medium | large
  loading={false}
  disabled={false}
  onClick={() => {}}
>
  Click Me
</Button>
```

#### Input
```tsx
import { Input } from '@lionspace/ui'

<Input
  type="text"
  placeholder="Enter text..."
  error="Validation error"
  label="Field Label"
  required
/>
```

#### Badge
```tsx
import { Badge } from '@lionspace/ui'

<Badge 
  variant="success" // success | warning | danger | info
  size="medium"
>
  Active
</Badge>
```

### Molecules (Composite Components)

#### Card
```tsx
import { Card } from '@lionspace/ui'

<Card
  title="Card Title"
  description="Card description"
  variant="elevated" // default | elevated | bordered
  footer={<Button>Action</Button>}
>
  Card content goes here
</Card>
```

#### Modal
```tsx
import { Modal } from '@lionspace/ui'

<Modal
  isOpen={true}
  onClose={() => {}}
  title="Modal Title"
  size="medium" // small | medium | large
>
  Modal content
</Modal>
```

#### FormField
```tsx
import { FormField } from '@lionspace/ui'

<FormField
  label="Email"
  error="Invalid email"
  required
>
  <Input type="email" />
</FormField>
```

### Organisms (Complex Components)

#### DataTable
```tsx
import { DataTable } from '@lionspace/ui'

<DataTable
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
  ]}
  data={[
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]}
  onSort={(key, direction) => {}}
  onFilter={(filters) => {}}
/>
```

#### Navigation
```tsx
import { Navigation } from '@lionspace/ui'

<Navigation
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]}
  currentPath="/"
/>
```

## 🎨 Theming

### Using Theme Tokens

```tsx
import { ThemeProvider, useTheme } from '@lionspace/ui'

// Wrap your app
<ThemeProvider theme="dark">
  <App />
</ThemeProvider>

// Use in components
function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}
```

### CSS Variables

```css
/* Available CSS variables */
--color-primary: #3b82f6;
--color-secondary: #8b5cf6;
--color-success: #10b981;
--color-warning: #f59e0b;
--color-danger: #ef4444;
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
```

## 🧪 Testing Components

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@lionspace/ui'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

## 📚 Storybook

```bash
# Start Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook
```

View component documentation at: http://localhost:6006

## 🎯 Design Principles

1. **Consistency**: Use consistent patterns and styles
2. **Accessibility**: WCAG 2.2 AA compliant
3. **Performance**: Optimized for bundle size
4. **Flexibility**: Composable and customizable
5. **Type Safety**: Full TypeScript support

## 🔧 Component Guidelines

### Creating New Components

1. Place in appropriate category (atoms/molecules/organisms)
2. Include TypeScript types
3. Add JSDoc comments
4. Write unit tests
5. Create Storybook story
6. Follow naming conventions

### Example Component

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant style
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  
  /**
   * Button size
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large'
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean
}

/**
 * Primary button component for user interactions
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'medium', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'button',
          `button--${variant}`,
          `button--${size}`,
          loading && 'button--loading',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

## 📊 Bundle Size

Keep components lightweight:

| Component | Size (gzip) |
|-----------|------------|
| Button    | 1.2 KB     |
| Input     | 1.5 KB     |
| Modal     | 2.8 KB     |
| DataTable | 4.5 KB     |

## 🤝 Contributing

1. Check existing components first
2. Follow design system guidelines
3. Write tests (min 80% coverage)
4. Update documentation
5. Add Storybook story
6. Submit PR with examples

## 📄 License

MIT © LionSpace Team