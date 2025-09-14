'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ChevronRight, AlertTriangle, Eye, Users, Target } from 'lucide-react'
import { PledgeBox } from '@/components/shared/PledgeBox'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { EnhancedTerminalBackground } from '@/components/organisms/EnhancedTerminalBackground'
import { CognitiveWarfareRotatingMessages } from '@/components/ui/CognitiveWarfareRotatingMessages'
import { useLocale } from '@/lib/hooks/useLocale'

export default function OpeningPage() {
  const router = useRouter()
  const [hasConsented, setHasConsented] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { locale } = useLocale()

  // Check if user has already consented
  useEffect(() => {
    const consentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('lions-consent='))
      ?.split('=')[1]
    
    if (consentCookie === 'true') {
      router.push('/')
    }
  }, [router])

  const handleContinue = async () => {
    setIsLoading(true)
    
    // Set consent cookie (expires in 1 year)
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)
    document.cookie = `lions-consent=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`
    
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    router.push('/')
  }

  const threatAdvisories = [
    {
      id: 'election-2024',
      level: 'critical' as const,
      title: 'Election Interference Campaign Active',
      description: 'Coordinated disinformation targeting democratic processes detected across multiple platforms.',
      timestamp: new Date().toISOString()
    },
    {
      id: 'deepfake-surge',
      level: 'high' as const,
      title: 'AI-Generated Content Surge',
      description: 'Significant increase in sophisticated deepfake videos spreading false narratives.',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4">
      {/* Enhanced Terminal Background with Defense Mode for Security Focus */}
      <EnhancedTerminalBackground 
        intensity="high"
        mode="defense"
        className="fixed inset-0 z-0"
      />
      
      {/* Content with higher z-index */}
      <div className="relative z-10 w-full">
      <div className="max-w-4xl w-full">
        {/* Threat Advisory Banner */}
        <div className="mb-8">
          <AlertBanner
            type="error"
            title="Critical Alert"
            message="Multiple threat advisories detected"
            className="mb-4"
          />
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-16 h-16 text-terminal-cyan" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-mono text-terminal-cyan mb-4">
              LIONS OF ZION
            </h1>
            <div className="text-xl md:text-2xl text-terminal-text font-mono mb-8">
              Truth Defenders • Information Warriors
            </div>
            
            {/* Cognitive Warfare Rotating Messages */}
            <div className="max-w-4xl mx-auto mb-8">
              <CognitiveWarfareRotatingMessages 
                locale={locale}
                className="p-6 bg-terminal-secondary/50 border border-terminal-border rounded-lg backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Mission Statement */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-text mb-6">
              Defending Truth in the Information War
            </h2>
            <p className="text-lg text-terminal-muted leading-relaxed mb-8">
              We are the digital guardians standing against the tide of disinformation, 
              conspiracy theories, and malicious influence operations. Our mission is to 
              identify, analyze, and counter false narratives that threaten democratic 
              societies and human progress.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                <Eye className="w-8 h-8 text-terminal-cyan mx-auto mb-3" />
                <h3 className="text-lg font-bold text-terminal-text mb-2">Vigilance</h3>
                <p className="text-sm text-terminal-muted">
                  Constant monitoring of information landscapes to detect emerging threats.
                </p>
              </div>
              
              <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                <Target className="w-8 h-8 text-terminal-cyan mx-auto mb-3" />
                <h3 className="text-lg font-bold text-terminal-text mb-2">Precision</h3>
                <p className="text-sm text-terminal-muted">
                  Accurate, evidence-based analysis and fact-checking methodologies.
                </p>
              </div>
              
              <div className="p-6 bg-terminal-secondary border border-terminal-border rounded-lg">
                <Users className="w-8 h-8 text-terminal-cyan mx-auto mb-3" />
                <h3 className="text-lg font-bold text-terminal-text mb-2">Unity</h3>
                <p className="text-sm text-terminal-muted">
                  Building a global community of truth defenders and digital citizens.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pledge Box */}
        <PledgeBox
          title="Commitment to Truth & Responsibility"
          description="By continuing, you pledge to use this platform responsibly, respect democratic values, and contribute to the fight against disinformation."
          points={[
            "I will verify information before sharing",
            "I will respect the privacy and dignity of all individuals",
            "I will not use this platform to spread false information",
            "I will contribute to building a more informed society",
            "I understand the serious nature of information warfare"
          ]}
          onAccept={handleContinue}
          acceptText={isLoading ? "Entering..." : "Agree & Continue"}
          disabled={isLoading}
          className="max-w-2xl mx-auto"
        />

        {/* Warning Notice */}
        <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-200">
              <p className="font-semibold mb-1">Important Notice</p>
              <p>
                This platform contains content related to disinformation, conspiracy theories, 
                and influence operations. Content is presented for analysis and educational 
                purposes only. By proceeding, you acknowledge understanding of the serious 
                nature of this material.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-terminal-muted">
            <a href="/about" className="hover:text-terminal-cyan transition-colors">
              About Us
            </a>
            <a href="/legal/privacy" className="hover:text-terminal-cyan transition-colors">
              Privacy Policy
            </a>
            <a href="/legal/terms" className="hover:text-terminal-cyan transition-colors">
              Terms of Service
            </a>
            <a href="/trust/transparency" className="hover:text-terminal-cyan transition-colors">
              Transparency
            </a>
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}