import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { Track } from '@/types/game-request';
import { Accordion, AccordionContent } from './ui/accordion';
import { AccordionItem } from '@radix-ui/react-accordion';
import { useQuery } from '@tanstack/react-query';
import { fetchTracPreview } from '@/api/game/fetch-track.action';


interface MusicPlayerProps {
  tracks: Track[];
  albumName: string;
  isRevealed: boolean;
}

export const MusicPlayer = ({ tracks, albumName, isRevealed }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [playLisStatus, setPlayLisStatus] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: currentTrackPreview, isLoading } = useQuery({
    queryKey: ['track', { trackId: currentTrack.dreezer_id }],
    queryFn: () => fetchTracPreview(currentTrack.dreezer_id),
    staleTime: 1000 * 60 * 30, // half an ahour
    retryDelay: 1000 * 60
  });

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.load();
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isLoading) {
      setIsPlaying(false);
      audioRef.current.pause();
      return;
    }

    setIsPlaying(true);
    audioRef.current.play();
  }, [isLoading]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Actualizar tiempo actual durante reproducción
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Obtener duración real cuando se carga el metadata
    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackPreview]);


  const togglePlay = () => {
    if (!audioRef.current) return;

    setIsPlaying((prev) => {
      const newState = !prev;
      if (newState) {
        audioRef.current.play().catch(error => {
          console.log("Error al reproducir:", error);
          return prev;
        });
      } else {
        audioRef.current?.pause();
      }

      return newState;
    });
  };

  const handleChangeTrack = (direcction: number) => {
    let index = tracks.findIndex(({ id }) => id === currentTrack.id);
    index = index + direcction;
    if (index < 0) {
      index = tracks.length - 1;
    } else if (index > tracks.length - 1) {
      index = 0;
    }

    setCurrentTrack(tracks[index]);
  }


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };



  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <Card className="gradient-card border-border/50 p-4 space-y-3">
      {/* Track Info */}
      {
        !isLoading && (
          <audio ref={audioRef} >
            <source src={currentTrackPreview?.preview} type='audio/mpeg' />
          </audio>
        )
      }
      <div className="text-center space-y-1">
        <h4 className="font-medium text-foreground text-sm">
          {isRevealed ? currentTrack.title : `Track ${currentTrack.title}`}
        </h4>
        <p className="text-xs text-muted-foreground">
          {`${albumName}`}
        </p>
      </div>

      {/* Main Controls Row */}
      <div className="flex items-center justify-center">
        {/* Center - Transport Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleChangeTrack(-1)}
            className="h-8 w-8 p-0 hover:text-primary transition-smooth"
          >
            <ChevronLeft className='scale-150' />
          </Button>

          <Button
            variant="default"
            size="sm"
            disabled={isLoading}
            onClick={togglePlay}
            className="rounded-full h-9 w-9 shadow-glow transition-bounce hover:scale-105"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />

            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}

          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:text-primary transition-smooth"
            onClick={() => handleChangeTrack(1)}
          >
            <ChevronRight className='scale-150' />
          </Button>
        </div>
      </div>

      {/* Progress Bar with Volume */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10 text-left">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={audioDuration}
            step={1}
            onValueChange={handleProgressChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(audioDuration)}
          </span>

          {/* Volume Control */}
          <div className="flex flex-col ml-4">
            {showVolumeSlider && (
              <div className="bg-background w-4 rounded-md">
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  orientation="vertical"
                  className="h-16 [&>span[role=slider]]:h-3 [&>span[role=slider]]:w-3"
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVolumeSlider}
              className="hover:text-primary transition-smooth h-6 w-6 p-0"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-3 w-3" />
              ) : (
                <Volume2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </div>


      <Accordion className='flex flex-col' type='single' value={playLisStatus}>
        <Button
          variant='link'
          className="text-sm"
          onClick={() => setPlayLisStatus((prev) => {
            if (prev === 'playlist') {
              return '';
            }

            return 'playlist';
          })}
        >
          Tracklist
        </Button>
        <AccordionItem value='playlist'>
          <AccordionContent>
            <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent 
                hover:scrollbar-thumb-primary/50">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => setCurrentTrack(track)}
                  className={`w-full text-left p-1.5 rounded text-xs transition-smooth ${track.id === currentTrack.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{track.title}</span>
                    <span className="text-xs opacity-70">{formatTime(track.duration)}</span>
                  </div>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};