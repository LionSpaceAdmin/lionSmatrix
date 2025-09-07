'use client'

import { NavigationHeader } from '@/components/terminal-ui/layout/navigation-header'

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavigationHeader />
      <main className="pt-16">
        {children}
      </main>
    </>
  )
}