'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Shield, AlertTriangle, FileCheck, Bell, Users, BarChart3, Home, ChevronRight, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const enterpriseNavItems = [
  {
    href: '/enterprise',
    label: 'Overview',
    icon: Building2,
    description: 'Enterprise solutions'
  },
  {
    href: '/enterprise/organization',
    label: 'Organization',
    icon: Users,
    description: 'Teams & permissions'
  },
  {
    href: '/enterprise/threats',
    label: 'Threat Monitor',
    icon: AlertTriangle,
    description: 'Real-time detection'
  },
  {
    href: '/enterprise/compliance',
    label: 'Compliance',
    icon: FileCheck,
    description: 'Regulatory reports'
  },
  {
    href: '/enterprise/alerts',
    label: 'Alert Config',
    icon: Bell,
    description: 'Custom rules'
  }
]

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPortalPage = pathname !== '/enterprise'

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
                <Building2 className="w-5 h-5 text-terminal-cyan" />
                <h1 className="text-xl font-bold text-terminal-cyan">
                  {isPortalPage ? 'Enterprise Portal' : 'Enterprise Solutions'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isPortalPage && (
                <Badge className="bg-terminal-yellow/20 text-terminal-yellow border-terminal-yellow/30">
                  <Lock className="w-3 h-3 mr-1" />
                  Restricted Access
                </Badge>
              )}
              <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30">
                Enterprise
              </Badge>
            </div>
          </div>
          {!isPortalPage && (
            <p className="text-sm text-terminal-muted mt-2">
              Military-grade defense against information warfare for organizations
            </p>
          )}
        </div>
      </header>

      {/* Navigation Bar (only for portal pages) */}
      {isPortalPage && (
        <nav className="border-b border-terminal-border bg-terminal-black/30 sticky top-[73px] z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 py-2 overflow-x-auto scrollbar-hide">
              {enterpriseNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const isOverview = item.href === '/enterprise'
                
                // Skip overview in portal navigation
                if (isPortalPage && isOverview) return null
                
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
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border bg-terminal-black/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-terminal-cyan mb-3">Enterprise</h3>
              <ul className="space-y-2 text-sm text-terminal-muted">
                <li>
                  <Link href="/enterprise" className="hover:text-terminal-text transition-colors">
                    Solutions Overview
                  </Link>
                </li>
                <li>
                  <Link href="/enterprise#pricing" className="hover:text-terminal-text transition-colors">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link href="/enterprise#features" className="hover:text-terminal-text transition-colors">
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-terminal-cyan mb-3">Portal</h3>
              <ul className="space-y-2 text-sm text-terminal-muted">
                {enterpriseNavItems.slice(1).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-terminal-text transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-terminal-cyan mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-terminal-muted">
                <li>
                  <Link href="/academy" className="hover:text-terminal-text transition-colors">
                    Training & Docs
                  </Link>
                </li>
                <li>
                  <Link href="/trust" className="hover:text-terminal-text transition-colors">
                    Security & Compliance
                  </Link>
                </li>
                <li>
                  <a href="/api/docs" className="hover:text-terminal-text transition-colors">
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-terminal-cyan mb-3">Contact Sales</h3>
              <ul className="space-y-2 text-sm text-terminal-muted">
                <li>
                  <a href="mailto:enterprise@lionsofzion.com" className="hover:text-terminal-text transition-colors">
                    enterprise@lionsofzion.com
                  </a>
                </li>
                <li>
                  <a href="tel:+1-800-LIONS" className="hover:text-terminal-text transition-colors">
                    1-800-LIONS (54667)
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-terminal-text transition-colors">
                    Contact Form
                  </Link>
                </li>
              </ul>
              <Button className="mt-4 w-full bg-terminal-cyan hover:bg-terminal-cyan/80" size="sm">
                Schedule Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-terminal-border text-center text-sm text-terminal-muted">
            <p>© 2025 Lions of Zion Enterprise. Military-grade protection for your organization.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
