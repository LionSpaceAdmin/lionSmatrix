"use client";

import { useState, useEffect, useMemo, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { narratives } from '@/lib/data';
import { NarrativeCard } from '@/components/shared/narrative-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 9;

export function ArchiveClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Filter state
  const [topic, setTopic] = useState(() => searchParams.get('topic') || '');
  const [region, setRegion] = useState(() => searchParams.get('region') || 'all');
  const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1', 10));

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (topic) {
      params.set('topic', topic);
    } else {
      params.delete('topic');
    }
    if (region !== 'all') {
      params.set('region', region);
    } else {
      params.delete('region');
    }
    params.set('page', page.toString());

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [topic, region, page, pathname, router, searchParams]);

  // Memoized filtering and pagination
  const filteredNarratives = useMemo(() => {
    return narratives.filter(n =>
      (n.title.toLowerCase().includes(topic.toLowerCase()) ||
      n.summary.toLowerCase().includes(topic.toLowerCase()))
      // Region filter would be added here if data supported it
    );
  }, [topic]);

  const paginatedNarratives = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredNarratives.slice(start, end);
  }, [filteredNarratives, page]);

  const totalPages = Math.ceil(filteredNarratives.length / ITEMS_PER_PAGE);

  return (
    <div className={isPending ? 'opacity-75 transition-opacity' : ''}>
      <div className="mb-8 flex flex-wrap gap-4">
        <Input
          placeholder="Filter by topic..."
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <Select value={region} onValueChange={(value) => { setRegion(value); setPage(1); }}>
          <SelectTrigger className="w-[180px]" aria-label="Select Region">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="us">USA</SelectItem>
            <SelectItem value="eu">Europe</SelectItem>
            <SelectItem value="me">Middle East</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNarratives.map((narrative) => (
          <NarrativeCard key={narrative.id} narrative={narrative} />
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center gap-4">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}
