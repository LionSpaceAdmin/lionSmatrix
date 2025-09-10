# Component Documentation

## 📚 LionSpace V3 Component Library Guide

Comprehensive documentation for all UI components in the LionSpace platform.

## 🎨 Design System

### Design Principles

1. **Clarity**: Information should be immediately understandable
2. **Consistency**: Uniform patterns across all interfaces
3. **Accessibility**: WCAG 2.2 AA compliant
4. **Performance**: Optimized for speed and efficiency
5. **Flexibility**: Components adapt to different contexts

### Color Palette

```scss
// Primary Colors
$primary-500: #3B82F6;     // Main brand color
$primary-600: #2563EB;     // Hover state
$primary-700: #1D4ED8;     // Active state

// Secondary Colors
$secondary-500: #8B5CF6;   // Accent color
$secondary-600: #7C3AED;   // Hover state

// Semantic Colors
$success-500: #10B981;     // Success states
$warning-500: #F59E0B;     // Warning states
$danger-500: #EF4444;      // Error states
$info-500: #3B82F6;        // Information

// Neutral Colors
$gray-50: #F9FAFB;         // Backgrounds
$gray-100: #F3F4F6;        // Light backgrounds
$gray-500: #6B7280;        // Body text
$gray-900: #111827;        // Headings
```

### Typography

```scss
// Font Families
$font-sans: 'Inter', system-ui, sans-serif;
$font-mono: 'JetBrains Mono', monospace;

// Font Sizes
$text-xs: 0.75rem;     // 12px
$text-sm: 0.875rem;    // 14px
$text-base: 1rem;      // 16px
$text-lg: 1.125rem;    // 18px
$text-xl: 1.25rem;     // 20px
$text-2xl: 1.5rem;     // 24px
$text-3xl: 1.875rem;   // 30px
$text-4xl: 2.25rem;    // 36px

// Font Weights
$font-normal: 400;
$font-medium: 500;
$font-semibold: 600;
$font-bold: 700;
```

### Spacing

```scss
// Spacing Scale
$space-1: 0.25rem;     // 4px
$space-2: 0.5rem;      // 8px
$space-3: 0.75rem;     // 12px
$space-4: 1rem;        // 16px
$space-5: 1.25rem;     // 20px
$space-6: 1.5rem;      // 24px
$space-8: 2rem;        // 32px
$space-10: 2.5rem;     // 40px
$space-12: 3rem;       // 48px
$space-16: 4rem;       // 64px
```

## 🧩 Component Categories

### Atoms (Basic Components)

#### Button

Primary interactive element for user actions.

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: ReactNode
}
```

**Usage Examples:**

```tsx
// Primary button
<Button variant="primary" onClick={handleSubmit}>
  Submit
</Button>

// Loading state
<Button loading>
  Processing...
</Button>

// With icon
<Button icon={<SaveIcon />}>
  Save Changes
</Button>

// Full width
<Button fullWidth variant="secondary">
  Continue
</Button>
```

#### Input

Text input field with validation support.

```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
}
```

**Usage Examples:**

```tsx
// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="john@example.com"
  required
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// With prefix/suffix
<Input
  label="Price"
  type="number"
  prefix="$"
  suffix="USD"
/>
```

#### Badge

Status indicator or label component.

```tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium' | 'large'
  dot?: boolean
  closable?: boolean
  onClick?: () => void
}
```

**Usage Examples:**

```tsx
// Status badge
<Badge variant="success">Active</Badge>

// With dot indicator
<Badge dot variant="warning">
  In Progress
</Badge>

// Closable tag
<Badge closable onClose={handleRemove}>
  React
</Badge>
```

### Molecules (Composite Components)

#### Card

Container component for grouped content.

```tsx
interface CardProps {
  title?: string
  description?: string
  variant?: 'default' | 'elevated' | 'bordered'
  padding?: 'none' | 'small' | 'medium' | 'large'
  hoverable?: boolean
  headerActions?: ReactNode
  footer?: ReactNode
}
```

**Usage Examples:**

```tsx
// Basic card
<Card title="Statistics" description="Monthly overview">
  <StatsChart />
</Card>

// With actions
<Card
  title="User Profile"
  headerActions={
    <Button size="small">Edit</Button>
  }
>
  <UserDetails />
</Card>

// Hoverable card
<Card hoverable onClick={handleCardClick}>
  <ProductInfo />
</Card>
```

#### Modal

Overlay dialog for focused interactions.

```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  showCloseButton?: boolean
  footer?: ReactNode
}
```

**Usage Examples:**

```tsx
// Confirmation modal
<Modal
  isOpen={isDeleteOpen}
  onClose={closeDeleteModal}
  title="Delete Item"
  footer={
    <>
      <Button variant="ghost" onClick={closeDeleteModal}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  Are you sure you want to delete this item?
</Modal>

// Form modal
<Modal
  isOpen={isFormOpen}
  onClose={closeForm}
  title="Create Campaign"
  size="large"
>
  <CampaignForm onSubmit={handleSubmit} />
</Modal>
```

#### Dropdown

Contextual overlay menu.

```tsx
interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  placement?: 'bottom' | 'top' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
}

