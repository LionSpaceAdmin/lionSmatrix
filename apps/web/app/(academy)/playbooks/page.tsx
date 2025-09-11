import type { Metadata } from 'next'
import { Book, Shield, Target, Zap, Clock, Users, Download, Star } from 'lucide-react'

// Components
import { NarrativeCard } from '@/components/shared/NarrativeCard'
import { UseNowSnippet } from '@/components/shared/UseNowSnippet'
import { ThreatStrip } from '@/components/shared/ThreatStrip'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { EnhancedTerminalBackground } from '@/components/organisms/EnhancedTerminalBackground'

export const metadata: Metadata = {
  title: 'Tactical Playbooks | Lions of Zion',
  description: 'Battle-tested strategies for combating disinformation campaigns and information warfare.',
}

// Mock playbooks data
const featuredPlaybooks = [
  {
    id: '1',
    title: 'Rapid Response Protocol',
    description: 'Step-by-step guide for immediate response to viral disinformation campaigns. Used successfully in 250+ interventions.',
    category: 'Crisis Response',
    difficulty: 'Intermediate',
    duration: '15-30 minutes',
    effectiveness: 94,
    downloads: 12847,
    rating: 4.9,
    author: 'Lions Command',
    lastUpdated: '2 days ago',
    tags: ['Crisis', 'Rapid Response', 'Social Media'],
    threatTypes: ['Viral Hoax', 'Panic Spread', 'Coordinated Attack']
  },
  {
    id: '2',
    title: 'Deepfake Detection & Response',
    description: 'Complete toolkit for identifying, analyzing, and countering deepfake media across all platforms.',
    category: 'Technical Analysis',
    difficulty: 'Advanced',
    duration: '45-60 minutes',
    effectiveness: 98,
    downloads: 8934,
    rating: 4.8,
    author: 'Tech Defense Unit',
    lastUpdated: '5 days ago',
    tags: ['Deepfakes', 'AI Detection', 'Media Analysis'],
    threatTypes: ['Synthetic Media', 'Impersonation', 'Celebrity Fraud']
  },
  {
    id: '3',
    title: 'Bot Network Investigation',
    description: 'Advanced techniques for mapping and disrupting coordinated inauthentic behavior networks.',
    category: 'Network Analysis',
    difficulty: 'Expert',
    duration: '2-4 hours',
    effectiveness: 91,
    downloads: 5672,
    rating: 4.7,
    author: 'Intelligence Division',
    lastUpdated: '1 week ago',
    tags: ['Bot Detection', 'Network Analysis', 'OSINT'],
    threatTypes: ['Bot Networks', 'Astroturfing', 'Mass Manipulation']
  },
  {
    id: '4',
    title: 'Election Protection Strategies',
    description: 'Comprehensive defense protocols for safeguarding democratic processes from information attacks.',
    category: 'Democracy Defense',
    difficulty: 'Intermediate',
    duration: '30-45 minutes',
    effectiveness: 96,
    downloads: 15234,
    rating: 5.0,
    author: 'Democracy Shield',
    lastUpdated: '3 days ago',
    tags: ['Elections', 'Democracy', 'Voting Security'],
    threatTypes: ['Election Fraud', 'Voter Suppression', 'Mis/Disinformation']
  },
  {
    id: '5',
    title: 'Cross-Platform Counter-Narrative',
    description: 'Strategic messaging framework for deploying effective counter-narratives across multiple platforms.',
    category: 'Strategic Communication',
    difficulty: 'Intermediate',
    duration: '20-35 minutes',
    effectiveness: 89,
    downloads: 9876,
    rating: 4.6,
    author: 'Narrative Warfare Unit',
    lastUpdated: '4 days ago',
    tags: ['Counter-Narrative', 'Messaging', 'Strategy'],
    threatTypes: ['False Narratives', 'Propaganda', 'Influence Operations']
  },
  {
    id: '6',
    title: 'Healthcare Misinformation Response',
    description: 'Specialized protocols for combating medical and health-related disinformation campaigns.',
    category: 'Health Defense',
    difficulty: 'Beginner',
    duration: '10-20 minutes',
    effectiveness: 93,
    downloads: 18567,
    rating: 4.9,
    author: 'Medical Response Team',
    lastUpdated: '1 day ago',
    tags: ['Health', 'Medical', 'Public Safety'],
    threatTypes: ['Medical Hoax', 'Vaccine Misinfo', 'Health Scams']
  }
]

