export type Narrative = {
  id: string;
  title: string;
  summary: string;
  evidenceCount: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  lastUpdated: string;
  verdict: 'Verified False' | 'In Dispute' | 'Unverified';
};

export const narratives: Narrative[] = [
  {
    id: 'narrative-1',
    title: 'Misinformation Campaign Targets Election Infrastructure',
    summary: 'A coordinated campaign is spreading false claims about the vulnerability of voting machines to manipulate public opinion.',
    evidenceCount: 14,
    severity: 'Critical',
    lastUpdated: '2 hours ago',
    verdict: 'Verified False',
  },
  {
    id: 'narrative-2',
    title: 'Deepfakes Used in Political Smear Ads',
    summary: 'Advanced deepfake technology is being used to create convincing but fabricated videos of political candidates.',
    evidenceCount: 8,
    severity: 'High',
    lastUpdated: '1 day ago',
    verdict: 'Verified False',
  },
  {
    id: 'narrative-3',
    title: 'Health Disinformation on Social Media',
    summary: 'False health advice and conspiracy theories about a new virus are spreading rapidly on major social media platforms.',
    evidenceCount: 23,
    severity: 'High',
    lastUpdated: '5 hours ago',
    verdict: 'In Dispute',
  },
  {
    id: 'narrative-4',
    title: 'Foreign Influence Operation Detected',
    summary: 'A state-sponsored actor is attempting to sow discord by amplifying divisive social issues.',
    evidenceCount: 5,
    severity: 'Medium',
    lastUpdated: '3 days ago',
    verdict: 'Unverified',
  },
    {
    id: 'narrative-5',
    title: 'Financial Scam Promoted via Compromised Accounts',
    summary: 'Scammers are using hacked celebrity accounts to promote fraudulent cryptocurrency investment schemes.',
    evidenceCount: 19,
    severity: 'Medium',
    lastUpdated: '8 hours ago',
    verdict: 'Verified False',
  },
  {
    id: 'narrative-6',
    title: 'Claim of Sabotaged Water Supply',
    summary: 'Unverified claims of intentional contamination of a municipal water supply are causing local panic.',
    evidenceCount: 3,
    severity: 'Low',
    lastUpdated: '2 days ago',
    verdict: 'Unverified',
  },
];

export const actions = [
    {
        title: "Fact-Check",
        description: "Verify claims and evidence.",
        icon: "CheckCircle",
        href: "#", // Should be /dashboard/tools/fact-check
    },
    {
        title: "Report Fake",
        description: "Submit suspicious content.",
        icon: "Flag",
        href: "#", // Should be /dashboard/tools/report-research
    },
    {
        title: "Daily Brief",
        description: "Get the latest summary.",
        icon: "BookOpen",
        href: "/daily-brief",
    },
    {
        title: "Join",
        description: "Become part of the mission.",
        icon: "UserPlus",
        href: "/auth/join",
    }
];

export const dailyBriefData = {
  narratives: narratives.slice(0, 5).map(n => n.title),
  actions: actions.map(a => `${a.title}: ${a.description}`),
};

export type OsintActor = {
  Name: string;
  Platform: string;
  Audience: number;
  Narrative: string;
  Affiliation: string;
};

export const osintData: OsintActor[] = [
    { "Name": "Jackson Hinkle", "Platform": "X / Rumble", "Audience": 3400000, "Narrative": "Pro-Iran/Russia", "Affiliation": "Grayzone orbit; RT" },
    { "Name": "Sulaiman Ahmed", "Platform": "X / Telegram", "Audience": 722000, "Narrative": "Anti-Israel", "Affiliation": "PressTV/RT Arabic" },
    { "Name": "Khalissee", "Platform": "X", "Audience": 376000, "Narrative": "Anti-US/West", "Affiliation": "Pro-Pal networks" },
    { "Name": "Motaz Azaiza", "Platform": "X / IG", "Audience": 18500000, "Narrative": "Gaza-centric visual", "Affiliation": "Broad pro-Pal ecosystem" },
    { "Name": "Mohamad Safa", "Platform": "X", "Audience": 1300000, "Narrative": "Pro-Lebanon/anti-Israel", "Affiliation": "Lebanon-aligned media" },
    { "Name": "Anastasia Maria Loupis", "Platform": "X", "Audience": 950000, "Narrative": "Anti-West/anti-vax", "Affiliation": "Disinfo influencer cluster" },
    { "Name": "Quds News Network", "Platform": "X / Telegram", "Audience": 2100000, "Narrative": "Hamas-aligned news", "Affiliation": "Amplification accelerator" },
    { "Name": "The Grayzone", "Platform": "Web / X", "Audience": 800000, "Narrative": "Pro-Russia/Iran/Assad", "Affiliation": "Core Hub" },
    { "Name": "MintPress News", "Platform": "Web / X", "Audience": 750000, "Narrative": "Pro-Russia; anti-Israel", "Affiliation": "Core Hub" }
];
