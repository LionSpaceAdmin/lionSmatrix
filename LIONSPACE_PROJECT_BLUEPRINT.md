# LionSpace: Cognitive Warfare Intelligence Platform

**Purpose:** An advanced platform for monitoring and analyzing information environments to counter disinformation and understand online narratives.

> Global Guardrails (apply to every prompt)
>
> - **Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, Radix UI, Drizzle ORM, PostgreSQL, NextAuth.js, Playwright, Vitest, Sentry, OpenTelemetry, Framer Motion.
> - **Design Principles:** Utility-first, component-based architecture using a defined Design System. Emphasis on accessibility (WCAG 2.2 AA), performance, and progressive enhancement.
> - **Content Rules:** Content must be localized (i18n support for 8 languages, including RTL). All user-facing text should use translation keys. Tone is authoritative, data-driven, and urgent.
> - **Backend Assumptions:** Hybrid model: Next.js server-side logic combined with Python (FastAPI) microservices for specialized tasks (AI, auth, RAG). PostgreSQL is the primary database, managed with Drizzle ORM.
> - **Primary CTAs:** Public: "Request a Demo", "Pledge Support". Auth: "Analyze Threat", "Launch Campaign", "View War Room".
> - **Performance Budgets:** LCP < 2.5s, CLS < 0.1. Bundle size and Lighthouse scores are actively monitored via CI.

---

## (public)

### `/` — Landing Page

```json
{
  "role": "Frontend Engineer",
  "objective": "Introduce LionSpace to visitors, communicate the core mission of combating cognitive warfare, and drive engagement towards demos and mission support.",
  "context": { "route": "/", "status": "Implemented", "components": ["HeroSection", "ThreatStrip", "ActionGrid", "Footer"] },
  "files_to_verify": ["apps/web/app/(public)/page.tsx", "components/organisms/HeroSection.tsx"],
  "steps": [
    "Verify Hero section correctly displays the mission statement and visuals.",
    "Confirm the ThreatStrip component shows real-time or mock data snippets.",
    "Ensure primary CTAs ('Request a Demo', 'Pledge Support') are prominent and functional."
  ],
  "acceptance_criteria": [
    "Page achieves a Lighthouse score of 90+.",
    "All CTAs are correctly wired to analytics events.",
    "The page is fully responsive across mobile, tablet, and desktop breakpoints."
  ],
  "constraints": ["LCP below 2.5s", "Must be statically generated for performance."],
  "testing": ["E2E test for CTA clicks.", "Visual regression test for the hero section."],
  "progress_report": "apps/web/app/(public)/_reports/landing.PROGRESS.md"
}
```

### `/daily-brief` — Daily Intelligence Briefing

```json
{
  "role": "Frontend Engineer",
  "objective": "Provide a publicly accessible daily summary of key intelligence findings, analyzed narratives, and emerging threats.",
  "context": { "route": "/daily-brief", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(public)/daily-brief/page.tsx"],
  "steps": [
    "Fetch and display the latest daily brief from the backend.",
    "Organize the brief into clear, digestible sections (e.g., 'Top Narratives', 'Disinformation Alerts').",
    "Include data visualizations for key metrics."
  ],
  "acceptance_criteria": [
    "Page correctly displays content for the current date.",
    "Users can easily share the briefing on social media.",
    "The page is printer-friendly."
  ],
  "constraints": ["Content should be easily updatable without a full redeploy, likely via a CMS or API."],
  "testing": ["Unit test for data fetching and formatting.", "E2E test to verify content display."],
  "progress_report": "apps/web/app/(public)/_reports/daily-brief.PROGRESS.md"
}
```

### `/about` — About Us

