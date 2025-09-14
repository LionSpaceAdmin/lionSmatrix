# Lions of Zion - Developer Guide

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/lions-of-zion/platform.git
cd platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
lionspace-merged/
├── apps/
│   └── web/                 # Next.js application
│       ├── app/             # App Router pages
│       │   ├── (public)/    # Public pages
│       │   ├── (auth)/      # Authentication flow
│       │   ├── (dashboard)/  # Protected dashboard
│       │   ├── (academy)/    # Knowledge base
│       │   ├── (trust)/     # Trust center
│       │   └── (enterprise)/ # Enterprise portal
│       ├── components/      # Reusable components
│       ├── lib/            # Utilities and helpers
│       └── public/         # Static assets
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── config/             # Shared configuration
│   └── tsconfig/           # TypeScript configs
└── docs/                   # Documentation
```

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Query + Zustand
- **Testing:** Playwright + Vitest
- **CI/CD:** GitHub Actions + Vercel

### Design Patterns
- **Server Components:** Default for all pages
- **Client Components:** Only for interactivity
- **Data Fetching:** Server-side with caching
- **Authentication:** Mock auth context (ready for real auth)
- **i18n:** 8 languages with RTL support

## 🎨 Component Development

### Creating a New Component

```tsx
// components/ui/my-component.tsx
'use client' // Only if needed

import { cn } from '@/lib/utils'

interface MyComponentProps {
  className?: string
  children?: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn('terminal-card', className)}>
      {children}
    </div>
  )
}
```

### Using Terminal Theme Classes

```css
/* Available utility classes */
.terminal-bg       /* Background */
.terminal-black    /* Black background */
.terminal-border   /* Border color */
.terminal-text     /* Text color */
.terminal-muted    /* Muted text */
.terminal-cyan     /* Primary color */
.terminal-green    /* Success color */
.terminal-red      /* Error color */
.terminal-yellow   /* Warning color */
.terminal-blue     /* Info color */
.terminal-card     /* Card component */
```

## 🌍 Internationalization

### Adding Translations

```typescript
// lib/i18n/translations.ts
export const translations = {
  en: {
    common: {
      title: 'Lions of Zion',
      // ...
    }
  },
  he: {
    common: {
      title: 'אריות ציון',
      // RTL automatically applied
    }
  }
  // ... other languages
}
```

### Using Translations

```tsx
import { useTranslation } from '@/lib/i18n/use-translation'

export function MyComponent() {
  const { t, locale, isRTL } = useTranslation()
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t('common.title')}</h1>
    </div>
  )
}
```

## 🔐 Authentication

### Protected Routes

```tsx
// app/(dashboard)/layout.tsx
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
```

### Using Auth Context

```tsx
import { useAuth } from '@/lib/auth/auth-context'

export function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>
  }
  
  return <div>Welcome, {user.name}!</div>
}
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:a11y

# All tests
npm run test:all
```

### Writing E2E Tests

```typescript
// e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test'

test('my feature works', async ({ page }) => {
  await page.goto('/my-page')
  await expect(page.locator('h1')).toContainText('Expected Text')
  await page.click('button')
  await expect(page).toHaveURL('/expected-url')
})
```

## 📊 Performance

### Optimization Checklist
- ✅ Use Server Components by default
- ✅ Implement proper caching strategies
- ✅ Lazy load heavy components
- ✅ Optimize images with next/image
- ✅ Use dynamic imports for code splitting
- ✅ Implement proper loading states
- ✅ Use Suspense boundaries

### Performance Budgets
- **LCP:** ≤ 2.5s
- **FID:** ≤ 100ms
- **CLS:** < 0.1
- **TBT:** ≤ 200ms
- **Bundle Size:** < 200kb (first load)

## 🚀 Deployment

### Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=https://api.lionsofzion.com
NEXT_PUBLIC_GEMINI_API_KEY=your-api-key

# Optional
NEXT_PUBLIC_ANALYTICS_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Debugging

### Common Issues

1. **Hydration Errors**
   - Check for client-only code in Server Components
   - Ensure consistent rendering between server and client

2. **RTL Layout Issues**
   - Use logical properties (start/end instead of left/right)
   - Test with both LTR and RTL locales

3. **Performance Issues**
   - Check React DevTools Profiler
   - Use Lighthouse for performance audits
   - Monitor bundle size with `npm run analyze`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Playwright](https://playwright.dev)
- [React Query](https://tanstack.com/query)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
