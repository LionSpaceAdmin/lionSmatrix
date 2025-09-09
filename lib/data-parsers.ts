/**
 * Data parsing utilities for Matrix effect system
 * Processes actor network data and cognitive warfare messages
 */

export interface ActorData {
  name: string
  platform: string
  audience: string
  audienceNumber: number
  narrative: string
  affiliation: string
  threatLevel: 'low' | 'medium' | 'high'
  nodeSize: number
  color: string
}

export interface CognitiveWarfareMessage {
  id: number
  en: string
  he: string
  ar: string
  fr: string
  de: string
  ru: string
  es: string
  pt: string
  it: string
  zh: string
  ja: string
  hi: string
  fa: string
  category: 'propaganda' | 'disinformation' | 'truth' | 'pattern'
  intensity: number
  wordList: string[]
}

export interface MatrixData {
  actors: ActorData[]
  messages: CognitiveWarfareMessage[]
  scanWords: string[]
  networkNodes: ActorData[]
}

/**
 * Parse CSV actor data and categorize by threat level
 */
export function parseActorData(csvData: string): ActorData[] {
  const lines = csvData.split('\n').slice(1) // Skip header
  const actors: ActorData[] = []

  lines.forEach((line, index) => {
    if (line.trim()) {
      const columns = line.split(',')
      if (columns.length >= 5) {
        const name = columns[0]?.trim() || `Actor_${index}`
        const platform = columns[1]?.trim() || 'Unknown'
        const audience = columns[2]?.trim() || '0'
        const narrative = columns[3]?.trim() || ''
        const affiliation = columns[4]?.trim() || ''

        // Extract audience number for sizing
        const audienceMatch = audience.match(/(\d+\.?\d*)([KM])/i)
        let audienceNumber = 0
        if (audienceMatch && audienceMatch[1] && audienceMatch[2]) {
          const num = parseFloat(audienceMatch[1])
          const multiplier = audienceMatch[2].toUpperCase() === 'M' ? 1000000 : 1000
          audienceNumber = num * multiplier
        }

        // Determine threat level based on audience size and narrative
        let threatLevel: 'low' | 'medium' | 'high' = 'low'
        if (audienceNumber > 5000000) threatLevel = 'high'
        else if (audienceNumber > 1000000) threatLevel = 'medium'

        // Check for high-threat narratives
        const highThreatKeywords = ['iran', 'russia', 'hamas', 'anti-israel', 'propaganda']
        const lowercaseNarrative = narrative.toLowerCase()
        const lowercaseAffiliation = affiliation.toLowerCase()
        
        if (highThreatKeywords.some(keyword => 
          lowercaseNarrative.includes(keyword) || lowercaseAffiliation.includes(keyword)
        )) {
          if (threatLevel === 'low') threatLevel = 'medium'
          else if (threatLevel === 'medium') threatLevel = 'high'
        }

        // Calculate node size based on audience (min 8, max 40)
        const nodeSize = Math.min(40, Math.max(8, Math.log10(audienceNumber + 1) * 4))

        // Assign color based on threat level
        const colors = {
          low: '#34D399',    // Green
          medium: '#FFB700', // Gold  
          high: '#D43F3F'    // Red
        }

        actors.push({
          name,
          platform,
          audience,
          audienceNumber,
          narrative,
          affiliation,
          threatLevel,
          nodeSize,
          color: colors[threatLevel]
        })
      }
    }
  })

  return actors
}

/**
 * Process cognitive warfare messages and categorize them
 */
export function processCognitiveWarfareMessages(jsonData: Record<string, unknown>): CognitiveWarfareMessage[] {
  if (!jsonData.messages || !Array.isArray(jsonData.messages)) {
    return []
  }

  return (jsonData.messages as Record<string, unknown>[]).map((msg: Record<string, unknown>) => {
    // Categorize message based on content
    const englishText = (msg.en as string)?.toLowerCase() || ''
    let category: 'propaganda' | 'disinformation' | 'truth' | 'pattern' = 'pattern'
    let intensity = 1

    // Classification logic
    if (englishText.includes('propaganda') || englishText.includes('narrative')) {
      category = 'propaganda'
      intensity = 3
    } else if (englishText.includes('lies') || englishText.includes('false')) {
      category = 'disinformation' 
      intensity = 4
    } else if (englishText.includes('truth') || englishText.includes('pattern')) {
      category = 'truth'
      intensity = 2
    }

    // Extract key words for scanning effect
    const wordList = extractKeyWords((msg.en as string) || '')

    return {
      id: msg.id || 0,
      en: msg.en as string || '',
      he: msg.he as string || '',
      ar: msg.ar as string || '',
      fr: msg.fr as string || '',
      de: msg.de as string || '',
      ru: msg.ru as string || '',
      es: msg.es as string || '',
      pt: msg.pt as string || '',
      it: msg.it as string || '',
      zh: msg.zh as string || '',
      ja: msg.ja as string || '',
      hi: msg.hi as string || '',
      fa: msg.fa as string || '',
      category,
      intensity,
      wordList
    } as CognitiveWarfareMessage
  })
}

