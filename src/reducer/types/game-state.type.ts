import { Artist, GameResponse } from "@/types/game-request";

export interface GameState {
  albumInfo: GameResponse;
  attemps: number;
  maxAttempts: number;
  score: number;
  guess: string;
  isGameOver: boolean;
  hiddenAlbumTitle: string;
  hiddenArtist: Artist[];
  numberOfArtist: number;
  discoveredArtist: number;
  discoveredArtistId?: number[];

}