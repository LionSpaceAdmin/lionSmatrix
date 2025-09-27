# Lions of Zion — Single Connected Repo Alignment Mission

> **Purpose:** Align the repository with the unified Master Plan by implementing all missing routes/pages, migrating prototype “terminal tabs” into proper routes, adding platform foundations (i18n/RTL, accessibility, telemetry), and establishing testing + CI, with traceable progress reports for every unit.

## Agent Prompt (copy-paste to Jules)

**Role:** You are *Jules*, a conversational code-writing agent. Work in a **Prompt → Plan → Approval → Execute** loop.
**Objective:** Complete repo alignment in one continuous mission. Scaffold missing routes, refactor ad-hoc tabs to real pages, implement foundations, enforce a11y/performance, add tests/CI, and write `_PROGRESS.md` for each unit.

**Constraints**

* Prefer **RSC**; use client components only when needed (React Query in client only).
* **No backend** mutations or external analytics (mock adapters only).
* Meet budgets: **LCP ≤ 2.5s**, **CLS < 0.1**, **TBT ≤ 200ms**, **a11y ≥ 95**.
* Full **i18n**: EN default; HE/AR RTL mirroring (also ES/FR/DE).

**Deliverables**

* Source for all routes/tools/foundations.
* `_reports/*_PROGRESS.md` per page/tool and foundation group.
* Green CI (Playwright + axe + Lighthouse) with budgets enforced.

---

## Single Connected Mission Checklist (with files, steps, acceptance)

### 0) Foundations (Platform)

* [x] `app/layout.tsx`

  * [x] Add `metadata` + canonical + OG/Twitter
  * [x] `<html lang dir>` from locale; skip link; shell (header/footer)
  * [x] Render `<Providers>` inside `<body>`
  * [ ] **Acceptance:** no hydration warnings; axe ≥ 95
* [ ] `app/globals.css`

  * [ ] Base + dark theme; focus rings; reduced-motion helpers; RTL-safe utilities
  * [ ] **Acceptance:** Lighthouse styles not render-blocking > 2KB critical
* [x] `app/providers.tsx` (client)

  * [x] ThemeProvider (persist theme), QueryClient singleton, Toaster/Tooltip
  * [x] `dir` propagation for RTL, `suppressHydrationWarning` as needed
  * [ ] **Acceptance:** no duplicate providers in Strict Mode
* [x] `middleware.ts`

  * [x] Detect locale (cookie or `Accept-Language`), set prefix, bypass static assets
  * [ ] Set cookie on client language switch
  * [ ] **Acceptance:** no loops; `/he/...` works; `/` rewrites to `/en` if needed
* [x] `lib/i18n/config.ts` + `lib/i18n/index.ts`

  * [x] Export `locales`, `defaultLocale`, `rtlLocales`; `isRTL()`
  * [x] `t(key, locale)` stub pulling from page `_content/*.json`, safe fallback
  * [ ] **Acceptance:** missing keys don’t crash; logs dev warning only
* [x] `lib/telemetry.ts`

  * [x] Typed `track(event, payload)`: `cta_click`, `tool_opened`; no-op prod; console dev
  * [x] **Acceptance:** TS errors on invalid event/payload
* [x] `instrumentation.ts`

  * [x] `export async function register()` logging trace markers (dev only)
  * [x] **Acceptance:** Edge-safe; no runtime errors
* [x] `tailwind.config.ts`

  * [x] Content globs; dark `class`; shadcn preset; typography plugin; tokens (radii/spacing)
  * [x] **Acceptance:** build passes; custom classes available
* [ ] `_reports/root-layout.PROGRESS.md` (+ foundations group reports)

  * [ ] Status, decisions, TODO next

---

### 1) Public Routes

* [x] `/` Landing
  **Files:** `app/(public)/page.tsx`, `app/(public)/head.tsx`, `app/(public)/_content/landing.copy.json`, `_reports/landing.PROGRESS.md`
  **Steps:** Hero with network/graph motif (lightweight), primary CTAs (“Join the fight — Free”, “Explore the War Machine”), 3–6 NarrativeCards, ActionGrid, i18n toggle RTL, SEO (JSON-LD).
  **Acceptance:** LCP ≤ 2.5s mid-mobile; CLS < 0.1; a11y ≥ 95; CTAs route `/auth/join` and `/dashboard/war-machine`.

* [x] `/opening` Splash
  **Files:** `app/(public)/opening/page.tsx`, `_reports/opening.PROGRESS.md`
  **Steps:** PledgeBox + “Agree & Continue” (cookie skip); AlertBanner optional.
  **Acceptance:** cookie skip works; keyboard/focus OK.

* [x] `/daily-brief`
  **Files:** `app/(public)/daily-brief/page.tsx`, `_reports/daily-brief.PROGRESS.md`
  **Steps:** Date header, 5–10 NarrativeCards (mock), UseNowSnippet, loading skeletons, empty state.
  **Acceptance:** share copy localized; skeletons shown before content.

