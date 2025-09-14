import {
  OSINTActor,
  DeepDive,
  NetworkConnection,
  IntelligencePanelData,
} from '@/types/intelligence';

// Merged and deduplicated OSINT actors from both sources
export const mergedOsintActors: OSINTActor[] = [
  {
    id: 'jackson-hinkle',
    name: 'Jackson Hinkle',
    type: 'individual',
    aliases: ['MAGA Communist'],
    description: 'Pro-Iran/Russia; anti-Israel/West; MAGA-Communism. Affiliated with Grayzone orbit; RT; Hezbollah/Iran signal-boost.',
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'sulaiman-ahmed',
    name: 'Sulaiman Ahmed',
    type: 'individual',
    aliases: ['ShaykhSulaiman'],
    description: 'Anti-Israel; pro-Resistance Axis. Cited by PressTV/RT Arabic; Quds News synergy.',
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'quds-news-network',
    name: 'Quds News Network',
    type: 'organization',
    aliases: ['QudsNen'],
    description: 'Hamas-aligned news; anti-Israel. Amplification accelerator.',
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'max-blumenthal',
    name: 'Max Blumenthal',
    type: 'individual',
    aliases: ['MaxBlumenthal'],
    description: 'Anti-Zionist; pro-Iran/Russia. Affiliated with Grayzone core; MintPress.',
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'the-grayzone',
    name: 'The Grayzone',
    type: 'organization',
    aliases: ['TheGrayzone'],
    description: 'Pro-Russia/Iran/Assad. Core Hub.',
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'mintpress-news',
    name: 'MintPress News',
    type: 'organization',
    aliases: ['MintPressNews'],
    description: 'Pro-Russia; anti-Israel. Core Hub.',
    lastSeen: new Date().toISOString(),
  },
];

// Network connections for visualization
export const networkConnections: NetworkConnection[] = [
  { id: 'conn-1', source: 'jackson-hinkle', target: 'max-blumenthal', type: 'social', strength: 0.8, verified: true },
  { id: 'conn-2', source: 'jackson-hinkle', target: 'quds-news-network', type: 'social', strength: 0.7, verified: true },
  { id: 'conn-3', source: 'max-blumenthal', target: 'the-grayzone', type: 'operational', strength: 0.9, verified: true },
  { id: 'conn-4', source: 'max-blumenthal', target: 'mintpress-news', type: 'social', strength: 0.6, verified: true },
];

// Deep dive research prompts and reports
export const deepDiveData: Record<string, DeepDive> = {
  "jackson-hinkle": {
    id: 'dd-hinkle',
    title: 'Digital Influence Profile: Jackson Hinkle',
    content: `<h3>Biographical Background</h3><p>Jackson Hinkle is an American political influencer, born in September 1999. His political journey spans from progressive environmentalism to "MAGA Communism" and open alliances with Russia, Iran, Hezbollah, Hamas, and the Houthis.</p><h3>Political and Public Activity</h3><p>The Gaza war in October 2023 marked his breakthrough, with his X following soaring from ~417,000 to over 2.3 million by December 2023. He launched the show 'Legitimate Targets' on X, rapidly becoming one of the platform's most viral accounts.</p><h3>Links to Political, State, and Ideological Actors</h3><p>Hinkle has openly supported Kremlin narratives and embraced Iran's "Axis of Resistance." In February 2025, he traveled to Lebanon and later interviewed Hamas politburo member Dr. Basem Naim in Doha, Qatar. He acts as a "multiplier" for Russian and Iranian propaganda in English.</p><h3>Platform Analysis</h3><p>Engagement patterns suggest coordinated amplification. Spike analysis shows artificial boosting during key geopolitical events. Content timing aligns with Iranian/Russian state media releases.</p><h3>Risk Assessment</h3><p>HIGH PRIORITY - Primary vector for adversarial narrative dissemination. Documented connections to designated terror organizations. Potential FARA violations.</p>`,
    sources: ['Social Media Analysis', 'Public Records'],
    lastUpdated: new Date().toISOString(),
    prompt: "Conduct a full digital influence profile on Jackson Hinkle. Analyze ideological narrative, tone of content, affiliations, signal amplification patterns, engagement metrics, use of hashtags, interactions with known pro-Iranian or anti-Israel actors, and any indications of bot support or inorganic reach. Include timeline of activity since October 2023.",
    report: `Report content is now in the 'content' field.`
  },
};

// Helper functions to work with the new data structures

/**
 * Returns the full array of OSINT actors.
 */
export function getOsintActorsArray(): OSINTActor[] {
  return mergedOsintActors;
}

/**
 * Gets enriched data for a specific actor for panel display.
 * @param actorId The ID of the actor to retrieve data for.
 * @returns Enriched data for the actor panel, or undefined if not found.
 */
export function getActorPanelData(actorId: string): IntelligencePanelData['data'] | undefined {
  const actor = mergedOsintActors.find(a => a.id === actorId);
  if (!actor) return undefined;

  // In a real application, you would enrich this with more data.
  // For now, we combine the actor data with their network connections.
  return {
    ...actor,
    risk_level: 'high', // Placeholder, as this is not in the OSINTActor type
    network_connections: networkConnections.filter(c => c.source === actorId || c.target === actorId),
  };
}

/**
 * Searches for OSINT actors based on a query string.
 * @param query The search term.
 * @returns An array of matching OSINT actors.
 */
export function searchOsintActors(query: string): OSINTActor[] {
  if (!query) return mergedOsintActors;

  const searchTerm = query.toLowerCase();
  return mergedOsintActors.filter(actor =>
    actor.name.toLowerCase().includes(searchTerm) ||
    actor.description.toLowerCase().includes(searchTerm) ||
    (actor.aliases && actor.aliases.some(a => a.toLowerCase().includes(searchTerm)))
  );
}

/**
 * Returns a slice of the actors array.
 * Note: The original sorting logic by 'Audience' is removed as this property
 * is no longer part of the OSINTActor type. This function can be extended
 * in the future if a 'followers' or similar metric is added to the type.
 * @param limit The number of actors to return.
 * @returns A sliced array of OSINT actors.
 */
export function getTopActorsByAudience(limit: number = 10): OSINTActor[] {
    return mergedOsintActors.slice(0, limit);
}