'use client'

import { useState, useEffect } from 'react'
import { getWebVitalsMetrics } from '@/lib/web-vitals'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  Clock, 
  Zap, 
  Eye, 
  Server, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react'

interface WebVitalsMetrics {
  cls: number | null
  lcp: number | null
  fid: number | null
  fcp: number | null
  ttfb: number | null
  inp: number | null
}

interface PerformanceMetrics {
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  navigation?: PerformanceNavigationTiming
  resources?: PerformanceResourceTiming[]
}

export default function PerformanceDashboard() {
  const [webVitals, setWebVitals] = useState<WebVitalsMetrics>({
    cls: null,
    lcp: null,
    fid: null,
    fcp: null,
    ttfb: null,
    inp: null,
  })
  
  const [perfMetrics, setPerfMetrics] = useState<PerformanceMetrics>({})
  const [isLoading, setIsLoading] = useState(true)

  const refreshMetrics = async () => {
    setIsLoading(true)
    try {
      // Get Web Vitals
      const vitals = await getWebVitalsMetrics()
      setWebVitals(vitals)

      // Get performance metrics
      if (typeof window !== 'undefined') {
        const metrics: PerformanceMetrics = {}
        
        // Memory usage
        if ('memory' in performance) {
          metrics.memory = (performance as any).memory
        }
        
        // Navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          metrics.navigation = navigation
        }
        
        // Resource timing
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
        metrics.resources = resources.filter(r => !r.name.includes('extension'))
        
        setPerfMetrics(metrics)
      }
    } catch (error) {
      console.error('Error refreshing metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshMetrics()
    
    // Refresh every 30 seconds
    const interval = setInterval(refreshMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const getVitalStatus = (value: number | null, thresholds: [number, number]): {
    status: 'good' | 'needs-improvement' | 'poor' | 'unknown'
    color: string
  } => {
    if (value === null) return { status: 'unknown', color: 'text-muted-foreground' }
    
    if (value <= thresholds[0]) return { status: 'good', color: 'text-green-600' }
    if (value <= thresholds[1]) return { status: 'needs-improvement', color: 'text-yellow-600' }
    return { status: 'poor', color: 'text-red-600' }
  }

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const clsStatus = getVitalStatus(webVitals.cls, [0.1, 0.25])
  const lcpStatus = getVitalStatus(webVitals.lcp, [2500, 4000])
  const fidStatus = getVitalStatus(webVitals.fid, [100, 300])
  const inpStatus = getVitalStatus(webVitals.inp, [200, 500])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Performance Dashboard</h2>
          <p className="text-muted-foreground">Monitor your application's performance metrics</p>
        </div>
        <Button onClick={refreshMetrics} disabled={isLoading} size="sm" variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* LCP */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LCP</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {webVitals.lcp ? `${Math.round(webVitals.lcp)}ms` : '--'}
                </div>
                <Badge variant={lcpStatus.status === 'good' ? 'default' : 'destructive'} className="mt-1">
                  {lcpStatus.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Largest Contentful Paint
                </p>
              </CardContent>
            </Card>

            {/* CLS */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CLS</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {webVitals.cls ? webVitals.cls.toFixed(3) : '--'}
                </div>
                <Badge variant={clsStatus.status === 'good' ? 'default' : 'destructive'} className="mt-1">
                  {clsStatus.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Cumulative Layout Shift
                </p>
              </CardContent>
            </Card>

            {/* FID */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">FID</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {webVitals.fid ? `${Math.round(webVitals.fid)}ms` : '--'}
                </div>
                <Badge variant={fidStatus.status === 'good' ? 'default' : 'destructive'} className="mt-1">
                  {fidStatus.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  First Input Delay
                </p>
              </CardContent>
            </Card>

            {/* INP */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">INP</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {webVitals.inp ? `${Math.round(webVitals.inp)}ms` : '--'}
                </div>
                <Badge variant={inpStatus.status === 'good' ? 'default' : 'destructive'} className="mt-1">
                  {inpStatus.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Interaction to Next Paint
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Memory Usage */}
            {perfMetrics.memory && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Used JS Heap</span>
                      <span>{formatBytes(perfMetrics.memory.usedJSHeapSize)}</span>
                    </div>
                    <Progress 
                      value={(perfMetrics.memory.usedJSHeapSize / perfMetrics.memory.jsHeapSizeLimit) * 100} 
                      className="mt-1"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total: {formatBytes(perfMetrics.memory.totalJSHeapSize)} / 
                    Limit: {formatBytes(perfMetrics.memory.jsHeapSizeLimit)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Timing */}
            {perfMetrics.navigation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Page Load Timing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>TTFB</span>
                    <span>{Math.round(perfMetrics.navigation.responseStart - perfMetrics.navigation.requestStart)}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>DOM Content Loaded</span>
                    <span>{Math.round(perfMetrics.navigation.domContentLoadedEventEnd - perfMetrics.navigation.navigationStart)}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Load Complete</span>
                    <span>{Math.round(perfMetrics.navigation.loadEventEnd - perfMetrics.navigation.navigationStart)}ms</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Resource Loading</CardTitle>
              <CardDescription>
                Performance metrics for loaded resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              {perfMetrics.resources && (
                <div className="space-y-2">
                  {perfMetrics.resources
                    .filter(r => r.duration > 100) // Only show resources that took >100ms
                    .sort((a, b) => b.duration - a.duration)
                    .slice(0, 10)
                    .map((resource, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex-1 truncate">
                          <span className="font-medium">
                            {resource.name.split('/').pop() || resource.name}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {resource.transferSize ? formatBytes(resource.transferSize) : 'unknown size'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{Math.round(resource.duration)}ms</span>
                          {resource.duration > 1000 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}