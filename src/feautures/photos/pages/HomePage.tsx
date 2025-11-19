// src/feautures/photos/pages/HomePage.tsx
import { usePhotoFeed } from "../hooks/usePhotosFeed";

export function HomePage() {
  const {
    photos,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePhotoFeed({ mode: "curated" });

  if (isLoading) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Photo explorer</h1>
        <p>Loading photos...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Photo explorer</h1>
        <p>Error: {error?.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>Photo explorer</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {photos.map((photo) => (
          <li key={photo.id} style={{ marginBottom: "16px" }}>
            <img
              src={photo.src.medium}
              alt={photo.alt}
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
            <p>{photo.photographer}</p>
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          style={{ marginTop: "16px" }}
        >
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </button>
      )}
    </main>
  );
}