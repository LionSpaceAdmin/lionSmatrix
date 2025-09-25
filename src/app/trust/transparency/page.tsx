import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Transparency Center',
  description: 'Our commitment to transparency and accountability.',
};

export default function TransparencyPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Transparency Center
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Building trust through open and honest practices.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Content Provenance</CardTitle>
            <CardDescription>How we verify our sources and analysis.</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button asChild className="w-full"><Link href="/trust/provenance">Learn More</Link></Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
            <CardDescription>Request an export of your personal data.</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button asChild className="w-full"><Link href="/trust/dsr">Request Export</Link></Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Data Deletion</CardTitle>
            <CardDescription>Request the deletion of your personal data.</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button asChild variant="destructive" className="w-full"><Link href="/trust/dsr">Request Deletion</Link></Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}