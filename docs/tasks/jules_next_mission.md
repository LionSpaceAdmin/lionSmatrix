# Agent Mission — UI/UX Alignment Finish, Tokens, and CI Hardening

This is a focused follow‑up mission for Jules (or any agent) to complete the remaining gaps found during the Study & Learn mapping and checklist review.

## Context (Done vs. Open)
- Done: Routing/pages/tools scaffolded; i18n plumbing; telemetry helper; Tailwind setup; CI with Vitest, Playwright, axe, Lighthouse; docs consolidated; live map published.
- Open: CSS tokenization in globals.css; Tailwind semantic mapping; reduced‑motion + focus rings; i18n cookie on locale switch; CI artifact uploads on failure; foundations progress notes.

## Objectives
- Finalize design tokens and apply consistently across UI.
- Harden UX accessibility (reduced motion, focus, contrast) and confirm budgets.
- Tighten i18n user flow and CI developer experience.

## Deliverables
- globals.css updated with full :root primitives + semantic tokens.
- tailwind.config.ts maps semantic tokens (HSL var pattern) and exposes utilities.
- Storybook Foundations: Colors + Typography stories added and green.
- Locale switch persists (cookie) and middleware respects it.
- CI uploads artifacts (screenshots/reports) on failures.
- _reports/root-layout.PROGRESS.md created/updated with decisions and status.

## Constraints
- RSC by default; client components only where required (e.g., locale switch, toasts).
- No secrets committed; public keys keep in .env.local. Production should avoid exposing secrets.
- Budgets: LCP ≤ 2.5s, CLS < 0.1, TBT ≤ 200ms, a11y ≥ 95.

## Work Items (Checklist)
1) Tokens and Styling
- [ ] Define primitives + semantic tokens in `src/app/globals.css` (:root).
- [ ] Map tokens via `tailwind.config.ts` extend.colors using `hsl(var(--token) / <alpha-value>)`.
- [ ] Replace inline hex usages in key components with tokenized utilities.
- [ ] Add reduced‑motion helpers and visible focus rings in `globals.css`.
- [ ] Validate AA contrast (axe) across home, daily‑brief, archive.

2) Storybook Foundations
- [ ] Add `Foundations/Colors` and `Foundations/Typography` stories showing tokens and guidance.
- [ ] Verify RTL rendering and small screens.

3) i18n flow
- [ ] Locale switcher sets a `locale` cookie client‑side; middleware consumes it.
- [ ] Document behavior in `AGENTS.md` and `GEMINI.md` (i18n section).

4) CI DX
- [ ] `.github/workflows/ci.yml`: upload Playwright/Lighthouse artifacts on failure.
- [ ] Keep budgets green; fix regressions found by CI.

5) Documentation
- [ ] `_reports/root-layout.PROGRESS.md` with status/decisions/next steps.
- [ ] Update `DESIGN_TOKENS.md` if token names change; link foundations stories.

## Definition of Done
- `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e` pass locally and in CI.
- Lighthouse budgets pass in CI; axe ≥ 95 on the tested pages.
- Locale preference persists via cookie; middleware honors it.
- Storybook foundations pages exist and reflect the token set.
- Live map still opens without overlaps at 80–120% zoom and reflects structure.

## Pointers
- Tokens: `src/app/globals.css:1`, `tailwind.config.ts:1`
- Locale: `src/components/layout/locale-switcher.tsx:1`, `middleware.ts:1`, `src/lib/i18n/*`
- CI: `.github/workflows/ci.yml:1`
- Docs: `DESIGN_TOKENS.md:1`, `AGENTS.md:1`, `docs/maps/lionsflow.study.md:1`

## Quick Agent Prompt (copy to Jules)

Role: Senior Next.js + Design System engineer
Objective: Finish tokens + a11y theme hardening, persist locale cookie, add CI artifacts, and document foundations.
Scope: Update globals.css, tailwind config, Storybook foundations, locale switch + middleware, CI uploads, progress report.
Constraints: RSC by default, no secrets, keep a11y/perf budgets green.
Deliverables: Updated code + stories, green CI, updated docs, no dead hex usage in components.

Steps:
1) Define :root tokens and semantic map in globals.css; map via tailwind.config.ts.
2) Replace inline hex in primitives (button/input/card/dialog/etc.).
3) Add reduced‑motion + focus ring utilities; confirm axe ≥ 95 on home/daily‑brief/archive.
4) Persist locale via cookie on switch; ensure middleware respects cookie.
5) CI: upload artifacts on failure; keep Lighthouse budgets passing.
6) Docs: create `_reports/root-layout.PROGRESS.md` and update tokens doc if names changed.

