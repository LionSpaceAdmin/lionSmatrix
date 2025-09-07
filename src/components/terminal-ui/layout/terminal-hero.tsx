'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { TerminalButton } from '../forms/terminal-button'
import type { ReactNode } from 'react'

/**
 * Terminal Hero Component
 * Based on TailwindUI hero patterns with terminal theme adaptations
 */

interface TerminalHeroProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
  description?: string | ReactNode
  primaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  variant?: 'centered' | 'split' | 'background' | 'command'
  showGrid?: boolean
  showScanline?: boolean
  className?: string
  children?: ReactNode
}

export function TerminalHero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  variant = 'centered',
  showGrid = true,
  showScanline = false,
  className,
  children
}: TerminalHeroProps) {
  const renderContent = () => {
    switch (variant) {
      case 'centered':
        return (
          <div className="mx-auto max-w-4xl text-center">
            {subtitle && (
              <p className="text-base font-semibold leading-7 text-terminal-gold uppercase tracking-wider font-terminal">
                {subtitle}
              </p>
            )}
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-terminal-cyan sm:text-6xl md:text-7xl font-terminal terminal-text-gradient">
              {title}
            </h1>
            {description && (
              <p className="mt-6 text-lg leading-8 text-terminal-text max-w-2xl mx-auto">
                {description}
              </p>
            )}
            {(primaryAction || secondaryAction) && (
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {primaryAction && (
                  <TerminalButton
                    variant="solid"
                    color="cyan"
                    size="lg"
                    glow
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </TerminalButton>
                )}
                {secondaryAction && (
                  <TerminalButton
                    variant="outline"
                    color="cyan"
                    size="lg"
                    onClick={secondaryAction.onClick}
                  >
                    {secondaryAction.label}
                  </TerminalButton>
                )}
              </div>
            )}
            {children}
          </div>
        )
      
      case 'split':
        return (
          <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-center">
            <div>
              {subtitle && (
                <p className="text-base font-semibold leading-7 text-terminal-gold uppercase tracking-wider font-terminal">
                  {subtitle}
                </p>
              )}
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-terminal-cyan sm:text-6xl font-terminal">
                {title}
              </h1>
              {description && (
                <p className="mt-6 text-lg leading-8 text-terminal-text">
                  {description}
                </p>
              )}
              {(primaryAction || secondaryAction) && (
                <div className="mt-10 flex items-center gap-x-6">
                  {primaryAction && (
                    <TerminalButton
                      variant="solid"
                      color="cyan"
                      size="lg"
                      glow
                      onClick={primaryAction.onClick}
                    >
                      {primaryAction.label}
                    </TerminalButton>
                  )}
                  {secondaryAction && (
                    <TerminalButton
                      variant="outline"
                      color="cyan"
                      size="lg"
                      onClick={secondaryAction.onClick}
                    >
                      {secondaryAction.label}
                    </TerminalButton>
                  )}
                </div>
              )}
            </div>
            <div className="mt-10 lg:mt-0">
              {children}
            </div>
          </div>
        )
      
      case 'command':
        return (
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border-2 border-terminal-cyan/30 bg-terminal-secondary/50 backdrop-blur-sm p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-terminal-red" />
                  <div className="w-3 h-3 rounded-full bg-terminal-gold" />
                  <div className="w-3 h-3 rounded-full bg-terminal-green" />
                </div>
                <span className="ml-4 text-sm text-terminal-muted font-terminal">terminal@lionspace:~$</span>
              </div>
              <div className="space-y-4">
                <div className="font-terminal">
                  <span className="text-terminal-gold">$ </span>
                  <span className="text-terminal-text">./initialize_system.sh</span>
                </div>
                <div className="pl-4">
                  {subtitle && (
                    <p className="text-sm text-terminal-gold uppercase tracking-wider font-terminal mb-2">
                      {subtitle}
                    </p>
                  )}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-terminal-cyan font-terminal mb-4">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-terminal-text">
                      {description}
                    </p>
                  )}
                </div>
                {(primaryAction || secondaryAction) && (
                  <div className="flex items-center gap-x-4 pl-4 pt-4">
                    {primaryAction && (
                      <TerminalButton
                        variant="glow"
                        color="cyan"
                        size="md"
                        onClick={primaryAction.onClick}
                      >
                        {primaryAction.label}
                      </TerminalButton>
                    )}
                    {secondaryAction && (
                      <TerminalButton
                        variant="ghost"
                        color="cyan"
                        size="md"
                        onClick={secondaryAction.onClick}
                      >
                        {secondaryAction.label}
                      </TerminalButton>
                    )}
                  </div>
                )}
              </div>
              {children && (
                <div className="mt-6 pt-6 border-t border-terminal-line">
                  {children}
                </div>
              )}
            </div>
          </div>
        )
      
      default:
        return (
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-terminal-cyan sm:text-6xl font-terminal">
              {title}
            </h1>
            {description && (
              <p className="mt-6 text-lg leading-8 text-terminal-text">
                {description}
              </p>
            )}
            {children}
          </div>
        )
    }
  }

  return (
    <div className={cn('relative isolate px-6 pt-14 lg:px-8', className)}>
      {/* Background grid effect */}
      {showGrid && (
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-terminal-cyan to-terminal-gold opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      )}
      
      {/* Scanline effect */}
      {showScanline && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-scanline animate-scan opacity-10" />
        </div>
      )}
      
      {/* Hero content */}
      <div className="mx-auto max-w-7xl py-32 sm:py-48 lg:py-56">
        {renderContent()}
      </div>
      
      {/* Bottom gradient */}
      {showGrid && (
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-terminal-cyan to-terminal-cyan opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      )}
    </div>
  )
}