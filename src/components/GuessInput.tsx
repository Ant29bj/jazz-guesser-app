import { use } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useCustomForm } from '@/hooks/use-customForm';
import { GameContext } from '@/context/GameContext';

interface GuessInputProps {
  disabled?: boolean;
}

interface FormValue {
  guess: string
}

export const GuessInput = ({ disabled }: GuessInputProps) => {

  const { onInputChange, onResetForm, guess } = useCustomForm<FormValue>({
    guess: ''
  });

  const { checkAnsswer } = use(GameContext);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.length == 0) return;

    checkAnsswer(guess);
    onResetForm();
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          value={guess}
          name='guess'
          onChange={onInputChange}
          placeholder="Enter your guess for the jazz player name..."
          disabled={disabled}
          className="bg-card border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-smooth"
        />
      </div>

      <Button
        type="submit"
        variant={'secondary'}
        disabled={!guess.trim()}
        className="w-full transition-bounce"
      >
        Submit Guess
      </Button>
    </form>
  );
};