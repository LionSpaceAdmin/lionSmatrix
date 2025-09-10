import { OSINTActor, DeepDive } from '@/types/intelligence';

// Extended OSINT data from the new code
export const extendedOsintData: OSINTActor[] = [
  { 
    Name: "Jackson Hinkle", 
    Platform: "X / Rumble", 
    Audience: 3400000, 
    Narrative: "Pro-Iran/Russia", 
    Affiliation: "Grayzone orbit; RT" 
  },
  { 
    Name: "Sulaiman Ahmed", 
    Platform: "X / Telegram", 
    Audience: 722000, 
    Narrative: "Anti-Israel", 
    Affiliation: "PressTV/RT Arabic" 
  },
  { 
    Name: "Khalissee", 
    Platform: "X", 
    Audience: 376000, 
    Narrative: "Anti-US/West", 
    Affiliation: "Pro-Pal networks" 
  },
  { 
    Name: "Motaz Azaiza", 
    Platform: "X / IG", 
    Audience: 18500000, 
    Narrative: "Gaza-centric visual", 
    Affiliation: "Broad pro-Pal ecosystem" 
  },
  { 
    Name: "Mohamad Safa", 
    Platform: "X", 
    Audience: 1300000, 
    Narrative: "Pro-Lebanon/anti-Israel", 
    Affiliation: "Lebanon-aligned media" 
  },
  { 
    Name: "Anastasia Maria Loupis", 
    Platform: "X", 
    Audience: 950000, 
    Narrative: "Anti-West/anti-vax", 
    Affiliation: "Disinfo influencer cluster" 
  },
  { 
    Name: "Quds News Network", 
    Platform: "X / Telegram", 
    Audience: 2100000, 
    Narrative: "Hamas-aligned news", 
    Affiliation: "Amplification accelerator" 
  },
  { 
    Name: "The Grayzone", 
    Platform: "Web / X", 
    Audience: 800000, 
    Narrative: "Pro-Russia/Iran/Assad", 
    Affiliation: "Core Hub" 
  },
  { 
    Name: "MintPress News", 
    Platform: "Web / X", 
    Audience: 750000, 
    Narrative: "Pro-Russia; anti-Israel", 
    Affiliation: "Core Hub" 
  }
];

export const deepDives: Record<string, DeepDive> = {
  "Jackson Hinkle": {
    prompt: "Conduct a full digital influence profile on Jackson Hinkle. Analyze ideological narrative, tone of content, affiliations, signal amplification patterns, engagement metrics, use of hashtags, interactions with known pro-Iranian or anti-Israel actors, and any indications of bot support or inorganic reach. Include timeline of activity since October 2023.",
    report: `<h3>Biographical Background</h3><p>Jackson Hinkle is an American political influencer, born in September 1999. His political journey spans from progressive environmentalism to "MAGA Communism" and open alliances with Russia, Iran, Hezbollah, Hamas, and the Houthis.</p><h3>Political and Public Activity</h3><p>The Gaza war in October 2023 marked his breakthrough, with his X following soaring from ~417,000 to over 2.3 million by December 2023. He launched the show 'Legitimate Targets' on X, rapidly becoming one of the platform's most viral accounts.</p><h3>Links to Political, State, and Ideological Actors</h3><p>Hinkle has openly supported Kremlin narratives and embraced Iran's "Axis of Resistance." In February 2025, he traveled to Lebanon and later interviewed Hamas politburo member Dr. Basem Naim in Doha, Qatar. He acts as a "multiplier" for Russian and Iranian propaganda in English.</p>`
  },
  "Sulaiman Ahmed": {
    prompt: "Generate comprehensive intelligence profile on Sulaiman Ahmed focusing on network analysis, content patterns, and influence operations.",
    report: `<h3>Profile Overview</h3><p>Sulaiman Ahmed operates as a key node in the anti-Israel disinformation network with direct connections to Iranian and Russian state media outlets.</p><h3>Network Analysis</h3><p>Strong correlations with PressTV and RT Arabic content timing. Coordinated amplification patterns detected with other actors in the network.</p><h3>Influence Operations</h3><p>Utilizes religious framing to legitimize political narratives. Engagement patterns suggest use of amplification networks.</p>`
  },
  "Quds News Network": {
    prompt: "Analyze Quds News Network operations, funding sources, content coordination patterns, and relationship with designated terror organizations.",
    report: `<h3>Operational Overview</h3><p>Quds News Network functions as a primary distribution hub for Hamas-aligned narratives with sophisticated multi-platform presence.</p><h3>Content Coordination</h3><p>Analysis reveals coordinated content releases timed with Hamas political announcements. Direct messaging alignment with PIJ and Hamas military wings.</p><h3>Network Infrastructure</h3><p>Operates through distributed Telegram channels with backup domains. Utilizes bot networks for initial content seeding.</p>`
  }
};

export const wordBank = [
  'Jackson Hinkle', 
  'MAGA Communism', 
  'Hezbollah', 
  'Hamas', 
  'Moscow', 
  'Rumble', 
  'The Dive', 
  'Propaganda', 
  'Axis of Resistance', 
  'Disinformation', 
  'The Grayzone', 
  'RT', 
  '#GazaGenocide', 
  'Samidoun', 
  'SJP', 
  'Sulaiman Ahmed', 
  'Quds News', 
  'Bot Network', 
  'Sockpuppet', 
  'Amplification', 
  'IUVM', 
  'PressTV',
  'Information Warfare',
  'Cognitive Security',
  'Narrative Laundering',
  'Coordinated Inauthentic Behavior',
  'Foreign Interference',
  'Hybrid Warfare',
  'Active Measures',
  'Reflexive Control',
  'Memetic Warfare',
  'Astroturfing',
  'Brigade',
  'False Flag',
  'OSINT',
  'SIGINT',
  'Network Analysis',
  'Threat Assessment',
  'Attribution',
  'Confidence Levels'
];