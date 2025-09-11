'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  verified: boolean
  preferences: {
    locale: string
    theme: 'dark' | 'light'
    notifications: boolean
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for development
const MOCK_USER: User = {
  id: 'user-123',
  email: 'lion@lionspace.ai',
  name: 'Test Lion',
  role: 'user',
  verified: true,
  preferences: {
    locale: 'en',
    theme: 'dark',
    notifications: true
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for mock auth
        const savedAuth = localStorage.getItem('lionspace_auth')
        if (savedAuth) {
          const userData = JSON.parse(savedAuth)
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo: any email/password works
    const userData = {
      ...MOCK_USER,
      email,
      name: email.split('@')[0]
    }
    
    setUser(userData)
    localStorage.setItem('lionspace_auth', JSON.stringify(userData))
    setIsLoading(false)
    
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const logout = async () => {
    setIsLoading(true)
    
    // Mock logout
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUser(null)
    localStorage.removeItem('lionspace_auth')
    setIsLoading(false)
    
    // Redirect to home
    router.push('/')
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const userData = {
      ...MOCK_USER,
      id: `user-${Date.now()}`,
      email,
      name,
      verified: false
    }
    
    setUser(userData)
    localStorage.setItem('lionspace_auth', JSON.stringify(userData))
    setIsLoading(false)
    
    // Redirect to onboarding
    router.push('/auth/onboarding')
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('lionspace_auth', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected Route Wrapper Component
export function ProtectedRoute({ 
  children,
  requiredRole,
  requireVerified = false
}: { 
  children: ReactNode
  requiredRole?: 'user' | 'admin' | 'moderator'
  requireVerified?: boolean
}) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (!isAuthenticated) {
        router.push('/auth/sign-in')
        return
      }

      // Role check
      if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      // Verification check
      if (requireVerified && !user?.verified) {
        router.push('/auth/verify')
        return
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, requireVerified, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terminal-cyan border-t-transparent 
                        rounded-full animate-spin mx-auto mb-4" />
          <p className="text-terminal-cyan font-mono">AUTHENTICATING...</p>
        </div>
      </div>
    )
  }

  // Not authorized
  if (!isAuthenticated || 
      (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') ||
      (requireVerified && !user?.verified)) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-mono mb-4">ACCESS DENIED</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 rounded bg-terminal-secondary border border-terminal-border 
                     text-terminal-cyan font-mono hover:border-terminal-cyan transition-colors"
          >
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    )
  }

  // Authorized
  return <>{children}</>
}

// HOC for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRole?: 'user' | 'admin' | 'moderator'
    requireVerified?: boolean
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
