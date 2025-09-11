# #FakeResistance - OSINT Research & JSON Export

## פרויקט מחקר OSINT מקיף לזיהוי נרטיבים מטעים ברשתות חברתיות

### מטרת הפרויקט

הרצת תוכנית OSINT קפדנית ונשחזרת למיפוי האופן בו נרטיבים מטעים מלהיבים הפגנות גלובליות. פלט עבור כל חקירה: קובץ JSON יחיד ועצמאי שהאתר Next.js שלנו יכול לעבד.

### מגבלות הגנה (לא ניתנות למשא ומתן)

- **OSINT בלבד**: אין PII/doxxing. אין האשמות בלתי ניתנות לאימות
- **כל טענה** חייבת לכלול לפחות URL מקור אחד או snapshot ארכיון + ציון אמינות
- **עומק חובה**: ראיות חוצות פלטפורמות (≥3 פלטפורמות), מדדי SNA, ניתוח נרטיבים וקמפיינים, סימני בוטים/CIB, ציר זמן, והשערות מוניטיזציה
- **אנגלית** לכל הממצאים/JSON. תאריכי ISO. `"status" ∈ {planned, in_progress, complete}`

---

## חוזה פלט קפדני (לכל חקירה)

### שם קובץ
```
investigations/<stable_id>.vYYYYMMDD.json
```

### JSON Schema

```json
{
  "meta": {
    "project": "#FakeResistance",
    "version": "YYYY-MM-DD",
    "generator": "Claude"
  },
  "entity": {
    "stable_id": "string",
    "name": "string", 
    "type": "person|org|channel|site",
    "platforms": ["string"],
    "handles": [
      {
        "platform": "string",
        "handle": "string", 
        "url": "string"
      }
    ],
    "audience": [
      {
        "platform": "string",
        "count": 0,
        "as_of": "YYYY-MM-DD"
      }
    ],
    "languages": ["string"],
    "countries": ["string"],
    "affiliations": ["string"]
  },
  "findings": {
    "summary": "<2–4 sentence executive brief>",
    "key_findings": ["string"],
    "narratives": ["string"],
    "hashtags": ["string"],
    "timeline": [
      {
        "ts": "ISO8601",
        "event": "string",
        "link": "string"
      }
    ],
    "sna": {
      "nodes": [
        {
          "id": "string",
          "type": "actor|org"
        }
      ],
      "edges": [
        {
          "src": "string",
          "dst": "string",
          "type": "mention|repost|quote|link",
          "weight": 1
        }
      ],
      "metrics": {
        "degree": 0,
        "betweenness": 0,
        "community": 0
      }
    },
    "bot_cib": {
      "signals": ["string"],
      "bot_likelihood": 0.0,
      "engagement_hygiene": 0.0
    },
    "monetization": ["string"],
    "claims": [
      {
        "id": "string",
        "text": "string",
        "topic": "string",
        "stance": "for|against|neutral",
        "confidence": "low|medium|high",
        "evidence_ids": ["string"]
      }
    ],
    "evidence": [
      {
        "id": "string",
        "url": "string",
        "snapshot": "<path/archived-url>",
        "captured_at": "ISO8601",
        "note": "string"
      }
    ],
    "sample_posts": [
      {
        "platform": "string",
        "url": "string",
        "ts": "ISO8601",
        "text": "string",
        "media_hash": "string"
      }
    ],
    "risk_notes": "string",
    "status": "planned|in_progress|complete",
    "last_updated": "YYYY-MM-DD"
  }
}
```

---

## אכיפת עומק - ספים חובה

Claude חייב לעמוד בכל הספים הבאים (אלא אם לא ישים — ואז להסביר מדוע):

1. **כיסוי פלטפורמות**: ≥3 פלטפורמות (X/Telegram/YouTube/TikTok/Instagram/Facebook/Web)
2. **ציטוטים והוכחות**: ≥20 פריטי Evidence ייחודיים (URL או snapshot), מתוכם ≥5 ממקורות שאינם רשתות חברתיות
3. **SNA**: ≥25 קצוות (edges) ברשת ההפצה + מדדי degree/betweenness + קהילות (Leiden/Louvain)
4. **נרטיבים/קמפיינים**: ≥5 נרטיבים חוזרים + זוג האשטגים לכל נרטיב + יישור לציר-זמן (לפחות 2 "שיאים")
5. **Bot/CIB**: 3+ אינדיקציות מבוססות-דפוס + ציון bot_likelihood & engagement_hygiene
6. **מוניטיזציה**: מיפוי נתיבי הכנסה פומביים או ציון "none observed"
7. **תיקוף אנושי**: Self-audit של 10 דגימות + סימון "Limitations"

⚠️ **אם Claude לא עומד בספים** — עליו לכתוב `"status":"in_progress"` ולהוסיף שדה `"missing_evidence_note"` זמני