// Mock categories
const categories = [
  { name: 'All Playbooks', count: 47, active: true },
  { name: 'Crisis Response', count: 12, active: false },
  { name: 'Technical Analysis', count: 8, active: false },
  { name: 'Democracy Defense', count: 15, active: false },
  { name: 'Health Defense', count: 7, active: false },
  { name: 'Strategic Communication', count: 5, active: false }
]

// Mock quick snippets for sharing
const tacticalSnippets = [
  {
    id: '1',
    text: '🛡️ VERIFY BEFORE AMPLIFY: Check sources, cross-reference facts, and think before you share. Stop the spread of misinformation. #FactCheck',
    language: 'en' as const,
    category: 'alert' as const,
    hashtags: ['FactCheck', 'VerifyFirst', 'StopMisinfo'],
    source: 'Lions Command'
  },
  {
    id: '2',
    text: '🎯 SPOTTED SUSPICIOUS CONTENT? Report it, don\'t share it. Use official channels to flag potential disinformation. #ReportDontShare',
    language: 'en' as const,
    category: 'action' as const,
    hashtags: ['ReportDontShare', 'StopSpread', 'TruthMatters'],
    source: 'Community Guard'
  },
  {
    id: '3',
    text: '📊 GET TRAINED: Join our next tactical training session. Learn to identify and counter information warfare. Free registration available.',
    language: 'en' as const,
    category: 'response' as const,
    hashtags: ['GetTrained', 'JoinTheFight', 'DefendTruth'],
    source: 'Training Division'
  }
]

