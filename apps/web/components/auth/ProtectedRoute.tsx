"use client"

import { useAuth, useRole } from "@/lib/auth/hooks"
import { hasPermission, Permission } from "@/lib/auth/rbac"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAll?: boolean // If true, user must have all permissions. If false, any permission is enough
  fallbackUrl?: string
  loadingComponent?: React.ReactNode
  unauthorizedComponent?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredPermissions = [],
  requireAll = true,
  fallbackUrl = '/auth/login',
  loadingComponent,
  unauthorizedComponent
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useAuth()
  const { role } = useRole()
  const router = useRouter()

  // Combine single permission with array of permissions
  const allPermissions = requiredPermission 
    ? [requiredPermission, ...requiredPermissions]
    : requiredPermissions

  // Check if user has required permissions
  const hasRequiredPermissions = () => {
    if (allPermissions.length === 0) return true // No permission required
    
    if (requireAll) {
      return allPermissions.every(permission => 
        hasPermission(role as any, permission)
      )
    } else {
      return allPermissions.some(permission => 
        hasPermission(role as any, permission)
      )
    }
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackUrl)
    }
  }, [isLoading, isAuthenticated, router, fallbackUrl])

  // Show loading state
  if (isLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  // User doesn't have required permissions
  if (!hasRequiredPermissions()) {
    return unauthorizedComponent || (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this resource.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // User is authenticated and has permissions
  return <>{children}</>
}

// HOC for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  permission?: Permission
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredPermission={permission}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}