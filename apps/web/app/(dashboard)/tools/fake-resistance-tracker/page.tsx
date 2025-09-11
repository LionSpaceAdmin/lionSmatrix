'use client'

import { useState } from 'react'
import { 
  Shield, Search, Filter, ChevronDown, ChevronUp, ChevronRight,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Globe,
  MessageSquare, Target, Activity, BarChart3, Eye, Edit,
  Plus, X, RefreshCw, Download, Share2, ArrowUpDown
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  threat: string
  status: 'active' | 'monitoring' | 'contained' | 'resolved'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number
  startDate: string
  lastUpdate: string
  platform: string[]
  reach: number
  engagement: number
  countermeasures: string[]
  team: string[]
  nextSteps: string[]
}

const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Election Integrity Defense',
    threat: 'Coordinated voter suppression campaign',
    status: 'active',
    priority: 'critical',
    progress: 65,
    startDate: '2025-09-08',
    lastUpdate: '2 hours ago',
    platform: ['Twitter/X', 'Facebook', 'Telegram'],
    reach: 2500000,
    engagement: 45000,
    countermeasures: ['Fact-check deployed', 'Counter-narrative active', 'Platform reports filed'],
    team: ['Alpha Team', 'Fact-Check Unit', 'Legal'],
    nextSteps: ['Deploy video response', 'Coordinate with election officials', 'Press release']
  },
  {
    id: 'camp-002', 
    name: 'Health Misinfo Rapid Response',
    threat: 'Vaccine disinformation surge',
    status: 'monitoring',
    priority: 'high',
    progress: 80,
    startDate: '2025-09-05',
    lastUpdate: '5 hours ago',
    platform: ['TikTok', 'Instagram'],
    reach: 850000,
    engagement: 12000,
    countermeasures: ['Medical expert responses', 'Influencer partnerships'],
    team: ['Medical Team', 'Social Media Unit'],
    nextSteps: ['Monitor sentiment', 'Prepare FAQ document']
  },
  {
    id: 'camp-003',
    name: 'Climate Denial Counter',
    threat: 'Orchestrated climate science attacks',
    status: 'active',
    priority: 'medium',
    progress: 40,
    startDate: '2025-09-01',
    lastUpdate: '1 day ago',
    platform: ['YouTube', 'Reddit'],
    reach: 450000,
    engagement: 8500,
    countermeasures: ['Scientific rebuttals published', 'Expert AMAs scheduled'],
    team: ['Science Team', 'Content Creators'],
    nextSteps: ['Launch educational series', 'Partner with universities']
  },
  {
    id: 'camp-004',
    name: 'Deep Fake Alert System',
    threat: 'Political figure impersonation',
    status: 'contained',
    priority: 'high',
    progress: 90,
    startDate: '2025-08-28',
    lastUpdate: '3 days ago',
    platform: ['WhatsApp', 'Telegram'],
    reach: 120000,
    engagement: 3200,
    countermeasures: ['Detection algorithms deployed', 'Takedown requests successful'],
    team: ['Tech Team', 'Legal'],
    nextSteps: ['Monitor for variants', 'Update detection models']
  },
  {
    id: 'camp-005',
    name: 'Economic FUD Response',
    threat: 'Market manipulation through false news',
    status: 'resolved',
    priority: 'low',
    progress: 100,
    startDate: '2025-08-15',
    lastUpdate: '1 week ago',
    platform: ['LinkedIn', 'Twitter/X'],
    reach: 75000,
    engagement: 1500,
    countermeasures: ['Official statements released', 'Corrections published'],
    team: ['Finance Team'],
    nextSteps: ['Archive for future reference']
  }
]

const statusColors = {
  active: 'text-green-400 bg-green-500/10 border-green-500/30',
  monitoring: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  contained: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  resolved: 'text-gray-400 bg-gray-500/10 border-gray-500/30'
}

const priorityColors = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400'
}

