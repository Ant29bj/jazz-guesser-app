import { Card } from '@/components/ui/card';
import { Trophy, Target, Timer } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  attempts: number;
  maxAttempts: number;
}

export const ScoreDisplay = ({ score, attempts, maxAttempts }: ScoreDisplayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
      <Card className="gradient-card border-border/50 p-4">
        <div className="flex items-center gap-3">
          <Trophy className="text-primary h-5 w-5" />
          <div>
            <p className="text-muted-foreground text-sm">Score</p>
            <p className="text-foreground font-bold text-xl">{score}</p>
          </div>
        </div>
      </Card>

      <Card className="gradient-card border-border/50 p-4">
        <div className="flex items-center gap-3">
          <Target className="text-accent h-5 w-5" />
          <div>
            <p className="text-muted-foreground text-sm">Attempts</p>
            <p className="text-foreground font-bold text-xl">{attempts}/{maxAttempts}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};