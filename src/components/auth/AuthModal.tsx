'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleAuth = async (provider: string) => {
    setIsLoading(true)
    
    // Simulate authentication process
    setTimeout(() => {
      console.log(`Authenticating with ${provider}`)
      setIsLoading(false)
      onSuccess?.()
      onClose()
    }, 1500)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-terminal-bg/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-terminal-secondary border-2 border-terminal-cyan rounded-lg shadow-terminal">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-terminal-muted hover:text-terminal-cyan transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Header */}
          <div className="p-6 pb-0">
            <h2 className="text-2xl font-bold text-terminal-cyan mb-2">
              ACCESS AUTHORIZATION
            </h2>
            <p className="text-terminal-muted text-sm">
              Select authentication method to access the platform
            </p>
          </div>
          
          {/* Auth providers */}
          <div className="p-6 space-y-3">
            {/* Google */}
            <button
              onClick={() => handleAuth('google')}
              disabled={isLoading}
              className="w-full p-4 bg-terminal-bg border-2 border-terminal-border hover:border-terminal-cyan rounded-lg transition-all group flex items-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-terminal-text group-hover:text-terminal-cyan transition-colors">
                Continue with Google
              </span>
            </button>
            
            {/* Apple */}
            <button
              onClick={() => handleAuth('apple')}
              disabled={isLoading}
              className="w-full p-4 bg-terminal-bg border-2 border-terminal-border hover:border-terminal-cyan rounded-lg transition-all group flex items-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.36-1.09-.55-2.08-.56-3.24 0-1.44.68-2.2.53-3.06-.36C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.13zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-terminal-text group-hover:text-terminal-cyan transition-colors">
                Continue with Apple
              </span>
            </button>
            
            {/* X/Twitter */}
            <button
              onClick={() => handleAuth('twitter')}
              disabled={isLoading}
              className="w-full p-4 bg-terminal-bg border-2 border-terminal-border hover:border-terminal-cyan rounded-lg transition-all group flex items-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-terminal-text group-hover:text-terminal-cyan transition-colors">
                Continue with X
              </span>
            </button>
          </div>
          
          {/* Footer */}
          <div className="p-6 pt-0">
            <p className="text-xs text-terminal-muted text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
          
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-terminal-bg/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="text-terminal-cyan">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terminal-cyan"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AuthModal