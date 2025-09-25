import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Enterprise Solutions',
  description: 'Advanced tools and support for organizations.',
};

const features = [
    { feature: 'Team Dashboards', community: true, enterprise: true },
    { feature: 'API Access', community: false, enterprise: true },
    { feature: 'Dedicated Support', community: false, enterprise: true },
    { feature: 'Custom Integrations', community: false, enterprise: true },
];

export default function EnterprisePage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Lions of Zion for Enterprise
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Powering the world's leading OSINT and threat intelligence teams.
        </p>
      </header>

      <div className="mx-auto max-w-4xl">
        <div className="overflow-x-auto rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60%]">Feature</TableHead>
                        <TableHead className="text-center">Community</TableHead>
                        <TableHead className="text-center">Enterprise</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {features.map((item) => (
                        <TableRow key={item.feature}>
                            <TableCell className="font-medium">{item.feature}</TableCell>
                            <TableCell className="text-center">{item.community && <Check className="inline-block h-5 w-5 text-primary" />}</TableCell>
                            <TableCell className="text-center">{item.enterprise && <Check className="inline-block h-5 w-5 text-primary" />}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold">Ready to get started?</h2>
            <p className="mt-2 text-muted-foreground">
                Contact our sales team to learn more about our enterprise offerings.
            </p>
            <Button asChild size="lg" className="mt-6">
                <Link href="/contact">Contact Sales</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}