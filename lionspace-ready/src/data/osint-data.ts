export interface OSINTActor {
  Name: string;
  Platform: string;
  Audience: number;
  Narrative: string;
  Affiliation: string;
}

export interface DeepDiveData {
  prompt: string;
  report: string;
}

export const osintData: OSINTActor[] = [
  { 
    "Name": "Jackson Hinkle", 
    "Platform": "X / Rumble", 
    "Audience": 3400000, 
    "Narrative": "Pro-Iran/Russia", 
    "Affiliation": "Grayzone orbit; RT" 
  },
  { 
    "Name": "Sulaiman Ahmed", 
    "Platform": "X / Telegram", 
    "Audience": 722000, 
    "Narrative": "Anti-Israel", 
    "Affiliation": "PressTV/RT Arabic" 
  },
  { 
    "Name": "Khalissee", 
    "Platform": "X", 
    "Audience": 376000, 
    "Narrative": "Anti-US/West", 
    "Affiliation": "Pro-Pal networks" 
  },
  { 
    "Name": "Motaz Azaiza", 
    "Platform": "X / IG", 
    "Audience": 18500000, 
    "Narrative": "Gaza-centric visual", 
    "Affiliation": "Broad pro-Pal ecosystem" 
  },
  { 
    "Name": "Mohamad Safa", 
    "Platform": "X", 
    "Audience": 1300000, 
    "Narrative": "Pro-Lebanon/anti-Israel", 
    "Affiliation": "Lebanon-aligned media" 
  },
  { 
    "Name": "Anastasia Maria Loupis", 
    "Platform": "X", 
    "Audience": 950000, 
    "Narrative": "Anti-West/anti-vax", 
    "Affiliation": "Disinfo influencer cluster" 
  },
  { 
    "Name": "Quds News Network", 
    "Platform": "X / Telegram", 
    "Audience": 2100000, 
    "Narrative": "Hamas-aligned news", 
    "Affiliation": "Amplification accelerator" 
  },
  { 
    "Name": "The Grayzone", 
    "Platform": "Web / X", 
    "Audience": 800000, 
    "Narrative": "Pro-Russia/Iran/Assad", 
    "Affiliation": "Core Hub" 
  },
  { 
    "Name": "MintPress News", 
    "Platform": "Web / X", 
    "Audience": 750000, 
    "Narrative": "Pro-Russia; anti-Israel", 
    "Affiliation": "Core Hub" 
  }
];

export const deepDives: Record<string, DeepDiveData> = {
  "Jackson Hinkle": {
    prompt: "Conduct a full digital influence profile on Jackson Hinkle. Analyze ideological narrative, tone of content, affiliations, signal amplification patterns, engagement metrics, use of hashtags, interactions with known pro-Iranian or anti-Israel actors, and any indications of bot support or inorganic reach. Include timeline of activity since October 2023.",
    report: `<h3>Biographical Background</h3><p>Jackson Hinkle is an American political influencer, born in September 1999. His political journey spans from progressive environmentalism to "MAGA Communism" and open alliances with Russia, Iran, Hezbollah, Hamas, and the Houthis.</p><h3>Political and Public Activity</h3><p>The Gaza war in October 2023 marked his breakthrough, with his X following soaring from ~417,000 to over 2.3 million by December 2023. He launched the show 'Legitimate Targets' on X, rapidly becoming one of the platform's most viral accounts.</p><h3>Links to Political, State, and Ideological Actors</h3><p>Hinkle has openly supported Kremlin narratives and embraced Iran's "Axis of Resistance." In February 2025, he traveled to Lebanon and later interviewed Hamas politburo member Dr. Basem Naim in Doha, Qatar. He acts as a "multiplier" for Russian and Iranian propaganda in English.</p>`
  }
};

// Utility functions
export function formatAudience(audience: number): string {
  return audience > 1000000 
    ? `${(audience / 1000000).toFixed(1)}M` 
    : `${Math.round(audience / 1000)}K`;
}

export function searchActors(searchTerm: string, data: OSINTActor[]): OSINTActor[] {
  const term = searchTerm.toLowerCase();
  return data.filter(actor => 
    actor.Name.toLowerCase().includes(term) ||
    actor.Platform.toLowerCase().includes(term) ||
    actor.Narrative.toLowerCase().includes(term)
  );
}