interface DropdownItem {
  label: string
  icon?: ReactNode
  onClick?: () => void
  divider?: boolean
  disabled?: boolean
  danger?: boolean
}
```

**Usage Examples:**

```tsx
// User menu
<Dropdown
  trigger={<Avatar src={user.avatar} />}
  items={[
    { label: 'Profile', icon: <UserIcon />, onClick: goToProfile },
    { label: 'Settings', icon: <SettingsIcon />, onClick: goToSettings },
    { divider: true },
    { label: 'Logout', icon: <LogoutIcon />, onClick: logout, danger: true }
  ]}
/>

// Action menu
<Dropdown
  trigger={<Button icon={<MoreIcon />} />}
  items={[
    { label: 'Edit', onClick: handleEdit },
    { label: 'Duplicate', onClick: handleDuplicate },
    { label: 'Delete', onClick: handleDelete, danger: true }
  ]}
/>
```

### Organisms (Complex Components)

#### DataTable

Advanced table with sorting, filtering, and pagination.

```tsx
interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  pagination?: PaginationConfig
  sorting?: SortingConfig
  filtering?: FilteringConfig
  selection?: SelectionConfig
  actions?: ActionConfig
}
```

**Usage Examples:**

```tsx
// Basic table
<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (value) => <Badge>{value}</Badge> }
  ]}
  data={users}
/>

// With pagination and sorting
<DataTable
  columns={columns}
  data={data}
  pagination={{
    page: currentPage,
    pageSize: 20,
    total: totalItems,
    onChange: setCurrentPage
  }}
  sorting={{
    field: sortField,
    direction: sortDirection,
    onChange: handleSort
  }}
/>
```

#### FormBuilder

Dynamic form generation component.

```tsx
interface FormBuilderProps {
  fields: FormField[]
  values: Record<string, any>
  errors?: Record<string, string>
  onChange: (values: Record<string, any>) => void
  onSubmit: (values: Record<string, any>) => void
  layout?: 'vertical' | 'horizontal' | 'inline'
}
```

**Usage Examples:**

```tsx
// Dynamic form
<FormBuilder
  fields={[
    { name: 'title', type: 'text', label: 'Title', required: true },
    { name: 'category', type: 'select', label: 'Category', options: categories },
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'publish', type: 'checkbox', label: 'Publish immediately' }
  ]}
  values={formValues}
  errors={formErrors}
  onChange={setFormValues}
  onSubmit={handleSubmit}
/>
```

## 🎭 Component States

### Interactive States

All interactive components support these states:

- **Default**: Normal resting state
- **Hover**: Mouse over state
- **Focus**: Keyboard navigation state
- **Active**: During interaction
- **Disabled**: Non-interactive state
- **Loading**: Async operation in progress

### Validation States

Form components support validation:

- **Valid**: Green border/icon
- **Invalid**: Red border/icon with error message
- **Warning**: Yellow border/icon with warning
- **Info**: Blue border/icon with helper text

## ♿ Accessibility

### Keyboard Navigation

All components support keyboard navigation:

- `Tab`: Move focus forward
- `Shift + Tab`: Move focus backward
- `Enter/Space`: Activate buttons and links
- `Arrow keys`: Navigate menus and lists
- `Escape`: Close modals and dropdowns

### Screen Reader Support

- Semantic HTML elements
- ARIA labels and descriptions
- Live regions for dynamic content
- Proper heading hierarchy
- Form field associations

### Focus Management

- Visible focus indicators
- Focus trap in modals
- Focus restoration after modal close
- Skip links for navigation

## 📱 Responsive Design

### Breakpoints

```scss
$breakpoint-sm: 640px;   // Mobile landscape
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 1024px;  // Desktop
$breakpoint-xl: 1280px;  // Large desktop
$breakpoint-2xl: 1536px; // Extra large
```

### Responsive Utilities

```tsx
// Responsive visibility
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">Responsive padding</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

## 🎬 Animation

### Transition Timing

```scss
$transition-fast: 150ms;
$transition-base: 250ms;
$transition-slow: 500ms;

// Easing functions
$ease-in: cubic-bezier(0.4, 0, 1, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Patterns

- **Fade**: Opacity transitions
- **Scale**: Size transitions
- **Slide**: Position transitions
- **Collapse**: Height transitions

## 📦 Component Exports

```tsx
// Individual imports (recommended)
import { Button } from '@lionspace/ui/button'
import { Card } from '@lionspace/ui/card'

// Barrel import (larger bundle)
import { Button, Card, Modal } from '@lionspace/ui'

// Tree-shakeable imports
import Button from '@lionspace/ui/dist/button'
```

## 🧪 Testing Components

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@lionspace/ui'

describe('Button', () => {
  it('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## 📚 Resources

- [Storybook](http://localhost:6006) - Interactive component playground
- [Design Tokens](./design-tokens.md) - Complete token reference
- [Patterns](./patterns.md) - Common UI patterns
- [Migration Guide](./migration.md) - Upgrading from v2

## 🤝 Contributing

See [Contributing Guide](./CONTRIBUTING.md) for component development guidelines.