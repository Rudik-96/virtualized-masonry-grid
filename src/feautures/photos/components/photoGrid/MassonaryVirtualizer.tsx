import { useRef, useEffect } from 'react';
import { useVirtualization, useContainerSize } from './useVirtualization';
import type { PexelsPhoto } from '../../../../types/pexels';
import { getResponsiveColumns, useMasonryLayout } from './useMassonaryLayout';

import './MassonaryVirtuailzer.css'

interface MasonryVirtualizerProps {
  photos: PexelsPhoto[];
  renderItem: (photo: PexelsPhoto, style: React.CSSProperties) => React.ReactNode;
  onScrollEnd?: () => void;
  gap?: number;
  isLoading?: boolean;
}

export function MasonryVirtualizer({
  photos,
  renderItem,
  onScrollEnd,
  gap = 16,
  isLoading = false,
}: MasonryVirtualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const columnCount = getResponsiveColumns(containerWidth || window.innerWidth);

  const { items, totalHeight } = useMasonryLayout(photos, {
    containerWidth: containerWidth || window.innerWidth,
    columnCount,
    gap,
  });

  const { visibleItems, handleScroll } = useVirtualization({
    items,
    containerHeight: containerHeight || window.innerHeight,
    overscan: 800,
  });

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (!sentinelRef.current || !onScrollEnd || photos.length === 0) return;

    const sentinel = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;
          onScrollEnd();
        }
      },
      {
        root: containerRef.current,
        rootMargin: '200px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onScrollEnd, photos.length]);

  return (
    <div
      ref={containerRef}
      className="masonry-virtualizer"
      onScroll={handleScroll}
    >
      <div
        className="masonry-container"
        style={{
          position: 'relative',
          height: `${totalHeight}px`,
          width: '100%',
        }}
      >
        {visibleItems.map((item) => {
          const containerStyle: React.CSSProperties = {
            position: 'absolute',
            top: `${item.top}px`,
            left: `${item.left}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
          };

          const cardStyle: React.CSSProperties = {
            width: '100%',
            height: '100%',
          };

          return (
            <div key={item.photo.id} style={containerStyle}>
              {renderItem(item.photo, cardStyle)}
            </div>
          );
        })}
      </div>

      {onScrollEnd && (
        <div
          ref={sentinelRef}
          className="masonry-sentinel"
          style={{
            position: 'absolute',
            top: `${Math.max(0, totalHeight - 400)}px`, 
            height: '1px',
            width: '100%',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
}

