# Roadmap

This document outlines the proposed roadmap for the Lions of Zion Website project, categorized into short, mid, and long-term horizons.

---

## Short-Term (0-2 Weeks)

### 1. Secure API Key by Moving API Calls to Backend

-   **Problem**: The Google Gemini API key is currently exposed on the client-side, creating a significant security risk.
-   **Proposed Change**: Create Next.js API routes to act as a proxy for all calls to the Google API. The frontend will call these internal API routes, and the server will securely append the API key to the requests sent to Google.
-   **Impact**: **High**. Prevents potential API abuse, financial loss, and service disruption.
-   **Effort**: M
-   **Owner**: Jules
-   **Dependencies**: None
-   **DoD**: The `NEXT_PUBLIC_GEMINI_API_KEY` is renamed to `GEMINI_API_KEY` (server-side only). All API calls from the client are directed to `/api/...` routes. The application is fully functional with this new architecture.
-   **Risk**: Low. This is a standard and recommended pattern for handling secret keys in web applications.
-   **Mitigation**: N/A.

### 2. Implement a Shared State Management Solution

-   **Problem**: Shared state and actions (e.g., `onOpenDossier`) are passed down through multiple layers of components via prop drilling.
-   **Proposed Change**: Introduce a lightweight state management solution (e.g., React Context, Zustand, or Jotai) to manage global or widely shared state.
-   **Impact**: Medium. Simplifies component architecture, reduces code complexity, and improves maintainability.
-   **Effort**: M
-   **Owner**: Jules
-   **Dependencies**: None
-   **DoD**: The `onOpenDossier` prop is removed from the `AiTerminal` and its children. The dossier opening logic is managed by the new state management solution.
-   **Risk**: Low.
-   **Mitigation**: N/A.

---

## Mid-Term (2-8 Weeks)

### 3. Enhance Test Coverage and Quality

-   **Problem**: The current test suite has gaps in coverage and some tests are not robust.
-   **Proposed Change**:
    1.  Increase unit and integration test coverage for critical components and business logic.
    2.  Refactor flaky tests (e.g., in `calendar.test.tsx`) to be deterministic.
    3.  Implement automated accessibility (a11y) testing using `axe-core` within the test suite.
-   **Impact**: Medium. Increases confidence in code changes, reduces regressions, and ensures a better user experience for all users.
-   **Effort**: L
-   **Owner**: Jules
-   **Dependencies**: None
-   **DoD**: Test coverage metric (e.g., line coverage) increases by 15%. All tests pass reliably in the CI pipeline. A GitHub Action or test script is in place that fails if `axe` finds accessibility violations in key user flows.
-   **Risk**: Low.
-   **Mitigation**: N/A.

---

## Long-Term (>8 Weeks)

### 4. Full Component Documentation in Storybook

-   **Problem**: Many UI components are not documented in Storybook, making them difficult to discover, reuse, and test in isolation.
-   **Proposed Change**: Systematically create Storybook stories for all components in `src/components/ui` and key components in `src/components/shared`. Document component props, variations, and states.
-   **Impact**: Medium. Improves developer productivity, encourages component reuse, and serves as living documentation for the design system.
-   **Effort**: XL
-   **Owner**: Jules
-   **Dependencies**: None
-   **DoD**: Every component in `src/components/ui` has a corresponding `.stories.tsx` file. Storybook is deployed and accessible to the team.
-   **Risk**: Low.
-   **Mitigation**: N/A.
