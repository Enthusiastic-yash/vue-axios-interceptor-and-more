import api from "@/api/client";
import type { UsersResponse, User } from "@/types/user";
import type { AxiosResponse } from "axios";
import axios from "axios";

class UserService {
  async getUsers(): Promise<UsersResponse> {
    const response: AxiosResponse<UsersResponse> = await api.get("/users");
    return response.data;
  }

  async searchQuery(query: string, signal?: AbortSignal): Promise<User[]> {
    const response = await axios.get<UsersResponse>(
      `https://dummyjson.com/users/search?q=${query}`,
      { signal },
    );
    return response.data.users;
  }
}

export const userService = new UserService();
