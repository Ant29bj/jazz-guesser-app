import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  isCorrect: boolean | null;
  isRevealed: boolean;
  disabled?: boolean;
}

export const GuessInput = ({ onGuess, isCorrect, isRevealed, disabled }: GuessInputProps) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onGuess(guess.trim());
    }
  };

  const getButtonVariant = () => {
    if (isCorrect === true) return 'default';
    if (isCorrect === false) return 'destructive';
    return 'secondary';
  };

  const getButtonIcon = () => {
    if (isCorrect === true) return <Check className="h-4 w-4" />;
    if (isCorrect === false) return <X className="h-4 w-4" />;
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess for the album name..."
          disabled={disabled || isRevealed}
          className="bg-card border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-smooth"
        />
      </div>
      
      <Button
        type="submit"
        variant={getButtonVariant()}
        disabled={!guess.trim() || disabled || isRevealed}
        className="w-full transition-bounce"
      >
        {getButtonIcon()}
        {isRevealed ? 'Game Complete' : 'Submit Guess'}
      </Button>
      
      {isCorrect !== null && !isRevealed && (
        <div className={`text-center p-3 rounded-lg transition-smooth ${
          isCorrect 
            ? 'bg-primary/10 text-primary border border-primary/20' 
            : 'bg-destructive/10 text-destructive border border-destructive/20'
        }`}>
          {isCorrect ? '🎉 Correct! Well done!' : '❌ Not quite right. Try again!'}
        </div>
      )}
    </form>
  );
};