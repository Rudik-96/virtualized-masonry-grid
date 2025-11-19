import { httpClient } from "../httpClient";
import type { PexelsSearchResponse } from "../../types/pexels";
import type { PhotoPage } from "./curated";

export async function search(
  query: string,
  page = 1,
  perPage = 30,
  signal?: AbortSignal
): Promise<PhotoPage> {
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const response = await httpClient<PexelsSearchResponse>(
    `/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    { signal }
  );

  return {
    photos: response.photos,
    page: response.page,
    perPage: response.per_page,
    totalResults: response.total_results || 0,
    hasNextPage: !!response.next_page,
  };
}