import { 
  OSINTActor, 
  DeepDive, 
  NetworkConnection, 
  IntelligencePanelData 
} from '@/types/intelligence';

// Merged and deduplicated OSINT actors from both sources
export const mergedOsintActors = {
  // High-risk actors
  "Jackson Hinkle": {
    Name: "Jackson Hinkle",
    Platform: "X/Rumble/Telegram",
    Audience: 3400000,
    Narrative: "Pro-Iran/Russia; anti-Israel/West; MAGA-Communism",
    Affiliation: "Grayzone orbit; RT; Hezbollah/Iran signal-boost",
    risk: "HIGH",
    alias: "jacksonhinklle",
    followers: "3.4M+",
    platforms: ["X/Twitter", "Rumble", "Telegram", "YouTube"],
    keywords: ["Disinfo", "Propaganda", "Amplification", "MAGA Communism"],
    engagement_rate: "8.4%",
    content_frequency: "15-20 posts/day"
  },
  "Sulaiman Ahmed": {
    Name: "Sulaiman Ahmed",
    Platform: "X/Telegram/YouTube",
    Audience: 722000,
    Narrative: "Anti-Israel; pro-Resistance Axis",
    Affiliation: "Cited by PressTV/RT Arabic; Quds News synergy",
    risk: "HIGH",
    alias: "ShaykhSulaiman",
    followers: "722K+",
    platforms: ["X/Twitter", "Telegram", "YouTube", "Instagram"],
    keywords: ["Influencer", "Activism", "Mobilization", "Anti-Israel"],
    engagement_rate: "6.8%",
    content_frequency: "5-8 posts/day"
  },
  "Quds News Network": {
    Name: "Quds News Network",
    Platform: "X/Telegram",
    Audience: 2100000,
    Narrative: "Hamas-aligned news; anti-Israel",
    Affiliation: "Amplification accelerator",
    risk: "HIGH",
    alias: "QudsNen",
    followers: "2.1M+",
    platforms: ["X/Twitter", "Telegram", "Instagram"],
    keywords: ["Hamas", "PIJ", "Propaganda"],
    engagement_rate: "12.3%",
    content_frequency: "30+ posts/day"
  },
  "Max Blumenthal": {
    Name: "Max Blumenthal",
    Platform: "X/Grayzone",
    Audience: 380000,
    Narrative: "Anti-Zionist; pro-Iran/Russia",
    Affiliation: "Grayzone core; MintPress",
    risk: "HIGH",
    alias: "MaxBlumenthal",
    followers: "380K+",
    platforms: ["X/Twitter", "Grayzone Project"],
    keywords: ["Grayzone", "RT", "Propaganda"],
    engagement_rate: "5.2%",
    content_frequency: "8-12 posts/day"
  },
  "The Grayzone": {
    Name: "The Grayzone",
    Platform: "Web/X",
    Audience: 800000,
    Narrative: "Pro-Russia/Iran/Assad",
    Affiliation: "Core Hub",
    risk: "HIGH",
    alias: "TheGrayzone",
    followers: "800K+",
    platforms: ["Website", "X/Twitter", "YouTube"],
    keywords: ["Alternative Media", "Anti-West", "Conspiracy"],
    engagement_rate: "4.5%"
  },
  "MintPress News": {
    Name: "MintPress News",
    Platform: "Web/X",
    Audience: 750000,
    Narrative: "Pro-Russia; anti-Israel",
    Affiliation: "Core Hub",
    risk: "HIGH",
    alias: "MintPressNews",
    followers: "750K+",
    platforms: ["Website", "X/Twitter"],
    keywords: ["Alternative Media", "Anti-Israel", "Propaganda"]
  },
  // Medium-risk actors
  "Khalissee": {
    Name: "Khalissee",
    Platform: "X",
    Audience: 376000,
    Narrative: "Anti-US/West; conspiracist provocations",
    Affiliation: "Cross-engagement with pro-Pal networks",
    risk: "MEDIUM",
    alias: "Kahlissee",
    followers: "376K+",
    platforms: ["X/Twitter", "Instagram"],
    keywords: ["Activism", "Solidarity", "Awareness"],
    engagement_rate: "5.5%",
    content_frequency: "3-5 posts/day"
  },
  "Anastasia Maria Loupis": {
    Name: "Anastasia Maria Loupis",
    Platform: "X",
    Audience: 950000,
    Narrative: "Anti-West/anti-vax; anti-Israel spin",
    Affiliation: "Disinfo influencer cluster",
    risk: "MEDIUM",
    alias: "anastasiloupis",
    followers: "950K+",
    platforms: ["X/Twitter"],
    keywords: ["Anti-vax", "Conspiracy", "Disinfo"]
  },
  "Ali-Akbar Raefipour": {
    Name: "Ali-Akbar Raefipour",
    Platform: "Telegram/X",
    Audience: 1000000,
    Narrative: "Iranian propaganda; conspiracies",
    Affiliation: "Masaf Institute; IRGC orbit",
    risk: "HIGH",
    alias: "raefipour",
    followers: "~1M",
    platforms: ["Telegram", "X/Twitter"],
    keywords: ["IRGC", "Iran", "Propaganda"]
  },
  "Mohammed Hijab": {
    Name: "Mohammed Hijab",
    Platform: "YouTube/X",
    Audience: 1300000,
    Narrative: "Anti-Zionist religious content",
    Affiliation: "Debates with pro-Pal figures",
    risk: "MEDIUM",
    alias: "mohammed_hijab",
    followers: "1.3M",
    platforms: ["YouTube", "X/Twitter"],
    keywords: ["Religious", "Anti-Zionist", "Debates"]
  },
  "Abby Martin": {
    Name: "Abby Martin",
    Platform: "YouTube/X",
    Audience: 830000,
    Narrative: "Anti-Israel/West",
    Affiliation: "Links w/ Max Blumenthal, Grayzone",
    risk: "HIGH",
    alias: "AbbyMartin",
    followers: "830K+",
    platforms: ["X/Twitter", "YouTube", "Podcast"],
    keywords: ["RT America", "Empire Files", "Propaganda"],
    engagement_rate: "4.5%",
    content_frequency: "3-5 posts/day"
  },
  "Rania Khalek": {
    Name: "Rania Khalek",
    Platform: "X/BreakThrough",
    Audience: 285000,
    Narrative: "Pro-Assad/Iran; anti-West",
    Affiliation: "With Ben Norton; Grayzone",
    risk: "HIGH",
    alias: "RaniaKhalek",
    followers: "285K+",
    platforms: ["X/Twitter", "YouTube", "BreakThrough News"],
    keywords: ["BreakThrough", "Syria", "Propaganda"],
    engagement_rate: "3.8%",
    content_frequency: "6-10 posts/day"
  },
  "Aaron Maté": {
    Name: "Aaron Maté",
    Platform: "X/Grayzone",
    Audience: 460000,
    Narrative: "Anti-Israel/West",
    Affiliation: "With Blumenthal; RT presence",
    risk: "HIGH",
    alias: "aaronmate",
    followers: "460K+",
    platforms: ["X/Twitter", "Grayzone"],
    keywords: ["Grayzone", "RT", "Anti-West"]
  },
  "Carlos Latuff": {
    Name: "Carlos Latuff",
    Platform: "X",
    Audience: 850000,
    Narrative: "Anti-Israel cartoons",
    Affiliation: "Pro-Pal artist networks",
    risk: "MEDIUM",
    alias: "LatuffCartoons",
    followers: "850K+",
    platforms: ["X/Twitter"],
    keywords: ["Cartoons", "Anti-Israel", "Artist"]
  },
  "Ali Abunimah": {
    Name: "Ali Abunimah",
    Platform: "X/Electronic Intifada",
    Audience: 230000,
    Narrative: "Anti-Israel; BDS",
    Affiliation: "EI network",
    risk: "MEDIUM",
    alias: "AliAbunimah",
    followers: "230K+",
    platforms: ["X/Twitter", "Electronic Intifada"],
    keywords: ["Electronic Intifada", "BDS", "One-state"],
    engagement_rate: "4.2%",
    content_frequency: "8-12 posts/day"
  },
  // Additional actors from extended data
  "Ben Norton": {
    Name: "Ben Norton",
    Platform: "X/Multipolarista",
    Audience: 320000,
    Narrative: "Pro-Iran; anti-West",
    Affiliation: "With Rania Khalek",
    risk: "HIGH",
    alias: "BenjaminNorton",
    followers: "320K+",
    platforms: ["X/Twitter", "Multipolarista"],
    keywords: ["Multipolarista", "Anti-imperialism", "Propaganda"]
  },
  "Richard Medhurst": {
    Name: "Richard Medhurst",
    Platform: "X/YouTube",
    Audience: 480000,
    Narrative: "Pro-Iran/Syria; anti-West",
    Affiliation: "Indie media circuit",
    risk: "HIGH",
    alias: "richimedhurst",
    followers: "480K+",
    platforms: ["X/Twitter", "YouTube"],
    keywords: ["Syria", "Iran", "Independent Media"]
  },
  "Vanessa Beeley": {
    Name: "Vanessa Beeley",
    Platform: "X/21stCenturyWire",
    Audience: 130000,
    Narrative: "Pro-Assad; anti-Israel",
    Affiliation: "Graphika-flagged networks",
    risk: "HIGH",
    alias: "VanessaBeeley",
    followers: "130K+",
    platforms: ["X/Twitter", "21st Century Wire"],
    keywords: ["Syria", "Assad", "White Helmets"]
  },
  "Sarah Abdallah": {
    Name: "Sarah Abdallah",
    Platform: "X",
    Audience: 500000,
    Narrative: "Pro-Russia/Assad",
    Affiliation: "Graphika-flagged networks",
    risk: "HIGH",
    alias: "sahouraxo",
    followers: "500K+",
    platforms: ["X/Twitter"],
    keywords: ["Russia", "Syria", "Lebanon"]
  },
  "Intel_Sky": {
    Name: "Intel_Sky",
    Platform: "X",
    Audience: 1200000,
    Narrative: "Mil-tracking; anti-West slant",
    Affiliation: "OSINT \"mil\" ecosystem",
    risk: "MEDIUM",
    alias: "Intel_Sky",
    followers: "1.2M+",
    platforms: ["X/Twitter"],
    keywords: ["OSINT", "Military", "Aviation"]
  },
  // Low-risk actors
  "Motaz Azaiza": {
    Name: "Motaz Azaiza",
    Platform: "X/IG",
    Audience: 18500000,
    Narrative: "Gaza-centric visual narratives",
    Affiliation: "Broad pro-Pal ecosystem",
    risk: "LOW",
    alias: "MotazAzaiza",
    followers: "18.5M+",
    platforms: ["Instagram", "X/Twitter"],
    keywords: ["Photographer", "Gaza", "Documentation"],
    engagement_rate: "15.2%",
    content_frequency: "Variable"
  },
  "Mohamad Safa": {
    Name: "Mohamad Safa",
    Platform: "X",
    Audience: 1300000,
    Narrative: "Pro-Lebanon/anti-Israel",
    Affiliation: "Lebanon-aligned activist media",
    risk: "LOW",
    alias: "mhdksafa",
    followers: "1.3M+",
    platforms: ["X/Twitter", "Instagram"],
    keywords: ["Lebanon", "Updates", "Regional"],
    engagement_rate: "4.8%",
    content_frequency: "5-10 posts/day"
  }
};

