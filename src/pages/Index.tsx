import { use, useEffect } from 'react';
import { MusicPlayer } from '@/components/MusicPlayer';
import { ClueCard } from '@/components/ClueCard';
import { GuessInput } from '@/components/GuessInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { Music, Calendar, Hash, Users, Captions } from 'lucide-react';
import { useFormatSeconds } from '@/hooks/use-formatSeconds';
import { GameContext } from '@/context/GameContext';
import { cn } from '@/lib/utils';
import { ArtistList } from '@/components/ArtistList';
import { LoadingPage } from './LoadingPage';

const JazzGuessApp = () => {
  const { gameState, query } = use(GameContext);
  const { isFetching } = query;
  const {
    discoveredArtistId,
    score,
    attemps,
    maxAttempts,
    isGameOver,
    albumInfo: album,
    hiddenAlbumTitle,
    hiddenArtist } = gameState;

  const albumbDuration = useFormatSeconds(album?.duration ?? 0);


  if (!album || isFetching) {
    return (
      <LoadingPage />
    );
  }


  return (
    <div className="min-h-screen bg-gradient-jazz">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
            Jazz Guesser
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Can you identify whos playing?
          </p>
        </div>

        {/* Score Display */}
        <div className="mb-8">
          <ScoreDisplay score={score} attempts={attemps} maxAttempts={maxAttempts} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Album Cover and Music Player */}
          <div className="space-y-6">
            <div className="aspect-square max-w-md mx-auto">
              <img
                className={isGameOver ? '' : cn('blur-xl')}
                src={album.coverXl}
                alt={album.title} />
            </div>

            {/* Music Player */}
            <div className="max-w-md mx-auto">
              <MusicPlayer
                tracks={album.tracks}
                albumName={album.title}
              />
            </div>
          </div>

          {/* Clues and Input */}
          <div className="space-y-6">
            <div >
              <div className='mb-6'>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Your Guess</h3>
                <GuessInput />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Album Clues</h3>
              <div className="grid gap-4">
                <ClueCard
                  label="Artist"
                  icon={<Users className="h-5 w-5" />}
                >
                  <ArtistList
                    hiddenArtist={hiddenArtist}
                    discoveredArtistId={discoveredArtistId}
                    attempts={attemps}
                  />
                </ClueCard>

                <ClueCard
                  label="Release Year"
                  icon={<Calendar className="h-5 w-5" />}
                >
                  {new Date(album.releaseDate).getFullYear()}
                </ClueCard>
                <ClueCard
                  label="Number of Tracks"
                  icon={<Hash className="h-5 w-5" />}
                >
                  {album.tracks.length}
                </ClueCard>
                <ClueCard
                  label="Duration"
                  icon={<Music className="h-5 w-5" />}
                >
                  {albumbDuration}
                </ClueCard>
                <ClueCard
                  label="Album Name"
                  icon={<Captions className="h-5 w-5" />}
                >
                  {isGameOver ? album.title : hiddenAlbumTitle}
                </ClueCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JazzGuessApp;