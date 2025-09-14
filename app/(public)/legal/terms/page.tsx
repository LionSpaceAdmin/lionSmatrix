import type { Metadata } from 'next'
import { FileText, Shield, AlertTriangle, CheckCircle, Ban, Users, Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Lions of Zion',
  description: 'Terms and conditions for using the Lions of Zion platform.',
}

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold font-mono text-terminal-cyan mb-2">
            TERMS OF SERVICE
          </h1>
          <p className="text-terminal-muted">
            Rules of engagement for digital defenders
          </p>
          <p className="text-sm text-terminal-muted mt-2">
            Last updated: {lastUpdated} • Version 2.1
          </p>
        </div>

        {/* Agreement Summary */}
        <section className="mb-8 p-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <h2 className="text-xl font-bold font-mono text-cyan-400 mb-4">
            THE CORE AGREEMENT
          </h2>
          <p className="text-terminal-text mb-4">
            By using Lions of Zion, you join a community dedicated to fighting disinformation 
            with truth, not lies. You agree to:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">Verify before you share</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">Fight lies with facts, not more lies</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">Protect vulnerable communities</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">Respect privacy and security</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-terminal-text">Use the platform ethically</span>
            </li>
          </ul>
        </section>

        {/* Main Terms */}
        <div className="space-y-8 text-terminal-text">
          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              1. ACCEPTANCE OF TERMS
            </h2>
            <p className="mb-4">
              By accessing or using Lions of Zion ("Platform"), you agree to be bound by these 
              Terms of Service ("Terms"). If you disagree with any part of these terms, you may 
              not access the Platform.
            </p>
            <p>
              These Terms apply to all users, including contributors, volunteers, and organizations. 
              Additional terms may apply to specific services or features.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              2. ELIGIBILITY
            </h2>
            <p className="mb-4">To use the Platform, you must:</p>
            <ul className="list-disc list-inside space-y-2 text-terminal-muted">
              <li>Be at least 16 years old</li>
              <li>Have the legal capacity to enter into binding agreements</li>
              <li>Not be prohibited from using the service under applicable laws</li>
              <li>Not have been previously banned from the Platform</li>
              <li>Commit to ethical use of our tools and information</li>
            </ul>
          </section>

          {/* Account Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              3. ACCOUNT RESPONSIBILITIES
            </h2>
            <p className="mb-4">You are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 text-terminal-muted">
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Immediately notifying us of any unauthorized use</li>
              <li>Ensuring your contact information is current</li>
              <li>Compliance with all applicable laws in your jurisdiction</li>
            </ul>
            <div className="mt-4 p-4 rounded bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-terminal-muted">
                  You may use pseudonyms for privacy, but providing false information to mislead 
                  or deceive is prohibited.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              4. ACCEPTABLE USE POLICY
            </h2>
            
            <h3 className="text-lg font-semibold text-terminal-cyan mb-2">You MUST:</h3>
            <ul className="list-disc list-inside space-y-2 text-terminal-muted mb-4">
              <li>Use the Platform in good faith to combat disinformation</li>
              <li>Verify information before sharing or acting on it</li>
              <li>Respect intellectual property rights</li>
              <li>Protect the privacy of others</li>
              <li>Report security vulnerabilities responsibly</li>
              <li>Collaborate constructively with the community</li>
            </ul>

            <h3 className="text-lg font-semibold text-terminal-cyan mb-2">You MUST NOT:</h3>
            <ul className="list-disc list-inside space-y-2 text-terminal-muted">
              <li>Create or spread disinformation</li>
              <li>Use the Platform to harass, threaten, or harm others</li>
              <li>Attempt to compromise Platform security</li>
              <li>Scrape data for commercial purposes</li>
              <li>Impersonate others or misrepresent affiliations</li>
              <li>Use automated systems to abuse the Platform</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Content Standards */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              5. CONTENT STANDARDS
            </h2>
            <p className="mb-4">All content you submit must:</p>
            <ul className="list-disc list-inside space-y-2 text-terminal-muted">
              <li>Be accurate to the best of your knowledge</li>
              <li>Include sources and evidence where applicable</li>
              <li>Respect copyright and fair use principles</li>
              <li>Not contain malware or harmful code</li>
              <li>Not violate anyone's privacy or safety</li>
              <li>Be relevant to fighting disinformation</li>
            </ul>
            
            <div className="mt-4 p-4 rounded bg-terminal-secondary border border-terminal-border">
              <h4 className="font-semibold text-terminal-cyan mb-2">Content Moderation</h4>
              <p className="text-sm text-terminal-muted">
                We reserve the right to remove content that violates these standards. Repeated 
                violations may result in account suspension or termination.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              6. INTELLECTUAL PROPERTY
            </h2>
            
            <h3 className="text-lg font-semibold text-terminal-cyan mb-2">Your Content</h3>
            <p className="mb-4 text-terminal-muted">
              You retain ownership of content you create. By posting it on the Platform, you grant us 
              a non-exclusive, worldwide, royalty-free license to use, display, and distribute it for 
              the purpose of operating the Platform and fighting disinformation.
            </p>

            <h3 className="text-lg font-semibold text-terminal-cyan mb-2">Platform Content</h3>
            <p className="text-terminal-muted">
              The Platform's software, design, and original content are protected by intellectual 
              property laws. Much of our code is open source under specific licenses - check our 
              GitHub for details.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              7. DISCLAIMER OF WARRANTIES
            </h2>
            <div className="p-4 rounded bg-red-500/10 border border-red-500/30">
              <p className="text-terminal-text font-semibold mb-2">
                THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND
              </p>
              <p className="text-sm text-terminal-muted">
                We strive for accuracy but cannot guarantee that all information is correct. 
                Always verify critical information through multiple sources. We are not liable 
                for decisions made based on Platform content.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              8. LIMITATION OF LIABILITY
            </h2>
            <p className="text-terminal-muted">
              To the maximum extent permitted by law, Lions of Zion shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages resulting from your 
              use or inability to use the Platform.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              9. INDEMNIFICATION
            </h2>
            <p className="text-terminal-muted">
              You agree to indemnify and hold harmless Lions of Zion from any claims, damages, or 
              expenses arising from your violation of these Terms or your use of the Platform.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              10. TERMINATION
            </h2>
            <p className="mb-4">We may terminate or suspend your account if you:</p>
            <ul className="list-disc list-inside space-y-2 text-terminal-muted">
              <li>Violate these Terms</li>
              <li>Engage in harmful behavior</li>
              <li>Create or spread disinformation</li>
              <li>Compromise Platform security</li>
              <li>Upon your request</li>
            </ul>
            <p className="mt-4 text-terminal-muted">
              You may delete your account at any time. Upon termination, your right to use the 
              Platform ceases immediately.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              11. GOVERNING LAW
            </h2>
            <p className="text-terminal-muted">
              These Terms are governed by the laws of Israel, without regard to conflict of law 
              principles. Any disputes shall be resolved through binding arbitration in Tel Aviv, 
              Israel, unless prohibited by your local laws.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              12. CHANGES TO TERMS
            </h2>
            <p className="text-terminal-muted">
              We may modify these Terms at any time. Material changes will be notified via email 
              and Platform announcement at least 30 days before taking effect. Continued use after 
              changes constitutes acceptance.
            </p>
          </section>

          {/* Special Provisions */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              13. SPECIAL PROVISIONS
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded bg-terminal-secondary border border-terminal-border">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-terminal-cyan flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-terminal-cyan mb-1">Whistleblower Protection</h4>
                    <p className="text-sm text-terminal-muted">
                      We will never knowingly expose whistleblowers or sources. Special protections 
                      apply to those reporting sensitive information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded bg-terminal-secondary border border-terminal-border">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-terminal-cyan flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-terminal-cyan mb-1">Community Standards</h4>
                    <p className="text-sm text-terminal-muted">
                      Beyond legal requirements, we expect ethical behavior. The community may establish 
                      additional guidelines through democratic processes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded bg-terminal-secondary border border-terminal-border">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-terminal-cyan flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-terminal-cyan mb-1">Dispute Resolution</h4>
                    <p className="text-sm text-terminal-muted">
                      We prefer to resolve disputes through dialogue. Contact us before pursuing legal 
                      action - most issues can be resolved amicably.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              14. CONTACT INFORMATION
            </h2>
            <div className="p-6 rounded bg-terminal-secondary border border-terminal-border">
              <p className="mb-4">For questions about these Terms:</p>
              <div className="space-y-2 text-terminal-muted">
                <p>Email: <a href="mailto:legal@lionsofzion.io" className="text-cyan-400 hover:underline">legal@lionsofzion.io</a></p>
                <p>Address: Legal Department, Lions of Zion, Tel Aviv, Israel</p>
              </div>
            </div>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4">
              15. SEVERABILITY
            </h2>
            <p className="text-terminal-muted">
              If any provision of these Terms is found to be unenforceable, the remaining provisions 
              will continue in full force and effect.
            </p>
          </section>

          {/* Final Notice */}
          <section className="mt-12 p-6 rounded bg-gradient-to-br from-terminal-secondary to-terminal-bg border border-terminal-cyan/30">
            <div className="flex items-start gap-3">
              <Ban className="w-6 h-6 text-terminal-cyan flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-2">
                  ZERO TOLERANCE FOR DISINFORMATION
                </h3>
                <p className="text-terminal-muted">
                  Anyone found deliberately creating or spreading disinformation will be permanently 
                  banned. We fight lies with truth. This is non-negotiable.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
