import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  // Create a custom readable stream for SSE
  const customReadable = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ 
          type: 'connection',
          message: 'Connected to war room stream' 
        })}\n\n`)
      );

      // Simulate real-time updates
      const interval = setInterval(() => {
        const data = generateMockUpdate();
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      }, 5000); // Send update every 5 seconds

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

function generateMockUpdate() {
  const updateTypes = ['threat', 'participant', 'activity', 'metric'];
  const type = updateTypes[Math.floor(Math.random() * updateTypes.length)] as string;
  
  switch (type) {
    case 'threat':
      return {
        type: 'threat_update',
        threatMap: {
          threats: [
            {
              id: `threat-${Date.now()}`,
              lat: Math.random() * 180 - 90,
              lng: Math.random() * 360 - 180,
              severity: (['critical', 'high', 'medium', 'low'] as const)[Math.floor(Math.random() * 4)],
              type: 'Network Intrusion',
            },
          ],
          connections: [],
        },
      };
    
    case 'participant':
      return {
        type: 'participant_update',
        participants: [
          {
            id: `user-${Date.now()}`,
            name: `Analyst ${Math.floor(Math.random() * 100)}`,
            role: (['Lead Analyst', 'Security Engineer', 'Incident Responder'] as const)[Math.floor(Math.random() * 3)],
            status: 'active' as const,
            joinedAt: new Date().toISOString(),
          },
        ],
      };
    
    case 'activity':
      return {
        type: 'activity_update',
        activities: [
          {
            id: `activity-${Date.now()}`,
            type: (['threat', 'action', 'update', 'alert'] as const)[Math.floor(Math.random() * 4)],
            message: generateActivityMessage(),
            timestamp: new Date().toISOString(),
          },
        ],
      };
    
    default:
      return {
        type: 'metric_update',
        metrics: {
          activeThreats: Math.floor(Math.random() * 50),
          resolvedToday: Math.floor(Math.random() * 30),
          avgResponseTime: Math.floor(Math.random() * 120),
        },
      };
  }
}

function generateActivityMessage(): string {
  const messages = [
    'New threat detected in sector 7',
    'Firewall rules updated successfully',
    'Suspicious activity blocked',
    'System scan completed',
    'Threat intelligence feed updated',
    'Incident response team mobilized',
    'Network segmentation applied',
    'Security patch deployed',
  ];
  
  return messages[Math.floor(Math.random() * messages.length)] as string;
}