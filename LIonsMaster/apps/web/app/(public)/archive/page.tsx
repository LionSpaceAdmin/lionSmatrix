'use client'

import { useState, useMemo } from 'react'
import type { Metadata } from 'next'
import { Search, Filter, Calendar, MapPin, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { NarrativeCard } from '@/components/shared/NarrativeCard'
import { EvidenceList } from '@/components/shared/EvidenceList'

// Mock data - in production this would come from API
const allNarratives = [
  {
    id: '1',
    title: 'Coordinated Bot Network Targets Election Integrity',
    description: 'Large-scale bot operation spreading false claims about voting systems detected across multiple platforms.',
    threatLevel: 'critical' as const,
    confidence: 89,
    evidenceCount: 234,
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    topics: ['Elections', 'Bots', 'Democracy'],
    impactScore: 87.3,
    region: 'North America'
  },
  {
    id: '2',
    title: 'Deepfake Video of World Leader Goes Viral',
    description: 'AI-generated video falsely showing political leader making inflammatory statements spreads rapidly.',
    threatLevel: 'critical' as const,
    confidence: 94,
    evidenceCount: 156,
    lastUpdated: new Date(Date.now() - 7200000).toISOString(),
    topics: ['Deepfake', 'Politics', 'AI'],
    impactScore: 92.1,
    region: 'Europe'
  },
  {
    id: '3',
    title: 'Health Misinformation Campaign Using Fake Doctors',
    description: 'Coordinated campaign using fake medical professionals to spread vaccine misinformation identified.',
    threatLevel: 'high' as const,
    confidence: 91,
    evidenceCount: 178,
    lastUpdated: new Date(Date.now() - 14400000).toISOString(),
    topics: ['Health', 'Vaccines', 'Impersonation'],
    impactScore: 76.5,
    region: 'Global'
  },
  {
    id: '4',
    title: 'Financial Market Manipulation Through False Reports',
    description: 'Orchestrated effort to manipulate stock prices through fabricated company announcements detected.',
    threatLevel: 'high' as const,
    confidence: 88,
    evidenceCount: 89,
    lastUpdated: new Date(Date.now() - 21600000).toISOString(),
    topics: ['Finance', 'Markets', 'Fraud'],
    impactScore: 68.9,
    region: 'Asia Pacific'
  },
  {
    id: '5',
    title: 'Climate Data Manipulation Claims Debunked',
    description: 'Viral posts claiming weather data manipulation proven false through satellite verification.',
    threatLevel: 'medium' as const,
    confidence: 96,
    evidenceCount: 67,
    lastUpdated: new Date(Date.now() - 28800000).toISOString(),
    topics: ['Climate', 'Science', 'Data'],
    impactScore: 43.2,
    region: 'Global'
  },
  {
    id: '6',
    title: 'Foreign Influence Operation Targeting Youth',
    description: 'Sophisticated campaign using gaming platforms and social media to spread propaganda to teenagers.',
    threatLevel: 'high' as const,
    confidence: 85,
    evidenceCount: 145,
    lastUpdated: new Date(Date.now() - 36000000).toISOString(),
    topics: ['Foreign Influence', 'Youth', 'Gaming'],
    impactScore: 71.8,
    region: 'North America'
  },
  {
    id: '7',
    title: 'AI-Generated News Sites Spreading False Stories',
    description: 'Network of AI-powered fake news websites creating and distributing fabricated stories at scale.',
    threatLevel: 'high' as const,
    confidence: 93,
    evidenceCount: 298,
    lastUpdated: new Date(Date.now() - 43200000).toISOString(),
    topics: ['AI', 'Fake News', 'Automation'],
    impactScore: 81.4,
    region: 'Global'
  },
  {
    id: '8',
    title: 'Supply Chain Attack False Flag Operation',
    description: 'False claims about food contamination designed to disrupt supply chains and cause panic.',
    threatLevel: 'medium' as const,
    confidence: 90,
    evidenceCount: 56,
    lastUpdated: new Date(Date.now() - 50400000).toISOString(),
    topics: ['Supply Chain', 'Food', 'Panic'],
    impactScore: 52.7,
    region: 'Europe'
  },
  {
    id: '9',
    title: 'Celebrity Death Hoax Used for Phishing',
    description: 'False reports of celebrity death used to drive traffic to phishing sites stealing personal data.',
    threatLevel: 'low' as const,
    confidence: 97,
    evidenceCount: 34,
    lastUpdated: new Date(Date.now() - 57600000).toISOString(),
    topics: ['Phishing', 'Celebrity', 'Scam'],
    impactScore: 28.3,
    region: 'Global'
  },
  {
    id: '10',
    title: 'Cryptocurrency Pump and Dump Scheme',
    description: 'Coordinated social media campaign to artificially inflate cryptocurrency prices before mass selloff.',
    threatLevel: 'medium' as const,
    confidence: 92,
    evidenceCount: 123,
    lastUpdated: new Date(Date.now() - 64800000).toISOString(),
    topics: ['Crypto', 'Finance', 'Scam'],
    impactScore: 47.6,
    region: 'Global'
  }
]

const regions = ['All Regions', 'Global', 'North America', 'Europe', 'Asia Pacific', 'Middle East', 'Africa', 'South America']
const threatLevels = ['All Levels', 'critical', 'high', 'medium', 'low']
const topics = ['All Topics', 'Elections', 'Health', 'Climate', 'Finance', 'Politics', 'AI', 'Deepfake', 'Bots', 'Crypto']
const timeRanges = ['All Time', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months']

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All Regions')
  const [selectedThreatLevel, setSelectedThreatLevel] = useState('All Levels')
  const [selectedTopic, setSelectedTopic] = useState('All Topics')
  const [selectedTimeRange, setSelectedTimeRange] = useState('All Time')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  
  const itemsPerPage = 6

  // Filter narratives based on search and filters
  const filteredNarratives = useMemo(() => {
    return allNarratives.filter(narrative => {
      // Search query
      if (searchQuery && !narrative.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !narrative.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Region filter
      if (selectedRegion !== 'All Regions' && narrative.region !== selectedRegion) {
        return false
      }
      
      // Threat level filter
      if (selectedThreatLevel !== 'All Levels' && narrative.threatLevel !== selectedThreatLevel) {
        return false
      }
      
      // Topic filter
      if (selectedTopic !== 'All Topics' && !narrative.topics.includes(selectedTopic)) {
        return false
      }
      
      // Time range filter
      const narrativeDate = new Date(narrative.lastUpdated)
      const now = new Date()
      const daysDiff = (now.getTime() - narrativeDate.getTime()) / (1000 * 60 * 60 * 24)
      
      switch (selectedTimeRange) {
        case 'Last 24 Hours':
          if (daysDiff > 1) return false
          break
        case 'Last 7 Days':
          if (daysDiff > 7) return false
          break
        case 'Last 30 Days':
          if (daysDiff > 30) return false
          break
        case 'Last 3 Months':
          if (daysDiff > 90) return false
          break
      }
      
      return true
    })
  }, [searchQuery, selectedRegion, selectedThreatLevel, selectedTopic, selectedTimeRange])

  // Pagination
  const totalPages = Math.ceil(filteredNarratives.length / itemsPerPage)
  const paginatedNarratives = filteredNarratives.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedRegion('All Regions')
    setSelectedThreatLevel('All Levels')
    setSelectedTopic('All Topics')
    setSelectedTimeRange('All Time')
    setCurrentPage(1)
  }

  const activeFiltersCount = [
    selectedRegion !== 'All Regions',
    selectedThreatLevel !== 'All Levels',
    selectedTopic !== 'All Topics',
    selectedTimeRange !== 'All Time'
  ].filter(Boolean).length

  return (
    <main className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-mono text-terminal-cyan mb-2">
            NARRATIVE ARCHIVE
          </h1>
          <p className="text-terminal-muted">
            Complete database of tracked disinformation campaigns and narratives.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
            <input
              type="text"
              placeholder="Search narratives by title or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-3 bg-terminal-secondary border border-terminal-border rounded-lg 
                       text-terminal-text font-mono placeholder-terminal-muted
                       focus:border-terminal-cyan focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded 
                         hover:bg-terminal-bg transition-colors"
              >
                <X className="w-4 h-4 text-terminal-muted" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-terminal-secondary 
                     border border-terminal-border text-terminal-text font-mono
                     hover:border-terminal-cyan transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>FILTERS</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-terminal-cyan/20 text-terminal-cyan text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Region Filter */}
              <div>
                <label className="block text-xs font-mono text-terminal-muted mb-2 uppercase">
                  <MapPin className="inline w-3 h-3 mr-1" />
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border rounded 
                           text-terminal-text font-mono text-sm
                           focus:border-terminal-cyan focus:outline-none transition-colors"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Threat Level Filter */}
              <div>
                <label className="block text-xs font-mono text-terminal-muted mb-2 uppercase">
                  <AlertTriangle className="inline w-3 h-3 mr-1" />
                  Threat Level
                </label>
                <select
                  value={selectedThreatLevel}
                  onChange={(e) => {
                    setSelectedThreatLevel(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border rounded 
                           text-terminal-text font-mono text-sm
                           focus:border-terminal-cyan focus:outline-none transition-colors"
                >
                  {threatLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Topic Filter */}
              <div>
                <label className="block text-xs font-mono text-terminal-muted mb-2 uppercase">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => {
                    setSelectedTopic(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border rounded 
                           text-terminal-text font-mono text-sm
                           focus:border-terminal-cyan focus:outline-none transition-colors"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              {/* Time Range Filter */}
              <div>
                <label className="block text-xs font-mono text-terminal-muted mb-2 uppercase">
                  <Calendar className="inline w-3 h-3 mr-1" />
                  Time Range
                </label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => {
                    setSelectedTimeRange(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border rounded 
                           text-terminal-text font-mono text-sm
                           focus:border-terminal-cyan focus:outline-none transition-colors"
                >
                  {timeRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-3 py-2 rounded bg-terminal-bg border border-terminal-border 
                           text-terminal-muted font-mono text-sm
                           hover:border-terminal-cyan hover:text-terminal-cyan transition-colors"
                >
                  RESET ALL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm font-mono text-terminal-muted">
          Showing {paginatedNarratives.length} of {filteredNarratives.length} narratives
        </div>

        {/* Narrative Grid */}
        {paginatedNarratives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedNarratives.map(narrative => (
              <NarrativeCard
                key={narrative.id}
                narrative={narrative}
                onFactCheck={() => console.log('Fact check:', narrative.id)}
                onViewDetails={() => console.log('View details:', narrative.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-terminal-muted mx-auto mb-4 opacity-50" />
            <p className="text-terminal-muted font-mono">
              No narratives found matching your criteria
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded bg-terminal-secondary border border-terminal-border 
                       text-terminal-text font-mono hover:border-terminal-cyan transition-colors"
            >
              RESET FILTERS
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded bg-terminal-secondary border border-terminal-border 
                       text-terminal-text font-mono disabled:opacity-50 disabled:cursor-not-allowed
                       hover:border-terminal-cyan transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded font-mono transition-colors ${
                    page === currentPage
                      ? 'bg-terminal-cyan/20 border border-terminal-cyan text-terminal-cyan'
                      : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:border-terminal-cyan'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded bg-terminal-secondary border border-terminal-border 
                       text-terminal-text font-mono disabled:opacity-50 disabled:cursor-not-allowed
                       hover:border-terminal-cyan transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
