# Design Tokens — Current State and Plan

This document aligns tokens with the code as it exists now, and defines concrete steps to complete the tokenization.

## Current State

- Tailwind is configured (`tailwind.config.ts`) with dark mode class and a terminal/cyber theme.
- Extended colors include terminal-friendly aliases (terminal-green, terminal-cyan, etc.).
- CSS custom properties for terminal colors are referenced (e.g., `hsl(var(--terminal-cyan))`), but a complete `:root` token set is not yet formalized in `src/app/globals.css`.

## Token Model

1) Primitive tokens (CSS variables in `:root`)
- `--terminal-bg`, `--terminal-text`, `--terminal-cyan`, `--terminal-gold`, `--terminal-red`, `--terminal-muted`, `--terminal-border`

2) Semantic tokens (CSS variables layered on primitives)
- `--surface-base`, `--surface-alt`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-warn`, `--accent-error`, `--focus-ring`

3) Tailwind mapping (tailwind.config.ts)
- Map semantic tokens to `extend.colors` using `hsl(var(--token) / <alpha-value>)` so utilities remain ergonomic.

## Usage Guidelines

- Prefer semantic utilities (e.g., bg-[color:var(--surface-base)], text-[color:var(--text-muted)]) via Tailwind mapping over hard-coded hex.
- Do not hard-code colors in components; rely on tokens and Tailwind utilities.
- Introduce a new semantic token before adding a new color context (e.g., success/info).

## Action Checklist

- [ ] Define full `:root` primitive + semantic tokens in `src/app/globals.css`.
- [ ] Align `tailwind.config.ts` `extend.colors` to consume those variables consistently.
- [ ] Replace inline hex usages with token-backed utilities.
- [ ] Add success/info semantic tokens and map them in Tailwind.
- [ ] Storybook Foundations/Colors page showing tokens and contrast checks.
- [ ] Optional lint rule to forbid raw hex in components.

## Accessibility

Maintain AA contrast (≥ 4.5:1 for body text). Validate token palettes with axe and Lighthouse after refactors.

---

Questions and proposals: open a discussion or add to `DESIGN_SYSTEM_TASKS.md`.
