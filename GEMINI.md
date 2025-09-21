# Project Overview

This is a Next.js 15 project with TypeScript, initialized in Firebase Studio. It's designed to implement a comprehensive "terminal/cyber" themed design system. Key technologies include Tailwind CSS for styling, Radix UI for components, and `next/font/google` for optimized font loading. The project aims to create a unique visual and interactive experience, with a strong emphasis on accessibility and performance. It also integrates Genkit AI for potential AI-powered features. The project uses a specific "Task Definition Language (TDL)" for agent prompts, as detailed in `lions_of_zion_agent_prompts_claude_spark_full_pack.md`.

## Building and Running

To interact with the project, use the following `pnpm` scripts defined in `package.json`:

-   **`pnpm dev`**: Starts the Next.js development server.
-   **`pnpm genkit:dev`**: Starts the Genkit AI development server.
-   **`pnpm genkit:watch`**: Starts the Genkit AI development server with file watching for automatic restarts on code changes.
-   **`pnpm build`**: Builds the Next.js application for production deployment.
-   **`pnpm start`**: Starts the Next.js production server.
-   **`pnpm lint`**: Runs ESLint to identify and report on patterns found in JavaScript/TypeScript code.
-   **`pnpm typecheck`**: Performs TypeScript type checking across the project without emitting JavaScript files.

## Development Conventions

### Styling
-   **Tailwind CSS**: Utilized for a utility-first approach to styling, configured with a custom "terminal/cyber" theme. This includes specific color palettes, the `Space Mono` font, custom animations (e.g., `terminal-blink`, `glitch`), and unique shadow effects. Global styles are defined in `src/app/globals.css` using CSS variables for design tokens.

### Component Architecture
-   **Atomic Design Pattern**: Components are structured following atomic design principles.
-   **Radix UI & CVA**: Leverages Radix UI primitives for accessible components and `class-variance-authority` (CVA) for managing component variants and their styles.
-   **Directory Structure**: Components are organized into logical categories:
    -   `src/components/ui`: General UI components, including a `terminal` sub-directory for theme-specific elements.
    -   `src/components/intelligence`: Domain-specific components related to intelligence data and display.
    -   `src/components/layout`: Components for overall page structure and layout.

### Utility Functions
-   **`src/lib/utils.ts`**: Contains common utility functions, notably the `cn` function for intelligently merging Tailwind CSS classes using `clsx` and `tailwind-merge`.

### Design Tokens
-   A comprehensive design token system is being implemented, with primitive and semantic tokens defined as CSS variables in `src/app/globals.css`. These tokens serve as a single source of truth for design properties.

### Code Quality
-   **TypeScript**: The project is developed using TypeScript for type safety and improved developer experience.
-   **ESLint**: Used for static code analysis to maintain code quality and consistency.
-   **Type Checking**: Enforced via `tsc --noEmit` to catch type-related errors during development and build processes.

### Agent Prompts (TDL)
-   The project utilizes a specific JSON-based Task Definition Language (TDL) for agent prompts, as outlined in `lions_of_zion_agent_prompts_claude_spark_full_pack.md`. This TDL includes fields such as `role`, `objective`, `context`, `files_to_create`, `steps`, `acceptance_criteria`, and `constraints`.

### Internationalization (i18n)
-   The project supports multiple locales, including RTL languages like Hebrew and Arabic, with mechanisms for locale detection and routing.

### SEO & Performance
-   Emphasis on SEO metadata, performance budgets (LCP, CLS, TBT), and accessibility (WCAG 2.2 AA).

### Backend Integration
-   Development is currently focused on the frontend with mocks/adapters, following a contract-first approach for placeholders, with no immediate backend build.
