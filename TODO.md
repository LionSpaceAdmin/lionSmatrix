# LionSpace — Single Source of Truth (Master TODO)

This is the only authoritative TODO file. All other scattered MD checklists were consolidated or removed. Items below reflect code reality as of now.

## Verified Complete
- [x] Monorepo structure (`apps/`, `packages/`, `services/`) organized
- [x] Component library `@lionspace/ui` in place (atoms, molecules, organisms, templates)
- [x] Core/data packages exist (`@lionspace/core`, `@lionspace/mock-data`)
- [x] Public routes implemented: `/`, `/opening`, `/daily-brief`, `/archive`, `/archive/[narrativeId]`, `/playbooks`, `/impact`, `/about`, `/faq`, `/contact`, `/search`, `/legal/{terms,privacy}`
- [x] Auth routes implemented: `/auth/{sign-in,join,onboarding}`
- [x] Dashboard routes implemented: `/dashboard`, tools (`image-influence-lab`, `fact-check`, `report-research`, `fake-resistance-tracker`, `deep-research-daily`), `campaigns`, `settings`, `analytics`, `war-room`
- [x] Trust routes implemented: `transparency`, `provenance`, `dsr`, `audit`, `privacy`
- [x] Enterprise section subpages implemented: `alerts`, `compliance`, `organization`, `threats`
- [x] Shared scaffolding present: `app/layout.tsx`, `app/providers.tsx`, `middleware.ts`, i18n helpers (`apps/web/lib/i18n/*`)

## High Priority Fixes (Blocking build/release)
- [ ] Resolve all TypeScript errors in `apps/web` (current: many)
- [ ] Auth: install/configure `next-auth` (Auth.js v5) and types; fix imports and handlers
- [ ] Add e2e/a11y/perf scaffolds (Playwright/axe/Lighthouse) and minimal CI workflow
- [ ] Sentry/web‑vitals wiring (minimal) disabled behind env flags

## Pages/Scaffolding Gaps vs Plan
- [ ] `(academy)/page.tsx` (index) — currently only subpages exist
- [ ] `(enterprise)/page.tsx` (index) — only subpages exist
- [ ] `(public)/head.tsx` — add SEO head where needed
- [ ] `apps/web/lib/telemetry.ts` — typed event stubs (`cta_click`, etc.)
- [ ] `apps/web/instrumentation.ts` — safe tracing stub
- [ ] Tailwind config: migrate to `tailwind.config.ts` (optional); ensure content globs are correct

## Quality/DevEx
- [ ] Fix ESLint setup in `apps/web` + workspace rules; run and address errors
- [ ] Add basic unit tests (vitest) for helpers and i18n utilities
- [ ] Ensure `pnpm-lock.yaml` stable; remove drift

## i18n & RTL
- [ ] Implement proper i18n library integration (e.g., next‑i18next) or finalize in‑house helper
- [ ] Complete translations for 6+ locales; validate RTL mirrors

## Deployment & Security
- [ ] Minimal CI (typecheck, lint, test) on PR/main
- [ ] Security headers checked at runtime; rate‑limit and CSRF utilities validated

## Success Metrics (targets)
- [ ] Lighthouse ≥ 90, LCP ≤ 2.5s, CLS < 0.1
- [ ] Bundle ≤ 500KB initial JS
- [ ] Test coverage ≥ 60% (initial target)

---

Notes
- This list replaces fragmented docs (pack prompts/checklists). Only verifiable code outcomes are marked done.
- If an item is not clearly implemented in code, it is listed as pending.

Last updated: current commit

## Backlog (from legacy docs)

# Project Status Checklist (Consolidated)

This file consolidates all open checklist items from project Markdown docs into a single actionable list. Each section links back to the original source file.

## Structure Verification (from docs/STRUCTURE_VERIFICATION_TREE.md)
- [ ] 100% כיסוי דפים מ-Agent Prompts
- [ ] 0 TypeScript errors
- [ ] Lighthouse score > 90 בכל הדפים
- [ ] 100% test coverage על דפים קריטיים
- [ ] Security headers בכל הנקודות
- [ ] Full i18n support (8 languages)
- [ ] Bundle size < 500KB
- [ ] LCP < 2.5s על mobile
- [ ] CLS < 0.1
- [ ] Accessibility score ≥ 95
- [ ] 0 security vulnerabilities

## Project Order Mission (from docs/PROJECT_ORDER_MISSION.md)
- [ ] 85% השלמה תוך שבוע (השלמת דפים חסרים)
- [ ] 95% השלמה תוך חודש (i18n מלא)
- [ ] Lighthouse > 90 בכל הדפים
- [ ] 0 TypeScript errors (נוכחי: 54 שגיאות)
- [ ] 100% test coverage לדפים קריטיים

