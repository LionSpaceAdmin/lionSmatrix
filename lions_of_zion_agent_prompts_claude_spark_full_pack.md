# Lions of Zion — Agent Prompts (Claude/Spark) — Full Pack

**Purpose:** One-stop prompt pack: every page in the App Router tree has a smart English agent prompt (AI-agent style) ready for handoff to **Claude (Spark)**. Copy any block to scaffold that page. Prompts are production-leaning and consistent.

> **Global guardrails (apply to every prompt below)**
> - **Tech:** Next.js **App Router** (RSC where possible), TypeScript, Tailwind + **shadcn/ui**, React Query only in Client Components, `useServerPrefetch()` pattern for hydration.
> - **Design:** Dark, modern, network/graph hero, bold typography, generous spacing, clear CTAs. A11y (WCAG 2.2 AA), keyboard-first, RTL-ready.
> - **Content:** EN default; HE/ES/FR/DE/AR i18n with RTL for HE/AR; alt text everywhere; clear empty/error states; microcopy calm + action-oriented.
> - **No backend build now:** Use mocks/adapters only; contract-first placeholders OK.
> - **CTAs:** “Join the fight — Free”, “Explore the War Machine”, “Fact‑Check”, “Report Fake”.
> - **Budgets:** LCP ≤ 2.5s (mid-tier mobile), CLS < 0.1, a11y score ≥ 95, TBT ≤ 200ms.

---

## (public)

### `/` — Landing (Home)
```json
{
  "role": "You are Claude (Spark), a Next.js App Router page builder agent.",
  "objective": "Build the public Landing page that introduces Lions of Zion and funnels users to Join and the War Machine.",
  "context": {
    "route": "/",
    "design": "Dark, modern hero with animated network/graph, bold H1, trust-first cues, minimal choices.",
    "reusable_components": ["NarrativeCard", "UseNowSnippet", "ActionGrid", "ThreatStrip", "AlertBanner", "PledgeBox", "SharePackModule", "ProvenanceBadge"],
    "i18n": "EN default + HE/ES/FR/DE/AR (RTL for HE/AR)",
    "seo": "Indexable, OpenGraph/Twitter cards, canonical, structured data (Organization, WebSite)."
  },
  "files_to_create": [
    "apps/web/app/(public)/page.tsx",
    "apps/web/app/(public)/head.tsx",
    "apps/web/app/(public)/_content/landing.copy.json"
  ],
  "steps": [
    "Create RSC page with hero section (network/graph canvas, performance budget ≤ 60ms main-thread on first paint).",
    "Add primary CTAs: 'Join the fight — Free' and 'Explore the War Machine'.",
    "Place trust cues (ProvenanceBadge, transparency link) above the fold.",
    "Show 3–6 NarrativeCards (mock data) with Evidence count and 'Fact-Check' quick action.",
    "Add ActionGrid with 4 actions (Fact-Check, Report Fake, Daily Brief, Join).",
    "Implement i18n toggle with RTL flip and locale-aware typography.",
    "Add SEO metadata + JSON-LD and basic analytics events for CTA clicks."
  ],
  "acceptance_criteria": [
    "LCP ≤ 2.5s on mid-tier mobile; CLS < 0.1; a11y score ≥ 95.",
    "Hero network anim pauses on reduced motion.",
    "CTAs navigate to /auth/join and /dashboard/war-machine (guarded).",
    "All text localizes; RTL mirrors layout correctly.",
    "No client fetch in RSC; client widgets use React Query only."
  ],
  "constraints": ["No external analytics besides stubbed events", "No server mutations", "Edge-safe code in RSC"],
  "testing": ["Playwright smoke: hero visible, CTAs route", "Lighthouse CI budgets", "axe-core a11y checks"],
  "telemetry": ["Emit event `cta_click` with {id, locale}", "OTel trace for RSC render"],
  "progress_report": "Write apps/web/app/(public)/_reports/landing.PROGRESS.md summarizing scope, decisions, TODOs."
}
```

### `/opening` — Opening Screen (splash/onramp)
```json
{
  "role": "Claude (Spark) Next.js page builder",
  "objective": "Build an optional opening splash with purpose statement and safety pledge box.",
  "context": { "route": "/opening", "components": ["PledgeBox", "AlertBanner"] },
  "files_to_create": ["apps/web/app/(public)/opening/page.tsx"],
  "steps": [
    "Render PledgeBox with mission statement and 'Agree & Continue' CTA to '/'",
    "Display optional AlertBanner for current threat advisories (mock).",
    "Persist consent choice to cookie (client) for skip-on-return."
  ],
  "acceptance_criteria": ["Cookie-based skip works; accessibility labels present; RTL ok."],
  "constraints": ["Client-only for cookie logic; no PII stored"],
  "testing": ["Cookie flow unit test", "Keyboard navigation"],
  "progress_report": "apps/web/app/(public)/_reports/opening.PROGRESS.md"
}
```