export default function PlaybooksPage() {
  return (
    <main className="relative min-h-screen">
      {/* Enhanced Terminal Background */}
      <EnhancedTerminalBackground 
        intensity="medium"
        mode="code"
        className="fixed inset-0 z-0"
      />
      
      {/* Content */}
      <div className="relative z-10 bg-terminal-bg/80">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-terminal-muted text-sm mb-2">
              <Book className="w-4 h-4" />
              <span className="font-mono">Academy / Tactical Playbooks</span>
              <span className="text-terminal-border">•</span>
              <span className="font-mono">{featuredPlaybooks.length} Active Protocols</span>
            </div>
            
            <h1 className="text-4xl font-bold font-mono text-terminal-cyan mb-2">
              TACTICAL PLAYBOOKS
            </h1>
            
            <p className="text-terminal-muted text-lg max-w-3xl">
              Battle-tested strategies and protocols for combating information warfare. 
              Each playbook contains proven tactics, tools, and step-by-step procedures.
            </p>
          </div>

          {/* Alert Banner */}
          <div className="mb-6">
            <AlertBanner
              type="info"
              title="New Playbook Available"
              message="Election Protection Strategies v3.0 now includes AI-detection protocols and rapid fact-checking workflows."
              dismissible={true}
              actions={[
                { label: 'View Playbook', onClick: () => console.log('View playbook'), variant: 'primary' },
                { label: 'Download PDF', onClick: () => console.log('Download'), variant: 'secondary' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Categories Filter */}
                <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
                  <h3 className="font-bold font-mono text-terminal-cyan mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    CATEGORIES
                  </h3>
                  
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        className={`w-full text-left px-3 py-2 rounded text-sm font-mono transition-colors
                          ${category.active 
                            ? 'bg-terminal-cyan/20 border border-terminal-cyan/50 text-terminal-cyan' 
                            : 'hover:bg-terminal-border/20 text-terminal-muted hover:text-terminal-text'
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.name}</span>
                          <span className="text-xs">{category.count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Share */}
                <UseNowSnippet 
                  snippets={tacticalSnippets}
                  title="TACTICAL RESPONSES"
                  showLanguageSelector={false}
                />

                {/* Training CTA */}
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <Shield className="w-8 h-8 text-orange-400 mb-3" />
                  <h3 className="font-bold font-mono text-orange-400 mb-2">
                    ADVANCED TRAINING
                  </h3>
                  <p className="text-sm text-terminal-muted mb-4">
                    Master these playbooks with hands-on simulation exercises.
                  </p>
                  <button className="w-full px-4 py-2 rounded bg-orange-500/20 border border-orange-500/50 
                                 text-orange-400 font-mono text-sm hover:bg-orange-500/30 transition-colors">
                    JOIN ACADEMY
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content - Playbooks Grid */}
            <div className="lg:col-span-3">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold font-mono text-terminal-cyan">
                    FEATURED PROTOCOLS
                  </h2>
                  <span className="text-sm text-terminal-muted font-mono">
                    ({featuredPlaybooks.length} available)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <select className="px-3 py-1 rounded bg-terminal-secondary border border-terminal-border 
                                   text-terminal-text text-sm font-mono hover:border-terminal-cyan transition-colors">
                    <option value="effectiveness">Sort by Effectiveness</option>
                    <option value="downloads">Sort by Downloads</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="recent">Sort by Recent</option>
                  </select>
                </div>
              </div>

              {/* Playbooks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPlaybooks.map((playbook) => (
                  <div 
                    key={playbook.id} 
                    className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border hover:border-terminal-cyan/50 transition-all duration-300 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded text-xs font-mono bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/30">
                            {playbook.category}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-mono border
                            ${playbook.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              playbook.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>
                            {playbook.difficulty}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold font-mono text-terminal-text group-hover:text-terminal-cyan transition-colors">
                          {playbook.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-mono">{playbook.rating}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-terminal-muted text-sm mb-4 leading-relaxed">
                      {playbook.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold font-mono text-terminal-cyan">
                          {playbook.effectiveness}%
                        </div>
                        <div className="text-xs text-terminal-muted uppercase">Effectiveness</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold font-mono text-terminal-cyan">
                          {playbook.downloads.toLocaleString()}
                        </div>
                        <div className="text-xs text-terminal-muted uppercase">Downloads</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold font-mono text-terminal-cyan flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          {playbook.duration.split('-')[0]}min
                        </div>
                        <div className="text-xs text-terminal-muted uppercase">Duration</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {playbook.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 rounded text-xs font-mono bg-terminal-border/20 text-terminal-muted"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-terminal-border">
                      <button className="flex-1 px-4 py-2 rounded bg-terminal-cyan/20 border border-terminal-cyan/50 
                                       text-terminal-cyan font-mono text-sm hover:bg-terminal-cyan/30 transition-colors
                                       flex items-center justify-center gap-2">
                        <Book className="w-4 h-4" />
                        VIEW PLAYBOOK
                      </button>
                      <button className="px-4 py-2 rounded bg-terminal-border/20 border border-terminal-border 
                                       text-terminal-muted font-mono text-sm hover:bg-terminal-border/30 hover:text-terminal-text transition-colors
                                       flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-terminal-muted font-mono mt-3 pt-3 border-t border-terminal-border/50">
                      <span>by {playbook.author}</span>
                      <span>Updated {playbook.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <button className="px-6 py-3 rounded bg-terminal-secondary border border-terminal-border 
                                 text-terminal-text font-mono hover:border-terminal-cyan hover:text-terminal-cyan transition-colors">
                  LOAD MORE PLAYBOOKS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}