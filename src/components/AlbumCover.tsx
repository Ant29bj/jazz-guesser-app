import { useState } from 'react';
import sampleAlbum from '@/assets/sample-album.jpg';

interface AlbumCoverProps {
  isRevealed: boolean;
  albumName: string;
}

export const AlbumCover = ({ isRevealed, albumName }: AlbumCoverProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-lg shadow-card">
        <img
          src={sampleAlbum}
          alt={isRevealed ? albumName : "Mystery jazz album"}
          className={`w-full h-full object-cover transition-smooth ${
            !isRevealed ? 'blur-album' : ''
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
        )}
        
        {!isRevealed && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
        )}
        
        <div className="absolute inset-0 ring-1 ring-border rounded-lg" />
      </div>
      
      {isRevealed && (
        <div className="absolute -inset-1 bg-gradient-gold rounded-lg opacity-0 group-hover:opacity-20 transition-smooth -z-10" />
      )}
    </div>
  );
};