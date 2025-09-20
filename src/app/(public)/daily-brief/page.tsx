import { narratives } from '@/lib/data';
import { NarrativeCard } from '@/components/shared/narrative-card';
import { DailyBriefSummary } from './_components/daily-brief-summary';
import { BriefHeader } from './_components/brief-header';

export const metadata = {
  title: 'Daily Brief',
};

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {narratives.map((narrative) => (
              <NarrativeCard key={narrative.id} narrative={narrative} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
