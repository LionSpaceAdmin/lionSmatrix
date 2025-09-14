# {{PROJECT_TITLE}}

**Purpose:** {{HIGH_LEVEL_PURPOSE}}

> Global Guardrails (apply to every prompt)
>
> - Tech Stack: {{TECH_STACK}}
> - Design Principles: {{DESIGN_PRINCIPLES}}
> - Content Rules: {{CONTENT_RULES}}
> - Backend Assumptions: {{BACKEND_ASSUMPTIONS}}
> - Primary CTAs: {{PRIMARY_CTAS}}
> - Performance Budgets: {{PERFORMANCE_BUDGETS}}

---

## (public)

### `/{{PUBLIC_ROUTE}}` — {{FEATURE_NAME}}

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{PRIMARY_OBJECTIVE}}",
  "context": { "route": "/{{PUBLIC_ROUTE}}", "components": ["{{COMPONENT_A}}", "{{COMPONENT_B}}"] },
  "files_to_create": ["apps/web/app/(public)/{{PUBLIC_ROUTE}}/page.tsx"],
  "steps": [
    "{{STEP_1}}",
    "{{STEP_2}}",
    "{{STEP_3}}"
  ],
  "acceptance_criteria": [
    "{{CRITERION_1}}",
    "{{CRITERION_2}}"
  ],
  "constraints": ["{{CONSTRAINT_A}}", "{{CONSTRAINT_B}}"],
  "testing": ["{{TEST_CASE_1}}", "{{TEST_CASE_2}}"],
  "progress_report": "apps/web/app/(public)/_reports/{{PUBLIC_ROUTE}}.PROGRESS.md"
}
```

### `/{{PUBLIC_ROUTE_2}}` — {{FEATURE_NAME_2}}

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "route": "/{{PUBLIC_ROUTE_2}}" },
  "files_to_create": ["apps/web/app/(public)/{{PUBLIC_ROUTE_2}}/page.tsx"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/(public)/_reports/{{PUBLIC_ROUTE_2}}.PROGRESS.md"
}
```

---

## (auth)

### `/auth/{{AUTH_ROUTE}}` — {{FEATURE_NAME}}

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "route": "/auth/{{AUTH_ROUTE}}" },
  "files_to_create": ["apps/web/app/(auth)/{{AUTH_ROUTE}}/page.tsx"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/(auth)/_reports/{{AUTH_ROUTE}}.PROGRESS.md"
}
```

---

## (dashboard)

### `/dashboard/{{DASHBOARD_ROUTE}}` — {{FEATURE_NAME}}

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "route": "/dashboard/{{DASHBOARD_ROUTE}}", "components": ["{{WIDGET_1}}", "{{WIDGET_2}}"] },
  "files_to_create": ["apps/web/app/(dashboard)/{{DASHBOARD_ROUTE}}/page.tsx"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/(dashboard)/_reports/{{DASHBOARD_ROUTE}}.PROGRESS.md"
}
```

### `/dashboard/tools/{{TOOL_ROUTE}}` — {{TOOL_NAME}}

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "route": "/dashboard/tools/{{TOOL_ROUTE}}", "components": ["{{COMPONENT}}"] },
  "files_to_create": ["apps/web/app/(dashboard)/tools/{{TOOL_ROUTE}}/page.tsx"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/(dashboard)/_reports/{{TOOL_ROUTE}}.PROGRESS.md"
}
```

---

## (academy)

### `/academy` — {{SECTION_INDEX_NAME}}

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "route": "/academy" },
  "files_to_create": ["apps/web/app/(academy)/page.tsx"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/(academy)/_reports/academy.PROGRESS.md"
}
```

### `/academy/[slug]` — {{DETAIL_PAGE_NAME}}

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "route": "/academy/[slug]" },
  "files_to_create": ["apps/web/app/(academy)/[slug]/page.tsx"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/(academy)/_reports/article.PROGRESS.md"
}
```

---

## (trust)

### `/trust/{{TRUST_ROUTE}}` — {{FEATURE_NAME}}

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "route": "/trust/{{TRUST_ROUTE}}" },
  "files_to_create": ["apps/web/app/(trust)/{{TRUST_ROUTE}}/page.tsx"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/(trust)/_reports/{{TRUST_ROUTE}}.PROGRESS.md"
}
```

