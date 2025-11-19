import { httpClient } from "../httpClient";
import type { PexelsResponse } from "../../types/pexels";

export interface PhotoPage {
  photos: PexelsResponse["photos"];
  page: number;
  perPage: number;
  totalResults: number;
  hasNextPage: boolean;
}

export async function getCurated(
  page = 1,
  perPage = 30,
  signal?: AbortSignal
): Promise<PhotoPage> {
  const response = await httpClient<PexelsResponse>(
    `/curated?page=${page}&per_page=${perPage}`,
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