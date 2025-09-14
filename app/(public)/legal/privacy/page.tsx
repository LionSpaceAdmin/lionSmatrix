import type { Metadata } from 'next'
import { Shield, Lock, Eye, Database, Globe, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Lions of Zion',
  description: 'Our commitment to protecting your privacy while fighting disinformation.',
}

export default function PrivacyPage() {
  const lastUpdated = new Date('2024-01-15').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <main className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-cyan-500/10 mb-4">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold font-mono text-terminal-cyan mb-2">
            PRIVACY POLICY
          </h1>
          <p className="text-terminal-muted">
            Your privacy is fundamental to our mission
          </p>
          <p className="text-sm text-terminal-muted mt-2">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Quick Summary */}
        <section className="mb-8 p-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <h2 className="text-xl font-bold font-mono text-cyan-400 mb-4">
            PRIVACY AT A GLANCE
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">We collect minimal data - only what's necessary</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">We never sell or share your personal information</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">You can remain anonymous and use pseudonyms</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">All data is encrypted and secured</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">You can request deletion at any time</span>
            </li>
          </ul>
        </section>

        {/* Main Content */}
        <div className="space-y-8 text-terminal-text">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              1. INTRODUCTION
            </h2>
            <p className="mb-4">
              Lions of Zion ("we," "our," or "us") is committed to protecting your privacy while you 
              help us fight disinformation. This Privacy Policy explains how we collect, use, share, 
              and protect your information when you use our platform.
            </p>
            <p>
              We believe privacy is a fundamental right. Our platform is designed to give you maximum 
              protection while enabling effective collaboration against information warfare.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              2. INFORMATION WE COLLECT
            </h2>
            
            <h3 className="text-lg font-semibold text-terminal-cyan mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 mb-4 text-terminal-muted">
              <li>Account information (email, username - can be pseudonymous)</li>
              <li>Profile information (optional: bio, expertise areas, language preferences)</li>
              <li>Content you submit (reports, fact-checks, evidence)</li>
              <li>Communications (support requests, feedback)</li>
            </ul>

            <h3 className="text-lg font-semibold text-terminal-cyan mb-2">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 mb-4 text-terminal-muted">
              <li>Log data (IP address - can be masked via Tor, access times)</li>
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (features used, actions taken)</li>
              <li>Cookies (session management, preferences)</li>
            </ul>

            <h3 className="text-lg font-semibold text-terminal-cyan mb-2">2.3 Information We DON'T Collect</h3>
            <ul className="list-disc list-inside space-y-2 text-terminal-muted">
              <li>Browsing history outside our platform</li>
              <li>Personal files or contacts</li>
              <li>Location data (unless explicitly shared for threat reporting)</li>
              <li>Biometric data</li>
              <li>Financial information (we don't process payments)</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              3. HOW WE USE YOUR INFORMATION
            </h2>
            <ul className="list-disc list-inside space-y-2 text-terminal-muted">
              <li>Provide and improve our disinformation detection services</li>
              <li>Send critical threat alerts and platform updates</li>
              <li>Verify content and prevent abuse</li>
              <li>Analyze patterns to identify coordinated disinformation campaigns</li>
              <li>Protect our community from bad actors</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              5. DATA SECURITY
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-terminal-secondary border border-terminal-border">
                <Shield className="w-6 h-6 text-terminal-cyan mb-2" />
                <h4 className="font-semibold text-terminal-cyan mb-1">Encryption</h4>
                <p className="text-sm text-terminal-muted">
                  End-to-end encryption for sensitive data, TLS for all connections
                </p>
              </div>
              <div className="p-4 rounded bg-terminal-secondary border border-terminal-border">
                <Lock className="w-6 h-6 text-terminal-cyan mb-2" />
                <h4 className="font-semibold text-terminal-cyan mb-1">Access Control</h4>
                <p className="text-sm text-terminal-muted">
                  Strict access controls, regular security audits
                </p>
              </div>
              <div className="p-4 rounded bg-terminal-secondary border border-terminal-border">
                <Database className="w-6 h-6 text-terminal-cyan mb-2" />
                <h4 className="font-semibold text-terminal-cyan mb-1">Data Minimization</h4>
                <p className="text-sm text-terminal-muted">
                  We only collect what we need, delete what we don't
                </p>
              </div>
              <div className="p-4 rounded bg-terminal-secondary border border-terminal-border">
                <Eye className="w-6 h-6 text-terminal-cyan mb-2" />
                <h4 className="font-semibold text-terminal-cyan mb-1">Transparency</h4>
                <p className="text-sm text-terminal-muted">
                  Open source code, public security audits
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              12. CONTACT US
            </h2>
            <div className="p-6 rounded bg-terminal-secondary border border-terminal-border">
              <p className="mb-4">For privacy concerns or questions:</p>
              <div className="space-y-2 text-terminal-muted">
                <p>Email: <a href="mailto:privacy@lionsofzion.io" className="text-cyan-400 hover:underline">privacy@lionsofzion.io</a></p>
                <p>Secure: lions7zion.onion/privacy</p>
                <p>Mail: Privacy Officer, Lions of Zion, Tel Aviv, Israel</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
