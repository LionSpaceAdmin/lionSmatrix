import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Join the Mission',
  description: 'Become a part of the Lions of Zion network.',
};

const valueProps = [
  'Access to advanced analysis tools.',
  'Join a global network of digital researchers.',
  'Receive real-time intelligence briefs.',
  'Make a tangible impact in the fight for truth.',
];

const testimonials = [
  { quote: 'Lions of Zion gives us the edge we need to counter sophisticated disinfo campaigns.', author: 'Investigative Journalist' },
  { quote: 'The tools and community are unparalleled. A game-changer for OSINT.', author: 'Independent Researcher' },
];

export default function JoinPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Join the Lions of Zion
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Become a part of the global mission to defend truth.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">What You Get</h2>
          <ul className="space-y-4">
            {valueProps.map((prop) => (
              <li key={prop} className="flex items-start gap-3">
                <Check className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span>{prop}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">From the Community</h2>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author}>
              <CardContent className="pt-6">
                <blockquote className="border-l-2 pl-6 italic">
                  "{testimonial.quote}"
                  <footer className="mt-2 block text-sm font-semibold text-primary">
                    — {testimonial.author}
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/auth/onboarding">Start Onboarding</Link>
        </Button>
      </div>
    </div>
  );
}