/**
 * Extract key words from text for Matrix scanning effect
 */
function extractKeyWords(text: string): string[] {
  const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but']
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 10) // Limit to 10 key words per message
}

/**
 * Generate word pool for Matrix scanning effect
 */
export function generateScanWords(messages: CognitiveWarfareMessage[]): string[] {
  const allWords: string[] = []
  
  messages.forEach(msg => {
    allWords.push(...msg.wordList)
  })

  // Add some core Matrix-style words
  const coreWords = [
    'TRUTH', 'PATTERN', 'LIES', 'PROPAGANDA', 'NARRATIVE', 'CONTROL',
    'MEDIA', 'WARFARE', 'COGNITIVE', 'INFLUENCE', 'DISINFORMATION',
    'RESISTANCE', 'BATTLE', 'CONSCIOUSNESS', 'REALITY', 'PERCEPTION',
    'TARGET', 'WEAPON', 'NETWORK', 'ANALYSIS', 'DETECTION'
  ]

  // Combine and deduplicate
  const uniqueWords = [...new Set([...allWords, ...coreWords])]
  return uniqueWords.filter(word => word.length > 0)
}

/**
 * Create network connections between actors based on affiliation
 */
export function generateNetworkConnections(actors: ActorData[]): Array<{from: number, to: number, strength: number}> {
  const connections: Array<{from: number, to: number, strength: number}> = []
  
  for (let i = 0; i < actors.length; i++) {
    for (let j = i + 1; j < actors.length; j++) {
      const actor1 = actors[i]
      const actor2 = actors[j]
      
      // Calculate connection strength based on shared keywords
      if (actor1 && actor2) {
        const strength = calculateConnectionStrength(actor1, actor2)
        
        if (strength > 0.3) { // Only include meaningful connections
          connections.push({ from: i, to: j, strength })
        }
      }
    }
  }
  
  return connections
}

/**
 * Calculate connection strength between two actors
 */
function calculateConnectionStrength(actor1: ActorData, actor2: ActorData): number {
  let strength = 0
  
  // Platform similarity
  if (actor1.platform === actor2.platform) {
    strength += 0.2
  }
  
  // Narrative similarity (check for common keywords)
  const narrative1Words = actor1.narrative.toLowerCase().split(/\s+/)
  const narrative2Words = actor2.narrative.toLowerCase().split(/\s+/)
  const commonNarrativeWords = narrative1Words.filter(word => 
    narrative2Words.includes(word) && word.length > 4
  )
  strength += Math.min(0.4, commonNarrativeWords.length * 0.1)
  
  // Affiliation similarity
  const affiliation1Words = actor1.affiliation.toLowerCase().split(/\s+/)
  const affiliation2Words = actor2.affiliation.toLowerCase().split(/\s+/)
  const commonAffiliationWords = affiliation1Words.filter(word => 
    affiliation2Words.includes(word) && word.length > 3
  )
  strength += Math.min(0.4, commonAffiliationWords.length * 0.15)
  
  return Math.min(1, strength)
}

/**
 * Main function to parse all data for Matrix effect
 */
export async function loadMatrixData(): Promise<MatrixData> {
  try {
    // Load CSV data
    const csvResponse = await fetch('/desigen_data/FakeResistance_Actors_Archive_2025-08-29.csv')
    const csvData = await csvResponse.text()
    const actors = parseActorData(csvData)
    
    // Load JSON data  
    const jsonResponse = await fetch('/desigen_data/cognitive_warfare_messages_multilingual.json')
    const jsonData = await jsonResponse.json() as Record<string, unknown>
    const messages = processCognitiveWarfareMessages(jsonData)
    
    // Generate scan words
    const scanWords = generateScanWords(messages)
    
    // Filter top actors for network visualization (limit for performance)
    const networkNodes = actors
      .sort((a, b) => b.audienceNumber - a.audienceNumber)
      .slice(0, 25) // Top 25 actors for network
    
    return {
      actors,
      messages,
      scanWords,
      networkNodes
    }
  } catch (error) {
    console.error('Error loading matrix data:', error)
    
    // Return fallback data
    return {
      actors: [],
      messages: [],
      scanWords: ['TRUTH', 'PATTERN', 'LIES', 'PROPAGANDA', 'CONTROL'],
      networkNodes: []
    }
  }
}