import { useParams } from "react-router-dom";
import { usePhotoDetails } from "../hooks/usePhotoDetails";

export function PhotoDetailsPage() {
  const { id } = useParams();
  const photoId = id ? Number(id) : null;

  const { photo, isLoading, isError, error } = usePhotoDetails({
    photoId,
    enabled: photoId !== null,
  });

  if (!photoId) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Photo details</h1>
        <p>Invalid photo id</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Photo details</h1>
        <p>Loading photo...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Photo details</h1>
        <p>Error: {error?.message}</p>
      </main>
    );
  }

  if (!photo) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Photo details</h1>
        <p>Photo not found</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>Photo details</h1>
      <img
        src={photo.src.large}
        alt={photo.alt}
        style={{ maxWidth: "100%", borderRadius: "8px" }}
      />
      <p>Photographer: {photo.photographer}</p>
      <p>Original URL: <a href={photo.url}>{photo.url}</a></p>
    </main>
  );
}