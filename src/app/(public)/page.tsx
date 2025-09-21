import { NarrativeCard } from '@/components/ui/narrative-card';
import { ActionGrid } from '@/components/ui/action-grid';
import { ProvenanceBadge } from '@/components/ui/provenance-badge';
import content from './_content/landing.copy.json';

export default function LandingPage() {
  return (
    <main>
      <section className="hero">
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
        <button>{content.hero.cta_primary}</button>
        <button>{content.hero.cta_secondary}</button>
        <ProvenanceBadge />
      </section>
      <section className="narratives">
        <NarrativeCard>
            <p>Narrative 1</p>
        </NarrativeCard>
        <NarrativeCard>
            <p>Narrative 2</p>
        </NarrativeCard>
        <NarrativeCard>
            <p>Narrative 3</p>
        </NarrativeCard>
      </section>
      <section className="actions">
        <ActionGrid>
            <p>Action 1</p>
            <p>Action 2</p>
            <p>Action 3</p>
            <p>Action 4</p>
        </ActionGrid>
      </section>
    </main>
  );
}
