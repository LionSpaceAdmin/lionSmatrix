'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { VirtualScrollList, OSINTArchiveList } from '@/components/performance/VirtualScrollList';
import { AnimatedCanvas } from '@/components/performance/AnimatedCanvas';
import { useDebounce, useIdleCallback } from '@/lib/hooks/usePerformanceOptimizations';
import { extendedOsintData, deepDives, wordBank } from '@/lib/data/osint-extended';
import { cn } from '@/lib/utils';

interface OSINTActor {
  Name: string;
  Platform: string;
  Audience: number;
  Narrative: string;
  Affiliation: string;
}

interface OSINTArchiveOptimizedProps {
  className?: string;
}

export function OSINTArchiveOptimized({ className }: OSINTArchiveOptimizedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActor, setSelectedActor] = useState<OSINTActor | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'audience' | 'name' | 'platform'>('audience');
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search to prevent excessive filtering
  const debouncedSearch = useDebounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  // Use idle callback for non-critical data processing
  useIdleCallback(() => {
    // Pre-process data for better performance
    console.log('Background processing: analyzing OSINT patterns...');
  }, [extendedOsintData]);

  // Optimized filtering and sorting
  const filteredAndSortedData = useMemo(() => {
    let filtered = extendedOsintData;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(actor => 
        actor.Name.toLowerCase().includes(term) ||
        actor.Platform.toLowerCase().includes(term) ||
        actor.Narrative.toLowerCase().includes(term) ||
        actor.Affiliation.toLowerCase().includes(term)
      );
    }

    // Filter by platform
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(actor => 
        actor.Platform.toLowerCase().includes(filterPlatform.toLowerCase())
      );
    }

    // Sort data
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'audience':
          return b.Audience - a.Audience;
        case 'name':
          return a.Name.localeCompare(b.Name);
        case 'platform':
          return a.Platform.localeCompare(b.Platform);
        default:
          return 0;
      }
    });
  }, [searchTerm, filterPlatform, sortBy]);

  // Get unique platforms for filter dropdown
  const platforms = useMemo(() => {
    const unique = new Set(extendedOsintData.map(actor => actor.Platform));
    return Array.from(unique);
  }, []);

  const handleActorClick = useCallback((actor: OSINTActor) => {
    setSelectedActor(actor);
  }, []);

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Simulate loading more data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <AnimatedCanvas 
      className={cn("w-full", className)}
      priority="medium"
      respectReducedMotion
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            OSINT Archive
          </h1>
          <p className="text-muted-foreground">
            Comprehensive database of {extendedOsintData.length} analyzed information warfare actors
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Search Actors
            </label>
            <input
              type="text"
              placeholder="Search by name, platform, narrative..."
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
              Filter by Platform
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
              <option value="all">All Platforms</option>
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
              <option value="audience">Audience Size</option>
              <option value="name">Name</option>
              <option value="platform">Platform</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedData.length} of {extendedOsintData.length} actors
          </div>
          <div className="text-sm text-muted-foreground">
            Total Audience: {filteredAndSortedData.reduce((sum, actor) => sum + actor.Audience, 0).toLocaleString()}
          </div>
        </div>

        {/* Virtual Scrolled List */}
        <div className="border border-border rounded-lg overflow-hidden">
          <OSINTArchiveList
            items={filteredAndSortedData}
            onItemClick={handleActorClick}
            className="bg-background"
          />
        </div>

        {/* Word Bank for Context */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Intelligence Keywords
          </h2>
          <div className="flex flex-wrap gap-2">
            {wordBank.map((word, index) => (
              <span
                key={index}
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  "bg-secondary text-secondary-foreground",
                  "hover:bg-secondary/80 transition-colors cursor-pointer"
                )}
                onClick={() => debouncedSearch(word)}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Selected Actor Details Modal */}
        {selectedActor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedActor.Name}
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
                      Platform
                    </label>
                    <p className="text-foreground">{selectedActor.Platform}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Audience
                    </label>
                    <p className="text-foreground">
                      {selectedActor.Audience.toLocaleString()} followers
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Narrative
                    </label>
                    <p className="text-foreground">{selectedActor.Narrative}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Affiliation
                    </label>
                    <p className="text-foreground">{selectedActor.Affiliation}</p>
                  </div>
                </div>

                {/* Deep Dive Report if Available */}
                {deepDives[selectedActor.Name] && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Intelligence Report
                    </label>
                    <div 
                      className="prose prose-sm max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ 
                        __html: deepDives[selectedActor.Name].report 
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedCanvas>
  );
}