```json
{
  "role": "Content Engineer",
  "objective": "Explain the mission, vision, and values of the LionSpace organization, building trust and transparency with the public.",
  "context": { "route": "/about", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(public)/about/page.tsx"],
  "steps": [
    "Clearly articulate the 'Why' behind the project.",
    "Introduce key team members or roles.",
    "Provide contact information or links to social channels."
  ],
  "acceptance_criteria": [
    "The mission statement is clear and compelling.",
    "The page is easy to navigate and read.",
    "All links to external resources are valid."
  ],
  "constraints": ["Content should be static and SEO-optimized."],
  "testing": ["Verify all links are not broken.", "Content review by a non-technical stakeholder."],
  "progress_report": "apps/web/app/(public)/_reports/about.PROGRESS.md"
}
```

### `/contact` — Contact Page

```json
{
  "role": "Frontend Engineer",
  "objective": "Provide clear, secure channels for users to contact the organization for various purposes (e.g., press, support, general inquiries).",
  "context": { "route": "/contact", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(public)/contact/page.tsx"],
  "steps": [
    "Implement a contact form with distinct categories for inquiries.",
    "Ensure form submissions are validated on both client and server.",
    "Integrate with a backend service or email provider to handle submissions."
  ],
  "acceptance_criteria": [
    "Form submission successfully triggers a notification to the appropriate internal team.",
    "User receives a confirmation message after successful submission.",
    "Spam protection (e.g., honeypot, CAPTCHA) is implemented and effective."
  ],
  "constraints": ["Must not expose any email addresses directly in the frontend source code."],
  "testing": ["E2E test for form submission, including validation errors and success cases."],
  "progress_report": "apps/web/app/(public)/_reports/contact.PROGRESS.md"
}
```

### `/faq` — Frequently Asked Questions

```json
{
  "role": "Content Engineer",
  "objective": "Proactively answer common questions about the project, its methodologies, data sources, and goals to reduce support load and increase user trust.",
  "context": { "route": "/faq", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(public)/faq/page.tsx"],
  "steps": [
    "Group questions into logical categories (e.g., 'General', 'Data', 'Security').",
    "Implement an accordion UI for a clean and user-friendly experience.",
    "Ensure the content is easily updatable by non-developers."
  ],
  "acceptance_criteria": [
    "Users can easily find answers to their questions.",
    "The accordion interface is accessible and keyboard-navigable.",
    "The page loads quickly despite potentially large amounts of text content."
  ],
  "constraints": ["Content should be sourced from a headless CMS or a simple JSON file for easy updates."],
  "testing": ["Accessibility audit of the accordion component.", "Content review for clarity and accuracy."],
  "progress_report": "apps/web/app/(public)/_reports/faq.PROGRESS.md"
}
```

### `/demo` — Request a Demo

```json
{
  "role": "Growth Engineer",
  "objective": "Capture qualified leads by providing a streamlined process for potential enterprise customers or partners to request a personalized demonstration of the platform.",
  "context": { "route": "/demo", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(public)/demo/page.tsx"],
  "steps": [
    "Create a lead capture form asking for essential information (e.g., Name, Organization, Role).",
    "Highlight the key benefits and features that will be shown in the demo.",
    "Integrate form submission with a CRM (e.g., HubSpot, Salesforce) or a dedicated email list."
  ],
  "acceptance_criteria": [
    "A new lead is successfully created in the target system upon form submission.",
    "The user is shown a 'Thank You' page or message with next steps.",
    "Form validation is robust and user-friendly."
  ],
  "constraints": ["The form must be GDPR/CCPA compliant."],
  "testing": ["E2E test of the entire lead capture funnel.", "Integration test with the CRM/backend service."],
  "progress_report": "apps/web/app/(public)/_reports/demo.PROGRESS.md"
}
```

### `/archive` — Narratives Archive (Index)

