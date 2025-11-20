import { useState, useRef, useCallback, useEffect } from "react";
import "./HomePage.css";
import { usePhotoFeed } from "../hooks/usePhotosFeed";
import { SearchBar } from "../components/searchBar/SearchBar";
import { PhotoGrid } from "../components/photoGrid/PhotoGrid";

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
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Photo Gallery</h1>
        <p className="home-subtitle">
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

      <main className="home-content">
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

export default HomePage;