### `/daily-brief`
```json
{
  "role": "Claude (Spark)",
  "objective": "Build the Daily Brief page summarizing top narratives and actions.",
  "context": { "route": "/daily-brief", "components": ["NarrativeCard", "UseNowSnippet", "ThreatStrip"] },
  "files_to_create": ["apps/web/app/(public)/daily-brief/page.tsx"],
  "steps": [
    "Render date header with locale formatting.",
    "List 5–10 NarrativeCards with severity chips and last-updated time.",
    "Sidebar: UseNowSnippet (shareable copy, multi-language) and subscription CTA."
  ],
  "acceptance_criteria": ["Cards skeleton on loading; empty-state message; share copy localized."],
  "constraints": ["RSC for list, client for share copy interactions"],
  "testing": ["Snapshot + Playwright filter test"],
  "progress_report": "apps/web/app/(public)/_reports/daily-brief.PROGRESS.md"
}
```

### `/archive`
```json
{
  "role": "Claude (Spark)",
  "objective": "Build the Archive index with filters and pagination.",
  "context": { "route": "/archive", "components": ["NarrativeCard", "EvidenceList"] },
  "files_to_create": ["apps/web/app/(public)/archive/page.tsx"],
  "steps": [
    "Search + filters (topic, region, date range, threat type).",
    "Paginated grid of NarrativeCards; persist query in URL.",
    "Expose SSR-friendly generateMetadata() for SEO-able facets."
  ],
  "acceptance_criteria": ["Filter state in URL; back/forward works; results keyboard-accessible."],
  "constraints": ["Use Next.js searchParams; no client-only router hacks"],
  "testing": ["URL-state e2e tests", "Accessibility of filters"],
  "progress_report": "apps/web/app/(public)/_reports/archive.PROGRESS.md"
}
```

### `/archive/[narrativeId]` — Narrative Detail
```json
{
  "role": "Claude (Spark)",
  "objective": "Build narrative detail page with evidence, timeline, and share pack.",
  "context": { "route": "/archive/[narrativeId]", "components": ["EvidenceList", "SharePackModule", "ProvenanceBadge"] },
  "files_to_create": ["apps/web/app/(public)/archive/[narrativeId]/page.tsx"],
  "steps": [
    "RSC fetch by id (mock) with notFound() and dynamic metadata.",
    "Sections: Claim, Verdict, Confidence, EvidenceList, Timeline, SharePackModule.",
    "ProvenanceBadge shows verification status; copy-to-clipboard share variants."
  ],
  "acceptance_criteria": [
    "Deep-linking to evidence hash works; 404 uses not-found.tsx; share UTM params appended."
  ],
  "constraints": ["Avoid heavy client bundles; split SharePackModule client-only"],
  "testing": ["Route param tests; copy/share unit tests"],
  "progress_report": "apps/web/app/(public)/_reports/narrative-detail.PROGRESS.md"
}
```

### `/playbooks`
```json
{
  "role": "Claude (Spark)",
  "objective": "Catalog of Crisis/Response Playbooks with filters and preview.",
  "context": { "route": "/playbooks", "components": ["ActionGrid"] },
  "files_to_create": ["apps/web/app/(public)/playbooks/page.tsx"],
  "steps": [
    "Grid of playbooks with tags, preview modal, 'Use this' CTA routing to dashboard/campaigns"
  ],
  "acceptance_criteria": ["Keyboard modal, focus trap, i18n titles"],
  "constraints": ["RSC list; client modal"],
  "testing": ["Modal a11y", "Route CTA exists"],
  "progress_report": "apps/web/app/(public)/_reports/playbooks.PROGRESS.md"
}
```

### `/impact`
```json
{
  "role": "Claude (Spark)",
  "objective": "Public impact metrics page (transparent, high-level).",
  "context": { "route": "/impact" },
  "files_to_create": ["apps/web/app/(public)/impact/page.tsx"],
  "steps": [
    "KPI cards (mock): narratives addressed, fact-checks published, reach.",
    "Methodology disclosure accordion.",
    "Embed simple timeline chart (client) with reduced-motion handling."
  ],
  "acceptance_criteria": ["Methodology visible; chart accessible with table fallback"],
  "constraints": ["Client chart lazy-loaded"],
  "testing": ["Chart renders; reduced-motion snapshot"],
  "progress_report": "apps/web/app/(public)/_reports/impact.PROGRESS.md"
}
```

