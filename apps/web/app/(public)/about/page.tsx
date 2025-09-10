import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock, Eye, Users, Heart, Code, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react'
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge'

export const metadata: Metadata = {
  title: 'About Us | Lions of Zion',
  description: 'Learn about our mission, transparency commitment, and how we fight disinformation with truth and integrity.',
}

const values = [
  {
    icon: Shield,
    title: 'Truth Above All',
    description: 'We verify every claim, check every source, and stand by facts even when they challenge our assumptions.'
  },
  {
    icon: Eye,
    title: 'Radical Transparency',
    description: 'Our methods, funding, and decision-making processes are open for public scrutiny. No hidden agendas.'
  },
  {
    icon: Users,
    title: 'Community Powered',
    description: 'Every Lion contributes to our collective defense. Your reports, analysis, and actions make the difference.'
  },
  {
    icon: Heart,
    title: 'Ethical Warfare',
    description: 'We fight lies with truth, not more lies. We expose deception without becoming deceivers ourselves.'
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'We protect your identity while you protect the truth. Minimal data collection, maximum security.'
  },
  {
    icon: Code,
    title: 'Open Source',
    description: 'Our tools and methods are open for inspection, improvement, and adoption by defenders everywhere.'
  }
]

const fundingSources = [
  { name: 'Individual Donations', percentage: 45, amount: '$2.3M' },
  { name: 'Foundation Grants', percentage: 30, amount: '$1.5M' },
  { name: 'Government Contracts', percentage: 15, amount: '$750K' },
  { name: 'Academic Partnerships', percentage: 10, amount: '$500K' }
]

