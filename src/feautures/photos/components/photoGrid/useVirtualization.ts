import { useState, useEffect, useRef, useCallback } from 'react';
import type { MasonryItem } from './useMassonaryLayout';

export interface UseVirtualizationOptions {
  items: MasonryItem[];
  containerHeight: number;
  overscan?: number;
}

export interface UseVirtualizationResult {
  visibleItems: MasonryItem[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollY: number;
}

export function useVirtualization({
  items,
  containerHeight,
  overscan = 800,
}: UseVirtualizationOptions): UseVirtualizationResult {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setScrollY(scrollTop);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const visibleItems = items.filter((item) => {
    const itemTop = item.top;
    const itemBottom = item.top + item.height;
    const viewportTop = scrollY - overscan;
    const viewportBottom = scrollY + containerHeight + overscan;

    return itemBottom >= viewportTop && itemTop <= viewportBottom;
  });

  return {
    visibleItems,
    containerRef,
    handleScroll,
    scrollY,
  };
}

export function useContainerSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const updateSize = () => {
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return size;
}