### `/about` (Transparency)
```json
{
  "role": "Claude (Spark)",
  "objective": "Transparency page with governance, data use, provenance.",
  "context": { "route": "/about", "components": ["ProvenanceBadge"] },
  "files_to_create": ["apps/web/app/(public)/about/page.tsx"],
  "steps": [
    "Sections: mission, funding transparency, data handling, provenance policy.",
    "Link to trust/* pages; include ProvenanceBadge for this page content."
  ],
  "acceptance_criteria": ["Readable at 320px; links to trust pages work"],
  "constraints": ["Static RSC"],
  "testing": ["Links test; content snapshot"],
  "progress_report": "apps/web/app/(public)/_reports/about.PROGRESS.md"
}
```

### `/faq`
```json
{
  "role": "Claude (Spark)",
  "objective": "FAQ accordion with search.",
  "context": { "route": "/faq" },
  "files_to_create": ["apps/web/app/(public)/faq/page.tsx"],
  "steps": ["Search filters visible Q&A; deep-link to question via hash id."],
  "acceptance_criteria": ["Hash linking focuses the item; RTL ok"],
  "constraints": ["Client only for search index; no network"],
  "testing": ["Hash routing test"],
  "progress_report": "apps/web/app/(public)/_reports/faq.PROGRESS.md"
}
```

### `/contact`
```json
{
  "role": "Claude (Spark)",
  "objective": "Contact/Community Hub with channels and intake form (mock).",
  "context": { "route": "/contact" },
  "files_to_create": ["apps/web/app/(public)/contact/page.tsx"],
  "steps": [
    "List channels (email, Telegram, X) with trust cues.",
    "Intake form with validation; submit to mock endpoint; show success/failed states."
  ],
  "acceptance_criteria": ["Form a11y; validation messages localize"],
  "constraints": ["No real submission; mock adapter"],
  "testing": ["Form validation unit tests"],
  "progress_report": "apps/web/app/(public)/_reports/contact.PROGRESS.md"
}
```

### `/search`
```json
{
  "role": "Claude (Spark)",
  "objective": "Global search across narratives and playbooks (mock).",
  "context": { "route": "/search" },
  "files_to_create": ["apps/web/app/(public)/search/page.tsx"],
  "steps": ["Query param syncing, debounced input, results grouped by type."],
  "acceptance_criteria": ["Escape closes results; keyboard arrows navigate items"],
  "constraints": ["Client-only search index"],
  "testing": ["Keyboard navigation e2e"],
  "progress_report": "apps/web/app/(public)/_reports/search.PROGRESS.md"
}
```

### `/legal/terms` & `/legal/privacy`
```json
{
  "role": "Claude (Spark)",
  "objective": "Legal pages with long-form content and anchors.",
  "context": { "routes": ["/legal/terms", "/legal/privacy"] },
  "files_to_create": [
    "apps/web/app/(public)/legal/terms/page.tsx",
    "apps/web/app/(public)/legal/privacy/page.tsx"
  ],
  "steps": ["Render MDX content with in-page TOC, anchors, updated date, version."],
  "acceptance_criteria": ["TOC sticky within container; deep-links stable"],
  "constraints": ["Static RSC; optional small client observer for TOC"],
  "testing": ["Anchor links tests"],
  "progress_report": "apps/web/app/(public)/_reports/legal.PROGRESS.md"
}
```

### `not-found.tsx`
```json
{
  "role": "Claude (Spark)",
  "objective": "Custom 404 with helpful links and search box.",
  "context": { "file": "apps/web/app/not-found.tsx" },
  "files_to_create": ["apps/web/app/not-found.tsx"],
  "steps": ["Friendly message + links to /, /search, /daily-brief; i18n ready."],
  "acceptance_criteria": ["Announces error via aria-live; focus on heading"],
  "constraints": ["Static component"],
  "testing": ["Render test only"],
  "progress_report": "apps/web/app/_reports/not-found.PROGRESS.md"
}
```

---

## (auth)

