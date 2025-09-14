#!/usr/bin/env node

/**
 * Structure Validation Script
 * Validates the monorepo structure matches the architecture
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_STRUCTURE = {
  // Root directories
  'apps': 'directory',
  'packages': 'directory',
  'services': 'directory',
  'contracts': 'directory',
  'infrastructure': 'directory',
  'docs': 'directory',
  'scripts': 'directory',
  
  // Config files
  'package.json': 'file',
  'turbo.json': 'file',
  'pnpm-workspace.yaml': 'file',
  'tsconfig.json': 'file',
  
  // Apps
  'apps/web': 'directory',
  'apps/mobile': 'directory',
  'apps/extension': 'directory',
  'apps/admin': 'directory',
  
  // Web app structure
  'apps/web/app': 'directory',
  'apps/web/components': 'directory',
  'apps/web/lib': 'directory',
  'apps/web/public': 'directory',
  
  // Route groups
  'apps/web/app/(public)': 'directory',
  'apps/web/app/(auth)': 'directory',
  'apps/web/app/(dashboard)': 'directory',
  'apps/web/app/(enterprise)': 'directory',
  'apps/web/app/(academy)': 'directory',
  'apps/web/app/(trust)': 'directory',
  'apps/web/app/api': 'directory',
  
  // Packages
  'packages/@lionspace/core': 'directory',
  'packages/@lionspace/ai': 'directory',
  'packages/@lionspace/ui': 'directory',
  'packages/@lionspace/social': 'directory',
  'packages/@lionspace/provenance': 'directory',
  'packages/@lionspace/policy': 'directory',
  'packages/@lionspace/sdk-js': 'directory',
  
  // Services
  'services/analyzer': 'directory',
  'services/stream-processor': 'directory',
  'services/evidence-chain': 'directory',
  'services/notifier': 'directory',
  'services/social-relay': 'directory',
  
  // Contracts
  'contracts/proto': 'directory',
  'contracts/openapi': 'directory',
  'contracts/jsonschema': 'directory',
  'contracts/graphql': 'directory',
  
  // Infrastructure
  'infrastructure/terraform': 'directory',
  'infrastructure/k8s': 'directory',
  'infrastructure/monitoring': 'directory',
};

function validateStructure() {
  console.log('🔍 Validating monorepo structure...\n');
  
  let errors = [];
  let warnings = [];
  let success = [];
  
  for (const [relativePath, expectedType] of Object.entries(REQUIRED_STRUCTURE)) {
    const fullPath = path.join(process.cwd(), relativePath);
    
    try {
      const stats = fs.statSync(fullPath);
      
      if (expectedType === 'directory' && stats.isDirectory()) {
        success.push(`✅ ${relativePath}`);
      } else if (expectedType === 'file' && stats.isFile()) {
        success.push(`✅ ${relativePath}`);
      } else {
        errors.push(`❌ ${relativePath} - Wrong type (expected ${expectedType})`);
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        errors.push(`❌ ${relativePath} - Missing`);
      } else {
        warnings.push(`⚠️ ${relativePath} - ${err.message}`);
      }
    }
  }
  
  // Check for unwanted files in root
  const rootFiles = fs.readdirSync(process.cwd());
  const allowedRootItems = [
    'apps', 'packages', 'services', 'contracts', 'infrastructure',
    'docs', 'scripts', 'keys', 'node_modules', '.git', '.github',
    '.vscode', '.devcontainer', '.next', 'test.backup',
    // Config files
    'package.json', 'turbo.json', 'pnpm-workspace.yaml', 'tsconfig.json',
    'README.md', 'LICENSE', '.gitignore', '.prettierrc',
    // Allowed root files
    'CLAUDE.md', 'MIGRATION_PLAN.md', 'IMPLEMENTATION_PLAN.md',
    'STRUCTURE_AUDIT.md', 'STRUCTURE_STATUS.md', 'README_STRUCTURE.md',
    // Hidden files
    '.DS_Store', '.env', '.env.local', '.env.example'
  ];
  
  rootFiles.forEach(item => {
    if (!allowedRootItems.some(allowed => 
      item === allowed || 
      item.startsWith('.claude') || 
      item.endsWith('.md') ||
      item.endsWith('.json') ||
      item.endsWith('.yaml') ||
      item.endsWith('.yml') ||
      item.endsWith('.js') ||
      item.endsWith('.ts') ||
      item.endsWith('.mjs') ||
      item.endsWith('.rc') ||
      item.endsWith('.config.js')
    )) {
      warnings.push(`⚠️ Unexpected in root: ${item}`);
    }
  });
  
  // Print results
  console.log('📊 Validation Results:\n');
  console.log(`✅ Success: ${success.length} items`);
  console.log(`❌ Errors: ${errors.length} items`);
  console.log(`⚠️ Warnings: ${warnings.length} items\n`);
  
  if (errors.length > 0) {
    console.log('❌ Errors found:\n');
    errors.forEach(err => console.log(`  ${err}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️ Warnings:\n');
    warnings.forEach(warn => console.log(`  ${warn}`));
    console.log('');
  }
  
  if (errors.length === 0) {
    console.log('✅ Structure validation PASSED! 🎉\n');
    return 0;
  } else {
    console.log('❌ Structure validation FAILED!\n');
    console.log('Fix the errors above and run validation again.\n');
    return 1;
  }
}

// Run validation
const exitCode = validateStructure();
process.exit(exitCode);
