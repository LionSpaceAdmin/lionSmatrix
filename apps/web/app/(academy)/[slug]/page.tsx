'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  BookOpen, Clock, Eye, Calendar, User, Share2, 
  Download, ChevronLeft, ChevronRight, Hash, 
  Copy, CheckCircle, AlertCircle, ChevronDown,
  ChevronUp, BookmarkPlus, ThumbsUp, MessageSquare
} from 'lucide-react'

interface TableOfContentsItem {
  id: string
  title: string
  level: number
}

interface Article {
  id: string
  title: string
  category: string
  description: string
  content: string
  readTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  author: {
    name: string
    role: string
    avatar?: string
  }
  date: string
  views: number
  likes: number
  comments: number
  toc: TableOfContentsItem[]
  relatedArticles: string[]
}

// Mock article data - in production this would come from API/MDX
const mockArticle: Article = {
  id: 'art-001',
  title: 'Understanding Information Warfare: A Comprehensive Guide',
  category: 'fundamentals',
  description: 'Learn the basics of modern information warfare, including tactics, actors, and defense strategies.',
  content: `
# Introduction

Information warfare represents one of the most significant challenges of our digital age. As societies become increasingly connected, the battlefield has expanded from physical territories to the minds and perceptions of billions of people worldwide.

## What is Information Warfare?

Information warfare encompasses the use and management of information and communication technology to gain a competitive advantage over an adversary. It includes:

- **Disinformation campaigns** - Deliberately false information spread to deceive
- **Propaganda** - Biased information used to promote a political cause
- **Psychological operations** - Operations to convey selected information to influence emotions
- **Cyber warfare** - Use of technology to attack a nation's computers or information networks

### Key Characteristics

The modern information battlefield has several unique characteristics that distinguish it from traditional warfare:

1. **Speed of propagation** - False information can spread globally in minutes
2. **Low barrier to entry** - Anyone with internet access can participate
3. **Attribution challenges** - Difficult to identify the true source of attacks
4. **Persistence** - False information can persist long after being debunked

## Historical Context

While the tools have evolved, information warfare is not new. Throughout history, nations and groups have sought to control narratives and influence public opinion.

### Ancient Examples

- Sun Tzu's "The Art of War" emphasized deception as a key military strategy
- Roman emperors used propaganda to maintain power and legitimacy
- Medieval kingdoms spread rumors to demoralize enemy populations

### Modern Evolution

The 20th century saw information warfare become increasingly sophisticated:

- **World War I** - First systematic use of mass propaganda
- **World War II** - Radio broadcasts and leaflet drops
- **Cold War** - Ideological battles and active measures
- **Digital Age** - Social media and algorithmic amplification

## Current Threat Landscape

Today's information warfare landscape is more complex than ever before. State and non-state actors employ sophisticated techniques to manipulate public opinion, undermine trust in institutions, and sow division within societies.

### Primary Actors

#### State Actors
Nation-states remain the most capable and persistent threats in the information warfare domain. They possess:
- Significant resources and infrastructure
- Advanced technical capabilities
- Strategic patience and long-term planning
- Diplomatic cover for operations

#### Non-State Actors
Various non-state groups also engage in information warfare:
- Terrorist organizations
- Criminal networks
- Hacktivist collectives
- Corporate entities

### Common Tactics and Techniques

Understanding the tactics used in information warfare is crucial for developing effective defenses:

#### 1. Flooding the Zone
Overwhelming audiences with massive amounts of information, making it difficult to distinguish truth from fiction.

#### 2. Amplification Networks
Using bot networks and coordinated accounts to artificially amplify messages and create the appearance of grassroots support.

#### 3. Narrative Laundering
Introducing false information through obscure sources, then citing those sources in mainstream discussions.

#### 4. Emotional Manipulation
Crafting content designed to trigger strong emotional responses that bypass critical thinking.

## Defense Strategies

Protecting against information warfare requires a multi-layered approach combining technological solutions, education, and institutional resilience.

### Individual Level

Every person can contribute to defense against information warfare:

- **Develop media literacy** - Learn to evaluate sources and identify manipulation techniques
- **Verify before sharing** - Check information through multiple reliable sources
- **Understand cognitive biases** - Recognize how our own biases make us vulnerable
- **Practice digital hygiene** - Secure accounts and be cautious about personal information

### Community Level

Communities can build resilience through:

- **Education programs** - Teaching critical thinking and media literacy
- **Trusted information networks** - Establishing reliable local information sources
- **Rapid response teams** - Groups trained to identify and counter false information
- **Community dialogue** - Creating spaces for constructive discussion

### Institutional Level

Organizations and institutions must:

- **Develop clear policies** - Establish guidelines for handling disinformation
- **Build detection capabilities** - Invest in tools and training
- **Foster transparency** - Communicate clearly and frequently with stakeholders
- **Collaborate across sectors** - Share threat intelligence and best practices

## Case Studies

### Case Study 1: Election Interference

The 2016 U.S. presidential election demonstrated the vulnerability of democratic processes to information warfare...

### Case Study 2: COVID-19 "Infodemic"

The pandemic created fertile ground for health-related disinformation...

### Case Study 3: Corporate Disinformation

How businesses are targeted and can defend themselves...

## Future Outlook

As technology continues to evolve, so too will the tactics and techniques of information warfare. Emerging challenges include:

- **Deepfakes and synthetic media**
- **AI-powered disinformation**
- **Quantum computing implications**
- **Metaverse manipulation**

## Conclusion

Information warfare represents an ongoing challenge that requires constant vigilance and adaptation. By understanding the threat landscape and implementing comprehensive defense strategies, we can build more resilient societies capable of preserving truth and democratic values in the digital age.

## Additional Resources

- [RAND Corporation Information Warfare Studies](#)
- [Atlantic Council DFRLab](#)
- [Stanford Internet Observatory](#)
- [First Draft Coalition](#)
`,
  readTime: 15,
  difficulty: 'beginner',
  tags: ['basics', 'information-warfare', 'strategy', 'defense', 'education'],
  author: {
    name: 'Dr. Sarah Chen',
    role: 'Senior Research Fellow',
  },
  date: '2025-09-08',
  views: 2543,
  likes: 187,
  comments: 23,
  toc: [
    { id: 'introduction', title: 'Introduction', level: 1 },
    { id: 'what-is-information-warfare', title: 'What is Information Warfare?', level: 2 },
    { id: 'key-characteristics', title: 'Key Characteristics', level: 3 },
    { id: 'historical-context', title: 'Historical Context', level: 2 },
    { id: 'ancient-examples', title: 'Ancient Examples', level: 3 },
    { id: 'modern-evolution', title: 'Modern Evolution', level: 3 },
    { id: 'current-threat-landscape', title: 'Current Threat Landscape', level: 2 },
    { id: 'primary-actors', title: 'Primary Actors', level: 3 },
    { id: 'common-tactics', title: 'Common Tactics and Techniques', level: 3 },
    { id: 'defense-strategies', title: 'Defense Strategies', level: 2 },
    { id: 'case-studies', title: 'Case Studies', level: 2 },
    { id: 'future-outlook', title: 'Future Outlook', level: 2 },
    { id: 'conclusion', title: 'Conclusion', level: 2 },
  ],
  relatedArticles: ['art-002', 'art-003', 'art-004']
}

