import { cache } from 'react'
import { unstable_cache } from 'next/cache'

// Cache configuration
const CACHE_TAGS = {
  intelligence: 'intelligence-data',
  actors: 'actors-data',
  translations: 'translations-data',
  osint: 'osint-data',
  campaigns: 'campaigns-data',
  threats: 'threats-data',
} as const

const CACHE_REVALIDATE = {
  static: 60 * 60 * 24, // 24 hours for static data
  dynamic: 60 * 5, // 5 minutes for dynamic data
  realtime: 60, // 1 minute for real-time data
} as const

// Type definitions
export interface DataLoaderOptions {
  tags?: string[]
  revalidate?: number
  force?: boolean
}

export interface IntelligenceData {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: Date
  source?: string
  confidence?: number
  metadata?: Record<string, any>
}

export interface ActorData {
  id: string
  name: string
  type: 'individual' | 'group' | 'organization' | 'state'
  affiliation?: string
  risk_level: 'low' | 'medium' | 'high' | 'extreme'
  active: boolean
  last_seen?: Date
  capabilities?: string[]
  targets?: string[]
}

export interface TranslationData {
  locale: string
  namespace: string
  key: string
  value: string
  metadata?: {
    context?: string
    plural?: boolean
    variables?: string[]
  }
}

// Intelligence data loader
export const loadIntelligenceData = unstable_cache(
  async (options?: DataLoaderOptions): Promise<IntelligenceData[]> => {
    try {
      // In production, this would fetch from API or database
      // For now, return mock data
      const data: IntelligenceData[] = [
        {
          id: 'intel-001',
          type: 'threat-assessment',
          severity: 'high',
          title: 'Increased Disinformation Activity',
          description: 'Detected coordinated campaign targeting public discourse',
          timestamp: new Date(),
          source: 'OSINT Analysis',
          confidence: 0.85,
        },
        {
          id: 'intel-002',
          type: 'narrative-tracking',
          severity: 'medium',
          title: 'Emerging False Narrative',
          description: 'New conspiracy theory gaining traction on social media',
          timestamp: new Date(Date.now() - 3600000),
          source: 'Social Media Monitoring',
          confidence: 0.72,
        },
      ]
      
      return data
    } catch (error) {
      console.error('Failed to load intelligence data:', error)
      return []
    }
  },
  ['intelligence-data'],
  {
    tags: [CACHE_TAGS.intelligence],
    revalidate: CACHE_REVALIDATE.dynamic,
  }
)

// Actors data loader
export const loadActorsData = unstable_cache(
  async (options?: DataLoaderOptions): Promise<ActorData[]> => {
    try {
      // Mock data for development
      const actors: ActorData[] = [
        {
          id: 'actor-001',
          name: 'DisInfo Group Alpha',
          type: 'group',
          affiliation: 'Unknown',
          risk_level: 'high',
          active: true,
          last_seen: new Date(),
          capabilities: ['social-engineering', 'bot-networks', 'deepfakes'],
          targets: ['public-opinion', 'elections', 'social-cohesion'],
        },
        {
          id: 'actor-002',
          name: 'Narrative Builders',
          type: 'organization',
          risk_level: 'medium',
          active: true,
          capabilities: ['content-creation', 'astroturfing'],
          targets: ['youth-demographics', 'political-discourse'],
        },
      ]
      
      return actors
    } catch (error) {
      console.error('Failed to load actors data:', error)
      return []
    }
  },
  ['actors-data'],
  {
    tags: [CACHE_TAGS.actors],
    revalidate: CACHE_REVALIDATE.dynamic,
  }
)

// Translations loader
export const loadTranslations = cache(
  async (locale: string, namespace?: string): Promise<Record<string, any>> => {
    try {
      // For now, return basic translations
      const translations: Record<string, any> = {
        common: {
          title: 'LionSpace',
          subtitle: 'Information Defense Platform',
          loading: 'Loading...',
          error: 'An error occurred',
          retry: 'Try again',
          cancel: 'Cancel',
          confirm: 'Confirm',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          close: 'Close',
        },
        navigation: {
          home: 'Home',
          dashboard: 'Dashboard',
          tools: 'Tools',
          academy: 'Academy',
          trust: 'Trust Center',
          enterprise: 'Enterprise',
          profile: 'Profile',
          settings: 'Settings',
          logout: 'Logout',
        },
        dashboard: {
          welcome: 'Welcome to LionSpace',
          overview: 'Overview',
          recent_activity: 'Recent Activity',
          threat_level: 'Threat Level',
          active_campaigns: 'Active Campaigns',
          quick_actions: 'Quick Actions',
        },
      }
      
      // Filter by namespace if provided
      if (namespace && translations[namespace]) {
        return translations[namespace]
      }
      
      return translations
    } catch (error) {
      console.error('Failed to load translations:', error)
      return {}
    }
  }
)

