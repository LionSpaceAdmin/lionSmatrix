#!/usr/bin/env python3
import os
import re
import json
import hashlib
import subprocess
from pathlib import Path
from datetime import datetime

HOME = Path('/Users/daniel')
PLAN_REPO_MD = HOME/'modern-nextjs-app'/'ap'/'docs'/'SUPER_MASTER'/'LIONSPACE_UNIFIED_MASTER_PLAN.md'
PLAN_ROOT_MD = HOME/'modern-nextjs-app'/'docs'/'SUPER_MASTER'/'LIONSPACE_UNIFIED_MASTER_PLAN.md'
INPUTS_DIR = HOME/'LionSpace_Master'/'archive'/'inputs'
BACKUP_DIR = HOME/'LionSpace_Master'/'backup'

SECTIONS = {
    1: '## 1) חזון ומטרות הפלטפורמה',
    2: '## 2) תחום וכיסוי (In‑Scope / Out‑of‑Scope)',
    3: '## 3) יכולות ליבה ו‑Use‑Cases',
    4: '## 4) ארכיטקטורה לוגית (ללא קוד)',
    5: '## 5) מודולים/שירותים ותפקידם (תיאורי)',
    6: '## 6) נתונים ושכבת אינטגרציה (בקצרה)',
    7: '## 7) אבטחה, הרשאות ומדיניות',
    8: '## 8) תפעול, ניטור ו‑SLO/KPIs',
    9: '## 9) מפת דרך מרוכזת (Roadmap)',
    10:'## 10) סיכוני מפתח והנחות עבודה',
    11:'## 11) מפת שמות מאוחדת (Alias Map)'
}

CLASS_RULES = [
    (3, r'(use[-\s]?cases|capabilit|תבנית|פרומפט|counter|prebunk|debunk|workflow)', re.I),
    (6, r'(osint|taxonomy|target|archive|ingest|verify|flow|נתונים|אינטגרציה)', re.I),
    (5, r'(service|module|engine|component|קומפוננט|מנוע|שירות)', re.I),
    (4, r'(architecture|ארכיטקטורה|design|מבנה|layers|diagram)', re.I),
    (8, r'(kpi|slo|monitor|observabil|metrics|ניטור|מדדים)', re.I),
    (9, r'(roadmap|phase|אבני|מפת\s*דרך|timeline)', re.I),
    (7, r'(security|rbac|csp|rate.?limit|privacy|אבטחה|הרשאות)', re.I),
]

def read_text_any(p: Path) -> str:
    ext = p.suffix.lower()
    try:
        if ext in {'.md', '.markdown', '.txt', '.html', '.htm'}:
            return p.read_text(encoding='utf-8', errors='ignore')
        if ext in {'.doc', '.docx', '.rtf'}:
            try:
                out = subprocess.check_output(['textutil','-convert','txt','-stdout',str(p)], text=True)
                return out
            except Exception:
                return ''
        if ext in {'.pdf'}:
            try:
                out = subprocess.check_output(['mdls','-name','kMDItemTextContent','-raw',str(p)], text=True)
                if out and out.strip() != '(null)':
                    return out
            except Exception:
                return ''
    except Exception:
        return ''
    return ''

def shingles(text: str, n=3):
    w = re.findall(r'[\w\u0590-\u05FF]+', text.lower())
    return { hashlib.sha1(' '.join(w[i:i+n]).encode()).digest() for i in range(max(0, len(w)-n+1)) }

def jaccard(a:set, b:set) -> float:
    if not a or not b: return 0.0
    return len(a & b) / len(a | b)

def classify(par: str) -> int:
    for sec, pat, flags in CLASS_RULES:
        if re.search(pat, par, flags):
            return sec
    return 4

def integrate(plan_md: Path, inputs: list[Path]) -> dict:
    plan = plan_md.read_text(encoding='utf-8')
    sig_plan = shingles(plan)
    lines = plan.splitlines()
    added = {sid: [] for sid in SECTIONS}
    for p in inputs:
        txt = read_text_any(p)
        if not txt:
            continue
        paras = [t.strip() for t in re.split(r'\n\s*\n', txt) if len(t.strip()) > 60]
        for para in paras:
            if jaccard(sig_plan, shingles(para)) >= 0.6:
                continue
            sid = classify(para)
            cleaned = re.sub(r'\s+', ' ', para).strip()
            snippet = cleaned if len(cleaned) <= 600 else cleaned[:580] + '…'
            bullet = f"- {snippet}"
            added[sid].append(bullet)
    for sid in sorted(added.keys()):
        if not added[sid]:
            continue
        marker = SECTIONS[sid]
        start = None
        for i, ln in enumerate(lines):
            if ln.strip().startswith(marker):
                start = i; break
        if start is None: continue
        end = len(lines)
        for j in range(start+1, len(lines)):
            if lines[j].startswith('## ') and j>start:
                end = j; break
        insertion = ["", "### הרחבות משולבות (אוטו‑מֶרג')", *added[sid], ""]
        lines = lines[:end] + insertion + lines[end:]
    new_plan = '\n'.join(lines)
    plan_md.write_text(new_plan, encoding='utf-8')
    return {sid: len(added[sid]) for sid in added}

def main():
    target = PLAN_REPO_MD if PLAN_REPO_MD.exists() else PLAN_ROOT_MD
    if not target.exists():
        print('PLAN_NOT_FOUND:', target)
        return
    if not INPUTS_DIR.exists():
        print('INPUTS_DIR_MISSING:', INPUTS_DIR)
        return
    inputs = [p for p in INPUTS_DIR.rglob('*') if p.is_file()]
    stats = integrate(target, inputs)
    # sync to master docs
    dst_dir = HOME/'LionSpace_Master'/'docs'
    dst_dir.mkdir(parents=True, exist_ok=True)
    (dst_dir/target.name).write_text(target.read_text(encoding='utf-8'), encoding='utf-8')
    # backup + delete inputs
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    zip_path = BACKUP_DIR/f'_inputs_backup_{stamp}.zip'
    subprocess.run(['zip','-qr',str(zip_path), str(INPUTS_DIR)], check=False)
    for p in sorted([p for p in INPUTS_DIR.rglob('*')], key=lambda x: len(str(x)), reverse=True):
        try:
            if p.is_file(): p.unlink()
            elif p.is_dir() and not any(p.iterdir()): p.rmdir()
        except Exception:
            pass
    report={'plan': str(target), 'added_counts': stats, 'backup_zip': str(zip_path)}
    (HOME/'LionSpace_Master'/'housekeeping'/'merge_report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False))

if __name__ == '__main__':
    main()

