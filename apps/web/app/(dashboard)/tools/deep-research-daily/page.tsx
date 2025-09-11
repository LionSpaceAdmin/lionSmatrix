'use client'

import { useState, useEffect } from 'react'
import { 
  Database, Search, Save, Download, Plus, X, Clock, 
  Star, Folder, Tag, Calendar, Edit3, Trash2, 
  FileText, Copy, Share2, Filter, ChevronDown,
  ChevronRight, AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react'

interface SavedQuery {
  id: string
  title: string
  query: string
  category: string
  tags: string[]
  createdAt: string
  lastUsed: string
  usageCount: number
  starred: boolean
}

interface ResearchNote {
  id: string
  title: string
  content: string
  queries: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface SearchResult {
  id: string
  title: string
  source: string
  url: string
  snippet: string
  relevance: number
  date: string
}

const categories = [
  'Politics', 'Health', 'Climate', 'Technology', 
  'Economy', 'Social Media', 'Science', 'General'
]

const mockSavedQueries: SavedQuery[] = [
  {
    id: 'q1',
    title: 'Election interference patterns',
    query: 'election interference disinformation campaigns 2025',
    category: 'Politics',
    tags: ['election', 'interference', 'campaigns'],
    createdAt: '2025-09-01',
    lastUsed: '2025-09-10',
    usageCount: 12,
    starred: true
  },
  {
    id: 'q2',
    title: 'Vaccine misinformation sources',
    query: 'vaccine misinformation primary sources telegram',
    category: 'Health',
    tags: ['vaccine', 'health', 'telegram'],
    createdAt: '2025-08-28',
    lastUsed: '2025-09-08',
    usageCount: 8,
    starred: false
  },
  {
    id: 'q3',
    title: 'Climate denial networks',
    query: 'climate change denial funding networks',
    category: 'Climate',
    tags: ['climate', 'denial', 'funding'],
    createdAt: '2025-08-15',
    lastUsed: '2025-09-05',
    usageCount: 5,
    starred: true
  }
]

const mockSearchResults: SearchResult[] = [
  {
    id: 'r1',
    title: 'Coordinated Campaign Targets Election Officials',
    source: 'Reuters',
    url: 'https://example.com/article1',
    snippet: 'A sophisticated disinformation campaign targeting election officials has been identified across multiple social media platforms...',
    relevance: 95,
    date: '2025-09-10'
  },
  {
    id: 'r2',
    title: 'Analysis: Bot Networks Amplify False Claims',
    source: 'AP News',
    url: 'https://example.com/article2',
    snippet: 'Research shows coordinated bot networks are being used to amplify false claims about voting systems...',
    relevance: 88,
    date: '2025-09-09'
  },
  {
    id: 'r3',
    title: 'Fact Check: Viral Post Misrepresents Data',
    source: 'FactCheck.org',
    url: 'https://example.com/article3',
    snippet: 'A viral social media post claiming widespread voter fraud has been thoroughly debunked by election experts...',
    relevance: 82,
    date: '2025-09-08'
  }
]

export default function DeepResearchDailyPage() {
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([])
  const [notes, setNotes] = useState<ResearchNote[]>([])
  const [currentQuery, setCurrentQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedNote, setSelectedNote] = useState<ResearchNote | null>(null)
  const [noteContent, setNoteContent] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showSaveQueryModal, setShowSaveQueryModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'queries' | 'notes'>('queries')

  // Load data from localStorage on mount
  useEffect(() => {
    const storedQueries = localStorage.getItem('deepResearchQueries')
    const storedNotes = localStorage.getItem('deepResearchNotes')
    
    if (storedQueries) {
      setSavedQueries(JSON.parse(storedQueries))
    } else {
      setSavedQueries(mockSavedQueries)
    }
    
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes))
    }
  }, [])

  // Save queries to localStorage
  useEffect(() => {
    if (savedQueries.length > 0) {
      localStorage.setItem('deepResearchQueries', JSON.stringify(savedQueries))
    }
  }, [savedQueries])

  // Save notes to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('deepResearchNotes', JSON.stringify(notes))
    }
  }, [notes])

  const handleSearch = async () => {
    if (!currentQuery.trim()) return
    
    setIsSearching(true)
    
    // Mock search
    setTimeout(() => {
      setSearchResults(mockSearchResults)
      setIsSearching(false)
      
      // Update usage count if it's a saved query
      const queryIndex = savedQueries.findIndex(q => q.query === currentQuery)
      if (queryIndex !== -1) {
        const updatedQueries = [...savedQueries]
        updatedQueries[queryIndex].usageCount++
        updatedQueries[queryIndex].lastUsed = new Date().toISOString().split('T')[0]
        setSavedQueries(updatedQueries)
      }
    }, 1500)
  }

  const saveQuery = (title: string, category: string, tags: string[]) => {
    const newQuery: SavedQuery = {
      id: `q${Date.now()}`,
      title,
      query: currentQuery,
      category,
      tags,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0],
      usageCount: 1,
      starred: false
    }
    
    setSavedQueries([newQuery, ...savedQueries])
    setShowSaveQueryModal(false)
  }

  const deleteQuery = (id: string) => {
    setSavedQueries(savedQueries.filter(q => q.id !== id))
  }

  const toggleStarQuery = (id: string) => {
    setSavedQueries(savedQueries.map(q => 
      q.id === id ? { ...q, starred: !q.starred } : q
    ))
  }

  const saveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return
    
    if (selectedNote) {
      // Update existing note
      setNotes(notes.map(n => 
        n.id === selectedNote.id 
          ? { ...n, title: noteTitle, content: noteContent, updatedAt: new Date().toISOString() }
          : n
      ))
    } else {
      // Create new note
      const newNote: ResearchNote = {
        id: `n${Date.now()}`,
        title: noteTitle,
        content: noteContent,
        queries: currentQuery ? [currentQuery] : [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNotes([newNote, ...notes])
    }
    
    // Clear form
    setNoteTitle('')
    setNoteContent('')
    setSelectedNote(null)
  }

  const exportNotes = () => {
    const markdown = notes.map(note => 
      `# ${note.title}\n\n*Created: ${note.createdAt}*\n\n${note.content}\n\n---\n`
    ).join('\n')
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `research-notes-${new Date().toISOString().split('T')[0]}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
      setNoteTitle('')
      setNoteContent('')
    }
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <div className="border-b border-terminal-border bg-terminal-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-terminal-cyan" />
              <div>
                <h1 className="text-2xl font-bold font-mono text-terminal-cyan">
                  DEEP RESEARCH DAILY
                </h1>
                <p className="text-xs text-terminal-muted">
                  Advanced research workspace with saved queries and notes
                </p>
              </div>
            </div>
            
            <button
              onClick={exportNotes}
              disabled={notes.length === 0}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500 
                       text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              EXPORT NOTES
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Saved Queries & Notes */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tab Switcher */}
            <div className="flex rounded-lg bg-terminal-secondary p-1">
              <button
                onClick={() => setActiveTab('queries')}
                className={`flex-1 py-2 px-3 rounded font-mono text-sm transition-all ${
                  activeTab === 'queries'
                    ? 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                QUERIES ({savedQueries.length})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2 px-3 rounded font-mono text-sm transition-all ${
                  activeTab === 'notes'
                    ? 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                NOTES ({notes.length})
              </button>
            </div>

            {/* Queries List */}
            {activeTab === 'queries' && (
              <div className="space-y-2">
                {savedQueries.map((query) => (
                  <div
                    key={query.id}
                    className="p-3 rounded-lg bg-terminal-secondary border border-terminal-border 
                             hover:border-terminal-cyan transition-colors cursor-pointer"
                    onClick={() => setCurrentQuery(query.query)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-mono text-terminal-text line-clamp-1">
                        {query.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStarQuery(query.id)
                        }}
                        className={`p-1 transition-colors ${
                          query.starred ? 'text-yellow-400' : 'text-terminal-muted hover:text-terminal-text'
                        }`}
                      >
                        <Star className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                    <p className="text-xs text-terminal-muted line-clamp-2 mb-2">
                      {query.query}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-terminal-muted">
                        Used {query.usageCount}x
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteQuery(query.id)
                        }}
                        className="p-1 rounded hover:bg-red-500/20 text-terminal-muted 
                                 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {savedQueries.length === 0 && (
                  <div className="text-center py-8">
                    <Database className="w-8 h-8 text-terminal-muted mx-auto mb-2" />
                    <p className="text-xs text-terminal-muted">No saved queries yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Notes List */}
            {activeTab === 'notes' && (
              <div className="space-y-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedNote?.id === note.id
                        ? 'bg-cyan-500/20 border-cyan-500'
                        : 'bg-terminal-secondary border-terminal-border hover:border-terminal-cyan'
                    }`}
                    onClick={() => {
                      setSelectedNote(note)
                      setNoteTitle(note.title)
                      setNoteContent(note.content)
                    }}
                  >
                    <h4 className="text-sm font-mono text-terminal-text mb-1 line-clamp-1">
                      {note.title}
                    </h4>
                    <p className="text-xs text-terminal-muted line-clamp-2">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-terminal-muted">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id)
                        }}
                        className="p-1 rounded hover:bg-red-500/20 text-terminal-muted 
                                 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {notes.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 text-terminal-muted mx-auto mb-2" />
                    <p className="text-xs text-terminal-muted">No notes yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
                <input
                  type="text"
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter research query..."
                  className="w-full pl-10 pr-4 py-3 bg-terminal-secondary border border-terminal-border 
                           rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                           focus:border-terminal-cyan focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!currentQuery.trim() || isSearching}
                className="px-6 py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                         text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent 
                                  rounded-full animate-spin" />
                    SEARCHING...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    SEARCH
                  </>
                )}
              </button>
              <button
                onClick={() => setShowSaveQueryModal(true)}
                disabled={!currentQuery.trim()}
                className="p-3 rounded-lg bg-terminal-secondary border border-terminal-border 
                         hover:border-terminal-cyan transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed"
                title="Save Query"
              >
                <Save className="w-5 h-5 text-terminal-cyan" />
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-mono text-terminal-cyan">
                  SEARCH RESULTS ({searchResults.length})
                </h3>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border 
                             hover:border-terminal-cyan transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-terminal-text font-mono">
                        {result.title}
                      </h4>
                      <span className="text-xs font-mono text-terminal-cyan">
                        {result.relevance}% match
                      </span>
                    </div>
                    <p className="text-sm text-terminal-muted mb-3">
                      {result.snippet}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-terminal-muted">
                        <span>{result.source}</span>
                        <span>•</span>
                        <span>{result.date}</span>
                      </div>
                      <button
                        onClick={() => {
                          const citation = `[${result.title}](${result.url})`
                          setNoteContent(prev => prev + '\n\n' + citation)
                        }}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        ADD TO NOTES →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notes Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-mono text-terminal-cyan">
                  {selectedNote ? 'EDIT NOTE' : 'NEW NOTE'}
                </h3>
                {selectedNote && (
                  <button
                    onClick={() => {
                      setSelectedNote(null)
                      setNoteTitle('')
                      setNoteContent('')
                    }}
                    className="text-sm font-mono text-terminal-muted hover:text-terminal-text transition-colors"
                  >
                    CLEAR
                  </button>
                )}
              </div>
              
              <div>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note title..."
                  className="w-full px-4 py-3 bg-terminal-secondary border border-terminal-border 
                           rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                           focus:border-terminal-cyan focus:outline-none transition-colors mb-3"
                />
                
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Start writing your research notes here... Supports Markdown formatting."
                  rows={12}
                  className="w-full px-4 py-3 bg-terminal-secondary border border-terminal-border 
                           rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                           focus:border-terminal-cyan focus:outline-none transition-colors resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={saveNote}
                  disabled={!noteTitle.trim() || !noteContent.trim()}
                  className="flex-1 py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                           text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {selectedNote ? 'UPDATE NOTE' : 'SAVE NOTE'}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(noteContent)
                    alert('Note copied to clipboard!')
                  }}
                  disabled={!noteContent.trim()}
                  className="px-6 py-3 rounded-lg bg-terminal-secondary border border-terminal-border 
                           text-terminal-text font-mono hover:border-terminal-cyan 
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  COPY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Query Modal */}
      {showSaveQueryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSaveQueryModal(false)}
          />
          <div className="relative bg-terminal-bg border border-terminal-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-4">
              SAVE QUERY
            </h3>
            <SaveQueryForm
              query={currentQuery}
              onSave={saveQuery}
              onCancel={() => setShowSaveQueryModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Save Query Form Component
function SaveQueryForm({ 
  query, 
  onSave, 
  onCancel 
}: { 
  query: string
  onSave: (title: string, category: string, tags: string[]) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('General')
  const [tags, setTags] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave(
        title,
        category,
        tags.split(',').map(t => t.trim()).filter(Boolean)
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-mono text-terminal-muted mb-2">
          QUERY
        </label>
        <p className="text-sm text-terminal-text bg-terminal-secondary p-3 rounded border border-terminal-border">
          {query}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-mono text-terminal-muted mb-2">
          TITLE *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give this query a memorable name..."
          className="w-full px-3 py-2 bg-terminal-secondary border border-terminal-border 
                   rounded text-terminal-text font-mono text-sm placeholder-terminal-muted
                   focus:border-terminal-cyan focus:outline-none transition-colors"
          autoFocus
        />
      </div>
      
      <div>
        <label className="block text-sm font-mono text-terminal-muted mb-2">
          CATEGORY
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-terminal-secondary border border-terminal-border 
                   rounded text-terminal-text font-mono text-sm focus:border-terminal-cyan 
                   focus:outline-none transition-colors"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-mono text-terminal-muted mb-2">
          TAGS (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tag1, tag2, tag3"
          className="w-full px-3 py-2 bg-terminal-secondary border border-terminal-border 
                   rounded text-terminal-text font-mono text-sm placeholder-terminal-muted
                   focus:border-terminal-cyan focus:outline-none transition-colors"
        />
      </div>
      
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 py-2 rounded bg-cyan-500/20 border border-cyan-500 
                   text-cyan-400 font-mono text-sm font-bold hover:bg-cyan-500/30 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          SAVE
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded bg-terminal-secondary border border-terminal-border 
                   text-terminal-text font-mono text-sm hover:border-terminal-cyan 
                   transition-colors"
        >
          CANCEL
        </button>
      </div>
    </form>
  )
}
