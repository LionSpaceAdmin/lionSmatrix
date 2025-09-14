#!/usr/bin/env node

/**
 * LionSpace Agent Orchestrator
 * מנהל אוטומציה למערכת הסוכנים של LionSpace V3
 * 
 * שימושים:
 * - node scripts/agent-orchestrator.js --workflow ui-implementation --component "ProductCard"
 * - node scripts/agent-orchestrator.js --agent frontend-developer --task "Create navigation"
 * - node scripts/agent-orchestrator.js --collaborate agent1,agent2,agent3 --task "Build feature"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// קריאת קונפיגורציית הסוכנים
const AGENTS_CONFIG_PATH = path.join(process.env.HOME, '.claude', 'agents-config.json');
let agentsConfig;

try {
  agentsConfig = JSON.parse(fs.readFileSync(AGENTS_CONFIG_PATH, 'utf8'));
} catch (error) {
  console.error('❌ שגיאה בקריאת קונפיגורציית הסוכנים:', error.message);
  console.error('וודא שקובץ ~/.claude/agents-config.json קיים ותקין');
  process.exit(1);
}

// פרסור ארגומנטים
const args = process.argv.slice(2);
const command = parseArguments(args);

// הפעלת הפקודה המתאימה
async function main() {
  try {
    console.log(`🚀 מתחיל ביצוע פקודה: ${command.type}`);
    
    switch (command.type) {
      case 'workflow':
        await executeWorkflow(command);
        break;
      case 'agent':
        await executeSingleAgent(command);
        break;
      case 'collaborate':
        await executeCollaboration(command);
        break;
      case 'handoff':
        await executeHandoff(command);
        break;
      case 'status':
        await showStatus(command);
        break;
      case 'help':
        showHelp();
        break;
      default:
        console.error('❌ פקודה לא מזוהה. השתמש ב---help לעזרה');
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ שגיאה בביצוע: ${error.message}`);
    process.exit(1);
  }
}

// פרסור ארגומנטים מהשורה הפקודה
function parseArguments(args) {
  const command = { type: null, params: {} };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '--workflow':
        command.type = 'workflow';
        command.params.name = nextArg;
        i++;
        break;
      case '--agent':
        command.type = 'agent';
        command.params.name = nextArg;
        i++;
        break;
      case '--collaborate':
        command.type = 'collaborate';
        command.params.agents = nextArg.split(',');
        i++;
        break;
      case '--handoff':
        command.type = 'handoff';
        break;
      case '--from':
        command.params.from = nextArg;
        i++;
        break;
      case '--to':
        command.params.to = nextArg;
        i++;
        break;
      case '--task':
        command.params.task = nextArg;
        i++;
        break;
      case '--component':
        command.params.component = nextArg;
        i++;
        break;
      case '--feature':
        command.params.feature = nextArg;
        i++;
        break;
      case '--target':
        command.params.target = nextArg;
        i++;
        break;
      case '--scope':
        command.params.scope = nextArg;
        i++;
        break;
      case '--status':
        command.type = 'status';
        break;
      case '--category':
        command.params.category = nextArg;
        i++;
        break;
      case '--all':
        command.params.all = true;
        break;
      case '--help':
      case '-h':
        command.type = 'help';
        break;
    }
  }
  
  return command;
}

// ביצוע זרימת עבודה
async function executeWorkflow(command) {
  const { name, component, feature, target, scope } = command.params;
  
  if (!agentsConfig.workflows[name]) {
    throw new Error(`זרימת עבודה '${name}' לא נמצאה בקונפיגורציה`);
  }
  
  const workflow = agentsConfig.workflows[name];
  console.log(`📋 מבצע זרימת עבודה: ${workflow.description}`);
  console.log(`🤖 סוכנים מעורבים: ${workflow.agents.join(', ')}`);
  
  const startTime = Date.now();
  let results = [];
  
  switch (workflow.sequence) {
    case 'sequential':
      results = await executeSequential(workflow.agents, command.params);
      break;
    case 'parallel':
      results = await executeParallel(workflow.agents, command.params);
      break;
    case 'collaborative':
      results = await executeCollaborative(workflow.agents, command.params);
      break;
    default:
      throw new Error(`סוג זרימה לא נתמך: ${workflow.sequence}`);
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000);
  
  console.log(`\n✅ זרימת העבודה הושלמה בהצלחה!`);
  console.log(`⏱️  זמן ביצוע: ${duration} שניות`);
  console.log(`📊 תוצאות: ${results.length} משימות הושלמו`);
  
  // שמירת דוח
  await saveWorkflowReport(name, results, duration);
}

// ביצוע סוכן יחיד
async function executeSingleAgent(command) {
  const { name, task } = command.params;
  
  if (!isValidAgent(name)) {
    throw new Error(`סוכן '${name}' לא קיים במערכת`);
  }
  
  console.log(`🤖 מפעיל סוכן: ${name}`);
  console.log(`📝 משימה: ${task}`);
  
  const result = await runAgent(name, task);
  
  console.log(`✅ סוכן ${name} סיים בהצלחה`);
  console.log(`📋 תוצרים: ${result.deliverables.join(', ')}`);
  
  return result;
}

// ביצוע עבודה משותפת
async function executeCollaboration(command) {
  const { agents, task } = command.params;
  
  // ולידציה של הסוכנים
  for (const agent of agents) {
    if (!isValidAgent(agent)) {
      throw new Error(`סוכן '${agent}' לא קיים במערכת`);
    }
  }
  
  console.log(`🤝 מתחיל עבודה משותפת`);
  console.log(`🤖 סוכנים: ${agents.join(', ')}`);
  console.log(`📝 משימה: ${task}`);
  
  // יצירת workspace משותף
  const workspaceId = generateWorkspaceId();
  
  // הפעלת הסוכנים במקביל
  const promises = agents.map(agent => 
    runAgentInWorkspace(agent, task, workspaceId)
  );
  
  const results = await Promise.all(promises);
  
  console.log(`✅ עבודה משותפת הושלמה בהצלחה!`);
  console.log(`📁 Workspace: ${workspaceId}`);
  
  return results;
}

// ביצוע העברה בין סוכנים
async function executeHandoff(command) {
  const { from, to, task } = command.params;
  
  if (!isValidAgent(from) || !isValidAgent(to)) {
    throw new Error('סוכן מקור או יעד לא קיים במערכת');
  }
  
  console.log(`🔄 מעביר משימה בין סוכנים`);
  console.log(`📤 מ: ${from}`);
  console.log(`📥 אל: ${to}`);
  console.log(`📝 משימה: ${task}`);
  
  // ביצוע המשימה עם הסוכן הראשון
  const fromResult = await runAgent(from, task);
  
  // העברת התוצאות לסוכן השני
  const handoffData = {
    from: from,
    to: to,
    task: task,
    context: fromResult.context,
    deliverables: fromResult.deliverables,
    requirements: fromResult.requirements || []
  };
  
  const toResult = await runAgentWithHandoff(to, handoffData);
  
  console.log(`✅ העברה הושלמה בהצלחה!`);
  
  return { fromResult, toResult, handoffData };
}

// הצגת סטטוס
async function showStatus(command) {
  const { category, all } = command.params;
  
  console.log(`📊 סטטוס מערכת הסוכנים\n`);
  
  if (all) {
    // הצגת כל הקטגוריות
    for (const [catName, catData] of Object.entries(agentsConfig.categories)) {
      console.log(`📁 ${catData.name} (${catData.priority} priority)`);
      console.log(`   סוכנים: ${catData.agents.length}`);
      console.log(`   רשימה: ${catData.agents.join(', ')}\n`);
    }
  } else if (category) {
    // הצגת קטגוריה ספציפית
    const catData = agentsConfig.categories[category];
    if (!catData) {
      throw new Error(`קטגוריה '${category}' לא נמצאה`);
    }
    
    console.log(`📁 ${catData.name}`);
    console.log(`📋 תיאור: ${catData.description}`);
    console.log(`🎯 עדיפות: ${catData.priority}`);
    console.log(`🤖 סוכנים (${catData.agents.length}):`);
    
    for (const agent of catData.agents) {
      console.log(`   ✓ ${agent}`);
    }
  } else {
    // הצגת סטטוס כללי
    const totalAgents = Object.values(agentsConfig.categories)
      .reduce((sum, cat) => sum + cat.agents.length, 0);
    
    console.log(`🤖 סך הכל סוכנים: ${totalAgents}`);
    console.log(`📁 קטגוריות: ${Object.keys(agentsConfig.categories).length}`);
    console.log(`🔄 זרימות עבודה: ${Object.keys(agentsConfig.workflows).length}`);
    console.log(`🎯 סוכנים פעילים: ${agentsConfig.activeAgents.primary.length + agentsConfig.activeAgents.secondary.length}`);
  }
}

// הצגת עזרה
function showHelp() {
  console.log(`
🤖 LionSpace Agent Orchestrator - מנהל אוטומציה לסוכנים

שימוש:
  node scripts/agent-orchestrator.js [פקודה] [פרמטרים]

פקודות:

📋 זרימות עבודה:
  --workflow <name>             הפעלת זרימת עבודה
  --component <name>            שם הרכיב (עבור ui-implementation)
  --feature <name>              שם הפיצ'ר (עבור fullstack-development)
  --target <path>               מיקום יעד (עבור performance-optimization)
  --scope <scope>               טווח הפעולה

🤖 סוכן יחיד:
  --agent <name>                הפעלת סוכן ספציפי
  --task <description>          תיאור המשימה

🤝 עבודה משותפת:
  --collaborate <agent1,agent2>  עבודה משותפת של מספר סוכנים
  --task <description>          תיאור המשימה המשותפת

🔄 העברה בין סוכנים:
  --handoff                     העברת משימה בין סוכנים
  --from <agent>                סוכן מקור
  --to <agent>                  סוכן יעד
  --task <description>          תיאור המשימה

📊 סטטוס ומידע:
  --status                      הצגת סטטוס מערכת
  --category <name>             סטטוס קטגוריה ספציפית
  --all                         הצגת כל הקטגוריות

🆘 עזרה:
  --help, -h                    הצגת הודעה זו

דוגמאות:
  # יצירת רכיב UI חדש
  node scripts/agent-orchestrator.js --workflow ui-implementation --component "ProductCard"
  
  # פיתוח פיצ'ר מלא
  node scripts/agent-orchestrator.js --workflow fullstack-development --feature "user-auth"
  
  # הפעלת סוכן יחיד
  node scripts/agent-orchestrator.js --agent frontend-developer --task "Create responsive navigation"
  
  # עבודה משותפת
  node scripts/agent-orchestrator.js --collaborate frontend-developer,backend-architect --task "Build dashboard"
  
  # העברה בין סוכנים
  node scripts/agent-orchestrator.js --handoff --from ui-ux-designer --to frontend-developer --task "Implement design"
  
  # הצגת סטטוס
  node scripts/agent-orchestrator.js --status --category frontend
`);
}

// פונקציות עזר

async function executeSequential(agents, params) {
  const results = [];
  let context = params;
  
  for (const agent of agents) {
    console.log(`⏯️  מבצע: ${agent}`);
    const result = await runAgent(agent, context.task, context);
    results.push(result);
    context = { ...context, ...result.context };
  }
  
  return results;
}

async function executeParallel(agents, params) {
  console.log(`⚡ מבצע ${agents.length} סוכנים במקביל`);
  
  const promises = agents.map(agent => runAgent(agent, params.task, params));
  const results = await Promise.all(promises);
  
  return results;
}

async function executeCollaborative(agents, params) {
  console.log(`🤝 מבצע עבודה משותפת עם ${agents.length} סוכנים`);
  
  const workspaceId = generateWorkspaceId();
  const promises = agents.map(agent => 
    runAgentInWorkspace(agent, params.task, workspaceId)
  );
  
  const results = await Promise.all(promises);
  return results;
}

async function runAgent(agentName, task, context = {}) {
  // סימולציה של הפעלת סוכן
  // במימוש אמיתי כאן יהיה קול ל-Claude Code API
  
  console.log(`  🔄 ${agentName} מבצע: ${task}`);
  
  // סימולציה של זמן עבודה
  await sleep(Math.random() * 2000 + 1000);
  
  const result = {
    agent: agentName,
    task: task,
    status: 'completed',
    deliverables: [`${agentName}-output-${Date.now()}.md`],
    context: { ...context, lastAgent: agentName },
    timestamp: new Date().toISOString(),
    qualityScore: Math.floor(Math.random() * 3) + 8, // 8-10
  };
  
  console.log(`  ✅ ${agentName} סיים (ציון: ${result.qualityScore}/10)`);
  return result;
}

async function runAgentInWorkspace(agentName, task, workspaceId) {
  const result = await runAgent(agentName, task);
  result.workspaceId = workspaceId;
  return result;
}

async function runAgentWithHandoff(agentName, handoffData) {
  const task = `Continue from ${handoffData.from}: ${handoffData.task}`;
  const result = await runAgent(agentName, task, handoffData);
  result.handoffData = handoffData;
  return result;
}

function isValidAgent(agentName) {
  return Object.values(agentsConfig.categories)
    .some(category => category.agents.includes(agentName));
}

function generateWorkspaceId() {
  return `workspace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function saveWorkflowReport(workflowName, results, duration) {
  const report = {
    workflow: workflowName,
    timestamp: new Date().toISOString(),
    duration: duration,
    results: results,
    summary: {
      totalTasks: results.length,
      avgQualityScore: results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length,
      deliverables: results.flatMap(r => r.deliverables)
    }
  };
  
  const reportsDir = path.join(process.env.HOME, '.claude', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const reportPath = path.join(reportsDir, `workflow-${workflowName}-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📄 דוח נשמר: ${reportPath}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// הפעלה ראשית
if (require.main === module) {
  main().catch(error => {
    console.error('💥 שגיאה חמורה:', error.message);
    process.exit(1);
  });
}

module.exports = {
  executeWorkflow,
  executeSingleAgent,
  executeCollaboration,
  executeHandoff,
  showStatus
};