```json
{
  "role": "Frontend Engineer",
  "objective": "Provide a public, high-level overview of past de-classified narratives and intelligence reports to showcase the platform's capabilities and impact.",
  "context": { "route": "/archive", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(public)/archive/page.tsx"],
  "steps": [
    "Display a filterable and searchable list of archived reports.",
    "Each item in the list should be a summary card with key information.",
    "Link each card to its corresponding dynamic detail page (`/archive/[narrativeId]`)."
  ],
  "acceptance_criteria": [
    "Users can filter the archive by date, topic, or threat level.",
    "The list supports pagination or infinite scrolling for large datasets.",
    "The link to the detail page is correctly formatted for each item."
  ],
  "constraints": ["The list should be rendered server-side for SEO benefits."],
  "testing": ["Test filtering and sorting functionality.", "Test pagination/scrolling behavior."],
  "progress_report": "apps/web/app/(public)/_reports/archive-index.PROGRESS.md"
}
```

### `/legal/[slug]` — Legal Documents

```json
{
  "role": "Content Engineer",
  "objective": "Ensure legal compliance by providing public access to essential documents like the Privacy Policy and Terms of Service.",
  "context": { "route": "/legal/[slug]", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(public)/legal/privacy/page.tsx", "apps/web/app/(public)/legal/terms/page.tsx"],
  "steps": [
    "Create a template for rendering markdown-based legal documents.",
    "Ensure clear versioning or 'last updated' dates are visible.",
    "The layout should be simple, professional, and highly readable."
  ],
  "acceptance_criteria": [
    "The content is rendered correctly from its source file.",
    "The text is selectable and searchable.",
    "The pages are accessible and responsive."
  ],
  "constraints": ["Content must be sourced from a trusted, non-editable source for legal integrity."],
  "testing": ["Content review by the legal team.", "Verify that the latest version of the documents is displayed."],
  "progress_report": "apps/web/app/(public)/_reports/legal.PROGRESS.md"
}
```

---

### `/opening` — Opening Page (Consent & Mission)

```json
{
  "role": "Frontend Engineer",
  "objective": "Present users with the platform's core mission and require an explicit act of consent or acknowledgment (a 'pledge') before they can proceed to the main content, serving as an ethical gateway.",
  "context": { "route": "/opening", "status": "Not Implemented" },
  "files_to_create": ["apps/web/app/(public)/opening/page.tsx"],
  "steps": [
    "Design a visually compelling, full-screen layout that focuses user attention on the mission statement.",
    "Implement a 'PledgeBox' component where users must click a button to agree to the terms or mission.",
    "Upon agreement, set a persistent flag (e.g., in localStorage) and redirect the user to the main landing page ('/').",
    "Update middleware to redirect first-time users to this page."
  ],
  "acceptance_criteria": [
    "First-time visitors are automatically redirected to this page.",
    "After pledging, users are not shown this page again on subsequent visits.",
    "The pledge action is recorded for analytics."
  ],
  "constraints": ["The design must be solemn and respectful.", "The action must be a clear, affirmative consent."],
  "testing": ["E2E test for the redirect logic for new vs. returning users.", "Unit test the state management for the pledge action."],
  "progress_report": "apps/web/app/(public)/_reports/opening.PROGRESS.md"
}
```

### `/archive/[narrativeId]` — Narrative Detail Page

```json
{
  "role": "Fullstack Engineer",
  "objective": "Provide a deep-dive view of a specific de-classified narrative, including its history, key actors, spread, and the countermeasures taken, showcasing the platform's analytical depth.",
  "context": { "route": "/archive/[narrativeId]", "status": "Not Implemented" },
  "files_to_create": ["apps/web/app/(public)/archive/[narrativeId]/page.tsx"],
  "steps": [
    "Create a dynamic route that accepts a 'narrativeId' parameter.",
    "Develop a backend API endpoint to serve detailed data for a single narrative.",
    "On the frontend, fetch and display the data using various components: timeline views, network graphs of actors, evidence lists, and impact metrics.",
    "Implement a robust loading state and handle cases where a narrative is not found."
  ],
  "acceptance_criteria": [
    "The page correctly fetches and displays data for any valid 'narrativeId'.",
    "A user-friendly 404 page is shown for invalid or non-existent IDs.",
    "All data visualizations are interactive and responsive."
  ],
  "constraints": ["Data visualizations must be performant and not block the main thread.", "Data fetching must be secure and efficient."],
  "testing": ["Test with various narrative IDs, including invalid ones.", "Snapshot test the page layout for a mock narrative.", "Integration test for the API endpoint."],
  "progress_report": "apps/web/app/(public)/_reports/narrative-detail.PROGRESS.md"
}
```

