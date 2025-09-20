import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Verdict = 'Verified False' | 'In Dispute' | 'Unverified';

const verdictConfig = {
    'Verified False': {
        className: 'text-green-400 border-green-500/30 bg-green-500/20',
        icon: CheckCircle,
    },
    'In Dispute': {
        className: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20',
        icon: AlertTriangle,
    },
    'Unverified': {
        className: 'text-slate-400 border-slate-500/30 bg-slate-500/20',
        icon: HelpCircle,
    },
};

export function ProvenanceBadge({ verdict }: { verdict: Verdict }) {
    const config = verdictConfig[verdict];
    return (
        <Badge variant="outline" className={cn('flex items-center gap-1 text-xs', config.className)}>
            <config.icon className="h-3 w-3" />
            <span>{verdict}</span>
        </Badge>
    );
}
