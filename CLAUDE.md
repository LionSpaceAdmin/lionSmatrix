# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lions of Zion is a military-grade information warfare defense platform built as a monorepo with Next.js 15, TypeScript, and Turbo. The platform provides intelligence tools, threat analysis, and disinformation detection capabilities.

## Monorepo Structure

This is a Turbo-managed monorepo with the following architecture:

- **`apps/`** - Individual applications
  - `apps/web/` - Main Next.js application (primary development focus)
  - `apps/admin/`, `apps/mobile/`, `apps/extension/` - Future applications
- **`packages/`** - Shared packages and libraries
  - `packages/@lionspace/` - Core LionSpace packages
- **`services/`** - Backend services and APIs

## Development Commands

### Root Level (Turbo Commands)
```bash
# Start all development servers
pnpm dev

# Build all applications
pnpm build

# Run all linting
pnpm lint

# Run type checking across all packages
pnpm type-check

# Run all tests
pnpm test

# Clean all build outputs
pnpm clean
```

### Web App Specific (`apps/web/`)
```bash
cd apps/web

# Development server with turbo
pnpm dev

# Build for production
pnpm build

# Type checking only
pnpm type-check

# Linting with auto-fix
pnpm lint:fix

# Unit tests with Vitest
pnpm test
pnpm test:watch
pnpm test:ui
pnpm test:coverage

# E2E tests with Playwright
pnpm e2e:headless
pnpm e2e:ui

# Bundle analysis
pnpm analyze

# Visual verification
pnpm verify
```

## Architecture Patterns

### Component Organization
Components follow Atomic Design methodology:
- `components/atoms/` - Basic building blocks
- `components/molecules/` - Simple groups of atoms  
- `components/organisms/` - Complex UI components
- `components/templates/` - Page-level layout components

### Path Aliases (apps/web)
Key TypeScript path mappings:
```typescript
"@/*": ["./*"]
"@/components/*": ["./components/*"]
"@/lib/*": ["./lib/*"] 
"@/app/*": ["./app/*"]
"@/atoms/*": ["./components/atoms/*"]
"@/molecules/*": ["./components/molecules/*"]
"@/organisms/*": ["./components/organisms/*"]
```

### App Router Structure (`apps/web/app/`)
Next.js 15 App Router with grouped routes:
- `(public)/` - Public-facing pages
- `(auth)/` - Authentication flow
- `(dashboard)/` - Main application dashboard
- `(academy)/` - Knowledge base
- `(trust)/` - Trust and transparency
- `(enterprise)/` - Enterprise features

## Technology Stack

### Core Framework
- **Next.js 15** with App Router and Turbo mode
- **React 19** with concurrent features
- **TypeScript 5** with strict mode

### UI & Styling  
- **Tailwind CSS 4** with @tailwindcss/postcss
- **Radix UI** components for primitives
- **Framer Motion** for animations
- **Lucide React** for icons

### Data & State
- **Drizzle ORM** with PostgreSQL
- **React Query (@tanstack/react-query)** for server state
- **Zustand** for client state (when needed)

### Testing
- **Vitest** for unit/integration tests
- **Playwright** for E2E testing
- **@testing-library/react** for component testing
- **axe-playwright** for accessibility testing

## Database (Drizzle)

Database configuration is in `apps/web/drizzle.config.ts`:
```bash
# Generate migrations
pnpx drizzle-kit generate

# Run migrations  
pnpx drizzle-kit push

# Open database studio
pnpx drizzle-kit studio
```

## Environment Setup

Copy `.env.example` to `.env.local` and configure:
- Database connection
- API keys (Gemini, etc.)
- Authentication providers

## Testing Strategy

### Unit Tests (Vitest)
- Located alongside source files or in `test/` directories
- Run with `pnpm test` from web app directory
- Coverage reports generated in `coverage/`

### E2E Tests (Playwright)
- Located in `apps/web/e2e/`
- Run with `pnpm e2e:headless` or `pnpm e2e:ui`
- Includes accessibility and performance testing

### Quality Checks
Always run before committing:
```bash
pnpm lint        # ESLint + Prettier
pnpm type-check  # TypeScript compiler
pnpm test        # Unit tests  
pnpm e2e:headless # E2E tests
```

## Build & Deployment

### Production Build
```bash
pnpm build       # Builds all apps/packages
pnpm start       # Starts production server
```

### Bundle Analysis
```bash
cd apps/web
ANALYZE=true pnpm build  # Generates bundle analyzer report
```

## Agent System Architecture

LionSpace V3 features a sophisticated multi-agent system for specialized development tasks. The system is managed through `.claude/agents-config.json` and provides coordinated workflows.

### Agent Categories

#### High Priority Agents
- **Frontend Squad**: `frontend-developer`, `ui-ux-designer`, `ui-visual-validator`, `performance-engineer`, `seo-meta-optimizer`
- **Backend Squad**: `backend-architect`, `api-documenter`, `database-admin`, `database-optimizer`, `cloud-architect`
- **Quality Squad**: `test-automator`, `code-reviewer`, `error-detective`, `debugger`
- **Psychology Squad**: `cognitive-load-manager`, `trust-architecture-builder`, `trauma-informed-ux`, `bias-correction-specialist`