### `/search` — Global Search Page

```json
{
  "role": "Fullstack Engineer",
  "objective": "Provide a powerful, unified search experience that allows public users to search across all public content, including daily briefs, archived narratives, and FAQ content.",
  "context": { "route": "/search", "status": "Not Implemented" },
  "files_to_create": ["apps/web/app/(public)/search/page.tsx"],
  "steps": [
    "Design and implement a backend search service/endpoint capable of indexing and querying all public content.",
    "Create a search input component on the frontend that accepts user queries.",
    "Display search results grouped by content type (e.g., 'Narratives', 'Briefs', 'FAQ').",
    "Implement features like highlighting search terms in results and providing filters."
  ],
  "acceptance_criteria": [
    "Search results are relevant and returned quickly (<500ms).",
    "The search functionality is protected against injection attacks.",
    "The state is managed in the URL, so search results pages can be bookmarked and shared."
  ],
  "constraints": ["The search index must be kept up-to-date with the latest public content."],
  "testing": ["E2E test for various search queries.", "Unit test the search result parsing and display logic.", "Load test the search API."],
  "progress_report": "apps/web/app/(public)/_reports/search.PROGRESS.md"
}
```

### `/impact` — Impact Metrics Page

```json
{
  "role": "Data Visualization Engineer",
  "objective": "Visually demonstrate the real-world impact of the LionSpace mission by displaying aggregated, anonymized metrics and success stories.",
  "context": { "route": "/impact", "status": "Not Implemented" },
  "files_to_create": ["apps/web/app/(public)/impact/page.tsx"],
  "steps": [
    "Design a dashboard-like page for public consumption.",
    "Source and process aggregated data from the backend for key impact metrics.",
    "Use data visualization components (e.g., 'ImpactChart') to display metrics like 'Narratives Neutralized', 'Disinformation Reach Reduced'.",
    "Include qualitative evidence through short, compelling case studies or testimonials."
  ],
  "acceptance_criteria": [
    "All charts and metrics are clearly labeled and easy to understand for a non-expert audience.",
    "The data presented is compelling and supports the organization's mission.",
    "The page is visually engaging and shareable."
  ],
  "constraints": ["All data must be aggregated and anonymized to protect sensitive information."],
  "testing": ["Snapshot tests for all data visualizations.", "Data accuracy review by a project stakeholder."],
  "progress_report": "apps/web/app/(public)/_reports/impact.PROGRESS.md"
}
```

---

## (auth)

### `/auth/sign-in` — User Sign In

```json
{
  "role": "Security Engineer",
  "objective": "Enable registered users to securely authenticate and access their accounts using credentials or third-party providers.",
  "context": { "route": "/auth/sign-in", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(auth)/sign-in/page.tsx"],
  "steps": ["Verify credential-based login with NextAuth.", "Verify OAuth provider integration (e.g., Google, GitHub).", "Ensure proper error handling for failed login attempts."],
  "acceptance_criteria": ["Successful login redirects user to their dashboard.", "Invalid credentials show a user-friendly error message.", "Account lockout mechanism is in place after multiple failed attempts."],
  "constraints": ["All authentication flows must use HTTPS.", "Passwords must be securely hashed and salted."],
  "testing": ["E2E test for successful login.", "E2E test for failed login.", "Unit test for form validation."],
  "progress_report": "apps/web/app/(auth)/_reports/sign-in.PROGRESS.md"
}
```

### `/auth/join` — User Registration

