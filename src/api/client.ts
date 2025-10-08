/**
 * Clockify API Client
 * Centralized HTTP client for Clockify API v1
 */

const CLOCKIFY_API_BASE = "https://api.clockify.me/api/v1";

export interface ClockifyConfig {
  apiKey: string;
}

let config: ClockifyConfig | null = null;

export function initializeClient(apiKey: string): void {
  config = { apiKey };
}

export function getConfig(): ClockifyConfig {
  if (!config) {
    throw new Error("Clockify API client not initialized. CLOCKIFY_API_KEY is required.");
  }
  return config;
}

/**
 * Makes an authenticated request to the Clockify API
 */
export async function clockifyFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { apiKey } = getConfig();

  const url = `${CLOCKIFY_API_BASE}${endpoint}`;
  const headers = {
    "X-Api-Key": apiKey,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Clockify API error (${response.status}): ${errorText || response.statusText}`
    );
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
