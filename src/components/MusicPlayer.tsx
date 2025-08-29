import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

interface Track {
  id: number;
  title: string;
  duration: string;
  // In a real app, this would be the audio file URL
  audioUrl?: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  albumName: string;
  artist: string;
  isRevealed: boolean;
}

export const MusicPlayer = ({ tracks, albumName, artist, isRevealed }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock duration for demo (since we don't have real audio files)
  const mockDuration = 180; // 3 minutes

  useEffect(() => {
    // Simulate audio progress for demo
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= mockDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, mockDuration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % tracks.length);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  return (
    <Card className="gradient-card border-border/50 p-4 space-y-3">
      {/* Track Info */}
      <div className="text-center space-y-1">
        <h4 className="font-medium text-foreground text-sm">
          {isRevealed ? tracks[currentTrack]?.title : `Track ${currentTrack + 1}`}
        </h4>
        <p className="text-xs text-muted-foreground">
          {isRevealed ? `${albumName} • ${artist}` : "Mystery Album"}
        </p>
      </div>

      {/* Play Button */}
      <div className="flex justify-center">
        <Button
          variant="default"
          size="sm"
          onClick={togglePlay}
          className="rounded-full h-10 w-10 shadow-glow transition-bounce hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>
      </div>

      {/* Progress Bar with Volume Control */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Slider
            value={[currentTime]}
            max={mockDuration}
            step={1}
            onValueChange={handleProgressChange}
            className="flex-1"
          />
          
          {/* Volume Control */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="hover:text-primary transition-smooth h-6 w-6 p-0"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-3 w-3" />
              ) : (
                <Volume2 className="h-3 w-3" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-16"
            />
            <span className="text-xs text-muted-foreground w-6 text-center">
              {isMuted ? 0 : volume}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(mockDuration)}</span>
        </div>
      </div>

      {/* Track List */}
      {isRevealed && (
        <div className="space-y-2 pt-3 border-t border-border/50">
          <h5 className="text-xs font-medium text-muted-foreground">Tracklist</h5>
          <div className="space-y-1 max-h-28 overflow-y-auto">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => setCurrentTrack(index)}
                className={`w-full text-left p-1.5 rounded text-xs transition-smooth ${
                  index === currentTrack
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{track.title}</span>
                  <span className="text-xs opacity-70">{track.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};