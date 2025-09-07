/**
 * Data loading utilities for CSV/JSON parsing and caching
 * Integrates external data sources into existing intelligence architecture
 */

import messagesJson from '@/data/cognitive_warfare_messages_multilingual.json';

export interface MultilingualMessage {
  id: number;
  en: string;
  he?: string;
  ar?: string;
  fr?: string;
  de?: string;
  ru?: string;
  es?: string;
  pt?: string;
  it?: string;
  zh?: string;
  ja?: string;
  hi?: string;
  fa?: string;
}

export interface ActorData {
  name: string;
  platform: string;
  audience: string;
  narrative: string;
  affiliation?: string;
}

export interface ProcessedIntelligenceData {
  messages: MultilingualMessage[];
  actors: ActorData[];
  languages: string[];
  actors_by_risk: {
    high: ActorData[];
    medium: ActorData[];
    low: ActorData[];
  };
}

/**
 * Parse CSV text into structured actor data
 */
export function parseActorCSV(csvText: string): ActorData[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const actor: Partial<ActorData> = {};
    
    headers.forEach((header, index) => {
      const key = header.toLowerCase();
      switch (key) {
        case 'name':
          actor.name = values[index];
          break;
        case 'platform':
          actor.platform = values[index];
          break;
        case 'audience':
          actor.audience = values[index];
          break;
        case 'narrative':
          actor.narrative = values[index];
          break;
        case 'affiliation/links':
          actor.affiliation = values[index];
          break;
        default:
          // Handle any additional fields using a typed record to avoid TS index errors
          (actor as Record<string, string>)[key.replace(/[^a-z0-9]/g, '_')] = values[index];
      }
    });
    
    return actor as ActorData;
  }).filter(actor => actor.name); // Filter out empty rows
}

/**
 * Extract risk level from actor data based on narrative content
 */
