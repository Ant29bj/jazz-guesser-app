import { Track } from "@/types/game-request";

export type PlayerAction =
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_TRACK'; payload: Track }
  | { type: 'SET_PLAYLIST_STATUS'; payload: string }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_AUDIO_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_VOLUME_SLIDER' };