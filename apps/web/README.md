# @lionspace/web

## 📦 Main Web Application

The primary Next.js 15 application for the LionSpace V3 platform.

## 🚀 Quick Start

```bash
# From monorepo root
pnpm dev

# Or from this directory
cd apps/web
pnpm dev
```

## 📁 Project Structure

```
apps/web/
├── app/                  # Next.js App Router
│   ├── (public)/        # Public routes
│   ├── (auth)/          # Authentication
│   ├── (dashboard)/     # Protected dashboard
│   └── api/             # API routes
├── components/          # React components
│   ├── atoms/           # Basic components
│   ├── molecules/       # Composite components
│   └── organisms/       # Complex components
├── lib/                 # Utilities and helpers
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── db/             # Database configuration
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript definitions
```

## 🛠 Available Scripts

```bash
# Development
pnpm dev              # Start dev server on port 3000
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm e2e              # Run E2E tests
pnpm e2e:ui           # Run E2E tests with UI

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm type-check       # Check TypeScript types
pnpm format           # Format with Prettier

# Analysis
pnpm analyze          # Analyze bundle size
pnpm lighthouse       # Run Lighthouse audit
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lionspace

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# External APIs
GEMINI_API_KEY=your-gemini-key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### TypeScript Paths

Configured path aliases in `tsconfig.json`:

```typescript
import { Button } from '@/components/atoms/Button'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
```

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### E2E Tests (Playwright)

```bash
# Headless
pnpm e2e:headless

# With UI
pnpm e2e:ui

# Debug mode
pnpm e2e:debug
```

### Visual Regression (Percy)

```bash
pnpm percy
```

## 🎨 Component Development

### Using Components

```tsx
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/molecules/Card'
import { Dashboard } from '@/components/organisms/Dashboard'

export function MyComponent() {
  return (
    <Dashboard>
      <Card title="Example">
        <Button variant="primary">Click me</Button>
      </Card>
    </Dashboard>
  )
}
```

### Creating Components

Follow Atomic Design principles:

1. **Atoms**: Basic building blocks (Button, Input, Badge)
2. **Molecules**: Simple combinations (Card, FormField, Modal)
3. **Organisms**: Complex sections (Header, Dashboard, Gallery)
4. **Templates**: Page layouts (AuthLayout, DashboardLayout)

## 🔄 State Management

### Server State (React Query)

```tsx
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}
```

### Client State (Zustand)

```tsx
import { useStore } from '@/lib/store'

function MyComponent() {
  const { user, setUser } = useStore()
}
```

## 🚢 Deployment

### Build

```bash
pnpm build
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Tests passing (87% coverage)
- [ ] TypeScript errors fixed
- [ ] Bundle size optimized (<300KB)
- [ ] Lighthouse score >90

## 📊 Performance Metrics

- **Lighthouse Score**: 92/100
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Bundle Size**: ~280KB gzipped
- **Test Coverage**: 87%

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests: `pnpm test`
4. Check types: `pnpm type-check`
5. Lint: `pnpm lint:fix`
6. Commit with conventional format
7. Open PR

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Component Library](../../packages/@lionspace/ui/README.md)
- [API Documentation](../../docs/api/README.md)
- [Architecture Guide](../../docs/ARCHITECTURE.md)

## 📄 License

MIT © LionSpace Team