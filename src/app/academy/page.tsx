import { AcademyClient } from './_components/academy-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Academy',
  description: 'Learn the art and science of information warfare.',
};

export default function AcademyPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Academy
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Knowledge is your primary weapon.
        </p>
      </header>
      <AcademyClient />
    </div>
  );
}