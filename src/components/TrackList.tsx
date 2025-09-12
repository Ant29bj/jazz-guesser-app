import { PlayerAction } from "@/reducer/actions/player-reducer.action";
import { Track } from "@/types/game-request";
import { formatTime } from "@/utils/format-time";
import { Accordion, AccordionContent, AccordionItem } from "@radix-ui/react-accordion";
interface Props {
  tracks: Track[];
  trackListStatus: string;
  dispatch: (value: PlayerAction) => void
  currentTrackId: number;
}


export function TrackList({
  tracks,
  trackListStatus,
  dispatch,
  currentTrackId
}: Props) {

  return (
    <Accordion className='flex flex-col' type='single' value={trackListStatus}>

      <AccordionItem value='playlist'>
        <AccordionContent>
          <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent 
                hover:scrollbar-thumb-primary/50">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  dispatch({ type: 'SET_TRACK', payload: track });
                }}
                className={`w-full text-left p-1.5 rounded text-xs transition-smooth ${track.id === currentTrackId
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
  );
}