import { SearchArtistResponse } from "@/types/search-artist";
import { gameApi } from "../game-api";

interface QueryParams {
  limit?: number;
}

export const searchArtistNameAction = async (artistName: string, params: QueryParams): Promise<SearchArtistResponse> => {

  if (artistName === '' || artistName == null || artistName == undefined) {
    console.log('Not valid')
    return;
  }

  const { data } = await gameApi.get<SearchArtistResponse>(`/search/${artistName}`, {
    params: { ...params }
  });

  return data;
}