export function categorizeActorByRisk(actor: ActorData): 'high' | 'medium' | 'low' {
  const narrative = actor.narrative?.toLowerCase() || '';
  const affiliation = actor.affiliation?.toLowerCase() || '';
  
  // High risk indicators
  if (
    narrative.includes('iran') || 
    narrative.includes('russia') ||
    narrative.includes('propaganda') ||
    narrative.includes('conspiracies') ||
    affiliation.includes('irgc') ||
    affiliation.includes('rt')
  ) {
    return 'high';
  }
  
  // Medium risk indicators
  if (
    narrative.includes('anti-') ||
    narrative.includes('pro-') ||
    affiliation.includes('grayzone')
  ) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Process and structure all intelligence data
 */
export function processIntelligenceData(
  messagesData: { messages: MultilingualMessage[], languages: string[] },
  actorsData: ActorData[]
): ProcessedIntelligenceData {
  
  const categorizedActors = actorsData.reduce((acc, actor) => {
    const risk = categorizeActorByRisk(actor);
    acc[risk].push(actor);
    return acc;
  }, { high: [] as ActorData[], medium: [] as ActorData[], low: [] as ActorData[] });

  return {
    messages: messagesData.messages,
    actors: actorsData,
    languages: messagesData.languages,
    actors_by_risk: categorizedActors
  };
}

/**
 * Get random message from processed data
 */
export function getRandomMessage(
  messages: MultilingualMessage[],
  language: string = 'en'
): string {
  if (!messages.length) return "Truth is pattern. AI sees it.";
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const langVal = (randomMessage as unknown as Record<string, unknown>)[language];
  return String((langVal as string) || randomMessage.en);
}

/**
 * Get high-priority vocabulary from actor networks - ENHANCED WITH ASYNC SUPPORT
 */
export function extractVocabularyFromActors(actors: ActorData[]): {
  primary_actors: string[];
  operation_keywords: string[];
  network_terms: string[];
} {
  const primaryActors = actors
    .filter(actor => categorizeActorByRisk(actor) === 'high')
    .map(actor => actor.name);
  
  const operationKeywords = actors
    .flatMap(actor => (actor.narrative || '').split(/[;,\/]/).map(n => n.trim()))
    .filter(keyword => keyword.length > 2 && keyword.length < 50)
    .slice(0, 30); // Increased limit for Matrix display
  
  const networkTerms = actors
    .flatMap(actor => (actor.platform || '').split(/[;,\/]/).map(p => p.trim()))
    .filter(platform => platform.length > 1);

  return {
    primary_actors: [...new Set(primaryActors)],
    operation_keywords: [...new Set(operationKeywords)],
    network_terms: [...new Set(networkTerms)]
  };
}

/**
 * Create Matrix-optimized vocabulary from all data sources
 */
export async function createMatrixVocabulary(): Promise<{
  primary_actors: string[];
  operation_keywords: string[];
  network_terms: string[];
  intelligence_terms: string[];
}> {
  try {
    const { messages, actors, vocabulary } = await initializeDataLoaders();
    const actorVocab = extractVocabularyFromActors(actors);
    
    // Extract intelligence terms from messages
    const intelligenceTerms = messages.messages
      .flatMap(msg => (msg.en || '').split(/[\s\.,;:!?]/))
      .map(term => term.trim().toUpperCase())
      .filter(term => term.length > 3 && term.length < 20)
      .filter(term => /^[A-Z]+$/.test(term)) // Only uppercase words
      .slice(0, 50);
    
    return {
      ...actorVocab,
      intelligence_terms: [...new Set([...intelligenceTerms, ...vocabulary])]
    };
  } catch (error) {
    console.error('❌ Failed to create Matrix vocabulary:', error);
    
    // Fallback vocabulary
    return {
      primary_actors: ['JACKSON HINKLE', 'SULAIMAN AHMED'],
      operation_keywords: ['PROPAGANDA', 'NARRATIVE', 'INFLUENCE'],
      network_terms: ['TWITTER', 'TELEGRAM', 'YOUTUBE'],
      intelligence_terms: ['INTELLIGENCE', 'MATRIX', 'SCANNING', 'PATTERN', 'ANALYSIS']
    };
  }
}

/**
 * Cache management for processed data
 */
class DataCache {
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private maxAge = 1000 * 60 * 15; // 15 minutes

  set(key: string, data: unknown) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear() {
    this.cache.clear();
  }
}

export const dataCache = new DataCache();

/**
 * CRITICAL ASYNC FUNCTIONS FOR CSV DATA LOADING
 */

/**
 * Load multilingual messages from CSV with caching
 */
export async function loadMessages(): Promise<{ messages: MultilingualMessage[], languages: string[] }> {
  const cacheKey = 'multilingual-messages';
  const cached = dataCache.get<{ messages: MultilingualMessage[]; languages: string[] }>(cacheKey);

  if (cached) {
    console.log('📥 Messages loaded from cache:', cached.messages.length);
    return cached;
  }
  
  try {
    // Use imported JSON data directly
    const messagesArray = Array.isArray(messagesJson) ? messagesJson : ((messagesJson as any).messages || []);
    const messages = (messagesArray as unknown as Record<string, unknown>[]).map((m, i) => {
      const copy: Record<string, unknown> = { ...m };
      if (!copy.id) copy.id = i + 1;
      return copy as unknown as MultilingualMessage;
    });
    const languages = Object.keys(messages[0] || {}).filter(k => k.length === 2);
    const result = { messages, languages };
    dataCache.set(cacheKey, result);
    console.log('📊 Loaded messages from imported JSON:', messages.length);
    return result;
  } catch (error) {
    console.error('❌ Failed to load messages from import:', error);
    // Fallback to fetch
    try {
      const response = await fetch('/desigen_data/cognitive_warfare_messages_multilingual.csv');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const csvText = await response.text();
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const messages: MultilingualMessage[] = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, '')); // Remove quotes
        const message: Partial<MultilingualMessage> = { id: index + 1 };

        headers.forEach((header, idx) => {
          if (values[idx]) {
            (message as Record<string, string | number | undefined>)[header] = values[idx];
          }
        });

        return message as MultilingualMessage;
      }).filter(msg => msg.en); // Only messages with English content
      
      const languages = headers.filter(h => h.length === 2); // ISO language codes
      
      const result = { messages, languages };
      dataCache.set(cacheKey, result);
      
      console.log('📊 Loaded messages from CSV:', messages.length);
      return result;
    } catch (fetchError) {
      console.error('❌ Failed to load CSV messages:', fetchError);
      // Try JSON sibling as fallback (public folder may contain pre-parsed JSON)
      try {
        const jsonResp = await fetch('/desigen_data/cognitive_warfare_messages_multilingual.json');
        if (jsonResp.ok) {
          const jsonData = await jsonResp.json();
          // Expecting either { messages: [...] } or an array
          const messagesArray = Array.isArray(jsonData) ? jsonData : (jsonData.messages || []);
          const messages = (messagesArray as unknown as Record<string, unknown>[]).map((m, i) => {
            const copy: Record<string, unknown> = { ...m };
            if (!copy.id) copy.id = i + 1;
            return copy as unknown as MultilingualMessage;
          });
          const languages = Object.keys(messages[0] || {}).filter(k => k.length === 2);
          const result = { messages, languages };
          dataCache.set(cacheKey, result);
          console.log('📊 Loaded messages from JSON fallback:', messages.length);
          return result;
        }
      } catch (jsonErr) {
        console.warn('⚠️ JSON fallback for messages failed:', jsonErr);
      }
    }

    // Final fallback data structure
    const fallbackMessages = [
      { id: 1, en: "Truth is pattern. AI sees it.", he: "האמת היא תבנית. בינה מלאכותית רואה אותה." },
      { id: 2, en: "Information warfare is already here.", he: "מלחמת המידע כבר כאן." },
      { id: 3, en: "Reality is what survives the algorithm.", he: "המציאות היא מה ששורד את האלגוריתם." }
    ];

    const fallback = { messages: fallbackMessages, languages: ['en', 'he'] };
    dataCache.set(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Load actor data from CSV with risk categorization
 */
export async function loadActors(): Promise<ActorData[]> {
  const cacheKey = 'fake-resistance-actors';
  const cached = dataCache.get<ActorData[]>(cacheKey);

  if (cached) {
    console.log('📥 Actors loaded from cache:', cached.length);
    return cached;
  }
  
  try {
    const response = await fetch('/desigen_data/FakeResistance_Actors_Archive_2025-08-29.csv');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const csvText = await response.text();
  const actors = parseActorCSV(csvText);

  dataCache.set(cacheKey, actors);
    console.log('👥 Loaded actors from CSV:', actors.length);
    return actors;
  } catch (error) {
    console.error('❌ Failed to load actors CSV:', error);
    
    // Fallback actor data
    return [
      { name: "Jackson Hinkle", platform: "X (Twitter)", audience: "3.4M", narrative: "Pro-Iranian anti-Western propaganda" },
      { name: "Sulaiman Ahmed", platform: "X (Twitter)", audience: "722K", narrative: "Anti-Israeli pro-Palestinian content" }
    ];
  }
}

/**
 * Load text lines for Matrix background vocabulary
 */
export async function loadTxtLines(): Promise<string[]> {
  const cacheKey = 'txt-vocabulary';
  const cached = dataCache.get<string[]>(cacheKey);

  if (cached) {
    console.log('📥 TXT lines loaded from cache:', cached.length);
    return cached;
  }
  
  try {
    // Attempt to fetch a combined txt file if it exists
    const txtPaths = [
      '/desigen_data/txt/combined.txt',
      '/desigen_data/txt/words.txt',
      '/desigen_data/txt.txt',
      '/desigen_data/txt'
    ];

    for (const p of txtPaths) {
      try {
        const response = await fetch(p);
        if (!response.ok) continue;
        const txtContent = await response.text();
        const lines = txtContent.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 2 && line.length < 50) // Filter sensible lengths
          .filter(line => /^[A-Za-z0-9\s\-_]+$/.test(line)); // Only alphanumeric content
        if (lines.length) {
          dataCache.set(cacheKey, lines);
          console.log('📝 Loaded TXT lines from', p, lines.length);
          return lines;
        }
      } catch {
        // try next path
      }
    }

    // If no raw TXT present, build fallback from messages and actors
    const [msgData, actors] = await Promise.all([loadMessages(), loadActors()]);
    const msgWords = msgData.messages
      .flatMap(m => (m.en || '').split(/[^A-Za-z0-9]+/))
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length > 3 && w.length < 20);
    const actorWords = actors
      .flatMap(a => [a.name, a.platform, a.audience, a.affiliation || ''])
      .flatMap(s => (s || '').split(/[^A-Za-z0-9]+/))
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length > 2 && w.length < 20);

    const combined = Array.from(new Set([...msgWords, ...actorWords])).slice(0, 500);
    dataCache.set(cacheKey, combined);
    console.log('📝 Built TXT fallback from messages/actors:', combined.length);
    return combined;
  } catch (error) {
    console.error('❌ Failed to load TXT file:', error);
    
    // Fallback vocabulary
    return [
      'INTELLIGENCE', 'MATRIX', 'SCANNING', 'PATTERN', 'ANALYSIS',
      'NETWORK', 'CONNECTIONS', 'THREAT', 'MONITORING', 'DATA',
      'COGNITIVE WARFARE', 'INFLUENCE', 'NARRATIVE', 'OPERATION'
    ];
  }
}

