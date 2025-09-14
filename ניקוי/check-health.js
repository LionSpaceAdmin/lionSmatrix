#!/usr/bin/env node

/**
 * 🔍 בדיקת בריאות מהירה לפרויקט LionSpace
 * ללא תלויות חיצוניות!
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🦁 LionSpace Health Check\n');
console.log('='.repeat(50) + '\n');

let score = 100;
const issues = [];

// 1. בדיקת TypeScript
console.log('📝 בודק TypeScript...');
try {
  execSync('npx tsc --noEmit', { 
    cwd: __dirname,
    stdio: 'pipe'
  });
  console.log('✅ TypeScript - נקי!\n');
} catch (error) {
  const output = error.stdout?.toString() || '';
  const errorCount = (output.match(/error TS/g) || []).length;
  if (errorCount > 0) {
    console.log(`❌ TypeScript - ${errorCount} שגיאות\n`);
    score -= 30;
    issues.push(`תקן ${errorCount} שגיאות TypeScript`);
  }
}

// 2. בדיקת תלויות חסרות  
console.log('📦 בודק dependencies...');
try {
  execSync('npm ls --depth=0', {
    cwd: __dirname,
    stdio: 'pipe'
  });
  console.log('✅ Dependencies - תקינות!\n');
} catch (error) {
  console.log('⚠️  Dependencies - יש בעיות\n');
  score -= 10;
  issues.push('הרץ npm install');
}

// 3. בדיקת תלויות מעגליות עם madge (אם קיים)
console.log('♻️  בודק תלויות מעגליות...');
try {
  const result = execSync('npx madge --circular --extensions ts,tsx apps/web 2>&1', {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  if (result.includes('No circular dependencies found')) {
    console.log('✅ אין תלויות מעגליות!\n');
  } else {
    const matches = result.match(/(\d+) circular/);
    if (matches) {
      console.log(`⚠️  ${matches[1]} תלויות מעגליות\n`);
      score -= 15;
      issues.push(`תקן ${matches[1]} תלויות מעגליות`);
    }
  }
} catch (error) {
  console.log('⏭️  דילוג על בדיקת תלויות מעגליות\n');
}

// 4. בדיקת קבצים גדולים
console.log('📏 בודק גדלי קבצים...');
const largeFiles = [];
function checkFileSizes(dir, depth = 0) {
  if (depth > 3) return;
  
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      if (item.includes('node_modules') || item.startsWith('.')) return;
      
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        checkFileSizes(fullPath, depth + 1);
      } else if (stat.isFile()) {
        const sizeMB = stat.size / (1024 * 1024);
        if (sizeMB > 1) {
          largeFiles.push({ path: fullPath.replace(__dirname, '.'), size: sizeMB });
        }
      }
    });
  } catch (e) {}
}

checkFileSizes(path.join(__dirname, 'apps'));
if (largeFiles.length > 0) {
  console.log(`⚠️  ${largeFiles.length} קבצים גדולים (>1MB)\n`);
  largeFiles.slice(0, 3).forEach(f => {
    console.log(`   ${f.path}: ${f.size.toFixed(2)}MB`);
  });
  console.log('');
  score -= 5;
  issues.push('בדוק קבצים גדולים');
} else {
  console.log('✅ אין קבצים גדולים מדי!\n');
}

// 5. בדיקת imports שבורים
console.log('🔗 בודק imports...');
let brokenImports = 0;
const scanDir = path.join(__dirname, 'apps/web');

function checkImports(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const imports = content.match(/from ['"]([^'"]+)['"]/g) || [];
    
    imports.forEach(imp => {
      const match = imp.match(/from ['"]([^'"]+)['"]/);
      if (match) {
        const importPath = match[1];
        // דילוג על flowrise שמחקנו
        if (importPath.includes('flowrise')) {
          brokenImports++;
        }
      }
    });
  } catch (e) {}
}

function scanForImports(dir, depth = 0) {
  if (depth > 3) return;
  
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      if (item.includes('node_modules') || item.startsWith('.')) return;
      
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanForImports(fullPath, depth + 1);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        checkImports(fullPath);
      }
    });
  } catch (e) {}
}

scanForImports(scanDir);
if (brokenImports > 0) {
  console.log(`❌ ${brokenImports} imports שבורים (flowrise)\n`);
  score -= 20;
  issues.push(`תקן ${brokenImports} imports של flowrise`);
} else {
  console.log('✅ כל ה-imports תקינים!\n');
}

// סיכום
console.log('='.repeat(50));
console.log('\n📊 סיכום בדיקה:\n');

// צבע לפי ציון
const getScoreColor = (s) => {
  if (s >= 90) return '\x1b[32m'; // ירוק
  if (s >= 70) return '\x1b[33m'; // צהוב
  return '\x1b[31m'; // אדום
};

console.log(`${getScoreColor(score)}🏥 ציון בריאות: ${score}/100${'\x1b[0m'}\n`);

if (issues.length > 0) {
  console.log('📋 בעיות שנמצאו:');
  issues.forEach((issue, i) => {
    console.log(`   ${i + 1}. ${issue}`);
  });
  console.log('\n💡 המלצות:');
  console.log('   • הרץ: npm run type-check');
  console.log('   • הרץ: npm run lint:fix');
  console.log('   • נקה imports מיותרים');
} else {
  console.log('🎉 הפרויקט במצב מצוין!');
}

console.log('\n' + '='.repeat(50));

// החזר exit code לפי הציון
process.exit(score < 70 ? 1 : 0);
