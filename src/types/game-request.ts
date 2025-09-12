export interface GameResponse {
  id: number;
  deezerId: number;
  title: string;
  cover: string;
  coverSmall: string;
  coverMedium: string;
  coverBig: string;
  coverXl: string;
  releaseDate: Date;
  duration: number;
  artists: Artist[];
  tracks: Track[];
}

export interface Artist {
  id: number;
  deezerId: number;
  name: string;
}

export interface Track {
  id: number;
  dreezer_id: number;
  title: string;
  duration: number;
  album_id: number;
  artists: string;
}
