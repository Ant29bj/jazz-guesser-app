import { use, useDeferredValue, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCustomForm } from '@/hooks/use-customForm';
import { GameContext } from '@/context/GameContext';
import { useQuery } from '@tanstack/react-query';
import { searchArtistNameAction } from '@/api/game/search-artist-name.action';
import { useDebounce } from '@/hooks/use-debounceValue';
import { Card } from './ui/card';


interface FormValue {
  guess: string
}

export const GuessInput = () => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const { checkAnsswer, gameState, restartGame } = use(GameContext);
  const { isGameOver, attemps, maxAttempts } = gameState;

  const { onInputChange, onResetForm, guess, handleExteranlInput } = useCustomForm<FormValue>({
    guess: ''
  });

  const debounceSearchTerm = useDebounce(guess, 500);
  const { data } = useQuery({
    queryKey: ['guess-artist', { guess: debounceSearchTerm }],
    queryFn: () => searchArtistNameAction(debounceSearchTerm, {}),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!debounceSearchTerm,
    retry: false
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGameOver) {
      restartGame(attemps < maxAttempts);
    }


    if (guess.length == 0) return;

    checkAnsswer(guess);
    onResetForm();
  };

  const handleDisable = () => {
    if (!isGameOver) {
      return !guess.trim();
    }
    return !isGameOver;
  }



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          value={guess}
          name='guess'
          onChange={onInputChange}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Enter your guess for the jazz player name..."
          disabled={isGameOver}
          autoComplete='off'
          className="bg-card border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-smooth"
        />

        {data && showSuggestions &&
          <div className="absolute left-0 right-0 mt-2 bg-background border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent 
                hover:scrollbar-thumb-primary/50">
            {
              data.artists.map((artist) => (
                <div
                  key={artist}
                  onClick={() => handleExteranlInput('guess', artist.trim())}
                >
                  <Card
                    className='capitalize gradient-card rounded-none hover:border-primary/30 transition-smooth p-4 cursor-pointer'>
                    {artist}
                  </Card>
                </div>
              ))}
          </div>
        }
      </div>

      <Button
        type="submit"
        variant={'secondary'}
        className="w-full transition-bounce"
        disabled={handleDisable()}
      >
        {isGameOver ? 'Restart Game' : 'Submit Guess'}
      </Button>
    </form >
  );
};