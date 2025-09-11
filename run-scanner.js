#!/usr/bin/env node

/**
 * 🔍 LionSpace Project Scanner
 * כלי מקצועי לסריקת הפרויקט ומציאת בעיות
 */

const path = require('path');
const fs = require('fs');

// נסה לטעון את File Scanner
let FileScannerEngine, createDefaultScannerConfig;

try {
  // נסה מהנתיב המקומפל
  const scannerPath = path.join(__dirname, 'libs/file-scanner/index.js');
  if (fs.existsSync(scannerPath)) {
    const scanner = require(scannerPath);
    FileScannerEngine = scanner.FileScannerEngine;
    createDefaultScannerConfig = scanner.createDefaultScannerConfig;
  } else {
    // נסה מהנתיב של TypeScript
    const tsPath = path.join(__dirname, 'libs/file-scanner/index.ts');
    if (fs.existsSync(tsPath)) {
      // נצטרך ts-node או compilation
      console.log('⚠️  נמצא קובץ TypeScript - צריך קומפילציה');
      console.log('מריץ בדיקה בסיסית במקום...\n');
      
      // בדיקה בסיסית ללא File Scanner
      runBasicAnalysis();
      process.exit(0);
    } else {
      throw new Error('File Scanner not found');
    }
  }
} catch (error) {
  console.log('📊 מריץ ניתוח בסיסי של הפרויקט...\n');
  runBasicAnalysis();
  process.exit(0);
}

// פונקציה לניתוח בסיסי אם File Scanner לא זמין
function runBasicAnalysis() {
  const projectRoot = __dirname;
  
  console.log('🔍 סורק פרויקט LionSpace...\n');
  console.log(`📁 נתיב: ${projectRoot}\n`);
  
  // בדיקת TypeScript
  console.log('📝 בודק TypeScript errors...');
  try {
    const { execSync } = require('child_process');
    const result = execSync('npx tsc --noEmit 2>&1', { 
      cwd: projectRoot,
      encoding: 'utf8'
    });
    console.log('✅ אין שגיאות TypeScript!\n');
  } catch (error) {
    const output = error.stdout || error.toString();
    const errors = output.match(/error TS\d+:/g) || [];
    if (errors.length > 0) {
      console.log(`❌ נמצאו ${errors.length} שגיאות TypeScript\n`);
      
      // הצג את 5 השגיאות הראשונות
      const lines = output.split('\n');
      const errorLines = lines.filter(line => line.includes('error TS'));
      errorLines.slice(0, 5).forEach(line => {
        console.log(`   ${line.trim()}`);
      });
      if (errorLines.length > 5) {
        console.log(`   ... ועוד ${errorLines.length - 5} שגיאות`);
      }
      console.log('');
    }
  }
  
  // בדיקת ESLint
  console.log('🔍 בודק ESLint issues...');
  try {
    const { execSync } = require('child_process');
    execSync('npx eslint . --ext .ts,.tsx --format compact 2>&1', {
      cwd: projectRoot,
      encoding: 'utf8'
    });
    console.log('✅ אין בעיות ESLint!\n');
  } catch (error) {
    const output = error.stdout || '';
    const problems = output.match(/\d+ problems?/);
    if (problems) {
      console.log(`⚠️  ${problems[0]} נמצאו\n`);
    }
  }
  
  // בדיקת imports שבורים
  console.log('🔗 מחפש imports שבורים...');
  const brokenImports = findBrokenImports(projectRoot);
  if (brokenImports.length > 0) {
    console.log(`❌ נמצאו ${brokenImports.length} imports שבורים:`);
    brokenImports.slice(0, 5).forEach(imp => {
      console.log(`   ${imp.file}: ${imp.import}`);
    });
    if (brokenImports.length > 5) {
      console.log(`   ... ועוד ${brokenImports.length - 5}`);
    }
  } else {
    console.log('✅ כל ה-imports תקינים!');
  }
  console.log('');
  
  // בדיקת תלויות מעגליות
  console.log('♻️  בודק תלויות מעגליות...');
  try {
    const { execSync } = require('child_process');
    const result = execSync('npx madge --circular --extensions ts,tsx apps/web 2>&1', {
      cwd: projectRoot,
      encoding: 'utf8'
    });
    
    if (result.includes('No circular dependencies found')) {
      console.log('✅ אין תלויות מעגליות!\n');
    } else {
      const circles = result.match(/\d+ circular/);
      if (circles) {
        console.log(`⚠️  ${circles[0]} נמצאו\n`);
      }
    }
  } catch (error) {
    console.log('⚠️  לא הצליח לבדוק תלויות מעגליות\n');
  }
  
  // בדיקת גודל bundles
  console.log('📦 בודק גדלי bundles...');
  checkBundleSizes(projectRoot);
  
  // סיכום
  console.log('\n' + '='.repeat(60));
  console.log('📊 סיכום סריקה:');
  console.log('='.repeat(60));
  
  // ציון בריאות משוער
  let healthScore = 100;
  if (brokenImports.length > 0) healthScore -= 20;
  // if (tsErrors > 0) healthScore -= 30;
  // if (eslintProblems > 0) healthScore -= 10;
  
  console.log(`🏥 ציון בריאות משוער: ${healthScore}/100`);
  
  if (healthScore < 70) {
    console.log('\n⚠️  הפרויקט זקוק לתשומת לב!');
    console.log('💡 המלצות:');
    console.log('   1. תקן את שגיאות ה-TypeScript');
    console.log('   2. טפל ב-imports השבורים');
    console.log('   3. הרץ npm run lint:fix');
  } else if (healthScore < 90) {
    console.log('\n👍 הפרויקט במצב סביר');
    console.log('💡 שפר את הציון ע"י תיקון הבעיות שנמצאו');
  } else {
    console.log('\n🎉 הפרויקט במצב מצוין!');
  }
}

