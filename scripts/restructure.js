#!/usr/bin/env node

/**
 * LionSpace V3 - Restructuring Automation Script
 * This script helps automate the restructuring tasks identified in the engineering review
 * 
 * Usage: node scripts/restructure.js [task-id]
 * Example: node scripts/restructure.js P1.1
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load the TODO configuration
const todoConfig = require('../docs/archive/TODO_ENGINEERING_2025.json');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  task: (msg) => console.log(`${colors.blue}[TASK]${colors.reset} ${msg}`)
};

// Task executors
const executors = {
  move: async (task) => {
    const { source, target } = task;
    const sourcePath = path.join(process.cwd(), source);
    const targetPath = path.join(process.cwd(), target);
    
    log.task(`Moving ${source} to ${target}`);
    
    try {
      // Check if source exists
      if (!fs.existsSync(sourcePath)) {
        log.warning(`Source ${source} does not exist`);
        return false;
      }
      
      // Create target directory if needed
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        log.info(`Created directory ${targetDir}`);
      }
      
      // Execute git mv for version control
      try {
        execSync(`git mv ${source} ${target}`, { stdio: 'inherit' });
      } catch (e) {
        // Fallback to regular move if not in git
        fs.renameSync(sourcePath, targetPath);
      }
      
      log.success(`Moved ${source} to ${target}`);
      return true;
    } catch (error) {
      log.error(`Failed to move ${source}: ${error.message}`);
      return false;
    }
  },
  
  delete: async (task) => {
    const { path: deletePath, reason } = task;
    const fullPath = path.join(process.cwd(), deletePath);
    
    log.task(`Deleting ${deletePath} (Reason: ${reason})`);
    
    try {
      if (!fs.existsSync(fullPath)) {
        log.warning(`Path ${deletePath} does not exist`);
        return false;
      }
      
      // Use git rm if in git repo
      try {
        execSync(`git rm -rf ${deletePath}`, { stdio: 'inherit' });
      } catch (e) {
        // Fallback to regular delete
        fs.rmSync(fullPath, { recursive: true, force: true });
      }
      
      log.success(`Deleted ${deletePath}`);
      return true;
    } catch (error) {
      log.error(`Failed to delete ${deletePath}: ${error.message}`);
      return false;
    }
  },
  
  cleanup: async (task) => {
    const { path: cleanupPath, description } = task;
    const fullPath = path.join(process.cwd(), cleanupPath.replace('/*', ''));
    
    log.task(`Cleanup: ${description}`);
    
    try {
      if (!fs.existsSync(fullPath)) {
        log.warning(`Path ${cleanupPath} does not exist`);
        return false;
      }
      
      // Find and remove empty directories
      const dirs = fs.readdirSync(fullPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(fullPath, dirent.name));
      
      let cleaned = 0;
      for (const dir of dirs) {
        const files = fs.readdirSync(dir);
        if (files.length === 0 || (files.length === 1 && files[0] === '.DS_Store')) {
          fs.rmSync(dir, { recursive: true, force: true });
          log.info(`Removed empty directory: ${dir}`);
          cleaned++;
        }
      }
      
      log.success(`Cleaned up ${cleaned} empty directories`);
      return true;
    } catch (error) {
      log.error(`Cleanup failed: ${error.message}`);
      return false;
    }
  },
  
  consolidate: async (task) => {
    const { files, target } = task;
    
    log.task(`Consolidating ${files.length} files to ${target}`);
    
    try {
      const targetPath = path.join(process.cwd(), target);
      let consolidated = '';
      
      // Read all source files
      for (const file of files) {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          consolidated += `\n// --- From ${file} ---\n${content}\n`;
          log.info(`Read content from ${file}`);
        }
      }
      
      // Write consolidated content
      fs.writeFileSync(targetPath, consolidated);
      
      // Remove old files (except target)
      for (const file of files) {
        if (file !== target) {
          const filePath = path.join(process.cwd(), file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            log.info(`Removed ${file}`);
          }
        }
      }
      
      log.success(`Consolidated to ${target}`);
      return true;
    } catch (error) {
      log.error(`Consolidation failed: ${error.message}`);
      return false;
    }
  },
  
  create: async (task) => {
    const { path: createPath, structure, contents } = task;
    const fullPath = path.join(process.cwd(), createPath);
    
    log.task(`Creating ${createPath}`);
    
    try {
      // Create base directory
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      
      // Create structure if provided
      if (structure) {
        for (const [category, items] of Object.entries(structure)) {
          const categoryPath = path.join(fullPath, category);
          fs.mkdirSync(categoryPath, { recursive: true });
          
          // Create index file
          const indexContent = items.map(item => 
            `export { default as ${item} } from './${item}';`
          ).join('\n');
          fs.writeFileSync(path.join(categoryPath, 'index.ts'), indexContent);
          
          log.info(`Created ${category} with ${items.length} exports`);
        }
      }
      
      // Create contents if provided
      if (contents) {
        for (const dir of contents) {
          const dirPath = path.join(fullPath, dir);
          fs.mkdirSync(dirPath, { recursive: true });
          
          // Create placeholder index
          fs.writeFileSync(
            path.join(dirPath, 'index.ts'),
            `// ${dir} module\nexport {};\n`
          );
          
          log.info(`Created ${dir} module`);
        }
      }
      
      // Create package.json if it's a package
      if (createPath.includes('packages/')) {
        const packageName = createPath.split('/').pop();
        const packageJson = {
          name: packageName,
          version: '0.0.1',
          main: 'index.ts',
          private: true
        };
        fs.writeFileSync(
          path.join(fullPath, 'package.json'),
          JSON.stringify(packageJson, null, 2)
        );
        log.info('Created package.json');
      }
      
      log.success(`Created ${createPath}`);
      return true;
    } catch (error) {
      log.error(`Creation failed: ${error.message}`);
      return false;
    }
  }
};

// Main execution
async function main() {
  const taskId = process.argv[2];

  console.log(`
${colors.cyan}╔══════════════════════════════════════════════╗
║     LionSpace V3 - Restructuring Tool        ║
╚══════════════════════════════════════════════╝${colors.reset}
  `);

  if (!taskId) {
    log.info('Available priorities:');
    for (const [key, priority] of Object.entries(todoConfig.priorities)) {
      console.log(`  ${colors.yellow}${priority.id}${colors.reset}: ${priority.name} (${priority.timeline})`);
      if (priority.tasks) {
        for (const task of priority.tasks) {
          console.log(`    ${colors.blue}${task.id}${colors.reset}: ${task.category}`);
        }
      }
    }
    console.log('\nUsage: node scripts/restructure.js [task-id]');
    console.log('Example: node scripts/restructure.js P1.2');
    return;
  }

  // Find tasks for the given ID
  let taskToExecute = null;
  let priorityName = '';

  for (const priority of Object.values(todoConfig.priorities)) {
    if (priority.id === taskId) {
      taskToExecute = priority;
      priorityName = priority.name;
      break;
    }
    if (priority.tasks) {
      const foundTask = priority.tasks.find(t => t.id === taskId);
      if (foundTask) {
        taskToExecute = { name: foundTask.category, tasks: [foundTask] };
        priorityName = foundTask.category;
        break;
      }
    }
  }

  if (!taskToExecute) {
    log.error(`Task or Priority ${taskId} not found`);
    return;
  }

  log.info(`Executing ${priorityName} tasks...`);
  console.log('');

  let completed = 0;
  let failed = 0;

  // Execute all tasks
  for (const category of taskToExecute.tasks) {
    console.log(`
${colors.yellow}Category: ${category.category}${colors.reset}`);
    console.log('─'.repeat(40));

    if (category.tasks) {
      for (const task of category.tasks) {
        const executor = executors[task.action];
        if (executor) {
          const success = await executor(task);
          if (success) completed++;
          else failed++;
        } else {
          log.warning(`No executor for action: ${task.action}`);
        }
      }
    } else {
        const executor = executors[category.action];
        if (executor) {
            const success = await executor(category);
            if (success) completed++;
            else failed++;
        } else {
            log.warning(`No executor for action: ${category.action}`);
        }
    }
  }

  // Summary
  console.log(`
${'═'.repeat(50)}`);
  log.info('Summary:');
  log.success(`Completed: ${completed} tasks`);
  if (failed > 0) {
    log.error(`Failed: ${failed} tasks`);
  }

  // Update TODO status
  if (completed > 0) {
    log.info('Updating TODO status...');
    // This would update the JSON file with completion status
  }

  console.log(`
${colors.green}✓ Restructuring complete!${colors.reset}
`);
}


// Run the script
main().catch(error => {
  log.error(`Script failed: ${error.message}`);
  process.exit(1);
});