### `/auth/sign-in`
```json
{
  "role": "Claude (Spark)",
  "objective": "Build Sign-in page with providers and email magic link (mock).",
  "context": { "route": "/auth/sign-in" },
  "files_to_create": ["apps/web/app/(auth)/sign-in/page.tsx"],
  "steps": [
    "List providers (X, Google) buttons; email form for magic link (mock).",
    "Explain data usage and link to /about and /legal/privacy."
  ],
  "acceptance_criteria": ["Form validation; provider buttons disabled during mock auth"],
  "constraints": ["No real auth; emit stub events"],
  "testing": ["Validation unit test"],
  "progress_report": "apps/web/app/(auth)/_reports/sign-in.PROGRESS.md"
}
```

### `/auth/join`
```json
{
  "role": "Claude (Spark)",
  "objective": "Join page that highlights value and funnels to onboarding.",
  "context": { "route": "/auth/join" },
  "files_to_create": ["apps/web/app/(auth)/join/page.tsx"],
  "steps": [
    "Value props, testimonials (mock), CTA 'Join the fight — Free' → /auth/onboarding.",
    "FAQ mini-accordion for blockers."
  ],
  "acceptance_criteria": ["CTA routes correctly; testimonials are accessible"],
  "constraints": ["RSC content; minimal client JS"],
  "testing": ["Route test"],
  "progress_report": "apps/web/app/(auth)/_reports/join.PROGRESS.md"
}
```

### `/auth/onboarding`
```json
{
  "role": "Claude (Spark)",
  "objective": "Multi-step onboarding (interests, locale, notifications).",
  "context": { "route": "/auth/onboarding" },
  "files_to_create": ["apps/web/app/(auth)/onboarding/page.tsx"],
  "steps": [
    "3-step wizard with progress; store selections client-side (mock).",
    "On completion, route to /dashboard."
  ],
  "acceptance_criteria": ["Keyboard navigation; step state preserved on back"],
  "constraints": ["Client-only wizard; no network"],
  "testing": ["Wizard flow e2e"],
  "progress_report": "apps/web/app/(auth)/_reports/onboarding.PROGRESS.md"
}
```

---

## (dashboard)

### `/dashboard` — Post-join overview
```json
{
  "role": "Claude (Spark)",
  "objective": "Dashboard overview summarizing alerts, missions, and quick actions.",
  "context": { "route": "/dashboard", "components": ["ThreatStrip", "ActionGrid", "Mission widgets"] },
  "files_to_create": ["apps/web/app/(dashboard)/page.tsx"],
  "steps": [
    "Top: ThreatStrip with latest advisories (mock).",
    "Cards: My Missions, Recent Fact-Checks, Quick Actions (War Machine).",
    "Personalized tips based on onboarding selections (mock)."
  ],
  "acceptance_criteria": ["Widgets skeleton on load; responsive ≥320px"],
  "constraints": ["RSC layout; widget clients isolated"],
  "testing": ["Snapshot + routing"],
  "progress_report": "apps/web/app/(dashboard)/_reports/dashboard.PROGRESS.md"
}
```

### `/dashboard/war-machine` — Tool hub
```json
{
  "role": "Claude (Spark)",
  "objective": "War Machine hub with tiles linking to AI tools.",
  "context": { "route": "/dashboard/war-machine", "components": ["ActionGrid"] },
  "files_to_create": ["apps/web/app/(dashboard)/war-machine/page.tsx"],
  "steps": [
    "Tiles: Image Influence Lab, Fact-Check Window, Report/Research, #FakeResistance Tracker, Deep Research Daily.",
    "Each tile shows short description, 'Open' CTA, and permission badge."
  ],
  "acceptance_criteria": ["Tiles keyboard operable; links route"],
  "constraints": ["Static RSC"],
  "testing": ["Tile routing e2e"],
  "progress_report": "apps/web/app/(dashboard)/_reports/war-machine.PROGRESS.md"
}
```

### `/dashboard/tools/image-influence-lab`
```json
{
  "role": "Claude (Spark)",
  "objective": "Scaffold a canvas-based lab for testing image messaging variants (UI only).",
  "context": { "route": "/dashboard/tools/image-influence-lab", "components": ["Upload zone", "Variant grid", "SharePackModule"] },
  "files_to_create": ["apps/web/app/(dashboard)/tools/image-influence-lab/page.tsx"],
  "steps": [
    "Upload image (client), add headline/copy variants, preview grid.",
    "Export share pack (mock); guidelines panel for safe content."
  ],
  "acceptance_criteria": ["Drop/upload accessible; previews lazy-loaded"],
  "constraints": ["Client-only; no image processing server-side"],
  "testing": ["Upload and variant add tests"],
  "progress_report": "apps/web/app/(dashboard)/_reports/image-lab.PROGRESS.md"
}
```

