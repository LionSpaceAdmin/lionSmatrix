import { DeepResearchClient } from './_components/deep-research-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deep Research Daily',
  description: 'Your personal OSINT research workspace.',
};

export default function DeepResearchDailyPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Deep Research Daily
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Your private workspace for ongoing investigations.
        </p>
      </header>
      <DeepResearchClient />
    </div>
  );
}
