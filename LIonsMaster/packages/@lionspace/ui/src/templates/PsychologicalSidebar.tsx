"use client"

import { AnimatePresence, motion, useAnimation } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

// 🧠 Advanced Psychological Sidebar with Complete Design System
// Implements: Progressive Disclosure, Cognitive Load Management, Trust Building, Stress Reduction

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  userProfile?: {
    name: string
    role: string
    trustScore: number
    stressLevel: number
    preferredComplexity: "minimal" | "balanced" | "detailed"
  }
}

interface NavigationSection {
  id: string
  title: string
  icon: React.ReactNode
  items: NavigationItem[]
  priority: "primary" | "secondary" | "tertiary"
  cognitiveWeight: number
  accessLevel: "public" | "authenticated" | "admin"
}

interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: React.ReactNode
  description?: string
  badge?: {
    text: string
    type: "info" | "warning" | "success" | "alert"
    pulse?: boolean
  }
  subItems?: NavigationItem[]
  metadata?: {
    lastVisited?: Date
    visitCount?: number
    averageTimeSpent?: number
    userSatisfaction?: number
  }
}

export function PsychologicalSidebar({ isOpen, onClose, userProfile }: SidebarProps) {
  const pathname = usePathname()
  const controls = useAnimation()

  // Psychological State Management
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["primary"]))
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [focusMode, setFocusMode] = useState(false)
  const [breathingMode, setBreathingMode] = useState(false)
  const [userJourneyPhase, setUserJourneyPhase] = useState<"discovery" | "learning" | "working" | "mastery">(
    "discovery"
  )

  // Adaptive UI State
  const [adaptiveComplexity, setAdaptiveComplexity] = useState(userProfile?.preferredComplexity || "balanced")
  const [colorScheme, setColorScheme] = useState<"calm" | "focus" | "energize">("calm")

  // Performance Tracking
  const [interactionMetrics, setInteractionMetrics] = useState({
    clicks: 0,
    hovers: 0,
    timeOpen: 0,
    sectionsExplored: new Set<string>(),
  })

  // 🎨 Psychological Color Schemes
  const colorSchemes = {
    calm: {
      primary: "rgb(var(--terminal-cyan))", // mapped to calming cyan token
      secondary: "rgb(var(--terminal-muted))",
      accent: "rgb(var(--terminal-gold))", // reuse gold as subtle accent for now
      background: "linear-gradient(180deg, rgb(var(--terminal-secondary)) 0%, rgb(var(--terminal-border)) 100%)",
      hover: "rgba(var(--terminal-cyan), 0.1)",
    },
    focus: {
      primary: "#818cf8", // Purple - concentration
      secondary: "#64748b", // Dark gray - minimal distraction
      accent: "#fbbf24", // Yellow - attention
      background: "linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%)",
      hover: "rgba(129, 140, 248, 0.1)",
    },
    energize: {
      primary: "#fb923c", // Orange - energy
      secondary: "#f87171", // Red - action
      accent: "#34d399", // Green - positive
      background: "linear-gradient(180deg, #1a0f0f 0%, #2d1810 100%)",
      hover: "rgba(251, 146, 60, 0.1)",
    },
  }

  // 📊 Navigation Structure with Psychological Metadata
  const navigationSections: NavigationSection[] = [
    {
      id: "primary",
      title: "CORE OPERATIONS",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      priority: "primary",
      cognitiveWeight: 3,
      accessLevel: "public",
      items: [
        {
          id: "dashboard",
          label: "Command Center",
          href: "/app/dashboard",
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          ),
          description: "Central command and control interface",
          badge: { text: "LIVE", type: "success", pulse: true },
          metadata: {
            visitCount: 45,
            averageTimeSpent: 300,
            userSatisfaction: 4.5,
          },
        },
        {
          id: "analytics",
          label: "Intelligence Analytics",
          href: "/app/analytics",
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
          description: "Advanced data analysis and insights",
          subItems: [
            {
              id: "real-time",
              label: "Real-Time Feed",
              href: "/app/analytics/real-time",
            },
            {
              id: "historical",
              label: "Historical Analysis",
              href: "/app/analytics/historical",
            },
          ],
        },
      ],
    },
    {
      id: "cognitive",
      title: "COGNITIVE SYSTEMS",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      priority: "secondary",
      cognitiveWeight: 7,
      accessLevel: "authenticated",
      items: [
        {
          id: "cognitive-warfare",
          label: "Cognitive Warfare",
          href: "/app/cognitive-warfare",
          description: "Information warfare and psychological operations",
          badge: { text: "ADV", type: "warning" },
        },
        {
          id: "threat-matrix",
          label: "Threat Matrix",
          href: "/app/matrix",
          description: "Multi-dimensional threat assessment",
        },
      ],
    },
    {
      id: "support",
      title: "SUPPORT & SETTINGS",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      priority: "tertiary",
      cognitiveWeight: 4,
      accessLevel: "public",
      items: [
        {
          id: "settings",
          label: "System Settings",
          href: "/app/settings",
          description: "Configure your experience",
        },
        {
          id: "help",
          label: "Help Center",
          href: "/app/help",
          description: "Guides and documentation",
          badge: { text: "NEW", type: "info" },
        },
      ],
    },
  ]

  // 🧠 Adaptive Complexity Filtering
  const getFilteredSections = () => {
    const maxWeight = adaptiveComplexity === "minimal" ? 4 : adaptiveComplexity === "balanced" ? 7 : 10

    return navigationSections.filter((section) => section.cognitiveWeight <= maxWeight)
  }

  // 🎯 Progressive Disclosure Handler
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })

    // Track exploration
    setInteractionMetrics((prev) => ({
      ...prev,
      sectionsExplored: new Set([...prev.sectionsExplored, sectionId]),
    }))
  }

  // 🌬️ Breathing Exercise Component
  const BreathingGuide = () => {
    const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
    const [breathCount, setBreathCount] = useState(0)

    useEffect(() => {
      if (!breathingMode) return

      const phases = [
        { phase: "inhale", duration: 4000 },
        { phase: "hold", duration: 4000 },
        { phase: "exhale", duration: 4000 },
      ]

      let currentPhaseIndex = 0
      const cycleBreathing = () => {
        const currentPhase = phases[currentPhaseIndex]
        if (!currentPhase) return
        setBreathPhase(currentPhase.phase as any)

        setTimeout(() => {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
          if (currentPhaseIndex === 0) {
            setBreathCount((prev) => prev + 1)
          }
          cycleBreathing()
        }, currentPhase.duration)
      }

      cycleBreathing()
    }, [breathingMode])

    if (!breathingMode) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="breathing-guide"
      >
        <div className="breath-circle">
          <motion.div
            className="breath-indicator"
            animate={{
              scale: breathPhase === "inhale" ? 1.3 : breathPhase === "hold" ? 1.3 : 1,
              backgroundColor: breathPhase === "inhale" ? "#34d399" : breathPhase === "hold" ? "#60a5fa" : "#f87171",
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
          />
          <span className="breath-text">{breathPhase}</span>
        </div>
        <div className="breath-count">Cycles: {breathCount}</div>
      </motion.div>
    )
  }

  // 📊 User Journey Progress
  const JourneyProgress = () => {
    const phases = ["discovery", "learning", "working", "mastery"]
    const currentIndex = phases.indexOf(userJourneyPhase)

    return (
      <div className="journey-progress">
        <div className="journey-header">
          <span className="journey-title">Your Journey</span>
          <span className="journey-phase">{userJourneyPhase}</span>
        </div>
        <div className="journey-track">
          {phases.map((phase, index) => (
            <motion.div
              key={phase}
              className={`journey-node ${index <= currentIndex ? "completed" : ""}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="node-dot" />
              <span className="node-label">{phase}</span>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // 🎨 Render Navigation Item with Psychology
  const NavigationItemComponent: React.FC<{
    item: NavigationItem
    depth?: number
    sectionPriority?: "primary" | "secondary" | "tertiary"
  }> = ({ item, depth = 0, sectionPriority = "secondary" }) => {
    const isActive = pathname === item.href
    const hasSubItems = item.subItems && item.subItems.length > 0
    const [isExpanded, setIsExpanded] = useState(false)
    const itemRef = useRef<HTMLDivElement>(null)

    // Calculate psychological indicators
    const trustIndicator = item.metadata?.userSatisfaction
      ? item.metadata.userSatisfaction > 4
        ? "high"
        : item.metadata.userSatisfaction > 3
        ? "medium"
        : "low"
      : "medium"

    const frequencyIndicator = item.metadata?.visitCount
      ? item.metadata.visitCount > 20
        ? "frequent"
        : item.metadata.visitCount > 5
        ? "regular"
        : "rare"
      : "new"

    return (
      <motion.div
        ref={itemRef}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: depth * 0.05 }}
        className="nav-item-container"
      >
        <Link
          href={item.href}
          className={`nav-item depth-${depth} priority-${sectionPriority} trust-${trustIndicator} frequency-${frequencyIndicator} ${
            isActive ? "active" : ""
          } ${hoveredItem === item.id ? "hovered" : ""} ${focusMode && !isActive ? "dimmed" : ""} `}
          style={{
            paddingLeft: `${16 + depth * 16}px`,
            backgroundColor: isActive
              ? colorSchemes[colorScheme].hover
              : hoveredItem === item.id
              ? `${colorSchemes[colorScheme].hover}50`
              : "transparent",
          }}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => {
            setInteractionMetrics((prev) => ({
              ...prev,
              clicks: prev.clicks + 1,
            }))
          }}
        >
          {/* Visual Trust Indicator */}
          <motion.div
            className="trust-bar"
            initial={{ width: 0 }}
            animate={{ width: isActive ? "100%" : "3px" }}
            style={{
              backgroundColor:
                trustIndicator === "high" ? "#22c55e" : trustIndicator === "medium" ? "#60a5fa" : "#fbbf24",
            }}
          />

          {/* Icon with Animation */}
          {item.icon && (
            <motion.div
              className="nav-icon"
              animate={{
                rotate: isActive ? [0, 360] : 0,
                scale: hoveredItem === item.id ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {item.icon}
            </motion.div>
          )}

          {/* Label with Metadata */}
          <div className="nav-content">
            <span className="nav-label">{item.label}</span>
            {item.metadata?.visitCount && item.metadata.visitCount > 10 && (
              <span className="visit-indicator">•{item.metadata.visitCount}</span>
            )}
          </div>

          {/* Badge with Pulse */}
          {item.badge && (
            <motion.div
              className={`nav-badge badge-${item.badge.type}`}
              animate={
                item.badge.pulse
                  ? {
                      scale: [1, 1.1, 1],
                      opacity: [1, 0.8, 1],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              {item.badge.text}
            </motion.div>
          )}

          {/* Expand/Collapse Button */}
          {hasSubItems && (
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsExpanded(!isExpanded)
              }}
              className="expand-btn"
            >
              <motion.svg
                className="h-3 w-3"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
          )}
        </Link>

        {/* Description Tooltip */}
        <AnimatePresence>
          {hoveredItem === item.id && item.description && (
            <motion.div
              className="item-description"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {item.description}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sub-items */}
        <AnimatePresence>
          {isExpanded && hasSubItems && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {item.subItems?.map((subItem) => (
                <NavigationItemComponent
                  key={subItem.id}
                  item={subItem}
                  depth={depth + 1}
                  sectionPriority={sectionPriority}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <>
      <style jsx global>{`
        .psychological-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 320px;
          background: ${colorSchemes[colorScheme].background};
          border-right: 1px solid rgba(148, 163, 184, 0.1);
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 50;
          overflow: hidden;
        }

        .psychological-sidebar.closed {
          transform: translateX(-100%);
        }

        /* Header Section */
        .sidebar-header {
          padding: 24px 20px;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #60a5fa 0%, #818cf8 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 600;
          color: ${colorSchemes[colorScheme].primary};
          font-family: "JetBrains Mono", monospace;
        }

        /* User Profile */
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(148, 163, 184, 0.05);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            ${colorSchemes[colorScheme].primary} 0%,
            ${colorSchemes[colorScheme].accent} 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #e2e8f0;
        }

        .user-role {
          font-size: 12px;
          color: #94a3b8;
        }

        .trust-score {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: ${colorSchemes[colorScheme].accent};
        }

        /* Complexity Controls */
        .complexity-controls {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
        }

        .complexity-btn {
          flex: 1;
          padding: 6px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 11px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: "JetBrains Mono", monospace;
        }

        .complexity-btn.active {
          background: ${colorSchemes[colorScheme].primary}33;
          color: ${colorSchemes[colorScheme].primary};
        }

        .complexity-btn:hover:not(.active) {
          background: rgba(148, 163, 184, 0.1);
        }

        /* Color Scheme Selector */
        .color-schemes {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .scheme-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        .scheme-dot.active {
          border-color: white;
          transform: scale(1.2);
        }

        .scheme-dot.calm {
          background: #7dd3c0;
        }

        .scheme-dot.focus {
          background: #818cf8;
        }

        .scheme-dot.energize {
          background: #fb923c;
        }

        /* Navigation Sections */
        .nav-sections {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .nav-section {
          margin-bottom: 16px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          margin-bottom: 4px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .section-header:hover {
          background: rgba(148, 163, 184, 0.05);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .section-icon {
          width: 16px;
          height: 16px;
          color: ${colorSchemes[colorScheme].primary};
        }

        .section-expand {
          width: 16px;
          height: 16px;
          color: #64748b;
        }

        /* Navigation Items */
        .nav-item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          margin-bottom: 2px;
          border-radius: 8px;
          color: #e2e8f0;
          text-decoration: none;
          position: relative;
          transition: all 0.2s;
          overflow: hidden;
        }

        .nav-item:hover {
          transform: translateX(4px);
        }

        .nav-item.active {
          background: ${colorSchemes[colorScheme].primary}22;
          color: ${colorSchemes[colorScheme].primary};
        }

        .nav-item.dimmed {
          opacity: 0.4;
        }

        .trust-bar {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          border-radius: 8px 0 0 8px;
        }

        .nav-icon {
          width: 18px;
          height: 18px;
          margin-right: 12px;
          color: currentColor;
        }

        .nav-content {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 450;
        }

        .visit-indicator {
          font-size: 10px;
          color: ${colorSchemes[colorScheme].accent};
          opacity: 0.6;
        }

        /* Badges */
        .nav-badge {
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-info {
          background: #3b82f633;
          color: #60a5fa;
        }

        .badge-warning {
          background: #f59e0b33;
          color: #fbbf24;
        }

        .badge-success {
          background: #22c55e33;
          color: #34d399;
        }

        .badge-alert {
          background: #ef444433;
          color: #f87171;
        }

        /* Item Description */
        .item-description {
          padding: 8px 12px 8px 30px;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0 0 8px 8px;
          margin-top: -4px;
        }

        /* Expand Button */
        .expand-btn {
          padding: 4px;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
        }

        /* Journey Progress */
        .journey-progress {
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .journey-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .journey-title {
          font-size: 11px;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .journey-phase {
          font-size: 11px;
          color: ${colorSchemes[colorScheme].primary};
          font-weight: 600;
        }

        .journey-track {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .journey-node {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .node-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #475569;
          transition: all 0.3s;
        }

        .journey-node.completed .node-dot {
          background: ${colorSchemes[colorScheme].primary};
          box-shadow: 0 0 8px ${colorSchemes[colorScheme].primary}66;
        }

        .node-label {
          font-size: 9px;
          color: #64748b;
        }

        /* Breathing Guide */
        .breathing-guide {
          padding: 16px;
          background: rgba(52, 211, 153, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(52, 211, 153, 0.2);
          margin-bottom: 16px;
          text-align: center;
        }

        .breath-circle {
          width: 80px;
          height: 80px;
          margin: 0 auto 12px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .breath-indicator {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: absolute;
        }

        .breath-text {
          position: relative;
          z-index: 1;
          font-size: 14px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .breath-count {
          font-size: 12px;
          color: #94a3b8;
        }

        /* Footer Controls */
        .sidebar-footer {
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(148, 163, 184, 0.1);
        }

        .mode-toggles {
          display: flex;
          gap: 8px;
        }

        .mode-btn {
          flex: 1;
          padding: 8px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 8px;
          background: transparent;
          color: #94a3b8;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn.active {
          background: ${colorSchemes[colorScheme].primary}22;
          border-color: ${colorSchemes[colorScheme].primary};
          color: ${colorSchemes[colorScheme].primary};
        }

        .mode-btn:hover:not(.active) {
          background: rgba(148, 163, 184, 0.05);
        }

        /* Scrollbar */
        .nav-sections::-webkit-scrollbar {
          width: 6px;
        }

        .nav-sections::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        .nav-sections::-webkit-scrollbar-thumb {
          background: ${colorSchemes[colorScheme].primary}44;
          border-radius: 3px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .psychological-sidebar {
            width: 100%;
          }
        }

        /* Overlay */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 49;
        }
      `}</style>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`psychological-sidebar ${!isOpen ? "closed" : ""}`}
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="header-top">
            <div className="logo-section">
              <div className="logo-icon">L</div>
              <span className="logo-text">LIONSPACE</span>
            </div>
            <button onClick={onClose} className="rounded p-2 hover:bg-white/10">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Profile */}
          {userProfile && (
            <div className="user-profile">
              <div className="user-avatar">{userProfile.name.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{userProfile.name}</div>
                <div className="user-role">{userProfile.role}</div>
                <div className="trust-score">⭐ Trust: {userProfile.trustScore}/5</div>
              </div>
            </div>
          )}

          {/* Complexity Controls */}
          <div className="complexity-controls">
            <button
              className={`complexity-btn ${adaptiveComplexity === "minimal" ? "active" : ""}`}
              onClick={() => setAdaptiveComplexity("minimal")}
            >
              Minimal
            </button>
            <button
              className={`complexity-btn ${adaptiveComplexity === "balanced" ? "active" : ""}`}
              onClick={() => setAdaptiveComplexity("balanced")}
            >
              Balanced
            </button>
            <button
              className={`complexity-btn ${adaptiveComplexity === "detailed" ? "active" : ""}`}
              onClick={() => setAdaptiveComplexity("detailed")}
            >
              Detailed
            </button>
          </div>

          {/* Color Scheme Selector */}
          <div className="color-schemes">
            <div
              className={`scheme-dot calm ${colorScheme === "calm" ? "active" : ""}`}
              onClick={() => setColorScheme("calm")}
            />
            <div
              className={`scheme-dot focus ${colorScheme === "focus" ? "active" : ""}`}
              onClick={() => setColorScheme("focus")}
            />
            <div
              className={`scheme-dot energize ${colorScheme === "energize" ? "active" : ""}`}
              onClick={() => setColorScheme("energize")}
            />
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="nav-sections">
          {/* Journey Progress */}
          <JourneyProgress />

          {/* Breathing Guide */}
          <AnimatePresence>
            <BreathingGuide />
          </AnimatePresence>

          {/* Navigation Items */}
          {getFilteredSections().map((section) => (
            <div key={section.id} className="nav-section">
              <div className="section-header" onClick={() => toggleSection(section.id)}>
                <div className="section-title">
                  <div className="section-icon">{section.icon}</div>
                  <span>{section.title}</span>
                </div>
                <motion.div className="section-expand" animate={{ rotate: expandedSections.has(section.id) ? 180 : 0 }}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedSections.has(section.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {section.items.map((item) => (
                      <NavigationItemComponent key={item.id} item={item} sectionPriority={section.priority} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Footer Controls */}
        <div className="sidebar-footer">
          <div className="mode-toggles">
            <button className={`mode-btn ${focusMode ? "active" : ""}`} onClick={() => setFocusMode(!focusMode)}>
              🎯 Focus
            </button>
            <button
              className={`mode-btn ${breathingMode ? "active" : ""}`}
              onClick={() => setBreathingMode(!breathingMode)}
            >
              🌬️ Breathe
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
