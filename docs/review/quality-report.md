# Quality Report

This report outlines the findings from the codebase analysis, focusing on code quality, architecture, security, and other best practices.

## 1. Findings Overview

| ID  | Finding                                      | Impact      | Effort | Risk   | Category      |
| :-- | :------------------------------------------- | :---------- | :----- | :----- | :------------ |
| 1   | Client-Side API Key Exposure                 | **High**    | M      | Low    | Security      |
| 2   | Duplicated API Fetch Logic with Backoff      | Medium      | S      | Low    | Code Quality  |
| 3   | Prop Drilling in `AiTerminal` Component      | Low         | M      | Low    | Architecture  |
| 4   | Skipped and Brittle Unit Tests               | Medium      | M      | Low    | Testing       |
| 5   | Lack of Environment Variable Documentation   | Medium      | S      | Low    | Documentation |

---

## 2. Code Smells & Anti-Patterns

### 2.1. Duplicated API Fetch Logic
-   **Observation**: The functions `callGeminiWithBackoff` and `callImagenApi` in `src/lib/api.ts` contain nearly identical logic for exponential backoff and retries.
-   **Impact**: This duplication makes the code harder to maintain. A bug in the retry logic would need to be fixed in multiple places.
-   **Recommendation**: Refactor this logic into a single, reusable function or a higher-order function that can wrap any API call with retry capabilities.

### 2.2. Use of `any` Type
-   **Observation**: The `payload` argument in `callGeminiWithBackoff` is typed as `any`.
-   **Impact**: This bypasses TypeScript's type-checking, reducing code safety and developer experience.
-   **Recommendation**: Define a specific type for the `payload` based on the Google Gemini API's requirements.

---

## 3. Layering & Boundaries

### 3.1. Client-Side API Calls
-   **Observation**: The application makes direct calls to the Google Generative Language API from the client-side (`src/lib/api.ts`).
-   **Impact**: This architecture is simple but leads to the major security flaw of exposing the API key in the browser. It also tightly couples the frontend to a specific external API.
-   **Recommendation**: Introduce a backend-for-frontend (BFF) layer using Next.js API Routes or a separate server. The BFF would handle the API calls to Google, keeping the API key secure on the server.

---

## 4. Test Status

-   **Overall**: The project has a modern testing setup with Vitest, React Testing Library, and Storybook integration for browser-based testing. This is a solid foundation.
-   **Identified Issues**:
    -   **Skipped Test**: `src/components/ui/calendar.test.tsx` contains a skipped test (`it.skip`). This test should be re-enabled or removed.
    -   **Flaky Test**: The same file contains a test that depends on the system's locale (`new Date().toLocaleString(...)`). This can cause the test to fail in different environments.
    -   **Brittle Selectors**: The tests use `getAllByRole(...)[0]`, which can break easily if the UI changes. More specific selectors should be used.

---

## 5. Security & Configuration Hygiene

### 5.1. Exposed API Key (Critical)
-   **Observation**: The `NEXT_PUBLIC_GEMINI_API_KEY` is exposed to the browser. Any visitor to the website can find and use this key.
-   **Impact**: **High**. This can lead to unauthorized use of the API, potentially incurring significant costs and hitting rate limits, causing service disruption.
-   **Recommendation**: Immediately move the API key to a server-side environment variable (by removing the `NEXT_PUBLIC_` prefix) and route all API calls through a Next.js API Route.

### 5.2. Missing Environment Documentation
-   **Observation**: There is no `.env.example` file to document the required environment variables.
-   **Impact**: This makes it difficult for new developers to set up and run the project locally.
-   **Recommendation**: Create a `.env.example` file listing all required environment variables with placeholder values.

---

## 6. Accessibility, i18n & RTL

-   **Accessibility (a11y)**: The inclusion of `axe-core` in `devDependencies` is a positive sign, indicating an awareness of accessibility. However, no automated `axe` tests were found in the test files reviewed.
-   **Internationalization (i18n)**: The setup in `src/lib/i18n` is robust, with support for multiple locales. The use of `data-i18n-key` attributes is a good practice.
-   **Right-to-Left (RTL)**: The i18n configuration correctly identifies RTL locales (`he`, `ar`), suggesting that RTL support has been considered. A full audit would be needed to verify the implementation.
-   **Lighthouse/Web Vitals**: A code-level estimation suggests that the application leverages Next.js features like automatic image optimization, which is good for performance. However, the large number of tab components loaded in `AiTerminal` could potentially impact initial load time if not properly code-split.
