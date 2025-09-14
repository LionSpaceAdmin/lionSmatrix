'use client'

import { useState } from 'react'
import { Eye, EyeOff, Shield, Lock, User, Mail, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

// Components
import { EnhancedTerminalBackground } from '@/components/organisms/EnhancedTerminalBackground'

export default function JoinPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms of Service'
    }

    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = 'You must accept the Privacy Policy'
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
    
    try {
      // Mock registration - replace with actual auth logic
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Registration attempt:', formData)
      
      // Redirect to dashboard or login success page
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 2) return 'bg-red-500'
    if (strength < 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 2) return 'Weak'
    if (strength < 4) return 'Medium'
    return 'Strong'
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      {/* Enhanced Terminal Background */}
      <EnhancedTerminalBackground 
        intensity="low"
        mode="intelligence"
        className="fixed inset-0 z-0"
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-terminal-secondary/95 border border-terminal-border rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-terminal-cyan" />
              <h1 className="text-2xl font-bold font-mono text-terminal-cyan">
                LIONS OF ZION
              </h1>
            </div>
            <h2 className="text-xl font-bold font-mono text-terminal-text mb-2">
              JOIN THE FIGHT
            </h2>
            <p className="text-terminal-muted text-sm">
              Defend truth. Protect democracy. Secure the information battlefield.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="p-3 rounded bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-terminal-text font-mono text-sm mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded bg-terminal-bg border font-mono text-sm
                    ${errors.email ? 'border-red-500 text-red-400' : 'border-terminal-border text-terminal-text'}
                    focus:border-terminal-cyan focus:outline-none transition-colors`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.email}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-terminal-text font-mono text-sm mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded bg-terminal-bg border font-mono text-sm
                    ${errors.username ? 'border-red-500 text-red-400' : 'border-terminal-border text-terminal-text'}
                    focus:border-terminal-cyan focus:outline-none transition-colors`}
                  placeholder="your_username"
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-terminal-text font-mono text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded bg-terminal-bg border font-mono text-sm
                    ${errors.password ? 'border-red-500 text-red-400' : 'border-terminal-border text-terminal-text'}
                    focus:border-terminal-cyan focus:outline-none transition-colors`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-terminal-muted hover:text-terminal-text transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 bg-terminal-border rounded overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength(formData.password))}`}
                        style={{ width: `${(passwordStrength(formData.password) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-terminal-muted">
                      {getPasswordStrengthText(passwordStrength(formData.password))}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-terminal-text font-mono text-sm mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded bg-terminal-bg border font-mono text-sm
                    ${errors.confirmPassword ? 'border-red-500 text-red-400' : 'border-terminal-border text-terminal-text'}
                    focus:border-terminal-cyan focus:outline-none transition-colors`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-terminal-muted hover:text-terminal-text transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs font-mono mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Privacy */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 rounded border-terminal-border bg-terminal-bg 
                           checked:bg-terminal-cyan checked:border-terminal-cyan focus:ring-terminal-cyan"
                />
                <label htmlFor="acceptTerms" className="text-sm text-terminal-muted font-mono">
                  I accept the{' '}
                  <Link href="/legal/terms" className="text-terminal-cyan hover:underline">
                    Terms of Service
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-400 text-xs font-mono">{errors.acceptTerms}</p>
              )}
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="acceptPrivacy"
                  id="acceptPrivacy"
                  checked={formData.acceptPrivacy}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 rounded border-terminal-border bg-terminal-bg 
                           checked:bg-terminal-cyan checked:border-terminal-cyan focus:ring-terminal-cyan"
                />
                <label htmlFor="acceptPrivacy" className="text-sm text-terminal-muted font-mono">
                  I accept the{' '}
                  <Link href="/legal/privacy" className="text-terminal-cyan hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.acceptPrivacy && (
                <p className="text-red-400 text-xs font-mono">{errors.acceptPrivacy}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded font-mono font-bold text-sm
                       bg-terminal-cyan text-terminal-bg hover:bg-terminal-cyan/90
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-terminal-bg border-t-transparent rounded-full animate-spin" />
                  JOINING...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  JOIN THE LIONS
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-terminal-muted text-sm font-mono">
              Already a Lion?{' '}
              <Link href="/auth/login" className="text-terminal-cyan hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 rounded bg-terminal-border/20 border border-terminal-border">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-terminal-muted font-mono">
                <p className="font-bold text-green-400 mb-1">SECURE REGISTRATION</p>
                <p>Your data is encrypted and protected. We never share personal information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}