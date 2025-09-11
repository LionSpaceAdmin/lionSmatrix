# Design Tokens (Foundations)

This document outlines the emerging token system refactor (Phase 1).

## Goals

- Single source of truth for core colors and surfaces
- Improved accessibility contrast (AA baseline)
- Semantic naming layer to decouple components from raw color primitives
- Easier theming / future light or high-contrast variants

## Layers

### 1. Primitive Tokens (CSS Variables)

Declared in `app/globals.css` under `:root`:

- `--terminal-bg`
- `--terminal-secondary`
- `--terminal-cyan`
- `--terminal-gold`
- `--terminal-red`
- `--terminal-text`
- `--terminal-muted`
- `--terminal-border`

### 2. Semantic Tokens (Phase 1 Set)

Also defined in `:root`:

- `--color-surface-base`
- `--color-surface-alt`
- `--color-border-default`
- `--color-text-primary`
- `--color-text-muted`
- `--color-accent-primary`
- `--color-accent-warn`
- `--color-accent-error`
- `--color-focus-ring`

### 3. TypeScript Mapping

`lib/design-tokens.ts` exports `PrimitiveTokens`, `SemanticTokens`, and helper `tokenVar()`.

## Usage Guidelines

- Prefer semantic tokens in components (`accentPrimary`, `textMuted`) over primitives.
- Do not hard-code hex/rgb values in JSX; use Tailwind utilities or tokens.
- When a new contextual meaning emerges (e.g. success, info), add semantic token first.

## Tailwind Integration (Next Step)

Future step: rewrite Tailwind `extend.colors` to reference `rgb(var(--terminal-cyan) / <alpha-value>)` patterns.

## Migration Checklist

- [ ] Replace inline `#B8FFF2`, `#00ff88` usages with tokens.
- [ ] Unify `.terminal-card` + `Card` component.
- [ ] Add success/info semantic tokens.
- [ ] Storybook: Foundations/Colors story.
- [ ] Add lint rule preventing raw hex (except in token definition files).

## Accessibility

Updated palette aligns with stronger contrast (brighter foreground, adjusted accent hues). Run automated checks (axe / lighthouse) after full migration.

## Next Phases

Phase 2: Motion tokens (durations, easings), spacing scale, elevation (shadows), radius scale.
Phase 3: Theming mechanism via `data-theme` attribute.

---

Questions / proposals: open a discussion or add to `DESIGN_SYSTEM_TASKS.md`.
