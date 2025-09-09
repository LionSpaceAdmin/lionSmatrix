'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for managing focus traps in modals and complex components
 * Ensures keyboard navigation stays within the specified container
 */
export function useFocusTrap(active: boolean = false) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Store the currently focused element
    lastFocusedElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus the first element
    if (firstFocusable) {
      firstFocusable.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab (backward)
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab (forward)
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to the previously focused element
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    };
  }, [active]);

  return containerRef;
}

/**
 * Hook for managing keyboard navigation in dropdown menus and lists
 */
export function useKeyboardNavigation<T extends HTMLElement = HTMLElement>(
  items: T[],
  onSelect?: (item: T, index: number) => void
) {
  const activeIndex = useRef(-1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        activeIndex.current = Math.min(activeIndex.current + 1, items.length - 1);
        items[activeIndex.current]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        activeIndex.current = Math.max(activeIndex.current - 1, 0);
        items[activeIndex.current]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        activeIndex.current = 0;
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        activeIndex.current = items.length - 1;
        items[items.length - 1]?.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex.current >= 0 && onSelect) {
          const item = items[activeIndex.current];
          if (item !== undefined) {
            onSelect(item, activeIndex.current);
          }
        }
        break;
    }
  }, [items, onSelect]);

  return { handleKeyDown, activeIndex: activeIndex.current };
}

/**
 * Hook for managing accessible loading states with screen reader announcements
 */
export function useLoadingAnnouncement() {
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;
      
      // Clear the announcement after a delay to allow for re-announcements
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  const LiveRegion = useCallback(() => {
    return React.createElement('div', {
      ref: announcementRef,
      className: 'sr-only',
      'aria-live': 'polite',
      'aria-atomic': 'true'
    });
  }, []);

  return { announce, LiveRegion };
}

/**
 * Hook for managing skip links for keyboard navigation
 */
export function useSkipLinks() {
  const skipLinksRef = useRef<HTMLDivElement>(null);

  const SkipLinks = useCallback(({ links }: { links: Array<{ href: string; text: string }> }) => {
    return React.createElement('div', 
      { ref: skipLinksRef, className: 'skip-links' },
      ...links.map((link, index) => 
        React.createElement('a', {
          key: index,
          href: link.href,
          className: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-terminal-cyan focus:text-terminal-bg focus:font-mono focus:text-sm'
        }, link.text)
      )
    );
  }, []);

  return { SkipLinks };
}

/**
 * Hook for generating unique IDs for ARIA relationships
 */
export function useUniqueId(prefix: string = 'id'): string {
  const id = useRef<string | undefined>(undefined);
  
  if (!id.current) {
    id.current = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return id.current;
}

/**
 * Hook for managing ARIA expanded state with keyboard support
 */
export function useExpandable(initialExpanded: boolean = false) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonId = useUniqueId('expandable-button');
  const contentId = useUniqueId('expandable-content');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && expanded) {
      setExpanded(false);
      buttonRef.current?.focus();
    }
  }, [expanded]);

  useEffect(() => {
    if (expanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [expanded, handleKeyDown]);

  const toggle = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  return {
    expanded,
    toggle,
    buttonProps: {
      ref: buttonRef,
      id: buttonId,
      'aria-expanded': expanded,
      'aria-controls': contentId,
    },
    contentProps: {
      ref: contentRef,
      id: contentId,
      'aria-labelledby': buttonId,
      hidden: !expanded,
    },
  };
}