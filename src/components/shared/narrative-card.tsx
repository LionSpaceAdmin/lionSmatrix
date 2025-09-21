import type { Narrative } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileText, ShieldAlert, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProvenanceBadge } from './provenance-badge';

const severityConfig = {
    Critical: {
        className: 'border-red-500/30 text-red-300 bg-red-900/50',
        icon: ShieldAlert,
    },
    High: {
        className: 'border-orange-500/30 text-orange-300 bg-orange-900/50',
        icon: ShieldAlert,
    },
    Medium: {
        className: 'border-yellow-500/30 text-yellow-300',
        icon: BarChart
    },
    Low: {
        className: 'border-green-500/30 text-green-300',
        icon: BarChart
    },
};

export function NarrativeCard({ narrative }: { narrative: Narrative }) {
    const config = severityConfig[narrative.severity];

    return (
        <Card className="flex flex-col h-full bg-card/50 hover:bg-card/90 transition-colors border-border hover:border-primary/50">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="font-headline text-lg mb-2">{narrative.title}</CardTitle>
                    <Badge variant="outline" className={cn("whitespace-nowrap", config.className)}>
                        <config.icon className="h-3 w-3 mr-1" />
                        {narrative.severity}
                    </Badge>
                </div>
                <CardDescription>{narrative.summary}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{narrative.evidenceCount} pieces of evidence</span>
                    </div>
                    <ProvenanceBadge verdict={narrative.verdict} />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                 <p className="text-xs text-muted-foreground">
                    Updated {narrative.lastUpdated}
                </p>
                <Button asChild variant="secondary" size="sm">
                    <Link href={`#`}>Fact-Check</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
