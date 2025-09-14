export const INTELLIGENCE_DATA = {
  // Multilingual rotating messages from cognitive warfare data
  multilingual_messages: [
    {
      id: 1,
      en: "Khamenei declared: the victor of the next war is the one who controls media. The war is already here.",
      he: "חמינאי הצהיר: המנצח במלחמה הבאה יהיה מי ששולט במדיה. המלחמה כבר כאן.",
      ar: "صرح خامنئي: المنتصر في الحرب القادمة هو من يسيطر على الإعلام. الحرب بدأت بالفعل.",
      fr: "Khamenei a déclaré : le vainqueur de la prochaine guerre sera celui qui contrôle les médias. La guerre est déjà là.",
      de: "Khamenei erklärte: Der Sieger des nächsten Krieges ist derjenige, der die Medien kontrolliert. Der Krieg ist bereits da.",
      ru: "Хаменеи заявил: победителем в следующей войне станет тот, кто контролирует СМИ. Война уже началась."
    },
    {
      id: 2,
      en: "The October 7 massacre was launched live on Facebook from Freiburg — and still gained global legitimacy.",
      he: "הטבח ב-7 באוקטובר הוזנק בלייב מפייסבוק מפרייבורג – וקיבל לגיטימציה עולמית.",
      ar: "تم إطلاق مجزرة 7 أكتوبر مباشرة عبر فيسبوك من فرايبورغ — وحصلت مع ذلك على شرعية عالمية.",
      fr: "Le massacre du 7 octobre a été lancé en direct sur Facebook depuis Fribourg — et a tout de même obtenu une légitimité mondiale.",
      de: "Das Massaker vom 7. Oktober wurde live aus Freiburg auf Facebook übertragen — und erhielt dennoch weltweite Legitimität."
    },
    {
      id: 3,
      en: "Information warfare is not coming. It's here.",
      he: "לוחמת המידע לא מגיעה. היא כאן.",
      ar: "الحرب الإعلامية ليست قادمة. إنها هنا.",
      fr: "La guerre de l'information n'arrive pas. Elle est là.",
      de: "Der Informationskrieg kommt nicht. Er ist da.",
      ru: "Информационная война не приближается. Она уже здесь."
    },
    {
      id: 4,
      en: "Truth is pattern. AI sees it.",
      he: "האמת היא תבנית. AI רואה אותה.",
      ar: "الحقيقة نمط. الذكاء الاصطناعي يراها.",
      fr: "La vérité est un modèle. L'IA la voit.",
      de: "Wahrheit ist Muster. KI sieht es.",
      ru: "Истина - это паттерн. ИИ видит её."
    },
    {
      id: 5,
      en: "Reality is what survives the algorithm.",
      he: "המציאות היא מה ששורד את האלגוריתם.",
      ar: "الواقع هو ما ينجو من الخوارزمية.",
      fr: "La réalité est ce qui survit à l'algorithme.",
      de: "Realität ist das, was den Algorithmus überlebt.",
      ru: "Реальность - это то, что выживает после алгоритма."
    },
    {
      id: 6,
      en: "Every click is a vote. Every share is a weapon.",
      he: "כל קליק הוא קול. כל שיתוף הוא נשק.",
      ar: "كل نقرة صوت. كل مشاركة سلاح.",
      fr: "Chaque clic est un vote. Chaque partage est une arme.",
      de: "Jeder Klick ist eine Stimme. Jeder Share ist eine Waffe.",
      ru: "Каждый клик - это голос. Каждый репост - оружие."
    },
    {
      id: 7,
      en: "The narrative shapes reality. Who shapes the narrative?",
      he: "הנרטיב מעצב את המציאות. מי מעצב את הנרטיב?",
      ar: "الرواية تشكل الواقع. من يشكل الرواية؟",
      fr: "Le récit façonne la réalité. Qui façonne le récit ?",
      de: "Das Narrativ formt die Realität. Wer formt das Narrativ?",
      ru: "Нарратив формирует реальность. Кто формирует нарратив?"
    },
    {
      id: 8,
      en: "Digital truth dissolves in real time.",
      he: "האמת הדיגיטלית מתמוססת בזמן אמת.",
      ar: "الحقيقة الرقمية تذوب في الوقت الفعلي.",
      fr: "La vérité numérique se dissout en temps réel.",
      de: "Digitale Wahrheit löst sich in Echtzeit auf.",
      ru: "Цифровая правда растворяется в реальном времени."
    }
  ],

  // Actor network from resistance analysis archive
  fake_resistance_actors: [
    { name: "Jackson Hinkle", platform: "X/Rumble/Telegram", audience: "3.4M", narrative: "Pro‑Iran/Russia; anti‑Israel/West; MAGA‑Communism", affiliation: "Grayzone orbit; RT; Hezbollah/Iran signal‑boost", risk: "HIGH" },
    { name: "Sulaiman Ahmed", platform: "X/Telegram/YouTube", audience: "722K", narrative: "Anti‑Israel; pro‑Resistance Axis", affiliation: "Cited by PressTV/RT Arabic; Quds News synergy", risk: "HIGH" },
    { name: "Khalissee", platform: "X", audience: "376K", narrative: "Anti‑US/West; conspiracist provocations", affiliation: "Cross‑engagement with pro‑Pal networks", risk: "MEDIUM" },
    { name: "Motaz Azaiza", platform: "X/IG", audience: "18.5M", narrative: "Gaza‑centric visual narratives", affiliation: "Broad pro‑Pal ecosystem", risk: "LOW" },
    { name: "Mohamad Safa", platform: "X", audience: "1.3M", narrative: "Pro‑Lebanon/anti‑Israel", affiliation: "Lebanon‑aligned activist media", risk: "LOW" },
    { name: "Anastasia Maria Loupis", platform: "X", audience: "950K", narrative: "Anti‑West/anti‑vax; anti‑Israel spin", affiliation: "Disinfo influencer cluster", risk: "MEDIUM" },
    { name: "Ali‑Akbar Raefipour", platform: "Telegram/X", audience: "~1M", narrative: "Iranian propaganda; conspiracies", affiliation: "Masaf Institute; IRGC orbit", risk: "HIGH" },
    { name: "Mohammed Hijab", platform: "YouTube/X", audience: "1.3M", narrative: "Anti‑Zionist religious content", affiliation: "Debates with pro‑Pal figures", risk: "MEDIUM" },
    { name: "Max Blumenthal", platform: "X/Grayzone", audience: "380K", narrative: "Anti‑Zionist; pro‑Iran/Russia", affiliation: "Grayzone core; MintPress", risk: "HIGH" },
    { name: "Abby Martin", platform: "YouTube/X", audience: "830K", narrative: "Anti‑Israel/West", affiliation: "Links w/ Max Blumenthal, Grayzone", risk: "HIGH" },
    { name: "Rania Khalek", platform: "X/BreakThrough", audience: "285K", narrative: "Pro‑Assad/Iran; anti‑West", affiliation: "With Ben Norton; Grayzone", risk: "HIGH" },
    { name: "Aaron Maté", platform: "X/Grayzone", audience: "460K", narrative: "Anti‑Israel/West", affiliation: "With Blumenthal; RT presence", risk: "HIGH" },
    { name: "Carlos Latuff", platform: "X", audience: "850K", narrative: "Anti‑Israel cartoons", affiliation: "Pro‑Pal artist networks", risk: "MEDIUM" },
    { name: "Ali Abunimah", platform: "X/Electronic Intifada", audience: "230K", narrative: "Anti‑Israel; BDS", affiliation: "EI network", risk: "MEDIUM" },
    // Additional actors from CSV data
    { name: "Quds News Network", platform: "X/Telegram", audience: "2.1M", narrative: "Hamas‑aligned news; anti‑Israel", affiliation: "Amplification accelerator", risk: "HIGH" },
    { name: "Ben Norton", platform: "X/Multipolarista", audience: "320K", narrative: "Pro‑Iran; anti‑West", affiliation: "With Rania Khalek", risk: "HIGH" },
    { name: "Richard Medhurst", platform: "X/YouTube", audience: "480K", narrative: "Pro‑Iran/Syria; anti‑West", affiliation: "Indie media circuit", risk: "HIGH" },
    { name: "Vanessa Beeley", platform: "X/21stCenturyWire", audience: "130K", narrative: "Pro‑Assad; anti‑Israel", affiliation: "Graphika‑flagged networks", risk: "HIGH" },
    { name: "Sarah Abdallah", platform: "X", audience: "500K", narrative: "Pro‑Russia/Assad", affiliation: "Graphika‑flagged networks", risk: "HIGH" },
    { name: "Intel_Sky", platform: "X", audience: "1.2M", narrative: "Mil‑tracking; anti‑West slant", affiliation: "OSINT \"mil\" ecosystem", risk: "MEDIUM" }
  ],

  // Network connections mapping for visualization
  network_connections: {
    "Jackson Hinkle": ["Max Blumenthal", "Rania Khalek", "Quds News Network"],
    "Max Blumenthal": ["Jackson Hinkle", "Abby Martin", "Aaron Maté", "Ben Norton"],
    "Rania Khalek": ["Max Blumenthal", "Ben Norton", "Abby Martin"],
    "Aaron Maté": ["Max Blumenthal", "Abby Martin"],
    "Ben Norton": ["Rania Khalek", "Max Blumenthal"],
    "Abby Martin": ["Max Blumenthal", "Rania Khalek", "Aaron Maté"],
    "Sulaiman Ahmed": ["Jackson Hinkle", "Quds News Network"],
    "Quds News Network": ["Jackson Hinkle", "Sulaiman Ahmed", "Ali‑Akbar Raefipour"],
    "Ali‑Akbar Raefipour": ["Quds News Network"],
    "Vanessa Beeley": ["Sarah Abdallah", "Max Blumenthal"],
    "Sarah Abdallah": ["Vanessa Beeley"],
    "Richard Medhurst": ["Max Blumenthal", "Ben Norton"],
    "Ali Abunimah": ["Carlos Latuff"]
  } as Record<string, string[]>,

  matrix_vocabulary: [
    // Investigation narrative terms
    "orchestrated", "campaign", "disinformation", "networks", "amplification",
    "targeting", "Israeli", "Jewish", "institutions", "social", "media",
    "platforms", "coordinated", "inauthentic", "behavior", "foreign",
    "interference", "propaganda", "manipulation", "psychological", "operations",
    "hybrid", "warfare", "influence", "operations", "active", "measures",
    "dezinformatsiya", "reflexive", "control", "perception", "management",
    
    // Technical terms
    "botnet", "sockpuppet", "astroturfing", "brigading", "dogpiling",
    "sealioning", "concern", "trolling", "false", "flag", "operations",
    "hashtag", "hijacking", "trend", "manipulation", "algorithmic",
    "amplification", "viral", "seeding", "memetic", "warfare", "narrative",
    "laundering", "citation", "circles", "echo", "chambers", "filter",
    "bubbles", "confirmation", "bias", "exploitation", "cognitive", "security",
    
    // Network analysis
    "centrality", "betweenness", "eigenvector", "PageRank", "clustering",
    "coefficient", "modularity", "community", "detection", "small", "world",
    "scale-free", "power", "law", "distribution", "preferential",
    "attachment", "homophily", "triadic", "closure", "structural", "holes",
    "weak", "ties", "strong", "ties", "bridge", "nodes", "hub", "nodes",
    
    // Statistical terms
    "correlation", "causation", "regression", "classification", "clustering",
    "anomaly", "detection", "time", "series", "analysis", "sentiment",
    "analysis", "natural", "language", "processing", "machine", "learning",
    "deep", "learning", "neural", "networks", "transformer", "models",
    
    // Geopolitical context
    "Iran", "Russia", "China", "Hamas", "Hezbollah", "IRGC", "Quds", "Force",
    "axis", "resistance", "proxy", "networks", "state", "sponsored",
    "terrorism", "hybrid", "threats", "gray", "zone", "operations",
    "asymmetric", "warfare", "information", "dominance", "cognitive",
    "warfare", "fifth", "generation", "warfare", "unrestricted", "warfare",
    
    // Primary actors and organizations
    "Jackson", "Hinkle", "Samidoun", "Max", "Blumenthal", "Students",
    "Justice", "Palestine", "SJP", "Quds", "News", "Network", "Sulaiman",
    "Ahmed", "Abby", "Martin", "Rania", "Khalek", "Ali", "Abunimah",
    "Electronic", "Intifada", "Grayzone", "Project", "MintPress", "News",
    "Mondoweiss", "Middle", "East", "Eye", "Palestine", "Chronicle",
    
    // Platform-specific terms
    "Twitter", "X", "Facebook", "Instagram", "TikTok", "YouTube", "Telegram",
    "Discord", "Reddit", "4chan", "8kun", "Gab", "Parler", "Truth", "Social",
    "VKontakte", "Weibo", "algorithm", "engagement", "reach", "impressions",
    "virality", "shadowban", "deplatforming", "community", "guidelines",
    
    // Narrative elements
    "apartheid", "genocide", "ethnic", "cleansing", "colonialism",
    "imperialism", "Zionism", "resistance", "liberation", "decolonization",
    "intersectionality", "solidarity", "BDS", "boycott", "divest",
    "sanction", "normalization", "complicity", "accountability", "justice",
    
    // Operational keywords
    "coordinate", "mobilize", "activate", "deploy", "execute", "implement",
    "disseminate", "proliferate", "infiltrate", "subvert", "disrupt",
    "destabilize", "polarize", "radicalize", "recruit", "indoctrinate",
    
    // Analysis frameworks
    "MICE", "SWOT", "PESTLE", "kill", "chain", "diamond", "model", "MITRE",
    "ATT&CK", "STRIDE", "DREAD", "cyber", "threat", "intelligence",
    "strategic", "operational", "tactical", "attribution", "confidence",
    "levels", "analytical", "confidence", "competing", "hypotheses",
    
    // Tradecraft terms
    "OPSEC", "COMSEC", "PERSEC", "counter-intelligence", "deception",
    "misdirection", "false", "persona", "legend", "building", "backstopping",
    "cutout", "dead", "drop", "brush", "pass", "surveillance", "detection",
    
    // Psychological operations
    "cognitive", "dissonance", "anchoring", "framing", "priming", "nudging",
    "gaslighting", "love", "bombing", "isolation", "dependency",
    "exhaustion", "confusion", "repetition", "emotional", "manipulation",
    
    // Metrics and indicators
    "engagement", "rate", "conversion", "rate", "click-through", "rate",
    "bounce", "rate", "dwell", "time", "share", "voice", "sentiment",
    "score", "influence", "score", "threat", "score", "risk", "assessment",
    
    // Counter-operations
    "prebunking", "debunking", "fact-checking", "counter-narrative",
    "strategic", "communication", "public", "diplomacy", "information",
    "resilience", "media", "literacy", "digital", "hygiene", "cognitive",
    "inoculation", "truth", "sandwich", "contact", "hypothesis",
    
    // Investigation methodology
    "OSINT", "HUMINT", "SIGINT", "GEOINT", "MASINT", "all-source",
    "analysis", "link", "analysis", "pattern", "recognition", "anomaly",
    "detection", "predictive", "analytics", "threat", "hunting", "proactive",
    "defense", "indicator", "warning", "early", "warning", "horizon",
    "scanning", "weak", "signals", "wild", "cards", "black", "swans",
    
    // Legal and ethical considerations
    "Geneva", "Convention", "international", "law", "human", "rights",
    "freedom", "expression", "privacy", "rights", "proportionality",
    "necessity", "discrimination", "precaution", "accountability",
    "transparency", "oversight", "redress", "remedy", "due", "process",
    
    // Technology stack
    "GraphQL", "REST", "API", "websocket", "blockchain", "distributed",
    "ledger", "cryptography", "encryption", "hashing", "digital",
    "signatures", "zero", "knowledge", "proofs", "homomorphic", "encryption",
    "secure", "multi-party", "computation", "differential", "privacy",
    
    // Behavioral indicators
    "posting", "patterns", "temporal", "analysis", "geolocation", "language",
    "patterns", "stylometry", "behavioral", "biometrics", "digital",
    "fingerprinting", "browser", "fingerprinting", "device", "fingerprinting",
    
    // Risk categories
    "immediate", "threat", "elevated", "risk", "moderate", "concern", "low",
    "priority", "monitoring", "required", "active", "investigation",
    "archived", "case", "cold", "case", "reopened", "investigation",
    
    // Organizational structures
    "cell", "structure", "hierarchical", "network", "distributed", "network",
    "leaderless", "resistance", "franchise", "model", "lone", "wolf",
    "inspired", "directed", "enabled", "affiliated", "sympathizer"
  ],
  
  data_categories: {
    primary_actors: [
      "Jackson Hinkle", "Samidoun", "Max Blumenthal", 
      "Students for Justice in Palestine", "Quds News Network",
      "Sulaiman Ahmed", "Abby Martin", "Rania Khalek", 
      "Ali Abunimah", "Dom Lucre", "Sprinter", "Khalissee",
      "Motaz Azaiza", "Mohamad Safa"
    ],
    operation_keywords: [
      "coordinate", "mobilize", "activate", "deploy", "execute",
      "implement", "disseminate", "proliferate", "infiltrate",
      "subvert", "disrupt", "destabilize", "polarize", "radicalize",
      "recruit", "indoctrinate"
    ],
    analysis_terms: [
      "correlation", "regression", "classification", "clustering",
      "anomaly detection", "sentiment analysis", "network analysis",
      "pattern recognition", "threat assessment", "risk scoring",
      "attribution", "confidence levels", "behavioral analysis",
      "temporal patterns"
    ],
    technical_terms: [
      "API", "GraphQL", "WebSocket", "encryption", "blockchain",
      "machine learning", "neural networks", "OSINT", "SIGINT",
      "cryptography", "distributed systems", "data mining"
    ],
    network_terms: [
      "centrality", "betweenness", "eigenvector", "PageRank",
      "clustering coefficient", "modularity", "community detection",
      "small world", "scale-free", "power law", "preferential attachment",
      "homophily"
    ],
    statistical_terms: [
      "correlation", "causation", "regression", "classification",
      "time series", "confidence interval", "p-value", "hypothesis testing",
      "standard deviation", "variance"
    ]
  },
  
  intelligence_panel_data: {
    "Jackson Hinkle": {
      name: "Jackson Hinkle",
      alias: "jacksonhinklle",
      followers: "2.3M+",
      platforms: ["X/Twitter", "Telegram", "YouTube"],
      risk_level: "HIGH",
      keywords: ["Disinfo", "Propaganda", "Amplification"],
      narratives: [
        "Anti-Israel propaganda",
        "Pro-Russia messaging",
        "Conspiracy theories"
      ],
      network_connections: ["Samidoun", "Max Blumenthal", "Quds News Network"],
      activity_summary: "Primary amplifier of hostile narratives with massive reach. Coordinates with known propaganda networks. Suspected foreign backing.",
      last_activity: "Active daily",
      engagement_rate: "8.4%",
      content_frequency: "15-20 posts/day"
    },
    
    "Samidoun": {
      name: "Samidoun Palestinian Prisoner Solidarity Network",
      alias: "samidoun",
      followers: "Distributed network",
      platforms: ["Website", "X/Twitter", "Instagram", "Telegram"],
      risk_level: "HIGH",
      keywords: ["PFLP", "Terrorism", "BDS"],
      narratives: [
        "Support for designated terror groups",
        "Prison activism as cover",
        "Fundraising operations"
      ],
      network_connections: ["PFLP", "Students for Justice in Palestine", "BDS Movement"],
      activity_summary: "Designated terrorist organization in Israel. Links to PFLP. Operates through university chapters across US/EU/Canada.",
      last_activity: "Continuous operations",
      engagement_rate: "Variable by chapter",
      content_frequency: "Event-driven"
    },
    
    "Max Blumenthal": {
      name: "Max Blumenthal",
      alias: "MaxBlumenthal",
      followers: "380K+",
      platforms: ["X/Twitter", "Grayzone Project"],
      risk_level: "HIGH",
      keywords: ["Grayzone", "RT", "Propaganda"],
      narratives: [
        "Anti-Western propaganda",
        "Assad regime support",
        "Conspiracy theories"
      ],
      network_connections: ["Grayzone Project", "RT", "Iranian media"],
      activity_summary: "Founder of Grayzone Project. Regular on Russian/Iranian state media. Promotes authoritarian regimes' narratives.",
      last_activity: "Active daily",
      engagement_rate: "5.2%",
      content_frequency: "8-12 posts/day"
    },
    
    "Students for Justice in Palestine": {
      name: "Students for Justice in Palestine",
      alias: "NationalSJP",
      followers: "200+ chapters",
      platforms: ["Instagram", "X/Twitter", "Campus networks"],
      risk_level: "MEDIUM",
      keywords: ["BDS", "Campus", "Activism"],
      narratives: [
        "Israel apartheid claims",
        "BDS promotion",
        "Disruption tactics"
      ],
      network_connections: ["Samidoun", "AMP", "Faculty advisors"],
      activity_summary: "Largest anti-Israel campus network in US. Coordinates protests and BDS campaigns. Links to external funding sources.",
      last_activity: "Semester-based activity",
      engagement_rate: "High during events",
      content_frequency: "Event-driven"
    },
    
    "Quds News Network": {
      name: "Quds News Network",
      alias: "QudsNen",
      followers: "2.1M+",
      platforms: ["X/Twitter", "Telegram", "Instagram"],
      risk_level: "HIGH",
      keywords: ["Hamas", "PIJ", "Propaganda"],
      narratives: [
        "Hamas talking points",
        "Martyrdom promotion",
        "Atrocity propaganda"
      ],
      network_connections: ["Hamas media", "Iranian networks", "Resistance axis"],
      activity_summary: "Suspected Hamas-affiliated media outlet. Promotes terror group narratives. Spreads unverified claims during conflicts.",
      last_activity: "Active 24/7",
      engagement_rate: "12.3%",
      content_frequency: "30+ posts/day"
    },
    
    "Sulaiman Ahmed": {
      name: "Sulaiman Ahmed",
      alias: "ShaykhSulaiman",
      followers: "450K+",
      platforms: ["X/Twitter", "Instagram"],
      risk_level: "MEDIUM",
      keywords: ["Influencer", "Activism", "Mobilization"],
      narratives: [
        "Religious framing",
        "Emotional appeals",
        "Call to action"
      ],
      network_connections: ["Islamic influencers", "Activist networks"],
      activity_summary: "Uses religious authority for political messaging. Mobilizes followers for protests and campaigns.",
      last_activity: "Active weekly",
      engagement_rate: "6.8%",
      content_frequency: "5-8 posts/day"
    },
    
    "Abby Martin": {
      name: "Abby Martin",
      alias: "AbbyMartin",
      followers: "260K+",
      platforms: ["X/Twitter", "YouTube", "Podcast"],
      risk_level: "MEDIUM",
      keywords: ["RT America", "Empire Files", "Propaganda"],
      narratives: [
        "Anti-imperialism",
        "Revolutionary rhetoric",
        "Conspiracy theories"
      ],
      network_connections: ["RT", "TeleSUR", "Alternative media"],
      activity_summary: "Former RT America host. Produces anti-Western content. Regular on adversarial state media.",
      last_activity: "Active weekly",
      engagement_rate: "4.5%",
      content_frequency: "3-5 posts/day"
    },
    
    "Rania Khalek": {
      name: "Rania Khalek",
      alias: "RaniaKhalek",
      followers: "180K+",
      platforms: ["X/Twitter", "YouTube", "BreakThrough News"],
      risk_level: "MEDIUM",
      keywords: ["BreakThrough", "Syria", "Propaganda"],
      narratives: [
        "Assad regime support",
        "Anti-opposition messaging",
        "Resistance axis promotion"
      ],
      network_connections: ["BreakThrough News", "Grayzone", "RT"],
      activity_summary: "Promotes authoritarian regimes. Denies atrocities in Syria. Part of coordinated media network.",
      last_activity: "Active daily",
      engagement_rate: "3.8%",
      content_frequency: "6-10 posts/day"
    },
    
    "Ali Abunimah": {
      name: "Ali Abunimah",
      alias: "AliAbunimah",
      followers: "320K+",
      platforms: ["X/Twitter", "Electronic Intifada"],
      risk_level: "MEDIUM",
      keywords: ["Electronic Intifada", "BDS", "One-state"],
      narratives: [
        "One-state solution",
        "Right of return",
        "Anti-normalization"
      ],
      network_connections: ["Electronic Intifada", "BDS Movement", "Palestinian diaspora"],
      activity_summary: "Founder of Electronic Intifada. Promotes BDS and one-state solution. Opposes peace initiatives.",
      last_activity: "Active daily",
      engagement_rate: "4.2%",
      content_frequency: "8-12 posts/day"
    },
    
    "Dom Lucre": {
      name: "Dom Lucre",
      alias: "dom_lucre",
      followers: "1.2M+",
      platforms: ["X/Twitter"],
      risk_level: "MEDIUM",
      keywords: ["Conspiracy", "Disinfo", "Viral"],
      narratives: [
        "Conspiracy theories",
        "Antisemitic tropes",
        "False flag claims"
      ],
      network_connections: ["Conspiracy networks", "QAnon adjacent"],
      activity_summary: "Spreads conspiracy theories and disinformation. Uses current events to promote antisemitic narratives.",
      last_activity: "Active daily",
      engagement_rate: "7.1%",
      content_frequency: "10-15 posts/day"
    },
    
    "Sprinter": {
      name: "Sprinter",
      alias: "Sprinter99880",
      followers: "890K+",
      platforms: ["X/Twitter"],
      risk_level: "MEDIUM",
      keywords: ["Breaking", "Unverified", "Amplification"],
      narratives: [
        "Breaking news claims",
        "Unverified reports",
        "Emotional content"
      ],
      network_connections: ["News aggregators", "Amplification networks"],
      activity_summary: "Rapid dissemination of unverified information. Part of coordinated amplification network.",
      last_activity: "Active hourly",
      engagement_rate: "9.3%",
      content_frequency: "40+ posts/day"
    },
    
    "Khalissee": {
      name: "Khalissee",
      alias: "Kahlissee",
      followers: "540K+",
      platforms: ["X/Twitter", "Instagram"],
      risk_level: "LOW",
      keywords: ["Activism", "Solidarity", "Awareness"],
      narratives: [
        "Humanitarian focus",
        "Solidarity messaging",
        "Awareness campaigns"
      ],
      network_connections: ["Activist networks", "NGOs"],
      activity_summary: "Focus on humanitarian aspects. Less political than others. Amplifies mainstream narratives.",
      last_activity: "Active weekly",
      engagement_rate: "5.5%",
      content_frequency: "3-5 posts/day"
    },
    
    "Motaz Azaiza": {
      name: "Motaz Azaiza",
      alias: "MotazAzaiza",
      followers: "18M+",
      platforms: ["Instagram", "X/Twitter"],
      risk_level: "LOW",
      keywords: ["Photographer", "Gaza", "Documentation"],
      narratives: [
        "Visual documentation",
        "Personal stories",
        "Humanitarian crisis"
      ],
      network_connections: ["Media outlets", "NGOs", "Photographers"],
      activity_summary: "Photojournalist documenting Gaza. Massive Instagram following. Focus on humanitarian impact.",
      last_activity: "Event-based",
      engagement_rate: "15.2%",
      content_frequency: "Variable"
    },
    
    "Mohamad Safa": {
      name: "Mohamad Safa",
      alias: "mhdksafa",
      followers: "720K+",
      platforms: ["X/Twitter", "Instagram"],
      risk_level: "LOW",
      keywords: ["Lebanon", "Updates", "Regional"],
      narratives: [
        "Regional updates",
        "Lebanon focus",
        "Humanitarian concerns"
      ],
      network_connections: ["Lebanese media", "Regional networks"],
      activity_summary: "Focus on Lebanon and regional issues. Provides updates during conflicts. Mixed political messaging.",
      last_activity: "Active daily",
      engagement_rate: "4.8%",
      content_frequency: "5-10 posts/day"
    }
  }
}