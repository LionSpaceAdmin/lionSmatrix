import type { Metadata } from 'next';
import { ProvenanceBadge } from '@/components/shared/provenance-badge';

export const metadata: Metadata = {
  title: 'Content Provenance',
  description: 'Our commitment to content authenticity and the C2PA standard.',
};

export default function ProvenancePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
            Content Provenance
          </h1>
          <p className="mt-2 text-muted-foreground md:text-lg">
            Ensuring our analysis is transparent and trustworthy.
          </p>
        </header>

        <article className="prose prose-invert mx-auto">
          <h2>What is C2PA?</h2>
          <p>
            The Coalition for Content Provenance and Authenticity (C2PA) is an open standard that allows creators and publishers to create tamper-evident media. By binding cryptographic asset hashes to assertions made by the publisher, we can provide a verifiable trail for our content.
          </p>

          <h2>Our Provenance Badges</h2>
          <p>
            We use a simple badging system to indicate the verification status of a narrative. These badges are keyboard-navigable and include ARIA labels for accessibility.
          </p>
        </article>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="rounded-lg border bg-card p-4" tabIndex={0}>
            <h3 className="font-bold mb-2">Verified False</h3>
            <ProvenanceBadge verdict="Verified False" />
          </div>
          <div className="rounded-lg border bg-card p-4" tabIndex={0}>
            <h3 className="font-bold mb-2">In Dispute</h3>
            <ProvenanceBadge verdict="In Dispute" />
          </div>
          <div className="rounded-lg border bg-card p-4" tabIndex={0}>
            <h3 className="font-bold mb-2">Unverified</h3>
            <ProvenanceBadge verdict="Unverified" />
          </div>
        </div>
      </div>
    </div>
  );
}