import { authService } from "@/services/authService";

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = authService.refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
