import { RiskLevel } from '@lionspace/core';

export const FAKE_RESISTANCE_ACTORS = [
  { 
    name: "Jackson Hinkle", 
    platform: "X/Rumble/Telegram", 
    audience: "3.4M", 
    narrative: "Pro‑Iran/Russia; anti‑Israel/West; MAGA‑Communism", 
    affiliation: "Grayzone orbit; RT; Hezbollah/Iran signal‑boost", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Sulaiman Ahmed", 
    platform: "X/Telegram/YouTube", 
    audience: "722K", 
    narrative: "Anti‑Israel; pro‑Resistance Axis", 
    affiliation: "Cited by PressTV/RT Arabic; Quds News synergy", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Khalissee", 
    platform: "X", 
    audience: "376K", 
    narrative: "Anti‑US/West; conspiracist provocations", 
    affiliation: "Cross‑engagement with pro‑Pal networks", 
    risk: RiskLevel.MEDIUM 
  },
  { 
    name: "Motaz Azaiza", 
    platform: "X/IG", 
    audience: "18.5M", 
    narrative: "Gaza‑centric visual narratives", 
    affiliation: "Broad pro‑Pal ecosystem", 
    risk: RiskLevel.LOW 
  },
  { 
    name: "Mohamad Safa", 
    platform: "X", 
    audience: "1.3M", 
    narrative: "Pro‑Lebanon/anti‑Israel", 
    affiliation: "Lebanon‑aligned activist media", 
    risk: RiskLevel.LOW 
  },
  { 
    name: "Anastasia Maria Loupis", 
    platform: "X", 
    audience: "950K", 
    narrative: "Anti‑West/anti‑vax; anti‑Israel spin", 
    affiliation: "Disinfo influencer cluster", 
    risk: RiskLevel.MEDIUM 
  },
  { 
    name: "Ali‑Akbar Raefipour", 
    platform: "Telegram/X", 
    audience: "~1M", 
    narrative: "Iranian propaganda; conspiracies", 
    affiliation: "Masaf Institute; IRGC orbit", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Mohammed Hijab", 
    platform: "YouTube/X", 
    audience: "1.3M", 
    narrative: "Anti‑Zionist religious content", 
    affiliation: "Debates with pro‑Pal figures", 
    risk: RiskLevel.MEDIUM 
  },
  { 
    name: "Max Blumenthal", 
    platform: "X/Grayzone", 
    audience: "380K", 
    narrative: "Anti‑Zionist; pro‑Iran/Russia", 
    affiliation: "Grayzone core; MintPress", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Abby Martin", 
    platform: "YouTube/X", 
    audience: "830K", 
    narrative: "Anti‑Israel/West", 
    affiliation: "Links w/ Max Blumenthal, Grayzone", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Rania Khalek", 
    platform: "X/BreakThrough", 
    audience: "285K", 
    narrative: "Pro‑Assad/Iran; anti‑West", 
    affiliation: "With Ben Norton; Grayzone", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Aaron Maté", 
    platform: "X/Grayzone", 
    audience: "460K", 
    narrative: "Anti‑Israel/West", 
    affiliation: "With Blumenthal; RT presence", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Carlos Latuff", 
    platform: "X", 
    audience: "850K", 
    narrative: "Anti‑Israel cartoons", 
    affiliation: "Pro‑Pal artist networks", 
    risk: RiskLevel.MEDIUM 
  },
  { 
    name: "Ali Abunimah", 
    platform: "X/Electronic Intifada", 
    audience: "230K", 
    narrative: "Anti‑Israel; BDS", 
    affiliation: "EI network", 
    risk: RiskLevel.MEDIUM 
  },
  { 
    name: "Quds News Network", 
    platform: "X/Telegram", 
    audience: "2.1M", 
    narrative: "Hamas‑aligned news; anti‑Israel", 
    affiliation: "Amplification accelerator", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Ben Norton", 
    platform: "X/Multipolarista", 
    audience: "320K", 
    narrative: "Pro‑Iran; anti‑West", 
    affiliation: "With Rania Khalek", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Richard Medhurst", 
    platform: "X/YouTube", 
    audience: "480K", 
    narrative: "Pro‑Iran/Syria; anti‑West", 
    affiliation: "Indie media circuit", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Vanessa Beeley", 
    platform: "X/21stCenturyWire", 
    audience: "130K", 
    narrative: "Pro‑Assad; anti‑Israel", 
    affiliation: "Graphika‑flagged networks", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Sarah Abdallah", 
    platform: "X", 
    audience: "500K", 
    narrative: "Pro‑Russia/Assad", 
    affiliation: "Graphika‑flagged networks", 
    risk: RiskLevel.HIGH 
  },
  { 
    name: "Intel_Sky", 
    platform: "X", 
    audience: "1.2M", 
    narrative: "Mil‑tracking; anti‑West slant", 
    affiliation: "OSINT \"mil\" ecosystem", 
    risk: RiskLevel.MEDIUM 
  }
];

export const NETWORK_CONNECTIONS: Record<string, string[]> = {
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
};