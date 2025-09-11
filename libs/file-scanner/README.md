# File Scanner Engine

מנוע סריקת קבצים מתקדם עבור פרויקט Lions of Zion - מערכת הגנה מפני לוחמה מידעתית.

## תכונות עיקריות

- **סריקה מקיפה**: ניתוח מבנה פרויקט מלא עם זיהוי קשרי תלות
- **גרף תלויות**: מיפוי קשרים בין קבצים, רכיבים ונתיבים
- **ניתוח בריאות פרויקט**: זיהוי בעיות, קוד מת, בעיות ביטחון וביצועים
- **מעקב זמן אמת**: ניטור שינויים עם chokidar
- **אינטגרציה עם Agent Prompts**: ניתוח התאמה לדרישות התכנון
- **ויזואליזציה**: יצירת נתונים עבור React Flow

## התקנה

```bash
# הספריות מותקנות כבר בפרויקט
# chokidar, glob, react-flow-renderer
```

## שימוש בסיסי

```typescript
import { 
  FileScannerEngine, 
  createDefaultScannerConfig 
} from '@/libs/file-scanner';

// יצירת קונפיגורציה
const config = createDefaultScannerConfig('/path/to/project');

// יצירת מנוע הסריקה
const scanner = new FileScannerEngine(config);

// ביצוע סריקה
const result = await scanner.scan();

console.log('סריקה הושלמה:', {
  totalFiles: result.totalFiles,
  healthScore: result.health.score,
  dependencyCount: result.dependencies.edges.size
});
```

## שימוש מתקדם

### מעקב זמן אמת

```typescript
// התחלת ניטור שינויים
await scanner.startWatching();

// הגדרת callback לשינויים
const config = {
  ...defaultConfig,
  onChange: (event) => {
    console.log(`קובץ ${event.type}: ${event.path}`);
  },
  onProgress: (progress) => {
    console.log(`התקדמות: ${progress.progress}%`);
  }
};
```

### ניתוח Agent Prompts

```typescript
// קבלת ניתוח Agent Prompts
const agentAnalysis = scanner.getAgentPromptsAnalysis();

// יצירת דוח יישום
const report = scanner.generateImplementationReport();

// קבלת הצעות יישום לנתיב
const suggestions = scanner.getImplementationSuggestions('/dashboard');
```

### ויזואליזציה

```typescript
// יצירת נתונים עבור React Flow
const visualData = scanner.generateVisualizationData();

// שימוש ברכיב React Flow
<ReactFlow
  nodes={visualData.nodes}
  edges={visualData.edges}
  // ...
/>
```

## ממשק API

### FileScannerEngine

#### מתודות עיקריות

- `scan()`: ביצוע סריקה מקיפה
- `startWatching()`: התחלת מעקב זמן אמת
- `stopWatching()`: עצירת מעקב
- `generateVisualizationData()`: יצירת נתונים לויזואליזציה

#### מתודות ניתוח

- `getAgentPromptsAnalysis()`: קבלת ניתוח Agent Prompts
- `generateImplementationReport()`: יצירת דוח יישום
- `getRouteContext(route)`: קבלת הקשר לנתיב
- `getImplementationSuggestions(route)`: קבלת הצעות יישום

### DependencyAnalyzer

```typescript
const analyzer = new DependencyAnalyzer();
const graph = await analyzer.buildDependencyGraph(fileNodes);

// ניתוח שימוש ברכיבים
const usage = analyzer.analyzeComponentUsage(fileNodes);

// סטטיסטיקות תלויות
const stats = analyzer.getDependencyStats(graph);
```

### HealthMonitor

```typescript
const monitor = new HealthMonitor();
const health = await monitor.analyzeProjectHealth({
  files: fileNodes,
  dependencies: graph,
  routes: routeGraph,
  components: componentMap
});

// הוספת כלל מותאם אישית
monitor.addCustomRule({
  id: 'custom-rule',
  name: 'Custom Rule',
  description: 'תיאור הכלל',
  category: IssueType.PERFORMANCE,
  severity: IssueSeverity.MEDIUM,
  check: (file) => {
    // לוגיקת בדיקה
    return [];
  }
});
```

### AgentPromptsAnalyzer

```typescript
const promptsAnalyzer = new AgentPromptsAnalyzer('/project/root');

// ניתוח פרויקט מול Agent Prompts
const analysis = await promptsAnalyzer.analyzeProject({
  files: fileNodes,
  routes: routeMap,
  components: componentMap
});

// קבלת הקשר לנתיב
const context = promptsAnalyzer.getRouteContext('/dashboard');
```

## קונפיגורציה

