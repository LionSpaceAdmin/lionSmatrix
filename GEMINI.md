# Gemini Integration Guide

Purpose
- Explain how Gemini is wired in this repo and how to work with it safely.

Where things live
- `src/ai/flows/*` — flows that summarize/analyze (e.g., `daily-brief-summary.ts`, `threat-narrative-summary.ts`).
- `src/ai/genkit.ts` — Genkit setup and registration.
- `src/lib/api.ts` — client helpers; keep keys out of production clients where possible.

Environment
- Copy `.env.example` to `.env.local` and set:
  - `NEXT_PUBLIC_GEMINI_API_KEY=YOUR_API_KEY`
- Note: when used in the browser this key is public. For production, prefer server routes or a proxy to keep secrets server-side.

Usage guidelines
- Keep flows small and typed; keep prompts and model params explicit.
- Avoid heavy client work; push long‑running calls server-side when applicable.
- No PII in logs. Dev telemetry logs to console only (`src/lib/telemetry.ts`).

Testing
- Unit test helpers and prompt formatting with Vitest.
- E2E: cover user paths that trigger flows (e.g., Daily Brief page).

Hardening next steps
- Add shared backoff/retry helper and use across flows.
- Introduce server wrappers if we need to hide keys in production.
- Document contracts for each flow (inputs/outputs) in a new `docs/ai/flows.md` (follow-up task).
