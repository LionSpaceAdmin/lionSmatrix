import { AlertTriangle } from 'lucide-react';

export function ThreatStrip() {
  return (
    <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-4 flex items-center gap-4">
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <div>
        <p className="font-bold">High-Threat Narrative Detected</p>
        <p className="text-sm text-destructive/80">A new disinformation campaign regarding public health is gaining traction.</p>
      </div>
    </div>
  );
}
