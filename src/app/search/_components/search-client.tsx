"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock search index
const mockIndex = [
  { type: 'Narrative', title: 'Disinformation Campaign Detected', href: '/archive/narrative-1' },
  { type: 'Narrative', title: 'New Deepfake Technology', href: '/archive/narrative-2' },
  { type: 'Playbook', title: 'Counter-Disinformation', href: '/playbooks' },
  { type: 'Article', title: 'Understanding Information Warfare', href: '/academy/info-warfare' },
];

export function SearchClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockIndex>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = useCallback((currentQuery: string) => {
    if (currentQuery.length > 1) {
      const filtered = mockIndex.filter(item =>
        item.title.toLowerCase().includes(currentQuery.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
      setActiveIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  const debouncedSearch = useCallback(debounce(performSearch, 300), [performSearch]);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        router.push(results[activeIndex].href);
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeIndex, results, isOpen, router]);

  return (
    <div className="relative" ref={containerRef}>
      <Input
        placeholder="Search the archive, playbooks, and academy..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setIsOpen(true)}
      />
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-10">
          <CardContent className="p-2 max-h-80 overflow-y-auto">
            {results.map((item, index) => (
              <Link
                key={`${item.type}-${item.title}`}
                href={item.href}
                className={`block p-2 rounded-md text-sm ${activeIndex === index ? 'bg-muted' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setIsOpen(false)}
              >
                <p className="font-bold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.type}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
