import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { NarrativeCard } from '@/components/shared/narrative-card';
import { ActionGrid } from '@/components/shared/action-grid';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { narratives } from '@/lib/data'; // Import the mock data

// This is a placeholder for the actual data fetching
const getLandingContent = async (locale: string) => {
  const filePath = path.join(process.cwd(), `src/app/_content/landing.copy.json`);
  const fileContent = await fs.readFile(filePath, 'utf8');
  const allContent = JSON.parse(fileContent);
  return allContent;
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const content = await getLandingContent(locale);
  return {
    title: content.hero.title,
    description: content.hero.subtitle,
  };
}

export default async function LandingPage({ params: { locale } }: { params: { locale: string } }) {
  const content = await getLandingContent(locale);

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold md:text-6xl">{content.hero.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{content.hero.subtitle}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/auth/join" className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground">
            {content.hero.cta_primary}
          </Link>
          <Link href="/dashboard/war-machine" className="inline-block rounded-md bg-secondary px-6 py-3 text-secondary-foreground">
            {content.hero.cta_secondary}
          </Link>
        </div>
        <div className="mt-8">
          <LocaleSwitcher />
        </div>
      </header>

      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">{content.narratives.title}</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {narratives.slice(0, 3).map((narrative) => (
            <NarrativeCard key={narrative.id} narrative={narrative} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">{content.action_grid.title}</h2>
        <div className="mt-8">
          <ActionGrid />
        </div>
      </section>
    </div>
  );
}
