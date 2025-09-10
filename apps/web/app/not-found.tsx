import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold animate-pulse">404</h1>
        <h2 className="text-2xl">Signal Lost</h2>
        <p className="text-green-400/60 max-w-md mx-auto">
          The truth you seek is not at this location. 
          The matrix has shifted, or this path never existed.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 border border-green-400 rounded-md hover:bg-green-400/10 transition-colors"
        >
          Return to Base
        </Link>
      </div>
    </div>
  );
}