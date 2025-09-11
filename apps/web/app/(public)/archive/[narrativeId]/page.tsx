import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { NarrativeDetailClient } from './narrative-detail-client'

// Mock narrative data - in production this would come from API
const mockNarratives = {
  '1': {
    id: '1',
    title: 'Coordinated Bot Network Targets Election Integrity',
    description: 'Large-scale bot operation spreading false claims about voting systems detected across multiple platforms.',
    threatLevel: 'critical' as const,
    confidence: 89,
    evidenceCount: 234,
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    topics: ['Elections', 'Bots', 'Democracy'],
    impactScore: 87.3,
    region: 'North America',
    platforms: ['Twitter', 'Facebook', 'Telegram', 'TikTok'],
    
    // Detailed content
    claim: 'Voting machines in swing states are compromised and votes are being changed to favor specific candidates.',
    verdict: 'FALSE',
    verificationStatus: 'verified',
    
    summary: 'A coordinated network of over 15,000 bot accounts has been spreading false claims about voting machine vulnerabilities across multiple social media platforms. The operation appears to be designed to undermine public confidence in election integrity.',
    
    keyFindings: [
      'Network consists of 15,247 authenticated bot accounts',
      'Content posted in 6 languages targeting different demographics',
      'Peak activity coordinated around major election events',
      'Source attribution points to foreign state actor involvement'
    ],
    
    timeline: [
      {
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        event: 'Initial detection of unusual posting patterns',
        description: 'Automated systems flagged coordinated posting behavior'
      },
      {
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
        event: 'Bot network mapping initiated',
        description: 'Analysis team began mapping connections between accounts'
      },
      {
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        event: 'Content analysis completed',
        description: 'Thematic analysis revealed coordinated messaging'
      },
      {
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        event: 'Platform notifications sent',
        description: 'Social media platforms were notified of the operation'
      },
      {
        date: new Date(Date.now() - 86400000 * 1).toISOString(),
        event: 'Public advisory issued',
        description: 'Warning issued to election officials and the public'
      }
    ],
    
    evidence: [
      {
        id: 'ev1',
        type: 'Social Media Analysis',
        title: 'Account Network Map',
        description: 'Visualization showing connections between bot accounts',
        source: 'Platform API Analysis',
        confidence: 95,
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        verified: true
      },
      {
        id: 'ev2',
        type: 'Content Analysis',
        title: 'Message Pattern Analysis',
        description: 'Statistical analysis of posting patterns and timing',
        source: 'Natural Language Processing',
        confidence: 91,
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        verified: true
      },
      {
        id: 'ev3',
        type: 'Technical Evidence',
        title: 'IP Geolocation Data',
        description: 'Geographic clustering of account origins',
        source: 'Network Analysis',
        confidence: 88,
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        verified: true
      },
      {
        id: 'ev4',
        type: 'External Verification',
        title: 'Election Security Assessment',
        description: 'Independent verification by election security experts',
        source: 'Department of Homeland Security',
        confidence: 96,
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        verified: true
      }
    ],
    
    methodology: 'Multi-platform social media monitoring combined with network analysis and content linguistics to identify coordinated inauthentic behavior.',
    
    relatedNarratives: ['2', '3'],
    
    shareableContent: {
      shortSummary: 'VERIFIED: Large bot network spreading false voting machine claims. Operation targets election confidence across multiple platforms.',
      hashtags: ['#ElectionSecurity', '#FactCheck', '#Disinformation'],
      callToAction: 'Verify before you share. Report suspicious content.'
    }
  },
  '2': {
    id: '2',
    title: 'Deepfake Video of World Leader Goes Viral',
    description: 'AI-generated video falsely showing political leader making inflammatory statements spreads rapidly.',
    threatLevel: 'critical' as const,
    confidence: 94,
    evidenceCount: 156,
    lastUpdated: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    topics: ['Deepfake', 'Politics', 'AI'],
    impactScore: 92.1,
    region: 'Europe',
    platforms: ['YouTube', 'Twitter', 'Telegram'],
    
    claim: 'World leader makes inflammatory statements about neighboring country in leaked video.',
    verdict: 'DEEPFAKE',
    verificationStatus: 'verified',
    
    summary: 'A sophisticated deepfake video showing a world leader making inflammatory statements has gone viral across multiple platforms. Technical analysis confirms the video is AI-generated.',
    
    keyFindings: [
      'Video created using advanced deepfake technology',
      'Audio-visual inconsistencies detected through technical analysis',
      'No matching footage exists in official archives',
      'Rapid spread suggests coordinated amplification'
    ],
    
    timeline: [
      {
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        event: 'Video first detected',
        description: 'Deepfake video began circulating on social media'
      },
      {
        date: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        event: 'Technical analysis initiated',
        description: 'AI detection tools applied to verify authenticity'
      },
      {
        date: new Date(Date.now() - 86400000 * 1).toISOString(),
        event: 'Deepfake confirmed',
        description: 'Analysis confirmed video is AI-generated'
      },
      {
        date: new Date(Date.now() - 3600000 * 12).toISOString(),
        event: 'Platform takedown requests',
        description: 'Removal requests sent to major platforms'
      }
    ],
    
    evidence: [
      {
        id: 'ev5',
        type: 'Technical Analysis',
        title: 'Deepfake Detection Results',
        description: 'AI analysis showing video manipulation indicators',
        source: 'Deepfake Detection AI',
        confidence: 97,
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        verified: true
      },
      {
        id: 'ev6',
        type: 'Archive Verification',
        title: 'Official Archive Search',
        description: 'No matching footage found in official records',
        source: 'Government Archives',
        confidence: 100,
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        verified: true
      }
    ],
    
    methodology: 'Deepfake detection using AI tools combined with archive verification and audio-visual analysis.',
    
    relatedNarratives: ['1'],
    
    shareableContent: {
      shortSummary: 'VERIFIED DEEPFAKE: Viral video of world leader is AI-generated. Technical analysis confirms manipulation.',
      hashtags: ['#Deepfake', '#FactCheck', '#AIManipulation'],
      callToAction: 'Question what you see. Verify before sharing.'
    }
  }
}

interface Props {
  params: { narrativeId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const narrative = mockNarratives[params.narrativeId as keyof typeof mockNarratives]
  
  if (!narrative) {
    return {
      title: 'Narrative Not Found | Lions of Zion',
      description: 'The requested narrative could not be found.'
    }
  }

  return {
    title: `${narrative.title} | Lions of Zion`,
    description: narrative.description,
    openGraph: {
      title: narrative.title,
      description: narrative.description,
      type: 'article',
      publishedTime: narrative.createdAt,
      modifiedTime: narrative.lastUpdated,
      tags: narrative.topics,
    },
    twitter: {
      card: 'summary_large_image',
      title: narrative.title,
      description: narrative.description,
    }
  }
}

export default function NarrativeDetailPage({ params }: Props) {
  const narrative = mockNarratives[params.narrativeId as keyof typeof mockNarratives]
  
  if (!narrative) {
    notFound()
  }

  return <NarrativeDetailClient narrative={narrative} />
}