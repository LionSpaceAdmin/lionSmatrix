import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

const threatIndicatorVariants = cva(
  'inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors',
  {
    variants: {
      level: {
        low: 'bg-intelligence-secure/20 text-intelligence-secure border-intelligence-secure/50',
        medium: 'bg-intelligence-warning/20 text-intelligence-warning border-intelligence-warning/50',
        high: 'bg-intelligence-threat/20 text-intelligence-threat border-intelligence-threat/50',
        critical: 'bg-intelligence-threat/20 text-intelligence-threat border-intelligence-threat/50 animate-pulse',
        classified: 'bg-intelligence-classified/20 text-intelligence-classified border-intelligence-classified/50',
      },
    },
    defaultVariants: {
      level: 'low',
    },
  }
);

interface ThreatIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof threatIndicatorVariants> {
  icon?: LucideIcon;
  label: string;
}

const ThreatIndicator = React.forwardRef<HTMLDivElement, ThreatIndicatorProps>(
  ({ className, level, icon: Icon, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(threatIndicatorVariants({ level }), className)}
        {...props}
      >
        {Icon && <Icon className="w-3 h-3" />}
        <span>{label}</span>
      </div>
    );
  }
);

ThreatIndicator.displayName = 'ThreatIndicator';

export { ThreatIndicator, threatIndicatorVariants };
