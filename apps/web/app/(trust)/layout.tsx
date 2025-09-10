'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Eye, FileText, Database, Lock, Home, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const trustNavItems = [
  {
    href: '/trust',
    label: 'Overview',
    icon: Shield,
    description: 'Trust & Transparency Center'
  },
  {
    href: '/trust/transparency',
    label: 'Transparency',
    icon: Eye,
    description: 'How we operate openly'
  },
  {
    href: '/trust/provenance',
    label: 'Provenance',
    icon: FileText,
    description: 'Content verification (C2PA)'
  },
  {
    href: '/trust/dsr',
    label: 'Data Requests',
    icon: Database,
    description: 'Export or delete your data'
  },
  {
    href: '/trust/privacy',
    label: 'Privacy',
    icon: Lock,
    description: 'Privacy policy & controls'
  },
  {
    href: '/trust/audit',
    label: 'Audit Log',
    icon: FileText,
    description: 'Security & compliance audits'
  }
]

export default function TrustLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <header className="border-b border-terminal-border bg-terminal-black/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-terminal-muted hover:text-terminal-text transition-colors">
                <Home className="w-4 h-4" />
                <span className="text-sm">Home</span>
              </Link>
              <ChevronRight className="w-4 h-4 text-terminal-muted" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-terminal-cyan" />
                <h1 className="text-xl font-bold text-terminal-cyan">Trust & Transparency</h1>
              </div>
            </div>
            <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30">
              GDPR & CCPA Compliant
            </Badge>
          </div>
          <p className="text-sm text-terminal-muted mt-2">
            Your data, your control. Complete transparency in how we handle information.
          </p>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="border-b border-terminal-border bg-terminal-black/30 sticky top-[73px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto scrollbar-hide">
            {trustNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap
                    ${isActive 
                      ? 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/30' 
                      : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg border border-transparent'
                    }
                  `}
                  title={item.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border bg-terminal-black/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-terminal-cyan mb-3">Data Protection</h3>
              <ul className="space-y-2 text-sm text-terminal-muted">
                <li>
                  <Link href="/trust/dsr" className="hover:text-terminal-text transition-colors">
                    Request Your Data
                  </Link>
                </li>
                <li>
                  <Link href="/trust/dsr" className="hover:text-terminal-text transition-colors">
                    Delete Your Account
                  </Link>
                </li>
                <li>
                  <Link href="/trust/privacy" className="hover:text-terminal-text transition-colors">
                    Privacy Settings
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-terminal-cyan mb-3">Compliance</h3>
              <ul className="space-y-2 text-sm text-terminal-muted">
                <li>GDPR (European Union)</li>
                <li>CCPA (California)</li>
                <li>PIPEDA (Canada)</li>
                <li>LGPD (Brazil)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-terminal-cyan mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-terminal-muted">
                <li>
                  <a href="mailto:privacy@lionsofzion.com" className="hover:text-terminal-text transition-colors">
                    privacy@lionsofzion.com
                  </a>
                </li>
                <li>
                  <a href="mailto:dpo@lionsofzion.com" className="hover:text-terminal-text transition-colors">
                    Data Protection Officer
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-terminal-text transition-colors">
                    General Inquiries
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-terminal-border text-center text-sm text-terminal-muted">
            <p>© 2025 Lions of Zion. All rights reserved. Your privacy is our priority.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
