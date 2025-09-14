'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, Brain, Search, FileCheck, Flag, Calendar, 
  Image, Video, Music, MessageSquare, Database, Sparkles,
  Lock, Unlock, ArrowRight, Info, AlertCircle, Zap
} from 'lucide-react'

interface Tool {
  id: string
  title: string
  description: string
  icon: any
  status: 'active' | 'coming-soon' | 'premium'
  permission: 'open' | 'verified' | 'premium'
  route: string
  shortcut?: string
  tags: string[]
  new?: boolean
}

const tools: Tool[] = [
  {
    id: 'image-influence-lab',
    title: 'Image Influence Lab',
    description: 'Test and optimize visual messaging variants with AI-powered analysis',
    icon: Image,
    status: 'active',
    permission: 'open',
    route: '/dashboard/tools/image-influence-lab',
    shortcut: 'Cmd+I',
    tags: ['AI', 'Visual', 'Testing'],
    new: true
  },
  {
    id: 'fact-check',
    title: 'Fact-Check Window',
    description: 'Build evidence-based fact-checks with source verification and confidence scoring',
    icon: FileCheck,
    status: 'active',
    permission: 'open',
    route: '/dashboard/tools/fact-check',
    shortcut: 'Cmd+F',
    tags: ['Verification', 'Evidence', 'Research']
  },
  {
    id: 'report-research',
    title: 'Report & Research',
    description: 'Submit suspicious content for investigation and collaborative analysis',
    icon: Flag,
    status: 'active',
    permission: 'verified',
    route: '/dashboard/tools/report-research',
    tags: ['Reporting', 'Investigation', 'Collaboration']
  },
  {
    id: 'fake-resistance',
    title: '#FakeResistance Tracker',
    description: 'Monitor and coordinate counter-messaging campaigns in real-time',
    icon: Shield,
    status: 'active',
    permission: 'verified',
    route: '/dashboard/tools/fake-resistance-tracker',
    tags: ['Campaigns', 'Monitoring', 'Response']
  },
  {
    id: 'deep-research',
    title: 'Deep Research Daily',
    description: 'Advanced research workspace with saved queries and collaborative notes',
    icon: Database,
    status: 'active',
    permission: 'premium',
    route: '/dashboard/tools/deep-research-daily',
    tags: ['Research', 'Analysis', 'Collaboration']
  },
  {
    id: 'ai-assistant',
    title: 'AI Investigation Assistant',
    description: 'Conversational AI for guided disinformation analysis and fact-checking',
    icon: Brain,
    status: 'active',
    permission: 'open',
    route: '/dashboard/command-center',
    tags: ['AI', 'Assistant', 'Analysis'],
    new: true
  },
  {
    id: 'video-analysis',
    title: 'Video Deep Fake Detector',
    description: 'Analyze videos for manipulation, deep fakes, and altered content',
    icon: Video,
    status: 'coming-soon',
    permission: 'premium',
    route: '#',
    tags: ['Video', 'DeepFake', 'Detection']
  },
  {
    id: 'audio-analysis',
    title: 'Audio Manipulation Scanner',
    description: 'Detect voice cloning, audio splicing, and acoustic anomalies',
    icon: Music,
    status: 'coming-soon',
    permission: 'premium',
    route: '#',
    tags: ['Audio', 'Voice', 'Detection']
  },
  {
    id: 'narrative-mapper',
    title: 'Narrative Network Mapper',
    description: 'Visualize how disinformation spreads across platforms and communities',
    icon: Sparkles,
    status: 'coming-soon',
    permission: 'verified',
    route: '#',
    tags: ['Network', 'Visualization', 'Tracking']
  }
]