```json
{
  "role": "Security Engineer",
  "objective": "Allow new, authorized users to create an account on the platform.",
  "context": { "route": "/auth/join", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(auth)/join/page.tsx"],
  "steps": ["Verify user registration form captures necessary details.", "Ensure server-side validation of input.", "Confirm successful registration creates a new user record in the database."],
  "acceptance_criteria": ["New user is successfully added to the database.", "User is redirected to the onboarding flow after registration.", "Duplicate email addresses are rejected."],
  "constraints": ["May require an invitation code or domain-based restriction depending on the access policy."],
  "testing": ["E2E test for the complete registration flow.", "Test for handling of existing user data."],
  "progress_report": "apps/web/app/(auth)/_reports/join.PROGRESS.md"
}
```

### `/auth/onboarding` — New User Onboarding

```json
{
  "role": "UX Engineer",
  "objective": "Guide newly registered users through the initial setup of their profile and preferences to personalize their platform experience.",
  "context": { "route": "/auth/onboarding", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(auth)/onboarding/page.tsx"],
  "steps": ["Verify the multi-step onboarding form.", "Confirm user preferences are saved correctly.", "Ensure a smooth transition to the main dashboard upon completion."],
  "acceptance_criteria": ["User can complete the onboarding flow without errors.", "Selected preferences are reflected in the user's dashboard experience.", "User can skip and complete the onboarding later."],
  "constraints": [],
  "testing": ["E2E test of the onboarding workflow.", "Verify that saved preferences are correctly applied."],
  "progress_report": "apps/web/app/(auth)/_reports/onboarding.PROGRESS.md"
}
```

### `/auth/reset-password` — Password Reset

```json
{
  "role": "Security Engineer",
  "objective": "Provide a secure mechanism for users to reset their forgotten password.",
  "context": { "route": "/auth/reset-password", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(auth)/reset-password/page.tsx"],
  "steps": ["Verify the 'request reset' form.", "Confirm a secure, time-limited token is generated and emailed to the user.", "Verify the 'set new password' form."],
  "acceptance_criteria": ["User receives an email with a password reset link.", "The reset token expires after a configured lifetime.", "User can successfully log in with the new password."],
  "constraints": ["Reset tokens must be single-use and securely generated."],
  "testing": ["E2E test of the full password reset flow.", "Test for handling of expired or invalid tokens."],
  "progress_report": "apps/web/app/(auth)/_reports/reset-password.PROGRESS.md"
}
```

---

## (dashboard)

### `/dashboard` — Main Dashboard

```json
{
  "role": "Dashboard Architect",
  "objective": "Provide operators with a high-level, real-time 'common operational picture' of the information environment, highlighting critical alerts, active campaigns, and key performance indicators.",
  "context": { "route": "/dashboard", "status": "Implemented", "components": ["AlertBanner", "CampaignSummaryWidget", "ThreatLevelIndicator"] },
  "files_to_verify": ["apps/web/app/(dashboard)/page.tsx"],
  "steps": ["Verify layout of key widgets.", "Confirm data is fetched and displayed from relevant APIs.", "Ensure navigation links to sub-pages are correct."],
  "acceptance_criteria": ["Dashboard loads key data within 3 seconds.", "Widgets are interactive and link to detailed views.", "The layout is customizable or personalized to the user's role."],
  "constraints": ["Must be highly performant and responsive, as it is the primary user interface."],
  "testing": ["E2E test to verify all widgets load data.", "Performance test for dashboard load time."],
  "progress_report": "apps/web/app/(dashboard)/_reports/dashboard.PROGRESS.md"
}
```

### `/dashboard/war-room` — The War Room

```json
{
  "role": "Crisis Manager",
  "objective": "Provide a collaborative, real-time environment for managing active, high-priority information crises, integrating data streams, communication tools, and response coordination.",
  "context": { "route": "/dashboard/war-room", "status": "Implemented", "components": ["RealtimeThreatStream", "ChatModule", "ActionCoordinator"] },
  "files_to_verify": ["apps/web/app/(dashboard)/war-room/page.tsx"],
  "steps": ["Verify real-time data stream connection.", "Confirm collaborative tools are functional.", "Ensure incident timeline is accurately logged."],
  "acceptance_criteria": ["New threat data appears in the stream within seconds.", "Team members can communicate and coordinate actions effectively.", "All actions are logged for after-action review."],
  "constraints": ["Requires a low-latency, real-time connection (e.g., WebSockets)."],
  "testing": ["Real-time data synchronization test.", "Test collaborative features with multiple simulated users."],
  "progress_report": "apps/web/app/(dashboard)/_reports/war-room.PROGRESS.md"
}
```

