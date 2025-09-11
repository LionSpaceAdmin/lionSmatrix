import { Suspense } from 'react';
import { WarRoomDashboard } from '@/components/war-room/war-room-dashboard';
import { ActiveSessions } from '@/components/war-room/active-sessions';
import { ThreatOverview } from '@/components/war-room/threat-overview';
import { UnifiedBackground } from '@/components/organisms';

export default function WarRoomPage() {
  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      {/* Neural War Room Background */}
      <UnifiedBackground 
        variant="platform" 
        intensity="medium" 
        interactive={true}
      />
      
      <div className="relative z-10 p-6 space-y-6">
        <div className="border-b border-red-500/30 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-red-400 font-terminal">
            ◉ WAR ROOM COMMAND CENTER
          </h1>
          <p className="text-red-300/80 mt-2 font-terminal text-sm">
            &gt; REAL-TIME THREAT RESPONSE AND COORDINATION
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Sessions */}
          <div className="lg:col-span-1">
            <Suspense fallback={<SessionsLoading />}>
              <ActiveSessions />
            </Suspense>
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-2">
            <Suspense fallback={<DashboardLoading />}>
              <WarRoomDashboard />
            </Suspense>
          </div>
        </div>

        {/* Threat Overview */}
        <Suspense fallback={<ThreatLoading />}>
          <ThreatOverview />
        </Suspense>
      </div>
    </div>
  );
}

function SessionsLoading() {
  return (
    <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-4 animate-pulse backdrop-blur-sm">
      <div className="h-4 bg-red-500/20 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-12 bg-red-500/10 rounded"></div>
        <div className="h-12 bg-red-500/10 rounded"></div>
        <div className="h-12 bg-red-500/10 rounded"></div>
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-6 animate-pulse backdrop-blur-sm">
      <div className="h-6 bg-red-500/20 rounded w-1/2 mb-6"></div>
      <div className="h-64 bg-red-500/10 rounded"></div>
    </div>
  );
}

function ThreatLoading() {
  return (
    <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-6 animate-pulse backdrop-blur-sm">
      <div className="h-6 bg-red-500/20 rounded w-1/3 mb-4"></div>
      <div className="h-32 bg-red-500/10 rounded"></div>
    </div>
  );
}
