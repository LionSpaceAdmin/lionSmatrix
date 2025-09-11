# Advanced Network Visualization Components

חבילת רכיבים מתקדמת לויזואליזציה של רשתות נוירונים ואפקטי מטריקס דיגיטלי עבור פלטפורמת Lions of Zion.

## רכיבים עיקריים

### 1. EnhancedTerminalBackground
רכיב רקע מתקדם המשלב את כל האפקטים הוויזואליים.

```tsx
import { EnhancedTerminalBackground } from './organisms/EnhancedTerminalBackground'

<EnhancedTerminalBackground 
  enableControls={true}
  defaultMode="moderate"
  className="fixed inset-0"
/>
```

**מודים זמינים:**
- `minimal` - אפקטים בסיסיים בלבד
- `moderate` - רמת בינונית (ברירת מחדל)
- `full` - כל האפקטים פעילים
- `extreme` - עומס גבוה - לחומרה חזקה בלבד

### 2. AdvancedNetworkVisualization
רשת נוירונים אינטליגנטית עם קשרים דינמיים.

```tsx
import { AdvancedNetworkVisualization } from './organisms/AdvancedNetworkVisualization'

<AdvancedNetworkVisualization
  density="medium"
  mode="intelligence"
  showMatrix={true}
  showDataFlow={true}
  interactive={false}
/>
```

**מודים:**
- `intelligence` - ניתוח מודיעיני
- `defense` - הגנה סייברית  
- `analysis` - מנוע ניתוח

### 3. MatrixDataFlow
גשם דיגיטלי מתקדם עם מונחי סייבר ומודיעין.

```tsx
import { MatrixDataFlow } from './organisms/MatrixDataFlow'

<MatrixDataFlow
  intensity="medium"
  mode="intelligence"
  showHorizontalStreams={true}
  showVerticalMatrix={true}
  highlightThreats={false}
/>
```

**רמות עוצמה:**
- `low` - ביצועים נמוכים
- `medium` - ביצועים בינוניים
- `high` - ביצועים גבוהים
- `extreme` - עומס מקסימלי

## מאפיינים טכניים

### אופטימיזציות ביצועים
- **Hardware Acceleration**: `transform: translateZ(0)`
- **Will-Change Properties**: אופטימיזציה לאנימציות
- **Reduced Motion Support**: תמיכה מלאה ב-accessibility
- **CSS Custom Properties**: ניהול קל של משתנים

### נגישות
- תמיכה מלאה ב-`prefers-reduced-motion`
- מקשי קיצור לניווט
- תיאורי ARIA מתאימים
- ניגודיות מותאמת לטרמינל

### תאימות דפדפנים
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- תמיכה בכל הדפדפנים המודרניים

## קלאסי CSS חדשים

### אנימציות
```css
.animate-neural-pulse     /* פעימות רשת נוירונים */
.animate-matrix-rain      /* גשם מטריקס */
.animate-connection-pulse /* פעימות קשרי רשת */
.animate-data-flow        /* זרימת נתונים אופקית */
.animate-data-flow-vertical /* זרימת נתונים אנכית */
```

### רכיבים ויזואליים
```css
.neural-node             /* צומת נוירונים */
.network-connection      /* קו חיבור רשת */
.matrix-rain            /* עמודת מטריקס */
.data-packet            /* חבילת נתונים */
```

## דוגמאות שימוש

### רקע מלא למסך
```tsx
export default function Page() {
  return (
    <div className="relative min-h-screen">
      <EnhancedTerminalBackground 
        defaultMode="moderate"
        enableControls={true}
      />
      
      <div className="relative z-10">
        {/* תוכן הדף */}
      </div>
    </div>
  )
}
```

### ויזואליזציה בחלון ספציפי
```tsx
<div className="h-96 border border-terminal-border/50 rounded">
  <AdvancedNetworkVisualization
    density="high"
    mode="defense"
    className="w-full h-full"
  />
</div>
```

## משתני CSS

המערכת משתמשת במשתני CSS מותאמים אישית:

```css
:root {
  --node-size-small: 4px;
  --node-size-medium: 6px;
  --node-size-large: 8px;
  --matrix-speed: 6s;
  --neural-speed: 3s;
  --connection-speed: 4s;
}
```

## הערות חשובות

1. **ביצועים**: מוד `extreme` יכול להשפיע על ביצועי דפדפן במכשירים חלשים
2. **נגישות**: כל האנימציות מכבדות `prefers-reduced-motion`
3. **זיכרון**: הרכיבים מנקים אחריהם באופן אוטומטי
4. **תאימות**: נבדק עם React 18+ ו-Next.js 14+

## דוגמת מלא
ראה `NetworkVisualizationDemo.tsx` לדוגמה מלאה ואינטראקטיבית.