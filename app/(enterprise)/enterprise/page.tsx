'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Building2 } from 'lucide-react'
import { EnhancedTerminalBackground } from '@/components/organisms/EnhancedTerminalBackground'

const features = [
  {
    name: 'Role-Based Access Control (RBAC)',
    description: 'Fine-grained control over user permissions and access to sensitive data.',
  },
  {
    name: 'Tenant Management',
    description: 'Isolate data and configurations for different teams or clients within your organization.',
  },
  {
    name: 'Advanced Threat Intelligence',
    description: 'Access to our full suite of threat intelligence tools and APIs.',
  },
  {
    name: 'Priority Support',
    description: 'Dedicated support channel with guaranteed response times.',
  },
  {
    name: 'Custom Integrations',
    description: 'Integrate our platform with your existing security infrastructure.',
  },
  {
    name: 'Audit Logs',
    description: 'Comprehensive audit logs for compliance and security monitoring.',
  },
]

export default function EnterprisePage() {
  return (
    <div className="relative z-10">
      <EnhancedTerminalBackground
        mode="analysis"
        intensity="medium"
        className="fixed inset-0 z-0"
      />
      <div className="relative z-10 space-y-16">
        {/* Hero Section */}
        <section className="text-center pt-16">
          <Building2 className="w-16 h-16 md:w-20 md:h-20 text-terminal-cyan mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-terminal-cyan mb-4">
            Lions of Zion for Enterprise
          </h1>
          <p className="text-lg md:text-xl text-terminal-muted max-w-3xl mx-auto">
            Advanced security, control, and intelligence for the modern organization.
            Protect your assets with our battle-tested platform.
          </p>
        </section>

        {/* Features Section */}
        <section id="features">
          <h2 className="text-3xl font-bold text-center mb-10 text-terminal-cyan">
            Enterprise-Grade Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="bg-terminal-secondary/50 border border-terminal-border rounded-lg p-6 transform hover:-translate-y-1 transition-transform duration-300 backdrop-blur-sm"
              >
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-terminal-green mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-terminal-text mb-2">{feature.name}</h3>
                    <p className="text-terminal-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-terminal-secondary/50 border border-terminal-border rounded-lg p-10 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4 text-terminal-cyan">Ready to secure your organization?</h2>
          <p className="text-xl text-terminal-muted mb-8">
            Talk to our sales team to get a demo and a custom quote.
          </p>
          <Button asChild size="lg" className="bg-terminal-cyan hover:bg-terminal-cyan/80 text-terminal-bg font-bold">
            <Link href="/contact">Talk to Us</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
