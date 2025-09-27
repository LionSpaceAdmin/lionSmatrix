# LionSpace Design System — Implementation Tasks (Cleaned)

Purpose
- Align the design system with the current codebase, complete tokenization, and ensure consistent, accessible UI across screens.

Current State (verified)
- Tailwind configured (dark class, animations, extended terminal colors).
- Global styles at `src/app/globals.css`.
- Components: `src/components/ui` (primitives), `src/components/shared` (composites), `src/components/layout` (wrappers).
- Storybook configured.

High‑impact tasks
- Tokens: define full `:root` primitive + semantic tokens in `globals.css`; map via Tailwind `extend.colors` (HSL var pattern); replace inline hex usages.
- A11y/theming: add reduced‑motion helpers; visible focus rings; validate AA contrast on key screens.
- Storybook: add Foundations/Colors and Foundations/Typography; document tokens and usage.
- UI primitives: verify button/input/card/badge/dialog/select/tabs/toast cover hover/active/focus/disabled + RTL + ≤320px.

Directory and naming
- Primitives in `src/components/ui`; composites in `src/components/shared`; wrappers in `src/components/layout`.
- Filenames kebab‑case; component exports PascalCase.

Readiness checklist
- [ ] globals.css: tokens defined; motion + focus utilities present
- [ ] tailwind.config.ts: semantic mapping to CSS variables
- [ ] primitives audited for a11y (labels/roles/focus)
- [ ] Foundations stories added and green
- [ ] No raw hex in components (except token definitions)

References
- DESIGN_TOKENS.md — token model and usage.
- AGENTS.md — repository rules, testing, and process.