### `/dashboard/tools/fact-check`
```json
{
  "role": "Claude (Spark)",
  "objective": "Fact-Check Window UI to input a claim and assemble evidence (UI only).",
  "context": { "route": "/dashboard/tools/fact-check", "components": ["EvidenceList", "ProvenanceBadge"] },
  "files_to_create": ["apps/web/app/(dashboard)/tools/fact-check/page.tsx"],
  "steps": [
    "Claim input, suggested sources (mock), EvidenceList builder, verdict preview.",
    "Export PDF (mock) and share link (stub)."
  ],
  "acceptance_criteria": ["Evidence items sortable; print stylesheet decent"],
  "constraints": ["Client build; no scraping"],
  "testing": ["Evidence add/remove tests"],
  "progress_report": "apps/web/app/(dashboard)/_reports/fact-check.PROGRESS.md"
}
```

### `/dashboard/tools/report-research`
```json
{
  "role": "Claude (Spark)",
  "objective": "Report/Research intake for suspicious content with attachments (mock).",
  "context": { "route": "/dashboard/tools/report-research" },
  "files_to_create": ["apps/web/app/(dashboard)/tools/report-research/page.tsx"],
  "steps": [
    "Multi-field form, file drop, classification dropdown, consent checkbox.",
    "Submit to mock; show ticket id (fake)."
  ],
  "acceptance_criteria": ["Form a11y; file types validated"],
  "constraints": ["No uploads leave browser"],
  "testing": ["Validation tests"],
  "progress_report": "apps/web/app/(dashboard)/_reports/report-research.PROGRESS.md"
}
```

### `/dashboard/tools/fake-resistance-tracker`
```json
{
  "role": "Claude (Spark)",
  "objective": "Tracker UI to monitor counter-messaging efforts (mock).",
  "context": { "route": "/dashboard/tools/fake-resistance-tracker" },
  "files_to_create": ["apps/web/app/(dashboard)/tools/fake-resistance-tracker/page.tsx"],
  "steps": [
    "Table of campaigns, status chips, progress bars.",
    "Detail drawer with actions taken and next steps."
  ],
  "acceptance_criteria": ["Sortable columns; drawer keyboard accessible"],
  "constraints": ["Client table; virtualization if >100 rows"],
  "testing": ["Table sort tests"],
  "progress_report": "apps/web/app/(dashboard)/_reports/fake-resistance.PROGRESS.md"
}
```

### `/dashboard/tools/deep-research-daily`
```json
{
  "role": "Claude (Spark)",
  "objective": "Daily research workspace with saved queries and notes (mock).",
  "context": { "route": "/dashboard/tools/deep-research-daily" },
  "files_to_create": ["apps/web/app/(dashboard)/tools/deep-research-daily/page.tsx"],
  "steps": [
    "Saved query list (mock), result panel placeholder, notes editor (client).",
    "Export notes as Markdown (local)."
  ],
  "acceptance_criteria": ["Notes persist in local storage; export works"],
  "constraints": ["No external calls"],
  "testing": ["Local storage test"],
  "progress_report": "apps/web/app/(dashboard)/_reports/deep-research.PROGRESS.md"
}
```

### `/dashboard/campaigns`
```json
{
  "role": "Claude (Spark)",
  "objective": "Campaign Blueprints list and creation wizard (UI only).",
  "context": { "route": "/dashboard/campaigns" },
  "files_to_create": ["apps/web/app/(dashboard)/campaigns/page.tsx"],
  "steps": [
    "List existing (mock) blueprints; 'New Campaign' launches wizard modal.",
    "Wizard captures goals, audience, channels; outputs YAML preview."
  ],
  "acceptance_criteria": ["YAML copy-to-clipboard; wizard validates required fields"],
  "constraints": ["Client modal; no network"],
  "testing": ["Wizard validation tests"],
  "progress_report": "apps/web/app/(dashboard)/_reports/campaigns.PROGRESS.md"
}
```

---

## (academy)

### `/academy`
```json
{
  "role": "Claude (Spark)",
  "objective": "Knowledge base index with search and categories.",
  "context": { "route": "/academy" },
  "files_to_create": ["apps/web/app/(academy)/page.tsx"],
  "steps": ["Category cards, search, featured playbooks, MDX support for articles."],
  "acceptance_criteria": ["Search filters by tag; MDX renders headings with anchors"],
  "constraints": ["RSC for index; client search"],
  "testing": ["Search test"],
  "progress_report": "apps/web/app/(academy)/_reports/academy.PROGRESS.md"
}
```