* [x] `/archive`
  **Files:** `app/(public)/archive/page.tsx`, `_reports/archive.PROGRESS.md`
  **Steps:** Faceted filters (topic/region/date/threat), URL state in `searchParams`, paginated grid.
  **Acceptance:** back/forward preserves filters; keyboard-navigable.

* [x] `/archive/[narrativeId]`
  **Files:** `app/(public)/archive/[narrativeId]/page.tsx`, `_reports/narrative-detail.PROGRESS.md`
  **Steps:** Claim, Verdict, Confidence, EvidenceList, Timeline, SharePack; deep-link to evidence hash.
  **Acceptance:** `notFound()` for missing; `generateMetadata()` with title; copy/share works.

* [x] `/playbooks`
  **Files:** `app/(public)/playbooks/page.tsx`, `_reports/playbooks.PROGRESS.md`
  **Steps:** Grid, filter by tags, preview modal with focus trap, “Use this” → `/dashboard/campaigns`.
  **Acceptance:** modal a11y OK; route works.

* [x] `/impact`
  **Files:** `app/(public)/impact/page.tsx`, `_reports/impact.PROGRESS.md`
  **Steps:** KPI cards (mock), methodology accordion, lazy chart + table fallback.
  **Acceptance:** reduced-motion disables animations; table conveys same info.

* [x] `/about`
  **Files:** `app/(public)/about/page.tsx`, `_reports/about.PROGRESS.md`
  **Steps:** Mission, funding transparency, data handling, provenance policy.
  **Acceptance:** readable at 320px; links to trust pages OK.

* [x] `/faq`
  **Files:** `app/(public)/faq/page.tsx`, `_reports/faq.PROGRESS.md`
  **Steps:** Searchable accordion, deep-link hash to question; focus on open.
  **Acceptance:** hash focus visible; keyboard support.

* [x] `/contact`
  **Files:** `app/(public)/contact/page.tsx`, `_reports/contact.PROGRESS.md`
  **Steps:** Channels list + mock intake form (validation, success/fail).
  **Acceptance:** labels + errors accessible; no network calls (mock only).

* [x] `/search`
  **Files:** `app/(public)/search/page.tsx`, `_reports/search.PROGRESS.md`
  **Steps:** Debounced input; group results by type (mock index, client-only).
  **Acceptance:** Esc closes results; arrows navigate items.

* [x] `/legal/terms` + `/legal/privacy`
  **Files:** pages + `_reports/legal.PROGRESS.md`
  **Steps:** MDX render; sticky TOC; anchors; updated date/version.
  **Acceptance:** anchors stable; TOC active section highlights.

* [x] `app/not-found.tsx`
  **Files:** `app/not-found.tsx`, `_reports/not-found.PROGRESS.md`
  **Steps:** Friendly 404 with links to `/`, `/search`, `/daily-brief`; i18n ready.
  **Acceptance:** aria-live announces; focus to 404 heading.

---

### 2) Auth (Mock Only)

* [x] `/auth/sign-in`
  **Files:** `app/(auth)/sign-in/page.tsx`, `_reports/sign-in.PROGRESS.md`
  **Steps:** Provider buttons (X/Google) disabled state, email magic link form (mock), data-use blurb.
  **Acceptance:** validation + disabled states; no real auth.

* [x] `/auth/join`
  **Files:** `app/(auth)/join/page.tsx`, `_reports/join.PROGRESS.md`
  **Steps:** Value props + testimonials (mock); CTA → `/auth/onboarding`.
  **Acceptance:** route OK; a11y images/alt.

* [x] `/auth/onboarding`
  **Files:** `app/(auth)/onboarding/page.tsx`, `_reports/onboarding.PROGRESS.md`
  **Steps:** 3-step wizard (interests/locale/notifications), progress indicator, local state.
  **Acceptance:** keyboard flow; back retains state; route to `/dashboard`.

---

### 3) Dashboard & Tools

* [x] `/dashboard`
  **Files:** `app/(dashboard)/page.tsx`, `_reports/dashboard.PROGRESS.md`
  **Steps:** ThreatStrip, My Missions, Quick Actions; loading skeletons.
  **Acceptance:** responsive to 320px; links work.

* [x] `/dashboard/war-machine`
  **Files:** `app/(dashboard)/war-machine/page.tsx`, `_reports/war-machine.PROGRESS.md`
  **Steps:** Tiles for tools (desc + Open CTA + permission badge).
  **Acceptance:** keyboard-operable; all tiles route correctly.

* [x] `/dashboard/tools/image-influence-lab`
  **Files:** `.../tools/image-influence-lab/page.tsx`, `_reports/image-lab.PROGRESS.md`
  **Steps:** Client-only upload zone; variant grid; share pack export (mock); safety guidelines panel.
  **Acceptance:** accessible drag/drop; previews lazy; no server processing.

