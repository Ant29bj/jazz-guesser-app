import { GameResponse } from "@/types/game-request"
import { gameApi } from "../game-api"


export const fetchRandomAlbumAction = async (): Promise<GameResponse> => {

  const { data } = await gameApi.get<GameResponse>('');

  return data;
}