### `/academy/[slug]`
```json
{
  "role": "Claude (Spark)",
  "objective": "Article detail rendering MDX content with TOC.",
  "context": { "route": "/academy/[slug]" },
  "files_to_create": ["apps/web/app/(academy)/[slug]/page.tsx"],
  "steps": ["Load MDX (mock), render TOC, next/prev links."],
  "acceptance_criteria": ["TOC reflects headings; keyboard nav ok"],
  "constraints": ["Dynamic now with mock; SSG later"],
  "testing": ["Anchor links"],
  "progress_report": "apps/web/app/(academy)/_reports/article.PROGRESS.md"
}
```

---

## (trust)

### `/trust/transparency`
```json
{
  "role": "Claude (Spark)",
  "objective": "Transparency hub linking to data export, provenance, and DSR.",
  "context": { "route": "/trust/transparency" },
  "files_to_create": ["apps/web/app/(trust)/transparency/page.tsx"],
  "steps": [
    "Cards linking to provenance policy, data export (mock), deletion request (mock).",
    "Explain verification and retention in plain language."
  ],
  "acceptance_criteria": ["Links work; copy reading level friendly"],
  "constraints": ["RSC static"],
  "testing": ["Links present"],
  "progress_report": "apps/web/app/(trust)/_reports/transparency.PROGRESS.md"
}
```

### `/trust/provenance`
```json
{
  "role": "Claude (Spark)",
  "objective": "Provenance & Verification explainer with C2PA examples.",
  "context": { "route": "/trust/provenance", "components": ["ProvenanceBadge"] },
  "files_to_create": ["apps/web/app/(trust)/provenance/page.tsx"],
  "steps": ["Explain C2PA, show samples with ProvenanceBadge states."],
  "acceptance_criteria": ["Samples keyboard navigable; aria labels describe state"],
  "constraints": ["Static content"],
  "testing": ["A11y snapshot"],
  "progress_report": "apps/web/app/(trust)/_reports/provenance.PROGRESS.md"
}
```

### `/trust/dsr` — Data Subject Requests
```json
{
  "role": "Claude (Spark)",
  "objective": "DSR request form (export/delete) with mock processing.",
  "context": { "route": "/trust/dsr" },
  "files_to_create": ["apps/web/app/(trust)/dsr/page.tsx"],
  "steps": ["Form with identity confirmation notice; submit to mock; show ticket id."],
  "acceptance_criteria": ["Clear consent copy; success/failure states"],
  "constraints": ["No PII stored; client-only"],
  "testing": ["Validation tests"],
  "progress_report": "apps/web/app/(trust)/_reports/dsr.PROGRESS.md"
}
```

---

## (enterprise)

### `/enterprise`
```json
{
  "role": "Claude (Spark)",
  "objective": "B2B landing for organizations with RBAC/Tenant messaging.",
  "context": { "route": "/enterprise" },
  "files_to_create": ["apps/web/app/(enterprise)/page.tsx"],
  "steps": ["Hero for orgs, features table, 'Talk to us' CTA → /contact."],
  "acceptance_criteria": ["Responsive table; CTA routes"],
  "constraints": ["Static RSC"],
  "testing": ["Snapshot"],
  "progress_report": "apps/web/app/(enterprise)/_reports/enterprise.PROGRESS.md"
}
```

---

## Shared layouts & metadata (optional)

### Group `layout.tsx` per segment
```json
{
  "role": "Claude (Spark)",
  "objective": "Create group layout with navigation, locale switcher, and proper dir=rtl in HE/AR.",
  "context": { "targets": ["(public)", "(auth)", "(dashboard)", "(academy)", "(trust)", "(enterprise)"] },
  "files_to_create": ["apps/web/app/(public)/layout.tsx", "... per group"],
  "steps": ["Header, footer, locale switcher, Skip-to-content link, semantic landmarks."],
  "acceptance_criteria": ["RTL mirrors layout; landmarks present; focus ring visible"],
  "constraints": ["RSC layout; client locale toggle"],
  "testing": ["axe-core pass ≥ 95 score"],
  "progress_report": "apps/web/app/_reports/layouts.PROGRESS.md"
}
```

---

# Root & Platform Prompts (Agent‑Ready)

