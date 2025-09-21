import { GameResponse } from "@/types/game-request";

export type GameActions =
  | { type: 'CHECK_ANSWER', payload: string }
  | { type: 'SET_ALBUM', payload: GameResponse }
  | { type: 'RESTART_GAME', payload: boolean }
  | { type: 'SET_MAXSCORE', payload: string }

