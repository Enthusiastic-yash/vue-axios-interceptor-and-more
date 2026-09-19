import axios from "axios";
import type { CountryResponse } from "@/types/country";

class CountryServices {
  async getCountry(
    query: string,
    signal?: AbortSignal,
  ): Promise<CountryResponse[]> {
    const response = await axios.get<CountryResponse[]>(
      `https://countries.dev/name/${query}`,
      { signal },
    );

    return response.data;
  }
}
export const countryServices = new CountryServices();
