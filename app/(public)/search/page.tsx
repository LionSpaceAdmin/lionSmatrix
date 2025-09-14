'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Filter, ArrowUp, ArrowDown, Clock, TrendingUp, FileText, Users, X, AlertTriangle } from 'lucide-react'
import { NarrativeCard } from '@/components/shared/NarrativeCard'
import { EnhancedTerminalBackground } from '@/components/organisms/EnhancedTerminalBackground'

// Mock search data - in production this would come from search API
const mockData = {
  narratives: [
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
      region: 'North America',
      type: 'narrative'
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
      region: 'Europe',
      type: 'narrative'
    }
  ],
  playbooks: [
    {
      id: 'pb1',
      title: 'Election Disinformation Response Protocol',
      description: 'Comprehensive playbook for identifying and countering election-related disinformation campaigns.',
      category: 'Crisis Response',
      difficulty: 'Advanced',
      estimatedTime: '45-60 minutes',
      lastUpdated: new Date(Date.now() - 86400000).toISOString(),
      tags: ['Elections', 'Crisis', 'Democracy'],
      type: 'playbook'
    },
    {
      id: 'pb2',
      title: 'Deepfake Detection and Verification',
      description: 'Step-by-step guide for detecting and verifying AI-generated media content.',
      category: 'Technical Analysis',
      difficulty: 'Intermediate',
      estimatedTime: '30-45 minutes',
      lastUpdated: new Date(Date.now() - 172800000).toISOString(),
      tags: ['Deepfake', 'AI', 'Verification'],
      type: 'playbook'
    }
  ],
  articles: [
    {
      id: 'art1',
      title: 'Understanding Information Warfare in the Digital Age',
      description: 'Comprehensive guide to modern information warfare tactics and defense strategies.',
      category: 'Educational',
      readTime: '12 min read',
      lastUpdated: new Date(Date.now() - 259200000).toISOString(),
      tags: ['Information Warfare', 'Digital Security', 'Education'],
      type: 'article'
    }
  ]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all'])
  const [sortBy, setSortBy] = useState('relevance')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedResult, setSelectedResult] = useState<number>(-1)

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true)
        // Simulate search delay
        setTimeout(() => setIsSearching(false), 300)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Update URL when query changes
  useEffect(() => {
    const url = new URL(window.location.href)
    if (query.trim()) {
      url.searchParams.set('q', query)
    } else {
      url.searchParams.delete('q')
    }
    router.replace(url.pathname + url.search, { scroll: false })
  }, [query, router])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!query.trim()) return

      const totalResults = filteredResults.length
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedResult(prev => (prev + 1) % totalResults)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedResult(prev => prev <= 0 ? totalResults - 1 : prev - 1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedResult >= 0 && filteredResults[selectedResult]) {
            handleResultClick(filteredResults[selectedResult])
          }
          break
        case 'Escape':
          setSelectedResult(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [query, selectedResult])

  // Filter and search results
  const filteredResults = useMemo(() => {
    if (!query.trim()) return []

    const searchTerm = query.toLowerCase()
    const results: any[] = []

    // Include different types based on selection
    if (selectedTypes.includes('all') || selectedTypes.includes('narratives')) {
      results.push(...mockData.narratives.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.topics.some(topic => topic.toLowerCase().includes(searchTerm))
      ))
    }

    if (selectedTypes.includes('all') || selectedTypes.includes('playbooks')) {
      results.push(...mockData.playbooks.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ))
    }

    if (selectedTypes.includes('all') || selectedTypes.includes('articles')) {
      results.push(...mockData.articles.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ))
    }

    // Sort results
    switch (sortBy) {
      case 'newest':
        return results.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      case 'oldest':
        return results.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime())
      case 'relevance':
      default:
        return results.sort((a, b) => {
          const aRelevance = a.title.toLowerCase().includes(searchTerm) ? 1 : 0
          const bRelevance = b.title.toLowerCase().includes(searchTerm) ? 1 : 0
          return bRelevance - aRelevance
        })
    }
  }, [query, selectedTypes, sortBy])

  const handleResultClick = (result: any) => {
    switch (result.type) {
      case 'narrative':
        router.push(`/archive/${result.id}`)
        break
      case 'playbook':
        router.push(`/academy/playbooks/${result.id}`)
        break
      case 'article':
        router.push(`/academy/${result.id}`)
        break
    }
  }

  const toggleType = (type: string) => {
    if (type === 'all') {
      setSelectedTypes(['all'])
    } else {
      setSelectedTypes(prev => {
        const newTypes = prev.filter(t => t !== 'all')
        if (newTypes.includes(type)) {
          const filtered = newTypes.filter(t => t !== type)
          return filtered.length === 0 ? ['all'] : filtered
        } else {
          return [...newTypes, type]
        }
      })
    }
  }

  const clearSearch = () => {
    setQuery('')
    setSelectedResult(-1)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'narrative':
        return <AlertTriangle className="w-4 h-4" />
      case 'playbook':
        return <FileText className="w-4 h-4" />
      case 'article':
        return <Users className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'narrative':
        return 'Narrative'
      case 'playbook':
        return 'Playbook'
      case 'article':
        return 'Article'
      default:
        return 'Unknown'
    }
  }

  return (
    <main className="relative min-h-screen">
      {/* Enhanced Terminal Background with Warfare Mode for Intensive Search */}
      <EnhancedTerminalBackground 
        intensity="extreme"
        mode="warfare"
        className="fixed inset-0 z-0"
      />
      
      {/* Content */}
      <div className="relative z-10 bg-terminal-bg/70">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-mono text-terminal-cyan mb-2">
            GLOBAL SEARCH
          </h1>
          <p className="text-terminal-muted">
            Search across narratives, playbooks, and educational content.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
            <input
              type="text"
              placeholder="Search for threats, topics, or educational content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-terminal-secondary border border-terminal-border rounded-lg 
                       text-terminal-text font-mono text-lg placeholder-terminal-muted
                       focus:border-terminal-cyan focus:outline-none transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded 
                         hover:bg-terminal-bg transition-colors"
              >
                <X className="w-5 h-5 text-terminal-muted" />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Content Type Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Content' },
              { key: 'narratives', label: 'Narratives' },
              { key: 'playbooks', label: 'Playbooks' },
              { key: 'articles', label: 'Articles' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleType(key)}
                className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
                  selectedTypes.includes(key)
                    ? 'bg-terminal-cyan/20 border border-terminal-cyan text-terminal-cyan'
                    : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:border-terminal-cyan'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-terminal-muted font-mono">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-terminal-secondary border border-terminal-border rounded 
                       text-terminal-text font-mono text-sm
                       focus:border-terminal-cyan focus:outline-none transition-colors"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Search Results */}
        {query.trim() ? (
          <div>
            {/* Results Count */}
            <div className="mb-4 text-sm font-mono text-terminal-muted">
              {isSearching ? (
                <span>Searching...</span>
              ) : (
                <span>
                  {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} 
                  {query && ` for "${query}"`}
                </span>
              )}
            </div>

            {/* Results List */}
            {filteredResults.length > 0 ? (
              <div className="space-y-4">
                {filteredResults.map((result, index) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className={`p-4 bg-terminal-secondary border rounded-lg cursor-pointer transition-colors ${
                      selectedResult === index
                        ? 'border-terminal-cyan bg-terminal-cyan/5'
                        : 'border-terminal-border hover:border-terminal-cyan/50'
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    {/* Result Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getResultIcon(result.type)}
                        <span className="text-xs font-mono text-terminal-cyan uppercase">
                          {getResultTypeLabel(result.type)}
                        </span>
                      </div>
                      <span className="text-xs text-terminal-muted font-mono">
                        <Clock className="inline w-3 h-3 mr-1" />
                        {new Date(result.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Result Content */}
                    <h3 className="text-lg font-bold text-terminal-text mb-2 hover:text-terminal-cyan transition-colors">
                      {result.title}
                    </h3>
                    <p className="text-terminal-muted text-sm mb-3 line-clamp-2">
                      {result.description}
                    </p>

                    {/* Result Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {(result.topics || result.tags || []).slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-terminal-bg border border-terminal-border rounded text-xs font-mono text-terminal-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {result.type === 'narrative' && (
                        <div className="flex items-center gap-2 text-xs text-terminal-muted">
                          <span>Confidence: {result.confidence}%</span>
                          <span>Evidence: {result.evidenceCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !isSearching ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-terminal-muted mx-auto mb-4 opacity-50" />
                <p className="text-terminal-muted font-mono">
                  No results found for "{query}"
                </p>
                <p className="text-terminal-muted text-sm mt-2">
                  Try different keywords or check your spelling
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          /* Search Suggestions */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
              <h3 className="text-lg font-bold text-terminal-text mb-3">
                Popular Searches
              </h3>
              <div className="space-y-2">
                {['election disinformation', 'deepfake detection', 'bot networks', 'fact checking'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="block text-left text-terminal-cyan hover:text-terminal-cyan/80 transition-colors font-mono text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
              <h3 className="text-lg font-bold text-terminal-text mb-3">
                Recent Threats
              </h3>
              <div className="space-y-2">
                {['coordinated inauthentic behavior', 'AI-generated content', 'foreign interference'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="block text-left text-terminal-cyan hover:text-terminal-cyan/80 transition-colors font-mono text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
              <h3 className="text-lg font-bold text-terminal-text mb-3">
                Browse Categories
              </h3>
              <div className="space-y-2">
                <a href="/archive" className="block text-terminal-cyan hover:text-terminal-cyan/80 transition-colors font-mono text-sm">
                  All Narratives
                </a>
                <a href="/academy/playbooks" className="block text-terminal-cyan hover:text-terminal-cyan/80 transition-colors font-mono text-sm">
                  Crisis Playbooks
                </a>
                <a href="/academy" className="block text-terminal-cyan hover:text-terminal-cyan/80 transition-colors font-mono text-sm">
                  Educational Content
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </main>
  )
}