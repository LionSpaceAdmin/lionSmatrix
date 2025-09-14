"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = useCallback(async (provider?: string, options?: any) => {
    try {
      const result = await signIn(provider, {
        redirect: false,
        ...options
      })
      
      if (result?.error) {
        throw new Error(result.error)
      }
      
      if (result?.ok) {
        router.push(options?.callbackUrl || '/dashboard')
      }
      
      return result
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }, [router])

  const logout = useCallback(async (callbackUrl?: string) => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: callbackUrl || '/'
      })
      router.push(callbackUrl || '/')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }, [router])

  return {
    user: session?.user,
    session,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    login,
    logout
  }
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login')
  }

  return { isAuthenticated, isLoading }
}

export function useRole() {
  const { user } = useAuth()
  
  return {
    role: user?.role || 'guest',
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator',
    isUser: user?.role === 'user',
    isGuest: !user
  }
}