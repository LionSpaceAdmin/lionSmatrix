import { FactCheckClient } from './_components/fact-check-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fact-Check Tool',
  description: 'Verify claims and build evidence reports.',
};

export default function FactCheckPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Fact-Check Tool
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Systematically verify claims and compile your findings.
        </p>
      </header>
      <div className="max-w-3xl mx-auto">
        <FactCheckClient />
      </div>
    </div>
  );
}