// OSINT data loader
export const loadOSINTData = unstable_cache(
  async (options?: DataLoaderOptions): Promise<any[]> => {
    try {
      // Mock OSINT data
      return [
        {
          id: 'osint-001',
          type: 'social-media',
          platform: 'twitter',
          content: 'Suspicious coordinated activity detected',
          timestamp: new Date(),
          indicators: ['bot-like-behavior', 'amplification-pattern'],
        },
      ]
    } catch (error) {
      console.error('Failed to load OSINT data:', error)
      return []
    }
  },
  ['osint-data'],
  {
    tags: [CACHE_TAGS.osint],
    revalidate: CACHE_REVALIDATE.realtime,
  }
)

// Campaign data loader
export const loadCampaignData = unstable_cache(
  async (campaignId?: string): Promise<any> => {
    try {
      // Mock campaign data
      if (campaignId) {
        return {
          id: campaignId,
          name: 'Sample Campaign',
          status: 'active',
          start_date: new Date(Date.now() - 86400000 * 7),
          metrics: {
            reach: 15000,
            engagement: 3200,
            effectiveness: 0.78,
          },
        }
      }
      
      return [
        {
          id: 'campaign-001',
          name: 'Counter-Disinformation Alpha',
          status: 'active',
          priority: 'high',
        },
        {
          id: 'campaign-002',
          name: 'Fact-Check Initiative',
          status: 'planning',
          priority: 'medium',
        },
      ]
    } catch (error) {
      console.error('Failed to load campaign data:', error)
      return campaignId ? null : []
    }
  },
  ['campaign-data'],
  {
    tags: [CACHE_TAGS.campaigns],
    revalidate: CACHE_REVALIDATE.dynamic,
  }
)

// Threat data loader
export const loadThreatData = unstable_cache(
  async (options?: DataLoaderOptions): Promise<any[]> => {
    try {
      // Mock threat data
      return [
        {
          id: 'threat-001',
          type: 'disinformation-campaign',
          name: 'Election Interference 2024',
          severity: 'critical',
          status: 'monitoring',
          first_detected: new Date(Date.now() - 86400000 * 14),
          last_activity: new Date(),
          indicators: 15,
          affected_platforms: ['facebook', 'twitter', 'telegram'],
        },
        {
          id: 'threat-002',
          type: 'deepfake-content',
          name: 'AI-Generated Political Videos',
          severity: 'high',
          status: 'analyzing',
          first_detected: new Date(Date.now() - 86400000 * 3),
          last_activity: new Date(Date.now() - 3600000 * 2),
          indicators: 8,
          affected_platforms: ['youtube', 'tiktok'],
        },
      ]
    } catch (error) {
      console.error('Failed to load threat data:', error)
      return []
    }
  },
  ['threat-data'],
  {
    tags: [CACHE_TAGS.threats],
    revalidate: CACHE_REVALIDATE.realtime,
  }
)

// Batch loader for multiple data types
export const loadBatchData = async (
  types: Array<'intelligence' | 'actors' | 'osint' | 'campaigns' | 'threats'>,
  options?: DataLoaderOptions
): Promise<Record<string, any>> => {
  const results: Record<string, any> = {}
  
  const loaders = {
    intelligence: loadIntelligenceData,
    actors: loadActorsData,
    osint: loadOSINTData,
    campaigns: loadCampaignData,
    threats: loadThreatData,
  }
  
  await Promise.all(
    types.map(async (type) => {
      if (loaders[type]) {
        results[type] = await loaders[type](options)
      }
    })
  )
  
  return results
}

// Cache invalidation utilities
export const invalidateCache = async (tags: string | string[]) => {
  const tagArray = Array.isArray(tags) ? tags : [tags]
  // In Next.js app router, this would use revalidateTag
  // For now, just log
  console.log('Invalidating cache tags:', tagArray)
}

export const invalidateAllCaches = async () => {
  await invalidateCache(Object.values(CACHE_TAGS))
}

// Export cache tags for external use
export { CACHE_TAGS, CACHE_REVALIDATE }