import { Suspense } from 'react';
import { WarRoomDashboard } from './components/war-room-dashboard';
import { ActiveSessions } from './components/active-sessions';
import { ThreatOverview } from './components/threat-overview';

export default function WarRoomPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-green-900 pb-4">
        <h1 className="text-3xl font-bold text-green-400 font-mono">
          WAR ROOM COMMAND CENTER
        </h1>
        <p className="text-green-600 mt-2 font-mono text-sm">
          Real-time threat response and coordination
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
  );
}

function SessionsLoading() {
  return (
    <div className="bg-gray-900 border border-green-900 rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-green-900/30 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-12 bg-green-900/20 rounded"></div>
        <div className="h-12 bg-green-900/20 rounded"></div>
        <div className="h-12 bg-green-900/20 rounded"></div>
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="bg-gray-900 border border-green-900 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-green-900/30 rounded w-1/2 mb-6"></div>
      <div className="h-64 bg-green-900/20 rounded"></div>
    </div>
  );
}

function ThreatLoading() {
  return (
    <div className="bg-gray-900 border border-green-900 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-green-900/30 rounded w-1/3 mb-4"></div>
      <div className="h-32 bg-green-900/20 rounded"></div>
    </div>
  );
}