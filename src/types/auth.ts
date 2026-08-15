export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

export type CurrentUserResponse = AuthUser;

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}
