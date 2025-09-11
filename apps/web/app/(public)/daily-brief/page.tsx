import type { Metadata } from 'next'
import { Calendar, Clock, TrendingUp, AlertTriangle, Shield, Filter } from 'lucide-react'

// Components
import { NarrativeCard } from '@/components/shared/NarrativeCard'
import { UseNowSnippet } from '@/components/shared/UseNowSnippet'
import { ThreatStrip } from '@/components/shared/ThreatStrip'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { EnhancedTerminalBackground } from '@/components/organisms/EnhancedTerminalBackground'

export const metadata: Metadata = {
  title: 'Daily Brief | Lions of Zion',
  description: 'Your daily intelligence briefing on active disinformation campaigns and narratives.',
}

// Mock data for today's narratives
const todayNarratives = [
  {
    id: '1',
    title: 'Breaking: Coordinated Campaign Targets Energy Infrastructure',
    description: 'Multiple false reports about power grid failures spreading across social media. Analysis shows coordinated origin from bot networks.',
    threatLevel: 'critical' as const,
    confidence: 91,
    evidenceCount: 67,
    lastUpdated: new Date(Date.now() - 1800000).toISOString(),
    topics: ['Infrastructure', 'Energy', 'Panic'],
    impactScore: 89.3,
    region: 'North America'
  },
  {
    id: '2',
    title: 'AI-Generated Images Falsely Depict Natural Disaster',
    description: 'Synthetic images claiming to show flooding in major cities are being shared widely. Satellite data confirms no such events.',
    threatLevel: 'high' as const,
    confidence: 96,
    evidenceCount: 124,
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    topics: ['AI Images', 'Natural Disasters', 'Panic'],
    impactScore: 67.8,
    region: 'Asia Pacific'
  },
  {
    id: '3',
    title: 'False Medical Study Claims Viral on Health Forums',
    description: 'Fabricated research paper claiming new health risks from common medications. No peer review or legitimate journal publication found.',
    threatLevel: 'high' as const,
    confidence: 88,
    evidenceCount: 45,
    lastUpdated: new Date(Date.now() - 5400000).toISOString(),
    topics: ['Health', 'Medical', 'Research'],
    impactScore: 54.2,
    region: 'Europe'
  },
  {
    id: '4',
    title: 'Election Integrity Narrative Pushing False Voter Data',
    description: 'Claims of voter registration anomalies proven false by official records. Narrative appears designed to undermine confidence.',
    threatLevel: 'high' as const,
    confidence: 93,
    evidenceCount: 89,
    lastUpdated: new Date(Date.now() - 7200000).toISOString(),
    topics: ['Elections', 'Democracy', 'Data'],
    impactScore: 71.5,
    region: 'United States'
  },
  {
    id: '5',
    title: 'Cryptocurrency Scam Using Deepfake Celebrity Endorsements',
    description: 'Deepfake videos of tech leaders promoting fraudulent investment scheme. Multiple victims reported significant losses.',
    threatLevel: 'medium' as const,
    confidence: 97,
    evidenceCount: 156,
    lastUpdated: new Date(Date.now() - 10800000).toISOString(),
    topics: ['Crypto', 'Deepfakes', 'Fraud'],
    impactScore: 42.1,
    region: 'Global'
  }
]

// Mock snippets for quick sharing
const shareSnippets = [
  {
    id: '1',
    text: '⚠️ ALERT: AI-generated images claiming to show disasters are spreading. Always verify with official sources before sharing. #FactCheck #StopDisinfo',
    language: 'en' as const,
    category: 'alert' as const,
    hashtags: ['FactCheck', 'StopDisinfo', 'AIDetection'],
    source: 'Lions Command'
  },
  {
    id: '2',
    text: '✅ VERIFIED: Power grid is operating normally despite viral claims. Official infrastructure reports show no disruptions. Don\'t spread panic. #TruthMatters',
    language: 'en' as const,
    category: 'fact' as const,
    hashtags: ['TruthMatters', 'FactCheck', 'Infrastructure'],
    source: 'Fact Check Team'
  },
  {
    id: '3',
    text: '🛡️ RESPONSE: If you see suspicious health claims, check with verified medical sources. Report false medical information to platform moderators. #HealthFacts',
    language: 'en' as const,
    category: 'response' as const,
    hashtags: ['HealthFacts', 'MedicalTruth', 'StopMisinfo'],
    source: 'Medical Response Unit'
  },
  {
    id: '4',
    text: '🎯 ACTION: Join our rapid response team to counter election disinformation. Training available at lionsofzion.io/academy #DefendDemocracy',
    language: 'en' as const,
    category: 'action' as const,
    hashtags: ['DefendDemocracy', 'ElectionIntegrity', 'JoinTheFight'],
    source: 'Recruitment'
  }
]

