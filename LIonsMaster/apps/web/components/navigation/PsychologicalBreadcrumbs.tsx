'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 🧠 Psychological Breadcrumbs with Cognitive Load & Journey Tracking
// Implements: User orientation, progress visualization, stress reduction

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  cognitiveLoad?: number;
  trustLevel?: 'high' | 'medium' | 'low';
  timeSpent?: number;
  isLandmark?: boolean; // Key navigation points
}

interface PsychologicalBreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  showJourneyProgress?: boolean;
  showCognitiveIndicators?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
}

export function PsychologicalBreadcrumbs({
  customItems,
  showJourneyProgress = true,
  showCognitiveIndicators = true,
  maxItems = 5,
  separator
}: PsychologicalBreadcrumbsProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [userProgress, setUserProgress] = useState({
    stepsCompleted: 0,
    totalSteps: 0,
    confidence: 0.5,
    currentPhase: 'orientation' as 'orientation' | 'exploration' | 'mastery'
  });

  // 🎨 Color system for psychological states
  const colors = {
    orientation: '#60a5fa',   // Blue - learning
    exploration: '#34d399',   // Green - active
    mastery: '#818cf8',      // Purple - expert
    trust: {
      high: '#22c55e',
      medium: '#3b82f6',
      low: '#f59e0b'
    },
    cognitive: {
      low: '#86efac',      // Light green
      medium: '#fde047',   // Yellow
      high: '#fb923c'      // Orange
    }
  };

  // Generate breadcrumbs from pathname
  useEffect(() => {
    if (customItems) {
      setBreadcrumbs(customItems);
      return;
    }

    const paths = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [
      {
        label: 'Home',
        href: '/',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        cognitiveLoad: 1,
        trustLevel: 'high',
        isLandmark: true
      }
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Estimate cognitive load based on depth
      const cognitiveLoad = Math.min(10, 2 + index * 2);
      
      // Determine trust level based on familiarity
      const trustLevel = index < 2 ? 'high' : index < 4 ? 'medium' : 'low';
      
      items.push({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
        href: currentPath,
        cognitiveLoad,
        trustLevel,
        isLandmark: index === paths.length - 1
      });
    });

    setBreadcrumbs(items.slice(-maxItems));
    
    // Update user progress
    setUserProgress({
      stepsCompleted: items.length - 1,
      totalSteps: items.length,
      confidence: Math.min(1, 0.3 + (items.length * 0.1)),
      currentPhase: items.length <= 2 ? 'orientation' : 
                   items.length <= 4 ? 'exploration' : 'mastery'
    });
  }, [pathname, customItems, maxItems]);

  // Calculate journey position
  const getJourneyPosition = () => {
    const progress = userProgress.stepsCompleted / Math.max(1, userProgress.totalSteps - 1);
    return Math.min(100, progress * 100);
  };

  // Get cognitive load color
  const getCognitiveColor = (load?: number) => {
    if (!load) return colors.cognitive.low;
    if (load <= 3) return colors.cognitive.low;
    if (load <= 6) return colors.cognitive.medium;
    return colors.cognitive.high;
  };

  // Custom separator component
  const Separator = () => {
    if (separator) return <>{separator}</>;
    
    return (
      <motion.svg 
        className="w-4 h-4 text-gray-400"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </motion.svg>
    );
  };

  return (
    <>
      <style jsx global>{`
        .psychological-breadcrumbs {
          position: relative;
          padding: 16px 24px;
          background: linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          backdrop-filter: blur(8px);
        }

        /* Journey Progress Bar */
        .journey-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(148, 163, 184, 0.1);
          overflow: hidden;
        }

        .journey-progress-fill {
          height: 100%;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 10px currentColor;
        }

        /* Breadcrumb Container */
        .breadcrumb-container {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        /* Breadcrumb Item */
        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 8px;
          text-decoration: none;
          color: #cbd5e1;
          font-size: 14px;
          position: relative;
          transition: all 0.2s;
          cursor: pointer;
        }

        .breadcrumb-item:hover {
          background: rgba(148, 163, 184, 0.1);
          color: #e2e8f0;
          transform: translateY(-2px);
        }

        .breadcrumb-item.current {
          color: #60a5fa;
          background: rgba(96, 165, 250, 0.1);
          font-weight: 500;
        }

        .breadcrumb-item.landmark {
          font-weight: 600;
        }

        /* Trust Indicator */
        .trust-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        /* Cognitive Load Indicator */
        .cognitive-indicator {
          display: flex;
          gap: 2px;
          padding: 2px 4px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          margin-left: 4px;
        }

        .cognitive-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        /* Hover Tooltip */
        .breadcrumb-tooltip {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 12px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 8px;
          white-space: nowrap;
          z-index: 100;
          pointer-events: none;
        }

        .tooltip-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tooltip-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .tooltip-label {
          color: #94a3b8;
        }

        .tooltip-value {
          color: #e2e8f0;
          font-weight: 500;
        }

        /* Phase Indicator */
        .phase-indicator {
          position: absolute;
          top: 8px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: rgba(148, 163, 184, 0.05);
          border-radius: 20px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .phase-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 4px currentColor; }
          50% { box-shadow: 0 0 12px currentColor; }
        }

        .phase-text {
          color: #94a3b8;
        }

        /* Confidence Meter */
        .confidence-meter {
          position: absolute;
          top: 8px;
          left: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .confidence-label {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .confidence-bars {
          display: flex;
          gap: 2px;
        }

        .confidence-bar {
          width: 3px;
          height: 12px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 2px;
          transition: all 0.3s;
        }

        .confidence-bar.filled {
          background: currentColor;
        }

        /* Collapsed State */
        .breadcrumb-collapsed {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: rgba(148, 163, 184, 0.1);
          border-radius: 6px;
          font-size: 12px;
          color: #94a3b8;
          cursor: pointer;
        }

        .breadcrumb-collapsed:hover {
          background: rgba(148, 163, 184, 0.2);
          color: #cbd5e1;
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .psychological-breadcrumbs {
            padding: 12px 16px;
          }

          .breadcrumb-item {
            font-size: 12px;
            padding: 4px 8px;
          }

          .phase-indicator,
          .confidence-meter {
            display: none;
          }
        }

        /* Animations */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .breadcrumb-item {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <nav className="psychological-breadcrumbs" aria-label="Breadcrumb navigation">
        {/* Confidence Meter */}
        <div className="confidence-meter">
          <span className="confidence-label">Confidence</span>
          <div className="confidence-bars">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`confidence-bar ${i < Math.ceil(userProgress.confidence * 5) ? 'filled' : ''}`}
                style={{ color: colors[userProgress.currentPhase] }}
              />
            ))}
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="phase-indicator">
          <div 
            className="phase-dot" 
            style={{ backgroundColor: colors[userProgress.currentPhase] }}
          />
          <span className="phase-text">
            Phase: {userProgress.currentPhase}
          </span>
        </div>

        {/* Breadcrumb Trail */}
        <div className="breadcrumb-container">
          {breadcrumbs.length > maxItems && (
            <div className="breadcrumb-collapsed">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              <span>{breadcrumbs.length - maxItems} more</span>
            </div>
          )}

          <AnimatePresence>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const isHovered = hoveredIndex === index;

              return (
                <React.Fragment key={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={item.href}
                      className={`
                        breadcrumb-item
                        ${isLast ? 'current' : ''}
                        ${item.isLandmark ? 'landmark' : ''}
                      `}
                    >
                      {/* Trust Indicator Dot */}
                      {item.trustLevel && (
                        <div 
                          className="trust-dot"
                          style={{ backgroundColor: colors.trust[item.trustLevel] }}
                        />
                      )}

                      {/* Icon */}
                      {item.icon && (
                        <motion.span
                          animate={{ rotate: isHovered ? 360 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.icon}
                        </motion.span>
                      )}

                      {/* Label */}
                      <span>{item.label}</span>

                      {/* Cognitive Load Indicator */}
                      {showCognitiveIndicators && item.cognitiveLoad && (
                        <div className="cognitive-indicator">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="cognitive-dot"
                              style={{
                                backgroundColor: i < Math.ceil((item.cognitiveLoad || 0) / 3.33) 
                                  ? getCognitiveColor(item.cognitiveLoad)
                                  : 'rgba(148, 163, 184, 0.2)'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </Link>

                    {/* Hover Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className="breadcrumb-tooltip"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                        >
                          <div className="tooltip-content">
                            <div className="tooltip-row">
                              <span className="tooltip-label">Path:</span>
                              <span className="tooltip-value">{item.href}</span>
                            </div>
                            {item.cognitiveLoad && (
                              <div className="tooltip-row">
                                <span className="tooltip-label">Complexity:</span>
                                <span className="tooltip-value">{item.cognitiveLoad}/10</span>
                              </div>
                            )}
                            {item.trustLevel && (
                              <div className="tooltip-row">
                                <span className="tooltip-label">Trust:</span>
                                <span className="tooltip-value">{item.trustLevel}</span>
                              </div>
                            )}
                            {item.timeSpent && (
                              <div className="tooltip-row">
                                <span className="tooltip-label">Time spent:</span>
                                <span className="tooltip-value">{item.timeSpent}s</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Separator */}
                  {!isLast && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.025 }}
                    >
                      <Separator />
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Journey Progress Bar */}
        {showJourneyProgress && (
          <div className="journey-progress-bar">
            <motion.div
              className="journey-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${getJourneyPosition()}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                background: `linear-gradient(90deg, 
                  ${colors.orientation} 0%, 
                  ${colors.exploration} 50%, 
                  ${colors.mastery} 100%)`
              }}
            />
          </div>
        )}
      </nav>
    </>
  );
}