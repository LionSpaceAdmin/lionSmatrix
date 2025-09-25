"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';

export function BriefHeader() {
    const headerImage = PlaceHolderImages.find(p => p.id === 'daily-brief-header');
    const [dateString, setDateString] = useState('');

    useEffect(() => {
        setDateString(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

    return (
        <section className="relative w-full h-64 flex items-center justify-center text-center">
            {headerImage && (
              <Image
                src={headerImage.imageUrl}
                alt={headerImage.description}
                fill
                className="object-cover object-center opacity-20"
                data-ai-hint={headerImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            <div className="relative z-10 container px-4 md:px-6">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
                Daily Intelligence Brief
              </h1>
              {dateString ? (
                 <p className="mt-2 text-muted-foreground md:text-lg">{dateString}</p>
              ) : (
                <div className="h-7 mt-2 w-64 bg-muted/50 animate-pulse rounded-md mx-auto" />
              )}
            </div>
      </section>
    )
}
