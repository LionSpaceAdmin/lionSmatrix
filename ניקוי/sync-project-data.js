#!/usr/bin/env node

/**
 * Lions of Zion - Project Data Sync Script
 * 
 * סקריפט לסינכרון נתוני הפרויקט עם מערכת הקבצים בזמן אמת
 * מעדכן את הנתונים בקובץ ה-JSON ובקובץ ה-HTML
 */

const fs = require('fs');
const path = require('path');

// נתיבים
const PROJECT_ROOT = __dirname;
const APP_DIR = path.join(PROJECT_ROOT, 'apps/web/app');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'apps/web/components');
const JSON_FILE = path.join(PROJECT_ROOT, 'project-structure-mapping.json');
const HTML_FILE = path.join(PROJECT_ROOT, 'project-flowrise-mapper.html');
const AGENT_PROMPTS_FILE = path.join(PROJECT_ROOT, 'lions_of_zion_agent_prompts_claude_spark_full_pack.md');

/**
 * סורק את מערכת הקבצים ומחזיר סטטיסטיקות מעודכנות
 */
function scanFileSystem() {
    console.log('🔍 סורק מערכת קבצים...');
    
    const stats = {
        totalPages: 0,
        totalComponents: 0,
        implementedPages: 0,
        lastScanned: new Date().toISOString(),
        routeGroups: {},
        missingPages: []
    };

    try {
        // ספירת דפים
        const pages = findFiles(APP_DIR, 'page.tsx');
        stats.totalPages = pages.length;
        stats.implementedPages = pages.length;

        // ספירת קומפוננטים
        const components = findFiles(COMPONENTS_DIR, '.tsx');
        stats.totalComponents = components.length;

        // בדיקת Route Groups
        stats.routeGroups = analyzeRouteGroups();

        // חישוב דפים חסרים
        stats.missingPages = calculateMissingPages(stats.routeGroups);

        console.log(`✅ נמצאו ${stats.totalPages} דפים ו-${stats.totalComponents} קומפוננטים`);
        
        return stats;
    } catch (error) {
        console.error('❌ שגיאה בסריקת מערכת הקבצים:', error.message);
        return null;
    }
}

/**
 * מוצא קבצים לפי דפוס
 */
function findFiles(dir, pattern) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
        return files;
    }
    
    function scan(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);
            
            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scan(fullPath);
                } else if (stat.isFile() && item.includes(pattern)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // שקט אם אין הרשאות לתיקייה
        }
    }
    
    scan(dir);
    return files;
}

/**
 * מנתח Route Groups
 */
function analyzeRouteGroups() {
    const groups = {};
    const routeGroupDirs = [
        '(public)', '(auth)', '(dashboard)', 
        '(academy)', '(trust)', '(enterprise)'
    ];
    
    for (const groupName of routeGroupDirs) {
        const groupDir = path.join(APP_DIR, groupName);
        if (fs.existsSync(groupDir)) {
            groups[groupName] = {
                exists: true,
                routes: analyzeGroupRoutes(groupDir),
                lastModified: fs.statSync(groupDir).mtime.toISOString()
            };
        } else {
            groups[groupName] = {
                exists: false,
                routes: {},
                lastModified: null
            };
        }
    }
    
    return groups;
}

/**
 * מנתח routes בתוך group
 */
function analyzeGroupRoutes(groupDir) {
    const routes = {};
    
    function scanRoutes(currentDir, routePath = '') {
        try {
            const items = fs.readdirSync(currentDir);
            
            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !item.startsWith('.')) {
                    const newRoutePath = routePath + '/' + item;
                    scanRoutes(fullPath, newRoutePath);
                } else if (item === 'page.tsx') {
                    routes[routePath || '/'] = {
                        implemented: true,
                        lastModified: stat.mtime.toISOString(),
                        filePath: fullPath
                    };
                }
            }
        } catch (error) {
            // שקט
        }
    }
    
    scanRoutes(groupDir);
    return routes;
}

/**
 * מחשב דפים חסרים בהתבסס על Agent Prompts
 */
