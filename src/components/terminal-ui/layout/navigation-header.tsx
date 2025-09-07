'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Home, Menu, X } from 'lucide-react'
import { StatusIndicator } from '@/app/_components/terminal/status-indicator'
import { LanguageSwitcher } from '@/app/_components/language-switcher'

interface NavigationLink {
  href: string
  label: string
  icon: React.ReactNode
}

const navigationLinks: NavigationLink[] = [
  { href: '/', label: 'HOME', icon: <Home className="w-4 h-4" /> },
  { href: '/platform', label: 'COMMAND CENTER', icon: <Shield className="w-4 h-4" /> },
]

export function NavigationHeader() {
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-terminal-secondary/90 backdrop-blur-sm border-b border-terminal-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Shield className="w-5 h-5 text-terminal-cyan group-hover:text-terminal-gold transition-colors" />
              <span className="text-lg font-bold text-terminal-cyan group-hover:text-terminal-gold transition-colors">
                LIONSPACE
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/50' 
                        : 'text-terminal-muted hover:text-terminal-cyan hover:bg-terminal-cyan/10'
                      }
                    `}
                  >
                    {link.icon}
                    <span className="uppercase tracking-wider">{link.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Side - Status and Time */}
          <div className="flex items-center gap-4">
            {/* Desktop Only Status */}
            <div className="hidden md:flex items-center gap-4">
              <StatusIndicator status="online" label="SYSTEM ONLINE" size="sm" />
              <span className="text-xs text-terminal-muted">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  timeZone: 'UTC'
                })} UTC
              </span>
              <LanguageSwitcher />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-terminal-cyan hover:text-terminal-gold transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-terminal-secondary border-t border-terminal-border">
          <nav className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/50' 
                        : 'text-terminal-muted hover:text-terminal-cyan hover:bg-terminal-cyan/10'
                      }
                    `}
                  >
                    {link.icon}
                    <span className="uppercase tracking-wider">{link.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-terminal-border">
              <div className="flex items-center justify-between">
                <StatusIndicator status="online" label="ONLINE" size="sm" />
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
