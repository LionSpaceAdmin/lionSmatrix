# LIONSPACE — SUPER MASTER

This folder contains the unified Super Master Document in HTML, Markdown, and optionally PDF, plus internal QA JSONs.

## Build

- Dry run (no purge):

```
cd /Users/daniel/modern-nextjs-app
python3 ap/tools/build_super_master.py --root . --out docs/SUPER_MASTER \
  --validate --plan --engine playwright --min-similarity 0.85 --no-pdf
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
 - docs/SUPER_MASTER/_validation-report.json
 - docs/SUPER_MASTER/_purge-plan.json (when using --plan)

## Safety

- Secrets are redacted in outputs; raw `.env*` and keys remain untouched.
- Purge removes only ingested sources and only when explicitly confirmed.

## Advanced flags

- `--plan`: יוצר תוכנית מחיקה בטוחה (`_purge-plan.json`) ללא מחיקה בפועל.
- `--validate`: מפיק דוח `_validation-report.json` לשערי קבלה.
- `--rules ap/tools/classifier_rules.yaml`: כללי סיווג נתנים לעריכה.
- `--min-similarity 0.85`: סף דמיון לדדופ.
- `--engine playwright|wkhtmltopdf`: מנוע יצוא PDF.
- `--no-pdf`: דילוג על יצוא PDF להאצת ריצה.
- `--no-provenance`: השמטת מגירת פרובננס מה-HTML.
- `--open-chapters 1,5,9`: פתיחת פרקים כברירת מחדל.
- `--protect-from ap/tools/protect_patterns.yaml`: הרחבת הגנות למחיקה.
