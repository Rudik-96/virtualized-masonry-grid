import { useState, useRef, useCallback, useEffect } from "react";
import "./HomePage.css";
import { usePhotoFeed } from "../hooks/usePhotosFeed";
import { SearchBar } from "../components/searchBar/SearchBar";
import { PhotoGrid } from "../components/photoGrid/PhotoGrid";

const styles = {
  page: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },
  header: {
    padding: "24px 32px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    flexShrink: 0,
  },
  title: {
    textAlign: "center" as const,
    margin: "0 0 8px 0",
    fontSize: "36px",
    fontWeight: 700,
  },
  subtitle: {
    textAlign: "center" as const,
    margin: "0 0 24px 0",
    fontSize: "16px",
    opacity: 0.95,
  },
  content: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
  },
};

export function HomePage() {
  const [mode, setMode] = useState<"curated" | "search">("curated");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    photos,
    status,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePhotoFeed({
    mode,
    query: searchQuery,
    perPage: 30,
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setMode("search");
  }, []);

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setMode("curated");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && e.target === document.body) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Photo Gallery</h1>
        <p style={styles.subtitle}>
          {mode === "curated"
            ? "Discover curated photos from Pexels"
            : `Searching for "${searchQuery}"`}
        </p>

        <SearchBar
          ref={searchInputRef}
          onSearch={handleSearch}
          onReset={handleReset}
          isLoading={status === "pending"}
          hasQuery={mode === "search"}
        />

        <div className="home-hints">
          <span>
            Press <kbd>/</kbd> to search
          </span>
          <span>
            <kbd>Tab</kbd> to navigate
          </span>
          <span>
            <kbd>Enter</kbd> to open
          </span>
        </div>
      </header>

      <main style={styles.content}>
        <PhotoGrid
          photos={photos}
          isLoading={status === "pending"}
          isError={isError}
          error={error}
          hasMore={hasNextPage}
          isFetchingMore={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      </main>
    </div>
  );
}