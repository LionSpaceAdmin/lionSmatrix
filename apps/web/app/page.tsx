"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, ArrowRight, Eye, Target, Users, AlertTriangle, TrendingUp, Globe } from "lucide-react"
import { EnhancedTerminalBackground } from "@/components/organisms/EnhancedTerminalBackground"
import { NarrativeCard } from "@/components/shared/NarrativeCard"
import { ActionGrid } from "@/components/shared/ActionGrid"
import { ThreatStrip } from "@/components/shared/ThreatStrip"
import { AlertBanner } from "@/components/shared/AlertBanner"
import { ProvenanceBadge } from "@/components/ai/ProvenanceBadge"

export default function HomePage() {
  const router = useRouter()
  const [backgroundMode, setBackgroundMode] = useState<"intelligence" | "defense" | "analysis" | "warfare">(
    "intelligence"
  )

  // Mock data for featured narratives - using static timestamps to prevent hydration mismatch
  const featuredNarratives = [
    {
      id: "1",
      title: "Coordinated Bot Network Targets Election Integrity",
      description:
        "Large-scale bot operation spreading false claims about voting systems detected across multiple platforms.",
      threatLevel: "critical" as const,
      confidence: 89,
      evidenceCount: 234,
      lastUpdated: "2025-09-11T10:58:15.095Z", // Static timestamp
      topics: ["Elections", "Bots", "Democracy"],
      impactScore: 87.3,
      region: "North America",
    },
    {
      id: "2",
      title: "Deepfake Video of World Leader Goes Viral",
      description:
        "AI-generated video falsely showing political leader making inflammatory statements spreads rapidly.",
      threatLevel: "critical" as const,
      confidence: 94,
      evidenceCount: 156,
      lastUpdated: "2025-09-11T09:58:15.095Z", // Static timestamp
      topics: ["Deepfake", "Politics", "AI"],
      impactScore: 92.1,
      region: "Europe",
    },
    {
      id: "3",
      title: "Health Misinformation Campaign Using Fake Doctors",
      description: "Coordinated campaign using fake medical professionals to spread vaccine misinformation identified.",
      threatLevel: "high" as const,
      confidence: 91,
      evidenceCount: 178,
      lastUpdated: "2025-09-11T07:58:15.095Z", // Static timestamp
      topics: ["Health", "Vaccines", "Impersonation"],
      impactScore: 76.5,
      region: "Global",
    },
  ]

  const actions = [
    {
      id: "fact-check",
      title: "Fact-Check",
      description: "Verify claims and detect disinformation",
      icon: Shield,
      href: "/dashboard/tools/fact-check",
      variant: "primary" as const,
    },
    {
      id: "report-fake",
      title: "Report Fake",
      description: "Submit suspicious content for analysis",
      icon: AlertTriangle,
      href: "/dashboard/tools/report-research",
      variant: "secondary" as const,
    },
    {
      id: "daily-brief",
      title: "Daily Brief",
      description: "Latest threat intelligence updates",
      icon: TrendingUp,
      href: "/daily-brief",
      variant: "secondary" as const,
    },
    {
      id: "join-fight",
      title: "Join the Fight",
      description: "Become a truth defender",
      icon: Users,
      href: "/auth/join",
      variant: "primary" as const,
    },
  ]

  const currentThreats = [
    {
      id: "election-2024",
      level: "critical" as const,
      title: "Election Interference Campaign Active",
      description: "Coordinated disinformation targeting democratic processes detected across multiple platforms.",
      timestamp: "2025-09-11T11:58:15.095Z", // Static timestamp
    },
    {
      id: "deepfake-surge",
      level: "high" as const,
      title: "AI-Generated Content Surge",
      description: "Significant increase in sophisticated deepfake videos spreading false narratives.",
      timestamp: "2025-09-11T10:58:15.095Z", // Static timestamp
    },
  ]

  // Cycle through background modes for demo
  useEffect(() => {
    const modes: Array<"intelligence" | "defense" | "analysis" | "warfare"> = [
      "intelligence",
      "defense",
      "analysis",
      "warfare",
    ]
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % modes.length
      setBackgroundMode(modes[currentIndex])
    }, 15000) // Change every 15 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative min-h-screen">
      {/* Enhanced Terminal Background with Neural Network */}
      <EnhancedTerminalBackground intensity="medium" mode={backgroundMode} className="fixed inset-0 z-0" />

      {/* Content */}
      <div className="relative z-10">
        {/* Threat Strip */}
        <ThreatStrip threats={currentThreats} />

        {/* Alert Banner */}
        <div className="container mx-auto max-w-7xl px-4 pt-4">
          <AlertBanner
            type="error"
            title="Threat Alert"
            message="Critical disinformation campaigns detected"
            className="mb-6"
          />
        </div>

        {/* Hero Section */}
        <section className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
          <div className="mb-12 text-center">
            {/* Logo/Brand */}
            <div className="mb-6 flex items-center justify-center">
              <Shield className="text-terminal-cyan h-16 w-16 md:h-20 md:w-20" />
            </div>

            {/* Animated network visualization canvas */}
            <div className="relative mb-8">
              <h1 className="text-terminal-cyan hero-title mb-4 font-mono text-4xl font-bold md:text-6xl lg:text-7xl">
                LIONS OF ZION
              </h1>
              <div className="text-terminal-text mb-2 font-mono text-xl md:text-2xl">
                Military-Grade Defense Against Information Warfare
              </div>
              <div className="text-terminal-muted text-lg">
                Real-time threat analysis • Fact-checking • Community action
              </div>
            </div>

            {/* Trust Cues */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
              <ProvenanceBadge state="verified" showDetails={false} />
              <div className="text-terminal-muted flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                <span>Protecting 2.8M+ users globally</span>
              </div>
              <div className="text-terminal-muted flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>3,891 threats neutralized</span>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => router.push("/auth/join")}
                className="bg-terminal-cyan text-terminal-bg hover:bg-terminal-cyan/80 flex transform items-center justify-center gap-2 rounded px-8 py-4 font-mono font-bold transition-colors duration-200 hover:scale-105"
              >
                Join the Fight — Free
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => router.push("/dashboard/war-machine")}
                className="border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/10 flex transform items-center justify-center gap-2 rounded border px-8 py-4 font-mono font-bold transition-colors duration-200 hover:scale-105"
              >
                Explore the War Machine
                <Target className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="terminal-card rounded-lg p-6 text-center">
              <Eye className="text-terminal-cyan mx-auto mb-4 h-12 w-12" />
              <h3 className="text-terminal-text mb-2 text-xl font-bold">Vigilance</h3>
              <p className="text-terminal-muted">
                24/7 monitoring of global information landscapes to detect emerging threats and disinformation
                campaigns.
              </p>
            </div>

            <div className="terminal-card rounded-lg p-6 text-center">
              <Target className="text-terminal-cyan mx-auto mb-4 h-12 w-12" />
              <h3 className="text-terminal-text mb-2 text-xl font-bold">Precision</h3>
              <p className="text-terminal-muted">
                Military-grade accuracy in threat assessment using advanced AI and human intelligence analysis.
              </p>
            </div>

            <div className="terminal-card rounded-lg p-6 text-center">
              <Users className="text-terminal-cyan mx-auto mb-4 h-12 w-12" />
              <h3 className="text-terminal-text mb-2 text-xl font-bold">Unity</h3>
              <p className="text-terminal-muted">
                Building a global alliance of truth defenders and digital citizens committed to information integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Narratives */}
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-terminal-text font-mono text-3xl font-bold">ACTIVE THREATS</h2>
            <button
              onClick={() => router.push("/archive")}
              className="text-terminal-cyan hover:text-terminal-cyan/80 flex items-center gap-2 font-mono transition-colors"
            >
              View All Narratives
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredNarratives.map((narrative) => (
              <NarrativeCard
                key={narrative.id}
                narrative={narrative}
                onFactCheck={() => router.push(`/dashboard/tools/fact-check?narrative=${narrative.id}`)}
                onViewDetails={() => router.push(`/archive/${narrative.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Action Grid */}
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-terminal-text mb-8 text-center font-mono text-3xl font-bold">CHOOSE YOUR WEAPON</h2>
          <ActionGrid actions={actions} />
        </section>

        {/* Call to Action */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="terminal-card rounded-lg p-8 text-center">
            <h2 className="text-terminal-text mb-4 text-3xl font-bold">The Information War is Real</h2>
            <p className="text-terminal-muted mx-auto mb-8 max-w-3xl text-xl">
              Every day, millions of people are targeted by sophisticated disinformation campaigns. Join our mission to
              defend truth and protect democratic institutions worldwide.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => router.push("/auth/join")}
                className="bg-terminal-cyan text-terminal-bg hover:bg-terminal-cyan/80 rounded px-8 py-4 font-mono font-bold transition-colors"
              >
                Join the Resistance
              </button>
              <button
                onClick={() => router.push("/about")}
                className="border-terminal-border text-terminal-text hover:border-terminal-cyan hover:text-terminal-cyan rounded border px-8 py-4 font-mono transition-colors"
              >
                Learn Our Mission
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
