import axios, { type AxiosInstance } from "axios";
import { setupRequestInterceptor } from "./interceptors/request";
import { setupResponseInterceptor } from "./interceptors/response";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// setupRequestInterceptor(api);
// setupResponseInterceptor(api);

export default api;