## Implementation Plan (from docs/IMPLEMENTATION_PLAN.md)
- [ ] Remove cognitive-warfare (duplicate functionality)
- [ ] Remove matrix (moved to war-room)
- [ ] Remove platform (unclear purpose)
- [ ] Move _components content to components/
- [ ] Move _contexts content to contexts/
- [ ] Create layout.tsx
- [ ] Create page.tsx (Knowledge base home)
- [ ] Create /courses/page.tsx
- [ ] Create /playbooks/page.tsx
- [ ] Create /tutorials/page.tsx
- [ ] Create layout.tsx (Enterprise)
- [ ] Create page.tsx (Enterprise dashboard)
- [ ] Create /organization/page.tsx
- [ ] Create /threats/page.tsx
- [ ] Create /compliance/page.tsx
- [ ] Create /alerts/page.tsx
- [ ] Create layout.tsx (Transparency)
- [ ] Create page.tsx (Transparency hub)
- [ ] Create /privacy/page.tsx
- [ ] Create /provenance/page.tsx
- [ ] Create /audit/page.tsx
- [ ] ThreatAnalyzer.tsx
- [ ] NetworkVisualizer.tsx
- [ ] DeepfakeDetector.tsx
- [ ] NarrativeTracker.tsx
- [ ] EarlyWarningWidget.tsx
- [ ] AdversarySimConsole.tsx
- [ ] ProvenanceBadge.tsx
- [ ] PrebunkingKitBuilder.tsx
- [ ] SocialComposer.tsx
- [ ] PlatformRouter.tsx
- [ ] PublishQueue.tsx
- [ ] EngagementTracker.tsx
- [ ] MissionCard.tsx
- [ ] MissionProgress.tsx
- [ ] MissionRewards.tsx
- [ ] Move shadcn/ui components here
- [ ] Create common primitives
- [ ] gpt-adapter.ts
- [ ] claude-adapter.ts
- [ ] gemini-adapter.ts
- [ ] rag-pipeline.ts
- [ ] websocket-manager.ts
- [ ] sse-handler.ts
- [ ] backpressure.ts
- [ ] ipfs-client.ts
- [ ] l2-hasher.ts
- [ ] verifier.ts
- [ ] package.json (service skeleton)
- [ ] Dockerfile (service skeleton)
- [ ] src/index.ts (service skeleton)
- [ ] README.md (service skeleton)
- [ ] .env.example (service skeleton)
- [ ] Proper package.json with exports
- [ ] TypeScript config
- [ ] Build script
- [ ] Index barrel file
- [ ] Add graphql/ directory
- [ ] Create base proto definitions
- [ ] Create OpenAPI specs for each service
- [ ] Create JSONSchema for events
- [ ] Terraform modules for each service
- [ ] K8s manifests
- [ ] Monitoring dashboards
- [ ] Feature flag definitions
- [ ] ARCHITECTURE.md (detailed)
- [ ] CONTRIBUTING.md
- [ ] DEVELOPMENT.md
- [ ] DEPLOYMENT.md
- [ ] AI_AGENT_GUIDE.md
- [ ] COMPONENT_PATTERNS.md
- [ ] SERVICE_PATTERNS.md
- [ ] Run tree command and verify
- [ ] Check all imports work
- [ ] Verify no duplicates
- [ ] Test build process
- [ ] Write scripts/validate-structure.js
- [ ] Add to CI/CD pipeline

## GCP Service Account Setup (from docs/GCP_SERVICE_ACCOUNT_SETUP.md)
- [ ] פרויקט GCP נוצר
- [ ] APIs הופעלו (Vertex AI, Vision, Translation, Storage)
- [ ] Service Account נוצר עם הרשאות מתאימות
- [ ] מפתח JSON הורד ואוחסן בבטחה
- [ ] Environment variables הוגדרו
- [ ] Connection test עבר בהצלחה
- [ ] מפתח נוסף ל-.gitignore
- [ ] הרשאות קובץ הוגדרו ל-600

## Design Tokens (from docs/DESIGN_TOKENS.md)
- [ ] Replace inline colors with tokens
- [ ] Unify `.terminal-card` + `Card` component
- [ ] Add success/info semantic tokens
- [ ] Storybook: Foundations/Colors story
- [ ] Lint rule to prevent raw hex (except token files)

## Deployment Guide (from docs/DEPLOYMENT_GUIDE.md)
- [ ] All environment variables configured
- [ ] API endpoints verified
- [ ] Database connections tested
- [ ] Third-party services configured
- [ ] SSL certificates ready
- [ ] Domain names configured
- [ ] All tests passing
- [ ] No console errors
- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] CORS configured
- [ ] CSP headers set
- [ ] Rate limiting enabled
- [ ] Input validation complete
- [ ] Application loads correctly
- [ ] All routes accessible
- [ ] Authentication working
- [ ] API connections successful
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance metrics acceptable
- [ ] SSL certificate valid