---

## QA Rubric (ציון חייב ≥ 85/100)

- **Evidence coverage (0–25)**: כמות/גיוון/רעננות + snapshots
- **SNA quality (0–20)**: מתודולוגיה + מטריקות + תרשים/תיאור הקלאסטרים
- **Narrative/campaigns (0–15)**: זיהוי האשטגים, סיפורי-מסגרת, יישור לציר-זמן
- **Bot/CIB signals (0–15)**: סימנים מדידים + זהירות מסקנה
- **Monetization (0–10)**: איתור נתיבים + שקיפות מגבלות
- **Clarity & JSON validity (0–15)**: סכמות תקינות, שדות מלאים, סיכום מנהלים חד

---

## Self-Audit Checklist (שלב חובה לפני יצוא)

```
[Auditor Checklist]
1) JSON validates? (yes/no, show field errors)
2) Evidence count >= 20? Non-social sources >= 5? Snapshots present?
3) Platforms covered >= 3?
4) SNA edges >= 25? Metrics computed?
5) Narratives >= 5? Peaks >= 2?
6) Bot/CIB signals >= 3 indicators?
7) Monetization mapped or "none observed" noted?
8) Confidence labels present for all claims?
9) Limitations explicitly stated?
```

⚠️ אם "no" באחד הסעיפים — לתקן ולהריץ שוב. רק אז לסמן `"status":"complete"`

---

## Prompt Templates

### 1. System (קבוע לפרויקט)
```
You are a rigorous OSINT research agent. Produce maximum-depth, source-backed investigations that meet strict thresholds and output as a single JSON file per target. Label confidence per claim. No PII/doxxing. When thresholds are unmet, mark status="in_progress" and list missing_evidence_note.
```

### 2. User (לכל יעד/שם)
```
Target: <NAME / stable_id>.
Task: Produce a COMPLETE investigation per the project's Output Contract and Depth Enforcement thresholds.
Requirements:
- Cover at least 3 platforms and collect >=20 distinct evidence items (>=5 non-social).
- Build an SNA section with >=25 edges and compute degree/betweenness/community.
- Extract >=5 recurring narratives + hashtags; align with a timeline (>=2 peaks).
- Identify bot/CIB signals (>=3) and monetization paths (if any).
- Provide claims[] with confidence and map to evidence_ids[].
- Finish with a Self-Audit checklist; only then set status="complete".
Return: ONE JSON object only. No prose outside JSON.
```

### 3. Repair/Audit (אם נכשל)
```
Your previous JSON failed: <validator errors>.
Fix the errors, increase evidence to meet thresholds, recompute SNA metrics, and rerun the Self-Audit. Return the corrected single JSON only.
```

---

## רשימת 50 יעדי חקירה

### קטגוריה A: יעדים אישיים מרכזיים (10 יעדים)
1. **Jackson Hinkle** - `jackson_hinkle_v20241211`
2. **Max Blumenthal** - `max_blumenthal_v20241211`
3. **Abby Martin** - `abby_martin_v20241211`
4. **Rania Khalek** - `rania_khalek_v20241211`
5. **Ali Abunimah** - `ali_abunimah_v20241211`
6. **Mohammad Safa** - `mohammad_safa_v20241211`
7. **Motaz Azaiza** - `motaz_azaiza_v20241211`
8. **Dom Lucre** - `dom_lucre_v20241211`
9. **Sulaiman Ahmed** - `sulaiman_ahmed_v20241211`
10. **Khalissee** - `khalissee_v20241211`

### קטגוריה B: רשתות וארגונים (6 יעדים)
11. **Quds News Network** - `quds_news_network_v20241211`
12. **Samidoun** - `samidoun_v20241211`
13. **Students for Justice in Palestine (SJP)** - `sjp_network_v20241211`
14. **The Grayzone** - `the_grayzone_v20241211`
15. **Electronic Intifada** - `electronic_intifada_v20241211`
16. **Rumble Platform** - `rumble_platform_v20241211`

### קטגוריה C: יעדים משניים (3 יעדים)
17. **AjaxAbunimeanthal** - `ajax_abunimea_v20241211`
18. **Safi** - `safi_v20241211`
19. **Sprinter** - `sprinter_v20241211`

### קטגוריה D: רשתות גיאופוליטיות (3 יעדים)
20. **Moscow Connection Network** - `moscow_network_v20241211`
21. **Iran/Resistance Axis Network** - `iran_axis_v20241211`
22. **Hamas/Gaza Network** - `hamas_gaza_v20241211`

