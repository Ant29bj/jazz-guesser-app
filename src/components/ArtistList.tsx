import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const ArtistList = ({
  hiddenArtist,
  discoveredArtistId,
  attempts,
}: {
  hiddenArtist: { id: number; name: string }[];
  discoveredArtistId: number[];
  attempts: number;
}) => {
  const [animatingIds, setAnimatingIds] = useState<number[]>([]);
  const [flashIds, setFlashIds] = useState<number[]>([]);
  const prevAttemptsRef = useRef<number>(0);

  // green artist
  useEffect(() => {
    setAnimatingIds(prev => [...new Set([...prev, ...discoveredArtistId])]);
  }, [discoveredArtistId]);


  useEffect(() => {
    if (attempts > prevAttemptsRef.current) {
      const idsToFlash = hiddenArtist.map(a => a.id);
      setFlashIds(idsToFlash);

      const timeout = setTimeout(() => setFlashIds([]), 1000);
      return () => clearTimeout(timeout);
    }

    prevAttemptsRef.current = attempts;
  }, [attempts, hiddenArtist]);

  const handleAnimationEnd = (id: number) => {
    setAnimatingIds(prev => prev.filter(aid => aid !== id));
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {hiddenArtist
        .filter(a => a.id || a.name.trim().length > 0)
        .map(({ id, name }) => {
          const isDiscovered = discoveredArtistId.includes(id);
          const isFlashing = flashIds.includes(id);

          let colorClasses = "bg-primary/10 text-primary border-primary/20";
          if (isFlashing) {
            colorClasses = isDiscovered
              ? "bg-green-500/30 border-green-500 text-green-700"
              : "bg-red-500/30 border-red-500 text-red-700";
          }

          return (
            <span
              key={id}
              className={cn(
                "px-3 py-1 rounded-sm text-sm font-thin border transition-colors",
                colorClasses,
                animatingIds.includes(id) ? "animate-wiggle" : ""
              )}
              onAnimationEnd={() => handleAnimationEnd(id)}
            >
              {name}
            </span>
          );
        })}
    </div>
  );
};
