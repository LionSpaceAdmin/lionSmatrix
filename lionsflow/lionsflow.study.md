# lionsflow.study.md — Study & Learn

## שלב 1 — מיפוי וסיווג ידני (30+ פריטים)

| פריט | קטגוריה | סטטוס | נימוק |
|---|---|---|---|
| src/app/layout.tsx | Main | קריטי | שלד גלובלי ו‑Providers לכל העמודים |
| src/app/page.tsx | Main | קריטי | דף הבית והכניסה הראשית |
| src/app/providers.tsx | Main | תמיכה | ריכוז ספקי הקשר (Theme/Query וכו') |
| src/app/globals.css | Main | תמיכה | סגנונות גלובליים נטענים בכל הדפים |
| middleware.ts | Main | קריטי | עיבוד בקשות מוקדם (ניתוב/אבטחה/Locale) |
| instrumentation.ts | Main | תמיכה | אינסטרומנטציה לזמני ריצה ושקילה |
| src/app/about/page.tsx | Main | משני | עמוד תוכן תדמיתי |
| src/app/faq/page.tsx | Main | משני | עמוד שאלות ותשובות |
| src/app/dashboard/page.tsx | Main | משני | מסך לוח מחוונים ומדדים |
| src/app/daily-brief/page.tsx | Main | קריטי | מסך מציג סיכומי AI |
| src/app/archive/page.tsx | Main | משני | עמוד ארכיון כללי |
| src/app/archive/[narrativeId]/page.tsx | Main | משני | תצוגה דינמית לפריט בארכיון |
| src/app/contact/page.tsx | Main | משני | עמוד יצירת קשר |
| src/components/layout/header.tsx | Main | קריטי | ניווט עליון גלובלי |
| src/components/layout/footer.tsx | Main | תמיכה | כותרת תחתונה וקישורים |
| src/components/layout/locale-switcher.tsx | Main | משני | החלפת שפה בממשק |
| src/components/layout/splash-guard.tsx | Main | משני | מסך/מצב טעינה |
| src/components/shared/hero-section.tsx | Main | משני | רכיב פתיח לדפים |
| src/components/shared/analytics-dashboard.tsx | Main | משני | רכיב גרפים למדדים |
| src/components/ui/button.tsx | Main | קריטי | רכיב בסיסי, בשימוש רחב |
| src/components/ui/input.tsx | Main | משני | רכיב טופס בסיסי |
| src/components/ui/dialog.tsx | Main | משני | תיבות דיאלוג |
| src/components/ui/toast.tsx | Main | תמיכה | התראות משתמש |
| src/hooks/use-i18n.ts | Main | משני | ניהול שפות בממשק |
| src/hooks/use-toast.ts | Main | תמיכה | ממשק לתצוגת Toasts |
| src/hooks/use-mobile.tsx | Main | משני | זיהוי הקשרי מובייל |
| src/lib/telemetry.ts | Main | תמיכה | track(event,payload) לאירועים |
| src/lib/utils.ts | Main | משני | פונקציות עזר לשימוש רחב |
| src/lib/api.ts | Main | משני | קריאות לקוח/איסוף נתונים |
| src/lib/firebase/client.ts | Main | משני | אינטגרציית Firebase בצד לקוח |
| src/lib/i18n/config.ts | Main | תמיכה | הגדרות i18n |
| src/ai/flows/daily-brief-summary.ts | Main | משני | סיכומי AI למסך Daily Brief |
| src/ai/flows/threat-narrative-summary.ts | Main | משני | סיכומי נרטיב/איומים |
| src/ai/genkit.ts | Main | תמיכה | חיבור ותצורת Genkit |
| package.json | Config | תמיכה | חבילות וסקריפטים |
| tsconfig.json | Config | תמיכה | קומפילציית TypeScript |
| next.config.ts | Config | תמיכה | תצורת Next.js |
| tailwind.config.ts | Config | תמיכה | תצורת Tailwind |
| postcss.config.mjs | Config | תמיכה | עיבוד CSS |
| eslint.config.mjs | Config | תמיכה | כללי ESLint |
| lighthouserc.json | Config | תמיכה | תקציבי Lighthouse ב‑CI |
| pnpm-workspace.yaml | Config | תמיכה | וורקספייס מונוה רפו |
| vitest.config.ts | Tests/Storybook | בדיקות | תצורת יחידה jsdom |
| playwright.config.ts | Tests/Storybook | בדיקות | E2E עם שרת dev |
| .storybook/main.ts | Tests/Storybook | בדיקות | תצורת Storybook |
| .storybook/preview.ts | Tests/Storybook | בדיקות | קישוטים וסביבת stories |
| src/stories/Button.stories.ts | Tests/Storybook | בדיקות | דוגמת סיפור לרכיב |
| test/e2e/basic.spec.ts | Tests/Storybook | בדיקות | עשן ניווט עיקרי |
| test/e2e/axe.spec.ts | Tests/Storybook | בדיקות | בדיקות נגישות |
| README.md | Docs/Reports | תיעוד | מדריך ראשי לפרויקט |
| AGENTS.md | Docs/Reports | תיעוד | הנחיות שגרה ותרומה |
| docs/development-setup.md | Docs/Reports | תיעוד | הקמת סביבת פיתוח |
| _reports/landing.PROGRESS.md | Docs/Reports | תיעוד | יומני התקדמות |
| src/ai/dev.ts | Cleanup | מועמד לניקוי | קוד הרצה לפיתוח בלבד |
| .modified | Cleanup | מועמד לניקוי | קובץ מצב/ארכיון פנימי |
| docs/cleanup/plan.md | Cleanup | מועמד לניקוי | מסמך ניקוי ארכיוני |
| docs/cleanup/patches.md | Cleanup | מועמד לניקוי | טלאים ישנים לתיעוד |
| .idea/ | Cleanup | מועמד לניקוי | קונפיג IDE מקומי |
| .idx/ | Cleanup | מועמד לניקוי | קונפיג סביבת dev מקומית |

## שלב 2 — מסלולי זרימה מרכזיים (ASCII)

- בקשה → middleware.ts → src/app/layout.tsx → page.tsx
- layout.tsx → providers.tsx
- layout.tsx → globals.css
- page.tsx → components/shared/hero-section.tsx → lib/telemetry.ts
- dashboard/page.tsx → components/shared/analytics-dashboard.tsx → lib/api.ts
- daily-brief/page.tsx → ai/flows/daily-brief-summary.ts
- archive/page.tsx → ai/flows/threat-narrative-summary.ts
- locale-switcher.tsx → hooks/use-i18n.ts → lib/i18n/config.ts
- ui/toast.tsx → hooks/use-toast.ts
- next.config.ts → src/app/**
- tsconfig.json → src/**
- tailwind.config.ts → src/app/globals.css
- vitest.config.ts → src/lib/utils.ts
- playwright.config.ts → src/app/page.tsx
- .storybook/main.ts → src/stories/Button.stories.ts → src/components/ui/button.tsx

## שלב 3 — קריטריוני החלטה

- Main Pipeline: קבצי App Router, middleware/instrumentation, רכיבי layout/shared/ui בשימוש בדפים, זרימות AI מחוברות למסכים.
- Config/Infra: קבצי תצורה לבנייה, סגנון, כלי פיתוח ו‑CI.
- Tests/Storybook: תצורות וכל קבצי .spec / stories.
- Docs/Reports: docs/**, _reports/**, ו‑*.md.
- Cleanup: לא בשימוש בזרימה, פיתוח בלבד, או ארכיוני/IDE.

החלה לדוגמה: daily-brief/page.tsx הוגדר Main כי הוא דף פעיל; ai/dev.ts הוגדר Cleanup כי מטרתו הרצה לפיתוח.

## שלב 4 — סיכום למידה

- עובד/מחובר: App Router מלא, רכיבי layout/shared/ui, שכבת utils/api, וזרימות AI לדפים רלוונטיים.
- תמיכת תשתית: קונפיג Next/TS/Tailwind/PostCSS/ESLint ו‑Lighthouse ב‑CI.
- בדיקות: Vitest יחידה, Playwright E2E, Storybook לרכיבים.
- מועדים לניקוי: קבצי dev מקומיים, קבצי cleanup ארכיוניים, קונפיג IDE.

קיבוץ לצמצום צפיפות: src/components/layout (4), src/components/ui (4), src/components/shared (2), src/hooks (3), src/ai (4). הקיבוץ תואם למה שמופיע ב‑HTML ונתמך בפתיחה/סגירה בלחיצה.

## נספח — מועמדים לניקוי והנמקה

- src/ai/dev.ts — הרצה לפיתוח בלבד; לא דרוש בפריסה.
- .modified — קובץ מצב זמני; אין תלות.
- docs/cleanup/plan.md — מסמך היסטורי; מעיד על תהליך עבר.
- docs/cleanup/patches.md — טלאים ארכיוניים; לא בשימוש בבנייה.
- .idea/ — קונפיג IDE מקומי; אינו נדרש לריפו.
- .idx/ — קונפיג סביבת dev; אינו חלק מהפייפליין.
