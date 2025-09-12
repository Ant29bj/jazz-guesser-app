import { FetchTrackResponse } from "@/types/fetch-track";
import { gameApi } from "../game-api";

export const fetchTracPreview = async (trackId: number): Promise<FetchTrackResponse> => {

  const { data } = await gameApi.get<FetchTrackResponse>(`/tracks/${trackId}`);

  return data;
}