'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Shield, User, CheckCircle, AlertCircle, Loader2, ArrowRight, Github, Chrome, Zap, Users, Target } from 'lucide-react'

const benefits = [
  {
    icon: Shield,
    title: 'Real-time Threat Detection',
    description: 'Get instant alerts about disinformation campaigns targeting your community'
  },
  {
    icon: Target,
    title: 'Fact-Checking Tools',
    description: 'Access AI-powered verification tools and evidence databases'
  },
  {
    icon: Users,
    title: 'Global Network',
    description: 'Join 12,000+ digital defenders worldwide fighting for truth'
  },
  {
    icon: Zap,
    title: 'Rapid Response',
    description: 'Coordinate counter-narratives and fact-based responses in real-time'
  }
]

export default function JoinPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1) // 1: benefits, 2: form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNews: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms to continue'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to onboarding
      router.push('/onboarding')
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true)
    try {
      // Mock social signup
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/onboarding')
    } catch (error) {
      setErrors({ general: `${provider} signup failed. Please try again.` })
    } finally {
      setIsLoading(false)
    }
  }

  // Step 1: Benefits
  if (step === 1) {
    return (
      <main className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-6">
              <Shield className="w-20 h-20 text-terminal-cyan mx-auto" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-mono text-terminal-cyan mb-4">
              JOIN THE LIONS
            </h1>
            <p className="text-xl text-terminal-muted max-w-2xl mx-auto">
              Become a digital defender in the global fight against disinformation
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border 
                           hover:border-terminal-cyan transition-all duration-200"
                >
                  <Icon className="w-10 h-10 text-terminal-cyan mb-4" />
                  <h3 className="text-lg font-bold font-mono text-terminal-cyan mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-terminal-muted">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Pledge Preview */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/10 to-terminal-secondary 
                        border border-cyan-500/30 mb-8">
            <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-4 text-center">
              THE LIONS' PLEDGE
            </h2>
            <p className="text-terminal-text text-center mb-6">
              By joining, you commit to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-terminal-text">Verify before you share</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-terminal-text">Fight lies with facts</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-terminal-text">Protect the vulnerable</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-terminal-text">Act with integrity</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-4 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                       text-cyan-400 font-mono font-bold text-lg hover:bg-cyan-500/30 
                       transition-all duration-200 flex items-center justify-center gap-2"
            >
              CREATE ACCOUNT
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="/auth/signin"
              className="px-8 py-4 rounded-lg bg-terminal-secondary border-2 border-terminal-border 
                       text-terminal-text font-mono font-bold text-lg hover:border-terminal-cyan 
                       transition-all duration-200 flex items-center justify-center gap-2"
            >
              ALREADY A LION?
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-terminal-cyan font-mono">12,847</div>
              <div className="text-xs text-terminal-muted uppercase">Active Lions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terminal-cyan font-mono">156</div>
              <div className="text-xs text-terminal-muted uppercase">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terminal-cyan font-mono">1.2M</div>
              <div className="text-xs text-terminal-muted uppercase">Threats Analyzed</div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Step 2: Registration Form
  return (
    <main className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => setStep(1)}
          className="mb-4 text-terminal-muted hover:text-terminal-cyan transition-colors 
                   font-mono text-sm flex items-center gap-1"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-terminal-cyan mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-mono text-terminal-cyan mb-2">
            CREATE YOUR ACCOUNT
          </h1>
          <p className="text-terminal-muted">
            Join the global network of truth defenders
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-mono text-terminal-cyan mb-2">
              USERNAME
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-terminal-secondary border rounded-lg 
                         text-terminal-text font-mono placeholder-terminal-muted
                         focus:border-terminal-cyan focus:outline-none transition-colors
                         ${errors.username ? 'border-red-500' : 'border-terminal-border'}`}
                placeholder="Choose your codename"
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-xs text-red-400 font-mono">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-mono text-terminal-cyan mb-2">
              EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-terminal-secondary border rounded-lg 
                         text-terminal-text font-mono placeholder-terminal-muted
                         focus:border-terminal-cyan focus:outline-none transition-colors
                         ${errors.email ? 'border-red-500' : 'border-terminal-border'}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400 font-mono">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-mono text-terminal-cyan mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-terminal-secondary border rounded-lg 
                         text-terminal-text font-mono placeholder-terminal-muted
                         focus:border-terminal-cyan focus:outline-none transition-colors
                         ${errors.password ? 'border-red-500' : 'border-terminal-border'}`}
                placeholder="Min 8 chars, 1 upper, 1 number"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-terminal-muted 
                         hover:text-terminal-text transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400 font-mono">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-mono text-terminal-cyan mb-2">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-terminal-secondary border rounded-lg 
                         text-terminal-text font-mono placeholder-terminal-muted
                         focus:border-terminal-cyan focus:outline-none transition-colors
                         ${errors.confirmPassword ? 'border-red-500' : 'border-terminal-border'}`}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400 font-mono">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 bg-terminal-secondary border border-terminal-border rounded 
                         text-terminal-cyan focus:ring-terminal-cyan"
              />
              <span className="text-sm text-terminal-muted">
                I accept the{' '}
                <Link href="/legal/terms" className="text-cyan-400 hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/legal/privacy" className="text-cyan-400 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-red-400 font-mono">{errors.acceptTerms}</p>
            )}
            
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="subscribeNews"
                checked={formData.subscribeNews}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 bg-terminal-secondary border border-terminal-border rounded 
                         text-terminal-cyan focus:ring-terminal-cyan"
              />
              <span className="text-sm text-terminal-muted">
                Send me threat alerts and platform updates
              </span>
            </label>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                     text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                CREATING ACCOUNT...
              </>
            ) : (
              <>
                JOIN THE FIGHT
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-terminal-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-terminal-bg text-terminal-muted">OR JOIN WITH</span>
          </div>
        </div>

        {/* Social Signup */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialSignup('GitHub')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg 
                     bg-terminal-secondary border border-terminal-border text-terminal-text 
                     hover:border-terminal-cyan transition-colors disabled:opacity-50"
          >
            <Github className="w-5 h-5" />
            <span className="font-mono text-sm">GitHub</span>
          </button>
          <button
            onClick={() => handleSocialSignup('Google')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg 
                     bg-terminal-secondary border border-terminal-border text-terminal-text 
                     hover:border-terminal-cyan transition-colors disabled:opacity-50"
          >
            <Chrome className="w-5 h-5" />
            <span className="font-mono text-sm">Google</span>
          </button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-terminal-muted mt-6">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors">
            SIGN IN
          </Link>
        </p>
      </div>
    </main>
  )
}
