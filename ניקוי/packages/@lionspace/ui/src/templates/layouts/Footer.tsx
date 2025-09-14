'use client'

import Link from 'next/link'
import { Shield, Lock, FileText, Mail } from 'lucide-react'

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background/95">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold font-mono text-cyan-400">
              LIONS OF ZION
            </h3>
            <p className="text-sm text-muted-foreground">
              Fighting disinformation, defending truth. Join the resistance.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>Verified & Transparent</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/daily-brief" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Daily Brief
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Narrative Archive
                </Link>
              </li>
              <li>
                <Link href="/playbooks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Response Playbooks
                </Link>
              </li>
              <li>
                <Link href="/dashboard/war-machine" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  War Machine
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Trust & Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Transparency
                </Link>
              </li>
              <li>
                <Link href="/trust/provenance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Content Provenance
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Get Involved</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/join" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Join the Fight - Free
                </Link>
              </li>
              <li>
                <Link href="/academy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {currentYear} Lions of Zion. Truth shall prevail.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/impact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Impact Metrics
              </Link>
              <Link href="/trust/dsr" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Data Rights
              </Link>
              <span className="text-xs text-muted-foreground">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