const teamMembers = [
  { role: 'Security Researchers', count: 23 },
  { role: 'Data Scientists', count: 18 },
  { role: 'OSINT Analysts', count: 31 },
  { role: 'Software Engineers', count: 27 },
  { role: 'Content Moderators', count: 45 },
  { role: 'Community Managers', count: 12 }
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <ProvenanceBadge 
            status="verified" 
            source="Lions of Zion"
            timestamp={new Date().toISOString()}
            className="mb-6 inline-block"
          />
          
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-terminal-cyan mb-4">
            DEFENDING TRUTH IN THE DIGITAL AGE
          </h1>
          
          <p className="text-lg text-terminal-muted max-w-3xl mx-auto">
            We are Lions of Zion - a global network of digital defenders fighting disinformation 
            through verification, education, and coordinated response.
          </p>
        </div>

        {/* Mission Statement */}
        <section className="mb-16 p-8 rounded-lg bg-terminal-secondary border border-terminal-border">
          <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">OUR MISSION</h2>
          <p className="text-terminal-text mb-4">
            In an era where lies travel faster than truth, where deepfakes are indistinguishable from reality, 
            and where information warfare threatens democracy itself, we stand as guardians of factual integrity.
          </p>
          <p className="text-terminal-text mb-4">
            Lions of Zion operates at the intersection of technology and truth, using advanced AI detection, 
            crowd-sourced verification, and rapid response teams to identify, analyze, and counter disinformation 
            campaigns in real-time.
          </p>
          <p className="text-terminal-text">
            We don't just fact-check - we prebunk, we educate, we inoculate communities against manipulation, 
            and we hold bad actors accountable. Every verified fact, every exposed lie, every educated citizen 
            is a victory in the war for truth.
          </p>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-8 text-center">
            OUR VALUES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border">
                  <Icon className="w-8 h-8 text-terminal-cyan mb-3" />
                  <h3 className="font-bold font-mono text-terminal-cyan mb-2">{value.title}</h3>
                  <p className="text-sm text-terminal-muted">{value.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Transparency Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-8 text-center">
            FULL TRANSPARENCY
          </h2>
          
          {/* Funding */}
          <div className="mb-8 p-6 rounded-lg bg-terminal-secondary border border-terminal-border">
            <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-4">
              FUNDING SOURCES (2024)
            </h3>
            <div className="space-y-4">
              {fundingSources.map((source) => (
                <div key={source.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-terminal-text font-mono text-sm">{source.name}</span>
                    <span className="text-terminal-cyan font-mono font-bold">{source.amount}</span>
                  </div>
                  <div className="w-full bg-terminal-bg rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-terminal-cyan to-cyan-600 h-3 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-terminal-muted">{source.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-terminal-border">
              <p className="text-xs text-terminal-muted">
                Total Annual Budget: <span className="text-terminal-cyan font-bold">$5M</span> | 
                Full financial reports available at{' '}
                <Link href="/trust/transparency" className="text-cyan-400 hover:underline">
                  /trust/transparency
                </Link>
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border">
            <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-4">
              OUR TEAM
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div key={member.role} className="text-center">
                  <div className="text-2xl font-bold font-mono text-terminal-cyan">{member.count}</div>
                  <div className="text-xs text-terminal-muted">{member.role}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-terminal-border">
              <p className="text-xs text-terminal-muted text-center">
                Plus <span className="text-terminal-cyan font-bold">12,847</span> volunteer Lions worldwide
              </p>
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="mb-16 p-8 rounded-lg bg-terminal-secondary border border-terminal-border">
          <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
            DATA HANDLING & PRIVACY
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-terminal-text mb-1">Minimal Data Collection</h4>
                <p className="text-sm text-terminal-muted">
                  We collect only what's necessary for security and functionality. No tracking pixels, 
                  no behavioral analytics, no selling data.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-terminal-text mb-1">End-to-End Encryption</h4>
                <p className="text-sm text-terminal-muted">
                  All sensitive communications and reports are encrypted. Your identity is protected 
                  even from us when you choose anonymous reporting.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-terminal-text mb-1">Data Retention Limits</h4>
                <p className="text-sm text-terminal-muted">
                  Personal data deleted after 90 days of inactivity. Analysis data anonymized after 30 days. 
                  Full deletion available on request.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-terminal-text mb-1">Open Source Security</h4>
                <p className="text-sm text-terminal-muted">
                  Our security measures are open for audit. Find vulnerabilities, get rewards. 
                  Transparency makes us stronger.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-terminal-border">
            <Link 
              href="/legal/privacy"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
            >
              Read Full Privacy Policy
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Provenance Policy */}
        <section className="mb-16 p-8 rounded-lg bg-gradient-to-br from-cyan-500/10 to-terminal-secondary border border-cyan-500/30">
          <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
            CONTENT PROVENANCE & VERIFICATION
          </h2>
          
          <p className="text-terminal-text mb-4">
            Every piece of content we produce or verify carries a cryptographic signature following 
            C2PA (Coalition for Content Provenance and Authenticity) standards. This ensures you can 
            always verify the authenticity and trace the origin of information.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded bg-terminal-bg/50">
              <div className="text-2xl font-bold font-mono text-terminal-cyan mb-1">100%</div>
              <div className="text-xs text-terminal-muted">Content Signed</div>
            </div>
            <div className="p-4 rounded bg-terminal-bg/50">
              <div className="text-2xl font-bold font-mono text-terminal-cyan mb-1">C2PA</div>
              <div className="text-xs text-terminal-muted">Standard Compliant</div>
            </div>
            <div className="p-4 rounded bg-terminal-bg/50">
              <div className="text-2xl font-bold font-mono text-terminal-cyan mb-1">24/7</div>
              <div className="text-xs text-terminal-muted">Verification Available</div>
            </div>
          </div>
          
          <Link 
            href="/trust/provenance"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
          >
            Learn About Our Provenance System
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="p-8 rounded-lg bg-gradient-to-br from-terminal-secondary to-terminal-bg border border-terminal-border">
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              JOIN THE FIGHT FOR TRUTH
            </h2>
            <p className="text-terminal-muted mb-6 max-w-2xl mx-auto">
              Every day, millions are deceived by sophisticated disinformation. You can make a difference. 
              Join our global network of truth defenders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/join"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
                         bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400 
                         font-mono font-bold hover:bg-cyan-500/30 transition-all duration-200"
              >
                BECOME A LION
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
                         bg-terminal-secondary border-2 border-terminal-border text-terminal-text 
                         font-mono font-bold hover:border-terminal-cyan transition-all duration-200"
              >
                GET IN TOUCH
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
