'use client';

import { useState, useEffect } from 'react';
import { AppNavigation, AppSidebar } from '@/components/molecules';
import { CodeVeilCanvas } from '@/components/organisms/CodeVeilCanvas';

export function IntelligenceLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Set document title and security settings for intelligence platform
    document.title = 'LionSpace: Consciousness Warfare Command';
    
    // Prevent right-click context menu for security
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent certain key combinations for security
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white relative overflow-hidden">
      {/* Animated background canvas */}
      <CodeVeilCanvas />
      
      {/* Terminal border effect */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="w-full h-full border border-[#00ff88]/20 rounded-none"></div>
      </div>

      {/* Scan lines effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-30 opacity-5 animate-scanlines"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff88 2px, #00ff88 4px)'
        }}
      ></div>

      {/* Main application with backdrop blur */}
      <div className="relative z-10 min-h-screen backdrop-blur-sm bg-black/10">
        {/* Navigation Header */}
        <AppNavigation 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <div className="flex">
          {/* Sidebar */}
          <AppSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          {/* Main Content */}
          <main className={`flex-1 pt-16 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Global styles for intelligence platform */}
      <style jsx global>{`
        @keyframes scanlines {
          0% { transform: translateY(0px); }
          100% { transform: translateY(4px); }
        }
        
        @keyframes typewriter-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .typewriter-cursor::after {
          content: '|';
          animation: typewriter-blink 1s infinite;
          color: #00ff88;
          font-weight: bold;
        }

        .animate-scanlines {
          animation: scanlines 0.1s linear infinite;
        }

        /* Custom scrollbar for intelligence theme */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #00ff88 transparent;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #00ff88;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #00ffff;
        }

        /* Terminal-style selection */
        ::selection {
          background-color: #00ff88;
          color: #0B1220;
        }

        ::-moz-selection {
          background-color: #00ff88;
          color: #0B1220;
        }

        /* Animation utilities */
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        /* Loading spinner */
        .spinner {
          border: 2px solid transparent;
          border-top: 2px solid #00ff88;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Terminal glow effects */
        .terminal-glow {
          text-shadow: 0 0 5px currentColor;
        }

        .terminal-border {
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
        }
      `}</style>
    </div>
  );
}