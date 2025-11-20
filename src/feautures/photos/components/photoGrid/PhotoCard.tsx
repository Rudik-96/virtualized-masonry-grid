import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { PexelsPhoto } from '../../../../types/pexels';
import './PhotoCard.css';

interface PhotoCardProps {
  photo: PexelsPhoto;
  style?: React.CSSProperties;
}

export function PhotoCard({ photo, style }: PhotoCardProps) {
  const queryClient = useQueryClient();

  const aspectRatioPadding = (photo.height / photo.width) * 100;

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['photo', photo.id],
      queryFn: () => import('../../../../api/services/photo').then(m => m.getPhoto(photo.id)),
      staleTime: 1000 * 60 * 10, 
    });
  }, [queryClient, photo.id]);

  return (
    <Link
      to={`/photo/${photo.id}`}
      className="photo-card"
      style={style}
      // префетч только по фокусу, чтобы не спамить ховерами
      onFocus={prefetch}
      aria-label={`View details for ${photo.alt || `photo by ${photo.photographer}`}`}
      tabIndex={0}
    >
      <div
        className="photo-card-content"
        style={{
          paddingBottom: `${aspectRatioPadding}%`,
          backgroundColor: photo.avg_color,
        }}
      >
        <img
          src={photo.src.medium}
          srcSet={`${photo.src.small} 400w, ${photo.src.medium} 800w, ${photo.src.large} 1200w`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1440px) 25vw, 20vw"
          alt={photo.alt || `Photo by ${photo.photographer}`}
          loading="lazy"
          decoding="async"
          className="photo-card-image"
        />
        <div className="photo-card-overlay">
          <span className="photo-card-photographer">{photo.photographer}</span>
        </div>
      </div>
    </Link>
  );
}

