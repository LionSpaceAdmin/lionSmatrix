'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 🧠 Psychological Navigation System with Complete Design Focus
// Based on cognitive load theory, trust building, and trauma-informed UX

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  trustLevel?: 'high' | 'medium' | 'low';
  cognitiveLoad?: number; // 1-10 scale
  subItems?: NavigationItem[];
  badge?: {
    text: string;
    type: 'info' | 'warning' | 'success' | 'critical';
  };
}

interface UserJourneyState {
  currentPhase: 'awareness' | 'orientation' | 'comprehension' | 'engagement' | 'contribution';
  completedSteps: string[];
  timeSpent: number;
  stressLevel: number; // 0-1 scale
  confidence: number; // 0-1 scale
}

export function PsychologicalNavigation() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [userJourney, setUserJourney] = useState<UserJourneyState>({
    currentPhase: 'awareness',
    completedSteps: [],
    timeSpent: 0,
    stressLevel: 0.3,
    confidence: 0.5,
  });
  const [cognitiveLoadPreference, setCognitiveLoadPreference] = useState<'simple' | 'moderate' | 'detailed'>('moderate');
  const [safeMode, setSafeMode] = useState(false);

  // 🎨 Color Psychology System
  const colorSystem = {
    trust: {
      high: '#16a34a',      // Green - verified, safe
      medium: '#3b82f6',    // Blue - stable, reliable
      low: '#f59e0b',       // Amber - caution, not red to avoid panic
    },
    cognitive: {
      minimal: '#e0f2fe',   // Very light blue
      low: '#dbeafe',       // Light blue
      moderate: '#bfdbfe',  // Medium blue
      high: '#93c5fd',      // Darker blue
    },
    emotional: {
      calm: '#7dd3c0',      // Teal
      neutral: '#94a3b8',   // Gray
      alert: '#fbbf24',     // Yellow
      stress: '#fb923c',    // Orange
    },
  };

  // 📊 Navigation Structure with Psychological Metadata
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/app/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      description: 'מרכז הפיקוד - סקירה כללית',
      trustLevel: 'high',
      cognitiveLoad: 3,
      badge: {
        text: 'עדכון',
        type: 'info',
      },
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/app/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: 'ניתוח נתונים ותובנות',
      trustLevel: 'high',
      cognitiveLoad: 6,
      subItems: [
        {
          id: 'analytics-overview',
          label: 'סקירה כללית',
          href: '/app/analytics/overview',
          icon: null,
          cognitiveLoad: 4,
        },
        {
          id: 'analytics-detailed',
          label: 'ניתוח מעמיק',
          href: '/app/analytics/detailed',
          icon: null,
          cognitiveLoad: 8,
        },
      ],
    },
    {
      id: 'cognitive-warfare',
      label: 'Cognitive Warfare',
      href: '/app/cognitive-warfare',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: 'לוחמה קוגניטיבית ומידע',
      trustLevel: 'medium',
      cognitiveLoad: 7,
      badge: {
        text: 'רגיש',
        type: 'warning',
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/app/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'הגדרות והתאמה אישית',
      trustLevel: 'high',
      cognitiveLoad: 5,
    },
  ];

  // 🧠 Filter items based on cognitive load preference
  const getFilteredItems = useCallback(() => {
    const maxLoad = cognitiveLoadPreference === 'simple' ? 4 : 
                    cognitiveLoadPreference === 'moderate' ? 7 : 10;
    
    return navigationItems.filter(item => 
      !item.cognitiveLoad || item.cognitiveLoad <= maxLoad
    );
  }, [cognitiveLoadPreference]);

  // 🎨 Get trust indicator color
  const getTrustColor = (level?: 'high' | 'medium' | 'low') => {
    if (!level) return colorSystem.trust.medium;
    return colorSystem.trust[level];
  };

  // 📊 Track user journey
  useEffect(() => {
    const timer = setInterval(() => {
      setUserJourney(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 🎯 Progressive Disclosure Component
  const ProgressiveItem: React.FC<{ item: NavigationItem; depth?: number }> = ({ item, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isActive = pathname === item.href;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div className="progressive-item">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: depth * 0.1 }}
        >
          <Link
            href={item.href}
            className={`
              navigation-item
              ${isActive ? 'active' : ''}
              ${safeMode ? 'safe-mode' : ''}
            `}
            style={{
              paddingLeft: `${16 + depth * 20}px`,
              borderLeftColor: getTrustColor(item.trustLevel),
            }}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Trust Indicator */}
            <div 
              className="trust-indicator"
              style={{ backgroundColor: getTrustColor(item.trustLevel) }}
            />

            {/* Icon with gentle animation */}
            <motion.div 
              className="nav-icon"
              animate={{ 
                scale: hoveredItem === item.id ? 1.1 : 1,
                rotate: isActive ? 360 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {item.icon}
            </motion.div>

            {/* Label with cognitive load indicator */}
            <div className="nav-content">
              <span className="nav-label">{item.label}</span>
              {item.cognitiveLoad && (
                <div className="cognitive-load-indicator">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="load-dot"
                      style={{
                        backgroundColor: i < (item.cognitiveLoad || 0)
                          ? colorSystem.cognitive.moderate 
                          : colorSystem.cognitive.minimal,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Badge */}
            {item.badge && (
              <motion.div 
                className={`nav-badge badge-${item.badge.type}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {item.badge.text}
              </motion.div>
            )}

            {/* Expand/Collapse for sub-items */}
            {hasSubItems && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(!isExpanded);
                }}
                className="expand-btn"
              >
                <motion.svg
                  className="w-4 h-4"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
            )}
          </Link>

          {/* Description on hover */}
          <AnimatePresence>
            {hoveredItem === item.id && item.description && (
              <motion.div
                className="nav-description"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.description}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sub-items with progressive disclosure */}
        <AnimatePresence>
          {isExpanded && hasSubItems && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {item.subItems?.map(subItem => (
                <ProgressiveItem key={subItem.id} item={subItem} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        .psychological-navigation {
          position: fixed;
          left: 0;
          top: 64px;
          height: calc(100vh - 64px);
          width: 280px;
          background: linear-gradient(180deg, #0b0f1a 0%, #1a2332 100%);
          border-right: 1px solid rgba(127, 179, 255, 0.2);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 40;
        }

        .psychological-navigation.collapsed {
          width: 64px;
        }

        /* Header with cognitive controls */
        .nav-header {
          padding: 20px;
          border-bottom: 1px solid rgba(127, 179, 255, 0.1);
          background: rgba(127, 179, 255, 0.02);
        }

        .cognitive-controls {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .cognitive-btn {
          flex: 1;
          padding: 6px;
          border-radius: 6px;
          border: 1px solid rgba(127, 179, 255, 0.2);
          background: transparent;
          color: #94a3b8;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cognitive-btn.active {
          background: rgba(127, 179, 255, 0.1);
          border-color: #7fb3ff;
          color: #7fb3ff;
        }

        .cognitive-btn:hover:not(.active) {
          background: rgba(127, 179, 255, 0.05);
          transform: translateY(-1px);
        }

        /* Navigation items */
        .nav-items {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .navigation-item {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          margin-bottom: 4px;
          border-radius: 8px;
          border-left: 3px solid transparent;
          color: #e8eef7;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .navigation-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(127, 179, 255, 0.1) 0%, 
            transparent 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .navigation-item:hover::before {
          opacity: 1;
        }

        .navigation-item.active {
          background: rgba(127, 179, 255, 0.1);
          border-left-color: #7fb3ff;
          color: #7fb3ff;
        }

        .navigation-item.safe-mode {
          animation: gentle-pulse 3s ease-in-out infinite;
        }

        @keyframes gentle-pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        /* Trust indicator */
        .trust-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          border-radius: 0 2px 2px 0;
          transition: height 0.2s;
        }

        .navigation-item:hover .trust-indicator {
          height: 30px;
        }

        /* Icon styling */
        .nav-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: currentColor;
        }

        /* Content area */
        .nav-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
        }

        /* Cognitive load indicator */
        .cognitive-load-indicator {
          display: flex;
          gap: 2px;
          margin-top: 2px;
        }

        .load-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        /* Badge styling */
        .nav-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-info {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }

        .badge-warning {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
        }

        .badge-success {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .badge-critical {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        /* Description tooltip */
        .nav-description {
          padding: 8px 12px;
          margin: 4px 0 8px 32px;
          background: rgba(127, 179, 255, 0.05);
          border-radius: 6px;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
        }

        /* Expand button */
        .expand-btn {
          padding: 4px;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .expand-btn:hover {
          color: #7fb3ff;
          background: rgba(127, 179, 255, 0.1);
          border-radius: 4px;
        }

        /* User journey indicator */
        .journey-indicator {
          padding: 16px;
          background: rgba(127, 179, 255, 0.02);
          border-top: 1px solid rgba(127, 179, 255, 0.1);
        }

        .journey-phase {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .phase-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        .phase-label {
          font-size: 11px;
          text-transform: uppercase;
          color: #64748b;
          font-family: 'JetBrains Mono', monospace;
        }

        /* Stress indicator */
        .stress-meter {
          height: 4px;
          background: rgba(127, 179, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .stress-level {
          height: 100%;
          background: linear-gradient(90deg, #22c55e 0%, #fbbf24 50%, #ef4444 100%);
          transition: width 0.5s ease;
        }

        /* Safe mode toggle */
        .safe-mode-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(34, 197, 94, 0.05);
          border-radius: 8px;
          margin-top: 12px;
        }

        .safe-mode-label {
          font-size: 12px;
          color: #22c55e;
          font-weight: 500;
        }

        .toggle-switch {
          width: 36px;
          height: 20px;
          background: rgba(100, 116, 139, 0.3);
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }

        .toggle-switch.active {
          background: rgba(34, 197, 94, 0.3);
        }

        .toggle-handle {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-handle {
          transform: translateX(16px);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .psychological-navigation {
            width: 100%;
            transform: translateX(-100%);
          }

          .psychological-navigation.open {
            transform: translateX(0);
          }

          .cognitive-controls {
            flex-direction: column;
          }
        }

        /* Scrollbar styling */
        .nav-items::-webkit-scrollbar {
          width: 6px;
        }

        .nav-items::-webkit-scrollbar-track {
          background: rgba(127, 179, 255, 0.05);
          border-radius: 3px;
        }

        .nav-items::-webkit-scrollbar-thumb {
          background: rgba(127, 179, 255, 0.2);
          border-radius: 3px;
        }

        .nav-items::-webkit-scrollbar-thumb:hover {
          background: rgba(127, 179, 255, 0.3);
        }
      `}</style>

      <nav className={`psychological-navigation ${!isExpanded ? 'collapsed' : ''}`}>
        {/* Header with cognitive controls */}
        <div className="nav-header">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-terminal-cyan">NAVIGATION</h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded hover:bg-terminal-cyan/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isExpanded ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
              </svg>
            </button>
          </div>

          {/* Cognitive Load Controls */}
          <div className="cognitive-controls">
            <button
              className={`cognitive-btn ${cognitiveLoadPreference === 'simple' ? 'active' : ''}`}
              onClick={() => setCognitiveLoadPreference('simple')}
            >
              פשוט
            </button>
            <button
              className={`cognitive-btn ${cognitiveLoadPreference === 'moderate' ? 'active' : ''}`}
              onClick={() => setCognitiveLoadPreference('moderate')}
            >
              מאוזן
            </button>
            <button
              className={`cognitive-btn ${cognitiveLoadPreference === 'detailed' ? 'active' : ''}`}
              onClick={() => setCognitiveLoadPreference('detailed')}
            >
              מפורט
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {getFilteredItems().map(item => (
            <ProgressiveItem key={item.id} item={item} />
          ))}
        </div>

        {/* User Journey Indicator */}
        <div className="journey-indicator">
          <div className="journey-phase">
            <div className="phase-dot" />
            <span className="phase-label">
              Phase: {userJourney.currentPhase}
            </span>
          </div>

          {/* Stress Meter */}
          <div className="stress-meter">
            <div 
              className="stress-level" 
              style={{ width: `${userJourney.stressLevel * 100}%` }}
            />
          </div>

          {/* Safe Mode Toggle */}
          <div className="safe-mode-toggle">
            <span className="safe-mode-label">מצב בטוח</span>
            <div 
              className={`toggle-switch ${safeMode ? 'active' : ''}`}
              onClick={() => setSafeMode(!safeMode)}
            >
              <div className="toggle-handle" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}