// Mock alerts
const todayAlerts = [
  {
    id: '1',
    message: 'URGENT: Deepfake detection tools updated - download latest version',
    level: 'critical' as const,
    timestamp: '10 min ago',
    region: 'Global',
    source: 'Tech Team'
  }
]

export default function DailyBriefPage() {
  // Get current date
  const currentDate = new Date()
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions)

  return (
    <main className="relative min-h-screen">
      {/* Enhanced Terminal Background with Analysis Mode for Intelligence Focus */}
      <EnhancedTerminalBackground 
        intensity="medium"
        mode="analysis"
        className="fixed inset-0 z-0"
      />
      
      {/* Content */}
      <div className="relative z-10 bg-terminal-bg/80">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-terminal-muted text-sm mb-2">
            <Calendar className="w-4 h-4" />
            <span className="font-mono">{formattedDate}</span>
            <span className="text-terminal-border">•</span>
            <Clock className="w-4 h-4" />
            <span className="font-mono">Last updated: 5 minutes ago</span>
          </div>
          
          <h1 className="text-4xl font-bold font-mono text-terminal-cyan mb-2">
            DAILY INTELLIGENCE BRIEF
          </h1>
          
          <p className="text-terminal-muted">
            Your personalized threat intelligence summary. {todayNarratives.length} active narratives require attention.
          </p>
        </div>

        {/* Critical Alert */}
        <div className="mb-6">
          <AlertBanner
            type="warning"
            title="Priority Alert"
            message="Multiple coordinated disinformation campaigns detected today. Enhanced vigilance recommended."
            dismissible={true}
            actions={[
              { label: 'View Details', onClick: () => console.log('View details'), variant: 'primary' },
              { label: 'Dismiss', onClick: () => console.log('Dismiss'), variant: 'secondary' }
            ]}
          />
        </div>

        {/* Threat Strip */}
        <div className="mb-8">
          <ThreatStrip alerts={todayAlerts} autoScroll={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Narratives */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-mono text-terminal-cyan flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                TODAY'S NARRATIVES
              </h2>
              
              {/* Filter Options */}
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded bg-terminal-secondary border border-terminal-border 
                               text-terminal-text text-sm font-mono hover:border-terminal-cyan transition-colors 
                               flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  FILTER
                </button>
                <select className="px-3 py-1 rounded bg-terminal-secondary border border-terminal-border 
                                 text-terminal-text text-sm font-mono hover:border-terminal-cyan transition-colors">
                  <option value="severity">Sort by Severity</option>
                  <option value="recent">Sort by Time</option>
                  <option value="impact">Sort by Impact</option>
                  <option value="confidence">Sort by Confidence</option>
                </select>
              </div>
            </div>

            {/* Narrative Cards */}
            <div className="space-y-4">
              {todayNarratives.map((narrative, index) => (
                <div key={narrative.id} className="relative">
                  {/* Index Number */}
                  <div className="absolute -left-8 top-4 text-2xl font-bold font-mono text-terminal-border">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  <NarrativeCard
                    narrative={narrative}
                    onFactCheck={() => console.log('Fact check:', narrative.id)}
                    onViewDetails={() => console.log('View details:', narrative.id)}
                  />
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 p-6 rounded-lg bg-terminal-secondary border border-terminal-border">
              <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-4">
                BRIEF SUMMARY
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold font-mono text-red-400">
                    {todayNarratives.filter(n => n.threatLevel === 'critical').length}
                  </div>
                  <div className="text-xs text-terminal-muted uppercase">Critical Threats</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-orange-400">
                    {todayNarratives.filter(n => n.threatLevel === 'high').length}
                  </div>
                  <div className="text-xs text-terminal-muted uppercase">High Priority</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-terminal-cyan">
                    {Math.round(todayNarratives.reduce((acc, n) => acc + n.confidence, 0) / todayNarratives.length)}%
                  </div>
                  <div className="text-xs text-terminal-muted uppercase">Avg Confidence</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-terminal-cyan">
                    {todayNarratives.reduce((acc, n) => acc + n.evidenceCount, 0)}
                  </div>
                  <div className="text-xs text-terminal-muted uppercase">Total Evidence</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Share Snippets */}
            <div className="sticky top-4">
              <UseNowSnippet 
                snippets={shareSnippets}
                title="QUICK RESPONSE TEMPLATES"
                showLanguageSelector={false}
              />
              
              {/* Subscribe CTA */}
              <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <Shield className="w-8 h-8 text-cyan-400 mb-3" />
                <h3 className="font-bold font-mono text-cyan-400 mb-2">
                  GET DAILY ALERTS
                </h3>
                <p className="text-sm text-terminal-muted mb-4">
                  Receive this brief directly in your inbox every morning.
                </p>
                <button className="w-full px-4 py-2 rounded bg-cyan-500/20 border border-cyan-500/50 
                               text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 transition-colors">
                  SUBSCRIBE FREE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}
