'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield, Target, Globe, Bell, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

const TOTAL_STEPS = 3

const interests = [
  { id: 'politics', label: 'Political Disinformation', icon: '🏛️' },
  { id: 'health', label: 'Health Misinformation', icon: '🏥' },
  { id: 'climate', label: 'Climate Denial', icon: '🌍' },
  { id: 'tech', label: 'Tech Manipulation', icon: '💻' },
  { id: 'conflict', label: 'Conflict Propaganda', icon: '⚔️' },
  { id: 'economy', label: 'Economic Deception', icon: '📈' },
  { id: 'social', label: 'Social Engineering', icon: '👥' },
  { id: 'election', label: 'Election Integrity', icon: '🗳️' }
]

const regions = [
  { id: 'global', label: 'Global', flag: '🌐' },
  { id: 'north-america', label: 'North America', flag: '🇺🇸' },
  { id: 'europe', label: 'Europe', flag: '🇪🇺' },
  { id: 'asia', label: 'Asia', flag: '🌏' },
  { id: 'middle-east', label: 'Middle East', flag: '🌍' },
  { id: 'africa', label: 'Africa', flag: '🌍' },
  { id: 'south-america', label: 'South America', flag: '🌎' },
  { id: 'oceania', label: 'Oceania', flag: '🇦🇺' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selections, setSelections] = useState({
    interests: [] as string[],
    region: 'global',
    notifications: {
      threats: true,
      weekly: true,
      campaigns: false,
      research: false
    }
  })

  const handleInterestToggle = (interestId: string) => {
    setSelections(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const handleRegionSelect = (regionId: string) => {
    setSelections(prev => ({
      ...prev,
      region: regionId
    }))
  }

  const handleNotificationToggle = (key: keyof typeof selections.notifications) => {
    setSelections(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }))
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      // Mock save preferences
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store selections in localStorage for now
      localStorage.setItem('onboarding_completed', 'true')
      localStorage.setItem('user_preferences', JSON.stringify(selections))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selections.interests.length > 0
      case 2:
        return selections.region !== ''
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <main className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-terminal-cyan mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-mono text-terminal-cyan mb-2">
            CONFIGURE YOUR MISSION
          </h1>
          <p className="text-terminal-muted">
            Customize your Lions of Zion experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < TOTAL_STEPS ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold
                            ${currentStep >= step 
                              ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400' 
                              : 'bg-terminal-secondary border border-terminal-border text-terminal-muted'}`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < TOTAL_STEPS && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all duration-300
                              ${currentStep > step ? 'bg-cyan-500' : 'bg-terminal-border'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className={currentStep >= 1 ? 'text-terminal-cyan' : 'text-terminal-muted'}>
              Interests
            </span>
            <span className={currentStep >= 2 ? 'text-terminal-cyan' : 'text-terminal-muted'}>
              Region
            </span>
            <span className={currentStep >= 3 ? 'text-terminal-cyan' : 'text-terminal-muted'}>
              Notifications
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8 min-h-[400px]">
          {/* Step 1: Interests */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-terminal-cyan mx-auto mb-3" />
                <h2 className="text-xl font-bold font-mono text-terminal-cyan mb-2">
                  SELECT YOUR BATTLE ZONES
                </h2>
                <p className="text-terminal-muted text-sm">
                  Choose the disinformation topics you want to monitor and fight
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestToggle(interest.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left
                              ${selections.interests.includes(interest.id)
                                ? 'bg-cyan-500/20 border-cyan-500 text-terminal-cyan'
                                : 'bg-terminal-secondary border-terminal-border text-terminal-text hover:border-terminal-cyan'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{interest.icon}</span>
                      <span className="font-mono text-sm">{interest.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-terminal-muted text-center mt-4">
                Select at least one area of interest. You can change these later.
              </p>
            </div>
          )}

          {/* Step 2: Region */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Globe className="w-12 h-12 text-terminal-cyan mx-auto mb-3" />
                <h2 className="text-xl font-bold font-mono text-terminal-cyan mb-2">
                  CHOOSE YOUR REGION
                </h2>
                <p className="text-terminal-muted text-sm">
                  Focus on threats specific to your geographic area
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleRegionSelect(region.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left
                              ${selections.region === region.id
                                ? 'bg-cyan-500/20 border-cyan-500 text-terminal-cyan'
                                : 'bg-terminal-secondary border-terminal-border text-terminal-text hover:border-terminal-cyan'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{region.flag}</span>
                      <span className="font-mono text-sm">{region.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-terminal-muted text-center mt-4">
                You'll receive region-specific threat intelligence and alerts
              </p>
            </div>
          )}

          {/* Step 3: Notifications */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Bell className="w-12 h-12 text-terminal-cyan mx-auto mb-3" />
                <h2 className="text-xl font-bold font-mono text-terminal-cyan mb-2">
                  CONFIGURE ALERTS
                </h2>
                <p className="text-terminal-muted text-sm">
                  Stay informed about emerging threats and campaigns
                </p>
              </div>
              
              <div className="space-y-3">
                <div
                  className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border"
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-mono text-terminal-cyan mb-1">
                        Critical Threat Alerts
                      </div>
                      <div className="text-xs text-terminal-muted">
                        Immediate notifications for high-priority disinformation campaigns
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selections.notifications.threats}
                      onChange={() => handleNotificationToggle('threats')}
                      className="w-5 h-5 bg-terminal-secondary border border-terminal-border rounded 
                               text-terminal-cyan focus:ring-terminal-cyan"
                    />
                  </label>
                </div>
                
                <div
                  className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border"
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-mono text-terminal-cyan mb-1">
                        Weekly Intelligence Brief
                      </div>
                      <div className="text-xs text-terminal-muted">
                        Summary of disinformation trends and countermeasures
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selections.notifications.weekly}
                      onChange={() => handleNotificationToggle('weekly')}
                      className="w-5 h-5 bg-terminal-secondary border border-terminal-border rounded 
                               text-terminal-cyan focus:ring-terminal-cyan"
                    />
                  </label>
                </div>
                
                <div
                  className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border"
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-mono text-terminal-cyan mb-1">
                        Campaign Opportunities
                      </div>
                      <div className="text-xs text-terminal-muted">
                        Join coordinated efforts to combat misinformation
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selections.notifications.campaigns}
                      onChange={() => handleNotificationToggle('campaigns')}
                      className="w-5 h-5 bg-terminal-secondary border border-terminal-border rounded 
                               text-terminal-cyan focus:ring-terminal-cyan"
                    />
                  </label>
                </div>
                
                <div
                  className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border"
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-mono text-terminal-cyan mb-1">
                        Research & Reports
                      </div>
                      <div className="text-xs text-terminal-muted">
                        New studies and analysis on disinformation tactics
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selections.notifications.research}
                      onChange={() => handleNotificationToggle('research')}
                      className="w-5 h-5 bg-terminal-secondary border border-terminal-border rounded 
                               text-terminal-cyan focus:ring-terminal-cyan"
                    />
                  </label>
                </div>
              </div>
              
              <p className="text-xs text-terminal-muted text-center mt-4">
                You can update your notification preferences anytime in settings
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-mono font-bold transition-all duration-200
                      flex items-center gap-2
                      ${currentStep === 1
                        ? 'bg-terminal-secondary border border-terminal-border text-terminal-muted cursor-not-allowed'
                        : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:border-terminal-cyan'}`}
          >
            <ChevronLeft className="w-5 h-5" />
            BACK
          </button>
          
          {currentStep < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 py-3 rounded-lg font-mono font-bold transition-all duration-200
                        flex items-center justify-center gap-2
                        ${canProceed()
                          ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/30'
                          : 'bg-terminal-secondary border border-terminal-border text-terminal-muted cursor-not-allowed'}`}
            >
              NEXT
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isLoading || !canProceed()}
              className="flex-1 py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                       text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ACTIVATING...
                </>
              ) : (
                <>
                  COMPLETE SETUP
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-terminal-muted hover:text-terminal-cyan transition-colors font-mono"
          >
            Skip for now →
          </button>
        </div>
      </div>
    </main>
  )
}
