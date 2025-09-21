import { useRef, useEffect, useReducer, use } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { fetchTracPreview } from '@/api/game/fetch-track.action';
import { initPlayerReducer, playerReducer } from '@/reducer/music-player.reducer';
import { formatTime } from '@/utils/format-time';
import { TrackList } from './TrackList';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { GameContext } from '@/context/GameContext';

interface MusicPlayerProps {
  tracks: Track[];
  albumName: string;
}

export const MusicPlayer = ({ tracks }: MusicPlayerProps) => {


  const [state, dispatch] = useReducer(playerReducer, initPlayerReducer(tracks[0]));
  const { gameState } = use(GameContext);
  const { hiddenAlbumTitle, isGameOver, albumInfo } = gameState;
  const {
    currentTrack,
    isPlaying,
    audioDuration,
    currentTime,
    isMuted,
    playLisStatus,
    volume } = state;

  const audioRef = useRef<HTMLAudioElement>(null);
  const wasPlayingRef = useRef(false);

  const { data: currentTrackPreview, isLoading } = useQuery({
    queryKey: ['track', { trackId: currentTrack.dreezer_id }],
    queryFn: () => fetchTracPreview(currentTrack.dreezer_id),
    staleTime: 1000 * 60 * 30,
    retryDelay: 1000 * 60
  });

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    dispatch({ type: 'SET_TRACK', payload: tracks[0] })
  }, [tracks])

  // change track effect
  useEffect(() => {
    if (!audioRef.current || !currentTrackPreview?.preview) return;

    wasPlayingRef.current = isPlaying;

    audioRef.current.pause();
    audioRef.current.load();
    audioRef.current.volume = volume / 100;
    dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });

    const handleLoadedData = () => {
      if (wasPlayingRef.current) {
        audioRef.current?.play()
          .then(() => dispatch({ type: 'SET_PLAYING', payload: true }))
          .catch(error => {
            console.log("Error when auto play:", error);
            dispatch({ type: 'SET_PLAYING', payload: false });
          });
      }
    };

    audioRef.current.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audioRef.current?.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [currentTrack, currentTrackPreview]);

  // handle audio effects
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        dispatch({ type: 'SET_AUDIO_DURATION', payload: audio.duration });
      }
    };

    const handleEnded = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
      handleChangeTrack(1);
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

  useEffect(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = 0;
    }
  }, [isMuted])

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      dispatch({ type: 'SET_PLAYING', payload: false });
    } else {
      audioRef.current.play()
        .then(() => dispatch({ type: 'SET_PLAYING', payload: true }))
        .catch(error => {
          console.log("Error al reproducir:", error);
          dispatch({ type: 'SET_PLAYING', payload: false });
        });
    }
  };

  const handleChangeTrack = (direction: number) => {
    let index = tracks.findIndex(({ id }) => id === currentTrack.id);
    index = index + direction;
    if (index < 0) {
      index = tracks.length - 1;
    } else if (index > tracks.length - 1) {
      index = 0;
    }
    dispatch({ type: 'SET_TRACK', payload: tracks[index] })
  };


  const handleVolumeChange = (value: number[]) => {
    dispatch({ type: 'SET_VOLUME', payload: value[0] });
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
      audioRef.current.currentTime = newTime;
    }
  };

  const handleTrackList = () => {
    if (playLisStatus === 'playlist') {
      dispatch({ type: 'SET_PLAYLIST_STATUS', payload: '' })
      return;
    }
    dispatch({ type: 'SET_PLAYLIST_STATUS', payload: 'playlist' })
  }

  return (
    <Card className="gradient-card border-border/50 p-4 space-y-3">
      {/* Track Info */}
      {!isLoading && currentTrackPreview?.preview && (
        <audio ref={audioRef} preload="metadata">
          <source src={currentTrackPreview.preview} type='audio/mpeg' />
        </audio>
      )}

      <div className="text-center space-y-1">
        <h4 className="font-medium text-foreground text-sm">
          {currentTrack.title}
        </h4>
        <p className="text-xs text-muted-foreground">
          {isGameOver ? albumInfo.title : hiddenAlbumTitle}
        </p>
      </div>

      {/* Main Controls Row */}
      <div className="flex items-center justify-center">
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
            className="rounded-full h-9 w-9 shadow-glow transition-bounce hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
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
            max={audioDuration || currentTrack.duration}
            step={1}
            onValueChange={handleProgressChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(audioDuration)}
          </span>

          {/* Volume Control */}
          <div className="relative flex flex-col ml-4 items-center">
            <Popover>
              {/* Botón de volumen */}
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-primary transition-smooth h-6 w-6 p-0"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-3 w-3" />
                  ) : (
                    <Volume2 className="h-3 w-3" />
                  )}
                </Button>
              </PopoverTrigger>

              {/* Slider flotante */}
              <PopoverContent
                side="top"
                align="center"
                className="w-auto bg-background p-2 flex justify-center rounded-md shadow-md"
              >
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  orientation="vertical"
                  className="h-24 justify-center "
                  thumbClassName='w-5 h-2 cursor-pointer hover:scale-150'
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <Button
        variant='link'
        className="text-sm"
        onClick={handleTrackList}
      >
        Tracklist
      </Button>
      <TrackList
        currentTrackId={currentTrack.id}
        dispatch={dispatch}
        trackListStatus={playLisStatus}
        tracks={tracks}
      />
    </Card>
  );
};