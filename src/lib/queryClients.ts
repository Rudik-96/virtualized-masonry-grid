import { QueryClient } from "@tanstack/react-query";

type MaybeStatusError = Error & { status?: number };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: MaybeStatusError | unknown) => {
        const status =
          typeof error === "object" && error !== null && "status" in error
            ? (error as any).status
            : undefined;

        if (status === 429) {
          return failureCount < 2;
        }

        if (status && status >= 400 && status < 500) {
          return false;
        }

        return failureCount < 3;
      },
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    queryClient.resumePausedMutations();
  });
}