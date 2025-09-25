import { SearchClient } from './_components/search-client';

export const metadata = {
  title: 'Search',
  description: 'Search across all Lions of Zion resources.',
};

export default function SearchPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Search
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Find what you're looking for, fast.
        </p>
      </header>
      <div className="max-w-xl mx-auto">
        <SearchClient />
      </div>
    </div>
  );
}
