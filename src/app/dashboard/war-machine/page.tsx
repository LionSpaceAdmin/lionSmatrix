import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'War Machine',
  description: 'Access the full suite of analysis and operations tools.',
};

const tools = [
  { title: 'Image Influence Lab', description: 'Analyze and generate influential imagery.', href: '/dashboard/tools/image-influence-lab', permission: 'granted' },
  { title: 'Fact-Check', description: 'Verify claims and build evidence reports.', href: '/dashboard/tools/fact-check', permission: 'granted' },
  { title: 'Report & Research', description: 'Submit content for deep analysis.', href: '/dashboard/tools/report-research', permission: 'granted' },
  { title: 'Fake Resistance Tracker', description: 'Monitor and track inauthentic amplification networks.', href: '/dashboard/tools/fake-resistance-tracker', permission: 'denied' },
  { title: 'Deep Research Daily', description: 'Your personal OSINT research workspace.', href: '/dashboard/tools/deep-research-daily', permission: 'granted' },
  { title: 'Campaign Manager', description: 'Design and launch counter-campaigns.', href: '/dashboard/campaigns', permission: 'granted' },
];

export default function WarMachinePage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          War Machine
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Your arsenal for the information war.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.title} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow" />
            <CardFooter className="flex justify-between items-center">
              <Badge variant={tool.permission === 'granted' ? 'default' : 'destructive'}>
                {tool.permission === 'granted' ? <Check className="h-4 w-4 mr-1" /> : <Lock className="h-4 w-4 mr-1" />}
                {tool.permission === 'granted' ? 'Access Granted' : 'Permission Denied'}
              </Badge>
              <Button asChild disabled={tool.permission === 'denied'}>
                <Link href={tool.href}>Open</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
