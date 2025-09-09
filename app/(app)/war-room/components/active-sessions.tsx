'use client';

import { useState, useEffect } from 'react';

interface Session {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
  participants: number;
  startTime: string;
}

export function ActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching sessions
    const mockSessions: Session[] = [
      {
        id: 'session-1',
        name: 'Critical Infrastructure Defense',
        status: 'active',
        participants: 5,
        startTime: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'session-2',
        name: 'Threat Analysis Alpha',
        status: 'pending',
        participants: 3,
        startTime: new Date(Date.now() - 1800000).toISOString()
      }
    ];

    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-950 border border-terminal-cyan/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-terminal-cyan mb-4 font-mono">
          ACTIVE SESSIONS
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-900/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 border border-terminal-cyan/30 rounded-lg p-6">
      <h3 className="text-lg font-bold text-terminal-cyan mb-4 font-mono">
        ACTIVE SESSIONS
      </h3>
      <div className="space-y-3">
        {sessions.map(session => (
          <div
            key={session.id}
            className="p-4 bg-gray-900/50 rounded border border-terminal-cyan/20 hover:border-terminal-cyan/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-terminal-text font-mono text-sm font-semibold">
                {session.name}
              </h4>
              <span className={`text-xs font-mono px-2 py-1 rounded ${
                session.status === 'active'
                  ? 'bg-green-900/50 text-green-400'
                  : session.status === 'pending'
                  ? 'bg-yellow-900/50 text-yellow-400'
                  : 'bg-gray-900/50 text-gray-400'
              }`}>
                {session.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-terminal-muted font-mono">
              <span>{session.participants} participants</span>
              <span>{new Date(session.startTime).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 px-4 py-2 bg-terminal-cyan/20 border border-terminal-cyan text-terminal-cyan font-mono text-sm rounded hover:bg-terminal-cyan/30 transition-colors">
        CREATE NEW SESSION
      </button>
    </div>
  );
}