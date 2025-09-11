/**
 * File Scanner Engine - Usage Example
 * Lions of Zion - Information Warfare Defense Platform
 * 
 * דוגמת שימוש מלאה במנוע סריקת הקבצים
 */

import { 
  FileScannerEngine, 
  createDefaultScannerConfig,
  ScanProgress,
  FileChangeEvent,
  IssueType,
  IssueSeverity
} from './index';

// דוגמה 1: סריקה בסיסית
async function basicScanExample() {
  console.log('🔍 התחלת סריקה בסיסית...');
  
  // יצירת קונפיגורציה
  const config = createDefaultScannerConfig('/Users/danielions/Development/lionspace-platform');
  
  // הוספת callback להתקדמות
  config.onProgress = (progress: ScanProgress) => {
    console.log(`📊 התקדמות: ${progress.progress}% - ${progress.phase}`);
    if (progress.currentFile) {
      console.log(`   📄 מעבד: ${progress.currentFile}`);
    }
  };

  // יצירת מנוע הסריקה
  const scanner = new FileScannerEngine(config);
  
  try {
    // ביצוע סריקה
    const result = await scanner.scan();
    
    console.log('\n✅ סריקה הושלמה בהצלחה!');
    console.log('📈 סיכום תוצאות:');
    console.log(`   📁 סה"כ קבצים: ${result.totalFiles}`);
    console.log(`   📂 סה"כ תיקיות: ${result.totalDirectories}`);
    console.log(`   🔗 קשרי תלות: ${result.dependencies.edges.size}`);
    console.log(`   ♻️  תלויות מעגליות: ${result.dependencies.cycles.length}`);
    console.log(`   🏥 ציון בריאות: ${result.health.score}/100`);
    console.log(`   ⏱️  זמן סריקה: ${Math.round(result.scanDuration)}ms`);
    
    // הצגת בעיות בעדיפות גבוהה
    const highPriorityIssues = result.health.issues.filter(
      issue => issue.severity === IssueSeverity.HIGH || issue.severity === IssueSeverity.CRITICAL
    );
    
    if (highPriorityIssues.length > 0) {
      console.log('\n🚨 בעיות בעדיפות גבוהה:');
      highPriorityIssues.forEach(issue => {
        console.log(`   ⚠️  ${issue.file}: ${issue.message}`);
      });
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ שגיאה בסריקה:', error);
    throw error;
  }
}

// דוגמה 2: מעקב זמן אמת
async function realtimeMonitoringExample() {
  console.log('👁️  התחלת מעקב זמן אמת...');
  
  const config = createDefaultScannerConfig('/Users/danielions/Development/lionspace-platform');
  
  // הגדרת callbacks למעקב
  config.onChange = (event: FileChangeEvent) => {
    const timestamp = event.timestamp.toLocaleTimeString('he-IL');
    console.log(`🔄 [${timestamp}] ${event.type}: ${event.path}`);
  };
  
  const scanner = new FileScannerEngine(config);
  
  // ביצוע סריקה ראשונית
  await scanner.scan();
  
  // התחלת מעקב
  await scanner.startWatching();
  
  console.log('✅ מעקב זמן אמת מופעל');
  console.log('📝 עדכונים יופיעו כאן בזמן אמת...');
  
  // עצירה אחרי זמן מסוים (בדוגמה)
  setTimeout(async () => {
    await scanner.stopWatching();
    console.log('⏹️  מעקב הופסק');
  }, 60000); // עצירה אחרי דקה
}

// דוגמה 3: ניתוח Agent Prompts
async function agentPromptsAnalysisExample() {
  console.log('🤖 ניתוח Agent Prompts...');
  
  const config = createDefaultScannerConfig('/Users/danielions/Development/lionspace-platform');
  const scanner = new FileScannerEngine(config);
  
  await scanner.scan();
  
  // קבלת ניתוח Agent Prompts
  const agentAnalysis = scanner.getAgentPromptsAnalysis();
  
  if (agentAnalysis) {
    console.log('\n📋 תוצאות ניתוח Agent Prompts:');
    console.log(`   📝 סה"כ prompts: ${agentAnalysis.totalPrompts}`);
    console.log(`   🛣️  נתיבים מכוסים: ${agentAnalysis.routesCovered.length}`);
    console.log(`   🧩 רכיבים מוזכרים: ${agentAnalysis.componentsMentioned.length}`);
    console.log(`   ❌ נתיבים חסרים: ${agentAnalysis.missingRoutes.length}`);
    console.log(`   🔍 פערי יישום: ${agentAnalysis.implementationGaps.length}`);
    
    // הצגת פערי יישום
    if (agentAnalysis.implementationGaps.length > 0) {
      console.log('\n🚧 פערי יישום:');
      agentAnalysis.implementationGaps.forEach(gap => {
        console.log(`   📍 ${gap.route} (${gap.priority}): ${gap.description}`);
        console.log(`      📁 נתיב צפוי: ${gap.expectedPath}`);
      });
    }
    
    // יצירת דוח יישום
    const report = scanner.generateImplementationReport();
    console.log('\n📊 דוח יישום נוצר');
    
    // הצגת הצעות יישום לנתיב הבית
    const homeSuggestions = scanner.getImplementationSuggestions('/');
    if (homeSuggestions.length > 0) {
      console.log('\n💡 הצעות יישום לדף הבית:');
      homeSuggestions.forEach(suggestion => {
        console.log(`   💻 ${suggestion}`);
      });
    }
  }
}

// דוגמה 4: ויזואליזציה
async function visualizationExample() {
  console.log('🎨 יצירת נתוני ויזואליזציה...');
  
  const config = createDefaultScannerConfig('/Users/danielions/Development/lionspace-platform');
  const scanner = new FileScannerEngine(config);
  
  await scanner.scan();
  
  // יצירת נתונים לויזואליזציה
  const visualData = scanner.generateVisualizationData();
  
  console.log('\n🎯 נתוני ויזואליזציה:');
  console.log(`   🔵 צמתים: ${visualData.nodes.length}`);
  console.log(`   ➡️  קשרים: ${visualData.edges.length}`);
  
  // סינון לקבצים עם תלויות רבות
  const highDependencyNodes = visualData.nodes.filter(
    node => (node.data.dependencies || 0) > 5
  );
  
  if (highDependencyNodes.length > 0) {
    console.log('\n🔗 קבצים עם תלויות רבות:');
    highDependencyNodes.forEach(node => {
      console.log(`   📄 ${node.data.label}: ${node.data.dependencies} תלויות`);
    });
  }
  
  // שמירת נתונים לקובץ (אופציונלי)
  const fs = require('fs/promises');
  await fs.writeFile(
    'visualization-data.json', 
    JSON.stringify(visualData, null, 2)
  );
  
  console.log('💾 נתוני הויזואליזציה נשמרו לקובץ visualization-data.json');
}

// דוגמה 5: ניתוח מותאם אישית
async function customAnalysisExample() {
  console.log('🔧 ניתוח מותאם אישית...');
  
  const config = createDefaultScannerConfig('/Users/danielions/Development/lionspace-platform');
  const scanner = new FileScannerEngine(config);
  
  // הוספת כלל בדיקה מותאם אישית לפני הסריקה
  const healthMonitor = scanner['healthMonitor']; // גישה פרטית לדוגמה
  
  healthMonitor.addCustomRule({
    id: 'lions-of-zion-file-size',
    name: 'Lions of Zion File Size Check',
    description: 'בדיקת גודל קבצים עבור פרויקט Lions of Zion',
    category: IssueType.PERFORMANCE,
    severity: IssueSeverity.MEDIUM,
    check: (file) => {
      const issues = [];
      
      // בדיקת קבצים גדולים מדי
      if (!file.isDirectory && file.size > 50 * 1024) { // 50KB
        issues.push({
          id: `large-file-${file.path}`,
          type: IssueType.PERFORMANCE,
          severity: IssueSeverity.MEDIUM,
          file: file.path,
          message: `קובץ גדול מדי (${Math.round(file.size / 1024)}KB)`,
          suggestion: 'שקול פיצול הקובץ או אופטימיזציה',
          fixable: false
        });
      }
      
      // בדיקת שמות קבצים ארוכים
      if (file.name.length > 50) {
        issues.push({
          id: `long-filename-${file.path}`,
          type: IssueType.PERFORMANCE,
          severity: IssueSeverity.LOW,
          file: file.path,
          message: 'שם קובץ ארוך מדי',
          suggestion: 'קצר את שם הקובץ לשיפור הקריאות',
          fixable: true
        });
      }
      
      return issues;
    }
  });
  
  await scanner.scan();
  
  const result = scanner.getLastScanResult();
  if (result) {
    const customIssues = result.health.issues.filter(
      issue => issue.id.includes('lions-of-zion')
    );
    
    console.log(`\n🎯 בעיות שזוהו בכללים מותאמים: ${customIssues.length}`);
    customIssues.forEach(issue => {
      console.log(`   📋 ${issue.message} (${issue.file})`);
    });
  }
}

// דוגמה 6: ייצוא נתונים מלא
async function fullDataExportExample() {
  console.log('📤 ייצוא נתונים מלא...');
  
  const config = createDefaultScannerConfig('/Users/danielions/Development/lionspace-platform');
  const scanner = new FileScannerEngine(config);
  
  await scanner.scan();
  
  // ייצוא כל הנתונים
  const exportData = scanner.exportProjectData();
  
  console.log('\n📊 סיכום ייצוא:');
  console.log(`   🏗️  מבנה פרויקט: ${exportData.structure ? 'זמין' : 'לא זמין'}`);
  console.log(`   🤖 ניתוח Agent: ${exportData.agentAnalysis ? 'זמין' : 'לא זמין'}`);
  console.log(`   🎨 נתוני ויזואליזציה: ${exportData.visualizationData ? 'זמין' : 'לא זמין'}`);
  
  // שמירה לקובץ JSON
  const fs = require('fs/promises');
  await fs.writeFile(
    'lions-of-zion-project-analysis.json',
    JSON.stringify(exportData, (key, value) => {
      // המרת Map לאובייקט עבור JSON
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      return value;
    }, 2)
  );
  
  console.log('💾 ניתוח מלא נשמר ל-lions-of-zion-project-analysis.json');
}

// הרצת כל הדוגמאות
async function runAllExamples() {
  console.log('🚀 הרצת כל דוגמאות השימוש ב-File Scanner Engine\n');
  
  try {
    await basicScanExample();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await agentPromptsAnalysisExample();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await visualizationExample();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await customAnalysisExample();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await fullDataExportExample();
    console.log('\n' + '='.repeat(60) + '\n');
    
    // מעקב זמן אמת בסוף (אופציונלי)
    // await realtimeMonitoringExample();
    
    console.log('✅ כל הדוגמאות הושלמו בהצלחה!');
    
  } catch (error) {
    console.error('❌ שגיאה בהרצת הדוגמאות:', error);
  }
}

// ייצוא הפונקציות לשימוש חיצוני
export {
  basicScanExample,
  realtimeMonitoringExample,
  agentPromptsAnalysisExample,
  visualizationExample,
  customAnalysisExample,
  fullDataExportExample,
  runAllExamples
};

// הרצה ישירה אם הקובץ מופעל ישירות
if (require.main === module) {
  runAllExamples().catch(console.error);
}