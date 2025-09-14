'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Shield, Github, Chrome, AlertCircle, CheckCircle, Loader2, ArrowRight } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [magicLinkSent, setMagicLinkSent] = useState(false)

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (authMethod === 'password' && !formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (authMethod === 'magic') {
        setMagicLinkSent(true)
      } else {
        // Mock successful login
        router.push('/dashboard')
      }
    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      // Mock social login
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/dashboard')
    } catch (error) {
      setErrors({ general: `${provider} login failed. Please try again.` })
    } finally {
      setIsLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <main className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
              <Mail className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold font-mono text-terminal-cyan mb-2">
              CHECK YOUR EMAIL
            </h1>
            <p className="text-terminal-muted">
              We've sent a magic link to<br />
              <span className="text-terminal-text font-mono">{formData.email}</span>
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-terminal-muted">
                Click the link in the email to sign in securely. The link expires in 15 minutes.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-terminal-cyan flex-shrink-0 mt-0.5" />
              <div className="text-sm text-terminal-muted">
                No password needed. Your email is your secure key.
              </div>
            </div>
            
            <div className="pt-4 border-t border-terminal-border">
              <p className="text-xs text-terminal-muted text-center">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setMagicLinkSent(false)
                    setAuthMethod('magic')
                  }}
                  className="text-cyan-400 hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Shield className="w-16 h-16 text-terminal-cyan mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold font-mono text-terminal-cyan mb-2">
            WELCOME BACK, LION
          </h1>
          <p className="text-terminal-muted">
            Sign in to continue defending truth
          </p>
        </div>

        {/* Auth Method Toggle */}
        <div className="flex rounded-lg bg-terminal-secondary border border-terminal-border p-1 mb-6">
          <button
            onClick={() => setAuthMethod('password')}
            className={`flex-1 py-2 px-4 rounded font-mono text-sm transition-all ${
              authMethod === 'password'
                ? 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan'
                : 'text-terminal-muted hover:text-terminal-text'
            }`}
          >
            PASSWORD
          </button>
          <button
            onClick={() => setAuthMethod('magic')}
            className={`flex-1 py-2 px-4 rounded font-mono text-sm transition-all ${
              authMethod === 'magic'
                ? 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan'
                : 'text-terminal-muted hover:text-terminal-text'
            }`}
          >
            MAGIC LINK
          </button>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Password Field (only for password method) */}
          {authMethod === 'password' && (
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
                  placeholder="••••••••"
                  autoComplete="current-password"
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
          )}

          {/* Remember Me & Forgot Password */}
          {authMethod === 'password' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 bg-terminal-secondary border border-terminal-border rounded 
                           text-terminal-cyan focus:ring-terminal-cyan"
                />
                <span className="text-sm text-terminal-muted">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          )}

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
                AUTHENTICATING...
              </>
            ) : authMethod === 'magic' ? (
              <>
                SEND MAGIC LINK
                <Mail className="w-5 h-5" />
              </>
            ) : (
              <>
                SIGN IN
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
            <span className="px-4 bg-terminal-bg text-terminal-muted">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialLogin('GitHub')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg 
                     bg-terminal-secondary border border-terminal-border text-terminal-text 
                     hover:border-terminal-cyan transition-colors disabled:opacity-50"
          >
            <Github className="w-5 h-5" />
            <span className="font-mono text-sm">GitHub</span>
          </button>
          <button
            onClick={() => handleSocialLogin('Google')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg 
                     bg-terminal-secondary border border-terminal-border text-terminal-text 
                     hover:border-terminal-cyan transition-colors disabled:opacity-50"
          >
            <Chrome className="w-5 h-5" />
            <span className="font-mono text-sm">Google</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-terminal-muted mt-6">
          New to the fight?{' '}
          <Link href="/auth/join" className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors">
            JOIN THE LIONS
          </Link>
        </p>

        {/* Security Notice */}
        <div className="mt-8 p-4 rounded-lg bg-terminal-secondary/50 border border-terminal-border">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-terminal-cyan flex-shrink-0 mt-0.5" />
            <p className="text-xs text-terminal-muted">
              Your connection is encrypted and secure. We never store passwords in plain text 
              and support 2FA for enhanced security.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
