# ADR-002: Next.js 15 App Router

## Status
Accepted

## Context
We need to choose between Next.js Pages Router and App Router for our application architecture.

## Decision
We will use Next.js 15 App Router with React Server Components for the following structure:
- Route groups for organization: `(auth)`, `(dashboard)`, `(public)`
- Server Components by default
- Client Components only when needed (interactivity)
- Streaming and Suspense for better UX

## Consequences

### Positive
- **Better Performance**: Server Components reduce client bundle
- **Improved DX**: Simpler data fetching with async components
- **Modern Features**: Streaming, parallel routes, intercepting routes
- **SEO Benefits**: Better server-side rendering
- **Type Safety**: End-to-end TypeScript with server/client boundary

### Negative
- **Learning Curve**: New mental model for React developers
- **Migration Complexity**: From pages to app directory
- **Ecosystem Compatibility**: Some libraries need updates

## Implementation
```
app/
├── (public)/         # Public routes
├── (auth)/          # Auth flow
├── (dashboard)/     # Protected routes
├── api/            # API routes
└── layout.tsx      # Root layout
```