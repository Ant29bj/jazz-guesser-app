import { Artist } from "@/types/game-request";

export interface revealLettersInAlbumTitleProportionalParamInterface {
  hiddenTitle: string,
  originalTitle: string,
  artists: Artist[],
  currentAttempt: number,
  maxAttempts: number
}

export interface revealLettersProportional {
  hiddenArtists: Artist[],
  original: Artist[],
  currentAttempt: number,
  maxAttempts: number
}

const replaceChar = '#';

export function hideName(artist: Artist): Artist {
  return {
    ...artist,
    name: artist.name
      .split("")
      .map(char => (char === " " ? " " : replaceChar))
      .join("")
  };
}


export function hideArtistInAlbumTitle(albumTitle: string, artists: Artist[]): string {
  let hiddenTitle = albumTitle;

  artists.forEach(artist => {
    const pattern = new RegExp(artist.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

    hiddenTitle = hiddenTitle.replace(pattern, match =>
      match
        .split('')
        .map(char => (char === ' ' ? ' ' : replaceChar))
        .join('')
    );
  });

  return hiddenTitle;
}


export function revealLettersProportional({
  hiddenArtists,
  original,
  currentAttempt,
  maxAttempts }: revealLettersProportional): Artist[] {
  // find the missing characters
  const hiddenPositions: { artistIdx: number; charIdx: number; char: string }[] = [];

  console.log(`Current attempt: ${currentAttempt}, Max attempts: ${maxAttempts}`);

  hiddenArtists.forEach((artist, artistIdx) => {
    const originalArtist = original[artistIdx];


    if (!originalArtist) {
      console.warn(`Original artist not found at index ${artistIdx}`);
      return;
    }

    const originalName = originalArtist.name;
    const hiddenName = artist.name;

    // Verificar que las longitudes coincidan
    if (hiddenName.length !== originalName.length) {
      console.warn(`Length mismatch at artist ${artistIdx}: hidden=${hiddenName.length}, original=${originalName.length}`);
      return;
    }

    // Buscar caracteres ocultos
    for (let charIdx = 0; charIdx < hiddenName.length; charIdx++) {
      const char = hiddenName[charIdx];
      const originalChar = originalName[charIdx];

      // Verificar que originalChar exista y no sea espacio
      if (char === replaceChar && originalChar && originalChar !== ' ') {
        hiddenPositions.push({
          artistIdx,
          charIdx,
          char: originalChar
        });
      }
    }
  });

  if (hiddenPositions.length === 0) {
    console.log('No hidden positions found');
    return hiddenArtists;
  }

  console.log(`Found ${hiddenPositions.length} hidden characters to reveal`);

  // Calcular letras a revelar (con protección contra división por cero)
  const attemptsLeft = Math.max(1, maxAttempts - currentAttempt + 1);
  const lettersToReveal = Math.max(1, Math.ceil(hiddenPositions.length / attemptsLeft));

  // Seleccionar letras aleatorias
  const positionsToReveal: typeof hiddenPositions = [];
  const tempPositions = [...hiddenPositions];

  for (let i = 0; i < lettersToReveal && tempPositions.length > 0; i++) {
    const randomIdx = Math.floor(Math.random() * tempPositions.length);
    const position = tempPositions[randomIdx];

    // Verificar que la posición sea válida
    if (position && position.char) {
      positionsToReveal.push(position);
    }

    tempPositions.splice(randomIdx, 1);
  }

  // Revelar las letras seleccionadas
  const newHidden = hiddenArtists.map((artist, artistIdx) => {
    const originalArtist = original[artistIdx];

    if (!originalArtist) return artist;

    const originalName = originalArtist.name;
    const hiddenName = artist.name.split('');

    // Verificar que las longitudes coincidan
    if (hiddenName.length !== originalName.length) {
      return artist;
    }

    positionsToReveal.forEach(pos => {
      // Verificar que todos los datos existan
      if (pos &&
        pos.artistIdx === artistIdx &&
        pos.charIdx >= 0 &&
        pos.charIdx < hiddenName.length &&
        pos.charIdx < originalName.length &&
        pos.char) {

        hiddenName[pos.charIdx] = originalName[pos.charIdx];
      }
    });

    return {
      ...artist,
      name: hiddenName.join('')
    };
  });

  return newHidden;
}


export function revealLettersInAlbumTitleProportional({
  hiddenTitle,
  originalTitle,
  artists,
  currentAttempt,
  maxAttempts
}: revealLettersInAlbumTitleProportionalParamInterface): string {
  const hiddenPositions: { idx: number; char: string }[] = [];

  artists.forEach(artist => {
    const pattern = new RegExp(artist.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match;
    while ((match = pattern.exec(originalTitle)) !== null) {
      const startIdx = match.index;
      const name = match[0];
      for (let i = 0; i < name.length; i++) {
        const char = name[i];
        if (char !== ' ' && hiddenTitle[startIdx + i] === replaceChar) {
          hiddenPositions.push({ idx: startIdx + i, char });
        }
      }
    }
  });

  if (hiddenPositions.length === 0) return hiddenTitle; // todo revelado

  const lettersToReveal = Math.ceil(hiddenPositions.length / (maxAttempts - currentAttempt + 1));

  const positionsToReveal: typeof hiddenPositions = [];
  const tempPositions = [...hiddenPositions];

  for (let i = 0; i < lettersToReveal && tempPositions.length > 0; i++) {
    const idx = Math.floor(Math.random() * tempPositions.length);
    positionsToReveal.push(tempPositions[idx]);
    tempPositions.splice(idx, 1);
  }

  const newTitle = hiddenTitle.split('');
  positionsToReveal.forEach(pos => {
    newTitle[pos.idx] = pos.char;
  });

  return newTitle.join('');
}

export function revealAllOccurrencesOfArtist({
  hiddenArtists,
  original,
  guessedArtist
}: {
  hiddenArtists: Artist[];
  original: Artist[];
  guessedArtist: string;
}): {
  updatedArtists: Artist[];
  matchCount: number;
  matchedArtists: Artist[];
} {


  const normalizedGuess = guessedArtist.toLowerCase().trim();
  console.log(`🔍 Searching for "${normalizedGuess}" in artists...`);

  let matchCount = 0;
  const matchedArtists: Artist[] = [];

  const updatedArtists = hiddenArtists.map((hiddenArtist, artistIdx) => {
    const originalArtist = original[artistIdx];
    const originalName = originalArtist.name.toLowerCase();

    const doesGuessMatch = originalName.includes(normalizedGuess) ||
      normalizedGuess.includes(originalName);

    if (doesGuessMatch) {
      matchCount++;
      matchedArtists.push(originalArtist);
      console.log(`✅ Match ${matchCount}: "${originalArtist.name}"`);
      return originalArtist;
    }

    return hiddenArtist;
  });

  console.log(`📊 Total matches found: ${matchCount}`);

  return {
    updatedArtists,
    matchCount,
    matchedArtists
  };
}

