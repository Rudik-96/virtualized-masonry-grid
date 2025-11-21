import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClients";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { OfflineIndicator } from "./components/offlineIndicator/OfflineIndicator";
import HomePage from "./feautures/photos/pages/HomePage";

const PhotoDetailsPage = lazy(() =>
  import("./feautures/photos/pages/PhotoDetailsPage").then((m) => ({
    default: m.PhotoDetailsPage,
  }))
);

function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666",
      }}
    >
      Loading...
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/photo/:id" element={<PhotoDetailsPage />} />
          </Routes>
        </Suspense>
        <OfflineIndicator />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;