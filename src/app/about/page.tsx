import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the mission and principles of Lions of Zion.',
};

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
            About Lions of Zion
          </h1>
          <p className="mt-2 text-muted-foreground md:text-lg">
            Our mission, our funding, and our commitment to truth.
          </p>
        </header>

        <article className="prose prose-invert mx-auto">
          <h2>Our Mission</h2>
          <p>
            Our mission is to build a global, decentralized network of digital warriors dedicated to identifying, analyzing, and countering disinformation at scale. We believe that a free and open society depends on a shared understanding of reality, which is currently under threat from malicious actors.
          </p>

          <h2>Funding Transparency</h2>
          <p>
            Lions of Zion is a non-profit organization funded by a consortium of philanthropic foundations and individual donors committed to press freedom and democratic values. We do not accept funding from governments or political parties. A full list of our donors is available on our <Link href="/trust/transparency">transparency page</Link>.
          </p>

          <h2>Data Handling</h2>
          <p>
            We are committed to the ethical handling of data. All data is processed in accordance with our strict privacy policy. We do not collect personally identifiable information (PII) from our users unless explicitly provided, for example, through our secure reporting channels. Read our full <Link href="/legal/privacy">privacy policy</Link>.
          </p>

          <h2>Provenance Policy</h2>
          <p>
            Every piece of analysis we produce is backed by verifiable evidence. We adhere to the C2PA standard for content provenance and authenticity, ensuring that our work is transparent and trustworthy. Learn more about our <Link href="/trust/provenance">provenance standards</Link>.
          </p>
        </article>
      </div>
    </div>
  );
}
