import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-network');

  return (
    <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[75vh]">
        <div className="absolute top-0 w-full h-full bg-center bg-cover">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover object-center opacity-20"
                    data-ai-hint={heroImage.imageHint}
                    priority
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <div className="container relative mx-auto">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Countering Disinformation, Together.
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-muted-foreground md:text-xl">
                    Zion's Shield is a collective defense platform against digital threats. We identify, analyze, and combat coordinated misinformation campaigns in real-time.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="#">Join the fight — Free</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                        <Link href="#">Explore the War Machine</Link>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
