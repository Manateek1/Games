import { useEffect, useRef, useState } from "react";
import { seededRandom } from "../engine/math";
import type { GameComponentProps } from "../types/arcade";

interface Card {
  id: string;
  symbol: string;
  matched: boolean;
  flipped: boolean;
}

type MatchStatus = "playing" | "won" | "lost";

const symbols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const configByDifficulty = {
  easy: { pairs: 8, time: 130, columns: 4 },
  normal: { pairs: 10, time: 115, columns: 5 },
  hard: { pairs: 12, time: 95, columns: 6 },
};

const createDeck = (seed: number, pairs: number): Card[] => {
  const random = seededRandom(seed);
  const picked = [...symbols].sort(() => random() - 0.5).slice(0, pairs);
  return [...picked, ...picked]
    .map((symbol, index) => ({
      id: `${symbol}-${index}`,
      symbol,
      matched: false,
      flipped: false,
    }))
    .sort(() => random() - 0.5);
};

export const MemoryMatch = ({
  difficulty,
  seed,
  paused,
  onScore,
  onFps,
  onPauseToggle,
  onGameOver,
}: GameComponentProps): React.JSX.Element => {
  const config = configByDifficulty[difficulty];

  const [cards, setCards] = useState<Card[]>(() => createDeck(seed, config.pairs));
  const [open, setOpen] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.time);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [confetti, setConfetti] = useState<number[]>([]);
  const [status, setStatus] = useState<MatchStatus>("playing");

  const scoreRef = useRef(score);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    scoreRef.current = score;
    onScore(score);
  }, [score, onScore]);

  useEffect(() => {
    if (!paused) {
      onFps(60);
    }
  }, [paused, onFps]);

  useEffect(() => {
    if (paused || status !== "playing") {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        const next = Math.max(0, value - 1);
        if (next === 0) {
          setStatus((current) => {
            if (current !== "playing") {
              return current;
            }
            onGameOver({ score: scoreRef.current, won: false });
            return "lost";
          });
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [paused, status, onGameOver]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onPauseToggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onPauseToggle]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const revealCard = (index: number): void => {
    if (paused || status !== "playing") {
      return;
    }

    const card = cards[index];
    if (!card || card.flipped || card.matched || open.length >= 2) {
      return;
    }

    const nextCards = cards.map((item, idx) => (idx === index ? { ...item, flipped: true } : item));
    const nextOpen = [...open, index];
    setCards(nextCards);
    setOpen(nextOpen);

    if (nextOpen.length < 2) {
      return;
    }

    setMoves((value) => value + 1);

    const [a, b] = nextOpen;
    const first = nextCards[a];
    const second = nextCards[b];

    if (first.symbol === second.symbol) {
      const nextCombo = combo + 1;
      const gained = 80 + nextCombo * 15;
      const matchedCards = nextCards.map((item, idx) =>
        idx === a || idx === b ? { ...item, matched: true } : item,
      );
      const solved = matchedCards.every((item) => item.matched);

      setCards(matchedCards);
      setOpen([]);
      setCombo(nextCombo);

      if (solved) {
        const finalScore = score + gained + timeLeft * 8;
        setScore(finalScore);
        setStatus("won");
        setConfetti(Array.from({ length: 24 }, (_, item) => item));
        onGameOver({ score: finalScore, won: true });
      } else {
        setScore((value) => value + gained);
      }

      return;
    }

    setCombo(0);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCards((prev) =>
        prev.map((item, idx) =>
          idx === a || idx === b
            ? {
                ...item,
                flipped: false,
              }
            : item,
        ),
      );
      setOpen([]);
      timeoutRef.current = null;
    }, 520);
  };

  return (
    <div className="mx-auto w-full max-w-[840px] space-y-4 rounded-2xl border border-cyan-300/25 bg-[#071026] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-cyan-100">
        <p>Time: <strong className="text-white">{timeLeft}</strong></p>
        <p>Moves: <strong className="text-white">{moves}</strong></p>
        <p>Combo: <strong className="text-white">{combo}</strong></p>
      </div>

      <div className="relative">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))` }}
          aria-label="Memory match board"
        >
          {cards.map((card, index) => {
            const faceUp = card.flipped || card.matched;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => revealCard(index)}
                className={`aspect-square rounded-lg border text-2xl font-display transition-all duration-200 ${
                  faceUp
                    ? "border-cyan-100 bg-cyan-300 text-[#032329]"
                    : "border-cyan-300/30 bg-[#0e1738] text-cyan-100/20"
                }`}
              >
                {faceUp ? card.symbol : "?"}
              </button>
            );
          })}
        </div>

        {confetti.length > 0 && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {confetti.map((item) => (
              <span
                key={item}
                className="confetti"
                style={{
                  left: `${(item / confetti.length) * 100}%`,
                  animationDelay: `${(item % 7) * 0.08}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
