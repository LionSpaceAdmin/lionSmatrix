import { TrackerClient } from './_components/tracker-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fake Resistance Tracker',
  description: 'Monitor and track inauthentic amplification networks.',
};

export default function FakeResistanceTrackerPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Fake Resistance Tracker
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Monitor known and emerging inauthentic networks.
        </p>
      </header>
      <TrackerClient />
    </div>
  );
}
