import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PexelsPhoto } from "../../../types/pexels";

export interface PhotoState {
  byId: Record<number, PexelsPhoto>;
  idsByFeed: Record<string, number[]>;
  addPhotos: (photos: PexelsPhoto[], feedKey: string) => void;
  getPhoto: (id: number) => PexelsPhoto | undefined;
  getPhotosByFeed: (feedKey: string) => PexelsPhoto[];
  clearFeed: (feedKey: string) => void;
  reset: () => void;
}

const initialState = {
  byId: {},
  idsByFeed: {},
};

export function createFeedKey(mode: "curated" | "search", query?: string): string {
  return mode === "search" ? `search:${query}` : "curated";
}

export const usePhotoStore = create<PhotoState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      addPhotos: (photos, feedKey) => {
        set((state) => {
          const newById = { ...state.byId };
          const existingIds = state.idsByFeed[feedKey] || [];
          const newIds: number[] = [];

          photos.forEach((photo) => {
            newById[photo.id] = photo;
            if (!existingIds.includes(photo.id)) {
              newIds.push(photo.id);
            }
          });

          return {
            byId: newById,
            idsByFeed: {
              ...state.idsByFeed,
              [feedKey]: [...existingIds, ...newIds],
            },
          };
        }, false, "addPhotos");
      },

      getPhoto: (id) => {
        return get().byId[id];
      },

      getPhotosByFeed: (feedKey) => {
        const ids = get().idsByFeed[feedKey] || [];
        return ids.map((id) => get().byId[id]).filter(Boolean);
      },

      clearFeed: (feedKey) => {
        set((state) => {
          const { [feedKey]: _, ...rest } = state.idsByFeed;
          return { idsByFeed: rest };
        }, false, "clearFeed");
      },

      reset: () => {
        set(initialState, false, "reset");
      },
    }),
    { name: "PhotoStore" }
  )
);