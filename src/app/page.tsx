'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MatrixBackground from './_components/visuals/MatrixBackground'
import { useTranslation, TranslationProvider } from '../contexts/translation-context'
import { INTELLIGENCE_DATA } from './_components/visuals/intelligence-data'

// Central Hero Message Component
function CentralHeroMessage() {
  const { getCurrentMessage, currentLanguage } = useTranslation()
  const [displayText, setDisplayText] = useState('')
  const [currentMessage, setCurrentMessage] = useState('')

  // Update current message when context changes
  useEffect(() => {
    const newMessage = getCurrentMessage()
    setCurrentMessage(newMessage)
  }, [getCurrentMessage])

  // Typing effect for messages
  useEffect(() => {
    if (!currentMessage) return
    
    setDisplayText('')
    let i = 0
    
    const typingInterval = setInterval(() => {
      if (i < currentMessage.length) {
        setDisplayText(currentMessage.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 30) // Faster typing for professional feel

    return () => clearInterval(typingInterval)
  }, [currentMessage])

  return (
    <div className="text-center max-w-5xl px-8">
      <div className="bg-black/90 border border-white/30 p-12 backdrop-blur-sm shadow-2xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wider font-mono">
          LIONSPACE
        </h1>
        <h2 className="text-xl md:text-2xl text-white/80 mb-8 tracking-widest font-mono">
          INTELLIGENCE MATRIX
        </h2>
        <div className="h-28 flex items-center justify-center mb-8">
          <p className="text-lg md:text-2xl text-white font-mono leading-relaxed text-center">
            {displayText}
            <span className="animate-pulse text-white">█</span>
          </p>
        </div>
        <div className="text-xs text-white/50 mb-6 font-mono">
          LANGUAGE: {currentLanguage.toUpperCase()} | PATTERNS: ACTIVE | STATUS: SCANNING
        </div>
      </div>
    </div>
  )
}

// Network Visualization Component with Real Connections
function NetworkVisualization() {
  const [showNetwork, setShowNetwork] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH')
  const [selectedActor, setSelectedActor] = useState<string | null>(null)

  const getActorsByRisk = (riskLevel: string) => {
    return INTELLIGENCE_DATA.fake_resistance_actors.filter(actor => actor.risk === riskLevel)
  }

  const getActorConnections = (actorName: string) => {
    return INTELLIGENCE_DATA.network_connections[actorName] || []
  }

  const getActorByName = (name: string) => {
    return INTELLIGENCE_DATA.fake_resistance_actors.find(actor => actor.name === name)
  }

  return (
    <>
      <div className="absolute top-8 right-8 flex gap-4" style={{ zIndex: 30 }}>
        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
          className="bg-black/90 border border-white/30 text-white px-3 py-2 font-mono text-sm"
          title="Select risk level for actor filtering"
          aria-label="Risk level filter"
        >
          <option value="HIGH">HIGH RISK</option>
          <option value="MEDIUM">MEDIUM RISK</option>
          <option value="LOW">LOW RISK</option>
        </select>
        <button
          type="button"
          onClick={() => setShowNetwork(!showNetwork)}
          className={`bg-black/90 border ${showNetwork ? 'border-white' : 'border-white/30'} hover:border-white text-white px-4 py-2 font-mono text-sm transition-all duration-300`}
        >
          {showNetwork ? 'HIDE NETWORK' : 'SHOW NETWORK'}
        </button>
      </div>

      {showNetwork && (
        <div className="absolute left-8 top-1/4 max-w-2xl" style={{ zIndex: 25 }}>
          <div className="bg-black/95 border border-white/30 p-6 backdrop-blur-sm max-h-96 overflow-y-auto">
            <h3 className="text-white font-mono text-lg mb-4 border-b border-white/30 pb-2">
              {selectedRisk} RISK ACTORS NETWORK
            </h3>
            <div className="space-y-4">
              {getActorsByRisk(selectedRisk).map((actor, index) => (
                <div key={index} className="text-sm text-white/90 font-mono">
                  <div 
                    className="border-l-2 border-white/20 pl-4 cursor-pointer hover:border-white/40 transition-colors"
                    onClick={() => setSelectedActor(selectedActor === actor.name ? null : actor.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-base">{actor.name}</div>
                      <div className="text-xs text-white/50">{actor.audience}</div>
                    </div>
                    <div className="text-white/70 text-xs mt-1">{actor.platform}</div>
                    <div className="text-white/60 text-xs mt-2 leading-relaxed">{actor.narrative}</div>
                    
                    {/* Show affiliation if available */}
                    {actor.affiliation && (
                      <div className="text-white/50 text-xs mt-2 italic">
                        → {actor.affiliation}
                      </div>
                    )}

                    {/* Show network connections when selected */}
                    {selectedActor === actor.name && (
                      <div className="mt-3 ml-4 p-3 bg-black/60 border border-white/20">
                        <div className="text-white/80 text-xs mb-2 font-semibold">NETWORK CONNECTIONS:</div>
                        <div className="space-y-2">
                          {getActorConnections(actor.name).map((connectedName: string, connIndex: number) => {
                            const connectedActor = getActorByName(connectedName)
                            return (
                              <div key={connIndex} className="flex items-center justify-between text-xs">
                                <span className="text-white/70">↳ {connectedName}</span>
                                {connectedActor && (
                                  <span className="text-white/50">{connectedActor.audience}</span>
                                )}
                              </div>
                            )
                          })}
                          {getActorConnections(actor.name).length === 0 && (
                            <div className="text-white/40 text-xs italic">No documented connections</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {index < getActorsByRisk(selectedRisk).length - 1 && (
                    <div className="border-b border-white/10 mt-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Call to Action Section
function CallToActionSection() {
  const router = useRouter()

  const handleEnterMatrix = () => {
    router.push('/platform')
  }

  return (
    <div className="text-center">
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <button
          type="button"
          onClick={handleEnterMatrix}
          className="group relative px-12 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-500 font-mono text-xl tracking-wider overflow-hidden"
        >
          <span className="relative z-10">ENTER THE MATRIX</span>
          <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        </button>
        
        <button
          type="button"
          onClick={() => router.push('/intelligence')}
          className="px-12 py-4 bg-transparent border border-white/50 text-white/80 hover:border-white hover:text-white transition-all duration-300 font-mono text-xl tracking-wider"
        >
          INTELLIGENCE BRIEF
        </button>
      </div>
    </div>
  )
}

// Status Bar Component
function StatusBar() {
  const { currentLanguage } = useTranslation()
  const [activePatterns, setActivePatterns] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePatterns(prev => (prev + 1) % 1000)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 15 }}>
      <div className="bg-black/95 border-t-2 border-white/30 p-4 font-mono text-sm text-white/80">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <div>LIONSPACE.MATRIX.EXE</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white animate-pulse rounded-full"></div>
              <span>STATUS: ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div>LANG: {currentLanguage.toUpperCase()}</div>
            <div>PATTERNS: {activePatterns.toString().padStart(3, '0')}</div>
            <div>THREATS: MONITORING</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Landing Page Component
function MatrixLandingPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Enhanced Matrix Background with horizontal scanning */}
      <MatrixBackground />
      
      {/* Central Content */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
        <div className="flex flex-col items-center gap-12">
          <CentralHeroMessage />
          <CallToActionSection />
        </div>
      </div>

      {/* Network Visualization */}
      <NetworkVisualization />

      {/* Status Bar */}
      <StatusBar />

      {/* CSS for enhanced animations */}
      <style jsx global>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100vh);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        
        .matrix-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.01) 3px
          );
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
    </main>
  )
}

// Root component with Translation Provider
export default function Home() {
  return (
    <TranslationProvider>
      <MatrixLandingPage />
    </TranslationProvider>
  )
}