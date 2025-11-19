import { forwardRef, useState, type FormEvent } from "react";

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
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "8px", justifyContent: "center" }}
      >
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search photos..."
          style={{ padding: "8px 12px", minWidth: "260px" }}
        />
        <button type="submit" disabled={isLoading || !value.trim()}>
          {isLoading ? "Searching..." : "Search"}
        </button>
        {hasQuery && (
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        )}
      </form>
    );
  }
);