# ADR-001: Monorepo Structure with Turbo

## Status
Accepted

## Context
We need to organize multiple applications and shared packages in a way that promotes code reuse, maintains consistency, and enables independent deployment while keeping development efficient.

## Decision
We will use a monorepo structure managed by Turborepo with the following organization:
- `apps/` - Individual applications (web, admin, mobile)
- `packages/` - Shared packages (@lionspace/ui, @lionspace/core, @lionspace/lib)
- `services/` - Backend services

## Consequences

### Positive
- **Code Reuse**: Shared components and utilities across all apps
- **Atomic Changes**: Single PR can update multiple packages
- **Consistent Tooling**: Same build, test, and lint configuration
- **Optimized Builds**: Turborepo caches and parallelizes builds
- **Type Safety**: Shared TypeScript types across packages

### Negative
- **Initial Complexity**: More setup required initially
- **Build Times**: Can grow with monorepo size (mitigated by Turbo caching)
- **Git Repository Size**: Single large repository

## Alternatives Considered
1. **Polyrepo**: Separate repositories for each app/package
   - Rejected due to versioning complexity and code duplication
2. **Nx**: Alternative monorepo tool
   - Rejected as Turbo is simpler and Next.js native

## Implementation
```json
{
  "workspaces": [
    "apps/*",
    "packages/*",
    "services/*"
  ]
}
```