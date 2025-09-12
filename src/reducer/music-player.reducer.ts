import { Track } from "@/types/game-request";
import { PlayerState } from "./types/player-state.type";
import { PlayerAction } from "./actions/player-reducer.action";

export function initPlayerReducer(track: Track) {
  return {
    isPlaying: false,
    currentTrack: track,
    playLisStatus: '',
    currentTime: 0,
    audioDuration: 0,
    volume: 75,
    isMuted: false,
    showVolumeSlider: false,
  };

}


export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYLIST_STATUS':
      return { ...state, playLisStatus: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_AUDIO_DURATION':
      return { ...state, audioDuration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'TOGGLE_VOLUME_SLIDER':
      return { ...state, showVolumeSlider: !state.showVolumeSlider };
    default:
      return state;
  }
}
