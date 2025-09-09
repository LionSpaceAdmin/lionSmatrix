'use client';

import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AppNavigation } from './_components/shared/AppNavigation';
import { AppSidebar } from './_components/shared/AppSidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate authentication check
    // In real app, this would check JWT, session, etc.
    const checkAuth = () => {
      // For now, always redirect to login
      // TODO: Implement real authentication
      setIsAuthenticated(false);
    };

    checkAuth();
  }, []);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-terminal-cyan font-mono">
          AUTHENTICATING...
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    redirect('/join');
  }

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
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
  );
}