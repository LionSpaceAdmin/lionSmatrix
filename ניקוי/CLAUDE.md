# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lions of Zion - A military-grade information warfare defense platform built with Next.js 15, TypeScript, and Tailwind CSS. This is a monorepo using pnpm workspaces and Turbo for build orchestration.

## Essential Commands

### Development
```bash
# Start development server (uses pnpm)
pnpm dev                  # Runs on http://localhost:3000
cd apps/web && pnpm dev   # Run from web app directly

# Clear cache and restart (when encountering Next.js cache issues)
cd apps/web && rm -rf .next && pnpm dev
```

### Building & Testing
```bash
# Build the application
pnpm build

# Linting and type checking
pnpm lint           # Run ESLint
pnpm type-check     # TypeScript type checking
pnpm format         # Format with Prettier

# Testing
pnpm test           # Unit tests with Vitest
pnpm test:e2e       # E2E tests with Playwright
pnpm test:e2e:ui    # Playwright UI mode
pnpm test:a11y      # Accessibility tests
pnpm test:all       # Run all tests
```

### Package Management
```bash
# Install dependencies (ALWAYS use pnpm)
pnpm install

# Add package to specific workspace
pnpm add <package> --filter @lionspace/web
pnpm add -D <package> --filter @lionspace/web  # Dev dependency

# Add to workspace root
pnpm add -w <package>
```

## Architecture

### Monorepo Structure
```
lionspace-platform/
├── apps/
│   └── web/                    # Next.js 15 application (App Router)
│       ├── app/                # App Router pages and layouts
│       │   ├── (public)/       # Public pages
│       │   ├── (auth)/         # Authentication flows
│       │   ├── (dashboard)/    # Protected dashboard
│       │   ├── (academy)/      # Knowledge base
│       │   ├── (trust)/        # Trust center
│       │   └── (enterprise)/   # Enterprise features
│       ├── components/         # React components
│       │   ├── ui/            # Base UI components (shadcn/ui)
│       │   ├── auth/          # Authentication components
│       │   ├── layouts/       # Layout components
│       │   └── dashboard/     # Dashboard-specific components
│       ├── lib/               # Utilities and helpers
│       ├── contexts/          # React contexts
│       └── public/            # Static assets
├── packages/                   # Shared packages
│   └── @lionspace/
│       ├── agents/            # AI agent configurations
│       ├── core/              # Core business logic
│       ├── ui/                # Shared UI components
│       └── mock-data/         # Mock data for development
├── services/                  # Microservices (future)
├── infrastructure/            # Deployment configurations
└── docs/                      # Documentation
```

### Key Technical Decisions

1. **Next.js 15 App Router** - Using RSC (React Server Components) by default
2. **pnpm Workspaces** - Monorepo package management
3. **Turbo** - Build system for monorepo
4. **Tailwind CSS + shadcn/ui** - Styling system
5. **TypeScript** - Type safety throughout
6. **Mock implementations** - Currently using mocks for auth and external services

### Critical Files

- `.env.local` - Environment variables (contains sensitive data - handle with care)
- `turbo.json` - Turbo pipeline configuration
- `pnpm-workspace.yaml` - Workspace configuration
- `apps/web/middleware.ts` - Next.js middleware for route protection
- `apps/web/lib/auth.ts` - Authentication implementation (currently mocked)

## Current State & Known Issues

### Mock Implementations
The following are currently mocked and need real implementations when dependencies are resolved:
- Authentication (`apps/web/lib/auth.ts`)
- Web vitals tracking (`apps/web/lib/web-vitals.ts`)
- Radix UI components (`apps/web/lib/radix-ui-mocks.tsx`)
- Translation context (`apps/web/contexts/translation-context.tsx`)

### Permission Issues
If encountering pnpm permission errors:
```bash
pnpm config set store-dir ~/.pnpm-store
```

### Environment Setup
Required environment variables are in `.env.local`. Critical ones include:
- `GOOGLE_CLOUD_PROJECT` - GCP project ID
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON
- `NEXTAUTH_URL` - Authentication URL
- Various API keys (Gemini, OAuth, etc.)

## Security Considerations

1. **Credentials** - All sensitive files should be in `/credentials/` directory (gitignored)
2. **Service Account** - GCP service account JSON should never be committed
3. **Environment Files** - Only `.env.example` should be in version control
4. **API Keys** - All keys should be loaded from environment variables

## Development Workflow

### Running the Development Server
1. Ensure pnpm is installed globally
2. Run `pnpm install` to install dependencies
3. Copy `.env.example` to `.env.local` and configure
4. Run `pnpm dev` to start the development server
5. Access at `http://localhost:3000`

### Making Changes
1. Most code changes will be in `apps/web/`
2. Shared components go in `packages/@lionspace/ui/`
3. Business logic goes in `packages/@lionspace/core/`
4. Use existing component patterns from `apps/web/components/`

### Component Development
- Use Server Components by default (no "use client" directive)
- Add "use client" only when needed (hooks, browser APIs, interactivity)
- Follow existing patterns in `components/ui/` for new components
- Use Tailwind classes with `cn()` utility for conditional styling

## Agent Prompts

The file `lions_of_zion_agent_prompts_claude_spark_full_pack.md` contains detailed prompts for building each page/feature. Key principles from these prompts:

- **Design**: Dark theme, network/graph animations, bold typography
- **Performance**: LCP ≤ 2.5s, CLS < 0.1, a11y score ≥ 95
- **i18n**: Support for EN, HE, ES, FR, DE, AR with RTL for HE/AR
- **Components**: Reusable components like NarrativeCard, ProvenanceBadge, etc.
- **CTAs**: Standard CTAs like "Join the fight — Free", "Explore the War Machine"

## Debugging Tips

### Common Issues
1. **Module not found errors** - Clear `.next` cache: `rm -rf apps/web/.next`
2. **Permission errors** - Check pnpm store configuration
3. **500 errors** - Check for missing mock implementations
4. **Build failures** - Ensure all environment variables are set

### Useful Commands for Debugging
```bash
# Check running processes
ps aux | grep node

# Kill stuck processes
killall node

# Check port usage
lsof -i :3000

# Clear all caches
pnpm clean && rm -rf node_modules && pnpm install
```

## Performance Monitoring

The project includes performance monitoring setup:
- Web Vitals tracking (currently mocked)
- Sentry integration for error tracking
- Bundle analysis: `pnpm analyze:bundle`
- Performance tests: `pnpm test:perf`

## Deployment

Currently configured for:
- **Vercel** - Primary deployment platform
- **Docker** - Container deployment option
- **GCP Cloud Run** - Alternative deployment

Deployment commands:
```bash
pnpm deploy:preview  # Deploy to Vercel preview
pnpm deploy:prod     # Deploy to production
```