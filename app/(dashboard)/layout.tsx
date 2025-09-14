'use client'

import { ProtectedRoute } from '@/components/auth/AuthContext'
import { DashboardLayoutClient } from './layout-client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireVerified={false}>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </ProtectedRoute>
  )
}