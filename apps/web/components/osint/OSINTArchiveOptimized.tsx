'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { OSINTArchiveList } from '@/components/performance/VirtualScrollList';
import { AnimatedCanvas } from '@/components/performance/AnimatedCanvas';
import { useDebounce } from '@/lib/hooks/usePerformanceOptimizations';
import { mergedOsintActors } from '@/lib/data/intelligence-merged';
import { OSINTActor } from '@/types/intelligence';
import { cn } from '@/lib/utils';

interface OSINTArchiveOptimizedProps {
  className?: string;
}

export function OSINTArchiveOptimized({ className }: OSINTArchiveOptimizedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActor, setSelectedActor] = useState<OSINTActor | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');

  const debouncedSearch = useDebounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  const filteredAndSortedData = useMemo(() => {
    let filtered = mergedOsintActors;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(actor =>
        actor.name.toLowerCase().includes(term) ||
        actor.description.toLowerCase().includes(term) ||
        (actor.aliases && actor.aliases.some(alias => alias.toLowerCase().includes(term)))
      );
    }

    if (filterPlatform !== 'all') {
      filtered = filtered.filter(actor =>
        actor.type.toLowerCase() === filterPlatform.toLowerCase()
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }, [searchTerm, filterPlatform, sortBy]);

  const platforms = useMemo(() => {
    const unique = new Set(mergedOsintActors.map(actor => actor.type));
    return Array.from(unique);
  }, []);

  const handleActorClick = useCallback((actor: OSINTActor) => {
    setSelectedActor(actor);
  }, []);

  return (
    <AnimatedCanvas
      className={cn("w-full", className)}
      priority="medium"
      respectReducedMotion
    >
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            OSINT Archive
          </h1>
          <p className="text-muted-foreground">
            Comprehensive database of {mergedOsintActors.length} analyzed information warfare actors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Search Actors
            </label>
            <input
              type="text"
              placeholder="Search by name, description, alias..."
              className={cn(
                "w-full px-3 py-2 border border-border rounded-md",
                "bg-background text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Filter by Type
            </label>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border border-border rounded-md",
                "bg-background text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
            >
              <option value="all">All Types</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={cn(
                "w-full px-3 py-2 border border-border rounded-md",
                "bg-background text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
            >
              <option value="name">Name</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedData.length} of {mergedOsintActors.length} actors
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <OSINTArchiveList
            items={filteredAndSortedData as any} // Cast here until OSINTArchiveItem is fixed
            onItemClick={handleActorClick}
            className="bg-background"
          />
        </div>

        {selectedActor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedActor.name}
                  </h3>
                  <button
                    onClick={() => setSelectedActor(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Type
                    </label>
                    <p className="text-foreground">{selectedActor.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Aliases
                    </label>
                    <p className="text-foreground">{selectedActor.aliases.join(', ')}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-foreground">{selectedActor.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedCanvas>
  );
}