* [x] `/dashboard/tools/fact-check`
  **Files:** `.../tools/fact-check/page.tsx`, `_reports/fact-check.PROGRESS.md`
  **Steps:** Claim input; suggested sources (mock); EvidenceList builder; verdict preview; print stylesheet.
  **Acceptance:** sort evidence; PDF print friendly; no scraping.

* [x] `/dashboard/tools/report-research`
  **Files:** `.../tools/report-research/page.tsx`, `_reports/report-research.PROGRESS.md`
  **Steps:** Multi-field form + file drop; consent checkbox; mock ticket ID.
  **Acceptance:** client-side validation; no external upload.

* [x] `/dashboard/tools/fake-resistance-tracker`
  **Files:** `.../tools/fake-resistance-tracker/page.tsx`, `_reports/fake-resistance.PROGRESS.md`
  **Steps:** Sortable table; status chips; detail drawer (keyboard).
  **Acceptance:** drawer focus-trap; virtualization if >100 rows (optional).

* [x] `/dashboard/tools/deep-research-daily`
  **Files:** `.../tools/deep-research-daily/page.tsx`, `_reports/deep-research.PROGRESS.md`
  **Steps:** Saved queries (mock), notes editor (client), export Markdown (local download).
  **Acceptance:** localStorage persistence; MD export correct.

* [x] `/dashboard/campaigns`
  **Files:** `app/(dashboard)/campaigns/page.tsx`, `_reports/campaigns.PROGRESS.md`
  **Steps:** List blueprints (mock); “New Campaign” wizard modal; YAML preview + copy.
  **Acceptance:** required fields per step; YAML validated.

* [x] **Refactor temporary AI Terminal tabs**
  **Steps:** Identify tab implementations; extract logic/UI into the official routes; leave thin legacy stubs linking to the new pages.
  **Acceptance:** All tool functionality reachable via routed pages; hub tiles open the right targets.

---

### 4) Academy

* [x] `/academy`
  **Files:** `app/(academy)/page.tsx`, `_reports/academy.PROGRESS.md`
  **Steps:** Category cards; search bar; featured items; MDX support.
  **Acceptance:** search filters by tag; anchors in MDX work.

* [x] `/academy/[slug]`
  **Files:** `app/(academy)/[slug]/page.tsx`, `_reports/article.PROGRESS.md`
  **Steps:** Render article (mock MDX); sticky TOC; next/prev links.
  **Acceptance:** TOC reflects headings; keyboard navigation.

---

### 5) Trust

* [x] `/trust/transparency`
  **Files:** `app/(trust)/transparency/page.tsx`, `_reports/transparency.PROGRESS.md`
  **Steps:** Cards to provenance, data export (mock), deletion (mock); plain-language summaries.
  **Acceptance:** all links present; copy readable.

* [x] `/trust/provenance`
  **Files:** `app/(trust)/provenance/page.tsx`, `_reports/provenance.PROGRESS.md`
  **Steps:** C2PA explainer; ProvenanceBadge states with aria labels.
  **Acceptance:** samples keyboard-navigable.

* [x] `/trust/dsr`
  **Files:** `app/(trust)/dsr/page.tsx`, `_reports/dsr.PROGRESS.md`
  **Steps:** Export/Delete request form (mock), identity notice, fake ticket ID.
  **Acceptance:** success/failure states clear; no PII stored.

---

### 6) Enterprise

* [x] `/enterprise`
  **Files:** `app/(enterprise)/page.tsx`, `_reports/enterprise.PROGRESS.md`
  **Steps:** Org hero; features table; CTA → `/contact`.
  **Acceptance:** responsive table; route works.

---

### 7) Testing & CI

* [x] Playwright smoke `apps/web/e2e/basic.spec.ts`

  * [ ] Navigate `/` → click CTAs → `/auth/join`, `/dashboard/war-machine`
  * [ ] Assert route loads and key elements visible
* [x] Accessibility `apps/web/e2e/axe.spec.ts`

  * [ ] Run axe on `/`, `/daily-brief`, `/archive`
  * [ ] Fail CI on serious issues
* [x] Lighthouse budgets `apps/web/lighthouserc.json`

  * [ ] LCP ≤ 2500ms, TBT ≤ 200ms, CLS ≤ 0.1
* [x] GitHub Actions `.github/workflows/ci.yml`

  * [x] Install/build
  * [x] Run Playwright + axe + Lighthouse CI
  * [ ] Upload artifacts (reports) on failure
* [ ] `AGENT_README.md` + `_reports/readme.PROGRESS.md`

  * [ ] Guardrails, event names, progress discipline

---

## Definition of Done

* All planned **routes/pages exist and compile**; hub + tools reachable via official routes.
* Every unit has an up-to-date **`*_PROGRESS.md`** with status/decisions.
* **Accessibility ≥ 95**, and performance budgets (**LCP/CLS/TBT**) are green in CI.
* **RTL** works for HE/AR; locale switch persists.
* CI (Playwright + axe + Lighthouse) **fully green**.
