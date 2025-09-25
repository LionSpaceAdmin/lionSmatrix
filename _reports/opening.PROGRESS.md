# Progress Report: Opening Splash Page

-   **Status**: Completed
-   **Date**: 2025-09-23

## Decisions

-   **Component**: Created a new page at `/opening` that uses the existing `PledgeBox` component.
-   **Cookie Logic**: Implemented a client-side cookie setting mechanism to track if the user has seen the splash page. This was done without adding new dependencies.
-   **Guard Logic**: Created a `SplashGuard` client component that wraps the root layout. This component handles the redirection logic to and from the splash page based on the presence of the `splash-seen` cookie. This approach was chosen to keep the middleware focused on i18n routing.

## TODO Next

-   Proceed to the next public route: `/daily-brief`.
