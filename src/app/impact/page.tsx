import dynamic from 'next/dynamic';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ImpactChart = dynamic(() =>
  import('./_components/impact-chart').then(mod => mod.ImpactChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />
  }
);

const kpiData = [
  { title: 'Narratives Countered', value: '1,204' },
  { title: 'Reach Reduction', value: '75%' },
  { title: 'Avg. Time to Detect', value: '4.2h' },
  { title: 'Citizen Reports', value: '8,921' },
];

export const metadata = {
  title: 'Impact',
  description: 'Measuring our impact in the fight against disinformation.',
};

export default function ImpactPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Our Impact
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Quantifying our efforts in the global information war.
        </p>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardTitle>{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Impact Over Time</h2>
        <ImpactChart />
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Methodology</h2>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do we measure reach reduction?</AccordionTrigger>
            <AccordionContent>
              Reach reduction is calculated by comparing the projected viral spread of a narrative against its actual spread after our intervention.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What is "Time to Detect"?</AccordionTrigger>
            <AccordionContent>
              This is the average time from the first detection of a new disinformation narrative to its classification and the initiation of a counter-campaign.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
