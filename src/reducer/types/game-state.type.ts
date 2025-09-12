import { GameResponse } from "@/types/game-request";

export interface GameState {
  albumInfo: GameResponse;
  attemps: number;
  maxAttemps: number;
  score: number;
  guess: string;
  isGameOver: boolean;

}