export default function FakeResistanceTrackerPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [sortField, setSortField] = useState<keyof Campaign>('lastUpdate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showDrawer, setShowDrawer] = useState(false)

  const handleSort = (field: keyof Campaign) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.threat.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || campaign.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  }).sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setShowDrawer(true)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <div className="border-b border-terminal-border bg-terminal-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-terminal-cyan" />
              <div>
                <h1 className="text-2xl font-bold font-mono text-terminal-cyan">
                  #FAKERESISTANCE TRACKER
                </h1>
                <p className="text-xs text-terminal-muted">
                  Monitor and coordinate counter-messaging campaigns
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg bg-terminal-secondary border border-terminal-border 
                         hover:border-terminal-cyan transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-terminal-cyan" />
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500 
                         text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 
                         transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                NEW CAMPAIGN
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-terminal-secondary border border-terminal-border 
                       rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                       focus:border-terminal-cyan focus:outline-none transition-colors"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-terminal-secondary border border-terminal-border 
                     rounded-lg text-terminal-text font-mono focus:border-terminal-cyan 
                     focus:outline-none transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="monitoring">Monitoring</option>
            <option value="contained">Contained</option>
            <option value="resolved">Resolved</option>
          </select>
          
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-3 bg-terminal-secondary border border-terminal-border 
                     rounded-lg text-terminal-text font-mono focus:border-terminal-cyan 
                     focus:outline-none transition-colors"
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-terminal-cyan" />
              <span className="text-xs font-mono text-green-400">ACTIVE</span>
            </div>
            <div className="text-2xl font-bold font-mono text-terminal-text">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
            <div className="text-xs text-terminal-muted">Active Campaigns</div>
          </div>
          
          <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-terminal-cyan" />
              <span className="text-xs font-mono text-terminal-cyan">REACH</span>
            </div>
            <div className="text-2xl font-bold font-mono text-terminal-text">
              {formatNumber(campaigns.reduce((sum, c) => sum + c.reach, 0))}
            </div>
            <div className="text-xs text-terminal-muted">Total Reach</div>
          </div>
          
          <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-terminal-cyan" />
              <span className="text-xs font-mono text-yellow-400">75%</span>
            </div>
            <div className="text-2xl font-bold font-mono text-terminal-text">
              {Math.round(campaigns.reduce((sum, c) => sum + c.progress, 0) / campaigns.length)}%
            </div>
            <div className="text-xs text-terminal-muted">Avg Progress</div>
          </div>
          
          <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-terminal-cyan" />
              <span className="text-xs font-mono text-red-400">CRITICAL</span>
            </div>
            <div className="text-2xl font-bold font-mono text-terminal-text">
              {campaigns.filter(c => c.priority === 'critical').length}
            </div>
            <div className="text-xs text-terminal-muted">Critical Threats</div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 text-xs font-mono text-terminal-cyan 
                             hover:text-cyan-300 transition-colors"
                  >
                    CAMPAIGN
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 text-xs font-mono text-terminal-cyan 
                             hover:text-cyan-300 transition-colors"
                  >
                    STATUS
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('priority')}
                    className="flex items-center gap-1 text-xs font-mono text-terminal-cyan 
                             hover:text-cyan-300 transition-colors"
                  >
                    PRIORITY
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <span className="text-xs font-mono text-terminal-cyan">PROGRESS</span>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('reach')}
                    className="flex items-center gap-1 text-xs font-mono text-terminal-cyan 
                             hover:text-cyan-300 transition-colors"
                  >
                    REACH
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <span className="text-xs font-mono text-terminal-cyan">PLATFORMS</span>
                </th>
                <th className="text-left py-3 px-4">
                  <span className="text-xs font-mono text-terminal-cyan">UPDATED</span>
                </th>
                <th className="text-left py-3 px-4">
                  <span className="text-xs font-mono text-terminal-cyan">ACTIONS</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-terminal-border hover:bg-terminal-secondary/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-mono text-terminal-text">
                        {campaign.name}
                      </p>
                      <p className="text-xs text-terminal-muted line-clamp-1">
                        {campaign.threat}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${statusColors[campaign.status]}`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-mono ${priorityColors[campaign.priority]}`}>
                      {campaign.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-24">
                      <div className="flex justify-between text-xs text-terminal-muted mb-1">
                        <span>{campaign.progress}%</span>
                      </div>
                      <div className="h-2 bg-terminal-bg rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            campaign.progress === 100 
                              ? 'bg-green-500' 
                              : campaign.progress >= 75 
                              ? 'bg-cyan-500' 
                              : campaign.progress >= 50 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-terminal-text">
                      {formatNumber(campaign.reach)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {campaign.platform.slice(0, 2).map((platform) => (
                        <span
                          key={platform}
                          className="px-2 py-1 rounded text-xs bg-terminal-bg border border-terminal-border"
                          title={platform}
                        >
                          {platform.substring(0, 2).toUpperCase()}
                        </span>
                      ))}
                      {campaign.platform.length > 2 && (
                        <span className="px-2 py-1 rounded text-xs bg-terminal-bg border border-terminal-border">
                          +{campaign.platform.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-terminal-muted">
                      {campaign.lastUpdate}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewDetails(campaign)}
                      className="p-2 rounded hover:bg-terminal-secondary text-terminal-cyan 
                               hover:text-cyan-300 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
              <p className="text-terminal-muted font-mono">No campaigns found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {showDrawer && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDrawer(false)}
          />
          
          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-terminal-bg border-l border-terminal-border overflow-y-auto">
            <div className="sticky top-0 bg-terminal-bg border-b border-terminal-border p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-terminal-cyan">
                CAMPAIGN DETAILS
              </h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-2 rounded hover:bg-terminal-secondary text-terminal-muted 
                         hover:text-terminal-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Campaign Header */}
              <div>
                <h3 className="text-2xl font-bold font-mono text-terminal-text mb-2">
                  {selectedCampaign.name}
                </h3>
                <p className="text-terminal-muted">{selectedCampaign.threat}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className={`px-3 py-1 rounded text-sm font-mono ${statusColors[selectedCampaign.status]}`}>
                    {selectedCampaign.status.toUpperCase()}
                  </span>
                  <span className={`text-sm font-mono ${priorityColors[selectedCampaign.priority]}`}>
                    {selectedCampaign.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div>
                <h4 className="text-sm font-mono text-terminal-cyan mb-3">CAMPAIGN PROGRESS</h4>
                <div className="bg-terminal-secondary rounded-lg p-4">
                  <div className="flex justify-between text-sm font-mono mb-2">
                    <span className="text-terminal-text">Overall Progress</span>
                    <span className="text-terminal-cyan">{selectedCampaign.progress}%</span>
                  </div>
                  <div className="h-3 bg-terminal-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${selectedCampaign.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div>
                <h4 className="text-sm font-mono text-terminal-cyan mb-3">METRICS</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-terminal-secondary rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-terminal-cyan" />
                      <span className="text-xs font-mono text-terminal-muted">REACH</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-terminal-text">
                      {formatNumber(selectedCampaign.reach)}
                    </p>
                  </div>
                  <div className="bg-terminal-secondary rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-terminal-cyan" />
                      <span className="text-xs font-mono text-terminal-muted">ENGAGEMENT</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-terminal-text">
                      {formatNumber(selectedCampaign.engagement)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <h4 className="text-sm font-mono text-terminal-cyan mb-3">ACTIVE PLATFORMS</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCampaign.platform.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 rounded bg-terminal-secondary border border-terminal-border 
                               text-sm font-mono text-terminal-text"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Countermeasures */}
              <div>
                <h4 className="text-sm font-mono text-terminal-cyan mb-3">DEPLOYED COUNTERMEASURES</h4>
                <ul className="space-y-2">
                  {selectedCampaign.countermeasures.map((measure, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-terminal-text">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="text-sm font-mono text-terminal-cyan mb-3">NEXT STEPS</h4>
                <ul className="space-y-2">
                  {selectedCampaign.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-terminal-text">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Team */}
              <div>
                <h4 className="text-sm font-mono text-terminal-cyan mb-3">ASSIGNED TEAMS</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCampaign.team.map((team) => (
                    <span
                      key={team}
                      className="px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 
                               text-sm font-mono text-cyan-400"
                    >
                      {team}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-mono text-terminal-cyan mb-3">TIMELINE</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-terminal-muted">Started:</span>
                    <span className="font-mono text-terminal-text">{selectedCampaign.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-muted">Last Update:</span>
                    <span className="font-mono text-terminal-text">{selectedCampaign.lastUpdate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                           text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                           transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  UPDATE STATUS
                </button>
                <button
                  className="flex-1 py-3 rounded-lg bg-terminal-secondary border border-terminal-border 
                           text-terminal-text font-mono font-bold hover:border-terminal-cyan 
                           transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  SHARE REPORT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
