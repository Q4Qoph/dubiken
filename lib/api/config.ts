/** API is always used — mock data is disabled. */
export const USE_API = true;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';

export const API_TIMEOUT_MS = 30_000;