#### Medium Priority Agents
- **Programming Specialists**: `typescript-pro`, `javascript-pro`, `python-pro`, `golang-pro`, `rust-pro`
- **DevOps Team**: `deployment-engineer`, `devops-troubleshooter`, `kubernetes-architect`, `terraform-specialist`, `security-auditor`
- **Data Team**: `data-scientist`, `data-engineer`, `ml-engineer`, `mlops-engineer`, `quant-analyst`

### Core Workflows

#### UI Component Development
```bash
# Sequential workflow for new components
claude --workflow ui-implementation --component "ProductCard"
# Flow: ui-ux-designer → frontend-developer → ui-visual-validator → test-automator
```

#### Full-Stack Feature Development
```bash
# Parallel workflow for complete features
claude --workflow fullstack-development --feature "user-authentication"
# Teams: Frontend + Backend + Database + Testing working together
```

#### Performance Optimization
```bash
# Collaborative optimization workflow
claude --workflow performance-optimization --target "apps/web"
# Teams: performance-engineer + frontend-developer + seo-meta-optimizer
```

### Agent Management Commands

#### Single Agent Tasks
```bash
# Frontend development
claude --agent frontend-developer "Create responsive navigation component"

# Code review
claude --agent code-reviewer --review "src/components/Navigation.tsx"

# Performance analysis
claude --agent performance-engineer --analyze "Core Web Vitals"
```

#### Multi-Agent Coordination
```bash
# Hand-off between agents
claude --handoff --from ui-ux-designer --to frontend-developer \
  --task "Implement design system components"

# Collaborative work
claude --collaborate frontend-developer,backend-architect,test-automator \
  --task "Build user dashboard with real-time data"
```

#### Workflow Management
```bash
# Check agent status
claude --status --category frontend
claude --status --all

# Monitor active workflows
claude --workflows --active

# View agent performance metrics
claude --metrics --agent frontend-developer --period 7d
```

### Agent Communication Protocols

#### Handoff Protocol
Structured information transfer between agents:
```json
{
  "from": "ui-ux-designer",
  "to": "frontend-developer",
  "deliverables": ["design-system.figma", "component-specs.md"],
  "requirements": ["responsive", "accessible", "dark-mode"],
  "priority": "high"
}
```

#### Collaboration Protocol
Multiple agents working on shared tasks:
```json
{
  "type": "collaboration",
  "agents": ["frontend-developer", "backend-architect", "test-automator"],
  "task": "user-authentication-system",
  "roles": {
    "frontend-developer": "UI implementation",
    "backend-architect": "API design",
    "test-automator": "E2E testing"
  }
}
```

### Complex Task Examples

#### New Page Creation
```bash
# Create complete About page with SEO and testing
claude --multi-agent \
  --sequence "ui-ux-designer,frontend-developer,seo-meta-optimizer,test-automator" \
  --task "Create About page with optimal SEO and full test coverage"
```

#### Database Migration
```bash
# Safe database schema changes
claude --collaborate "backend-architect,database-admin,test-automator" \
  --task "Add notifications table with safe migration strategy"
```

#### Performance Audit
```bash
# Comprehensive performance analysis and optimization
claude --workflow performance-optimization \
  --scope "full-app" \
  --target "lighthouse-score-90+" \
  --agents "performance-engineer,frontend-developer,seo-meta-optimizer"
```

### Quality Assurance

#### Automated Review Process
All code changes go through:
1. **Static Analysis**: `typescript-pro` for type safety
2. **Code Review**: `code-reviewer` for best practices
3. **Testing**: `test-automator` for comprehensive coverage
4. **Performance**: `performance-engineer` for optimization
5. **Security**: `security-auditor` for vulnerability assessment

#### Quality Metrics
- Code review score: Target 8/10
- Test coverage: Target 80%+
- Performance score: Target 90+ Lighthouse
- Security rating: Target A grade
- Accessibility: Target WCAG 2.2 AA

### Integration with Development Workflow

#### Git Integration
Agents automatically:
- Create feature branches for new work
- Commit with structured messages
- Create pull requests with detailed descriptions
- Perform code reviews on PRs
- Merge after all checks pass

#### CI/CD Integration
Agents coordinate with:
- GitHub Actions for automated testing
- Vercel for deployment previews
- Lighthouse for performance monitoring
- Security scanning for vulnerability detection

## Important Notes

- **Turbo Integration**: Use root-level commands for cross-package operations
- **Monorepo Dependencies**: Packages can reference each other via workspace protocol
- **Path Mapping**: Use TypeScript path aliases for clean imports
- **Component Standards**: Follow Atomic Design patterns
- **Testing Coverage**: Maintain high test coverage for critical paths
- **Performance**: Monitor bundle size and Core Web Vitals
- **Agent Coordination**: Maximum 3 concurrent agents for optimal performance
- **Quality Gates**: All agent outputs must pass automated quality checks