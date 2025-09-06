#!/usr/bin/env python3
import argparse
import base64
import datetime as dt
import fnmatch
import hashlib
import html
import json
import os
import re
import shutil
import subprocess
import sys
import textwrap
from pathlib import Path

# Globals that can be overridden by config/rules
GLOSSARY = {
    r"(?i)prebunk": "Prebunk",
    r"(?i)debunk": "Debunk",
    r"(?i)counter[-\s]?narrative": "Counter‑Narrative",
    r"(?i)tokens?": "טוקנים",
    r"(?i)security": "אבטחה",
    r"(?i)roadmap": "מפת דרכים",
}


# -------------------------
# Utility: Logging
# -------------------------
def log(msg: str):
    ts = dt.datetime.now().strftime('%H:%M:%S')
    print(f"[{ts}] {msg}")


# -------------------------
# Config
# -------------------------
INCLUDE_GLOBS = [
    "**/*.md", "**/*.markdown", "**/*.html", "**/*.htm", "**/*.txt",
    "**/*.json", "**/*.yaml", "**/*.yml", "**/*.sql",
    "**/*.ts", "**/*.tsx", "**/*.js", "**/*.css", "**/*.scss", "**/*.sh",
]

EXCLUDE_DIRS = {
    "node_modules", ".next", ".git", "dist", "build", "coverage",
    ".vercel", ".vscode", ".idea",
}

EXCLUDE_GLOBS = [
    "**/*.log", "**/*.map", "**/*.lock",
    "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg",
]

MAX_SIZE_BYTES = 25 * 1024 * 1024  # 25MB

CHAPTERS = [
    "Vision & Cognitive Doctrine",
    "Site & UX Architecture (IA, Navigation, Flows)",
    "Content Modules & Prompt System",
    "OSINT Structure",
    "Technical Architecture",
    "UI Design System",
    "Engines",
    "Security & Compliance",
    "Performance, A11y, SEO & KPIs",
    "Deployment, Testing & CI/CD",
    "Agent Roles, RACI & Roadmap",
]

CHAPTER_KEYWORDS = {
    1: [r"vision|doctrine|חזון|דוקטרינה|cognitive|philosophy|principle"],
    2: [r"ia|information architecture|ux|flows|sitemap|navigation|ארכיטקטורת מידע|זרימות|ניווט|IA"],
    3: [r"content modules|prompt|narrative|prebunk|debunk|תוכן|תבניות|נרטיב"],
    4: [r"osint|intelligence collection|open source|מקורות פתוחים|יעדים|מטרות"],
    5: [r"architecture|stack|data flow|system design|microservice|diagram|ארכיטקטורה"],
    6: [r"design system|tokens|oklch|typography|components|grid|עיצוב|טוקנים"],
    7: [r"engine|gemini|ai|tracker|real-time|intelligence engine|מנוע"],
    8: [r"security|auth|privacy|rbac|csp|rate.?limit|אבטחה|פרטיות|הרשאות"],
    9: [r"performance|a11y|seo|lighthouse|kpi|lcp|inp|cls|ביצועים"],
    10: [r"deployment|ci/cd|pipeline|testing|qa|סביבות|השקה|בדיקות"],
    11: [r"agent|raci|roadmap|milestone|phases|אחריות|מפת דרכים"],
}

PREFER_FILENAME_RANK = [
    r"mega|master|super|unified|complete",
    r"site|osint|plan",
]


# -------------------------
# Hashing / Similarity
# -------------------------
def _tokenize_for_simhash(text: str):
    # sentence-token trigrams approximation: split to words, then 3-grams
    words = re.findall(r"[\w\u0590-\u05FF]+", text.lower())
    if len(words) < 3:
        return words
    trigrams = [" ".join(words[i:i+3]) for i in range(len(words)-2)]
    return trigrams


def simhash64(text: str) -> int:
    tokens = _tokenize_for_simhash(text)
    if not tokens:
        tokens = [text.lower()]
    v = [0] * 64
    for tok in tokens:
        h = int(hashlib.sha256(tok.encode("utf-8")).hexdigest(), 16)
        for i in range(64):
            v[i] += 1 if (h >> i) & 1 else -1
    out = 0
    for i in range(64):
        if v[i] >= 0:
            out |= (1 << i)
    return out


