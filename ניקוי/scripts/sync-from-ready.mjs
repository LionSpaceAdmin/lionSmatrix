#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'

const SRC_ROOT = '/Users/davidlions/Desktop/lionspace-ready'
const SRC = path.join(SRC_ROOT, 'src')
const DST = '/Users/davidlions/Desktop/lionspace-merged'

const SRC_SUBDIRS = ['app', 'components', 'contexts', 'lib', 'types', 'styles']
const ROOT_DIRS = ['public', 'assets']

const EXCLUDES = new Set(['.DS_Store', '.next', 'node_modules'])

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function copyFile(src, dst) {
  await ensureDir(path.dirname(dst))
  await fs.copyFile(src, dst)
}

async function copyDir(srcDir, dstDir) {
  await ensureDir(dstDir)
  const entries = await fs.readdir(srcDir, { withFileTypes: true })
  for (const e of entries) {
    if (EXCLUDES.has(e.name)) continue
    const s = path.join(srcDir, e.name)
    const d = path.join(dstDir, e.name)
    if (e.isDirectory()) {
      await copyDir(s, d)
    } else if (e.isFile()) {
      await copyFile(s, d)
    } // ignore symlinks and others
  }
}

async function maybeCopyDir(srcDir, dstDir, label) {
  try {
    const stat = await fs.stat(srcDir)
    if (!stat.isDirectory()) return console.log(`- skip ${label}: not a dir`)
    console.log(`- syncing ${label}`)
    await copyDir(srcDir, dstDir)
  } catch (e) {
    if (e && e.code === 'ENOENT') {
      console.log(`- skip ${label}: not found`)
    } else {
      console.error(`- error copying ${label}:`, e)
      throw e
    }
  }
}

async function main() {
  console.log('Sync from:', SRC)
  // src subdirs
  for (const d of SRC_SUBDIRS) {
    await maybeCopyDir(path.join(SRC, d), path.join(DST, d), `src/${d}`)
  }
  // root public/assets
  for (const d of ROOT_DIRS) {
    await maybeCopyDir(path.join(SRC_ROOT, d), path.join(DST, d), d)
  }
  console.log('Sync complete.')
}

main().catch((e) => {
  console.error('Sync failed:', e)
  process.exit(1)
})
