import { useInfiniteQuery } from "@tanstack/react-query";
import { usePhotoStore, createFeedKey } from "../store/photoStore";
import { getCurated } from "../../../api/services/curated";
import type { PexelsPhoto } from "../../../types/pexels";

export type FeedMode = "curated" | "search";

export interface UsePhotoFeedOptions {
  mode: FeedMode;
  query?: string;
  perPage?: number;
  enabled?: boolean;
}

export interface UsePhotoFeedResult {
  photos: PexelsPhoto[];
  status: "pending" | "error" | "success";
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

export function usePhotoFeed({
  mode,
  query = "",
  perPage = 30,
  enabled = true,
}: UsePhotoFeedOptions): UsePhotoFeedResult {
  const feedKey = createFeedKey(mode, query);
  const addPhotos = usePhotoStore((state) => state.addPhotos);
  const getPhotosByFeed = usePhotoStore((state) => state.getPhotosByFeed);

  const {
    status,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["photos", mode, query],
    queryFn: async ({ pageParam = 1, signal }) => {
      const result =
        mode === "search"
          ? await import("../../../api/services/search").then((m) =>
              m.search(query, pageParam, perPage, signal)
            )
          : await getCurated(pageParam, perPage, signal);

      addPhotos(result.photos, feedKey);
      return result;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled && (mode !== "search" || !!query.trim()),
  });

  const photos = getPhotosByFeed(feedKey);

  return {
    photos,
    status,
    isLoading,
    isError,
    error: error as Error | null,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
}