#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 path/to/LIONSPACE_SUPER_MASTER_DOCUMENT.html" >&2
  exit 1
fi

HTML_PATH="$1"
PDF_PATH="${HTML_PATH%.html}.pdf"

if command -v wkhtmltopdf >/dev/null 2>&1; then
  echo "[export_pdf] Using wkhtmltopdf"
  wkhtmltopdf "$HTML_PATH" "$PDF_PATH"
  echo "[export_pdf] Wrote $PDF_PATH"
  exit 0
fi

echo "[export_pdf] Using Playwright via npx"
npx -y -p playwright node -e '
  const { chromium } = require("playwright");
  (async () => {
    const html = process.argv[1];
    const pdf = process.argv[2];
    const b = await chromium.launch();
    const p = await b.newPage();
    await p.goto("file://" + require("path").resolve(html), { waitUntil: "networkidle" });
    await p.pdf({ path: pdf, printBackground: true, margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" } });
    await b.close();
  })();
' "$HTML_PATH" "$PDF_PATH"
echo "[export_pdf] Wrote $PDF_PATH"
exit 0
