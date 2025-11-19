import { useParams } from "react-router-dom";

export function PhotoDetailsPage() {
  const { id } = useParams();

  return (
    <main style={{ padding: "24px" }}>
      <h1>Photo details</h1>
      <p>here will be selected photo details {id}</p>
    </main>
  );
}