### `/dashboard/command-center` — Command Center

```json
{
  "role": "Strategic Commander",
  "objective": "Offer a strategic-level view of all ongoing operations, resource allocation, and long-term trends to support high-level decision-making.",
  "context": { "route": "/dashboard/command-center", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(dashboard)/command-center/page.tsx"],
  "steps": ["Verify strategic map visualization.", "Confirm aggregation of data from multiple campaigns.", "Ensure reporting and export features are working."],
  "acceptance_criteria": ["Provides a clear, accurate overview of the entire operational theater.", "Decision-makers can drill down into specific areas of interest.", "Generates executive-level reports."],
  "constraints": ["Data aggregation must be efficient to handle large volumes of information."],
  "testing": ["Test data aggregation accuracy.", "Verify report generation functionality."],
  "progress_report": "apps/web/app/(dashboard)/_reports/command-center.PROGRESS.md"
}
```

### `/dashboard/tools/image-influence-lab` — Image Influence Lab

```json
{
  "role": "Visual Analyst",
  "objective": "Empower analysts to dissect and understand the spread and impact of visual propaganda, memes, and manipulated imagery.",
  "context": { "route": "/dashboard/tools/image-influence-lab", "status": "Implemented", "components": ["ImageUpload", "ReverseImageSearch", "ManipulationDetector"] },
  "files_to_verify": ["apps/web/app/(dashboard)/tools/image-influence-lab/page.tsx"],
  "steps": ["Verify image upload and processing.", "Confirm integration with reverse image search APIs.", "Test the display of image forensics data."],
  "acceptance_criteria": ["Users can upload an image and receive a detailed analysis of its origins and spread.", "The tool identifies potential manipulations (e.g., deepfakes, photoshop).", "Results are presented in a clear, understandable report."],
  "constraints": ["Relies on specialized third-party or in-house AI models for analysis."],
  "testing": ["Test with various image types and manipulations.", "Verify API integrations."],
  "progress_report": "apps/web/app/(dashboard)/_reports/image-influence-lab.PROGRESS.md"
}
```

---

## (academy)

### `/academy` — Academy Index

```json
{
  "role": "Training Coordinator",
  "objective": "Provide users with a centralized hub for all training and educational materials, including tutorials, courses, and tactical playbooks.",
  "context": { "route": "/academy", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(academy)/page.tsx"],
  "steps": ["Verify the catalog of educational content is displayed correctly.", "Ensure users can filter and search for materials.", "Confirm links to individual content pages are correct."],
  "acceptance_criteria": ["Users can easily find relevant training materials.", "The user's progress is tracked and displayed.", "New content is highlighted."],
  "constraints": [],
  "testing": ["Test search and filtering functionality.", "Verify progress tracking for a test user."],
  "progress_report": "apps/web/app/(academy)/_reports/academy.PROGRESS.md"
}
```

### `/academy/[slug]` — Article Detail Page

```json
{
  "role": "Instructional Designer",
  "objective": "Deliver focused, in-depth educational content on a specific topic, tactic, or technique in a clear and engaging format.",
  "context": { "route": "/academy/[slug]", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(academy)/[slug]/page.tsx"],
  "steps": ["Verify dynamic fetching and rendering of article content.", "Ensure embedded media (videos, images) are displayed correctly.", "Confirm navigation to next/previous articles."],
  "acceptance_criteria": ["Content is rendered from a CMS or markdown files.", "The format is highly readable and accessible.", "Users can mark articles as complete."],
  "constraints": ["Supports rich media and code snippets."],
  "testing": ["Test with various article slugs, including invalid ones.", "Verify rendering of different content types."],
  "progress_report": "apps/web/app/(academy)/_reports/article.PROGRESS.md"
}
```

