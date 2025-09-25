import { PlaybooksClient } from './_components/playbooks-client';

export const metadata = {
  title: 'Playbooks',
  description: 'Browse and use playbooks for your information operations.',
};

export default function PlaybooksPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Playbooks
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Select a playbook to start a new campaign.
        </p>
      </header>
      <PlaybooksClient />
    </div>
  );
}
