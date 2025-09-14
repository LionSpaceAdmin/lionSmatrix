# Lions of Zion — Build Stabilization & Dependency Alignment (Spark‑Env)

מטרה: לייצב את הבילד והפיתוח של @lionspace/web על Next 15.5.3 ופורט 6000, ליישר גרסאות ליבה בכל המונורפו, ולהסיר קונפליקטים שיוצרים כשלים/אזהרות.

הנחיות גלובליות
- לא מוסיפים פיצ’רים; רק ייצוב והרמוניזציית תלויות.
- שומרים RSC/CSR כפי שקיים; אין שינויים ב־UX.
- ללא שיחות Backend; הכל מקומי/סטאבים.
- A11y/Perf לא צריכים להיפגע (LCP ≤ 2.5s, CLS < 0.1).

```json
{
  "role": "Spark-Env (LoZ) — Platform Maintainer",
  "objective": "Align core versions (Next 15.5.3, React 18.2), unify Tailwind setup, quell peer conflicts, and restore green build on port 6000.",
  "context": {
    "workspace": "repo root + apps/web",
    "runtime": { "node": ">=20", "pnpm": ">=8" },
    "core": { "next": "15.5.3", "react": "18.2.0", "react-dom": "18.2.0" }
  },
  "files_to_update": [
    "package.json (root): next/eslint-config-next/@next/eslint-plugin-next",
    "apps/web/package.json: next, scripts dev/start on :6000, react 18.2",
    "apps/web/next.config.mjs: images.remotePatterns port; (optional) lint/types flags רק אם נדרש לזמן קצוב",
    "apps/web/tailwind.config.js + postcss.config.js (אם יש)",
    "apps/web/tests/* (עדכון פורט ל-6000 במידת הצורך)"
  ],
  "steps": [
    "Audit: הרץ `pnpm -w outdated` ורשום חבילות מפתח ליישור (Next/React/Tailwind/ESLint/Turbo).",
    "Core align: ודא next=15.5.3, react/react-dom=18.2 בכל workspace; @types/react* ל-18.x.",
    "Tailwind unify: עבור לגרסה 3.4.x אחידה (מהיר ויציב מול הקונפיג הנוכחי); הסר תלות v4 (@tailwindcss/postcss 4.x) אם קיימת; ודא postcss/tailwind/preset עובדים.",
    "Peer fixes: ספריות עם peer ל-React 19 (reagraph/@react-three/*) — נטרל/החלף או dynamic import מאחורי דגל כך שלא יפריעו לבילד React 18.",
    "Sentry/OTel: השבת כברירת־מחדל (ENV) כדי למנוע אזהרות require-in-the-middle בזמן bring-up.",
    "Dev port: ודא שכל הסקריפטים/בדיקות משתמשים ב-:6000 (Next dev/start, Playwright).",
    "TypeScript: תקן שגיאות ידועות (דוגמאות: use-canvas-animation shouldAnimate guard; schema-examples articles searchVector; use-accessibility return; use-i18n availableLanguages; use-monitoring navigation timing).",
    "בדוק: `pnpm --filter @lionspace/web build` ואז `pnpm --filter @lionspace/web dev` וטען '/' מקומית."
  ],
  "acceptance_criteria": [
    "`pnpm build` ירוק לכל החבילות; @lionspace/web נבנה בהצלחה.",
    "`pnpm --filter @lionspace/web dev` רץ על http://localhost:6000 והדף הראשי נטען.",
    "אין שגיאות TypeScript; אין peerWarnings קריטיים; אזהרות OTel/Sentry כבויות.",
    "Playwright smoke עובר מול :6000."
  ],
  "constraints": [
    "ללא שינויי UI מורגשים וללא שינויים בזרימות משתמש.",
    "ללא תלות ב־backend בזמן המשימה."
  ],
  "testing": [
    "`pnpm -w outdated` (בקרה)",
    "`pnpm --filter @lionspace/web type-check`",
    "`pnpm --filter @lionspace/web build`",
    "`pnpm --filter @lionspace/web dev` + בדיקת '/'",
    "`pnpm --filter @lionspace/web e2e:headless` (smoke)"
  ],
  "progress_report": "apps/web/app/_reports/build-stabilization.PROGRESS.md"
}
```

