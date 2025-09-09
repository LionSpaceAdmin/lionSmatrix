'use client';

import React, { useState } from 'react';
import { PsychologicalNavigation } from './PsychologicalNavigation';
import { PsychologicalSidebar } from './PsychologicalSidebar';
import { PsychologicalBreadcrumbs } from './PsychologicalBreadcrumbs';

// 🎨 Navigation Components Showcase Page
// Demonstrates all psychological navigation components with full design system

export function NavigationShowcase() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const mockUserProfile = {
    name: 'Operator Alpha',
    role: 'Intelligence Analyst',
    trustScore: 4.2,
    stressLevel: 0.3,
    preferredComplexity: 'balanced' as const
  };

  return (
    <div className="navigation-showcase">
      <style jsx global>{`
        .navigation-showcase {
          min-height: 100vh;
          background: linear-gradient(180deg, #0b0f1a 0%, #1a2332 100%);
          color: #e8eef7;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .showcase-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          background: rgba(11, 15, 26, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(127, 179, 255, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .menu-toggle {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(127, 179, 255, 0.1);
          border: 1px solid rgba(127, 179, 255, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .menu-toggle:hover {
          background: rgba(127, 179, 255, 0.2);
          transform: scale(1.05);
        }

        .title-text {
          font-size: 20px;
          font-weight: 600;
          background: linear-gradient(135deg, #7fb3ff 0%, #9333ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .action-btn {
          padding: 8px 16px;
          background: rgba(127, 179, 255, 0.1);
          border: 1px solid rgba(127, 179, 255, 0.2);
          border-radius: 8px;
          color: #7fb3ff;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(127, 179, 255, 0.2);
          transform: translateY(-2px);
        }

        .main-content {
          margin-top: 64px;
          display: flex;
          min-height: calc(100vh - 64px);
        }

        .content-area {
          flex: 1;
          margin-left: ${sidebarOpen ? '320px' : '0'};
          transition: margin-left 0.3s ease;
          padding: 24px;
        }

        .demo-section {
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #60a5fa;
        }

        .section-subtitle {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .demo-container {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .demo-content {
          padding: 32px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }

        .feature-card {
          background: rgba(127, 179, 255, 0.05);
          border: 1px solid rgba(127, 179, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          background: rgba(127, 179, 255, 0.08);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(127, 179, 255, 0.1);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #60a5fa 0%, #818cf8 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          font-size: 24px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #e2e8f0;
        }

        .feature-description {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.5;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #22c55e 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .content-area {
            margin-left: 0;
            padding: 16px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* Header */}
      <header className="showcase-header">
        <div className="header-content">
          <div className="header-title">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <h1 className="title-text">Psychological Navigation System</h1>
          </div>
          <div className="header-actions">
            <button className="action-btn">🧠 Cognitive Mode</button>
            <button className="action-btn">🎨 Design System</button>
            <button className="action-btn">📊 Analytics</button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <PsychologicalSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userProfile={mockUserProfile}
      />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-area">
          {/* Breadcrumbs Demo */}
          <section className="demo-section">
            <h2 className="section-title">Psychological Breadcrumbs</h2>
            <p className="section-subtitle">
              Cognitive load-aware breadcrumb navigation with journey tracking and trust indicators
            </p>
            <div className="demo-container">
              <PsychologicalBreadcrumbs 
                showJourneyProgress={true}
                showCognitiveIndicators={true}
              />
            </div>
          </section>

          {/* Features Grid */}
          <section className="demo-section">
            <h2 className="section-title">Navigation Features</h2>
            <p className="section-subtitle">
              Complete psychological design system implementation
            </p>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3 className="feature-title">Cognitive Load Management</h3>
                <p className="feature-description">
                  Adaptive complexity filtering based on user capacity and stress levels.
                  Progressive disclosure reveals information gradually.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✨</div>
                <h3 className="feature-title">Trust Building</h3>
                <p className="feature-description">
                  Visual trust indicators, verification badges, and transparency signals
                  build user confidence throughout the journey.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">Journey Tracking</h3>
                <p className="feature-description">
                  Real-time progress monitoring through orientation, exploration,
                  and mastery phases with visual feedback.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h3 className="feature-title">Trauma-Informed</h3>
                <p className="feature-description">
                  Safe mode options, breathing exercises, and stress reduction
                  features ensure comfortable navigation.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3 className="feature-title">Adaptive Theming</h3>
                <p className="feature-description">
                  Dynamic color schemes (calm, focus, energize) adapt to user
                  state and preferences automatically.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Behavior Analytics</h3>
                <p className="feature-description">
                  Track interaction patterns, visit frequency, and user satisfaction
                  to optimize navigation experience.
                </p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="demo-section">
            <h2 className="section-title">Performance Metrics</h2>
            <p className="section-subtitle">
              Real-time psychological and performance indicators
            </p>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">87%</div>
                <div className="stat-label">Task Completion</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">4.6/5</div>
                <div className="stat-label">User Satisfaction</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">42%</div>
                <div className="stat-label">Stress Reduction</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">3.2min</div>
                <div className="stat-label">Time to Mastery</div>
              </div>
            </div>
          </section>

          {/* Navigation Component */}
          <section className="demo-section">
            <h2 className="section-title">Main Navigation System</h2>
            <p className="section-subtitle">
              Full psychological navigation with all features integrated
            </p>
            <div className="demo-container">
              <PsychologicalNavigation />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}