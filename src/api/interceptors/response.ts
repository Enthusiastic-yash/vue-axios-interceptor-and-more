import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { refreshAccessToken } from "@/api/refreshManager";
import { ApiError } from "@/api/errors";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function createApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;

  const data = error.response?.data as Record<string, unknown> | undefined;

  const message =
    typeof data?.message === "string" ? data.message : error.message;

  const code = typeof data?.code === "number" ? data.code : undefined;

  return new ApiError({
    message,
    status,
    code,
    details: data,
  });
}

export function setupResponseInterceptor(apiClient: AxiosInstance): void {
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },

    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;

      /*
       * Not a 401 or there is no original request.
       *
       * Normalize the error and reject it.
       */
      if (error.response?.status !== 401 || !originalRequest) {
        return Promise.reject(createApiError(error));
      }

      /*
       * We already retried this request.
       *
       * Do NOT refresh again.
       */
      if (originalRequest._retry) {
        return Promise.reject(createApiError(error));
      }

      /*
       * Mark this request so it can only
       * be retried once.
       */
      originalRequest._retry = true;

      try {
        /*
         * If another request is already refreshing,
         * refreshAccessToken() gives us the same
         * Promise.
         */
        const newAccessToken = await refreshAccessToken();

        /*
         * Replace the expired token on the
         * original request.
         */
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );

        /*
         * Retry the original request.
         */
        return apiClient.request(originalRequest);
      } catch (refreshError) {
        /*
         * Refresh failed.
         *
         * Authentication can no longer be
         * considered valid.
         */
        /*
         * If refreshAccessToken() already
         * produced an ApiError, don't wrap it
         * again.
         */
        if (refreshError instanceof ApiError) {
          return Promise.reject(refreshError);
        }

        /*
         * Otherwise normalize the Axios error.
         */
        if (isAxiosError(refreshError)) {
          return Promise.reject(createApiError(refreshError));
        }

        /*
         * Unknown non-Axios error.
         */
        return Promise.reject(refreshError);
      }
    },
  );
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}
