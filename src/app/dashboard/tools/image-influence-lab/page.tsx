import { ImageLabClient } from './_components/image-lab-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Influence Lab',
  description: 'Analyze and generate influential imagery.',
};

export default function ImageLabPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Image Influence Lab
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Upload an image to analyze its potential influence.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ImageLabClient />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
                <CardTitle>Safety Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Do not upload sensitive or personal images.</li>
                <li>Ensure you have the rights to the images you upload.</li>
                <li>Analysis is for research purposes only.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
