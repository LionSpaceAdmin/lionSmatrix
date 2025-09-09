'use server';

export async function getActiveSessions() {
  // In production, fetch from database
  // For now, return mock data
  return [
    {
      id: 'session-1',
      name: 'Critical Infrastructure Defense',
      description: 'Monitoring and defending critical systems',
      status: 'active' as const,
      participants: 5,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'session-2',
      name: 'Threat Analysis Alpha',
      description: 'Analyzing emerging threat patterns',
      status: 'paused' as const,
      participants: 3,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'session-3',
      name: 'Incident Response Team',
      description: 'Coordinating incident response efforts',
      status: 'active' as const,
      participants: 8,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];
}

export async function getThreatOverview() {
  // In production, fetch from database or threat scoring service
  return {
    critical: 3,
    high: 7,
    medium: 15,
    low: 28,
    recent: [
      {
        id: 'threat-1',
        name: 'APT29 Activity Detected',
        type: 'Advanced Persistent Threat',
        severity: 'critical' as const,
        detectedAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: 'threat-2',
        name: 'Suspicious Network Traffic',
        type: 'Network Anomaly',
        severity: 'high' as const,
        detectedAt: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: 'threat-3',
        name: 'Unusual Login Patterns',
        type: 'Behavioral Analysis',
        severity: 'medium' as const,
        detectedAt: new Date(Date.now() - 900000).toISOString(),
      },
    ],
  };
}