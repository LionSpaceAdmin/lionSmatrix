'use client';

import React, { forwardRef, useMemo, useRef, useImperativeHandle } from 'react';
import { useVirtualScrolling } from '@/lib/hooks/usePerformanceOptimizations';
import { cn } from '@/lib/utils';

interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  className?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onScrollEnd?: () => void;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

interface VirtualScrollListRef {
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
}

function VirtualScrollListComponent<T>(
  {
    items,
    itemHeight,
    height,
    className,
    renderItem,
    overscan = 5,
    onScrollEnd,
    loading = false,
    loadingComponent,
    emptyComponent
  }: VirtualScrollListProps<T>,
  ref: React.Ref<VirtualScrollListRef>
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const { visibleItems, totalHeight } = useVirtualScrolling(items, {
    itemHeight,
    containerHeight: height,
    overscan,
    scrollElement: scrollElementRef
  });

  // Handle scroll end detection
  const handleScroll = useMemo(() => {
    if (!onScrollEnd) return undefined;

    let timeoutId: NodeJS.Timeout;
    
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const element = scrollElementRef.current;
        if (element) {
          const { scrollTop, scrollHeight, clientHeight } = element;
          const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
          
          if (isNearBottom) {
            onScrollEnd();
          }
        }
      }, 150);
    };
  }, [onScrollEnd]);

  // Expose scroll methods via ref
  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number) => {
      const element = scrollElementRef.current;
      if (element) {
        const scrollTop = index * itemHeight;
        element.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    },
    scrollToTop: () => {
      const element = scrollElementRef.current;
      if (element) {
        element.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }), [itemHeight]);

  // Show empty state if no items
  if (!loading && items.length === 0) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center",
          className
        )}
        style={{ height }}
      >
        {emptyComponent || (
          <div className="text-center text-muted-foreground">
            <p>No items to display</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ height }}
    >
      <div
        ref={scrollElementRef}
        className="h-full overflow-auto"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent'
        }}
      >
        {/* Total height spacer for scrollbar */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible items */}
          {visibleItems.items.map(({ item, index, offsetY }) => (
            <div
              key={index}
              className="absolute w-full"
              style={{
                height: itemHeight,
                top: offsetY
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
          
          {/* Loading indicator at the bottom */}
          {loading && (
            <div
              className="absolute w-full flex items-center justify-center"
              style={{
                height: itemHeight,
                top: totalHeight
              }}
            >
              {loadingComponent || (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export with forwardRef wrapper to maintain TypeScript types
export const VirtualScrollList = forwardRef(VirtualScrollListComponent) as <T>(
  props: VirtualScrollListProps<T> & { ref?: React.Ref<VirtualScrollListRef> }
) => React.ReactElement;

/**
 * Optimized OSINT Archive List Component
 * Uses virtual scrolling for large datasets
 */
interface OSINTArchiveItem {
  Name: string;
  Platform: string;
  Audience: number;
  Narrative: string;
  Affiliation: string;
}

interface OSINTArchiveListProps {
  items: OSINTArchiveItem[];
  onItemClick?: (item: OSINTArchiveItem) => void;
  className?: string;
}

export function OSINTArchiveList({ 
  items, 
  onItemClick, 
  className 
}: OSINTArchiveListProps) {
  const renderItem = (item: OSINTArchiveItem, index: number) => (
    <div
      className={cn(
        "flex items-center space-x-4 p-4 border-b border-border/40",
        "hover:bg-accent/50 transition-colors cursor-pointer",
        onItemClick && "cursor-pointer"
      )}
      onClick={() => onItemClick?.(item)}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-sm">{item.Name}</h3>
          <span className="text-xs text-muted-foreground">
            {item.Platform}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {item.Narrative}
        </p>
        <div className="flex items-center space-x-4 mt-2 text-xs">
          <span className="text-blue-400">
            {item.Audience.toLocaleString()} followers
          </span>
          <span className="text-orange-400">
            {item.Affiliation}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <VirtualScrollList
      items={items}
      itemHeight={100}
      height={600}
      renderItem={renderItem}
      className={className}
      emptyComponent={
        <div className="text-center text-muted-foreground">
          <p>No OSINT data available</p>
        </div>
      }
    />
  );
}

/**
 * Optimized Threat List Component
 * Uses virtual scrolling for large threat datasets
 */
interface ThreatItem {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: string;
  description: string;
}

interface ThreatListProps {
  threats: ThreatItem[];
  onThreatClick?: (threat: ThreatItem) => void;
  className?: string;
}

export function ThreatList({ 
  threats, 
  onThreatClick, 
  className 
}: ThreatListProps) {
  const getSeverityColor = (severity: ThreatItem['severity']) => {
    const colors = {
      low: 'text-green-400 bg-green-400/10',
      medium: 'text-yellow-400 bg-yellow-400/10',
      high: 'text-orange-400 bg-orange-400/10',
      critical: 'text-red-400 bg-red-400/10'
    };
    return colors[severity];
  };

  const renderThreat = (threat: ThreatItem, index: number) => (
    <div
      className={cn(
        "flex items-start space-x-4 p-4 border-b border-border/40",
        "hover:bg-accent/50 transition-colors",
        onThreatClick && "cursor-pointer"
      )}
      onClick={() => onThreatClick?.(threat)}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="font-semibold text-sm">{threat.title}</h3>
          <span 
            className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              getSeverityColor(threat.severity)
            )}
          >
            {threat.severity.toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {threat.description}
        </p>
        <div className="flex items-center space-x-4 text-xs">
          <span className="text-blue-400">
            Source: {threat.source}
          </span>
          <span className="text-muted-foreground">
            {new Date(threat.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <VirtualScrollList
      items={threats}
      itemHeight={120}
      height={600}
      renderItem={renderThreat}
      className={className}
      emptyComponent={
        <div className="text-center text-muted-foreground">
          <p>No threats detected</p>
        </div>
      }
    />
  );
}