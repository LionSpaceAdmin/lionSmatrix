import { Suspense } from 'react';
import { ArchiveClient } from './_components/archive-client';

export const metadata = {
  title: 'Narrative Archive',
  description: 'Search and filter through the archive of narratives.',
};

function ArchiveSkeleton() {
  // A simple skeleton for the whole filter + grid area
  return (
    <div className="space-y-8">
      <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-48 w-full rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function ArchivePage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Narrative Archive
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Explore past and present information operations.
        </p>
      </header>
      <Suspense fallback={<ArchiveSkeleton />}>
        <ArchiveClient />
      </Suspense>
    </div>
  );
}