## Agent Guide (from docs/AGENT_GUIDE.md)
- [ ] Read the architecture doc
- [ ] Identify affected components
- [ ] Check existing patterns
- [ ] Create/update page components
- [ ] Add necessary UI components
- [ ] Implement business logic in packages
- [ ] Create API endpoints if needed
- [ ] Manual testing in browser
- [ ] Check responsive design
- [ ] Verify data flow
- [ ] Test error states
- [ ] Add JSDoc comments
- [ ] Update relevant README
- [ ] Add TODO comments for future work

## Accessibility (from docs/ACCESSIBILITY.md)
- [ ] Tab through all interactive elements
- [ ] Use Enter/Space to activate buttons
- [ ] Use arrow keys in menus
- [ ] Escape closes modals
- [ ] No keyboard traps
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Error messages are announced
- [ ] Page structure makes sense
- [ ] Dynamic updates announced
- [ ] Zoom to 200% without horizontal scroll
- [ ] Text is readable at all sizes
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Works in high contrast mode

## Web Monitoring (from apps/web/MONITORING.md)
- [ ] Bundle size under limits (500KB JS, 50KB CSS)
- [ ] Core Web Vitals passing (LCP ≤ 2.5s, CLS < 0.1)
- [ ] Lighthouse score ≥ 90 (all categories)
- [ ] Error boundaries implemented
- [ ] Sentry configured and tested
- [ ] Source maps uploaded
- [ ] Performance monitoring active
- [ ] Weekly bundle analysis
- [ ] Monthly performance review
- [ ] Error rate monitoring (< 1%)
- [ ] User session analysis
- [ ] Performance budget alerts

## Local Dev Setup (from TODO_LOCAL_DEV_SETUP.md)
- [ ] Fix app/(trust)/privacy/page.tsx - TypeScript errors
- [ ] Fix components/hooks/useProgressiveEnhancement.ts - TypeScript errors
- [ ] Fix lib/security/csrf.ts - TypeScript errors
- [ ] Initialize auth service properly
- [ ] Initialize war-machine service properly
- [ ] Fix TypeScript configuration for services
- [ ] Update ESLint commands in service packages
- [ ] Install missing ESLint dependencies
- [ ] Update Next.js lint configuration
- [ ] Fix Next.js experimental.turbo deprecation
- [ ] Fix NODE_ENV warning
- [ ] Install node_modules for services
- [ ] Fix workspace lockfile issues
- [ ] Run TypeScript type checking
- [ ] Run ESLint
- [ ] Run build
- [ ] Run development server
- [ ] Clear all caches
- [ ] Run all tests
- [ ] Update development documentation
- [ ] All TypeScript errors resolved (0 errors)
- [ ] All ESLint errors resolved (0 errors)
- [ ] Build completes successfully
- [ ] Development server runs without errors
- [ ] All services properly initialized
- [ ] All tests pass
- [ ] Can access http://localhost:3000 without errors

## Main TODO (from TODO.md)
- [ ] Add MFA support
- [ ] Setup Sentry for error tracking
- [ ] Add performance monitoring (Web Vitals)
- [ ] Implement logging strategy
- [ ] Configure alerts
- [ ] Add uptime monitoring
- [ ] Create dashboards
- [ ] Create Terraform configurations
- [ ] Setup Kubernetes manifests
- [ ] Configure auto-scaling
- [ ] Add CDN configuration
- [ ] Setup database migrations
- [ ] Implement proper i18n library (next-i18next)
- [ ] Create translation files for all 8 languages
- [ ] Add translation management system
- [ ] Implement locale detection
- [ ] Add language switcher to all pages
- [ ] Fix RTL layout issues
- [ ] Add RTL-specific styles
- [ ] Test with native RTL speakers
- [ ] Configure fonts for each language
- [ ] Add locale-specific date/time formatting
- [ ] Lighthouse score > 90
- [ ] Bundle size < 500KB
- [ ] Time to Interactive < 3s
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Test coverage > 80%
- [ ] 0 TypeScript errors
- [ ] 0 ESLint warnings
- [ ] 0 security vulnerabilities
- [ ] 100% accessibility compliance
- [ ] Backup current codebase
- [ ] Create feature flags for risky changes
- [ ] Setup rollback procedures
- [ ] Document breaking changes
- [ ] Create migration guides
- [ ] Code is written and reviewed
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Performance impact is measured
- [ ] Security implications are considered
- [ ] Accessibility is verified
- [ ] PR is approved

---

Notes:
- Checked items in original files (e.g., TODO.md [x]) were intentionally not duplicated here to avoid confusion; this list tracks only remaining open items.
- Source files remain the single source of truth for historical context. This file is for day-to-day execution.

