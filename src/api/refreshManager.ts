import { authService } from "@/services/authService";

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  let promise = refreshPromise;
  if (!promise) {
    promise = authService.refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    refreshPromise = promise;
  }

  return promise;
}
