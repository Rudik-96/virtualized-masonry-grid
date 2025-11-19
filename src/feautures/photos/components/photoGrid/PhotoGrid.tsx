import type { PexelsPhoto } from '../../../../types/pexels';
import { MasonryVirtualizer } from './MassonaryVirtualizer';
import { PhotoCard } from './PhotoCard';
import './PhotoGrid.css';

interface PhotoGridProps {
  photos: PexelsPhoto[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
}

export function PhotoGrid({
  photos,
  isLoading,
  isError,
  error,
  hasMore,
  isFetchingMore,
  onLoadMore,
}: PhotoGridProps) {
  if (isError && photos.length === 0) {
    return (
      <div className="photo-grid-error">
        <h3>⚠️ Error loading photos</h3>
        <p>{error?.message || 'Something went wrong'}</p>
      </div>
    );
  }

  if (!isLoading && photos.length === 0) {
    return (
      <div className="photo-grid-empty">
        <h3>No photos found</h3>
        <p>Try a different search term</p>
      </div>
    );
  }

  if (isLoading && photos.length === 0) {
    return (
      <div className="photo-grid-loading">
        <div className="loading-spinner" />
        <p>Loading photos...</p>
      </div>
    );
  }

  return (
    <div className="photo-grid">
      <MasonryVirtualizer
        photos={photos}
        renderItem={(photo, style) => (
          <PhotoCard photo={photo} style={style} />
        )}
        onScrollEnd={hasMore && !isFetchingMore ? onLoadMore : undefined}
        isLoading={isFetchingMore}
      />

      {isFetchingMore && (
        <div className="photo-grid-loading-more">
          <div className="loading-spinner-small" />
          <span>Loading more...</span>
        </div>
      )}

      {!hasMore && photos.length > 0 && (
        <div className="photo-grid-end">
          <p>You've reached the end! 🎉</p>
        </div>
      )}
    </div>
  );
}

