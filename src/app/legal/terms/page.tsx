import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms of service for using the Lions of Zion platform.',
};

export default function TermsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-muted-foreground">Last updated: 2025-09-23</p>
        </header>

        <article className="prose prose-invert mx-auto">
          <h2 id="acceptance">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Lions of Zion platform, you agree to be bound by these Terms of Service.
          </p>

          <h2 id="use-of-service">2. Use of Service</h2>
          <p>
            You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service to conduct any activity that would constitute a civil or criminal offense.
          </p>

          <h2 id="disclaimers">3. Disclaimers</h2>
          <p>
            The service is provided on an "as is" and "as available" basis. We disclaim all warranties of any kind, whether express or implied.
          </p>
        </article>
      </div>
    </div>
  );
}
