import { ReportForm } from './_components/report-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report & Research',
  description: 'Submit suspicious content for deep analysis by our team.',
};

export default function ReportResearchPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Report for Research
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Help us identify and analyze new threats.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <ReportForm />
      </div>
    </div>
  );
}
