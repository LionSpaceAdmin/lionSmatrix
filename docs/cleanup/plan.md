# Cleanup Plan

This plan outlines a series of non-breaking changes to improve the codebase's quality, maintainability, and developer experience.

## Cleanup Tasks

| ID  | Action                                     | Owner | Effort | Risk | Dependencies | DoD                                                                   |
| :-- | :----------------------------------------- | :---- | :----- | :--- | :----------- | :-------------------------------------------------------------------- |
| 1   | Refactor Duplicated API Backoff Logic      | Jules | M      | Low  | -            | A shared `fetchWithBackoff` utility is created and used by both API calls. |
| 2   | Fix Skipped and Flaky Tests in `Calendar`  | Jules | M      | Low  | -            | The skipped test is re-enabled and passing. Flaky tests are robust. |
| 3   | Create `.env.example` File                 | Jules | S      | Low  | -            | A `.env.example` file exists at the root with all required keys.      |
| 4   | Improve Type Safety in `callGeminiWithBackoff` | Jules | S      | Low  | -            | The `payload` argument is strongly typed.                             |
