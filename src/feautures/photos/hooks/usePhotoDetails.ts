import { useQuery } from "@tanstack/react-query";
import { usePhotoStore } from "../store/photoStore";
import { getPhoto } from "../../../api/services/photo";
import type { PexelsPhoto } from "../../../types/pexels";

export interface UsePhotoDetailsOptions {
  photoId: number | null;
  enabled?: boolean;
}

export interface UsePhotoDetailsResult {
  photo: PexelsPhoto | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePhotoDetails({
  photoId,
  enabled = true,
}: UsePhotoDetailsOptions): UsePhotoDetailsResult {
  const getPhotoFromStore = usePhotoStore((state) => state.getPhoto);
  const addPhotos = usePhotoStore((state) => state.addPhotos);

  const isValidId =
    typeof photoId === "number" && Number.isInteger(photoId) && photoId > 0;

  const cachedPhoto =
    isValidId && photoId != null ? getPhotoFromStore(photoId) : undefined;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["photo", photoId],
    queryFn: async ({ signal }) => {
      if (!isValidId || photoId == null) {
        throw new Error("Photo ID is required");
      }
      const photo = await getPhoto(photoId, signal);
      addPhotos([photo], `single:${photoId}`);
      return photo;
    },
    enabled: enabled && isValidId,
    initialData: cachedPhoto,
    staleTime: 5 * 60 * 1000,
  });

  const photo =
    isValidId && photoId != null
      ? getPhotoFromStore(photoId) || data
      : undefined;

  return {
    photo,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}