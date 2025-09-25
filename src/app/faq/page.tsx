import { FaqClient } from './_components/faq-client';

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about Lions of Zion.',
};

export default function FaqPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Frequently Asked Questions
        </h1>
      </header>
      <div className="max-w-3xl mx-auto">
        <FaqClient />
      </div>
    </div>
  );
}
