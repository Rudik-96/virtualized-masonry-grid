import { useMemo } from 'react';
import type { PexelsPhoto } from '../../../../types/pexels';

export interface MasonryItem {
  photo: PexelsPhoto;
  column: number;
  top: number;
  height: number;
  left: number;
  width: number;
}

export interface MasonryLayoutOptions {
  containerWidth: number;
  columnCount: number;
  gap: number;
}

export function calculateMasonryLayout(
  photos: PexelsPhoto[],
  options: MasonryLayoutOptions
): { items: MasonryItem[]; totalHeight: number } {
  const { containerWidth, columnCount, gap } = options;

  const totalGapWidth = gap * (columnCount - 1);
  const columnWidth = (containerWidth - totalGapWidth) / columnCount;

  const columnHeights = new Array(columnCount).fill(0);
  const items: MasonryItem[] = [];

  photos.forEach((photo) => {
    const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));

    const aspectRatio = photo.height / photo.width;
    const itemHeight = columnWidth * aspectRatio;
    const itemLeft = shortestColumn * (columnWidth + gap);

    items.push({
      photo,
      column: shortestColumn,
      top: columnHeights[shortestColumn],
      left: itemLeft,
      height: itemHeight,
      width: columnWidth,
    });

    columnHeights[shortestColumn] += itemHeight + gap;
  });

  const totalHeight = Math.max(...columnHeights);

  return { items, totalHeight };
}

export function getResponsiveColumns(width: number): number {
  if (width < 640) return 2;  
  if (width < 1024) return 3;  
  if (width < 1440) return 4;  
  return 5;                    
}

export function useMasonryLayout(
  photos: PexelsPhoto[],
  options: MasonryLayoutOptions
) {
  return useMemo(
    () => calculateMasonryLayout(photos, options),
    [photos, options.containerWidth, options.columnCount, options.gap]
  );
}

