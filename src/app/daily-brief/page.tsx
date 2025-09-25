import { narratives } from '@/lib/data';
import { NarrativeCard } from '@/components/shared/narrative-card';
import { DailyBriefSummary } from './_components/daily-brief-summary';
import { BriefHeader } from './_components/brief-header';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { UseNowSnippet } from '@/components/ui/use-now-snippet';

export const metadata = {
  title: 'Daily Brief',
};

async function NarrativeGrid() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (narratives.length === 0) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        No active narratives to display.
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {narratives.map((narrative) => (
        <NarrativeCard key={narrative.id} narrative={narrative} />
      ))}
    </div>
  );
}

function NarrativeGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DailyBriefPage() {
  return (
    <div>
      <BriefHeader />
      <div className="container py-12 md:py-16 space-y-12">
        <DailyBriefSummary />
        <section>
          <h2 className="text-3xl font-headline font-bold tracking-tighter mb-8">
            Active Narratives
          </h2>
          <Suspense fallback={<NarrativeGridSkeleton />}>
            {/* @ts-expect-error Server Component */}
            <NarrativeGrid />
          </Suspense>
        </section>
        <section className="text-center">
          <h2 className="text-2xl font-bold">Use this in your own project</h2>
          <UseNowSnippet />
        </section>
      </div>
    </div>
  );
}