// Network connections for visualization
export const networkConnections: NetworkConnection = {
  "Jackson Hinkle": ["Max Blumenthal", "Rania Khalek", "Quds News Network", "Sulaiman Ahmed"],
  "Max Blumenthal": ["Jackson Hinkle", "Abby Martin", "Aaron Maté", "Ben Norton", "Vanessa Beeley"],
  "Rania Khalek": ["Max Blumenthal", "Ben Norton", "Abby Martin", "Jackson Hinkle"],
  "Aaron Maté": ["Max Blumenthal", "Abby Martin"],
  "Ben Norton": ["Rania Khalek", "Max Blumenthal", "Richard Medhurst"],
  "Abby Martin": ["Max Blumenthal", "Rania Khalek", "Aaron Maté"],
  "Sulaiman Ahmed": ["Jackson Hinkle", "Quds News Network"],
  "Quds News Network": ["Jackson Hinkle", "Sulaiman Ahmed", "Ali-Akbar Raefipour"],
  "Ali-Akbar Raefipour": ["Quds News Network"],
  "Vanessa Beeley": ["Sarah Abdallah", "Max Blumenthal"],
  "Sarah Abdallah": ["Vanessa Beeley"],
  "Richard Medhurst": ["Max Blumenthal", "Ben Norton"],
  "Ali Abunimah": ["Carlos Latuff"],
  "Carlos Latuff": ["Ali Abunimah"],
  "The Grayzone": ["Max Blumenthal", "Aaron Maté", "Ben Norton"],
  "MintPress News": ["Abby Martin", "Max Blumenthal"]
};