---

## (trust)

### `/trust/transparency` — Transparency Center

```json
{
  "role": "Ethics Officer",
  "objective": "Build user trust by providing a central location for all materials related to the platform's operations, data handling, and ethical guidelines.",
  "context": { "route": "/trust/transparency", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(trust)/transparency/page.tsx"],
  "steps": ["Verify links to key documents (e.g., privacy policy, audit reports).", "Ensure transparency reports are displayed correctly.", "Confirm the layout is clear and easy to navigate."],
  "acceptance_criteria": ["Users can easily access all transparency-related information.", "The content is presented in a non-technical, understandable manner.", "The page is kept up-to-date with the latest reports."],
  "constraints": [],
  "testing": ["Verify all links to documents are valid.", "Content review by the ethics/legal team."],
  "progress_report": "apps/web/app/(trust)/_reports/transparency.PROGRESS.md"
}
```

---

## (enterprise)

### `/enterprise` — Enterprise Landing Page

```json
{
  "role": "Sales Engineer",
  "objective": "Showcase the platform's enterprise-grade features, security, and compliance to attract and inform potential organizational customers.",
  "context": { "route": "/enterprise", "status": "Implemented" },
  "files_to_verify": ["apps/web/app/(enterprise)/page.tsx"],
  "steps": ["Verify the display of enterprise features and benefits.", "Ensure CTAs for contacting sales or requesting an enterprise demo are prominent.", "Confirm testimonials or case studies are displayed."],
  "acceptance_criteria": ["Clearly communicates the value proposition for large organizations.", "Provides clear next steps for interested parties.", "The page is professional and builds confidence."],
  "constraints": ["Content must be aligned with the sales and marketing strategy."],
  "testing": ["Verify all sales-related CTAs are working correctly.", "Content review by the marketing team."],
  "progress_report": "apps/web/app/(enterprise)/_reports/enterprise.PROGRESS.md"
}
```

---

## Shared Layouts & Metadata

### Group `layout.tsx` per segment

```json
{
  "role": "Frontend Architect",
  "objective": "Define distinct, shared layouts for each major application segment ((public), (auth), (dashboard), etc.) to ensure consistent UI and behavior within each context while allowing for variation between them.",
  "context": { "status": "Implemented", "targets": ["(public)", "(auth)", "(dashboard)", "(academy)", "(trust)", "(enterprise)"] },
  "files_to_verify": [
    "apps/web/app/(public)/layout.tsx",
    "apps/web/app/(auth)/layout.tsx",
    "apps/web/app/(dashboard)/layout.tsx",
    "apps/web/app/(academy)/layout.tsx",
    "apps/web/app/(trust)/layout.tsx",
    "apps/web/app/(enterprise)/layout.tsx"
  ],
  "steps": ["Verify each layout includes the appropriate shell (e.g., dashboard layout has a sidebar and header).", "Ensure each layout correctly handles its children pages.", "Confirm metadata (e.g., titles, descriptions) is correctly applied at the layout level."],
  "acceptance_criteria": ["Each route group has a consistent and appropriate layout.", "Layouts correctly handle authentication state (e.g., redirecting unauthenticated users from dashboard).", "Metadata is correctly inherited and overridden by child pages."],
  "constraints": ["Layouts should be minimal and compose shared components to avoid duplication."],
  "testing": ["E2E tests to ensure pages within each segment share the correct layout.", "Verify title and metadata changes when navigating between pages."],
  "progress_report": "apps/web/app/_reports/layouts.PROGRESS.md"
}
```

---

## Root & Platform

### Root layout & Middleware

