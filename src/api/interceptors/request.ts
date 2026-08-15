import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "@/api/tokenStorage";

export function setupRequestInterceptor(api: AxiosInstance): void {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // console.log(
      //   `[Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      // );

      // config.headers.set("X-Request-ID", crypto.randomUUID());

      config.headers.set("X-App-Version", "1.0.0");
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
}
