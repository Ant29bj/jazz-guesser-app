import { useState } from 'react';
import { MusicPlayer } from '@/components/MusicPlayer';
import { ClueCard } from '@/components/ClueCard';
import { GuessInput } from '@/components/GuessInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { Music, Calendar, Hash, Users, Captions } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchRandomAlbumAction } from '@/api/game/fetch-random-album.action';
import { useFormatSeconds } from '@/hooks/use-formatSeconds';


const JazzGuessApp = () => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const { data: album, isLoading } = useQuery({
    queryKey: ['albumData'],
    queryFn: fetchRandomAlbumAction,
    staleTime: 1000 * 60 * 30, // half an hour
    retryDelay: 1000 * 60 * 1
  });


  const albumbDuration = useFormatSeconds(album?.duration ?? 0);

  if (isLoading) {
    return (
      <p >Loading... </p>
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
            Can you identify this classic jazz album from the clues? Study the blurred cover and use the hints to make your guess!
          </p>
        </div>

        {/* Score Display */}
        <div className="mb-8">
          <ScoreDisplay score={0} attempts={0} timeElapsed={0} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Album Cover and Music Player */}
          <div className="space-y-6">
            <div className="aspect-square max-w-md mx-auto">
              <img
                className='blur-lg'
                src={album.coverXl}
                alt={album.title} />
            </div>

            {/* Music Player */}
            <div className="max-w-md mx-auto">
              <MusicPlayer
                tracks={album.tracks}
                albumName={album.title}
                isRevealed={isRevealed}
              />
            </div>
          </div>

          {/* Clues and Input */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Album Clues</h3>
              <div className="grid gap-4">
                <ClueCard
                  label="Artist"
                  icon={<Users className="h-5 w-5" />}
                >
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {
                      album.artists.map(({ id, name }) => (
                        <span
                          key={id}
                          className='bg-primary/10 text-primary px-3 py-1 rounded-sm text-sm font-thin border border-primary/20'
                        >
                          {name}
                        </span>
                      ))
                    }
                  </div>
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
                  {album.title}
                </ClueCard>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Your Guess</h3>
              <GuessInput
                onGuess={() => console.log('')}
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

export default JazzGuessApp;