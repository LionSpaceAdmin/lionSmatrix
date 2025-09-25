import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-8rem)] items-center justify-center text-center">
      <div>
        <h1
          className="text-6xl font-bold font-headline"
          aria-live="assertive"
          tabIndex={-1}
        >
          404
        </h1>
        <p className="mt-4 text-2xl font-semibold">Page Not Found</p>
        <p className="mt-2 text-muted-foreground">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/search">Search</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/daily-brief">Daily Brief</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
