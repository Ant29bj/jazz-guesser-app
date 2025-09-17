import { SearchArtistResponse } from "@/types/search-artist";
import { gameApi } from "../game-api";

interface QueryParams {
  limit?: number;
}

export const searchArtistNameAction = async (artistName: string, params: QueryParams): Promise<SearchArtistResponse> => {

  console.log(`entro con ${artistName}`);
  if (artistName === '') {
    return;
  }

  const { data } = await gameApi.get<SearchArtistResponse>(`/search/${artistName}`, {
    params: { ...params }
  });

  return data;
}