import { useParams } from "react-router-dom";
import { usePhotoDetails } from "../hooks/usePhotoDetails";

export function PhotoDetailsPage() {
  const { id } = useParams();
  const parsedId = id ? Number(id) : NaN;
  const isValidId = Number.isFinite(parsedId) && parsedId > 0;
  const photoId = isValidId ? parsedId : null;

  const { photo, isLoading, isError, error } = usePhotoDetails({
    photoId,
    enabled: isValidId,
  });

  if (!isValidId) {
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
        src={photo.src.large2x || photo.src.large}
        srcSet={`${photo.src.large} 1024w, ${photo.src.large2x || photo.src.large} 2048w`}
        sizes="(max-width: 768px) 100vw, 80vw"
        alt={photo.alt || `Photo by ${photo.photographer}`}
        style={{ maxWidth: "100%", borderRadius: "8px", height: "auto" }}
      />
      <p>Photographer: {photo.photographer}</p>
      <p>Original URL: <a href={photo.url}>{photo.url}</a></p>
    </main>
  );
}

export default PhotoDetailsPage;