### ScanOptions

```typescript
interface ScanOptions {
  rootPath: string;
  includePatterns: string[];  // דפוסי קבצים לכלול
  excludePatterns: string[];  // דפוסי קבצים להוציא
  followSymlinks: boolean;
  maxDepth: number;
  parseAST: boolean;          // ניתוח AST
  includeContent: boolean;    // קריאת תוכן קבצים
  enableTypeChecking: boolean;
  enablePerformanceAnalysis: boolean;
  enableSecurityAnalysis: boolean;
}
```

### דוגמת קונפיגורציה

```typescript
const config: ScannerConfig = {
  rootPath: '/Users/username/project',
  options: {
    includePatterns: [
      'apps/**/*.{ts,tsx,js,jsx}',
      'libs/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ],
    excludePatterns: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**'
    ],
    followSymlinks: false,
    maxDepth: 20,
    parseAST: true,
    includeContent: true,
    enableTypeChecking: true,
    enablePerformanceAnalysis: true,
    enableSecurityAnalysis: true
  },
  watcherOptions: {
    debounceMs: 300,
    ignoreInitial: true,
    persistent: true
  }
};
```

## ניתוח בריאות פרויקט

המערכת מזהה:

### בעיות ביטחון
- פגיעויות XSS
- שימוש לא בטוח ב-eval
- סודות מקודדים קשיח
- תכונות HTML מסוכנות

### בעיות ביצועים
- useEffect ללא dependencies
- אובייקטים גדולים inline
- פעולות map מחוברות
- קבצים גדולים

### קוד מת
- imports לא בשימוש
- exports לא בשימוש
- קבצים נטושים
- קוד לא נגיש

### שגיאות TypeScript
- שימוש ב-any
- @ts-ignore directives
- בעיות טיפוסים

## דוגמת תוצאה

```json
{
  "rootPath": "/project",
  "totalFiles": 1250,
  "totalDirectories": 180,
  "dependencies": {
    "nodes": "Map<string, FileNode>",
    "edges": "Map<string, DependencyEdge>",
    "cycles": ["circular dependency paths"],
    "orphanedFiles": ["unused files"],
    "entryPoints": ["entry point files"]
  },
  "health": {
    "score": 87,
    "issues": ["array of issues"],
    "missingDependencies": ["missing deps"],
    "deadCode": ["dead code items"],
    "typeErrors": ["TS errors"],
    "performanceIssues": ["perf issues"],
    "securityIssues": ["security issues"]
  },
  "routes": {
    "routes": "Map<string, RouteNode>",
    "routeGroups": "Map<string, string[]>",
    "apiRoutes": ["API route paths"]
  },
  "components": {
    "components": "Map<string, ComponentInfo>",
    "usage": "Map<string, ComponentUsage[]>",
    "serverComponents": ["server component paths"],
    "clientComponents": ["client component paths"]
  }
}
```

## שילוב עם React Flow

```typescript
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap 
} from 'react-flow-renderer';

function ProjectVisualization() {
  const [scanner] = useState(() => 
    new FileScannerEngine(config)
  );
  
  const [visualData, setVisualData] = useState(null);

  useEffect(() => {
    scanner.scan().then(() => {
      setVisualData(scanner.generateVisualizationData());
    });
  }, []);

  if (!visualData) return <div>טוען...</div>;

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={visualData.nodes}
        edges={visualData.edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
```

## ביצועים

- סריקת 1000+ קבצים: ~3-5 שניות
- זיכרון: ~50-100MB לפרויקט בינוני
- מעקב זמן אמת: debounce 300ms
- תמיכה בפרויקטים עד 10,000 קבצים

## הרחבות

### הוספת כללי בדיקה מותאמים

```typescript
monitor.addCustomRule({
  id: 'lions-of-zion-naming',
  name: 'Lions of Zion Naming Convention',
  description: 'בדיקת קונבנציות שמות',
  category: IssueType.PERFORMANCE,
  severity: IssueSeverity.LOW,
  check: (file) => {
    const issues = [];
    
    if (file.name.includes('temp') || file.name.includes('test')) {
      issues.push({
        id: `naming-${file.path}`,
        type: IssueType.PERFORMANCE,
        severity: IssueSeverity.LOW,
        file: file.path,
        message: 'שם קובץ לא תקני - נמנע משמות temp/test',
        suggestion: 'שנה שם לתיאורי יותר',
        fixable: false
      });
    }
    
    return issues;
  }
});
```

## תמיכה

לשאלות ובעיות, פנה לצוות Lions of Zion או צור issue ב-repository.

## רישיון

MIT License - Lions of Zion Team