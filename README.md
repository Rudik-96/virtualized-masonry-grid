# Virtualized Masonry Photo Gallery

React + TypeScript + Vite application for browsing photos from the Pexels API rendered in a high‑performance virtualized masonry grid.

The project is built as a small but realistic example of:

- data‑fetching with React Query
- client‑side caching and normalized state with Zustand
- virtualized masonry layout for large photo feeds
- clean error handling and UX details (offline indicator, error boundary, keyboard shortcuts)

---

## Features

- **Home Page (`/`)**
  - Curated photo feed by default.
  - Search mode using the Pexels search endpoint.
  - Virtualized masonry grid for smooth scrolling even with many images.
  - Infinite scroll with “load more” when you reach the end.
  - Keyboard helpers: `/` to focus search, `Tab` to navigate, `Enter` to open.

- **Photo Details Page (`/photo/:id`)**
  - Fetches and displays full photo details.
  - Reuses already loaded photos from the global store when possible.
  - Guards against invalid IDs and shows appropriate error/empty states.

- **Resilient Data Layer**
  - Global `QueryClient` with tuned retry logic based on HTTP status codes.
  - Strong error messages for rate limits, auth issues, and server errors.
  - Shared http client with consistent error handling.

- **UX & Reliability**
  - `ErrorBoundary` wrapping the app to catch unexpected rendering errors.
  - `OfflineIndicator` that shows when the user goes offline.
  - Responsive layout and images with `srcSet` and `sizes`.

---

## Tech Stack and Why

- **React + TypeScript + Vite**
  - Fast dev server with HMR, great DX.
  - TypeScript for safer API usage and component contracts.
  - Vite for simple, modern build tooling.

- **React Router (`react-router-dom`)**
  - Client‑side routing between:
    - `/` (home / feed page)
    - `/photo/:id` (photo detail page)
  - Code splitting via `React.lazy` so pages load on demand.

- **React Query (`@tanstack/react-query`)**
  - Handles caching, background refetching, retries, and loading states.
  - Used for:
    - infinite photo feed (`useInfiniteQuery`) in `usePhotosFeed`
    - single photo details (`useQuery`) in `usePhotoDetails`.

- **Zustand**
  - Lightweight global store for normalized photo data:
    - `byId` — map of `photo.id -> photo`.
    - `idsByFeed` — map of `feedKey -> [photoId]`.
  - Reasons:
    - De‑duplicate photo objects across feeds and details.
    - Make it easy to reuse already loaded photos when navigating.

- **Custom Virtualization + Masonry Layout**
  - `MasonryVirtualizer` + `useVirtualization` + `useMasonryLayout`:
    - Computes column positions and heights for a masonry layout.
    - Only renders visible items plus an overscan region.
  - Why not just CSS grid:
    - Masonry + virtualization gives much better performance with large lists.

- **Custom HTTP Client (`src/api/httpClient.ts`)**
  - Centralizes:
    - base URL / proxy logic
    - headers (API key / auth)
    - error mapping into a typed `APIError`.
  - Adds friendly messages for:
    - 429 (rate limit)
    - 4xx auth / not found
    - 5xx server errors
    - network errors vs aborted requests.

- **Error Boundary**
  - `src/components/ErrorBoundary/ErrorBoundary.tsx`
  - Catches render/runtime errors in React tree and shows a fallback UI with a “Try again” button.

- **Offline Indicator**
  - `src/components/offlineIndicator/OfflineIndicator.tsx`
  - Listens to `online` / `offline` events and displays a floating warning when offline.
  - Styles injected safely in a `useEffect` to avoid SSR/test issues.

---

## Project Structure (Overview)

- `src/App.tsx` — app shell, routing, `QueryClientProvider`, `ErrorBoundary`, `OfflineIndicator`.
- `src/main.tsx` — React root, `BrowserRouter`, StrictMode.
- `src/lib/queryClients.ts` — shared `queryClient` with retry / cache config.
- `src/api/httpClient.ts` — HTTP client and error handling.
- `src/api/services/*` — Pexels API services:
  - `curated.ts` — curated photos with pagination.
  - `search.ts` — search photos by query.
  - `photo.ts` — fetch single photo by id.
- `src/types/pexels.ts` — TypeScript types for Pexels responses.
- `src/feautures/photos/store/photoStore.ts` — Zustand store for normalized photos.
- `src/feautures/photos/hooks/usePhotosFeed.ts` — infinite feed hook.
- `src/feautures/photos/hooks/usePhotoDetails.ts` — photo details hook.
- `src/feautures/photos/pages/HomePage.tsx` — main page with search + grid.
- `src/feautures/photos/pages/PhotoDetailsPage.tsx` — single photo page.
- `src/feautures/photos/components/searchBar/*` — search UI.
- `src/feautures/photos/components/photoGrid/*` — virtualized masonry grid and cards.

---

## Getting Started

git clone https://github.com/Rudik-96/virtualized-masonry-grid.git
cd virtualized-masonry-grid

npm install
npm run devThen open `http://localhost:5173`.

---

## Environment Variables and Pexels API

> **IMPORTANT:** In this repository, the `.env` file is **intentionally committed**.  
> The project is meant to be reviewed, so it must run out‑of‑the‑box without reviewers needing to create their own Pexels API keys.

Variables used:

- `VITE_PEXELS_API_KEY`  
  Pexels API key (used when no proxy is configured).

- `VITE_API_PROXY_URL` (optional)  
  Base URL for an HTTP proxy, if you want to route requests through your own backend or proxy.  
  When this is set, the client will talk to the proxy instead of directly to `https://api.pexels.com/v1`.

The committed `.env` already contains a working token so reviewers **do not have to plug in their own key** to run the app and hit the API.

### TODO (after review is finished)

For a real production/open‑source setup, this is **not** acceptable and should be fixed:

- Remove `.env` from git history.
- Add `.env` to `.gitignore`.
- Add an `.env.example` file that documents required variables but does **not** contain real secrets.
- Store real tokens only in:
  - local untracked `.env` files, or
  - CI/CD secret stores, or
  - other secure secret management solutions.

While this project is under review, `.env` is deliberately left in the repo.

---

## NPM Scripts

- `npm run dev` — start Vite dev server.
- `npm run build` — build production bundle.
- `npm run preview` — preview the built app.
- `npm run lint` — run linting (if configured).

---

If ты хочешь, я могу сразу предложить коммит‑месседж для этих изменений (например:  
`docs: add project overview and env notes for reviewers`).