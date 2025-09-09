# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LionSpace Intelligence Platform - A Next.js 15 enterprise application with intelligence/threat analysis capabilities, featuring a terminal/cyber aesthetic design system.

## Tech Stack

- **Framework**: Next.js 15 with App Router (React 19)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS v4 with custom terminal theme
- **Database**: PostgreSQL 15 with Drizzle ORM
- **UI Components**: Radix UI primitives, shadcn/ui patterns
- **Testing**: Vitest (unit), Playwright (E2E), React Testing Library
- **Package Manager**: pnpm 10.0.0
- **Node Version**: >=20.0.0

## Essential Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm prettier         # Check Prettier formatting
pnpm prettier:fix     # Fix formatting issues
pnpm format           # Format all TS/TSX/MD files

# Testing
pnpm test             # Run Vitest tests
pnpm test:watch       # Watch mode for tests
pnpm test:coverage    # Generate coverage report
pnpm test:ui          # Vitest UI interface
pnpm e2e:headless     # Run Playwright tests
pnpm e2e:ui           # Playwright with UI

# Analysis
pnpm analyze          # Bundle size analysis
pnpm coupling-graph   # Generate architecture coupling graph

# Database (when using dev container)
db-up                 # Start PostgreSQL + Redis
db-down               # Stop databases
tools-up              # Start pgAdmin + Mailhog
```

## Architecture & Code Organization

### App Router Structure
```
app/
├── (auth)/              # Authentication route group
├── (intelligence)/      # Main platform routes (dashboard, analytics, matrix)
├── app/dashboard/       # Nested dashboard routes
├── api/                 # API routes
├── _components/         # App-specific components
├── _contexts/          # React contexts
└── *.tsx               # Root files (layout, page, error, not-found)
```

### Component Architecture
- **Atomic Design Pattern**: atoms → molecules → organisms → templates
- **shadcn/ui Pattern**: Copy-paste components in `components/ui/`
- **CVA for Variants**: Use class-variance-authority for component variants
- **Radix UI**: Leverage primitives for accessibility

### Database Schema (Drizzle ORM)
- Schema files: `/lib/db/schema/`
- Migrations: `/lib/db/migrations/`
- Tables: users (UUID PKs), sessions (auth)
- Use type-safe queries with Drizzle

## Critical Development Patterns

### Next.js 15 Breaking Changes
```typescript
// Async params and searchParams (NEW in Next.js 15)
export default async function Page({ params, searchParams }) {
  const { id } = await params;  // Must await!
  const { query } = await searchParams;  // Must await!
}

// Server Actions - async cookies/headers
import { cookies, headers } from 'next/headers';
const cookieStore = await cookies();  // Must await!
const headersList = await headers();  // Must await!
```

### Server Components First
- Default to Server Components for data fetching
- Use `'use client'` only when needed (interactivity, hooks, browser APIs)
- Fetch data directly in components, no API routes needed for SSR

### Terminal/Cyber Theme Styling
- Primary colors: Terminal green (`#00ff88`), cyan (`#00ffff`)
- Font: Space Mono (monospace) for terminal aesthetic
- Dark backgrounds with neon accents
- Use Tailwind utilities: `font-mono`, `text-green-400`, `bg-gray-900`

### Translation System
- Context: `TranslationProvider` in `contexts/translation-context.tsx`
- CSV-based messages in `/public/data/*.csv`
- Multi-language support (EN, HE, AR priority)
- Use: `const { t, getCurrentMessage } = useTranslation()`

## Testing Approach

### Unit/Integration Tests (Vitest)
```typescript
// Test files: *.test.ts, *.test.tsx
// Use describe/it/expect patterns
// Mock with vi.mock()
// Global test utilities available
```

### E2E Tests (Playwright)
```typescript
// Files: e2e/*.spec.ts
// Full browser automation
// Test user flows end-to-end
```

### Component Tests
```typescript
// Use React Testing Library
// render() from '@testing-library/react'
// userEvent for interactions
// screen queries for assertions
```

