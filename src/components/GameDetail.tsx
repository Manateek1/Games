import { GameThumbnail } from "./GameThumbnail";
import type { Difficulty, GameDefinition } from "../types/arcade";

interface GameDetailProps {
  game: GameDefinition;
  difficulty: Difficulty;
  mode: string;
  bestScore: number;
  daily: boolean;
  reducedMotion: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: string) => void;
  onStart: () => void;
  onBack: () => void;
}

export const GameDetail = ({
  game,
  difficulty,
  mode,
  bestScore,
  daily,
  reducedMotion,
  onDifficultyChange,
  onModeChange,
  onStart,
  onBack,
}: GameDetailProps): React.JSX.Element => (
  <section className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
    <article className="rounded-3xl border border-cyan-300/15 bg-[#070c1f]/90 p-4">
      <GameThumbnail renderer={game.thumbnail} reducedMotion={reducedMotion} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="arcade-kicker">{game.genre} cabinet</p>
          <h2 className="font-display text-3xl text-white">{game.title}</h2>
        </div>
        {daily && <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-semibold text-[#03252a]">Daily</span>}
      </div>
      <p className="mt-3 text-cyan-100/80">{game.description}</p>

      <div className="mt-4 space-y-4 rounded-2xl border border-cyan-300/20 bg-[#0a1230] p-4">
        <div>
          <p className="arcade-kicker">Difficulty</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {game.difficulties.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onDifficultyChange(option)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em] ${
                  option === difficulty
                    ? "bg-cyan-300 text-[#04262d]"
                    : "border border-cyan-300/30 text-cyan-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {game.modes && game.modes.length > 0 && (
          <div>
            <p className="arcade-kicker">Mode</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {game.modes.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onModeChange(option.id)}
                  aria-label={option.description}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    option.id === mode
                      ? "bg-orange-300 text-orange-950"
                      : "border border-orange-300/35 text-orange-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-cyan-300/25 bg-[#081026] p-3">
          <p className="arcade-kicker">Personal Best</p>
          <p className="font-display text-4xl text-white">{bestScore}</p>
        </div>
      </div>
    </article>

    <article className="rounded-3xl border border-cyan-300/15 bg-[#060b1a]/90 p-5">
      <p className="arcade-kicker">Controls</p>
      <ul className="mt-2 space-y-2">
        {game.controls.map((item) => (
          <li key={item} className="rounded-lg border border-cyan-300/20 bg-[#0c1331] px-3 py-2 text-cyan-100/85">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onStart} className="arcade-btn-primary">
          Start Game
        </button>
        <button type="button" onClick={onBack} className="arcade-btn-secondary">
          Back
        </button>
      </div>
    </article>
  </section>
);