### `app/layout.tsx` — Root layout (all segments)
```json
{
  "role": "Claude (Spark)",
  "objective": "Create the root layout that wires SEO metadata, i18n dir switching (LTR/RTL), global fonts, theming, skip‑links, and shared shell.",
  "context": {
    "file": "apps/web/app/layout.tsx",
    "i18n": {"defaultLocale": "en", "locales": ["en", "he", "es", "fr", "de", "ar"], "rtlLocales": ["he", "ar"]},
    "design": "Dark, modern; bold type; accessible focus rings; network/graph motif only where needed (no heavy JS here)."
  },
  "files_to_create": ["apps/web/app/layout.tsx", "apps/web/app/globals.css"],
  "steps": [
    "Export `metadata` with title template, OpenGraph, Twitter, canonical.",
    "Compute `<html dir>` from locale; set `lang` and `suppressHydrationWarning`.",
    "Header: Skip‑to‑content link, logo (text ok), locale switcher placeholder.",
    "Wrap children with `<Providers>` (Theme, QueryClient, Tooltip/Toaster).",
    "Footer with minimal nav and transparency link."
  ],
  "acceptance_criteria": [
    "RTL mirrors layout; skip link visible on focus; a11y score ≥95.",
    "No client data fetch here; only providers mount client‑side.",
    "Metadata renders correct per route; subpages override via generateMetadata()."
  ],
  "constraints": ["RSC file; only mount client providers inside <body> via Providers"],
  "testing": ["axe snapshot on layout", "Lighthouse budget checks"],
  "progress_report": "apps/web/app/_reports/root-layout.PROGRESS.md"
}
```

### `app/providers.tsx` — Client providers
```json
{
  "role": "Claude (Spark)",
  "objective": "Expose a single client component that wires ThemeProvider, QueryClientProvider, TooltipProvider, and Toaster, plus Direction provider for RTL.",
  "context": {"file": "apps/web/app/providers.tsx"},
  "files_to_create": ["apps/web/app/providers.tsx"],
  "steps": [
    "Create QueryClient singleton with devtools gated by NODE_ENV.",
    "ThemeProvider with system + dark default; persist in localStorage.",
    "Determine `dir` from i18n helper; apply via a wrapper `dir` attribute.",
    "Export `{children, locale}` props signature for use in layout."
  ],
  "acceptance_criteria": ["Providers load only once; no double creation in React strict"],
  "constraints": ["Client component; zero network by default"],
  "testing": ["JSDOM render test; hydration warning free"],
    "progress_report": "apps/web/app/_reports/providers.PROGRESS.md"
}
```

### `middleware.ts` — Locale detection + routing
```json
{
  "role": "Claude (Spark)",
  "objective": "Detect locale from cookie `locale`, then Accept‑Language; rewrite to locale‑prefixed paths; ensure default 'en' has no prefix if configured.",
  "context": {"file": "apps/web/middleware.ts", "locales": ["en","he","es","fr","de","ar"], "defaultLocale": "en"},
  "files_to_create": ["apps/web/middleware.ts"],
  "steps": [
    "On request, read cookie `locale`; if absent, parse Accept‑Language.",
    "Normalize to supported locales; set `dir`=rtl for he/ar in request header hint (via request header or cookie).",
    "Rewrite `/` → `/en` (or bare) and `/<locale>` segmenting; ignore next/static/asset paths.",
    "Expose helper to set cookie when user toggles language (client)."
  ],
  "acceptance_criteria": ["Deep links with locale work; assets bypass; toggling language persists"],
  "constraints": ["No server session; stateless logic only"],
  "testing": ["Next middleware unit (edge) + e2e locale navigation"],
  "progress_report": "apps/web/app/_reports/middleware.PROGRESS.md"
}
```

