import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { actions } from '@/lib/data';
import { CheckCircle, Flag, BookOpen, UserPlus } from 'lucide-react';
import Link from 'next/link';

const iconMap = {
    CheckCircle,
    Flag,
    BookOpen,
    UserPlus,
};

export function ActionGrid() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action) => {
                const Icon = iconMap[action.icon as keyof typeof iconMap];
                return (
                <Link href={action.href} key={action.title} className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                    <Card className="h-full bg-card/50 hover:bg-card/90 transition-colors border-border hover:border-primary">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Icon className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle className="font-headline">{action.title}</CardTitle>
                                    <CardDescription>{action.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>
                );
            })}
        </div>
    );
}