/**
 * Smart message selector with context awareness - ENHANCED FOR ASYNC LOADING
 */
export function selectContextualMessage(
  messages: MultilingualMessage[],
  context: 'landing' | 'analysis' | 'network' | 'default' = 'default',
  language: string = 'en'
): string {
  if (!messages.length) return "Truth is pattern. AI sees it.";
  
  let filteredMessages = messages;
  
  // Context-based filtering with enhanced intelligence vocabulary
  switch (context) {
    case 'landing':
      // High-impact messages for landing page
      filteredMessages = messages.filter((msg, index) => 
        index < 5 || // First 5 messages are priority
        msg.en.includes('Truth is pattern') ||
        msg.en.includes('Information warfare') ||
        msg.en.includes('war is already here') ||
        msg.en.includes('Reality is what survives')
      );
      break;
    case 'analysis':
      // Analytical and pattern-recognition messages
      filteredMessages = messages.filter(m => 
        m.en.includes('pattern') || m.en.includes('analysis') || 
        m.en.includes('intelligence') || m.en.includes('algorithm') ||
        m.en.includes('data') || m.en.includes('decode')
      );
      break;
    case 'network':
      // Network and influence operation messages
      filteredMessages = messages.filter(m =>
        m.en.includes('network') || m.en.includes('connection') || 
        m.en.includes('influence') || m.en.includes('media') ||
        m.en.includes('platform') || m.en.includes('narrative')
      );
      break;
    default:
      // Use all messages
      break;
  }
  
  // Fallback to all messages if filtering results in empty array
  if (!filteredMessages.length) {
    filteredMessages = messages;
  }
  
  return getRandomMessage(filteredMessages, language);
}

/**
 * Initialize all data loaders and warm cache
 */
export async function initializeDataLoaders(): Promise<{
  messages: { messages: MultilingualMessage[], languages: string[] },
  actors: ActorData[],
  vocabulary: string[]
}> {
  console.log('🚀 Initializing data loaders...');
  
  const [messages, actors, vocabulary] = await Promise.all([
    loadMessages(),
    loadActors(), 
    loadTxtLines()
  ]);
  
  console.log('✅ Data loaders initialized:', {
    messages: messages.messages.length,
    actors: actors.length,
    vocabulary: vocabulary.length
  });
  
  return { messages, actors, vocabulary };
}