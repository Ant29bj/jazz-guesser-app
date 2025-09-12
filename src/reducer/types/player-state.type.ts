import { Track } from "@/types/game-request";

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track;
  playLisStatus: string;
  currentTime: number;
  audioDuration: number;
  volume: number;
  isMuted: boolean;
  showVolumeSlider: boolean;
}
