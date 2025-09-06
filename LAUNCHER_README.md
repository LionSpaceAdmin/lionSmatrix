# 🦁 Lionspace Launcher - מדריך שימוש

## התקנה מהירה להוספה ל-Dock

**פשוט לחץ פעמיים על:**
```
scripts/install-to-dock.command
```

זה יוסיף את Lionspace Launcher ל-Dock שלך!

## מה יצרתי לך:

### 1. **Lionspace Launcher.app** 
   - אפליקציה מלאה ל-macOS עם אייקון
   - ניתן לגרירה ל-Dock
   - פותח תפריט אינטראקטיבי

### 2. **סקריפט השקה ראשי** (`scripts/launch-lionspace.sh`)
   - מצב Local Development (מהיר)
   - מצב DevContainer (עם DB מלא)
   - בדיקת סטטוס
   - ניהול שירותים

### 3. **מערכת סנכרון ומעקב** (`scripts/sync-monitor.sh`)
   - מעקב אחר שינויים בקבצים
   - סנכרון Git אוטומטי
   - בדיקות בריאות
   - גיבוי מסד נתונים
   - התאוששות אוטומטית מקריסות

### 4. **DevContainer מלא**
   - Docker Compose עם PostgreSQL + Redis
   - Dockerfile מותאם אישית
   - סקריפטי אתחול
   - VSCode extensions
   - מסד נתונים עם סכמות מוכנות

## שימוש

### מהדוק:
1. לחץ על אייקון Lionspace בדוק
2. בחר מצב הפעלה

### מהטרמינל:
```bash
# תפריט אינטראקטיבי
./scripts/launch-lionspace.sh

# הפעלה ישירה - מצב מקומי
./scripts/launch-lionspace.sh --local

# הפעלה ישירה - DevContainer
./scripts/launch-lionspace.sh --devcontainer

# בדיקת סטטוס
./scripts/launch-lionspace.sh --status

# עצירת כל השירותים
./scripts/launch-lionspace.sh --stop
```

## פיצ'רים מיוחדים:

### סנכרון אוטומטי:
- מעקב אחר שינויים ב-src/ ו-public/
- פורמט אוטומטי עם Prettier/ESLint
- סנכרון Git כל 10 שינויים
- גיבוי DB אוטומטי (במצב DevContainer)

### התאוששות אוטומטית:
- הפעלה מחדש של שרת שקרס
- תיקון הרשאות node_modules
- ניקוי קאש Next.js

### מעקב ביצועים:
- ניטור CPU/Memory
- התראות על שימוש גבוה
- בדיקות בריאות כל 5 דקות
- לוגים מפורטים ב-logs/

## קבצים שנוצרו:

```
/modern-nextjs-app/
├── Lionspace Launcher.app/        # האפליקציה ל-Dock
├── .devcontainer/                 # תצורת DevContainer
│   ├── devcontainer.json
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── scripts/
│       ├── post-create.sh
│       ├── post-start.sh
│       └── init-db.sql
├── scripts/
│   ├── launch-lionspace.sh       # סקריפט הפעלה ראשי
│   ├── sync-monitor.sh           # מערכת סנכרון
│   ├── install-to-dock.command   # התקנה ל-Dock
│   └── create-app-icon.sh        # יצירת אייקון
└── logs/                          # תיקיית לוגים
```

## דרישות מערכת:

- macOS 10.14+
- Node.js 20+
- Docker Desktop (למצב DevContainer)
- VSCode (מומלץ)

## פתרון בעיות:

### Docker לא עובד:
- הסקריפט יפתח את Docker Desktop אוטומטית
- אם לא מותקן: https://www.docker.com/products/docker-desktop

### הוספה ידנית ל-Dock:
- גרור את `Lionspace Launcher.app` ל-Dock

### לוגים:
- שרת: `.dev-server.log`
- סנכרון: `logs/sync.log`

---

**הכל מוכן! 🚀**
פשוט הפעל את `scripts/install-to-dock.command` ותתחיל לעבוד!