'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import * as Sentry from '@sentry/nextjs'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  level?: 'page' | 'component'
  name?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  eventId?: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { level = 'component', name } = this.props
    
    // Capture the error with Sentry
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
          errorBoundary: name || `${level}-boundary`,
        },
      },
      tags: {
        errorBoundary: true,
        level,
        component: name || 'unknown',
      },
    })

    this.setState({
      error,
      errorInfo,
      eventId,
    })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error)
      console.error('Component stack:', errorInfo.componentStack)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, eventId: undefined })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { level = 'component', name } = this.props
      const isPageLevel = level === 'page'

      return (
        <div className={`flex flex-col items-center justify-center p-8 ${
          isPageLevel ? 'min-h-screen bg-background' : 'min-h-[200px] border border-destructive/20 rounded-lg bg-destructive/5'
        }`}>
          <div className="text-center max-w-md">
            <div className={`mx-auto ${isPageLevel ? 'h-16 w-16' : 'h-12 w-12'} mb-4`}>
              <AlertTriangle className={`${isPageLevel ? 'h-16 w-16' : 'h-12 w-12'} text-destructive`} />
            </div>
            
            <h2 className={`${isPageLevel ? 'text-2xl' : 'text-lg'} font-semibold text-foreground mb-2`}>
              {isPageLevel ? 'Something went wrong' : 'Component Error'}
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {isPageLevel 
                ? 'We encountered an unexpected error. Our team has been notified and is working on a fix.'
                : `An error occurred in the ${name || 'component'}. Please try again.`
              }
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-destructive mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-40">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="outline"
                size={isPageLevel ? 'default' : 'sm'}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              {isPageLevel && (
                <>
                  <Button
                    onClick={this.handleReload}
                    variant="outline"
                    size="default"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload Page
                  </Button>
                  
                  <Button
                    onClick={this.handleGoHome}
                    variant="default"
                    size="default"
                    className="gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </>
              )}
            </div>

            {this.state.eventId && (
              <p className="text-xs text-muted-foreground mt-4">
                Error ID: {this.state.eventId}
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    name?: string
    level?: 'page' | 'component'
    fallback?: ReactNode
  }
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary 
      name={options?.name || Component.displayName || Component.name}
      level={options?.level}
      fallback={options?.fallback}
    >
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}