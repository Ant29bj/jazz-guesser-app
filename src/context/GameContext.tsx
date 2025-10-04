import { fetchRandomAlbumAction } from "@/api/game/fetch-random-album.action";
import { gameReducer } from "@/reducer/game.reducer";
import { GameState } from "@/reducer/types/game-state.type";
import { GameResponse } from "@/types/game-request";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
import { PropsWithChildren } from "react";
import { createContext } from "react";
import JSConfetti from 'js-confetti'

const getMaxScore = () => {
  const maxScore = localStorage.getItem('maxScore');
  if (maxScore == null || maxScore == undefined) {
    localStorage.setItem('maxScore', '0');

    return '0';
  }

  return maxScore;

}

export const checkMaxScore = (score: number) => {
  const actualMaxScore = Number(getMaxScore());
  return actualMaxScore <= score ? score : actualMaxScore;
}

export const setMaxScore = (score: string) => {
  localStorage.setItem('maxScore', score);
}

export const initGame: GameState = {
  albumInfo: null,
  attemps: 0,
  maxAttempts: 5,
  score: 0,
  guess: '',
  isGameOver: false,
  hiddenAlbumTitle: '',
  hiddenArtist: [],
  numberOfArtist: 0,
  discoveredArtist: 0,
  discoveredArtistId: [],
  maxScore: getMaxScore()
}

interface GameContextType extends PropsWithChildren {
  // data
  query: UseQueryResult<GameResponse, Error>;
  gameState: GameState;
  // methods
  checkAnsswer: (guess: string) => void;
  restartGame?: (haveWin: boolean) => void;
}

export const GameContext = createContext({} as GameContextType);


export function GameContextProvider({ children }: PropsWithChildren) {

  const jsConfetti = new JSConfetti();
  const queryClient = useQueryClient();
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
    } else if (gameState.isGameOver) {
      jsConfetti.addConfettiAtPosition({
        emojis: ['😭'],
        confettiRadius: 15,
        confettiNumber: 100,
        confettiDispatchPosition: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        }
      });
    }

  }, [gameState.isGameOver])

  useEffect(() => {
    const { score } = gameState;
    const newMaxScore = checkMaxScore(score).toString();
    setMaxScore(newMaxScore);

    dispatch({ type: 'SET_MAXSCORE', payload: newMaxScore });
  }, [gameState.score]);

  const checkAnsswer = (guess: string) => {
    dispatch({ type: 'CHECK_ANSWER', payload: guess });
  }

  const restartGame = async (haveWin: boolean) => {

    dispatch({ type: 'RESTART_GAME', payload: haveWin });

    queryClient.setQueryData(['albumData'], undefined);
    await query.refetch();
  };

  return (
    <GameContext value={{
      query,
      gameState,
      checkAnsswer,
      restartGame
    }} >
      {children}
    </GameContext>
  );
}