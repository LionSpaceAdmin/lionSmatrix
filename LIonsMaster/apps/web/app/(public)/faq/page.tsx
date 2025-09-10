'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { ChevronDown, Search, Shield, AlertTriangle, Users, Zap, Lock, Globe, HelpCircle } from 'lucide-react'

// FAQ data organized by categories
const faqCategories = [
  {
    id: 'general',
    title: 'General Questions',
    icon: HelpCircle,
    questions: [
      {
        id: 'what-is-lions',
        question: 'What is Lions of Zion?',
        answer: 'Lions of Zion is a global network of digital defenders fighting disinformation through verification, education, and coordinated response. We use advanced AI detection, crowd-sourced verification, and rapid response teams to identify and counter false narratives in real-time.'
      },
      {
        id: 'how-it-works',
        question: 'How does the platform work?',
        answer: 'Our platform combines AI-powered detection with human verification. When potential disinformation is detected, it goes through our analysis pipeline where both automated systems and expert analysts verify claims, check sources, and assess threat levels. Verified threats are then shared with our community for rapid response.'
      },
      {
        id: 'who-can-join',
        question: 'Who can join Lions of Zion?',
        answer: 'Anyone committed to fighting disinformation can join. We welcome journalists, researchers, educators, students, and concerned citizens. No special expertise required - we provide training and tools. All we ask is commitment to truth and ethical standards.'
      },
      {
        id: 'is-it-free',
        question: 'Is it free to use?',
        answer: 'Yes! Basic membership is completely free and includes access to our threat feeds, fact-checking tools, and community features. We also offer premium features for organizations and advanced users who need additional capabilities.'
      }
    ]
  },
  {
    id: 'threats',
    title: 'Threats & Detection',
    icon: AlertTriangle,
    questions: [
      {
        id: 'threat-levels',
        question: 'What do the different threat levels mean?',
        answer: 'We use four threat levels: CRITICAL (immediate danger, widespread impact), HIGH (significant threat, rapid spread), MEDIUM (moderate threat, localized impact), and LOW (minimal threat, limited spread). Each level triggers different response protocols.'
      },
      {
        id: 'detection-methods',
        question: 'How do you detect disinformation?',
        answer: 'We use multiple detection methods: AI pattern recognition for bot networks and coordinated campaigns, content analysis for deepfakes and manipulated media, source verification through blockchain provenance, crowd-sourced reports from our community, and partnerships with fact-checking organizations worldwide.'
      },
      {
        id: 'false-positives',
        question: 'What about false positives?',
        answer: 'Our multi-layer verification system minimizes false positives. Every detection goes through both automated and human review. We maintain a 98.3% accuracy rate and have an appeals process for contested determinations. Transparency is key - all our analysis is open for review.'
      },
      {
        id: 'response-time',
        question: 'How quickly can you respond to new threats?',
        answer: 'Critical threats are analyzed within minutes and alerts sent within an hour. Our AI systems work 24/7 for instant detection, while human analysts verify within 2-6 hours depending on complexity. The community response typically mobilizes within hours of verification.'
      }
    ]
  },
  {
    id: 'verification',
    title: 'Verification & Fact-Checking',
    icon: Shield,
    questions: [
      {
        id: 'verification-process',
        question: 'How does your verification process work?',
        answer: 'Our verification follows a strict protocol: 1) Source identification and credibility assessment, 2) Cross-reference with multiple independent sources, 3) Expert consultation when needed, 4) Evidence documentation with full chain of custody, 5) Confidence scoring based on evidence quality, 6) Peer review by community experts.'
      },
      {
        id: 'c2pa-standard',
        question: 'What is C2PA and why does it matter?',
        answer: 'C2PA (Coalition for Content Provenance and Authenticity) is a technical standard for proving content authenticity. It creates a tamper-evident record of who created content and how it was modified. We use C2PA to sign all our verified content and can detect when content lacks proper provenance.'
      },
      {
        id: 'can-i-factcheck',
        question: 'Can I submit content for fact-checking?',
        answer: 'Absolutely! Any registered user can submit content for verification through our Report/Research tool. Include the suspicious content, where you found it, and why you believe it may be false. Our team will analyze it and publish results, typically within 24-48 hours.'
      },
      {
        id: 'evidence-standards',
        question: 'What evidence standards do you require?',
        answer: 'We follow journalistic standards for evidence: multiple independent sources for claims, primary sources preferred over secondary, official records and documents when available, expert testimony with credentials verified, and mathematical/scientific proof where applicable. All evidence must be documented and preserved.'
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Lock,
    questions: [
      {
        id: 'data-collection',
        question: 'What data do you collect?',
        answer: 'We collect minimal data: email for account creation (can be anonymous), basic usage statistics for improving the platform, voluntary profile information you choose to share, and reports/content you submit for analysis. We never collect browsing history, sell data, or use tracking pixels.'
      },
      {
        id: 'anonymity',
        question: 'Can I remain anonymous?',
        answer: 'Yes! We support anonymous reporting and participation. You can use a pseudonym, anonymous email services, and even access via Tor. For sensitive reports, we offer SecureDrop integration. Your safety is our priority.'
      },
      {
        id: 'data-security',
        question: 'How is my data protected?',
        answer: 'We use industry-standard security: end-to-end encryption for sensitive communications, secure servers with regular security audits, minimal data retention (90 days for personal data), option for complete data deletion, and open-source code for transparency.'
      },
      {
        id: 'government-requests',
        question: 'How do you handle government data requests?',
        answer: 'We evaluate each request carefully and only comply with legally valid orders. We notify users unless legally prohibited, publish transparency reports quarterly, challenge overbroad requests in court, and maintain a warrant canary. We collect minimal data specifically to limit what can be requested.'
      }
    ]
  },
  {
    id: 'community',
    title: 'Community & Participation',
    icon: Users,
    questions: [
      {
        id: 'how-to-help',
        question: 'How can I help fight disinformation?',
        answer: 'There are many ways to contribute: Report suspicious content you encounter, help verify claims in your area of expertise, share verified information with your network, translate content for your language community, contribute to our open-source tools, or donate to support our operations.'
      },
      {
        id: 'training',
        question: 'Do you provide training?',
        answer: 'Yes! We offer free training through our Academy: Basic digital literacy and critical thinking, advanced OSINT techniques, deepfake detection methods, source verification protocols, and specialized tracks for journalists, educators, and researchers. All materials are free and self-paced.'
      },
      {
        id: 'community-guidelines',
        question: 'What are your community guidelines?',
        answer: 'Our community operates on core principles: Truth above all - even uncomfortable truths, respectful disagreement and constructive debate, no spreading of unverified information, protect sources and vulnerable individuals, collaborate rather than compete, and maintain operational security.'
      },
      {
        id: 'volunteer',
        question: 'Can I volunteer?',
        answer: 'We welcome volunteers! Current needs include: content moderation and verification, translation and localization, software development and design, research and analysis, community outreach and education. Apply through our volunteer portal with your skills and availability.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Questions',
    icon: Zap,
    questions: [
      {
        id: 'api-access',
        question: 'Do you offer API access?',
        answer: 'Yes! Our API provides programmatic access to threat feeds, verification results, and analysis tools. Free tier includes 1000 requests/day. Documentation and SDKs available for Python, JavaScript, and Go. Premium tiers available for high-volume users.'
      },
      {
        id: 'open-source',
        question: 'Is your code open source?',
        answer: 'Most of our codebase is open source on GitHub. This includes detection algorithms, verification tools, and client applications. Some components remain closed for security (anti-evasion techniques) but are available for audit by qualified researchers.'
      },
      {
        id: 'browser-extension',
        question: 'Do you have a browser extension?',
        answer: 'Yes! Our browser extension provides real-time alerts while browsing, inline fact-checking on social media, deepfake detection for images/videos, and one-click reporting of suspicious content. Available for Chrome, Firefox, Safari, and Edge.'
      },
      {
        id: 'mobile-apps',
        question: 'Are there mobile apps available?',
        answer: 'Mobile apps are available for iOS and Android, featuring push notifications for critical threats, offline access to verification guides, camera integration for image verification, and secure reporting with location obscuration. Download from official app stores only.'
      }
    ]
  },
  {
    id: 'global',
    title: 'Global Operations',
    icon: Globe,
    questions: [
      {
        id: 'languages',
        question: 'What languages do you support?',
        answer: 'Currently we support English, Hebrew, Spanish, French, German, and Arabic with full RTL support. Content analysis works for 50+ languages. Community volunteers help translate critical alerts. We\'re constantly expanding language support based on threat activity.'
      },
      {
        id: 'regional-operations',
        question: 'Do you operate globally?',
        answer: 'Yes! We have active operations on every continent. Regional teams provide local expertise while our global network enables rapid information sharing. We respect local laws while maintaining our commitment to truth and transparency.'
      },
      {
        id: 'partnerships',
        question: 'Who do you partner with?',
        answer: 'We collaborate with fact-checking organizations worldwide, academic institutions and researchers, ethical hackers and security researchers, human rights organizations, and independent journalists. We maintain independence while leveraging collective expertise.'
      },
      {
        id: 'local-threats',
        question: 'How do you handle region-specific threats?',
        answer: 'Local experts lead regional threat analysis. We maintain cultural sensitivity while applying universal verification standards. Regional teams have autonomy to respond quickly while global coordination prevents isolation of threats.'
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['general']))

  // Filter questions based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      searchQuery === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const toggleQuestion = (questionId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  // Handle deep linking to specific questions via hash
  const handleHashLink = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const questionId = window.location.hash.substring(1)
      const category = faqCategories.find(cat => 
        cat.questions.some(q => q.id === questionId)
      )
      if (category) {
        setExpandedCategories(new Set([category.id]))
        setExpandedItems(new Set([questionId]))
        setTimeout(() => {
          document.getElementById(questionId)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }

  // Run on mount
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState(() => {
      handleHashLink()
    })
  }

  const totalQuestions = faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0)
  const matchingQuestions = filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0)

  return (
    <main className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono text-terminal-cyan mb-2">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-terminal-muted">
            Everything you need to know about fighting disinformation with Lions of Zion
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-terminal-secondary border border-terminal-border rounded-lg 
                       text-terminal-text font-mono placeholder-terminal-muted
                       focus:border-terminal-cyan focus:outline-none transition-colors"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-terminal-muted font-mono">
              Found {matchingQuestions} of {totalQuestions} questions
            </div>
          )}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon
            const isExpanded = expandedCategories.has(category.id)
            
            return (
              <div 
                key={category.id}
                className="rounded-lg bg-terminal-secondary border border-terminal-border overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between 
                           hover:bg-terminal-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-terminal-cyan" />
                    <h2 className="text-lg font-bold font-mono text-terminal-cyan">
                      {category.title}
                    </h2>
                    <span className="text-xs text-terminal-muted font-mono">
                      ({category.questions.length})
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-terminal-muted transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Questions */}
                {isExpanded && (
                  <div className="border-t border-terminal-border">
                    {category.questions.map((item, index) => {
                      const isQuestionExpanded = expandedItems.has(item.id)
                      
                      return (
                        <div
                          key={item.id}
                          id={item.id}
                          className={`${
                            index !== category.questions.length - 1 ? 'border-b border-terminal-border' : ''
                          }`}
                        >
                          <button
                            onClick={() => toggleQuestion(item.id)}
                            className="w-full px-6 py-4 text-left hover:bg-terminal-bg/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-semibold text-terminal-text">
                                {item.question}
                              </h3>
                              <ChevronDown 
                                className={`w-5 h-5 text-terminal-muted flex-shrink-0 transition-transform ${
                                  isQuestionExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>
                          
                          {isQuestionExpanded && (
                            <div className="px-6 pb-4">
                              <p className="text-terminal-muted leading-relaxed">
                                {item.answer}
                              </p>
                              
                              {/* Share Link */}
                              <button
                                onClick={() => {
                                  const url = `${window.location.origin}${window.location.pathname}#${item.id}`
                                  navigator.clipboard.writeText(url)
                                }}
                                className="mt-3 text-xs text-terminal-cyan hover:text-cyan-400 font-mono transition-colors"
                              >
                                Copy link to this answer
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-terminal-muted mx-auto mb-4 opacity-50" />
            <p className="text-terminal-muted font-mono">
              No questions found matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded bg-terminal-secondary border border-terminal-border 
                       text-terminal-text font-mono hover:border-terminal-cyan transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 p-6 rounded-lg bg-gradient-to-br from-terminal-secondary to-terminal-bg border border-terminal-border text-center">
          <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-2">
            Still have questions?
          </h3>
          <p className="text-terminal-muted mb-4">
            Our community is here to help. Reach out through any of our channels.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-cyan-500/20 
                     border border-cyan-500/50 text-cyan-400 font-mono
                     hover:bg-cyan-500/30 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  )
}