// Deep dive research prompts and reports
export const deepDiveData: Record<string, DeepDive> = {
  "Jackson Hinkle": {
    prompt: "Conduct a full digital influence profile on Jackson Hinkle. Analyze ideological narrative, tone of content, affiliations, signal amplification patterns, engagement metrics, use of hashtags, interactions with known pro-Iranian or anti-Israel actors, and any indications of bot support or inorganic reach. Include timeline of activity since October 2023.",
    report: `<h3>Biographical Background</h3><p>Jackson Hinkle is an American political influencer, born in September 1999. His political journey spans from progressive environmentalism to "MAGA Communism" and open alliances with Russia, Iran, Hezbollah, Hamas, and the Houthis.</p><h3>Political and Public Activity</h3><p>The Gaza war in October 2023 marked his breakthrough, with his X following soaring from ~417,000 to over 2.3 million by December 2023. He launched the show 'Legitimate Targets' on X, rapidly becoming one of the platform's most viral accounts.</p><h3>Links to Political, State, and Ideological Actors</h3><p>Hinkle has openly supported Kremlin narratives and embraced Iran's "Axis of Resistance." In February 2025, he traveled to Lebanon and later interviewed Hamas politburo member Dr. Basem Naim in Doha, Qatar. He acts as a "multiplier" for Russian and Iranian propaganda in English.</p><h3>Platform Analysis</h3><p>Engagement patterns suggest coordinated amplification. Spike analysis shows artificial boosting during key geopolitical events. Content timing aligns with Iranian/Russian state media releases.</p><h3>Risk Assessment</h3><p>HIGH PRIORITY - Primary vector for adversarial narrative dissemination. Documented connections to designated terror organizations. Potential FARA violations.</p>`
  },
  "Sulaiman Ahmed": {
    prompt: "Generate comprehensive intelligence profile on Sulaiman Ahmed focusing on network analysis, content patterns, and influence operations.",
    report: `<h3>Profile Overview</h3><p>Sulaiman Ahmed operates as a key node in the anti-Israel disinformation network with direct connections to Iranian and Russian state media outlets.</p><h3>Network Analysis</h3><p>Strong correlations with PressTV and RT Arabic content timing. Coordinated amplification patterns detected with other actors in the network. Regular interaction with Jackson Hinkle, Quds News Network.</p><h3>Content Patterns</h3><p>Utilizes religious framing to legitimize political narratives. Emotional appeals targeting Muslim audiences. Systematic use of atrocity propaganda.</p><h3>Influence Operations</h3><p>Engagement patterns suggest use of amplification networks. Content seeding observed across multiple platforms simultaneously. Suspected bot network support during viral campaigns.</p><h3>Threat Assessment</h3><p>MEDIUM-HIGH PRIORITY - Effective at mobilizing religious communities. Bridge between Western and Middle Eastern information spaces.</p>`
  },
  "Quds News Network": {
    prompt: "Analyze Quds News Network operations, funding sources, content coordination patterns, and relationship with designated terror organizations.",
    report: `<h3>Operational Overview</h3><p>Quds News Network functions as a primary distribution hub for Hamas-aligned narratives with sophisticated multi-platform presence.</p><h3>Content Coordination</h3><p>Analysis reveals coordinated content releases timed with Hamas political announcements. Direct messaging alignment with PIJ and Hamas military wings. Real-time coordination during escalations.</p><h3>Network Infrastructure</h3><p>Operates through distributed Telegram channels with backup domains. Utilizes bot networks for initial content seeding. Resilient against deplatforming through redundant channels.</p><h3>Funding Indicators</h3><p>Professional production quality suggests significant funding. Content volume indicates full-time staff. Geographic dispersion of administrators.</p><h3>Terror Nexus</h3><p>Direct amplification of designated terror organization statements. Glorification of attacks and "martyrdom operations." Recruitment-adjacent content detected.</p><h3>Assessment</h3><p>HIGH PRIORITY - Primary propaganda outlet for Hamas/PIJ. Critical node in terror-aligned information operations.</p>`
  },
  "Max Blumenthal": {
    prompt: "Comprehensive analysis of Max Blumenthal's role in the disinformation ecosystem, Grayzone operations, and state media connections.",
    report: `<h3>Background</h3><p>Max Blumenthal founded The Grayzone in 2015, transforming from mainstream journalism to consistent alignment with authoritarian regimes.</p><h3>Grayzone Operations</h3><p>The Grayzone serves as a laundering mechanism for state propaganda. Content systematically aligns with Russian, Iranian, Syrian, and Chinese state narratives.</p><h3>State Media Integration</h3><p>Regular appearances on RT, PressTV, CGTN. Content frequently cited by state media as "independent" Western journalism. Financial connections suspected but unconfirmed.</p><h3>Network Position</h3><p>Central hub connecting Western alternative media with state propaganda apparatus. Mentorship role for emerging disinformation actors.</p><h3>Impact Assessment</h3><p>HIGH PRIORITY - Provides veneer of legitimacy to authoritarian propaganda. Influential in shaping "anti-imperialist" narratives in West.</p>`
  },
  "Abby Martin": {
    prompt: "Analyze Abby Martin's media operations, RT connections, and role in anti-Western narrative construction.",
    report: `<h3>Media Career</h3><p>Former RT America host (Breaking the Set, 2012-2015). Founded The Empire Files, hosted by TeleSUR. Consistent anti-Western, pro-authoritarian positioning.</p><h3>Content Analysis</h3><p>Systematic alignment with adversarial state narratives. Focus on US criticism while ignoring authoritarian abuses. Emotional, confrontational style designed for viral spread.</p><h3>Network Integration</h3><p>Close collaboration with Grayzone network. Regular cross-promotion with other identified actors. Speaking circuit includes events sponsored by adversarial states.</p><h3>Influence Metrics</h3><p>Significant reach through multiple platforms. Content frequently amplified by bot networks. Youth-oriented messaging strategy.</p><h3>Assessment</h3><p>MEDIUM-HIGH PRIORITY - Effective at reaching younger demographics. Gateway figure to more extreme content.</p>`
  }
};