function calculateMissingPages(routeGroups) {
    const missingPages = [];
    
    // דפים קריטיים שצריכים להיות
    const criticalPages = [
        { path: '/dashboard', group: '(dashboard)', priority: 'critical' },
        { path: '/playbooks', group: '(public)', priority: 'high' },
        { path: '/academy', group: '(academy)', priority: 'medium' },
        { path: '/enterprise', group: '(enterprise)', priority: 'medium' }
    ];
    
    for (const page of criticalPages) {
        const group = routeGroups[page.group];
        if (!group || !group.routes[page.path]) {
            missingPages.push({
                page: page.path,
                priority: page.priority,
                reason: `דף ${page.path} לא קיים ב-${page.group}`
            });
        }
    }
    
    return missingPages;
}

/**
 * עדכון קובץ ה-JSON
 */
function updateJsonFile(stats) {
    try {
        let projectData = {};
        
        if (fs.existsSync(JSON_FILE)) {
            projectData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
        }
        
        // עדכון נתונים
        projectData.projectInfo = {
            ...projectData.projectInfo,
            lastUpdated: stats.lastScanned,
            stats: {
                totalPages: stats.totalPages,
                totalComponents: stats.totalComponents,
                routeGroups: Object.keys(stats.routeGroups).length,
                implementationProgress: Math.round((stats.implementedPages / 48) * 100) + '%'
            }
        };
        
        projectData.missingPages = stats.missingPages;
        
        fs.writeFileSync(JSON_FILE, JSON.stringify(projectData, null, 2));
        console.log('✅ קובץ JSON עודכן');
        
        return true;
    } catch (error) {
        console.error('❌ שגיאה בעדכון קובץ JSON:', error.message);
        return false;
    }
}

/**
 * עדכון נתונים בקובץ HTML
 */
function updateHtmlFile(stats) {
    try {
        if (!fs.existsSync(HTML_FILE)) {
            console.log('⚠️ קובץ HTML לא נמצא');
            return false;
        }
        
        let htmlContent = fs.readFileSync(HTML_FILE, 'utf8');
        
        // עדכון זמן אחרון
        const now = new Date().toLocaleString('he-IL');
        htmlContent = htmlContent.replace(
            /עודכן לאחרונה: <span id="lastUpdate">.*?<\/span>/,
            `עודכן לאחרונה: <span id="lastUpdate">${now}</span>`
        );
        
        // עדכון סטטיסטיקות
        htmlContent = htmlContent.replace(
            /<div class="stat-value" id="totalPages">\d+<\/div>/,
            `<div class="stat-value" id="totalPages">${stats.totalPages}</div>`
        );
        
        htmlContent = htmlContent.replace(
            /<div class="stat-value" id="totalComponents">\d+<\/div>/,
            `<div class="stat-value" id="totalComponents">${stats.totalComponents}</div>`
        );
        
        htmlContent = htmlContent.replace(
            /<div class="stat-value" id="missingPages">\d+<\/div>/,
            `<div class="stat-value" id="missingPages">${stats.missingPages.length}</div>`
        );
        
        fs.writeFileSync(HTML_FILE, htmlContent);
        console.log('✅ קובץ HTML עודכן');
        
        return true;
    } catch (error) {
        console.error('❌ שגיאה בעדכון קובץ HTML:', error.message);
        return false;
    }
}

/**
 * פונקציה ראשית
 */
function main() {
    console.log('🚀 מתחיל סינכרון נתוני פרויקט Lions of Zion...\n');
    
    const stats = scanFileSystem();
    if (!stats) {
        console.error('❌ הסריקה נכשלה');
        process.exit(1);
    }
    
    console.log('\n📊 סטטיסטיקות:');
    console.log(`   דפים: ${stats.totalPages}`);
    console.log(`   קומפוננטים: ${stats.totalComponents}`);
    console.log(`   דפים חסרים: ${stats.missingPages.length}`);
    
    console.log('\n🔄 מעדכן קבצים...');
    
    const jsonSuccess = updateJsonFile(stats);
    const htmlSuccess = updateHtmlFile(stats);
    
    if (jsonSuccess && htmlSuccess) {
        console.log('\n✅ הסינכרון הושלם בהצלחה!');
        console.log(`📁 פתח את ${HTML_FILE} כדי לראות את התוצאות`);
    } else {
        console.log('\n⚠️ הסינכרון הושלם עם שגיאות');
        process.exit(1);
    }
}

// הרצת הסקריפט אם זה המודול הראשי
if (require.main === module) {
    main();
}

module.exports = {
    scanFileSystem,
    updateJsonFile,
    updateHtmlFile
};