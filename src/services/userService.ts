import api from "@/api/client";
import type { UsersResponse } from "@/types/user";
import type { AxiosResponse } from "axios";

class UserService {
  async getUsers(): Promise<UsersResponse> {
    const response: AxiosResponse<UsersResponse> = await api.get("/users");
    return response.data;
  }
}

export const userService = new UserService();