// Convert to array format for compatibility
export function getOsintActorsArray(): OSINTActor[] {
  return Object.values(mergedOsintActors).map(actor => ({
    Name: actor.Name,
    Platform: actor.Platform,
    Audience: actor.Audience,
    Narrative: actor.Narrative,
    Affiliation: actor.Affiliation
  }));
}

// Get actor details for panel display
export function getActorPanelData(actorName: string): IntelligencePanelData[string] | undefined {
  const actor = (mergedOsintActors as any)[actorName];
  if (!actor) return undefined;
  
  return {
    name: actor.Name,
    alias: actor.alias || '',
    followers: actor.followers || `${(actor.Audience / 1000000).toFixed(1)}M+`,
    platforms: actor.platforms || actor.Platform.split('/'),
    risk_level: actor.risk || 'MEDIUM',
    keywords: actor.keywords || [],
    narratives: actor.Narrative.split(';').map((n: any) => n.trim()),
    network_connections: networkConnections[actor.Name] || [],
    activity_summary: actor.Affiliation,
    last_activity: "Active",
    engagement_rate: actor.engagement_rate || "N/A",
    content_frequency: actor.content_frequency || "Variable"
  };
}

// Search function for actors
export function searchOsintActors(query: string): typeof mergedOsintActors {
  if (!query) return mergedOsintActors;
  
  const searchTerm = query.toLowerCase();
  const results: any = {};
  
  Object.entries(mergedOsintActors).forEach(([key, actor]) => {
    if (
      actor.Name.toLowerCase().includes(searchTerm) ||
      actor.Narrative.toLowerCase().includes(searchTerm) ||
      actor.Affiliation.toLowerCase().includes(searchTerm) ||
      actor.Platform.toLowerCase().includes(searchTerm) ||
      (actor.keywords && actor.keywords.some(k => k.toLowerCase().includes(searchTerm)))
    ) {
      (results as any)[key] = actor;
    }
  });
  
  return results;
}

// Risk level filtering
export function filterByRisk(riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'): any {
  const results: any = {};
  
  Object.entries(mergedOsintActors).forEach(([key, actor]) => {
    if (actor.risk === riskLevel) {
      (results as any)[key] = actor;
    }
  });
  
  return results;
}

// Get actors by audience size
export function getTopActorsByAudience(limit: number = 10): any {
  const sorted = Object.entries(mergedOsintActors)
    .sort((a, b) => b[1].Audience - a[1].Audience)
    .slice(0, limit);
  
  const results: any = {};
  sorted.forEach(([key, actor]) => {
    (results as any)[key] = actor;
  });
  
  return results;
}