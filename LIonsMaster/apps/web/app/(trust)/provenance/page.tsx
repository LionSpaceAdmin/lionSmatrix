'use client'

import { useState } from 'react'
import { Shield, CheckCircle, AlertCircle, Info, FileCheck, Lock, Eye, Globe, FileKey, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { translations } from '@/lib/i18n/translations'
import { useTranslation } from '@/lib/i18n/use-translation'

// Mock verification states for demonstration
const verificationStates = {
  verified: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    label: 'C2PA Verified',
    description: 'Content authenticity verified through C2PA standard'
  },
  partial: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    label: 'Partial Verification',
    description: 'Some metadata verified, but chain incomplete'
  },
  unverified: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Unverified',
    description: 'No verification data available'
  },
  processing: {
    icon: FileCheck,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    label: 'Processing',
    description: 'Verification in progress...'
  }
}

// Mock ProvenanceBadge component
function ProvenanceBadge({ state = 'verified', showDetails = false }: { state: keyof typeof verificationStates, showDetails?: boolean }) {
  const stateInfo = verificationStates[state]
  const Icon = stateInfo.icon

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${stateInfo.bgColor} ${stateInfo.borderColor}`}>
      <Icon className={`w-4 h-4 ${stateInfo.color}`} />
      <span className={`text-sm font-medium ${stateInfo.color}`}>{stateInfo.label}</span>
      {showDetails && (
        <span className="text-xs text-terminal-muted ml-2">{stateInfo.description}</span>
      )}
    </div>
  )
}

export default function ProvenancePage() {
  const [activeDemo, setActiveDemo] = useState<keyof typeof verificationStates>('verified')
  const [verificationProgress, setVerificationProgress] = useState(0)
  const { t } = useTranslation()

  // Simulate verification process
  const simulateVerification = () => {
    setVerificationProgress(0)
    const interval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-terminal-cyan">
          Content Authenticity & Provenance
        </h1>
        <p className="text-xl text-terminal-muted max-w-3xl mx-auto">
          Lions of Zion uses the Coalition for Content Provenance and Authenticity (C2PA) standard 
          to verify the origin and history of digital content in our fight against disinformation.
        </p>
      </div>

      {/* What is C2PA */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-terminal-cyan">
            <Shield className="w-5 h-5" />
            What is C2PA?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-terminal-text">
          <p>
            The Coalition for Content Provenance and Authenticity (C2PA) is an open technical standard
            that provides a way to verify the authenticity and provenance of digital content.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-terminal-green">
                <FileKey className="w-4 h-4" />
                <span className="font-semibold">Cryptographic Signatures</span>
              </div>
              <p className="text-sm text-terminal-muted">
                Content is cryptographically signed to ensure it hasn't been tampered with
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-terminal-yellow">
                <Eye className="w-4 h-4" />
                <span className="font-semibold">Transparent History</span>
              </div>
              <p className="text-sm text-terminal-muted">
                Complete editing history and origin information embedded in metadata
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-terminal-blue">
                <Globe className="w-4 h-4" />
                <span className="font-semibold">Industry Standard</span>
              </div>
              <p className="text-sm text-terminal-muted">
                Supported by major tech companies and content platforms worldwide
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How We Use C2PA */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-terminal-cyan">
            <FileCheck className="w-5 h-5" />
            How Lions of Zion Uses C2PA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Alert className="border-terminal-blue bg-terminal-blue/10">
              <Info className="h-4 w-4 text-terminal-blue" />
              <AlertTitle className="text-terminal-blue">Verification Process</AlertTitle>
              <AlertDescription className="text-terminal-muted">
                Every piece of evidence and media content in our database undergoes C2PA verification
                to establish its authenticity and track its origin.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="bg-terminal-green/20 text-terminal-green">1</Badge>
                <div>
                  <h4 className="font-semibold text-terminal-text">Content Ingestion</h4>
                  <p className="text-sm text-terminal-muted">
                    When content is submitted, we extract and verify C2PA metadata
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-terminal-yellow/20 text-terminal-yellow">2</Badge>
                <div>
                  <h4 className="font-semibold text-terminal-text">Chain Validation</h4>
                  <p className="text-sm text-terminal-muted">
                    We validate the complete chain of custody from creation to submission
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-terminal-blue/20 text-terminal-blue">3</Badge>
                <div>
                  <h4 className="font-semibold text-terminal-text">Trust Score Assignment</h4>
                  <p className="text-sm text-terminal-muted">
                    Based on verification results, we assign a trust score to the content
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-terminal-cyan/20 text-terminal-cyan">4</Badge>
                <div>
                  <h4 className="font-semibold text-terminal-text">Continuous Monitoring</h4>
                  <p className="text-sm text-terminal-muted">
                    We continuously monitor for updates or changes to verification status
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-terminal-cyan">
            <Eye className="w-5 h-5" />
            Verification States - Interactive Demo
          </CardTitle>
          <CardDescription className="text-terminal-muted">
            See how different verification states appear in our system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeDemo} onValueChange={(v) => setActiveDemo(v as keyof typeof verificationStates)}>
            <TabsList className="grid grid-cols-4 bg-terminal-bg">
              <TabsTrigger value="verified" className="data-[state=active]:bg-green-500/20">
                Verified
              </TabsTrigger>
              <TabsTrigger value="partial" className="data-[state=active]:bg-yellow-500/20">
                Partial
              </TabsTrigger>
              <TabsTrigger value="unverified" className="data-[state=active]:bg-red-500/20">
                Unverified
              </TabsTrigger>
              <TabsTrigger value="processing" className="data-[state=active]:bg-blue-500/20">
                Processing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verified" className="space-y-4">
              <ProvenanceBadge state="verified" showDetails />
              <Card className="bg-terminal-bg border-green-500/20">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">Full C2PA Compliance</span>
                    </div>
                    <ul className="space-y-1 text-sm text-terminal-muted ml-6">
                      <li>• Original creator verified</li>
                      <li>• Complete edit history available</li>
                      <li>• Cryptographic signatures valid</li>
                      <li>• No tampering detected</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partial" className="space-y-4">
              <ProvenanceBadge state="partial" showDetails />
              <Card className="bg-terminal-bg border-yellow-500/20">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-yellow-500">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-semibold">Incomplete Verification</span>
                    </div>
                    <ul className="space-y-1 text-sm text-terminal-muted ml-6">
                      <li>• Some metadata verified</li>
                      <li>• Missing parts of edit history</li>
                      <li>• Partial signature validation</li>
                      <li>• Additional review recommended</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unverified" className="space-y-4">
              <ProvenanceBadge state="unverified" showDetails />
              <Card className="bg-terminal-bg border-red-500/20">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-semibold">No Verification Available</span>
                    </div>
                    <ul className="space-y-1 text-sm text-terminal-muted ml-6">
                      <li>• No C2PA metadata found</li>
                      <li>• Source cannot be verified</li>
                      <li>• Content should be treated with caution</li>
                      <li>• Manual fact-checking required</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              <ProvenanceBadge state="processing" showDetails />
              <Card className="bg-terminal-bg border-blue-500/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-500">
                      <FileCheck className="w-4 h-4" />
                      <span className="font-semibold">Verification In Progress</span>
                    </div>
                    <Progress value={verificationProgress} className="h-2" />
                    <ul className="space-y-1 text-sm text-terminal-muted ml-6">
                      <li>• Extracting metadata...</li>
                      <li>• Validating signatures...</li>
                      <li>• Checking chain of custody...</li>
                      <li>• Generating trust score...</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={simulateVerification}
                    className="w-full bg-terminal-blue hover:bg-terminal-blue/80"
                  >
                    Simulate Verification Process
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-terminal-cyan">
            <Lock className="w-5 h-5" />
            Best Practices for Content Creators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-terminal-green">DO ✓</h4>
              <ul className="space-y-2 text-sm text-terminal-text">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                  <span>Use C2PA-enabled tools when creating content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                  <span>Preserve metadata when sharing content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                  <span>Document your editing process</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                  <span>Verify content before sharing</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-terminal-red">DON'T ✗</h4>
              <ul className="space-y-2 text-sm text-terminal-text">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-terminal-red mt-0.5" />
                  <span>Strip metadata from images</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-terminal-red mt-0.5" />
                  <span>Use tools that don't support C2PA</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-terminal-red mt-0.5" />
                  <span>Modify verified content without documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-terminal-red mt-0.5" />
                  <span>Share unverified content as fact</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-cyan">Learn More</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-start border-terminal-border hover:bg-terminal-bg"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              C2PA Technical Specification
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-terminal-border hover:bg-terminal-bg"
            >
              <Globe className="w-4 h-4 mr-2" />
              Visit C2PA.org
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-terminal-border hover:bg-terminal-bg"
            >
              <Shield className="w-4 h-4 mr-2" />
              Verification Tools
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-terminal-border hover:bg-terminal-bg"
            >
              <Info className="w-4 h-4 mr-2" />
              FAQ & Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
