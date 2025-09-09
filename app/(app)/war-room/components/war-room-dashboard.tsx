'use client';

import { useState, useEffect } from 'react';
import { ThreatMap } from './threat-map';
import { ParticipantsList } from './participants-list';
import { ActivityFeed } from './activity-feed';
import { CommandPanel } from './command-panel';

export function WarRoomDashboard() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to SSE for real-time updates
    const eventSource = new EventSource('/api/war-room/stream');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSessionData(data);
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="bg-gray-900 border border-green-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-green-900/20 px-6 py-4 border-b border-green-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-green-400 font-mono">
            OPERATIONAL DASHBOARD
          </h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className="text-xs text-green-600 font-mono">
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Threat Map */}
          <div className="lg:col-span-2">
            <ThreatMap data={sessionData?.threatMap} />
          </div>

          {/* Participants */}
          <div>
            <ParticipantsList participants={sessionData?.participants || []} />
          </div>

          {/* Activity Feed */}
          <div>
            <ActivityFeed activities={sessionData?.activities || []} />
          </div>

          {/* Command Panel */}
          <div className="lg:col-span-2">
            <CommandPanel sessionId={sessionData?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}