import { useState, useEffect } from 'react';
import { AlbumCover } from '@/components/AlbumCover';
import { ClueCard } from '@/components/ClueCard';
import { GuessInput } from '@/components/GuessInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { Button } from '@/components/ui/button';
import { Music, Calendar, Hash, Users, Disc, RotateCcw } from 'lucide-react';

// Sample album data
const albumData = {
  name: "Kind of Blue",
  artist: "Miles Davis",
  year: 1959,
  tracks: 5,
  duration: "45:44",
  genre: "Modal Jazz",
  label: "Columbia Records"
};

const Index = () => {
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isRevealed) {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isRevealed]);

  const handleGuess = (userGuess: string) => {
    setAttempts(prev => prev + 1);
    const normalizedGuess = userGuess.toLowerCase().trim();
    const normalizedAnswer = albumData.name.toLowerCase().trim();
    
    const correct = normalizedGuess === normalizedAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(Math.max(100 - (attempts * 10), 10));
      setIsRevealed(true);
    }
  };

  const resetGame = () => {
    setAttempts(0);
    setScore(0);
    setIsCorrect(null);
    setIsRevealed(false);
    setTimeElapsed(0);
  };

  return (
    <div className="min-h-screen bg-gradient-jazz">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
            Jazz Album Detective
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Can you identify this classic jazz album from the clues? Study the blurred cover and use the hints to make your guess!
          </p>
        </div>

        {/* Score Display */}
        <div className="mb-8">
          <ScoreDisplay score={score} attempts={attempts} timeElapsed={timeElapsed} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Album Cover */}
          <div className="space-y-6">
            <div className="aspect-square max-w-md mx-auto">
              <AlbumCover isRevealed={isRevealed} albumName={albumData.name} />
            </div>
            
            {isRevealed && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-primary">"{albumData.name}"</h2>
                <p className="text-muted-foreground">by {albumData.artist}</p>
                <Button onClick={resetGame} variant="secondary" className="transition-bounce">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
              </div>
            )}
          </div>

          {/* Clues and Input */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Album Clues</h3>
              <div className="grid gap-4">
                <ClueCard 
                  label="Artist" 
                  value={albumData.artist}
                  icon={<Users className="h-5 w-5" />}
                />
                <ClueCard 
                  label="Release Year" 
                  value={albumData.year}
                  icon={<Calendar className="h-5 w-5" />}
                />
                <ClueCard 
                  label="Number of Tracks" 
                  value={albumData.tracks}
                  icon={<Hash className="h-5 w-5" />}
                />
                <ClueCard 
                  label="Duration" 
                  value={albumData.duration}
                  icon={<Music className="h-5 w-5" />}
                />
                <ClueCard 
                  label="Genre" 
                  value={albumData.genre}
                  icon={<Disc className="h-5 w-5" />}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Your Guess</h3>
              <GuessInput 
                onGuess={handleGuess}
                isCorrect={isCorrect}
                isRevealed={isRevealed}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;