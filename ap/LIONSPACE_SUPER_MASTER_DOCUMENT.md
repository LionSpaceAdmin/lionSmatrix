# LIONSPACE — SUPER MASTER DOCUMENT
**מקור־אמת אחוד (תוכן + UX + OSINT + ארכיטקטורה)**  
עודכן: 2025-09-06 19:57:46


> **הערת סוכן**: מסמך זה מאחד את *כל* מסמכי המקור כפי שסופקו; ללא קיצורים.  
> המבנה כולל 11 פרקים אינטגרטיביים + נספחי מקור מלאים.

---

## תוכן (TOC)

1. [תקציר מנהלים + חזון](#1-תקציר-מנהלים--חזון)
2. [דוקטרינת תודעה + פסיכולוגיית UX](#2-דוקטרינת-תודעה--פסיכולוגיית-ux)
3. [אסטרטגיית רתימה (Prebunk/Debunk/Counter)](#3-אסטרטגיית-רתימה-prebunkdebunkcounter)
4. [מדיניות עריכה ואימות](#4-מדיניות-עריכה-ואימות)
5. [מודולים אופרטיביים (Casebook/Tracker/Literacy)](#5-מודולים-אופרטיביים-casebooktrackerliteracy)
6. [ארכיטקטורת מידע וניווט](#6-ארכיטקטורת-מידע- וניווט)
7. [Design System וטוקנים](#7-design-system-וטוקנים)
8. [ארכיטקטורה טכנית + אבטחה](#8-ארכיטקטורה-טכנית--אבטחה)
9. [OSINT: צ׳ק־ליסט ופרומפטים](#9-osint-צ׳ק־ליסט-ופרומפטים)
10. [KPIs ומפת דרכים](#10-kpis-ומפת-דרכים)
11. [תפעול, תפקידים ו־Deployment](#11-תפעול-תפקידים-ו־deployment)

**נספחים**
- [נספח A — תכנית אתר (Markdown מלא)](#נספח-a--תכנית-אתר-markdown-מלא)
- [נספח B — OSINT (Markdown מלא)](#נספח-b--osint-markdown-מלא)
- [נספח C — Complete Documentation](#נספח-c--complete-documentation)
- [נספח D — Unified Master Plan](#נספח-d--unified-master-plan)
- [נספח E — Mega Master Plan](#נספח-e--mega-master-plan)

---

## 1. תקציר מנהלים + חזון

*חיבור המיטב מתוך תכנית האתר והמסמכים המאוחדים.*  
המסר המרכזי: מרכז ידע וכלים מחזק חוסן תודעתי — בהיר, אמין ומודולרי; דו־לשוניות מלאה; UX מתחשב‑טראומה; אמינות ושקיפות אימות כמסד.  
**KPIs ראשיים**: זמן למציאת מידע < 5 שנ׳; ≥90% השלמת זרימות; WCAG AA; CWV ירוקים.

> 💡 טיפ שימושי: בגרסת ה־HTML קיימת ניווט צד ושדה חיפוש לקפיצה מהירה בין פרקים.


## 2. דוקטרינת תודעה + פסיכולוגיית UX

- הפחתת עומס (Progressive Disclosure), היררכיה חזותית, סמנטיקת צבע, משוב רציף.  
- Voice & Tone ענייני ובהיר; דגש על עוגני אמון: “איך אימתנו”, מקורות, תאריכי עדכון.  
- אתיקה: הימנעות מתוכן גרפי, כיבוד פרטיות, ושקיפות מגבלות.


## 3. אסטרטגיית רתימה (Prebunk/Debunk/Counter)

- **Prebunk**: חיסון מראש לזיהוי עריכה מטעה/הקשר חסר/Deepfake.  
- **Debunk**: טענה → מה נכון → הוכחות/מקורות → לקח (שפה מתקנת).  
- **Counter‑Narratives**: מסגור ערכי (חיי אדם, מוסריות אוניברסלית, עובדות מאומתות) עם Arc רגשי מנוהל.

## 4. מדיניות עריכה ואימות

סיווג טענות (מאומת/זקוק אימות/לא נתמך/שגוי), חוקי ציטוט (מקור ראשוני/משני, ארכיון), תיעוד שינויים ושקיפות תהליך אימות וערעור.

## 5. מודולים אופרטיביים (Casebook/Tracker/Literacy)

- **Casebook**: צירי זמן, חותמות זמן, דירוג מהימנות שקוף.  
- **Live Disinfo Tracker**: לוח טענות פעילות, סטטוסים ומפות נרטיב.  
- **Literacy Kit**: מיני‑קורסים, כרטיסיות עשה/אל‑תעשה, מילון מונחים ואינדקס הטיות.

## 6. ארכיטקטורת מידע וניווט

מפת אתר מלאה: בית, חזון/תפיסה, ספריה/מונחים, מאמרים/עדכונים, חיפוש, עמוד ישות, אודות/צוות, קשר, דפי מצב/שגיאה.  
Header קבוע, Breadcrumbs, Drawer במובייל, פוטר עשיר.

## 7. Design System וטוקנים

טוקני צבע (OKLCH), טיפוגרפיה (Inter/JetBrains Mono), ריווחים, רדיוסים, צללים; רכיבים (Button/Card/Tabs/Menu/Modal/Tooltip/Badge/Toast/Table/Forms/Charts/Timeline).  
כולל קטעי CSS לדוגמה והנחיות A11y/Performance/SEO.

## 8. ארכיטקטורה טכנית + אבטחה

- **Frontend**: Next.js/React/TypeScript, Tailwind, Framer Motion.  
- **Backend**: API Routes, PostgreSQL+Prisma, NextAuth (Google OAuth), WebSocket/SSE.  
- **AI**: Gemini API; מנוע ניתוח נרטיבים/איומים.  
- **Infra**: Vercel + GCP, CDN, CI/CD, ניטור ו‑Logging, אבטחה (Headers/Rate‑limit/OWASP).  
> ⚠️ אזהרת מערכת: במסמכי המקור קיימים מפתחות/API‑Keys לדוגמה — חובה *להחליף ולסובב* מפתחות בטרם שימוש/פרסום.

## 9. OSINT: צ׳ק־ליסט ופרומפטים

רשימת יעדים (A–M), דפוס פרומפט תחקיר אחיד, והתאמות ספציפיות ליעדים.  
המסמך כולל רשימת 50 יעדים לדוגמה ותבנית פלט מחייבת (תקציר מנהלים, עובדות מפתח, ציר זמן, שחקנים, Debunk, Counter‑Narrative, מקורות, נספח אימות).

## 10. KPIs ומפת דרכים

מדדי שימושיות/ביצועים/נגישות/מעורבות; שלבי ביצוע מהמסד העיצובי דרך דפי הליבה ועד אינטראקציות מתקדמות ו‑SEO; יעדי Lighthouse ובאנדל.

## 11. תפעול, תפקידים ו־Deployment

חלוקת עבודה בין סוכנים (Frontend, Backend, Intelligence, DevOps), צ׳קליסט טרום השקה, בדיקות (Unit/Integration/E2E/Load/Security/A11y), הקשחה, מעקב, ו‑Runbook לעלייה לאוויר.

---

## נספח A — תכנית אתר (Markdown מלא)
<details><summary>הצג/הסתר</summary>

<!-- Failed to read /mnt/data/SITE_MASTER_PLAN.md: [Errno 2] No such file or directory: '/mnt/data/SITE_MASTER_PLAN.md' -->

</details>

## נספח B — OSINT (Markdown מלא)
<details><summary>הצג/הסתר</summary>

<!-- Failed to read /mnt/data/OSINT_PLAN.md: [Errno 2] No such file or directory: '/mnt/data/OSINT_PLAN.md' -->

</details>

## נספח C — Complete Documentation
<details><summary>הצג/הסתר</summary>

<!-- Failed to read /mnt/data/LIONSPACE_COMPLETE_DOCUMENTATION.md: [Errno 2] No such file or directory: '/mnt/data/LIONSPACE_COMPLETE_DOCUMENTATION.md' -->

</details>

## נספח D — Unified Master Plan
<details><summary>הצג/הסתר</summary>

<!-- Failed to read /mnt/data/LIONSPACE_UNIFIED_MASTER_PLAN.md: [Errno 2] No such file or directory: '/mnt/data/LIONSPACE_UNIFIED_MASTER_PLAN.md' -->

</details>

## נספח E — Mega Master Plan
<details><summary>הצג/הסתר</summary>

<!-- Failed to read /mnt/data/LIONSPACE_MEGA_MASTER_PLAN.md: [Errno 2] No such file or directory: '/mnt/data/LIONSPACE_MEGA_MASTER_PLAN.md' -->

</details>
