import api from "@/api/client";
import refreshClient from "@/api/refreshClient";
import { setAccessToken, removeAccessToken } from "@/api/tokenStorage";
import type {
  AuthUser,
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
} from "@/types/auth";

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthUser> {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    setAccessToken(data.accessToken);

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    };
  }

  async getCurrentUser(): Promise<CurrentUserResponse> {
    const { data } = await api.get<CurrentUserResponse>("/auth/me");
    return data;
  }

  async refreshAccessToken(): Promise<string> {
    const { data } = await refreshClient.post<RefreshResponse>("/auth/refresh");
    setAccessToken(data.accessToken);

    return data.accessToken;
  }

  async logout(): Promise<void> {
    removeAccessToken();
  }
}

export const authService = new AuthService();