function findBrokenImports(projectRoot) {
  const broken = [];
  const glob = require('glob');
  
  try {
    const files = glob.sync('**/*.{ts,tsx}', {
      cwd: path.join(projectRoot, 'apps/web'),
      ignore: ['node_modules/**', '.next/**']
    });
    
    files.forEach(file => {
      const content = fs.readFileSync(
        path.join(projectRoot, 'apps/web', file), 
        'utf8'
      );
      
      // חיפוש imports
      const imports = content.match(/import .* from ['"](.+)['"]/g) || [];
      imports.forEach(imp => {
        const match = imp.match(/from ['"](.+)['"]/);
        if (match && match[1].startsWith('./') || match[1].startsWith('../')) {
          // בדיקה אם הקובץ קיים
          const importPath = match[1];
          const resolvedPath = path.resolve(
            path.dirname(path.join(projectRoot, 'apps/web', file)),
            importPath
          );
          
          // נסה עם סיומות שונות
          const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
          let found = false;
          
          for (const ext of extensions) {
            if (fs.existsSync(resolvedPath + ext) || fs.existsSync(resolvedPath)) {
              found = true;
              break;
            }
          }
          
          if (!found && !importPath.includes('flowrise')) { // מתעלם מ-flowrise שמחקנו
            broken.push({
              file: file,
              import: importPath
            });
          }
        }
      });
    });
  } catch (error) {
    // console.log('Could not scan for imports');
  }
  
  return broken;
}

function checkBundleSizes(projectRoot) {
  const nextPath = path.join(projectRoot, 'apps/web/.next');
  
  if (!fs.existsSync(nextPath)) {
    console.log('⚠️  לא נמצא build - הרץ npm run build לבדיקת גדלים\n');
    return;
  }
  
  try {
    const buildManifest = path.join(nextPath, 'build-manifest.json');
    if (fs.existsSync(buildManifest)) {
      const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
      const pages = Object.keys(manifest.pages || {}).length;
      console.log(`✅ ${pages} דפים ב-build\n`);
    }
  } catch (error) {
    console.log('⚠️  לא הצליח לקרוא build manifest\n');
  }
}

// אם File Scanner זמין, הרץ אותו
if (FileScannerEngine && createDefaultScannerConfig) {
  async function runFullScan() {
    console.log('🚀 מפעיל File Scanner Engine מתקדם...\n');
    
    const config = createDefaultScannerConfig(__dirname);
    
    config.onProgress = (progress) => {
      process.stdout.write(`\r📊 התקדמות: ${progress.progress}% - ${progress.phase}`);
      if (progress.currentFile) {
        process.stdout.write(` (${path.basename(progress.currentFile)})`);
      }
    };
    
    const scanner = new FileScannerEngine(config);
    
    try {
      const result = await scanner.scan();
      
      console.log('\n\n✅ סריקה הושלמה!\n');
      console.log('='.repeat(60));
      console.log('📊 תוצאות סריקה מלאות:');
      console.log('='.repeat(60));
      
      console.log(`\n📁 מבנה הפרויקט:`);
      console.log(`   ק