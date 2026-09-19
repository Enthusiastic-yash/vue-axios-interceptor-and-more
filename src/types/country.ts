export interface CountryFlags {
  png: string;
  svg: string;
}

export interface CountryResponse {
  name: string;
  flags: CountryFlags;
}
