# Mission Brief for AI Agent: Project LionSpace Refactor

## 1. Project State Overview

**Project:** LionSpace V3 - Information Warfare Defense Platform.
**Technology:** Next.js 15, TypeScript, TailwindCSS, Turborepo, pnpm.
**Current Status:** "UI Complete" but with significant technical debt. The features exist visually but are not connected to robust, production-ready backend logic. The monorepo structure is partially implemented, leading to code duplication and disorganization.

## 2. Your Mission

Your primary objective is to **execute the master plan defined in `TODO.md`** to refactor, stabilize, and bring this project to a production-ready state. You will operate as the primary engineering agent, following a strict, gate-based progression.

**Your Single Source of Truth is `/TODO.md`. Refer to it at every step.**

## 3. Methodology: Gate-Based Progression

You must follow the "Gates Progression" model outlined in `TODO.md`. Do not proceed to a new gate until all "Exit Criteria" for the current gate are met and validated.

**Core Principles to Adhere To:**

*   **No Duplication:** Before creating any file or function, search the entire workspace to prevent duplication.
*   **Atomic Commits:** Each task or fix should result in a small, atomic, well-documented commit.
*   **Constant Validation:** After any significant change, run the validation commands (`pnpm run type-check`, `pnpm run lint`, `pnpm run build`).
*   **No New Features:** Do not implement new features until the foundational refactoring (Gates 1-6) is complete.

## 4. Execution Plan: Initial Gates

Here are your initial instructions.

### Gate 0: Integrity & Setup (Verification)

*   **Action**: Verify that `git status` is clean and that this file (`GEMINI.md`) and `TODO.md` are the primary mission documents.
*   **Action**: Confirm that `TODO_UNIFIED.md` and `docs/archive/TODO_ORIGINAL_COMPLETED.md` have been deleted.
*   **Status**: This gate is considered complete. Proceed to Gate 1.

### Gate 1: TypeScript & Syntax Purity

**Objective**: Achieve zero compilation and linting errors across the entire project.

1.  **Execute Type Check**:

    ```bash
    pnpm run type-check
    ```

2.  **Analyze Errors**: Systematically analyze the output. The current expectation is 100+ errors.
3.  **Fix Errors**: Go file by file and fix every reported TypeScript error. Prioritize fixing errors in `packages` before `apps`.
4.  **Remove `@ts-ignore`**: Search the codebase for `@ts-ignore` and remove them by fixing the underlying type issue.
5.  **Execute Linting**:

    ```bash
    pnpm run lint:fix
    ```

6.  **Validate Exit Criteria**:
    *   Run `pnpm run type-check` and ensure it passes with **0 errors**.
    *   Run `pnpm run lint` and ensure it passes with **0 errors**.
    *   Run `pnpm run build` and ensure it completes successfully.

**Do not proceed until all three validation commands pass cleanly.**

### Gate 2: Monorepo & Component Architecture

**Objective**: Finalize the monorepo structure and create a clean, shared UI library.

1.  **Create Packages**: If they don't exist, create the directory structures for:
    *   `packages/@lionspace/ui`
    *   `packages/@lionspace/core`
    *   `packages/@lionspace/mock-data`
2.  **Migrate Components**:
    *   Identify shared, stateless components currently in `apps/web/components`.
    *   Move them into `packages/@lionspace/ui/src`, organizing them into `atoms`, `molecules`, and `organisms`.
    *   Update all import paths in `apps/web` to reference the new `@lionspace/ui` package.
3.  **Migrate Core Logic**:
    *   Move shared types, constants, and utility functions from `apps/web/lib` and `apps/web/types` into `packages/@lionspace/core/src`.
    *   Update all relevant import paths.
4.  **Validate Exit Criteria**:
    *   Run `pnpm run build`. The entire monorepo, including the new packages, and the `web` app, must build successfully.
    *   Delete the now-empty or redundant folders within `apps/web` (e.g., `apps/web/lib`, `apps/web/types`).

## 5. Reporting

After completing each major action (e.g., fixing all type errors, migrating components), provide a status update confirming the completion and the validation results before proceeding to the next step.

**Mission Start. Execute Gate 1.**


## 4. Execution Plan: Initial Gates

Here are your initial instructions.

### Gate 0: Integrity & Setup (Verification)

*   **Action**: Verify that `git status` is clean and that this file (`GEMINI.md`) and `TODO.md` are the primary mission documents.
*   **Action**: Confirm that `TODO_UNIFIED.md` and `docs/archive/TODO_ORIGINAL_COMPLETED.md` have been deleted.
*   **Status**: This gate is considered complete. Proceed to Gate 1.

### Gate 1: TypeScript & Syntax Purity

**Objective**: Achieve zero compilation and linting errors across the entire project.

1.  **Execute Type Check**:
    ```bash
    pnpm run type-check
    ```
2.  **Analyze Errors**: Systematically analyze the output. The current expectation is 100+ errors.
3.  **Fix Errors**: Go file by file and fix every reported TypeScript error. Prioritize fixing errors in `packages` before `apps`.
4.  **Remove `@ts-ignore`**: Search the codebase for `@ts-ignore` and remove them by fixing the underlying type issue.
5.  **Execute Linting**:
    ```bash
    pnpm run lint:fix
    ```
6.  **Validate Exit Criteria**:
    *   Run `pnpm run type-check` and ensure it passes with **0 errors**.
    *   Run `pnpm run lint` and ensure it passes with **0 errors**.
    *   Run `pnpm run build` and ensure it completes successfully.

**Do not proceed until all three validation commands pass cleanly.**

### Gate 2: Monorepo & Component Architecture

**Objective**: Finalize the monorepo structure and create a clean, shared UI library.

1.  **Create Packages**: If they don't exist, create the directory structures for:
    *   `packages/@lionspace/ui`
    *   `packages/@lionspace/core`
    *   `packages/@lionspace/mock-data`
2.  **Migrate Components**:
    *   Identify shared, stateless components currently in `apps/web/components`.
    *   Move them into `packages/@lionspace/ui/src`, organizing them into `atoms`, `molecules`, and `organisms`.
    *   Update all import paths in `apps/web` to reference the new `@lionspace/ui` package.
3.  **Migrate Core Logic**:
    *   Move shared types, constants, and utility functions from `apps/web/lib` and `apps/web/types` into `packages/@lionspace/core/src`.
    *   Update all relevant import paths.
4.  **Validate Exit Criteria**:
    *   Run `pnpm run build`. The entire monorepo, including the new packages and the `web` app, must build successfully.
    *   Delete the now-empty or redundant folders within `apps/web` (e.g., `apps/web/lib`, `apps/web/types`).

## 5. Reporting

After completing each major action (e.g., fixing all type errors, migrating components), provide a status update confirming the completion and the validation results before proceeding to the next step.

**Mission Start. Execute Gate 1.**
