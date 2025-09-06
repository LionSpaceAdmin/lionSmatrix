'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Shield, Lock, Mail, Eye, EyeOff, ChevronRight } from 'lucide-react'
import { 
  TerminalInput, 
  TerminalButton, 
  TerminalCard,
  MatrixBackground 
} from '@/components/terminal-ui'

// Dynamically import for better performance
const LivingIntelligenceCanvas = dynamic(
  () => import('@/app/_components/visuals/living-intelligence-canvas').then(mod => mod.LivingIntelligenceCanvas),
  { ssr: false }
)

export default function JoinPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    
    // Handle successful registration
    console.log('Registration successful')
  }

  return (
    <div className="relative min-h-screen bg-terminal-bg overflow-hidden">
      {/* Background effects */}
      {/* <LivingIntelligenceCanvas /> */}
      <MatrixBackground />
      
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-scanline animate-scan opacity-5" />
      </div>
      
      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-terminal-cyan" />
              <div className="absolute inset-0 animate-pulse-glow">
                <Shield className="w-16 h-16 text-terminal-cyan opacity-50 blur-sm" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-terminal text-terminal-cyan terminal-text-gradient">
            LIONSPACE
          </h1>
          <p className="mt-2 text-sm text-terminal-gold uppercase tracking-wider font-terminal">
            Intelligence Operations Platform
          </p>
        </div>
        
        {/* Registration form */}
        <TerminalCard
          variant="glow"
          color="cyan"
          size="lg"
          className="w-full max-w-md"
          title="JOIN THE RESISTANCE"
          subtitle="Create your operative account"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <TerminalInput
              type="email"
              label="Email Address"
              placeholder="operative@lionspace.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              helper="Secure communication channel"
              icon={<Mail className="w-5 h-5" />}
              variant="outline"
              color="cyan"
              showCursor
              disabled={isLoading}
            />
            
            {/* Password field */}
            <TerminalInput
              type={showPassword ? 'text' : 'password'}
              label="Access Code"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              helper="Minimum 8 characters with alphanumeric combination"
              icon={<Lock className="w-5 h-5" />}
              variant="outline"
              color="cyan"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-cyan hover:text-terminal-cyan/80"
              style={{ marginTop: '-60px', marginRight: '-380px' }}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            
            {/* Confirm Password field */}
            <TerminalInput
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Access Code"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={<Lock className="w-5 h-5" />}
              variant="outline"
              color="cyan"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-cyan hover:text-terminal-cyan/80"
              style={{ marginTop: '-40px', marginRight: '-380px' }}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            
            {/* Terms and conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-terminal-cyan/30 bg-terminal-bg text-terminal-cyan focus:ring-terminal-cyan"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-terminal-text">
                I accept the{' '}
                <Link href="/terms" className="text-terminal-cyan hover:text-terminal-cyan/80 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-terminal-cyan hover:text-terminal-cyan/80 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            {/* Submit button */}
            <TerminalButton
              type="submit"
              variant="solid"
              color="cyan"
              size="lg"
              className="w-full"
              loading={isLoading}
              glow
              icon={<ChevronRight className="w-5 h-5" />}
              iconPosition="right"
            >
              {isLoading ? 'INITIALIZING...' : 'JOIN NOW - IT\'S FREE'}
            </TerminalButton>
            
            {/* Sign in link */}
            <div className="text-center">
              <p className="text-sm text-terminal-muted">
                Already an operative?{' '}
                <Link 
                  href="/login" 
                  className="text-terminal-cyan hover:text-terminal-cyan/80 font-medium"
                >
                  Sign in to your account
                </Link>
              </p>
            </div>
          </form>
        </TerminalCard>
        
        {/* Security badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-terminal-muted">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">256-bit encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Zero-knowledge proof</span>
          </div>
        </div>
      </div>
    </div>
  )
}