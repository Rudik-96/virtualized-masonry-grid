import { forwardRef, useState, type FormEvent } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onReset: () => void;
  isLoading: boolean;
  hasQuery: boolean;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, onReset, isLoading, hasQuery }, ref) => {
    const [value, setValue] = useState("");

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        onSearch(trimmed);
      }
    };

    const handleReset = () => {
      setValue("");
      onReset();
    };

    return (
      <div className="search-bar">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <input
              ref={ref}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search photos..."
              className="search-input"
              disabled={isLoading}
            />
            <span className="search-shortcut">/</span>
          </div>
          <button
            type="submit"
            className="search-button"
            disabled={isLoading || !value.trim()}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
          {hasQuery && (
            <button
              type="button"
              className="search-reset"
              onClick={handleReset}
              aria-label="Reset search"
            >
              ×
            </button>
          )}
        </form>
      </div>
    );
  }
);