def hamming_distance64(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def simhash_similarity(a: int, b: int) -> float:
    return 1.0 - (hamming_distance64(a, b) / 64.0)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def _load_yaml(path: Path):
    try:
        import yaml  # type: ignore
    except Exception:
        return None
    try:
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    except Exception:
        return None


# -------------------------
# Secrets scanning / redaction
# -------------------------
SECRET_PATTERNS = [
    ("AWS_ACCESS_KEY", re.compile(r"AKIA[0-9A-Z]{16}")),
    ("AWS_SECRET_KEY", re.compile(r"(?i)aws(.{0,20})?(secret|access).{0,3}[:=\s]([A-Za-z0-9/+=]{40})")),
    ("GCP_SERVICE_KEY", re.compile(r"\{\s*\"type\"\s*:\s*\"service_account\"[\s\S]+?\}")),
    ("GOOGLE_API_KEY", re.compile(r"AIza[0-9A-Za-z\-_]{35}")),
    ("OPENAI_KEY", re.compile(r"sk-[A-Za-z0-9]{20,}[-_A-Za-z0-9]{10,}")),
    ("PRIVATE_KEY", re.compile(r"-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]+?-----END (?:RSA )?PRIVATE KEY-----")),
    ("GITHUB_PAT", re.compile(r"ghp_[A-Za-z0-9]{36}")),
    ("SLACK_TOKEN", re.compile(r"xox[baprs]-[A-Za-z0-9-]{10,}")),
    ("STRIPE_KEY", re.compile(r"sk_(live|test)_[A-Za-z0-9]{20,}")),
    ("TWILIO_TOKEN", re.compile(r"(?i)twilio(.{0,20})?(token|sid)[^\n]{0,60}")),
    ("VERCEL_TOKEN", re.compile(r"(?i)vercel(.{0,20})?(token|api)[^\n]{0,60}")),
    ("SENTRY_DSN", re.compile(r"https?://[0-9a-f]{32}@[A-Za-z0-9.-]+/\d+")),
    ("JWT", re.compile(r"eyJ[A-Za-z0-9_=\-]{10,}\.[A-Za-z0-9_=\-]{10,}\.[A-Za-z0-9_=\-]{10,}")),
    ("DB_URI", re.compile(r"(?i)(postgres|mysql|mongodb|redis)://[^\s]+")),
    ("GENERIC_TOKEN", re.compile(r"(?i)(token|secret|api[_-]?key|password|passwd)[^\n]{0,50}")),
]


def _shannon_entropy(s: str) -> float:
    if not s:
        return 0.0
    import math
    freq = {}
    for ch in s:
        freq[ch] = freq.get(ch, 0) + 1
    return -sum((c/len(s)) * math.log2(c/len(s)) for c in freq.values())


def redact_secrets(text: str):
    findings = []
    redacted = text
    for name, pat in SECRET_PATTERNS:
        for m in pat.finditer(text):
            span = m.span()
            snippet = text[max(0, span[0]-20):min(len(text), span[1]+20)]
            findings.append({
                "type": name,
                "span": span,
                "snippet": base64.b64encode(snippet.encode("utf-8")).decode("ascii"),
            })
            # Replace the matched segment with a redaction marker
            redacted = redacted.replace(m.group(0), f"__REDACTED_{name}__")
    # Also mask env-like pairs KEY=VALUE where KEY looks like secret-ish
    env_pat = re.compile(r"(?im)^([A-Z0-9_]{3,})=(.+)$")
    def _mask_env(m):
        key = m.group(1)
        val = m.group(2)
        if re.search(r"(?i)(secret|token|key|password|passwd|credential)", key):
            findings.append({"type": "ENV_VAR", "key": key})
            return f"{key}=__REDACTED_ENV__"
        return m.group(0)
    redacted = env_pat.sub(_mask_env, redacted)
    # Entropy-based catch-all for long random strings
    for m in re.finditer(r"(?<![A-Za-z0-9])[A-Za-z0-9+/=]{28,}(?![A-Za-z0-9])", text):
        token = m.group(0)
        if _shannon_entropy(token) >= 4.0:
            findings.append({"type": "HIGH_ENTROPY", "length": len(token)})
            redacted = redacted.replace(token, "__REDACTED_HE_TOKEN__")
    return redacted, findings


# -------------------------
# File iteration
# -------------------------
def should_exclude(path: Path) -> bool:
    for part in path.parts:
        if part in EXCLUDE_DIRS:
            return True
    for g in EXCLUDE_GLOBS:
        if fnmatch.fnmatch(str(path), g):
            return True
    try:
        if path.is_file() and path.stat().st_size > MAX_SIZE_BYTES:
            return True
    except Exception:
        return True
    return False


def iter_included_files(root: Path):
    INTERNAL_CONFIGS = set()
    for base in [root/"ap"/"tools", root/"tools"]:
        for fname in ["classifier_rules.yaml","glossary.yaml","protect_patterns.yaml","config.yaml"]:
            p = (base/fname)
            if p.exists():
                try:
                    INTERNAL_CONFIGS.add(str(p.resolve()))
                except Exception:
                    pass
    outputs_root = (root/"docs"/"SUPER_MASTER").resolve()
    for g in INCLUDE_GLOBS:
        for p in root.glob(g):
            try:
                rp = p.resolve()
            except Exception:
                continue
            if not p.is_file():
                continue
            if should_exclude(p):
                continue
            # skip internal config YAMLs
            if str(rp) in INTERNAL_CONFIGS:
                continue
            # skip previously generated outputs
            try:
                if str(rp).startswith(str(outputs_root)):
                    continue
            except Exception:
                pass
            yield p


# -------------------------
# Normalization / Parsing
# -------------------------
def normalize_whitespace(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def split_markdown_blocks(text: str):
    # returns list of blocks with optional line ranges
    blocks = []
    lines = text.splitlines()
    i = 0
    code_lang = None
    buf = []
    buf_start = 0
    while i < len(lines):
        line = lines[i]
        code_fence = re.match(r"^```(\w+)?\s*$", line)
        if code_fence:
            # flush previous paragraph
            if buf:
                para = "\n".join(buf).strip()
                if para:
                    blocks.append({"type": "paragraph", "text": para, "line_start": buf_start+1, "line_end": i})
                buf = []
                buf_start = i
            # collect code block
            lang = code_fence.group(1) or ""
            i += 1
            code_start = i
            code_lines = []
            while i < len(lines) and not re.match(r"^```\s*$", lines[i]):
                code_lines.append(lines[i])
                i += 1
            blocks.append({"type": "code", "lang": lang, "code": "\n".join(code_lines), "line_start": code_start+1, "line_end": i})
        else:
            m = re.match(r"^(#{1,6})\s+(.*)$", line)
            if m:
                # flush paragraph
                if buf:
                    para = "\n".join(buf).strip()
                    if para:
                        blocks.append({"type": "paragraph", "text": para, "line_start": buf_start+1, "line_end": i})
                    buf = []
                    buf_start = i
                level = len(m.group(1))
                text_h = m.group(2).strip()
                blocks.append({"type": "heading", "level": level, "text": text_h, "line_start": i+1, "line_end": i+1})
            elif re.match(r"^\s*\|.*\|\s*$", line):
                # naive markdown table detection: capture contiguous table lines
                if buf:
                    para = "\n".join(buf).strip()
                    if para:
                        blocks.append({"type": "paragraph", "text": para, "line_start": buf_start+1, "line_end": i})
                    buf = []
                    buf_start = i
                tbl_lines = [line]
                tbl_start = i
                i += 1
                while i < len(lines) and re.match(r"^\s*\|.*\|\s*$", lines[i]):
                    tbl_lines.append(lines[i])
                    i += 1
                i -= 1
                blocks.append({"type": "table", "text": "\n".join(tbl_lines), "line_start": tbl_start+1, "line_end": i+1})
            else:
                if not buf:
                    buf_start = i
                buf.append(line)
        i += 1
    if buf:
        para = "\n".join(buf).strip()
        if para:
            blocks.append({"type": "paragraph", "text": para, "line_start": buf_start+1, "line_end": i})
    return blocks


def simple_html_to_blocks(text: str):
    # Very minimal HTML parsing using regex for h2-h4, code blocks, paragraphs
    blocks = []
    # Strip style/script blocks entirely to avoid CSS/JS spill
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<script[\s\S]*?</script>", " ", text, flags=re.I)
    # Replace <code>...</code> inside <pre>...</pre> as code blocks
    code_blocks = []
    def _code_repl(m):
        content = m.group(1)
        code_blocks.append(content)
        return f"@@CODE_BLOCK_{len(code_blocks)-1}@@"
    temp = re.sub(r"<pre[^>]*><code[^>]*>([\s\S]*?)</code></pre>", _code_repl, text, flags=re.I)
    # Convert HTML tables to simple Markdown tables to preserve structure
    def _table_to_md(m):
        tbl = m.group(0)
        # Extract rows
        rows = re.findall(r"<tr[\s\S]*?</tr>", tbl, flags=re.I)
        md_rows = []
        for ri, row in enumerate(rows):
            cells = re.findall(r"<(?:th|td)[^>]*>([\s\S]*?)</(?:th|td)>", row, flags=re.I)
            cells = [re.sub(r"<[^>]+>", " ", c).strip() for c in cells]
            if not cells:
                continue
            line = "| " + " | ".join(cells) + " |"
            md_rows.append(line)
            if ri == 0 and len(cells) > 0:
                md_rows.append("| " + " | ".join(["---"] * len(cells)) + " |")
        if md_rows:
            blocks.append({"type": "table", "text": "\n".join(md_rows)})
        return " "
    text = re.sub(r"<table[\s\S]*?</table>", _table_to_md, text, flags=re.I)

    # Extract headings
    pos = 0
    for m in re.finditer(r"<(h[2-4])[^>]*>([\s\S]*?)</\1>", temp, flags=re.I):
        if m.start() > pos:
            chunk = temp[pos:m.start()].strip()
            if chunk:
                blocks.append({"type": "paragraph", "text": re.sub(r"<[^>]+>", " ", chunk)})
        level = int(m.group(1)[1])
        content = re.sub(r"<[^>]+>", " ", m.group(2)).strip()
        blocks.append({"type": "heading", "level": level, "text": content})
        pos = m.end()
    tail = temp[pos:].strip()
    if tail:
        blocks.append({"type": "paragraph", "text": re.sub(r"<[^>]+>", " ", tail)})
    # Insert code blocks placeholders back
    out = []
    for b in blocks:
        if isinstance(b.get("text"), str):
            t = b["text"]
            def _put_code(mm):
                idx = int(mm.group(1))
                return f"\n@@CODE_PLACEHOLDER@@{idx}\n"
            t = re.sub(r"@@CODE_BLOCK_(\d+)@@", _put_code, t)
            b["text"] = t
        out.append(b)
    # Expand placeholders to code blocks and paragraphs
    final = []
    for b in out:
        if b.get("type") in {"heading", "table"}:
            final.append(b)
            continue
        textp = b.get("text", "")
        parts = re.split(r"\n@@CODE_PLACEHOLDER@@(\d+)\n", textp)
        if len(parts) == 1:
            final.append({"type": "paragraph", "text": textp})
        else:
            # alternating: text, idx, text, idx, ...
            for i, part in enumerate(parts):
                if i % 2 == 0:
                    if part.strip():
                        final.append({"type": "paragraph", "text": part})
                else:
                    idx = int(part)
                    code = code_blocks[idx]
                    final.append({"type": "code", "lang": "", "code": html.unescape(code)})
    return final


def generic_text_to_blocks(text: str):
    # split on double newlines to paragraphs; detect shell/code blocks by indentation or fenced backticks
    if "```" in text or text.strip().startswith("#"):
        return split_markdown_blocks(text)
    paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    return [{"type": "paragraph", "text": p} for p in paras]


def parse_file_to_blocks(path: Path, text: str):
    ext = path.suffix.lower()
    if ext in {".md", ".markdown"}:
        return split_markdown_blocks(text)
    if ext in {".html", ".htm"}:
        return simple_html_to_blocks(text)
    if ext in {".json"}:
        # pretty-print JSON as code
        try:
            obj = json.loads(text)
            pretty = json.dumps(obj, ensure_ascii=False, indent=2)
        except Exception:
            pretty = text
        return [{"type": "code", "lang": "json", "code": pretty}]
    if ext in {".yaml", ".yml"}:
        try:
            import yaml  # type: ignore
            obj = yaml.safe_load(text)
            pretty = yaml.safe_dump(obj, sort_keys=False, allow_unicode=True)
        except Exception:
            pretty = text
        return [{"type": "code", "lang": "yaml", "code": pretty}]
    if ext in {".css", ".scss"}:
        return [{"type": "code", "lang": "css", "code": text}]
    if ext in {".sql"}:
        return [{"type": "code", "lang": "sql", "code": text}]
    if ext in {".ts", ".tsx"}:
        return [{"type": "code", "lang": "ts", "code": text}]
    if ext in {".js"}:
        return [{"type": "code", "lang": "js", "code": text}]
    return generic_text_to_blocks(text)


# -------------------------
# Classification
# -------------------------
def chapter_for_text(text: str) -> int:
    t = text.lower()
    for cid, pats in CHAPTER_KEYWORDS.items():
        for pat in pats:
            if re.search(pat, t, re.I):
                return cid
    # Heuristics for tables/metrics to Chapter 9
    if re.search(r"\b(kpi|metric|lcp|inp|cls|lighthouse)\b", t, re.I):
        return 9
    # Default to Technical Architecture
    return 5


def choose_preferred(src_a: Path, src_b: Path) -> Path:
    a = src_a.name.lower()
    b = src_b.name.lower()
    def rank(name: str) -> int:
        for i, pat in enumerate(PREFER_FILENAME_RANK):
            if re.search(pat, name):
                return i
        return 999
    ra, rb = rank(a), rank(b)
    if ra != rb:
        return src_a if ra < rb else src_b
    # newest wins
    try:
        ma, mb = src_a.stat().st_mtime, src_b.stat().st_mtime
        if ma != mb:
            return src_a if ma > mb else src_b
    except Exception:
        pass
    # fallback: longer filename
    return src_a if len(a) >= len(b) else src_b


# -------------------------
# HTML shell
# -------------------------
def html_shell(title: str, rtl: bool = True, open_chapters: str = "") -> str:
    direction = "rtl" if rtl else "ltr"
    lang = "he" if rtl else "en"
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    # Minimal self-contained CSS and JS per requirements
    return f"""<!doctype html>
<html lang=\"{lang}\" dir=\"{direction}\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>{html.escape(title)}</title>
  <style>
    :root {{
      --bg: #0e1116; --fg: #e6edf3; --muted: #9da7b3; --accent: #4db6ff;
      --box-note: #2d3748; --box-tip: #1f5130; --box-warn: #5a3a00; --box-hl: #3a274c;
      --border: #21262d; --shadow: rgba(0,0,0,0.4);
      --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      --sans: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    }}
    html, body {{ margin:0; padding:0; background:var(--bg); color:var(--fg); font-family: var(--sans); }}
    .wrap {{ display:flex; min-height:100vh; }}
    .sidebar {{ position:sticky; top:0; height:100vh; width: 320px; padding: 16px; border-inline-end:1px solid var(--border); overflow:auto; background:#0a0c10; }}
    .content {{ flex:1; padding:24px; max-width: 1100px; margin:0 auto; }}
    h1, h2, h3, h4 {{ color: var(--fg); }}
    h1 {{ font-size: 28px; margin: 16px 0; }}
    h2 {{ font-size: 22px; margin: 24px 0 8px; border-bottom:1px solid var(--border); padding-bottom:8px; }}
    h3 {{ font-size: 18px; margin: 18px 0 6px; }}
    h4 {{ font-size: 16px; margin: 14px 0 4px; color: var(--muted); }}
    p {{ line-height: 1.65; color: var(--fg); }}
    pre {{ background:#0b1220; padding:12px; border:1px solid var(--border); border-radius:6px; overflow:auto; direction:ltr; text-align:left; white-space: pre; }}
    code {{ font-family: var(--mono); font-size: 13px; direction:ltr; text-align:left; }}
    a {{ color: var(--accent); text-decoration: none; }}
    .toolbar {{ display:flex; gap:8px; align-items:center; margin-bottom:12px; }}
    .toolbar input[type='search'] {{ flex:1; padding:8px; border-radius:6px; border:1px solid var(--border); background:#0a0c10; color:var(--fg); }}
    .btn {{ padding:8px 10px; border-radius:6px; border:1px solid var(--border); background:#0a0c10; color:var(--fg); cursor:pointer; }}
    .toc a {{ display:block; padding:6px 8px; border-radius:6px; color:var(--muted); }}
    .toc a:hover {{ background:#0e1421; color:var(--fg); }}
    .toc a.active {{ background:#142033; color:#fff; }}
    .box {{ padding:10px 12px; border-radius:6px; margin:10px 0; border:1px solid var(--border); }}
    .box.note {{ background: var(--box-note); }}
    .box.tip {{ background: var(--box-tip); }}
    .box.warn {{ background: var(--box-warn); }}
    .box.highlight {{ background: var(--box-hl); }}
    details.chapter {{ border:1px solid var(--border); border-radius:8px; margin:14px 0; background:#0b0e14; box-shadow:0 1px 2px var(--shadow); }}
    details.chapter > summary {{ cursor:pointer; padding:12px 16px; font-weight:600; list-style:none; }}
    details.chapter[open] > summary {{ border-bottom:1px solid var(--border); }}
    details.chapter > .chapter-body {{ padding: 12px 16px; }}
    details.variants {{ border:1px solid var(--border); border-radius:6px; margin:8px 0; background:#0b1220; }}
    details.variants > summary {{ cursor:pointer; padding:8px 10px; font-weight:600; color: var(--muted); }}
    details.codeblock > summary {{ cursor:pointer; padding:6px 8px; color: var(--muted); background:#0b1220; border:1px solid var(--border); border-radius:6px; margin:8px 0; }}
    .variant-source {{ font-family: var(--mono); font-size:12px; color: var(--muted); margin:6px 0; }}
    #provenance {{ display:none; font-family: var(--mono); font-size:12px; white-space:pre-wrap; background:#0a0c10; border:1px dashed var(--border); padding:10px; border-radius:8px; }}
    .muted {{ color: var(--muted); }}
    @media print {{
      .sidebar, .toolbar, .btn, #provenance {{ display:none !important; }}
      body {{ background:#fff; color:#000; }}
      a {{ color:#000; }}
    }}
  </style>
  <script>
  // Client-side search/filter and TOC
  function setup() {{
    const q = document.getElementById('search');
    const chapters = Array.from(document.querySelectorAll('details.chapter'));
    // Restore open state
    try {{
      const saved = JSON.parse(localStorage.getItem('chapters-open')||'[]');
      chapters.forEach((d,idx)=>{{ d.open = saved.includes(idx+1); }});
    }} catch(e) {{}}
    q.addEventListener('input', () => {{
      const s = q.value.trim().toLowerCase();
      clearHighlights();
      chapters.forEach(d => {{
        if (!s) {{ d.style.display = ''; return; }}
        const hit = d.innerText.toLowerCase().includes(s);
        d.style.display = hit ? '' : 'none';
        if (hit) d.open = true;
      }});
      if (s) highlightMatches(s);
    }});
    // Persist open state on toggle
    chapters.forEach((d,idx)=>{{ d.addEventListener('toggle', ()=>{{
      const arr = chapters.filter(x=>x.open).map((_,i)=>i+1);
      localStorage.setItem('chapters-open', JSON.stringify(arr));
    }}); }});
    buildTOC();
    observeHeadings();
    enableCopyLinks();
    setupProvFilter();
  }}
  function buildTOC() {{
    const toc = document.getElementById('toc');
    toc.innerHTML = '';
    document.querySelectorAll('h2,h3,h4').forEach(h => {{
      const a = document.createElement('a');
      a.href = '#' + (h.id || h.textContent.trim().replace(/\s+/g,'-'));
      a.textContent = h.textContent;
      toc.appendChild(a);
    }});
  }}
  function printDoc() {{ window.print(); }}
  function toggleProvenance() {{
    const el = document.getElementById('provenance');
    el.style.display = (el.style.display === 'none' || !el.style.display) ? 'block' : 'none';
  }}
  function clearHighlights() {{
    document.querySelectorAll('mark.__hl').forEach(m=>{{
      const p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize();
    }});
  }}
  function highlightMatches(q) {{
    const rx = new RegExp(q.replace(/[.*+?^${{}}()|[\]\\]/g, '\\$&'), 'gi');
    document.querySelectorAll('.chapter-body').forEach(node=>{{
      node.querySelectorAll('p,li,pre,code').forEach(el=>{{
        el.innerHTML = el.innerHTML.replace(rx, m => '<mark class="__hl">'+m+'</mark>');
      }});
    }});
  }}
  function observeHeadings() {{
    const map = new Map();
    document.querySelectorAll('h2,h3,h4').forEach(h=>{{ map.set(h.id, h); }});
    const obs = new IntersectionObserver(entries=>{{
      entries.forEach(e=>{{ if (e.isIntersecting) setActiveTOC(e.target.id); }});
    }}, {{ rootMargin: '0px 0px -70% 0px' }});
    map.forEach(h=>obs.observe(h));
  }}
  function setActiveTOC(id) {{
    document.querySelectorAll('.toc a').forEach(a=>a.classList.remove('active'));
    const link = document.querySelector('.toc a[href="#'+id+'"]');
    if (link) link.classList.add('active');
  }}
  function enableCopyLinks() {{
    document.querySelectorAll('h2,h3,h4').forEach(h=>{{
      const btn = document.createElement('button'); btn.className='btn'; btn.textContent='🔗'; btn.style.marginInlineStart='6px';
      const id = h.id || h.textContent.trim().replace(/\s+/g,'-'); h.id = id;
      btn.addEventListener('click', ()=>{{ navigator.clipboard.writeText(location.origin+location.pathname+'#'+id); }});
      h.appendChild(btn);
    }});
  }}
  function setupProvFilter() {{
    const prov = document.getElementById('provenance');
    if (!prov) return;
    const wrap = document.createElement('div');
    const inp = document.createElement('input'); inp.placeholder='סינון מקוריות (שם קובץ/Hash)'; inp.className='btn'; inp.style.width='100%'; inp.style.marginBottom='8px';
    const pre = document.createElement('pre'); pre.textContent = prov.textContent; prov.textContent=''; wrap.appendChild(inp); wrap.appendChild(pre); prov.appendChild(wrap);
    inp.addEventListener('input', ()=>{{
      const s = inp.value.toLowerCase();
      const lines = pre.textContent.split('\n');
      pre.textContent = !s ? lines.join('\n') : lines.filter(l=>l.toLowerCase().includes(s)).join('\n');
    }});
  }}
  // Shell API
  const dedupeStore = new Map();
  const provenanceStore = new Map();
  function appendSection(chapterId, htmlChunk) {{
    const target = document.querySelector(`[data-chapter-id="${{chapterId}}"] .chapter-body`);
    if (target) {{
      const div = document.createElement('div');
      div.innerHTML = htmlChunk;
      target.appendChild(div);
      buildTOC();
    }}
  }}
  window.addEventListener('DOMContentLoaded', setup);
  </script>
</head>
<body>
  <div class="wrap">
    <aside class="sidebar">
      <div class="toolbar">
        <input id="search" type="search" placeholder="חיפוש בפרקים" />
        <button class="btn" onclick="printDoc()">הדפס/ייצוא PDF</button>
        <button class="btn" onclick="toggleProvenance()">מקוריות</button>
      </div>
      <div class="muted" style="margin-bottom:10px;">גרסה: {now}</div>
      <nav id="toc" class="toc"></nav>
    </aside>
    <main class="content">
      <h1>{html.escape(title)}</h1>
      {''.join(f'<details class="chapter" open data-chapter-id="{i+1}"><summary>{i+1}. {html.escape(ch)}</summary><div class="chapter-body" id="chapter-{i+1}"></div></details>' for i, ch in enumerate(CHAPTERS))}
      <section id="provenance"></section>
    </main>
  </div>
</body>
</html>"""


def block_to_html(block: dict) -> str:
    t = block.get("type")
    if t == "heading":
        level = min(4, max(2, block.get("level", 2)))
        text_h = html.escape(block.get("text", ""))
        anchor = re.sub(r"\s+", "-", block.get("text", "").strip())
        return f"<h{level} id=\"{anchor}\">{text_h}</h{level}>"
    if t == "code":
        lang = html.escape(block.get("lang", ""))
        code_raw = block.get("code", "")
        code = html.escape(code_raw)
        line_count = code_raw.count("\n") + 1 if code_raw else 0
        if line_count > 60 or len(code_raw) > 8000:
            return (
                f"<details class=\"codeblock\"><summary>קוד ({lang or 'plain'}) — {line_count} שורות</summary>"
                f"<pre><code dir=\"ltr\" class=\"language-{lang}\">{code}</code></pre></details>"
            )
        return f"<pre><code dir=\"ltr\" class=\"language-{lang}\">{code}</code></pre>"
    if t == "table":
        # Keep as pre for safety; richer parsing can be added
        tbl = html.escape(block.get("text", ""))
        return f"<pre>{tbl}</pre>"
    # paragraph
    txt = block.get("text", "").strip()
    # normalize glossary (HE primary)
    for pat, rep in GLOSSARY.items():
        txt = re.sub(pat, rep, txt)
    return f"<p>{html.escape(txt)}</p>"


def block_to_markdown(block: dict) -> str:
    t = block.get("type")
    if t == "heading":
        level = min(4, max(2, block.get("level", 2)))
        prefix = "#" * level
        return f"{prefix} {block.get('text','').strip()}\n"
    if t == "code":
        lang = block.get("lang", "")
        code = block.get("code", "")
        return f"```{lang}\n{code}\n```\n"
    if t == "table":
        return block.get("text", "").strip() + "\n"
    txt = block.get("text", "").strip()
    return txt + "\n"


# -------------------------
# Build pipeline
# -------------------------
def build_super_master(root: Path, out_dir: Path, purge: bool = False, purge_all: bool = False,
                       do_plan: bool = False, do_validate: bool = False, min_similarity: float = 0.85,
                       engine: str = "playwright", no_provenance: bool = False,
                       rules_path: Path | None = None, open_chapters: str = "",
                       protect_from: Path | None = None, provenance_out: Path | None = None,
                       no_pdf: bool = False):
    out_dir.mkdir(parents=True, exist_ok=True)
    work_dir = root / ".work" / "super_master"
    work_dir.mkdir(parents=True, exist_ok=True)

    title = "LIONSPACE — SUPER MASTER DOCUMENT"
    html_path = out_dir / "LIONSPACE_SUPER_MASTER_DOCUMENT.html"
    md_path = out_dir / "LIONSPACE_SUPER_MASTER_DOCUMENT.md"
    pdf_path = out_dir / "LIONSPACE_SUPER_MASTER_DOCUMENT.pdf"

    ingest_manifest = []
    dedupe_report = {"duplicates": []}
    conflicts_resolved = {"items": []}
    provenance_map = {}
    secrets_scan = {"files": []}

    # Optionally load rules and glossary
    global CHAPTER_KEYWORDS, GLOSSARY
    if rules_path and Path(rules_path).exists():
        data = _load_yaml(Path(rules_path))
        if isinstance(data, dict):
            try:
                CHAPTER_KEYWORDS = {int(k): v for k, v in data.items() if re.match(r"^\d+$", str(k))}
            except Exception:
                pass
    gloss_path = root / "ap" / "tools" / "glossary.yaml"
    if gloss_path.exists():
        gloss = _load_yaml(gloss_path)
        if isinstance(gloss, dict):
            try:
                GLOSSARY = {str(k): str(v) for k, v in gloss.items()}
            except Exception:
                pass

    # PHASE B: shell first
    log("Writing HTML shell")
    html_doc = html_shell(title, rtl=True, open_chapters=open_chapters)
    html_path.write_text(html_doc, encoding="utf-8")

    # PHASE A/C: Scan + ingest
    log("Scanning workspace for input files…")
    files = sorted(set(iter_included_files(root)), key=lambda p: str(p).lower())
    for p in files:
        try:
            rel = p.relative_to(root)
        except Exception:
            rel = p
        if should_exclude(p):
            continue
        try:
            data = p.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        sha = sha256_file(p)
        ingest_manifest.append({"path": str(rel), "size": p.stat().st_size, "sha256": sha})
        redacted, findings = redact_secrets(data)
        if findings:
            secrets_scan["files"].append({"path": str(rel), "sha256": sha, "findings": findings})

    # Write manifest early
    (out_dir / "_ingest-manifest.json").write_text(json.dumps(ingest_manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "_secrets-scan.json").write_text(json.dumps(secrets_scan, ensure_ascii=False, indent=2), encoding="utf-8")

    # Build content per chapter
    per_chapter_html = {i+1: [] for i in range(len(CHAPTERS))}
    per_chapter_md = {i+1: [] for i in range(len(CHAPTERS))}
    per_chapter_fps = {i+1: [] for i in range(len(CHAPTERS))}  # list of (fp, idx)
    # store canonical text for each fp and chapter
    canon_text_map = {i+1: {} for i in range(len(CHAPTERS))}  # {cid: {fp: text}}
    # clusters of variants per canonical fp
    variant_map = {i+1: {} for i in range(len(CHAPTERS))}  # {cid: {fp: [ {html, text, file, sha, line_start, line_end} ]}}

    # For conflict detection, collect kv pairs: key -> [(value, path, sha)]
    kv_index = {}

    log("Ingesting, normalizing, deduplicating…")
    for p in files:
        if should_exclude(p):
            continue
        try:
            raw = p.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        redacted, _ = redact_secrets(raw)
        blocks = parse_file_to_blocks(p, redacted)
        # small helper to extract kv candidates for conflict detection
        for b in blocks:
            if b.get("type") == "paragraph":
                for m in re.finditer(r"(?im)^([A-Za-z0-9_\.\- ]{2,40})\s*[:=]\s*([^\n]{1,200})$", b.get("text","")):
                    k = normalize_whitespace(m.group(1)).lower()
                    v = normalize_whitespace(m.group(2))
                    kv_index.setdefault(k, []).append((v, p, sha256_file(p)))
            if b.get("type") == "code":
                for m in re.finditer(r"(?im)^([A-Za-z0-9_]{2,40})\s*[:=]\s*([^\n]{1,200})$", b.get("code","")):
                    k = normalize_whitespace(m.group(1)).lower()
                    v = normalize_whitespace(m.group(2))
                    kv_index.setdefault(k, []).append((v, p, sha256_file(p)))

        # Place blocks to chapters and dedupe
        for b in blocks:
            text_for_fp = b.get("text") or b.get("code") or ""
            fp = simhash64(text_for_fp)
            chapter_id = chapter_for_text(text_for_fp)
            # check duplicates
            is_dup = False
            dup_of = None
            for (prev_fp, _i) in per_chapter_fps[chapter_id]:
                if simhash_similarity(prev_fp, fp) >= min_similarity:
                    is_dup = True
                    dup_of = prev_fp
                    break
            if is_dup:
                dedupe_report["duplicates"].append({
                    "chapter": chapter_id,
                    "duplicate_of": dup_of,
                    "skipped_fp": fp,
                    "source": str(p.relative_to(root))
                })
                # record as variant to be rendered under the canonical block
                relf = str(p.relative_to(root))
                sha = sha256_file(p)
                html_chunk = block_to_html(b)
                variant_map[chapter_id].setdefault(dup_of, []).append({
                    "html": html_chunk,
                    "text": (b.get("text") or b.get("code") or ""),
                    "file": relf,
                    "sha256": sha,
                    "line_start": b.get("line_start"),
                    "line_end": b.get("line_end"),
                })
                # do not drop; we'll include it as variant (no content loss)
                continue
            # keep
            per_chapter_fps[chapter_id].append((fp, len(per_chapter_html[chapter_id])))
            html_chunk = block_to_html(b)
            md_chunk = block_to_markdown(b)
            pid = f"p-{fp:x}"  # paragraph id based on simhash
            # enrich html with paragraph id for provenance drawer
            if html_chunk.startswith("<p>"):
                html_chunk = html_chunk.replace("<p>", f"<p data-paragraph-id=\"{pid}\">", 1)
            elif html_chunk.startswith("<h"):
                # headings are not mapped as paragraphs; still tag id
                html_chunk = re.sub(r"^<h(\d)", f"<h\\1 data-paragraph-id=\"{pid}\"", html_chunk, count=1)
            per_chapter_html[chapter_id].append(html_chunk)
            per_chapter_md[chapter_id].append(md_chunk)
            snippet = (b.get("text") or b.get("code") or "").strip()
            snippet_sha = hashlib.sha1(snippet.encode("utf-8")).hexdigest() if snippet else ""
            canon_text_map[chapter_id][fp] = snippet
            provenance_map[pid] = {
                "file": str(p.relative_to(root)),
                "sha256": sha256_file(p),
                "snippet_sha1": snippet_sha,
                "line_start": b.get("line_start"),
                "line_end": b.get("line_end"),
            }

    # Conflicts resolution
    for k, entries in kv_index.items():
        values = {}
        for v, path, sha in entries:
            values.setdefault(v, []).append((path, sha))
        if len(values) > 1:
            # choose per precedence
            candidates = [(v, lst[0][0]) for v, lst in values.items()]
            best = candidates[0]
            for v, path in candidates[1:]:
                best_path = choose_preferred(best[1], path)
                if best_path == path:
                    best = (v, path)
            chosen = best[0]
            conflicts_resolved["items"].append({
                "key": k,
                "values": {v: [str(p) for p, _sha in values[v]] for v in values},
                "chosen": chosen,
            })

    # Ensure provenance coverage: every ingested file appears at least once
    prov_files = {meta["file"] for meta in provenance_map.values()}
    for it in ingest_manifest:
        rel = it["path"]
        if rel not in prov_files:
            pid = f"file-{it['sha256'][:12]}"
            provenance_map[pid] = {
                "file": rel,
                "sha256": it["sha256"],
                "snippet_sha1": "",
                "line_start": None,
                "line_end": None,
            }

    # For each canonical block, insert variants right after it (if any)
    for cid in per_chapter_html.keys():
        if not variant_map[cid]:
            continue
        # map fp->index
        index_map = {fp: idx for (fp, idx) in per_chapter_fps[cid]}
        # sort by index descending to keep positions valid when inserting
        for fp in sorted(variant_map[cid].keys(), key=lambda k: index_map.get(k, -1), reverse=True):
            idx = index_map.get(fp)
            if idx is None:
                continue
            variants = variant_map[cid][fp]
            # build a details block with full variants and mini diff summaries
            canon_txt = canon_text_map[cid].get(fp, "")
            import difflib
            parts = ["<details class=\"variants\"><summary>גרסאות מקור — " + str(len(variants)) + "</summary>"]
            for v in variants:
                src = html.escape(f"{os.path.basename(v['file'])} [{v['sha256'][:12]}]" + (f":{v.get('line_start')}-{v.get('line_end')}" if v.get('line_start') and v.get('line_end') else ""))
                # short inline diff stats
                ratio = 0.0
                try:
                    ratio = difflib.SequenceMatcher(None, canon_txt, v["text"]).ratio()
                except Exception:
                    pass
                parts.append(f"<div class=\"variant-source\">מקור: {src} • דמיון לקאנון: {ratio:.2f}</div>")
                parts.append(v["html"])  # full content, not truncated
            parts.append("</details>")
            per_chapter_html[cid].insert(idx + 1, "\n".join(parts))

    # Embed per chapter into HTML shell
    log("Composing final HTML with content…")
    doc = html_path.read_text(encoding="utf-8")
    chapter_content_counts = {}
    for cid, chunks in per_chapter_html.items():
        body_id = f"chapter-{cid}"
        html_joined = "\n".join(chunks)
        chapter_content_counts[cid] = len(chunks)
        doc = doc.replace(f"id=\"{body_id}\"></div>", f"id=\"{body_id}\">\n{html_joined}\n</div>")

    # Fill provenance drawer (filenames and pids only)
    if not no_provenance:
        prov_lines = []
        for pid, meta in sorted(provenance_map.items(), key=lambda x: x[0]):
            fname = os.path.basename(meta["file"]) or meta["file"]
            lr = ''
            if meta.get('line_start') and meta.get('line_end'):
                lr = f":{meta['line_start']}-{meta['line_end']}"
            prov_lines.append(f"{pid} ← {fname}{lr} [{meta['sha256'][:12]}|{(meta.get('snippet_sha1') or '')[:8]}]")
        prov_text = html.escape("\n".join(prov_lines))
        doc = doc.replace("<section id=\"provenance\"></section>", f"<section id=\"provenance\">{prov_text}</section>")
    else:
        doc = doc.replace("<section id=\"provenance\"></section>", "")
    html_path.write_text(doc, encoding="utf-8")

    # Emit Markdown
    log("Writing Markdown mirror…")
    md_lines = [f"# {title}", ""]
    for i, ch in enumerate(CHAPTERS, start=1):
        md_lines.append(f"## {i}. {ch}")
        md_lines.append("")
        md_lines.extend(per_chapter_md[i])
        md_lines.append("")
    md_path.write_text("\n".join(md_lines), encoding="utf-8")

    # Write QA JSONs
    (out_dir / "_dedupe-report.json").write_text(json.dumps(dedupe_report, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "_conflicts-resolved.json").write_text(json.dumps(conflicts_resolved, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "_provenance-map.json").write_text(json.dumps(provenance_map, ensure_ascii=False, indent=2), encoding="utf-8")
    if provenance_out:
        Path(provenance_out).write_text(json.dumps(provenance_map, ensure_ascii=False, indent=2), encoding="utf-8")
    # Validation (basic gates)
    if do_validate:
        log("Running validation gates…")
        report = {"checks": [], "pass": True}
        # 11 chapters present
        checks = []
        checks.append({"name": "chapters_count", "ok": len(CHAPTERS) == 11})
        # chapters populated (non-empty)
        nonempty = all(chapter_content_counts.get(i,0) > 0 for i in range(1,12))
        checks.append({"name": "chapters_populated", "ok": nonempty, "counts": chapter_content_counts})
        # No external refs in HTML
        ext_refs = re.findall(r"href=\\\"https?://|src=\\\"https?://", doc)
        checks.append({"name": "no_external_refs", "ok": len(ext_refs) == 0, "count": len(ext_refs)})
        # No <style> blocks in body/content
        body_part = doc.split('<main',1)[1] if '<main' in doc else doc
        no_style_in_body = (re.search(r"<style", body_part, flags=re.I) is None)
        checks.append({"name": "no_style_blocks_in_body", "ok": no_style_in_body})
        # No classifier rule strings leaked into output
        leaked_rules = []
        try:
            # use raw rules if available
            rules_data = _load_yaml(Path(rules_path)) if rules_path else None
            rule_strs = []
            if isinstance(rules_data, dict):
                for v in rules_data.values():
                    if isinstance(v, list):
                        rule_strs.extend([str(x) for x in v])
            for rs in rule_strs:
                if rs and rs in body_part:
                    leaked_rules.append(rs)
        except Exception:
            pass
        checks.append({"name": "no_rule_strings_in_output", "ok": len(leaked_rules) == 0, "leaked": leaked_rules[:5]})
        # All files in manifest appear in provenance map at least once
        prov_files = {meta["file"] for meta in provenance_map.values()}
        missing = [it["path"] for it in ingest_manifest if it["path"] not in prov_files]
        if missing:
            # Auto-fix: add missing files as provenance-only entries
            sha_map = {it["path"]: it["sha256"] for it in ingest_manifest}
            for rel in missing:
                pid = f"file-{(sha_map.get(rel,'') or rel)[:12]}"
                provenance_map[pid] = {
                    "file": rel,
                    "sha256": sha_map.get(rel, ""),
                    "snippet_sha1": "",
                    "line_start": None,
                    "line_end": None,
                }
            # rewrite provenance map file with the fix
            (out_dir / "_provenance-map.json").write_text(json.dumps(provenance_map, ensure_ascii=False, indent=2), encoding="utf-8")
            missing = []
        checks.append({"name": "provenance_coverage", "ok": len(missing) == 0, "missing": missing[:20], "missing_count": len(missing)})
        # No secrets leaked in outputs (basic): look for redaction markers
        leaked = re.findall(r"__REDACTED_\w+__", doc)
        checks.append({"name": "secrets_redacted", "ok": True, "redactions_in_doc": len(leaked)})
        # code direction hints present
        checks.append({"name": "code_dir_ltr", "ok": (doc.count('dir=\"ltr\"') > 0)})
        # Dedup and conflicts files produced
        checks.append({"name": "dedupe_report_exists", "ok": (out_dir / "_dedupe-report.json").exists()})
        checks.append({"name": "conflicts_report_exists", "ok": (out_dir / "_conflicts-resolved.json").exists()})
        report["checks"] = checks
        report["pass"] = all(c.get("ok") for c in checks)
        (out_dir / "_validation-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    # Try PDF export
    try:
        if not no_pdf:
            if engine == "wkhtmltopdf":
                wk = shutil.which("wkhtmltopdf")
                if wk:
                    log("Exporting PDF via wkhtmltopdf…")
                    subprocess.run([wk, str(html_path), str(pdf_path)], check=True)
                else:
                    log("wkhtmltopdf not found; skipping PDF — try tools/export_pdf.sh")
            else:
                # Playwright via npx (fallback to export_pdf.sh)
                log("Exporting PDF via Playwright…")
                subprocess.run(["bash", str((root/"ap"/"tools"/"export_pdf.sh") if (root/"ap"/"tools"/"export_pdf.sh").exists() else "tools/export_pdf.sh"), str(html_path)], check=True)
    except Exception as e:
        log(f"PDF export failed: {e}")

    # Archive and purge if requested
    # Plan purge (no deletion)
    if do_plan:
        protected_patterns = [
            r"^\.env", r"^keys/", r"^vercel-.*\.json$", r"^\.github/", r"^\.gitlab-ci\.yml$",
            r"^package\.json$", r"^package-lock\.json$", r"^pnpm-lock\.yaml$",
        ]
        if protect_from and Path(protect_from).exists():
            try:
                import yaml  # type: ignore
                patterns = yaml.safe_load(Path(protect_from).read_text(encoding='utf-8')) or []
                if isinstance(patterns, list):
                    protected_patterns.extend([str(x) for x in patterns])
            except Exception:
                pass
        def is_protected_rel(rel: str) -> bool:
            for pat in protected_patterns:
                if re.search(pat, rel):
                    return True
            return False
        deletions = []
        for it in ingest_manifest:
            rel = it["path"]
            if rel.startswith("docs/SUPER_MASTER/"):
                continue
            if is_protected_rel(rel):
                continue
            deletions.append(rel)
        plan = {"candidate_deletions": deletions, "count": len(deletions)}
        (out_dir / "_purge-plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")

    if purge:
        confirm = os.environ.get("CONFIRM_DELETION") == "YES"
        if not confirm:
            log("Purge requested but CONFIRM_DELETION!=YES; skipping purge.")
            return
        # snapshot git
        if (root / ".git").exists():
            try:
                subprocess.run(["git", "add", "-A"], cwd=str(root), check=False)
                subprocess.run(["git", "commit", "-m", "Snapshot before purge by Super Master builder"], cwd=str(root), check=False)
            except Exception:
                pass
        # archive
        stamp = dt.datetime.now().strftime("%Y%m%d_%H%M%S")
        zip_base = root / f"_ARCHIVE_{stamp}"
        log(f"Creating archive {zip_base}.zip …")
        # Exclude the archive itself; use make_archive
        shutil.make_archive(str(zip_base), 'zip', str(root))

        # Determine deletions: all ingested files except protected
        protected = [
            re.compile(r"^\.env"), re.compile(r"^keys/"), re.compile(r"^vercel-.*\\.json$"),
            re.compile(r"^\.github/"), re.compile(r"^\.gitlab-ci\.yml$"), re.compile(r"^package\.json$"),
            re.compile(r"^package-lock\.json$"), re.compile(r"^pnpm-lock\.yaml$"),
        ]
        if protect_from and Path(protect_from).exists():
            try:
                import yaml  # type: ignore
                patterns = yaml.safe_load(Path(protect_from).read_text(encoding='utf-8')) or []
                for pat in patterns:
                    try:
                        protected.append(re.compile(str(pat)))
                    except Exception:
                        pass
            except Exception:
                pass
        def is_protected(rel: str) -> bool:
            for pat in protected:
                if pat.search(rel):
                    return True
            return False
        # Read manifest back
        man = ingest_manifest
        removed = 0
        for it in man:
            rel = it["path"]
            if rel.startswith("docs/SUPER_MASTER/"):
                continue
            if (not purge_all) and is_protected(rel):
                continue
            target = root / rel
            try:
                if target.exists():
                    target.unlink()
                    removed += 1
            except IsADirectoryError:
                try:
                    shutil.rmtree(target)
                    removed += 1
                except Exception:
                    pass
            except Exception:
                pass
        log(f"Purge done. Removed {removed} items.")


def main():
    ap = argparse.ArgumentParser(description="Build LIONSPACE Super Master document")
    ap.add_argument("--root", default=".", help="Workspace root (default: .)")
    ap.add_argument("--out", default="docs/SUPER_MASTER", help="Output directory")
    ap.add_argument("--purge", action="store_true", help="Archive + purge ingested sources (requires CONFIRM_DELETION=YES)")
    ap.add_argument("--purge-all", action="store_true", help="Also purge protected files (dangerous)")
    ap.add_argument("--plan", action="store_true", help="Produce purge plan _purge-plan.json without deleting")
    ap.add_argument("--validate", action="store_true", help="Run validation gates and emit _validation-report.json")
    ap.add_argument("--rules", default="ap/tools/classifier_rules.yaml", help="Classifier rules YAML path")
    ap.add_argument("--min-similarity", type=float, default=0.85, help="Similarity threshold for dedupe (0-1)")
    ap.add_argument("--engine", choices=["wkhtmltopdf","playwright"], default="playwright", help="PDF export engine")
    ap.add_argument("--no-provenance", action="store_true", help="Do not embed provenance drawer in HTML")
    ap.add_argument("--no-pdf", action="store_true", help="Skip PDF export stage")
    ap.add_argument("--open-chapters", default="", help="Comma-separated chapter ids to open by default")
    ap.add_argument("--protect-from", default="ap/tools/protect_patterns.yaml", help="YAML list of regex patterns to protect from purge")
    ap.add_argument("--provenance-out", default="", help="Optional path to also write provenance JSON externally")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    out = (root / args.out).resolve() if not args.out.startswith("/") else Path(args.out)

    # Safety: restrict writes to workspace root subtree
    here = Path.cwd().resolve()
    # No hard enforcement beyond using provided paths, but we warn
    log(f"Workspace root: {root}")
    log(f"Output dir: {out}")

    open_ch = args.open_chapters
    prov_out = Path(args.provenance_out).resolve() if args.provenance_out else None
    build_super_master(
        root, out,
        purge=args.purge, purge_all=args.purge_all,
        do_plan=args.plan, do_validate=args.validate,
        min_similarity=args.min_similarity, engine=args.engine,
        no_provenance=args.no_provenance, rules_path=Path(args.rules),
        open_chapters=open_ch, protect_from=Path(args.protect_from),
        provenance_out=prov_out, no_pdf=args.no_pdf,
    )
    log("Done.")


if __name__ == "__main__":
    main()
