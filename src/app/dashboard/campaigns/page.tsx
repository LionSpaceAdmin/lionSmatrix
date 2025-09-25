import { CampaignsClient } from './_components/campaigns-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaign Manager',
  description: 'Design and launch counter-campaigns.',
};

export default function CampaignsPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Campaign Manager
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Design and launch your information operations.
        </p>
      </header>
      <CampaignsClient />
    </div>
  );
}