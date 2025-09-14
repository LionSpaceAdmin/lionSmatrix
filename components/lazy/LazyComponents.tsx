"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Loading components for different types
const CanvasLoader = () => (
  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#0B1220] via-[#1a2332] to-[#0B1220]">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="font-mono text-sm text-cyan-400">Loading Canvas...</div>
    </div>
  </div>
)

const NetworkLoader = () => (
  <div className="flex h-96 items-center justify-center rounded-lg border border-cyan-400/20 bg-[#0a0f1a] p-4">
    <div className="animate-pulse font-mono text-sm text-cyan-400">Initializing Network...</div>
  </div>
)

const ChartLoader = () => (
  <div className="flex h-64 items-center justify-center rounded-lg border border-cyan-400/20 bg-[#0a0f1a] p-4">
    <div className="animate-pulse font-mono text-sm text-cyan-400">Loading Analytics...</div>
  </div>
)

const TerminalLoader = () => (
  <div className="m-4 rounded-lg border border-cyan-400/20 bg-[#0a0f1a] p-4">
    <div className="mb-2 font-mono text-sm text-cyan-400">$ Initializing Terminal...</div>
    <div className="h-4 w-4 animate-pulse bg-cyan-400"></div>
  </div>
)

const EvidenceLoader = () => (
  <div className="space-y-3 p-4">
    <div className="animate-pulse font-mono text-sm text-cyan-400">Loading Evidence Archive...</div>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg border border-cyan-400/20 bg-[#0a0f1a]"></div>
      ))}
    </div>
  </div>
)

// Lazy loaded components with dynamic imports
export const LazyNetworkVisualizer = dynamic(
  () => import("@/components/organisms/NetworkVisualization").then((mod) => ({ default: mod.NetworkVisualization })),
  {
    loading: NetworkLoader,
    ssr: false,
  }
)

export const LazyEvidenceList = dynamic(
  () => import("@/components/shared/EvidenceList").then((mod) => ({ default: mod.EvidenceList })),
  {
    loading: EvidenceLoader,
    ssr: false,
  }
)

// Terminal components
export const LazyAITerminal = dynamic(
  () => import("@/components/organisms/EnhancedTerminalBackground").then((mod) => ({ default: mod.EnhancedTerminalBackground })),
  {
    loading: TerminalLoader,
    ssr: false,
  }
)

// Canvas components - these are heavy WebGL/Canvas components
export const LazyCodeVeilCanvas = dynamic(
  () => import("@/components/organisms/MatrixDataFlow").then((mod) => ({ default: mod.MatrixDataFlow })),
  {
    loading: CanvasLoader,
    ssr: false,
  }
)

export const LazyNeuralNetworkCanvas = dynamic(
  () => import("@/components/organisms/AdvancedNetworkVisualization").then((mod) => ({ default: mod.AdvancedNetworkVisualization })),
  {
    loading: CanvasLoader,
    ssr: false,
  }
)

// Chart components - these typically include heavy charting libraries
export const LazyAnalyticsChart = dynamic(
  () => import("@/components/charts/ImpactChart").then((mod) => ({ default: mod.ImpactChart })),
  {
    loading: ChartLoader,
    ssr: false,
  }
)

export const LazyThreatChart = dynamic(
  () => import("@/components/charts/ImpactChart").then((mod) => ({ default: mod.ImpactChart })),
  {
    loading: ChartLoader,
    ssr: false,
  }
)

// Dashboard components
export const LazyDashboard = dynamic(
  () => import("@/components/organisms/IntelligenceMatrix").then((mod) => ({ default: mod.IntelligenceMatrix })),
  {
    loading: () => (
      <div className="space-y-4 p-6">
        <div className="h-8 animate-pulse rounded border border-cyan-400/20 bg-[#0a0f1a]"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border border-cyan-400/20 bg-[#0a0f1a]"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
)

// Heavy Tab Components for Command Center
export const LazyOSINTArchive = dynamic(
  () => import("@/components/organisms/IntelligenceMatrix").then((mod) => ({ default: mod.IntelligenceMatrix })),
  {
    loading: () => (
      <div className="space-y-4 p-6">
        <div className="animate-pulse font-mono text-sm text-cyan-400">Loading OSINT Archive...</div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg border border-cyan-400/20 bg-[#0a0f1a]"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
)

export const LazyThreatIntelligence = dynamic(
  () => import("@/components/organisms/IntelligenceMatrix").then((mod) => ({ default: mod.IntelligenceMatrix })),
  {
    loading: ChartLoader,
    ssr: false,
  }
)

export const LazyCampaignManager = dynamic(
  () => import("@/components/organisms/IntelligenceMatrix").then((mod) => ({ default: mod.IntelligenceMatrix })),
  {
    loading: () => (
      <div className="space-y-4 p-6">
        <div className="animate-pulse font-mono text-sm text-cyan-400">Loading Campaign Manager...</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg border border-cyan-400/20 bg-[#0a0f1a]"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
)

export const LazyAdvancedAnalytics = dynamic(
  () => import("@/components/organisms/IntelligenceMatrix").then((mod) => ({ default: mod.IntelligenceMatrix })),
  {
    loading: ChartLoader,
    ssr: false,
  }
)

// Wrapper component with Suspense for easier usage
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LazyWrapper({ children, fallback }: LazyWrapperProps) {
  return <Suspense fallback={fallback || <div className="animate-pulse">Loading...</div>}>{children}</Suspense>
}

// Re-export progressive enhancement hooks
export {
  PerformanceWrapper,
  useIdleCallback,
  useIntersectionObserver,
  useProgressiveEnhancement,
} from "../hooks/useProgressiveEnhancement"

// Legacy hook for backward compatibility
export const useProgressiveAnimation = (isVisible: boolean = true) => {
  // Only enable animations if user prefers motion and device can handle it
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const shouldAnimate = isVisible && !prefersReducedMotion

  return {
    shouldAnimate,
    animationClass: shouldAnimate ? "animate-in" : "",
    transitionStyle: shouldAnimate ? { transition: "all 0.3s ease" } : {},
  }
}
