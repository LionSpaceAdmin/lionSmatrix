import { NarrativeCard } from '@/components/shared/narrative-card';
import { ActionGrid } from '@/components/shared/action-grid';
import { ProvenanceBadge } from '@/components/shared/provenance-badge';
import content from './_content/landing.copy.json';
import { narratives } from '@/lib/data';

export default function LandingPage() {
  return (
    <main>
      <section className="hero">
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
        <button>{content.hero.cta_primary}</button>
        <button>{content.hero.cta_secondary}</button>
        <ProvenanceBadge verdict="Unverified" />
      </section>
      <section className="narratives grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {narratives.slice(0, 3).map((narrative) => (
          <NarrativeCard key={narrative.id} narrative={narrative} />
        ))}
      </section>
      <section className="actions">
        <ActionGrid />
      </section>
    </main>
  );
}
