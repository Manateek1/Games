import { useEffect, useMemo, useState } from "react";
import { seededRandom } from "../engine/math";
import type { GameComponentProps } from "../types/arcade";

interface Card {
  id: string;
  symbol: string;
  matched: boolean;
  flipped: boolean;
}

const symbols = ["▲", "◆", "◉", "☀", "✦", "⬢", "✚", "☯", "✿", "◈", "✪", "✺"];

const configByDifficulty = {
  easy: { pairs: 8, time: 130, columns: 4 },
  normal: { pairs: 10, time: 115, columns: 5 },
  hard: { pairs: 12, time: 95, columns: 6 },
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
  const [cards, setCards] = useState<Card[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.time);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [confetti, setConfetti] = useState<number[]>([]);
  const [resolved, setResolved] = useState(false);

  const matchedCount = useMemo(
    () => cards.reduce((count, card) => count + (card.matched ? 1 : 0), 0),
    [cards],
  );

  useEffect(() => {
    const random = seededRandom(seed);
    const picked = [...symbols].sort(() => random() - 0.5).slice(0, config.pairs);
    const deck = [...picked, ...picked]
      .map((symbol, index) => ({
        id: `${symbol}-${index}`,
        symbol,
        matched: false,
        flipped: false,
      }))
      .sort(() => random() - 0.5);

    setCards(deck);
    setOpen([]);
    setTimeLeft(config.time);
    setMoves(0);
    setScore(0);
    setCombo(0);
    setResolved(false);
    setConfetti([]);
  }, [difficulty, seed, config.pairs, config.time]);

  useEffect(() => {
    onScore(score);
  }, [score, onScore]);

  useEffect(() => {
    if (!paused) {
      onFps(60);
    }
  }, [paused, onFps]);

  useEffect(() => {
    if (paused || resolved) {
      return;
    }
    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [paused, resolved]);

  useEffect(() => {
    if (resolved) {
      return;
    }

    if (matchedCount === cards.length && cards.length > 0) {
      setResolved(true);
      setConfetti(Array.from({ length: 24 }, (_, index) => index));
      const finalScore = score + timeLeft * 8;
      setScore(finalScore);
      onGameOver({ score: finalScore, won: true });
      return;
    }

    if (timeLeft <= 0 && cards.length > 0) {
      setResolved(true);
      onGameOver({ score, won: false });
    }
  }, [cards.length, matchedCount, onGameOver, resolved, score, timeLeft]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onPauseToggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onPauseToggle]);

  const revealCard = (index: number): void => {
    if (paused || resolved) {
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
      setCards((prev) =>
        prev.map((item, idx) => (idx === a || idx === b ? { ...item, matched: true } : item)),
      );
      setOpen([]);
      setCombo((value) => value + 1);
      setScore((value) => value + 80 + combo * 15);
      return;
    }

    setCombo(0);
    window.setTimeout(() => {
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
