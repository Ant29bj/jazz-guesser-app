import { Card } from '@/components/ui/card';
import { Trophy, Target, Timer } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  attempts: number;
  timeElapsed?: number;
}

export const ScoreDisplay = ({ score, attempts, timeElapsed }: ScoreDisplayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            <p className="text-foreground font-bold text-xl">{attempts}</p>
          </div>
        </div>
      </Card>
      
      {timeElapsed !== undefined && (
        <Card className="gradient-card border-border/50 p-4 col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <Timer className="text-secondary-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-sm">Time</p>
              <p className="text-foreground font-bold text-xl">{formatTime(timeElapsed)}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};