```json
{
  "role": "Platform Engineer",
  "objective": "Define the root application shell, including global styles, providers, and core routing logic through middleware.",
  "context": { "status": "Implemented" },
  "files_to_create": ["apps/web/app/layout.tsx", "apps/web/middleware.ts"],
  "steps": ["Verify root layout correctly wraps all pages.", "Check that global providers (Theme, Auth, i18n) are included.", "Review middleware for correct handling of authentication, redirects, and internationalization."],
  "acceptance_criteria": ["All pages share the root layout.", "Middleware correctly protects routes and handles i18n routing.", "Global styles are applied correctly."],
  "constraints": ["Middleware should be as performant as possible to avoid adding latency to requests."],
  "testing": ["Test protected routes with and without authentication.", "Test i18n redirects."],
  "progress_report": "apps/web/app/_reports/root-platform.PROGRESS.md"
}
```

### i18n & Telemetry Infrastructure

```json
{
  "role": "Platform Engineer",
  "objective": "Establish a robust internationalization (i18n) system and a comprehensive telemetry pipeline for monitoring and observability.",
  "context": { "status": "Partially Implemented" },
  "files_to_create": ["apps/web/lib/i18n/config.ts", "apps/web/lib/telemetry.ts", "apps/web/instrumentation.ts"],
  "steps": [
    "Verify the basic i18n configuration.",
    "**TODO: Implement RTL support for Hebrew and Arabic.**",
    "**TODO: Create a process for managing and adding translation keys for all content.**",
    "Verify telemetry is configured with Sentry and OpenTelemetry.",
    "**TODO: Enhance telemetry with custom spans for critical operations.**"
  ],
  "acceptance_criteria": ["The i18n system supports multiple languages.", "A language switcher allows users to change locales.", "Errors and performance data are captured in Sentry/OTel.", "The system is ready for full RTL support and translation key integration."],
  "constraints": ["The i18n implementation must be performant and not significantly increase bundle size."],
  "testing": ["Test language switching.", "Verify that errors are reported to Sentry.", "Define and implement tests for RTL styling once added."],
  "progress_report": "apps/web/app/_reports/i18n-telemetry.PROGRESS.md"
}
```

---

## Testing & CI

### Continuous Integration & Quality Gates

```json
{
  "role": "DevOps Engineer",
  "objective": "To establish a comprehensive and automated CI and testing pipeline that ensures code quality, prevents regressions, and enforces performance and accessibility standards.",
  "context": { "dir": "apps/web" },
  "files_to_create": [
    "apps/web/tests/accessibility.spec.ts",
    "apps/web/performance-budgets.json"
  ],
  "files_to_verify": [
    "apps/web/tests/smoke.spec.ts",
    ".github/workflows/ci.yml"
  ],
  "steps": [
    "Configure the CI workflow (`ci.yml`) to run on every pull request to the main branch.",
    "Implement a comprehensive E2E smoke test (`smoke.spec.ts`) that covers critical user flows (login, dashboard load, public page access).",
    "Create a dedicated accessibility test suite (`accessibility.spec.ts`) using `axe-playwright` to audit key pages (e.g., Dashboard, Landing Page, Sign-in).",
    "Define performance budgets in `performance-budgets.json` and integrate Lighthouse CI (`lhci`) into the workflow to enforce them on key pages."
  ],
  "acceptance_criteria": [
    "The CI pipeline automatically runs linting, type-checking, unit tests, and E2E tests.",
    "Pull requests are blocked from merging if any tests, audits, or checks fail.",
    "Accessibility violations (WCAG 2.2 AA) and performance budget regressions cause the build to fail."
  ],
  "constraints": ["The CI pipeline must complete in a reasonable time frame (e.g., under 15 minutes)."],
  "testing": [
    "A multi-layered strategy: 1) **Unit Tests (Vitest)** for components/utilities. 2) **Integration Tests (Vitest)** for component interactions. 3) **E2E Tests (Playwright)** for critical user journeys. 4) **Automated Audits** for Accessibility (Axe) and Performance (Lighthouse)."
  ],
  "progress_report": "apps/web/app/_reports/ci.PROGRESS.md"
}
```
