import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { narratives } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { EvidenceList } from '@/components/shared/evidence-list';
import { Timeline } from '@/components/shared/timeline';
import { SharePack } from '@/components/shared/share-pack';

// This function would typically fetch data from a database or CMS
const getNarrative = async (id: string) => {
  // The mock data uses narrative-1, narrative-2, etc.
  // The page will be called with just the number.
  // This is a bit of a mismatch I'll handle here.
  const narrative = narratives.find((n) => n.id === `narrative-${id}`);
  if (narrative) return narrative;
  // Fallback for direct ID match for robustness
  return narratives.find((n) => n.id === id);
};

export async function generateMetadata({ params }: { params: { narrativeId: string } }): Promise<Metadata> {
  const narrative = await getNarrative(params.narrativeId);

  if (!narrative) {
    return { title: 'Narrative Not Found' };
  }

  return {
    title: narrative.title,
    description: narrative.summary,
  };
}

export default async function NarrativeDetailPage({ params }: { params: { narrativeId: string } }) {
  const narrative = await getNarrative(params.narrativeId);

  if (!narrative) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Badge variant="secondary">{narrative.verdict}</Badge>
          <h1 className="mt-4 text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
            {narrative.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {narrative.summary}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>Severity: {narrative.severity}</span>
            <span>Evidence: {narrative.evidenceCount}</span>
            <span>Last Updated: {narrative.lastUpdated}</span>
          </div>
        </header>

        <div className="space-y-8">
          <EvidenceList />
          <Timeline />
          <SharePack />
        </div>
      </article>
    </div>
  );
}
