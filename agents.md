# Agent Configuration

## Environment Setup

This project requires Node.js, pnpm, and Next.js environment.

### Manual Setup

1.  **Install Dependencies**: `pnpm install`
2.  **Build Project**: `pnpm build`
3.  **Run Dev Server**: `pnpm dev`

## Key Commands

-   `pnpm dev`: Start development server.
-   `pnpm build`: Build for production.
-   `pnpm test`: Run unit tests with Vitest.
-   `pnpm test:e2e`: Run E2E tests with Playwright.
-   `pnpm lint`: Lint the code.
-   `pnpm typecheck`: Run TypeScript validation.

## Guardrails & Process

### Progress Discipline

-   For every new page or major component group (e.g., "Foundations"), you **must** create a `_reports/[feature-name].PROGRESS.md` file.
-   This file should be updated with the status, key decisions, and next steps for that unit of work.

### Testing

-   **Unit Tests**: All new logic and components should be accompanied by unit tests.
-   **E2E Tests**: The CI pipeline runs a full suite of E2E tests using Playwright.
    -   `test/e2e/basic.spec.ts`: Smoke tests for basic navigation.
    -   `test/e2e/axe.spec.ts`: Accessibility tests for key pages.
-   **Lighthouse**: The CI pipeline also runs Lighthouse to enforce performance and accessibility budgets defined in `lighthouserc.json`.

### Telemetry

-   Use the `track(event, payload)` function from `lib/telemetry.ts` for key user interactions.
-   Available events: `cta_click`, `tool_opened`.