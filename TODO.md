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