---

## (enterprise)

### `/enterprise` — {{ENTERPRISE_LANDING_NAME}}

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "route": "/enterprise" },
  "files_to_create": ["apps/web/app/(enterprise)/page.tsx"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/(enterprise)/_reports/enterprise.PROGRESS.md"
}
```

---

## Shared Layouts & Metadata

### Group `layout.tsx` per segment

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "targets": ["(public)", "(auth)", "(dashboard)", "(academy)", "(trust)", "(enterprise)"] },
  "files_to_create": ["apps/web/app/(public)/layout.tsx", "..."] ,
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/_reports/layouts.PROGRESS.md"
}
```

---

## Root & Platform

### Root layout

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "file": "apps/web/app/layout.tsx" },
  "files_to_create": ["apps/web/app/layout.tsx", "apps/web/app/globals.css"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/_reports/root-layout.PROGRESS.md"
}
```

### Providers

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "file": "apps/web/app/providers.tsx" },
  "files_to_create": ["apps/web/app/providers.tsx"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/_reports/providers.PROGRESS.md"
}
```

### Middleware (i18n / routing)

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "file": "apps/web/middleware.ts" },
  "files_to_create": ["apps/web/middleware.ts"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/_reports/middleware.PROGRESS.md"
}
```

### i18n Helpers

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "dir": "apps/web/lib/i18n" },
  "files_to_create": ["apps/web/lib/i18n/config.ts", "apps/web/lib/i18n/index.ts"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/_reports/i18n.PROGRESS.md"
}
```

### Telemetry Utility

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "file": "apps/web/lib/telemetry.ts" },
  "files_to_create": ["apps/web/lib/telemetry.ts"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/_reports/telemetry.PROGRESS.md"
}
```

### Instrumentation Stub

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "file": "apps/web/instrumentation.ts" },
  "files_to_create": ["apps/web/instrumentation.ts"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/_reports/instrumentation.PROGRESS.md"
}
```

### Styling / Design System Config

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "file": "apps/web/tailwind.config.ts" },
  "files_to_create": ["apps/web/tailwind.config.ts"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST}}"],
  "progress_report": "apps/web/app/_reports/tailwind.PROGRESS.md"
}
```

### Testing & CI

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "dir": "apps/web" },
  "files_to_create": [
    "apps/web/e2e/{{SMOKE_TEST}}.spec.ts",
    "apps/web/e2e/{{ACCESSIBILITY_TEST}}.spec.ts",
    "apps/web/{{PERFORMANCE_BUDGETS_FILE}}.json",
    "apps/web/.github/workflows/ci.yml"
  ],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{TEST_STRATEGY}}"],
  "progress_report": "apps/web/app/_reports/ci.PROGRESS.md"
}
```

### Agent Runbook / README

```json
{
  "role": "{{AGENT_ROLE}}",
  "objective": "{{OBJECTIVE}}",
  "context": { "file": "AGENT_README.md" },
  "files_to_create": ["AGENT_README.md"],
  "steps": ["{{STEP_1}}", "{{STEP_2}}", "{{STEP_3}}"],
  "acceptance_criteria": ["{{CRITERION_1}}", "{{CRITERION_2}}"],
  "constraints": ["{{CONSTRAINT}}"],
  "testing": ["{{REVIEW_STEP}}"],
  "progress_report": "apps/web/app/_reports/readme.PROGRESS.md"
}
```

---

### Notes for Handoff

- Each JSON block is self-contained.
- Replace placeholder tokens (e.g. {{TOKEN_NAME}}) with concrete values.
- Keep interface contracts stable when moving from mock to real services.
- Co-locate i18n keys near page-level `_content/` directories.

---

## Optional Additional Sections

- {{DATA_LAYER_SECTION}}
- {{FEATURE_FLAGS_SECTION}}
- {{ACCESSIBILITY_AUDIT_SECTION}}
- {{SECURITY_REVIEW_SECTION}}

---

## Change Log (Template)

| Date | Change | Owner |
|------|--------|-------|
| {{YYYY_MM_DD}} | {{INITIAL_SCAFFOLD}} | {{OWNER}} |
| {{YYYY_MM_DD}} | {{REFINEMENT}} | {{OWNER}} |
