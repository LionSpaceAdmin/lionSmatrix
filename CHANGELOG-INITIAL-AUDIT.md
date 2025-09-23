# Initial Audit Changelog

This document serves as a baseline of observations and intended non-breaking adjustments based on the initial codebase audit conducted on 2025-09-22.

## Summary of Findings

The initial audit of the "Lions of Zion Website" codebase revealed a modern, well-structured Next.js application with a solid foundation for testing and internationalization. However, several critical areas require attention to improve security, maintainability, and developer experience.

### Key Observations

-   **Security**: A critical vulnerability was identified where the Google Gemini API key is exposed on the client-side.
-   **Code Quality**: Instances of duplicated code, particularly in API fetching logic, were found. Some TypeScript types are not strictly enforced (e.g., use of `any`).
-   **Testing**: The project has a sophisticated test setup, but some tests are skipped or flaky, indicating a need for maintenance.
-   **Documentation**: There are significant gaps in the documentation, most notably the absence of an environment variable template (`.env.example`) and comprehensive component documentation.

## Intended Non-Breaking Adjustments (Cleanup Plan)

The following non-breaking changes are planned to address some of the immediate issues found during the audit. These changes are designed to be safe and will not alter the application's functionality.

-   **Refactor API Backoff Logic**: Consolidate the duplicated retry and backoff logic for API calls into a single, reusable utility.
-   **Improve Test Suite Health**: Fix the skipped test in the `Calendar` component and refactor the locale-dependent test to be deterministic.
-   **Add Environment Variable Documentation**: Create a `.env.example` file to document the necessary environment variables for local setup.
-   **Enhance Type Safety**: Replace the `any` type for the `payload` in `callGeminiWithBackoff` with a more specific TypeScript type.

For a detailed breakdown of these tasks, please refer to `docs/cleanup/plan.md` and `docs/cleanup/patches.md`. For more significant architectural changes, see the `docs/roadmap/roadmap.md`.
