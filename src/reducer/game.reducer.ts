import {
  hideArtistInAlbumTitle,
  hideName,
  revealAllOccurrencesOfArtist,
  revealLettersInAlbumTitleProportional,
  revealLettersProportional
} from "@/utils/hide-artist";
import { GameActions } from "./actions/game-reducer.action";
import { GameState } from "./types/game-state.type";
import { initGame } from "@/context/GameContext";



export function gameReducer(state: GameState, action: GameActions): GameState {
  const { type } = action;
  switch (type) {
    case 'CHECK_ANSWER': {
      const { payload: guess } = action;
      const {
        albumInfo,
        score,
        attemps,
        maxAttempts,
        discoveredArtist,
        numberOfArtist
      } = state;

      const artistExist = albumInfo.artists.find(
        artist => artist.name.toLowerCase().trim() === guess.toLowerCase().trim()
      );

      if (artistExist) {
        const { updatedArtists, matchCount, matchedArtists } = revealAllOccurrencesOfArtist({
          hiddenArtists: state.hiddenArtist,
          original: albumInfo.artists,
          guessedArtist: guess
        });

        const newDiscovered = discoveredArtist + matchCount;
        const matchesId = matchedArtists.map(({ id }) => id);
        return {
          ...state,
          hiddenArtist: updatedArtists,
          score: score + 1,
          discoveredArtist: newDiscovered,
          isGameOver: newDiscovered === numberOfArtist,
          guess: '',
          discoveredArtistId: [...state.discoveredArtistId, ...matchesId]
        };
      }


      const newAlbumTitle = revealLettersInAlbumTitleProportional({
        hiddenTitle: state.hiddenAlbumTitle,
        originalTitle: albumInfo.title,
        artists: albumInfo.artists,
        currentAttempt: attemps + 1,
        maxAttempts
      })


      const newArtisList = revealLettersProportional({
        hiddenArtists: state.hiddenArtist,
        original: state.albumInfo.artists,
        currentAttempt: attemps + 1,
        maxAttempts,
      });



      return {
        ...state,
        attemps: attemps + 1,
        isGameOver: attemps + 1 >= state.maxAttempts,
        hiddenAlbumTitle: newAlbumTitle,
        hiddenArtist: newArtisList,
        discoveredArtist: discoveredArtist
      }
    }
    case 'SET_ALBUM': {
      const { payload } = action;


      const hiddenArtist = payload.artists.map(hideName);
      const hiddenAlbumTitle = hideArtistInAlbumTitle(payload.title, payload.artists);

      return {
        ...state,
        albumInfo: payload,
        hiddenArtist,
        hiddenAlbumTitle,
        numberOfArtist: payload.artists.length,
      }
    }
    case 'RESTART_GAME': {
      const { payload: haveWin } = action;

      if (haveWin) {
        return {
          ...state,
          isGameOver: false,
          attemps: 0,
          discoveredArtist: 0,
          discoveredArtistId: []
        }

      } else {
        return {
          ...initGame
        }
      }


    }
    default:
      break;
  }


  return state;
}
