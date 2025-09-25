# Progress Report: Landing Page

-   **Status**: Completed
-   **Date**: 2025-09-23

## Decisions

-   **Content**: Page content is now driven by `src/app/(public)/_content/landing.copy.json`.
-   **Metadata**: Page-specific metadata is handled by the `generateMetadata` function in `page.tsx`. The `head.tsx` file was not used as it is an outdated pattern.
-   **Components**: The page is composed of existing shared components (`NarrativeCard`, `ActionGrid`) and a new `LocaleSwitcher` component.
-   **Data**: The `NarrativeCard` components are populated with mock data from `src/lib/data.ts`.

## TODO Next

-   Proceed to the next public route: `/opening` Splash page.
