import Link from 'next/link';

export function Header() {
  return (
    <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      <Link href="/" className="font-bold">
        Lions of Zion
      </Link>
      <nav>
        {/* Placeholder for navigation links */}
      </nav>
    </header>
  );
}