### קטגוריה E: נרטיבים וקמפיינים (5 יעדים)
23. **"MAGA Communism" Narrative** - `maga_communism_v20241211`
24. **"Age of Resistance" Campaign** - `age_resistance_v20241211`
25. **"AI/Truth Pattern" Narrative** - `ai_truth_pattern_v20241211`
26. **Anti-Ukrainian Narrative Network** - `anti_ukraine_v20241211`
27. **"Open Source Intelligence" Weaponization** - `osint_weapon_v20241211`

### קטגוריה F: פלטפורמות וטכנולוגיות (3 יעדים)
28. **Telegram Ecosystem Analysis** - `telegram_ecosystem_v20241211`
29. **TikTok Narrative Propagation** - `tiktok_narrative_v20241211`
30. **YouTube Alternative Platform Network** - `youtube_alt_v20241211`

### קטגוריה G: מימון ומוניטיזציה (3 יעדים)
31. **Cryptocurrency Funding Networks** - `crypto_funding_v20241211`
32. **Patreon/Crowdfunding Ecosystem** - `crowdfunding_eco_v20241211`
33. **Speaking Circuit/Conference Network** - `speaking_circuit_v20241211`

### קטגוריה H: יעדים אישיים נוספים (3 יעדים)
34. **Nasrallah (Hassan Nasrallah)** - `nasrallah_amplify_v20241211`
35. **Ben Norton** - `ben_norton_v20241211`
36. **Aaron Maté** - `aaron_mate_v20241211`

### קטגוריה I: רשתות תוכן מתמחות (3 יעדים)
37. **Middle East Eye** - `middle_east_eye_v20241211`
38. **Al Jazeera English Alternative Network** - `aj_alt_network_v20241211`
39. **Mondoweiss** - `mondoweiss_v20241211`

### קטגוריה J: פלטפורמות חלופיות ותשתיות (3 יעדים)
40. **BitChute Network** - `bitchute_network_v20241211`
41. **Substack Ecosystem** - `substack_ecosystem_v20241211`
42. **Discord/Private Server Networks** - `discord_networks_v20241211`

### קטגוריה K: נרטיבים ייחודיים נוספים (3 יעדים)
43. **"Analyzing Sour" (Phrase Pattern)** - `analyzing_sour_v20241211`
44. **"Terminal/Hive Mind" Collective Narratives** - `terminal_hive_v20241211`
45. **"Warrior of Consciousness" Recruitment** - `warrior_consciousness_v20241211`

### קטגוריה L: יעדים טכנולוגיים/מתודולוגיים (3 יעדים)
46. **Bot Network Analysis (Cross-Platform)** - `bot_network_analysis_v20241211`
47. **Hashtag Campaign Coordination** - `hashtag_coordination_v20241211`
48. **Deepfake/Synthetic Media Detection** - `deepfake_detection_v20241211`

### קטגוריה M: יעדים אקדמיים/מחקריים (2 יעדים)
49. **Academic Legitimacy Network** - `academic_legitimacy_v20241211`
50. **Think Tank/NGO Connections** - `thinktank_ngo_v20241211`

---

## TODO List Tracking

### חובות עדכון TODO
- **אחרי כל deep research**: עדכן סטטוס החקירה
- **לפני תחילת חקירה חדשה**: סמן כ-`in_progress`
- **אחרי השלמת חקירה**: סמן כ-`complete` רק אם עבר Self-Audit
- **אם נכשל בספים**: סמן כ-`in_progress` + הסבר בתיק המחקר

### מבנה TODO עבור כל יעד
```
- [ ] [Category X] Target Name - Research Phase
- [ ] [Category X] Target Name - SNA Analysis  
- [ ] [Category X] Target Name - Evidence Collection
- [ ] [Category X] Target Name - JSON Export & Validation
- [ ] [Category X] Target Name - Self-Audit & QA
```

---

## Mini-Validator (לביצוע לפני סיום)

### בדיקות ספירה
- [ ] Evidence ≥20
- [ ] Non-social sources ≥5  
- [ ] Platforms ≥3
- [ ] SNA edges ≥25
- [ ] Narratives ≥5
- [ ] Timeline peaks ≥2
- [ ] Bot indicators ≥3

### בדיקות שדות
- [ ] Meta/entity/findings - כל השדות הדרושים קיימים
- [ ] תאריכים בפורמט ISO8601
- [ ] last_updated ≤ 60 ימים

---

## הנחיות ביצוע

1. **התחל בחקירות בעדיפות גבוהה** (קטגוריה A)
2. **עדכן TODO בזמן אמת** אחרי כל שלב
3. **אל תסמן 'complete' אלא אם עבר Self-Audit**
4. **שמור JSON files בתיקיה `investigations/`**
5. **תעד מגבלות ובעיות בכל חקירה**

---

**נוצר**: 2025-01-11  
**סטטוס פרויקט**: מוכן לביצוע  
**יעדים כוללים**: 50 חקירות OSINT מעמיקות