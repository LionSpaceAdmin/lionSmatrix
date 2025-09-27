# Repository Guidelines

This repository is a Next.js (App Router) project managed with pnpm and TypeScript. Use this guide to develop, test, and contribute consistently.

## Project Structure & Module Organization
- `src/app/` — routes, layouts, and pages (Next.js).
- `src/components/{ui,shared,layout}/` — UI primitives and composite components.
- `src/lib/` — utilities, `telemetry.ts`, data helpers; `src/hooks/` — React hooks.
- `src/ai/` — Genkit flows and dev scripts.
- `test/` — unit tests (`test/**/*.test.*`) and E2E (`test/e2e/`).
- `_reports/` — progress logs per feature (see Process).
- `docs/`, `.storybook/`, `scripts/` — documentation, Storybook, helper scripts.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies.
- `pnpm dev` — start local dev server.
- `pnpm build` / `pnpm start` — production build and run.
- `pnpm test` — run unit tests (Vitest, jsdom).
- `pnpm test:e2e` — run Playwright E2E suite.
- `pnpm lint` — ESLint (Next.js rules) with autofix.
- `pnpm typecheck` — TypeScript validation.
- `pnpm storybook` — run Storybook locally.

## Coding Style & Naming Conventions
- TypeScript + React; prefer functional components and hooks.
- Files: kebab-case; components exported in PascalCase.
- Tests: `*.test.ts(x)` alongside source or in `test/`.
- Formatting/Linting: ESLint (`next/core-web-vitals`, `next/typescript`). Run `pnpm lint --fix` before commits.
- Styling: Tailwind CSS; prefer utility-first classes over custom CSS.

## Testing Guidelines
- Unit: cover new logic and components. Config in `vitest.config.ts` (jsdom, `test/setup.ts`).
- E2E: keep `test/e2e/basic.spec.ts` and `test/e2e/axe.spec.ts` green. Local run via `pnpm test:e2e`.
- Accessibility & Performance: CI runs axe and Lighthouse with budgets in `lighthouserc.json`. Don’t regress scores.

## Process: Work Tracking & Telemetry
- For every new page or major component group, create `_reports/<feature>.PROGRESS.md` and update with status, key decisions, and next steps.
- Instrument key interactions with `track(event, payload)` from `src/lib/telemetry.ts`.
  - Examples: `track('cta_click', { cta_name: 'Get Started', location: 'hero' })`, `track('tool_opened', { tool_name: 'image-lab' })`.

## Commit & Pull Request Guidelines
- Commits: prefer Conventional Commits (e.g., `feat(scope): ...`, `fix(scope): ...`).
- PRs: include a clear description, linked issues, screenshots for UI changes, test plan, and updated `_reports` entry.
- Before opening a PR: `pnpm lint && pnpm typecheck && pnpm test` and, when relevant, `pnpm test:e2e`.

## Security & Configuration Tips
- Store secrets in `.env.local`; never commit them. See `src/lib/firebase/client.ts` for runtime usage.
- Telemetry is console-only in development; avoid sending PII.