## Environment Configuration

- **T3 Env**: Type-safe env vars in `env.mjs`
- **Required vars**: See `.env.example`
- **Dev Container**: Full environment with PostgreSQL, Redis, pgAdmin
- **Ports**: 3000 (app), 5432 (PostgreSQL), 6379 (Redis), 5050 (pgAdmin)

## Common Tasks

### Adding a New Page
1. Create directory in appropriate route group
2. Add `page.tsx` with default export
3. Use Server Component by default
4. Add loading.tsx for Suspense fallback

### Creating Components
1. Follow atomic design (atoms/molecules/organisms)
2. Use TypeScript interfaces for props
3. Implement with Radix UI primitives when applicable
4. Style with Tailwind utilities and CVA

### Database Operations
1. Define schema in `/lib/db/schema/`
2. Generate migration: `pnpm drizzle-kit generate`
3. Apply migration: `pnpm drizzle-kit migrate`
4. Use type-safe queries with Drizzle ORM

### Adding Tests
1. Unit tests next to source files (*.test.ts)
2. E2E tests in `/e2e/` directory
3. Use testing utilities from setup files
4. Run specific test: `pnpm test path/to/test`

## Performance Considerations

- Use dynamic imports for code splitting
- Implement Suspense boundaries for streaming
- Optimize images with next/image
- Enable Turbopack in development (`--turbo`)
- Monitor bundle size with `pnpm analyze`

## Security Notes

- Validate all Server Actions input with Zod
- Use NEXT_PUBLIC_ prefix for client-side env vars
- Implement proper authentication/authorization
- Never expose sensitive data in client components
- Sanitize user input before rendering

## Agent System

The `/agents/` directory contains 80+ AI agent configurations for development assistance. These are specialized prompts for various development tasks.

## Debugging Tips

- Check server vs client component boundaries
- Verify async operations are awaited (Next.js 15)
- Use React DevTools for component inspection
- Check Network tab for API/fetch issues
- Review terminal for build/runtime errors
- Use `console.log` strategically in Server Components (shows in terminal)
- לא מדווחים שמשימה הושלמה ללא בדיקה ויזואלית בדפדפן

## 🚨 VISUAL VERIFICATION ENFORCEMENT (MANDATORY)

**CRITICAL REQUIREMENT**: For ANY UI-related task, you MUST perform visual verification before marking as complete.

### Pre-Completion Checklist for UI Tasks:
1. ✅ **Start Dev Server**: Ensure `pnpm dev` is running on port 3001
2. ✅ **Take Screenshots**: Use Playwright to capture visual evidence
3. ✅ **Run E2E Tests**: Execute `pnpm e2e:headless` for visual regression
4. ✅ **Verify Accessibility**: Check WCAG compliance
5. ✅ **Check Responsive**: Test on multiple viewport sizes
6. ✅ **Visual Validation**: Confirm UI actually works as intended

### Required Commands Before Marking UI Task Complete:
```bash
# 1. Ensure server is running
pnpm dev

# 2. Take screenshot for evidence
npx playwright screenshot http://localhost:3001 visual-evidence/screenshot.png

# 3. Run visual verification script
./scripts/check-visual-before-complete.sh

# 4. Run E2E tests
pnpm e2e:headless

# 5. ONLY if all pass → mark task complete
```

### Task CANNOT be marked complete if:
- ❌ No screenshots taken
- ❌ Dev server not running
- ❌ Visual tests not executed
- ❌ No browser verification performed
- ❌ Accessibility checks failed
- ❌ Responsive design not tested

### Environment Variables for Enforcement:
```bash
REQUIRE_VISUAL_VERIFICATION=true
MANDATORY_BROWSER_TESTING=true
AUTO_SCREENSHOT_VALIDATION=true
BLOCK_COMPLETION_WITHOUT_VISUAL_PROOF=true
```

**This is NOT optional - it's MANDATORY for all UI changes. Never report "task complete" without visual proof.**