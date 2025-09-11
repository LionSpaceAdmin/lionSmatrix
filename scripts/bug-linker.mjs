#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

function findLatestReport() {
  const dir = path.join(process.cwd(), "visual-reports")
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir).filter((f) => f.startsWith("report-") && f.endsWith(".json"))
  if (!files.length) return null
  files.sort()
  return path.join(dir, files[files.length - 1])
}
function loadReport(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"))
  } catch {
    return null
  }
}
function ensureLogHeader(logPath) {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(
      logPath,
      "# BUG LOG\n\n| Timestamp | Category | Status | Details | Evidence |\n|-----------|----------|--------|---------|----------|\n"
    )
  }
}
function appendEntries(report, reportPath) {
  const logPath = path.join(process.cwd(), "BUG_LOG.md")
  ensureLogHeader(logPath)
  const relReport = path.relative(process.cwd(), reportPath)
  const timestamp = report.timestamp
  const lines = []
  ;(report.results || []).forEach((r) => {
    const status = r.passed === false ? "FAIL" : "OK"
    const detail = r.violations ? `${r.violations.length} a11y issues` : ""
    let evidence = ""
    if (r.data && Array.isArray(r.data) && r.data.length) {
      evidence = r.data.length === 1 ? r.data[0].path : `${r.data.length} screenshots`
    }
    lines.push(`| ${timestamp} | ${r.test} | ${status} | ${detail} | ${evidence} |`)
  })
  fs.appendFileSync(logPath, lines.join("\n") + "\n")
  const pointerPath = path.join(process.cwd(), "LATEST_BUG")
  const failing = (report.results || []).filter((r) => r.passed === false)
  let pointerContent = `LAST_REPORT=${relReport}\n`
  pointerContent += `FAILING_CATEGORIES=${failing.length ? failing.map((f) => f.test).join(",") : ""}\n`
  fs.writeFileSync(pointerPath, pointerContent)
  return { logPath, pointerPath }
}
export function main() {
  const latest = findLatestReport()
  if (!latest) {
    console.log("[bug-linker] No report files found. Skipping.")
    return
  }
  const report = loadReport(latest)
  if (!report) {
    console.log("[bug-linker] Failed to parse latest report.")
    return
  }
  const { logPath, pointerPath } = appendEntries(report, latest)
  console.log(`[bug-linker] Updated ${logPath} (pointer: ${pointerPath})`)
}
if (process.argv[1] && process.argv[1].endsWith("bug-linker.mjs")) {
  main()
}
