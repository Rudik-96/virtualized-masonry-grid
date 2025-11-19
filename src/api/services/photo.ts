import { httpClient } from "../httpClient";
import type { PexelsPhoto } from "../../types/pexels";

export async function getPhoto(
  id: number,
  signal?: AbortSignal
): Promise<PexelsPhoto> {
  return httpClient<PexelsPhoto>(`/photos/${id}`, { signal });
}