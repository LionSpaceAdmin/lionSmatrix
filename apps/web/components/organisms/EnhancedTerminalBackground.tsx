"use client"

import React, { useState, useEffect } from "react"
import { AdvancedNetworkVisualization } from "./AdvancedNetworkVisualization"
import { MatrixDataFlow } from "./MatrixDataFlow"
import { Settings, Eye, EyeOff, Activity, Zap } from "lucide-react"

interface EnhancedTerminalBackgroundProps {
  className?: string
  enableControls?: boolean
  defaultMode?: "minimal" | "moderate" | "full" | "extreme"
  intensity?: "low" | "medium" | "high" | "extreme"
  mode?: "intelligence" | "defense" | "analysis" | "warfare"
  interactive?: boolean
}

export function EnhancedTerminalBackground({
  className = "",
  enableControls = false,
  defaultMode = "moderate",
  intensity,
  mode: propMode,
  interactive,
}: EnhancedTerminalBackgroundProps) {
  const [mode, setMode] = useState(defaultMode)
  const [showNetworkViz, setShowNetworkViz] = useState(true)
  const [showMatrixFlow, setShowMatrixFlow] = useState(true)
  const [networkMode, setNetworkMode] = useState<"intelligence" | "defense" | "analysis">(
    propMode && ["intelligence", "defense", "analysis"].includes(propMode)
      ? (propMode as "intelligence" | "defense" | "analysis")
      : "intelligence"
  )
  const [matrixMode, setMatrixMode] = useState<"intelligence" | "defense" | "analysis" | "warfare">(
    propMode || "intelligence"
  )
  const [controlsVisible, setControlsVisible] = useState(false)

  // Mode configurations
  const modeConfigs = {
    minimal: {
      networkDensity: "low" as const,
      matrixIntensity: "low" as const,
      showMatrix: false,
      showDataFlow: true,
      networkInteractive: false,
    },
    moderate: {
      networkDensity: "medium" as const,
      matrixIntensity: "medium" as const,
      showMatrix: true,
      showDataFlow: true,
      networkInteractive: false,
    },
    full: {
      networkDensity: "high" as const,
      matrixIntensity: "high" as const,
      showMatrix: true,
      showDataFlow: true,
      networkInteractive: true,
    },
    extreme: {
      networkDensity: "high" as const,
      matrixIntensity: "extreme" as const,
      showMatrix: true,
      showDataFlow: true,
      networkInteractive: true,
    },
  }

  const currentConfig = modeConfigs[mode]

  // Sync network and matrix modes
  useEffect(() => {
    if (networkMode !== matrixMode && matrixMode !== "warfare") {
      setMatrixMode(networkMode)
    }
  }, [networkMode, matrixMode])

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}>
      {/* Enhanced Terminal Grid */}
      <div className="terminal-grid" />

      {/* Network Visualization Layer */}
      {showNetworkViz && (
        <div className="absolute inset-0 opacity-80">
          <AdvancedNetworkVisualization
            density={currentConfig.networkDensity}
            mode={networkMode}
            showMatrix={false}
            showDataFlow={currentConfig.showDataFlow}
            interactive={currentConfig.networkInteractive}
          />
        </div>
      )}

      {/* Matrix Data Flow Layer */}
      {showMatrixFlow && (
        <div className="absolute inset-0 opacity-60">
          <MatrixDataFlow
            intensity={currentConfig.matrixIntensity}
            mode={matrixMode}
            showHorizontalStreams={currentConfig.showDataFlow}
            showVerticalMatrix={true}
            highlightThreats={mode === "extreme"}
          />
        </div>
      )}

      {/* Additional Visual Effects */}
      <div className="absolute inset-0">
        {/* Scanning Lines */}
        {mode !== "minimal" && (
          <>
            <div className="scanline" />
            {mode === "extreme" && <div className="scanline" style={{ animationDelay: "4s", opacity: 0.3 }} />}
          </>
        )}

        {/* Data Flow Lines */}
        {currentConfig.showDataFlow && (
          <>
            {[...Array(mode === "extreme" ? 8 : mode === "full" ? 5 : 3)].map((_, i) => (
              <div
                key={`data-flow-${i}`}
                className="data-flow-line animate-data-flow"
                style={{
                  top: `${20 + i * 15}%`,
                  left: "-100%",
                  width: "200%",
                  animationDelay: `${i * 1.5}s`,
                  // TODO(human): Fix hydration mismatch by using consistent animation duration
                  animationDuration: `${3 + ((i * 0.5) % 2)}s`, // Deterministic based on index
                }}
              />
            ))}

            {mode === "extreme" && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`data-flow-vertical-${i}`}
                    className="data-flow-vertical animate-data-flow-vertical"
                    style={{
                      left: `${30 + i * 25}%`,
                      top: "-100%",
                      height: "200%",
                      animationDelay: `${i * 2}s`,
                    }}
                  />
                ))}
              </>
            )}
          </>
        )}

        {/* Network Nodes */}
        {mode !== "minimal" && (
          <>
            {[...Array(mode === "extreme" ? 12 : mode === "full" ? 8 : 5)].map((_, i) => (
              <div
                key={`network-node-${i}`}
                className="network-node animate-node-pulse"
                style={{
                  // TODO(human): Fix hydration mismatch by using deterministic positioning
                  left: `${((i * 37) % 90) + 5}%`, // Deterministic pseudo-random based on index
                  top: `${((i * 53) % 90) + 5}%`, // Using prime numbers for distribution
                  animationDelay: `${(i * 0.3) % 2}s`, // Deterministic delay
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Control Panel */}
      {enableControls && (
        <div className="pointer-events-auto absolute right-4 top-4 z-50">
          <div className="relative">
            <button
              onClick={() => setControlsVisible(!controlsVisible)}
              className="terminal-button bg-terminal-bg/80 border-terminal-border/50 rounded border p-2 backdrop-blur-sm"
              aria-label="Toggle visualization controls"
            >
              <Settings className="text-terminal-cyan h-4 w-4" />
            </button>

            {controlsVisible && (
              <div className="bg-terminal-bg/90 border-terminal-border/50 absolute right-0 top-full mt-2 min-w-64 rounded border p-4 backdrop-blur-sm">
                <h3 className="text-terminal-cyan font-terminal mb-3 text-sm font-bold">VISUALIZATION CONTROLS</h3>

                {/* Mode Selection */}
                <div className="space-y-3">
                  <div>
                    <label className="text-terminal-text/70 font-terminal mb-1 block text-xs">INTENSITY MODE</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as typeof mode)}
                      className="bg-terminal-bg border-terminal-border/50 text-terminal-text font-terminal w-full rounded border p-2 text-xs"
                    >
                      <option value="minimal">MINIMAL</option>
                      <option value="moderate">MODERATE</option>
                      <option value="full">FULL</option>
                      <option value="extreme">EXTREME</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-terminal-text/70 font-terminal mb-1 block text-xs">NETWORK MODE</label>
                    <select
                      value={networkMode}
                      onChange={(e) => setNetworkMode(e.target.value as typeof networkMode)}
                      className="bg-terminal-bg border-terminal-border/50 text-terminal-text font-terminal w-full rounded border p-2 text-xs"
                    >
                      <option value="intelligence">INTELLIGENCE</option>
                      <option value="defense">DEFENSE</option>
                      <option value="analysis">ANALYSIS</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-terminal-text/70 font-terminal mb-1 block text-xs">MATRIX MODE</label>
                    <select
                      value={matrixMode}
                      onChange={(e) => setMatrixMode(e.target.value as typeof matrixMode)}
                      className="bg-terminal-bg border-terminal-border/50 text-terminal-text font-terminal w-full rounded border p-2 text-xs"
                    >
                      <option value="intelligence">INTELLIGENCE</option>
                      <option value="defense">DEFENSE</option>
                      <option value="analysis">ANALYSIS</option>
                      <option value="warfare">WARFARE</option>
                    </select>
                  </div>

                  {/* Layer Controls */}
                  <div className="border-terminal-border/30 space-y-2 border-t pt-2">
                    <button
                      onClick={() => setShowNetworkViz(!showNetworkViz)}
                      className="font-terminal text-terminal-text/70 hover:text-terminal-cyan flex w-full items-center gap-2 text-left text-xs"
                    >
                      {showNetworkViz ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      Network Visualization
                    </button>

                    <button
                      onClick={() => setShowMatrixFlow(!showMatrixFlow)}
                      className="font-terminal text-terminal-text/70 hover:text-terminal-cyan flex w-full items-center gap-2 text-left text-xs"
                    >
                      {showMatrixFlow ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      Matrix Data Flow
                    </button>
                  </div>

                  {/* Status */}
                  <div className="border-terminal-border/30 border-t pt-2">
                    <div className="font-terminal flex items-center gap-2 text-xs">
                      <Activity className="text-terminal-green h-3 w-3 animate-pulse" />
                      <span className="text-terminal-text/70">Status: {mode.toUpperCase()} MODE</span>
                    </div>
                    <div className="font-terminal mt-1 flex items-center gap-2 text-xs">
                      <Zap className="text-terminal-gold h-3 w-3" />
                      <span className="text-terminal-text/70">
                        Performance: {mode === "extreme" ? "HIGH" : mode === "full" ? "MEDIUM" : "LOW"} LOAD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Warning */}
      {mode === "extreme" && (
        <div className="bg-terminal-red/20 border-terminal-red/50 text-terminal-red font-terminal pointer-events-auto absolute bottom-4 left-4 rounded border p-2 text-xs">
          ⚠ EXTREME MODE: High performance impact
        </div>
      )}
    </div>
  )
}
