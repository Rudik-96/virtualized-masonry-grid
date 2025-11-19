import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000,  
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("429")) {
          return failureCount < 2; 
        }
        if (error instanceof Error && error.message.includes("4")) {
          return false; 
        }
        return failureCount < 3; 
      },
      retryDelay: (attemptIndex) => {
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
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