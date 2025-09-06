# LIONSPACE — SUPER MASTER

This folder contains the unified Super Master Document in HTML, Markdown, and optionally PDF, plus internal QA JSONs.

## Build

- Dry run (no purge):

```
cd /Users/daniel/modern-nextjs-app
python3 ap/tools/build_super_master.py --root . --out docs/SUPER_MASTER
```

- Archive + purge (explicit):

```
export CONFIRM_DELETION=YES
python3 ap/tools/build_super_master.py --root . --out docs/SUPER_MASTER --purge
```

- Export PDF (standalone):

```
bash ap/tools/export_pdf.sh docs/SUPER_MASTER/LIONSPACE_SUPER_MASTER_DOCUMENT.html
```

## Contents

- docs/SUPER_MASTER/LIONSPACE_SUPER_MASTER_DOCUMENT.html
- docs/SUPER_MASTER/LIONSPACE_SUPER_MASTER_DOCUMENT.md
- docs/SUPER_MASTER/LIONSPACE_SUPER_MASTER_DOCUMENT.pdf (if tool available)
- docs/SUPER_MASTER/_ingest-manifest.json
- docs/SUPER_MASTER/_dedupe-report.json
- docs/SUPER_MASTER/_conflicts-resolved.json
- docs/SUPER_MASTER/_provenance-map.json
- docs/SUPER_MASTER/_secrets-scan.json

## Safety

- Secrets are redacted in outputs; raw `.env*` and keys remain untouched.
- Purge removes only ingested sources and only when explicitly confirmed.
