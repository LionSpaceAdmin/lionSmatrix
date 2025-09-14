import Link from 'next/link'
import {
  Shield, Lock, Eye, Download, UserX, FileText,
  AlertCircle, CheckCircle, ArrowRight, Info,
  Clock, Server, Key, Database, Users, Globe
} from 'lucide-react'

interface TransparencyCard {
  title: string
  description: string
  icon: any
  href: string
  action: string
  status: 'available' | 'coming-soon' | 'restricted'
  gradient: string
}

const transparencyCards: TransparencyCard[] = [
  {
    title: 'Provenance & Verification',
    description: 'Learn how we verify content authenticity using C2PA standards and blockchain technology.',
    icon: Shield,
    href: '/trust/provenance',
    action: 'View Policy',
    status: 'available',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Data Export',
    description: 'Download all your personal data we store in machine-readable format (JSON/CSV).',
    icon: Download,
    href: '/trust/dsr#export',
    action: 'Request Export',
    status: 'available',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Data Deletion',
    description: 'Request permanent deletion of your account and all associated personal data.',
    icon: UserX,
    href: '/trust/dsr#delete',
    action: 'Request Deletion',
    status: 'available',
    gradient: 'from-red-500 to-orange-500'
  },
  {
    title: 'Transparency Reports',
    description: 'Quarterly reports on data requests, content moderation, and platform statistics.',
    icon: FileText,
    href: '/trust/reports',
    action: 'View Reports',
    status: 'coming-soon',
    gradient: 'from-purple-500 to-pink-500'
  }
]

const dataCategories = [
  {
    category: 'Account Information',
    description: 'Basic profile data and preferences',
    retention: '3 years after account closure',
    purpose: 'Service provision and personalization',
    icon: Users
  },
  {
    category: 'Activity Data',
    description: 'Your interactions with tools and content',
    retention: '2 years rolling window',
    purpose: 'Analytics and improvement',
    icon: Clock
  },
  {
    category: 'Generated Content',
    description: 'Reports, fact-checks, and campaigns you create',
    retention: 'Until you delete or account closure + 30 days',
    purpose: 'Service functionality',
    icon: FileText
  },
  {
    category: 'Security Logs',
    description: 'Login attempts and security events',
    retention: '6 months',
    purpose: 'Security and fraud prevention',
    icon: Lock
  }
]

const principles = [
  {
    title: 'Minimal Collection',
    description: 'We only collect data necessary for service operation.',
    icon: Database
  },
  {
    title: 'Purpose Limitation',
    description: 'Data is used only for stated purposes.',
    icon: Key
  },
  {
    title: 'User Control',
    description: 'You can access, export, and delete your data.',
    icon: Users
  },
  {
    title: 'Security First',
    description: 'End-to-end encryption and secure storage.',
    icon: Lock
  },
  {
    title: 'No Third-Party Sales',
    description: 'We never sell your personal data.',
    icon: Shield
  },
  {
    title: 'Open Verification',
    description: 'Our practices are independently audited.',
    icon: Eye
  }
]

