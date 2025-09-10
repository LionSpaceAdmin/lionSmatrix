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
  ".editorconfig",
  "Dockerfile",
])
const ALLOW_DIRS = new Set([
  "apps",
  "packages",
  "services",
  "infrastructure",
  "scripts",
  "docs",
  ".github",
  ".devcontainer",
  ".husky",
  ".vscode",
  "keys",
  ".turbo",
  ".claude",
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
