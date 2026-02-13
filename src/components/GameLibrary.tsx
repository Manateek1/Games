import { GameThumbnail } from "./GameThumbnail";
import type { GameDefinition, GameGenre } from "../types/arcade";

interface GameLibraryProps {
  games: GameDefinition[];
  search: string;
  setSearch: (value: string) => void;
  filter: GameGenre | "all";
  setFilter: (value: GameGenre | "all") => void;
  onOpen: (gameId: string) => void;
  reducedMotion: boolean;
  dailyGameId: string;
}

const filters: Array<{ value: GameGenre | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "action", label: "Action" },
  { value: "reflex", label: "Reflex" },
  { value: "puzzle", label: "Puzzle" },
];

export const GameLibrary = ({
  games,
  search,
  setSearch,
  filter,
  setFilter,
  onOpen,
  reducedMotion,
  dailyGameId,
}: GameLibraryProps): React.JSX.Element => (
  <section className="space-y-6">
    <div className="rounded-2xl border border-cyan-300/20 bg-[#070d22]/85 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-sm">
          <label htmlFor="game-search" className="sr-only">
            Search games
          </label>
          <input
            id="game-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games, tags, controls"
            className="w-full rounded-lg border border-cyan-300/25 bg-[#0b1230] px-4 py-3 text-cyan-100 placeholder:text-cyan-100/35 focus:border-cyan-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                filter === item.value
                  ? "bg-cyan-300 text-[#03252c]"
                  : "border border-cyan-300/35 text-cyan-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {games.map((game) => (
        <article
          key={game.id}
          className="group rounded-2xl border border-cyan-300/15 bg-[#060a1b]/90 p-3 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/55"
        >
          <div className="relative">
            <GameThumbnail renderer={game.thumbnail} reducedMotion={reducedMotion} />
            <div className="absolute left-2 top-2 flex gap-2">
              {game.isNew && (
                <span className="rounded-full bg-orange-300 px-2 py-1 text-[11px] font-bold text-orange-950">
                  NEW
                </span>
              )}
              {game.id === dailyGameId && (
                <span className="rounded-full bg-cyan-300 px-2 py-1 text-[11px] font-bold text-[#022429]">
                  DAILY
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2 p-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl text-white">{game.title}</h3>
              <span className="rounded-full border border-cyan-300/30 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100/70">
                {game.genre}
              </span>
            </div>
            <p className="text-sm text-cyan-100/80">{game.shortDescription}</p>
            <div className="flex flex-wrap gap-2">
              {game.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cyan-300/20 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100/75"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button type="button" onClick={() => onOpen(game.id)} className="arcade-btn-primary mt-2 w-full">
              Open Cabinet
            </button>
          </div>
        </article>
      ))}
    </div>
  </section>
);
