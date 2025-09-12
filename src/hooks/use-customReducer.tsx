import { fetchRandomAlbumAction } from "@/api/game/fetch-random-album.action";
import { gameReducer } from "@/reducer/game.reducer";
import { GameState } from "@/reducer/types/game-state.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
const initState: GameState = {
  albumInfo: null,
  attemps: 0,
  guess: '',
  isGameOver: false,
  maxAttemps: 5,
  score: 0
}


export function useCustomGameReducer() {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['albumData'],
    queryFn: fetchRandomAlbumAction,
    staleTime: 1000 * 60 * 30, // half an hour
    retryDelay: 1000 * 60 * 1
  });

  const gameState: GameState = {
    albumInfo: data,
    attemps: 0,
    guess: '',
    isGameOver: false,
    maxAttemps: 5,
    score: 0
  }

  const [state, dispatch] = useReducer(gameReducer, undefined, () => ({
    ...initState,
  }));


  useEffect(() => {

    if (data && data !== state.albumInfo) {
      dispatch({ type: 'SET_ALBUM', payload: data })
    }
  }, [data, state.albumInfo])

  return {
    state,
    dispatch,
    data,
    isLoading,
    isError
  }


}