# Lions of Zion - Browser Monitoring System

🛡️ מערכת מעקב מתקדמת עבור דפדפן Chromium ו-Playwright

## מבנה התיקיות

```
logs/
├── console/          # לוגי קונסול של הדפדפן
├── network/          # לוגי תעבורת רשת
├── performance/      # מדדי ביצועים
├── crashes/          # דוחות קריסות
├── screenshots/      # צילומי מסך אוטומטיים
├── traces/           # עקבות ביצוע
└── README.md        # הקובץ הזה
```

## סוגי קבצים

### Console Logs
- `chromium-console.log` - קונסול רגיל
- `chromium-rtl-console.log` - קונסול RTL (עברית)
- `playwright-console.log` - לוגי Playwright
- `page-errors.log` - שגיאות JavaScript

### Network Logs
- `chromium-net-log.json` - תעבורת רשת מפורטת
- `chromium-rtl-net-log.json` - תעבורת רשת RTL
- `network-errors.log` - שגיאות רשת

### Performance
- `performance-metrics.log` - מדדי ביצועים
- `chromium-startup-trace.json` - עקבות אתחול

### Reports
- `test-results.json` - תוצאות טסטים
- `analysis-report-YYYY-MM-DD.json` - דוח ניתוח יומי
- `monitoring-report-*.md` - דוחות מעקב

## פקודות מהירות

```bash
# הגדרת מערכת המעקב
pnpm monitor:setup

# התחלת מעקב בזמן אמת
pnpm monitor:start

# מעקב אינטראקטיבי עם UI
pnpm monitor:realtime

# ניתוח לוגים קיימים
pnpm logs:analyze

# ניקוי לוגים ישנים
pnpm monitor:cleanup

# יצירת דוח מעקב
pnpm monitor:report

# הרצת טסטי מעקב
pnpm test:monitor
```

## מעקב בזמן אמת

השימוש ב-`pnpm monitor:realtime` מפעיל ממשק אינטראקטיבי עם:

- 📊 סטטיסטיקות חיות
- 🔍 מעקב אחר לוגים בזמן אמת
- ⚠️ התראות על שגיאות
- 📈 ניתוח ביצועים
- 🛠️ פקודות אינטראקטיביות

### פקודות זמינות במעקב החי:
- `stats` - הצגת סטטיסטיקות מפורטות
- `clear` - ניקוי מסך
- `analyze` - הרצת ניתוח מהיר
- `help` - עזרה
- `quit` - יציאה

## ניתוח מתקדם

הסקריפט `log-analyzer.js` מספק:

- 🚨 זיהוי שגיאות ואזהרות
- 🌐 ניתוח תעבורת רשת
- ⚡ מדדי ביצועים
- 🔒 בדיקות אבטחה
- 📋 דוחות JSON מפורטים

## הגדרות Playwright

הקובץ `playwright.config.ts` מוגדר עם:

- ✅ לוגים מלאים לכל הדפדפנים
- 📹 הקלטות וידאו של טסטים
- 📸 צילומי מסך אוטומטיים
- 🔍 עקבות ביצוע מפורטים
- 🌍 תמיכה ב-RTL וגלובליזציה

## מוניטרינג אבטחה

המערכת בודקת:

- 🛡️ CSP violations
- 🔓 Mixed content warnings
- 🚨 XSS attempts
- 🔐 SSL/TLS issues
- ⚠️ Insecure connections

## טיפים לשימוש

1. **התחל תמיד עם setup**:
   ```bash
   pnpm monitor:setup
   ```

2. **השתמש במעקב חי בזמן פיתוח**:
   ```bash
   pnpm monitor:realtime
   ```

3. **נתח לוגים לאחר הטסטים**:
   ```bash
   pnpm logs:analyze
   ```

4. **נקה לוגים ישנים**:
   ```bash
   pnpm monitor:cleanup
   ```

## דוגמאות שימוש

### הפעלת מעקב בסיסי
```bash
# הגדרת המערכת
pnpm monitor:setup

# הרצת טסטים עם מעקב
pnpm test:monitor

# ניתוח התוצאות
pnpm logs:analyze
```

### מעקב מתקדם
```bash
# התחלת מעקב בטרמינל אחד
pnpm monitor:realtime

# הרצת האפליקציה בטרמינל נוסף
pnpm dev

# בדיקת האתר בדפדפן
# (כל הפעילות תיווה במעקב החי)
```

---

**הערה**: כל הלוגים נשמרים אוטומטית ומנוקים לאחר שבוע לחיסכון במקום.