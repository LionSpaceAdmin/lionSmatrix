'use client';

interface ParticipantsListProps {
  participants: any[];
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <div className="bg-gray-950 border border-terminal-cyan/30 rounded-lg p-6">
      <h3 className="text-lg font-bold text-terminal-cyan mb-4 font-mono">
        ACTIVE PARTICIPANTS
      </h3>
      <div className="space-y-2">
        {participants.length === 0 ? (
          <p className="text-terminal-muted font-mono text-sm">
            No active participants
          </p>
        ) : (
          participants.map((participant, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-terminal-cyan/20"
            >
              <span className="text-terminal-text font-mono text-sm">
                {participant.name || 'Unknown'}
              </span>
              <span className="text-terminal-cyan font-mono text-xs">
                {participant.role || 'Observer'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}