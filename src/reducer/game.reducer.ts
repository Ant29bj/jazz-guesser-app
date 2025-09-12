import { GameActions } from "./actions/game-reducer.action";
import { GameState } from "./types/game-state.type";



export function gameReducer(state: GameState, action: GameActions): GameState {
  const { type } = action;
  switch (type) {
    case 'CHECK_ANSWER': {
      const { payload } = action;
      const { isGameOver, albumInfo, score, attemps } = state;
      const { title } = albumInfo;
      if (!isGameOver) {
        return state;
      }

      if (title === payload) {
        return {
          ...state,
          isGameOver: true,
          guess: '',
          score: score + 1,
        }
      }

      return {
        ...state,
        attemps: attemps + 1,
        isGameOver: attemps + 1 >= state.maxAttemps
      }
    }
    default:
      break;
  }


  return state;
}
