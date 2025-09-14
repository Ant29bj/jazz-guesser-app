import { fetchRandomAlbumAction } from "@/api/game/fetch-random-album.action";
import { gameReducer } from "@/reducer/game.reducer";
import { GameState } from "@/reducer/types/game-state.type";
import { GameResponse } from "@/types/game-request";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
import { PropsWithChildren } from "react";
import { createContext } from "react";
import JSConfetti from 'js-confetti'

const initGame: GameState = {
  albumInfo: null,
  attemps: 0,
  maxAttempts: 3,
  score: 0,
  guess: '',
  isGameOver: false,
  hiddenAlbumTitle: '',
  hiddenArtist: [],
  numberOfArtist: 0,
  discoveredArtist: 0,
  discoveredArtistId: []
}

interface GameContextType extends PropsWithChildren {
  // data
  query: UseQueryResult<GameResponse, Error>;
  gameState: GameState;
  // methods
  checkAnsswer: (guess: string) => void
}

export const GameContext = createContext({} as GameContextType);


export function GameContextProvider({ children }: PropsWithChildren) {

  const jsConfetti = new JSConfetti();

  const query = useQuery({
    queryKey: ['albumData'],
    queryFn: fetchRandomAlbumAction,
    staleTime: 1000 * 60 * 30,
    retryDelay: 1000 * 60 * 1,

  });
  const [gameState, dispatch] = useReducer(gameReducer, initGame);

  useEffect(() => {
    const { data, isSuccess } = query;
    if (data && isSuccess) {
      dispatch({ type: 'SET_ALBUM', payload: data });
    }

  }, [query.data])

  useEffect(() => {
    if (gameState.isGameOver && gameState.attemps < gameState.maxAttempts) {
      jsConfetti.addConfettiAtPosition({
        confettiRadius: 15,
        confettiNumber: 100,
        confettiDispatchPosition: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        }
      });
    }

  }, [gameState.isGameOver])

  const checkAnsswer = (guess: string) => {
    dispatch({ type: 'CHECK_ANSWER', payload: guess });
  }


  return (
    <GameContext value={{
      query,
      gameState,
      checkAnsswer
    }} >
      {children}
    </GameContext>
  );
}