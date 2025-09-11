'use client'

import { useState, useEffect } from 'react'
import { ErrorBoundary } from '@/components/monitoring/ErrorBoundary'
import { 
  useComponentMonitoring, 
  useInteractionTracking, 
  useApiMonitoring,
  usePerformanceBudget 
} from '@/lib/hooks/use-monitoring'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, AlertTriangle } from 'lucide-react'

// Example of a well-monitored component
function MonitoredComponentInner() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Monitoring hooks
  const { startRender, endRender } = useComponentMonitoring('MonitoredComponent')
  const { trackClick, trackCustomEvent } = useInteractionTracking()
  const { trackApiCall } = useApiMonitoring()
  const { checkBudget } = usePerformanceBudget()

  // Track component render performance
  useEffect(() => {
    startRender()
    return () => endRender()
  }, [startRender, endRender])

  // Check performance budget on mount
  useEffect(() => {
    checkBudget()
  }, [checkBudget])

  // Example API call with monitoring
  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await trackApiCall('fetch-example-data', async () => {
        const response = await fetch('/api/example-data')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response.json()
      })

      setData(result)
      trackCustomEvent('data-fetch-success', 'example-api')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      trackCustomEvent('data-fetch-error', 'example-api', { error: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  // Monitored click handler
  const handleButtonClick = () => {
    trackClick('fetch-data-button', { 
      timestamp: Date.now(),
      userAction: 'manual-fetch'
    })
    fetchData()
  }

  // Simulate error for testing
  const simulateError = () => {
    trackClick('simulate-error-button')
    throw new Error('This is a test error for monitoring')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Monitored Component Example
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This component demonstrates proper monitoring integration including:
        </p>
        
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Performance tracking</li>
          <li>• User interaction monitoring</li>
          <li>• API call monitoring</li>
          <li>• Error boundary protection</li>
          <li>• Bundle budget checking</li>
        </ul>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Error</span>
            </div>
            <p className="text-xs text-destructive/80 mt-1">{error}</p>
          </div>
        )}

        {data && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md dark:bg-green-950 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              Data loaded successfully! Check Sentry for performance metrics.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleButtonClick} 
            disabled={loading}
            size="sm"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </Button>
          
          <Button 
            onClick={simulateError} 
            variant="destructive" 
            size="sm"
          >
            Test Error
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Check your browser's Network tab and Sentry dashboard to see monitoring in action.</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Wrapped with error boundary
export default function MonitoredComponent() {
  return (
    <ErrorBoundary 
      name="MonitoredComponent" 
      level="component"
    >
      <MonitoredComponentInner />
    </ErrorBoundary>
  )
}

// Example usage in a page:
/*
import MonitoredComponent from '@/components/examples/MonitoredComponent'

export default function ExamplePage() {
  return (
    <ErrorBoundary name="ExamplePage" level="page">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Monitoring Example</h1>
        <MonitoredComponent />
      </div>
    </ErrorBoundary>
  )
}
*/