const API_BASE_URL = import.meta.env.VITE_API_PROXY_URL || "https://api.pexels.com/v1";
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const USE_PROXY = !!import.meta.env.VITE_API_PROXY_URL;

if (!USE_PROXY && !API_KEY) {
  console.error("Missing VITE_PEXELS_API_KEY. Please set it in .env");
}

export class APIError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.statusText = statusText;
  }
}

export interface RequestConfig {
  signal?: AbortSignal;
  method?: string;
  body?: unknown;
}

export async function httpClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { signal, method = "GET", body } = config;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (!USE_PROXY && API_KEY) {
    headers["Authorization"] = API_KEY;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      signal,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let message = `HTTP ${response.status}: ${response.statusText}`;

      if (response.status === 429) {
        message = "Rate limit exceeded. Please try again in a moment.";
      } else if (response.status >= 500) {
        message = "Server error. Please try again later.";
      } else if (response.status === 404) {
        message = "Resource not found.";
      } else if (response.status === 401 || response.status === 403) {
        message = "Authentication failed. Check your API key.";
      }

      throw new APIError(message, response.status, response.statusText);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request cancelled");
      }
      throw new Error(`Network error: ${error.message}`);
    }

    throw new Error("Unknown error occurred");
  }
}