### `lib/i18n` — Helpers & config
```json
{
  "role": "Claude (Spark)",
  "objective": "Provide i18n helpers: list of locales, `isRTL(locale)`, `getLocaleFromRequest(req)`, and typed `t(key, locale)` shim (mocked).",
  "context": {"dir": "apps/web/lib/i18n"},
  "files_to_create": ["apps/web/lib/i18n/config.ts", "apps/web/lib/i18n/index.ts"],
  "steps": [
    "Export `locales`, `defaultLocale`, `rtlLocales`.",
    "Implement `isRTL()` and `getLocaleFromRequest()`.",
    "Stub `t()` that reads from page `_content/*.json` when provided."
  ],
  "acceptance_criteria": ["Type‑safe exports; zero runtime errors when missing keys (warn only)"],
  "constraints": ["No external i18n lib yet; keep it tiny"],
  "testing": ["Unit tests for isRTL and locale parsing"],
  "progress_report": "apps/web/app/_reports/i18n.PROGRESS.md"
}
```

### `lib/telemetry.ts` — Event stubs
```json
{
  "role": "Claude (Spark)",
  "objective": "Create a minimal telemetry utility with type‑safe events: `cta_click`, `tool_opened`.",
  "context": {"file": "apps/web/lib/telemetry.ts"},
  "files_to_create": ["apps/web/lib/telemetry.ts"],
  "steps": [
    "Define union type for event names and payload shapes.",
    "Provide `track(event, payload)` no‑op that logs in dev only.",
    "SSR‑safe shim that avoids window access in RSC."
  ],
  "acceptance_criteria": ["No console noise in production; types catch bad payloads"],
  "constraints": ["No external analytics; zero network"],
  "testing": ["Unit test payload typing via tsd or TS checks"],
  "progress_report": "apps/web/app/_reports/telemetry.PROGRESS.md"
}
```

### `instrumentation.ts` — (optional) tracing stub
```json
{
  "role": "Claude (Spark)",
  "objective": "Add Next.js `instrumentation.ts` that sets up a minimal trace stub for RSC render spans (no backend).",
  "context": {"file": "apps/web/instrumentation.ts"},
  "files_to_create": ["apps/web/instrumentation.ts"],
  "steps": ["Export `register()` that logs a marker in dev"],
  "acceptance_criteria": ["Safe on Edge runtimes; never throws"],
  "constraints": ["No OTel dependencies yet"],
  "testing": ["Import test in Node env"],
  "progress_report": "apps/web/app/_reports/instrumentation.PROGRESS.md"
}
```

### `tailwind.config.ts` — Tokens & shadcn preset
```json
{
  "role": "Claude (Spark)",
  "objective": "Configure Tailwind with dark mode 'class', radix colors via shadcn preset, and motion‑safe utilities.",
  "context": {"file": "tailwind.config.ts"},
  "files_to_create": ["apps/web/tailwind.config.ts"],
  "steps": [
    "Enable content paths for app/** and components/**.",
    "Dark mode 'class'; add container defaults; extend radius/spacing/durations.",
    "Integrate shadcn preset and typography plugin."
  ],
  "acceptance_criteria": ["Build succeeds; classnames tree‑shaken"],
  "constraints": ["No custom plugin complexity"],
  "testing": ["Minimal compile test"],
  "progress_report": "apps/web/app/_reports/tailwind.PROGRESS.md"
}
```

### Testing & CI scaffolds
```json
{
  "role": "Claude (Spark)",
  "objective": "Add Playwright e2e smoke tests, axe a11y checks, and Lighthouse CI budget.",
  "context": {"dir": "apps/web"},
  "files_to_create": [
    "apps/web/e2e/basic.spec.ts",
    "apps/web/e2e/axe.spec.ts",
    "apps/web/lighthouserc.json",
    "apps/web/.github/workflows/ci.yml"
  ],
  "steps": [
    "Smoke: visit '/', click primary CTAs, assert routes.",
    "Axe: run checks on '/', '/daily-brief', '/archive'.",
    "Lighthouse: set budgets for LCP 2500, TBT 200, CLS 0.1."
  ],
  "acceptance_criteria": ["CI passes locally; flaky ≤ 1%"],
  "constraints": ["No external secrets"],
  "testing": ["Run headless in CI"],
  "progress_report": "apps/web/app/_reports/ci.PROGRESS.md"
}
```

### Agent Runbook (README)
```json
{
  "role": "Claude (Spark)",
  "objective": "Provide a short README for agents explaining how to execute these prompts safely and the design rules.",
  "context": {"file": "AGENT_README.md"},
  "files_to_create": ["AGENT_README.md"],
  "steps": [
    "Summarize guardrails, tech stack, no-backend rule, i18n/RTL, performance budgets.",
    "Explain Progress Report files and how to update them.",
    "Document event names and when to emit stubs."
  ],
  "acceptance_criteria": ["Concise (≤ 2 pages); actionable"],
  "constraints": ["English only; no marketing language"],
  "testing": ["Proofread and lint markdown"],
  "progress_report": "apps/web/app/_reports/readme.PROGRESS.md"
}
```

---

### Notes for agent handoff
- Each prompt is standalone and can be executed in isolation.
- Replace any mock adapters with real services later; keep interfaces stable.
- Use consistent event names: `cta_click`, `tool_opened`.
- Ensure i18n keys live under the page’s `_content/*.json` file.
