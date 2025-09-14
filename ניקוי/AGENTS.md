# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed by pnpm + Turborepo.
- `apps/web` — Next.js (App Router). Key folders: `app/`, `components/`, `public/`, `tests/`.
- `services/*` — Python FastAPI microservices (e.g., `auth-api`, `ai-gateway`, `rag-service`, `fact-check-service`). Each has `main.py`, `openapi.yaml`, `Dockerfile`.
- `packages/@lionspace/*` — Shared TS libraries (ui, ai, mock-data, etc.).
- `libs/*` — Internal Node/TS tooling (analytics-engine, network-topology, file-scanner, sync-engine).
- `database/schema.sql` — PostgreSQL schema. `docs/` — guides. `scripts/` — utilities.

## Build, Test, and Development Commands
- Prereqs: Node 20+, pnpm 8+; Python 3.10+ for services; Docker optional.
- Install: `pnpm install`
- Dev (workspace): `pnpm dev`  | Web only: `pnpm --filter @lionspace/web dev`
- Build/Start: `pnpm build` / `pnpm start`
- Lint/Types/Format: `pnpm lint`, `pnpm type-check`, `pnpm format`
- Tests (workspace): `pnpm test` | Unit: `pnpm test:unit` | E2E: `pnpm test:e2e` | A11y: `pnpm test:a11y`
- Web app coverage: `cd apps/web && pnpm test:coverage`
- Docker compose (web + db + redis): `pnpm docker:compose`
- Run a service locally: `cd services/auth-api && uvicorn main:app --reload`

## Coding Style & Naming Conventions
- Prettier: 2-space indent, width 120, no semicolons, trailing commas (es5).
- ESLint: TypeScript/React/Next/A11y rules enforced; Husky + lint-staged fix on commit.
- Naming: Components PascalCase (`NetworkVisualizer.tsx`), hooks `useX.ts`, tests `*.spec.ts` (e2e) and `*.test.ts`/`*.spec.ts` (unit).

## Testing Guidelines
- Unit: Vitest (`apps/web/vitest.config.ts`). Prefer fast, focused tests per module.
- E2E: Playwright (`apps/web/tests/*`). Ensure app is running on `http://localhost:3000`.
- Accessibility: `pnpm test:a11y`; Performance: `pnpm test:perf` (LHCI).
- Aim for meaningful coverage on critical paths; include regression tests with bug fixes.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`. Scope with folder when helpful, e.g., `feat(apps/web): add dashboard cards`.
- Before PR: run `pnpm run test:all` and fix lint/types.
- PRs: clear description, linked issues, screenshots for UI changes, and notes on testing/rollout. Keep changes scoped per package.

## Security & Configuration Tips
- Copy envs: `cp .env.example .env` and `cp apps/web/.env.example apps/web/.env`. Do not commit secrets.
- Local DB: use Docker (`docker-compose.yml`) or apply `database/schema.sql` to your PostgreSQL instance.
