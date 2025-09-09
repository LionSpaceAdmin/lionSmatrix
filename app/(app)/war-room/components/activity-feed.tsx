'use client';

interface Activity {
  id: string;
  type: 'threat' | 'action' | 'update' | 'alert';
  message: string;
  timestamp: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-gray-950 rounded-lg p-4 h-64 overflow-y-auto">
      <h3 className="text-green-400 font-mono text-sm mb-3 sticky top-0 bg-gray-950">
        ACTIVITY FEED
      </h3>
      <div className="space-y-2">
        {activities.length === 0 ? (
          <p className="text-green-600/50 text-xs font-mono">No recent activity</p>
        ) : (
          activities.map(activity => (
            <div 
              key={activity.id}
              className={`p-2 rounded border-l-2 ${
                activity.type === 'threat' ? 'border-red-500 bg-red-900/10' :
                activity.type === 'alert' ? 'border-yellow-500 bg-yellow-900/10' :
                activity.type === 'action' ? 'border-blue-500 bg-blue-900/10' :
                'border-green-500 bg-green-900/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-green-400 font-mono text-xs flex-1">
                  {activity.message}
                </p>
                <span className="text-green-600/50 font-mono text-xs ml-2">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}