export default function TransparencyPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-terminal-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 
                            border border-cyan-500/30">
                <Eye className="w-12 h-12 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold font-mono text-terminal-cyan mb-4">
              TRANSPARENCY HUB
            </h1>
            <p className="text-xl text-terminal-text mb-2">
              Your data. Your control. Our commitment.
            </p>
            <p className="text-terminal-muted max-w-2xl mx-auto">
              We believe in radical transparency. Every aspect of how we handle your data 
              is documented, auditable, and under your control.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-8">
          DATA CONTROL CENTER
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transparencyCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 
                              group-hover:opacity-10 rounded-lg transition-opacity`} />
                <div className="relative p-6 rounded-lg bg-terminal-secondary border border-terminal-border 
                             group-hover:border-terminal-cyan transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${card.gradient} bg-opacity-10`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {card.status === 'coming-soon' && (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 
                                     border border-yellow-500/30">
                        SOON
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-mono text-terminal-text mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-terminal-muted mb-4">
                    {card.description}
                  </p>
                  
                  {card.status === 'available' ? (
                    <Link
                      href={card.href}
                      className="flex items-center gap-2 text-terminal-cyan hover:text-cyan-300 
                               transition-colors font-mono text-sm"
                    >
                      {card.action}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2 text-terminal-muted font-mono text-sm">
                      {card.action}
                      <Clock className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Data Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-terminal-border">
        <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-8">
          WHAT DATA WE COLLECT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataCategories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.category}
                className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded bg-cyan-500/10">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-mono text-terminal-text mb-2">
                      {category.category}
                    </h3>
                    <p className="text-sm text-terminal-muted mb-3">
                      {category.description}
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-terminal-muted" />
                        <span className="text-terminal-muted">Retention:</span>
                        <span className="text-terminal-text">{category.retention}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="w-3 h-3 text-terminal-muted" />
                        <span className="text-terminal-muted">Purpose:</span>
                        <span className="text-terminal-text">{category.purpose}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Privacy Principles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-terminal-border">
        <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-8">
          OUR PRIVACY PRINCIPLES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle) => {
            const Icon = principle.icon
            return (
              <div
                key={principle.title}
                className="flex items-start gap-4 p-4 rounded-lg bg-terminal-secondary/50"
              >
                <div className="p-2 rounded bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-mono text-terminal-text mb-1">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-terminal-muted">
                    {principle.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Verification Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-terminal-border">
        <div className="p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-terminal-secondary 
                      border border-green-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-mono text-terminal-text mb-2">
                INDEPENDENTLY VERIFIED
              </h3>
              <p className="text-terminal-muted mb-4">
                Our transparency practices have been independently audited and verified by:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded bg-terminal-bg border border-terminal-border">
                  <p className="text-sm font-mono text-terminal-cyan mb-1">EFF Privacy Badge</p>
                  <p className="text-xs text-terminal-muted">Electronic Frontier Foundation</p>
                </div>
                <div className="p-3 rounded bg-terminal-bg border border-terminal-border">
                  <p className="text-sm font-mono text-terminal-cyan mb-1">ISO 27001</p>
                  <p className="text-xs text-terminal-muted">Information Security Management</p>
                </div>
                <div className="p-3 rounded bg-terminal-bg border border-terminal-border">
                  <p className="text-sm font-mono text-terminal-cyan mb-1">GDPR Compliant</p>
                  <p className="text-xs text-terminal-muted">European Data Protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Resources */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-terminal-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-mono text-terminal-cyan mb-4">
              PRIVACY RESOURCES
            </h3>
            <div className="space-y-3">
              <Link
                href="/legal/privacy"
                className="flex items-center gap-3 p-3 rounded bg-terminal-secondary border border-terminal-border 
                       hover:border-terminal-cyan transition-colors"
              >
                <FileText className="w-5 h-5 text-terminal-muted" />
                <div>
                  <p className="text-sm font-mono text-terminal-text">Privacy Policy</p>
                  <p className="text-xs text-terminal-muted">Full legal privacy documentation</p>
                </div>
                <ArrowRight className="w-4 h-4 text-terminal-muted ml-auto" />
              </Link>
              
              <Link
                href="/legal/terms"
                className="flex items-center gap-3 p-3 rounded bg-terminal-secondary border border-terminal-border 
                       hover:border-terminal-cyan transition-colors"
              >
                <FileText className="w-5 h-5 text-terminal-muted" />
                <div>
                  <p className="text-sm font-mono text-terminal-text">Terms of Service</p>
                  <p className="text-xs text-terminal-muted">Service terms and conditions</p>
                </div>
                <ArrowRight className="w-4 h-4 text-terminal-muted ml-auto" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-mono text-terminal-cyan mb-4">
              DATA PROTECTION OFFICER
            </h3>
            <div className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
              <p className="text-sm text-terminal-muted mb-3">
                For privacy concerns or data protection inquiries:
              </p>
              <div className="space-y-2">
                <p className="text-sm font-mono text-terminal-text">
                  privacy@lionszion.org
                </p>
                <p className="text-sm font-mono text-terminal-text">
                  DPO Response Time: 24-48 hours
                </p>
                <p className="text-xs text-terminal-muted mt-3">
                  All inquiries are encrypted and handled with strict confidentiality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="border-t border-terminal-border bg-terminal-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <p className="text-sm text-terminal-muted">
              This transparency hub is updated quarterly. Last update: September 2025. 
              <Link href="/trust/changelog" className="text-terminal-cyan hover:underline ml-1">
                View changelog
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
