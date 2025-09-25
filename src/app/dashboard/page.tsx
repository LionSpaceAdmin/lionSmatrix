import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ThreatStrip } from './_components/threat-strip';
import { MyMissions } from './_components/my-missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your command center for fighting disinformation.',
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

async function DashboardContent() {
  // Simulate data fetching
  await new Promise(resolve => setTimeout(resolve, 1000));

  return (
    <div className="space-y-6">
      <ThreatStrip />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MyMissions />
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild><Link href="/dashboard/tools/fact-check">Fact-Check a Claim</Link></Button>
            <Button asChild variant="secondary"><Link href="/dashboard/tools/report-research">Report Content</Link></Button>
            <Button asChild variant="ghost"><Link href="/dashboard/war-machine">Explore All Tools</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold tracking-tighter">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, operative.
        </p>
      </header>
      <Suspense fallback={<DashboardSkeleton />}>
        {/* @ts-expect-error Server Component */}
        <DashboardContent />
      </Suspense>
    </div>
  );
}