export default function ArticlePage() {
  const params = useParams()
  const [article] = useState(mockArticle) // In production, fetch based on params.slug
  const [activeTocItem, setActiveTocItem] = useState('')
  const [showToc, setShowToc] = useState(true)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    // Set up intersection observer for TOC highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTocItem(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -70% 0px' }
    )

    // Observe all headings
    document.querySelectorAll('h1, h2, h3').forEach((heading) => {
      if (heading.id) observer.observe(heading)
    })

    return () => observer.disconnect()
  }, [])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'advanced': return 'text-red-400 bg-red-500/10 border-red-500/30'
      default: return 'text-terminal-muted bg-terminal-secondary border-terminal-border'
    }
  }

  // Render markdown content as HTML (simplified - use a proper MDX parser in production)
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          const id = line.slice(2).toLowerCase().replace(/\s+/g, '-')
          return <h1 key={index} id={id} className="text-3xl font-bold text-terminal-cyan mt-8 mb-4">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          const id = line.slice(3).toLowerCase().replace(/\s+/g, '-')
          return <h2 key={index} id={id} className="text-2xl font-bold text-terminal-cyan mt-6 mb-3">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          const id = line.slice(4).toLowerCase().replace(/\s+/g, '-')
          return <h3 key={index} id={id} className="text-xl font-bold text-terminal-text mt-4 mb-2">{line.slice(4)}</h3>
        }
        if (line.startsWith('#### ')) {
          return <h4 key={index} className="text-lg font-bold text-terminal-text mt-3 mb-2">{line.slice(5)}</h4>
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 text-terminal-text list-disc">{line.slice(2)}</li>
        }
        if (line.match(/^\d+\. /)) {
          return <li key={index} className="ml-4 text-terminal-text list-decimal">{line.replace(/^\d+\. /, '')}</li>
        }
        
        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**')
          return (
            <p key={index} className="text-terminal-text mb-4">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="text-terminal-cyan">{part}</strong> : part
              )}
            </p>
          )
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return <p key={index} className="text-terminal-text mb-4 leading-relaxed">{line}</p>
        }
        
        return null
      })
      .filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <div className="border-b border-terminal-border bg-terminal-secondary/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-terminal-muted mb-4">
            <Link href="/academy" className="hover:text-terminal-cyan transition-colors">
              Academy
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/academy?category=${article.category}`} className="hover:text-terminal-cyan transition-colors">
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-terminal-text truncate max-w-xs">{article.title}</span>
          </div>

          {/* Article Header */}
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold font-mono text-terminal-cyan mb-3">
              {article.title}
            </h1>
            <p className="text-terminal-muted mb-4">
              {article.description}
            </p>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-terminal-muted" />
                <span className="text-terminal-text">{article.author.name}</span>
                <span className="text-terminal-muted">•</span>
                <span className="text-terminal-muted">{article.author.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-terminal-muted" />
                <span className="text-terminal-muted">{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-terminal-muted" />
                <span className="text-terminal-muted">{article.readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-terminal-muted" />
                <span className="text-terminal-muted">{article.views.toLocaleString()} views</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-mono ${getDifficultyColor(article.difficulty)} border`}>
                {article.difficulty.toUpperCase()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`px-3 py-1 rounded border transition-colors flex items-center gap-2 ${
                  liked 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-terminal-secondary border-terminal-border text-terminal-text hover:border-terminal-cyan'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm font-mono">{article.likes + (liked ? 1 : 0)}</span>
              </button>
              
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`px-3 py-1 rounded border transition-colors flex items-center gap-2 ${
                  bookmarked 
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                    : 'bg-terminal-secondary border-terminal-border text-terminal-text hover:border-terminal-cyan'
                }`}
              >
                <BookmarkPlus className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                <span className="text-sm font-mono">
                  {bookmarked ? 'Saved' : 'Save'}
                </span>
              </button>
              
              <button
                onClick={handleShare}
                className="px-3 py-1 rounded bg-terminal-secondary border border-terminal-border 
                         text-terminal-text hover:border-terminal-cyan transition-colors 
                         flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-mono text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-mono">Share</span>
                  </>
                )}
              </button>
              
              <button className="px-3 py-1 rounded bg-terminal-secondary border border-terminal-border 
                               text-terminal-text hover:border-terminal-cyan transition-colors 
                               flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="text-sm font-mono">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-mono text-terminal-cyan">
                    TABLE OF CONTENTS
                  </h3>
                  <button
                    onClick={() => setShowToc(!showToc)}
                    className="lg:hidden text-terminal-muted hover:text-terminal-cyan transition-colors"
                  >
                    {showToc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                
                {showToc && (
                  <nav className="space-y-1">
                    {article.toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left py-1 transition-colors ${
                          activeTocItem === item.id
                            ? 'text-terminal-cyan font-bold'
                            : 'text-terminal-muted hover:text-terminal-text'
                        }`}
                        style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                      >
                        <span className="text-xs font-mono line-clamp-2">
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </nav>
                )}
              </div>

              {/* Tags */}
              <div className="mt-6">
                <h3 className="text-sm font-mono text-terminal-cyan mb-3">TAGS</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/academy?tag=${tag}`}
                      className="px-2 py-1 rounded text-xs bg-terminal-bg border border-terminal-border 
                               hover:border-terminal-cyan transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="lg:col-span-3">
            <article className="prose prose-invert max-w-none">
              <div className="bg-terminal-secondary rounded-lg p-6 border border-terminal-border">
                {renderContent(article.content)}
              </div>
            </article>

            {/* Article Footer */}
            <div className="mt-8 pt-8 border-t border-terminal-border">
              {/* Author Bio */}
              <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border mb-6">
                <h3 className="text-sm font-mono text-terminal-cyan mb-3">ABOUT THE AUTHOR</h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 
                                flex items-center justify-center text-white font-bold">
                    {article.author.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-mono text-terminal-text mb-1">{article.author.name}</h4>
                    <p className="text-sm text-terminal-muted mb-2">{article.author.role}</p>
                    <p className="text-sm text-terminal-muted">
                      Expert in information warfare and digital security with over 10 years of experience 
                      in the field. Regular contributor to academic journals and security conferences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono text-terminal-cyan flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    COMMENTS ({article.comments})
                  </h3>
                  <button className="px-3 py-1 rounded bg-terminal-bg border border-terminal-border 
                                   text-terminal-cyan font-mono text-sm hover:border-terminal-cyan 
                                   transition-colors">
                    ADD COMMENT
                  </button>
                </div>
                <p className="text-sm text-terminal-muted text-center py-4">
                  Comments are available to verified members only.
                  <Link href="/auth/sign-in" className="text-terminal-cyan hover:underline ml-1">
                    Sign in to join the discussion
                  </Link>
                </p>
              </div>

              {/* Related Articles */}
              <div>
                <h3 className="text-lg font-mono text-terminal-cyan mb-4">RELATED ARTICLES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/academy/art-002"
                    className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border 
                             hover:border-terminal-cyan transition-all"
                  >
                    <h4 className="font-mono text-terminal-text mb-2">
                      Advanced OSINT Techniques for Fact-Checkers
                    </h4>
                    <p className="text-sm text-terminal-muted mb-2 line-clamp-2">
                      Master open-source intelligence gathering methods to verify claims.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-terminal-muted">
                      <span>25 min read</span>
                      <span>•</span>
                      <span>Advanced</span>
                    </div>
                  </Link>
                  
                  <Link
                    href="/academy/art-003"
                    className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border 
                             hover:border-terminal-cyan transition-all"
                  >
                    <h4 className="font-mono text-terminal-text mb-2">
                      Building Counter-Narratives That Work
                    </h4>
                    <p className="text-sm text-terminal-muted mb-2 line-clamp-2">
                      Evidence-based strategies for creating effective counter-narratives.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-terminal-muted">
                      <span>20 min read</span>
                      <span>•</span>
                      <span>Intermediate</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-terminal-border">
                <Link
                  href="/academy"
                  className="flex items-center gap-2 text-terminal-cyan hover:text-cyan-300 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-mono">Back to Academy</span>
                </Link>
                
                <Link
                  href="/academy/art-002"
                  className="flex items-center gap-2 text-terminal-cyan hover:text-cyan-300 transition-colors"
                >
                  <span className="font-mono">Next Article</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
