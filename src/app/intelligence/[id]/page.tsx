import { Suspense } from 'react'
import { getIntelligenceData } from '../../actions'

// ISR configuration - revalidate every 60 seconds
export const revalidate = 60

// Generate static params for dynamic routes (example)
export async function generateStaticParams() {
  return [
    { id: 'global' },
    { id: 'regional' },
    { id: 'local' }
  ]
}

async function IntelligenceDataDisplay() {
  const data = await getIntelligenceData()
  
  return (
    <div className="bg-terminal-bg border border-terminal-cyan p-6 rounded-lg">
      <h3 className="text-terminal-cyan text-xl font-bold mb-4">
        Real-time Intelligence Data
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-terminal-green">
            {data.threats}
          </div>
          <div className="text-terminal-text/70">Active Threats</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-terminal-yellow">
            {data.incidents}
          </div>
          <div className="text-terminal-text/70">Incidents</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-terminal-cyan">
            Last Updated
          </div>
          <div className="text-terminal-text">
            {new Date(data.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="bg-terminal-bg border border-terminal-cyan/30 p-6 rounded-lg animate-pulse">
      <div className="h-6 bg-terminal-cyan/20 rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <div className="h-8 bg-terminal-green/20 rounded"></div>
            <div className="h-4 bg-terminal-text/20 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ISRExamplePage() {
  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-terminal-cyan">
          ISR Example - Intelligence Dashboard
        </h1>
        <p className="text-terminal-text/70 mb-8">
          This page demonstrates Incremental Static Regeneration (ISR) with automatic 
          revalidation every 60 seconds and on-demand revalidation via Server Actions.
        </p>
        
        <Suspense fallback={<LoadingSkeleton />}>
          <IntelligenceDataDisplay />
        </Suspense>
        
        <div className="mt-8 text-sm text-terminal-text/50">
          <p>
            • This page is statically generated at build time
          </p>
          <p>
            • Data automatically refreshes every 60 seconds
          </p>
          <p>
            • Can be manually refreshed via Server Actions
          </p>
        </div>
      </div>
    </div>
  )
}