import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our policy on collecting, using, and disclosing your information.',
};

export default function PrivacyPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-muted-foreground">Last updated: 2025-09-23</p>
        </header>

        <article className="prose prose-invert mx-auto">
          <h2 id="information-collection">1. Information Collection</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account or submit a report.
          </p>

          <h2 id="information-use">2. Information Use</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services.
          </p>

          <h2 id="information-sharing">3. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except as described in this policy.
          </p>
        </article>
      </div>
    </div>
  );
}
