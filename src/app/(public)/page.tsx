import { Hero } from './_components/hero';
import { narratives } from '@/lib/data';
import { NarrativeCard } from '@/components/shared/narrative-card';
import { ActionGrid } from '@/components/shared/action-grid';

export default function HomePage() {
  const featuredNarratives = narratives.slice(0, 3);
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="container py-12 md:py-24 space-y-24">
        <section>
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Top Narratives Under Watch</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              These are the most pressing disinformation threats we are currently tracking.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNarratives.map((narrative) => (
              <NarrativeCard key={narrative.id} narrative={narrative} />
            ))}
          </div>
        </section>
        <section>
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Your Mission Hub</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Directly contribute to the fight against disinformation. Here's how you can take action now.
            </p>
          </div>
          <ActionGrid />
        </section>
      </div>
    </div>
  );
}