const getPermissionBadge = (permission: string) => {
  switch (permission) {
    case 'open':
      return { icon: Unlock, text: 'Open Access', color: 'text-green-400 bg-green-500/10 border-green-500/30' }
    case 'verified':
      return { icon: Shield, text: 'Verified Lions', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' }
    case 'premium':
      return { icon: Lock, text: 'Premium', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' }
    default:
      return { icon: Info, text: 'Unknown', color: 'text-terminal-muted bg-terminal-secondary border-terminal-border' }
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return { text: 'ACTIVE', color: 'text-green-400' }
    case 'coming-soon':
      return { text: 'COMING SOON', color: 'text-yellow-400' }
    case 'premium':
      return { text: 'PREMIUM', color: 'text-purple-400' }
    default:
      return { text: 'UNKNOWN', color: 'text-terminal-muted' }
  }
}

export default function WarMachinePage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'coming-soon'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = tools.filter(tool => {
    const matchesFilter = filter === 'all' || tool.status === filter
    const matchesSearch = searchQuery === '' || 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <div className="border-b border-terminal-border bg-terminal-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold font-mono text-terminal-cyan flex items-center gap-3">
                <Shield className="w-8 h-8" />
                WAR MACHINE
              </h1>
              <p className="text-terminal-muted mt-1">
                Your arsenal of AI-powered tools to combat disinformation
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm font-mono">
              <div className="text-center">
                <div className="text-2xl font-bold text-terminal-cyan">{tools.filter(t => t.status === 'active').length}</div>
                <div className="text-xs text-terminal-muted">Active Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{tools.filter(t => t.status === 'coming-soon').length}</div>
                <div className="text-xs text-terminal-muted">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
            <input
              type="text"
              placeholder="Search tools by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-terminal-secondary border border-terminal-border 
                       rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                       focus:border-terminal-cyan focus:outline-none transition-colors"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-3 rounded-lg font-mono text-sm transition-all
                       ${filter === 'all' 
                         ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                         : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:border-terminal-cyan'}`}
            >
              ALL TOOLS
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-3 rounded-lg font-mono text-sm transition-all
                       ${filter === 'active' 
                         ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                         : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:border-terminal-cyan'}`}
            >
              ACTIVE
            </button>
            <button
              onClick={() => setFilter('coming-soon')}
              className={`px-4 py-3 rounded-lg font-mono text-sm transition-all
                       ${filter === 'coming-soon' 
                         ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                         : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:border-terminal-cyan'}`}
            >
              COMING SOON
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-terminal-secondary 
                      border border-cyan-500/30 flex items-start gap-3">
          <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-mono font-bold text-terminal-cyan mb-1">
              NEW: AI Command Center Now Live!
            </h3>
            <p className="text-sm text-terminal-muted">
              Access our most powerful AI investigation tools through the unified Command Center. 
              15 specialized AI agents ready to assist your fact-checking missions.
            </p>
            <Link
              href="/dashboard/command-center"
              className="inline-flex items-center gap-2 mt-2 text-sm text-cyan-400 hover:text-cyan-300 
                       font-mono transition-colors"
            >
              Launch Command Center
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon
            const permissionBadge = getPermissionBadge(tool.permission)
            const statusBadge = getStatusBadge(tool.status)
            const PermissionIcon = permissionBadge.icon
            
            return (
              <div
                key={tool.id}
                className={`relative rounded-lg bg-terminal-secondary border border-terminal-border 
                         ${tool.status === 'active' ? 'hover:border-terminal-cyan cursor-pointer' : ''} 
                         transition-all duration-200 overflow-hidden group`}
              >
                {/* New Badge */}
                {tool.new && (
                  <div className="absolute top-4 right-4 px-2 py-1 rounded bg-gradient-to-r from-cyan-500 to-blue-500 
                                text-white text-xs font-bold font-mono z-10">
                    NEW
                  </div>
                )}
                
                {/* Card Content */}
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${
                      tool.status === 'active' 
                        ? 'bg-terminal-cyan/10 text-terminal-cyan' 
                        : 'bg-terminal-border/50 text-terminal-muted'
                    }`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-1">
                        {tool.title}
                      </h3>
                      <span className={`text-xs font-mono ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-terminal-muted mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded text-xs font-mono bg-terminal-bg 
                                 border border-terminal-border text-terminal-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Permission Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono 
                                 ${permissionBadge.color} border`}>
                    <PermissionIcon className="w-3 h-3" />
                    {permissionBadge.text}
                  </div>
                  
                  {/* Action Button */}
                  {tool.status === 'active' ? (
                    <Link
                      href={tool.route}
                      className="mt-4 w-full py-3 rounded-lg bg-terminal-bg border border-terminal-border 
                               text-terminal-cyan font-mono font-bold hover:bg-cyan-500/10 
                               hover:border-cyan-500 transition-all duration-200 
                               flex items-center justify-center gap-2 group"
                    >
                      LAUNCH TOOL
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="mt-4 w-full py-3 rounded-lg bg-terminal-bg/50 border border-terminal-border/50 
                               text-terminal-muted font-mono font-bold cursor-not-allowed 
                               flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      COMING SOON
                    </button>
                  )}
                  
                  {/* Keyboard Shortcut */}
                  {tool.shortcut && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-terminal-muted font-mono">
                        Shortcut: {tool.shortcut}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
            <h3 className="text-lg font-mono text-terminal-cyan mb-2">
              No tools found
            </h3>
            <p className="text-terminal-muted">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 p-6 rounded-lg bg-terminal-secondary border border-terminal-border">
          <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-4">
            Access Levels Explained
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Unlock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono text-green-400 mb-1">Open Access</h4>
                <p className="text-xs text-terminal-muted">
                  Available to all registered Lions. Start using immediately.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono text-cyan-400 mb-1">Verified Lions</h4>
                <p className="text-xs text-terminal-muted">
                  Complete identity verification to access sensitive tools.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono text-yellow-400 mb-1">Premium</h4>
                <p className="text-xs text-terminal-muted">
                  Advanced tools for professional investigators and organizations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
