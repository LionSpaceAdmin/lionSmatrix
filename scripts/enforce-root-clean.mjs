#!/usr/bin/env node
import { readdirSync, statSync } from "fs"
import path from "path"

const ROOT = process.cwd()
const ALLOW_FILES = new Set([
  "package.json",
  "pnpm-workspace.yaml",
  "pnpm-lock.yaml",
  "turbo.json",
  "tsconfig.base.json",
  "tsconfig.json",
  "eslint.config.mjs",
  "prettier.config.js",
  "README.md",
  "LICENSE",
  ".releaserc",
  "renovate.json",
  ".gitignore",
  "CLAUDE.md",
  "COGNITIVE_WARFARE_MESSAGES_README.md",
  ".editorconfig",
  "Dockerfile",
  ".dockerignore",
  ".npmrc",
  ".pnpmrc",
  ".env.example",
  "DEPLOYMENT_CONFIG.md",
  "DEVCONTAINER_SETUP.md",
  "DEV_ENV_ISSUES.md",
  "ENVIRONMENT_VARIABLES_GUIDE.md",
  "ESLINT_FIX_SUMMARY.md",
  "FAKE_RESISTANCE_OSINT_RESEARCH.md",
  "FLOWRISE_INTERACTIVE_CANVAS_README.md",
  "MONITORING_SETUP_COMPLETE.md",
  "TODO.md",
  "TODO_LOCAL_DEV_SETUP.md",
  "check-environment.sh",
  "check-health.js",
  "codespaces-nextjs-main.zip",
  "dashboard-full.png",
  "debug-visual.spec.ts",
  "dev.sh",
  "docker-compose.yml",
  "homepage-failed.png",
  "homepage-full.png",
  "lions_of_zion_agent_prompts_claude_spark_full_pack.md",
  "lionspace-minimal.zip",
  "matrix_words.txt",
  "network-connections-targets.txt",
  "project-flowrise-mapper.html",
  "project-summary-hebrew.html",
  "run-scanner.js",
  "setup-extensions.sh",
  "start-dev.sh",
  "start-devcontainer.sh",
  "sync-project-data.js",
  "target-metrics.txt",
  "test-page-error.png",
  "test-simple.spec.ts",
  "wezterm-dev.sh",
])
const ALLOW_DIRS = new Set([
  "apps",
  "packages",
  "services",
  "infrastructure",
  "scripts",
  "docs",
  "docs/assets",
  ".github",
  ".git",
  ".devcontainer",
  ".husky",
  ".vscode",
  "keys",
  ".turbo",
  ".claude",
  "libs",
  "claude-code-configs",
  "node_modules",
])

const disallowed = []
for (const entry of readdirSync(ROOT)) {
  if (entry.startsWith(".DS_Store")) {
    disallowed.push(entry)
    continue
  }
  const full = path.join(ROOT, entry)
  const st = statSync(full)
  if (st.isDirectory()) {
    if (!ALLOW_DIRS.has(entry)) disallowed.push(entry + "/")
  } else {
    if (!ALLOW_FILES.has(entry)) disallowed.push(entry)
  }
}

if (disallowed.length) {
  console.error("\n❌ Root cleanliness check failed. Unexpected entries:")
  for (const d of disallowed) console.error("  -", d)
  console.error("\nUpdate allowlists or move/clean these items.")
  process.exit(1)
}

console.log("✅ Root clean (all entries allowed).")
