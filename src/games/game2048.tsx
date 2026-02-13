import { useEffect, useMemo, useRef, useState } from "react";
import { seededRandom } from "../engine/math";
import type { GameComponentProps } from "../types/arcade";

type Direction = "left" | "right" | "up" | "down";

const targetByDifficulty = {
  easy: 1024,
  normal: 2048,
  hard: 4096,
};

const boardSizeByDifficulty = {
  easy: 4,
  normal: 4,
  hard: 5,
};

const keyToDirection: Record<string, Direction> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
  a: "left",
  d: "right",
  w: "up",
  s: "down",
};

const emptyBoard = (size: number): number[][] =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => 0));

const cloneBoard = (board: number[][]): number[][] => board.map((row) => [...row]);

const compressRow = (row: number[]): number[] => row.filter((value) => value !== 0);

const mergeRow = (row: number[]): { row: number[]; gained: number } => {
  const working = [...row];
  let gained = 0;
  for (let i = 0; i < working.length - 1; i += 1) {
    if (working[i] !== 0 && working[i] === working[i + 1]) {
      working[i] *= 2;
      gained += working[i];
      working[i + 1] = 0;
    }
  }
  return {
    row: compressRow(working),
    gained,
  };
};

const rotateClockwise = (board: number[][]): number[][] => {
  const size = board.length;
  const next = emptyBoard(size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      next[x][size - 1 - y] = board[y][x];
    }
  }
  return next;
};

const rotate = (board: number[][], turns: number): number[][] => {
  let next = cloneBoard(board);
  for (let i = 0; i < turns; i += 1) {
    next = rotateClockwise(next);
  }
  return next;
};

const hasMoves = (board: number[][]): boolean => {
  const size = board.length;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (board[y][x] === 0) {
        return true;
      }
      if (x + 1 < size && board[y][x] === board[y][x + 1]) {
        return true;
      }
      if (y + 1 < size && board[y][x] === board[y + 1][x]) {
        return true;
      }
    }
  }
  return false;
};

const tileColor = (value: number): string => {
  const map: Record<number, string> = {
    0: "bg-[#0f1736] text-cyan-100/30",
    2: "bg-[#1f2f6c] text-cyan-50",
    4: "bg-[#264884] text-cyan-50",
    8: "bg-[#2f6ca8] text-cyan-50",
    16: "bg-[#3a9ec2] text-cyan-50",
    32: "bg-[#45c8be] text-[#032329]",
    64: "bg-[#68e9ac] text-[#032329]",
    128: "bg-[#9efb7a] text-[#1e2d02]",
    256: "bg-[#d7ff68] text-[#2e2f00]",
    512: "bg-[#ffe45c] text-[#302300]",
    1024: "bg-[#ffbe52] text-[#2f1800]",
    2048: "bg-[#ff8a66] text-[#2d0f00]",
    4096: "bg-[#ff5d8b] text-white",
  };
  return map[value] ?? "bg-[#ff5d8b] text-white";
};

export const Game2048 = ({
  difficulty,
  seed,
  paused,
  onScore,
  onFps,
  onPauseToggle,
  onGameOver,
}: GameComponentProps): React.JSX.Element => {
  const size = boardSizeByDifficulty[difficulty];
  const randomRef = useRef(seededRandom(seed));
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const endedRef = useRef(false);

  const [board, setBoard] = useState<number[][]>(() => emptyBoard(size));
  const [score, setScore] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  const maxTile = useMemo(() => Math.max(...board.flat()), [board]);

  const spawnTile = (working: number[][]): void => {
    const spaces: Array<{ x: number; y: number }> = [];
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (working[y][x] === 0) {
          spaces.push({ x, y });
        }
      }
    }

    if (spaces.length === 0) {
      return;
    }

    const pick = spaces[Math.floor(randomRef.current() * spaces.length)];
    working[pick.y][pick.x] = randomRef.current() < 0.9 ? 2 : 4;
  };

  const reset = (): void => {
    const next = emptyBoard(size);
    spawnTile(next);
    spawnTile(next);
    setBoard(next);
    setScore(0);
    setPulseKey((value) => value + 1);
    endedRef.current = false;
  };

  useEffect(() => {
    randomRef.current = seededRandom(seed);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, difficulty]);

  useEffect(() => {
    onScore(score);
  }, [score, onScore]);

  useEffect(() => {
    if (!paused) {
      onFps(60);
    }
  }, [paused, onFps]);

  const move = (direction: Direction): void => {
    if (paused || endedRef.current) {
      return;
    }

    const rotateTurns = direction === "left" ? 0 : direction === "up" ? 3 : direction === "right" ? 2 : 1;
    let working = rotate(board, rotateTurns);
    let moved = false;
    let gained = 0;

    for (let y = 0; y < size; y += 1) {
      const original = working[y];
      const compressed = compressRow(original);
      const merged = mergeRow(compressed);
      const rebuilt = [...merged.row, ...Array.from({ length: size - merged.row.length }, () => 0)];

      if (rebuilt.some((value, index) => value !== original[index])) {
        moved = true;
      }

      gained += merged.gained;
      working[y] = rebuilt;
    }

    if (!moved) {
      return;
    }

    working = rotate(working, (4 - rotateTurns) % 4);
    spawnTile(working);

    setBoard(working);
    setScore((value) => value + gained);
    setPulseKey((value) => value + 1);

    const won = maxTile >= targetByDifficulty[difficulty] || working.flat().some((value) => value >= targetByDifficulty[difficulty]);
    const stuck = !hasMoves(working);

    if ((won || stuck) && !endedRef.current) {
      endedRef.current = true;
      onGameOver({
        score: score + gained,
        won,
        stats: {
          tile: Math.max(...working.flat()),
        },
      });
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onPauseToggle();
        return;
      }
      const direction = keyToDirection[event.key] ?? keyToDirection[event.key.toLowerCase()];
      if (direction) {
        event.preventDefault();
        move(direction);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const onPointerStart = (event: React.PointerEvent<HTMLDivElement>): void => {
    touchStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!touchStartRef.current) {
      return;
    }

    const dx = event.clientX - touchStartRef.current.x;
    const dy = event.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? "right" : "left");
    } else {
      move(dy > 0 ? "down" : "up");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[560px] space-y-4 rounded-2xl border border-cyan-300/25 bg-[#071027] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-cyan-100">
        <p className="arcade-kicker">Target {targetByDifficulty[difficulty]}</p>
        <p>Tile {maxTile}</p>
      </div>

      <div
        className="grid gap-2 rounded-xl bg-[#0f1738] p-2"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        onPointerDown={onPointerStart}
        onPointerUp={onPointerEnd}
      >
        {board.flatMap((row, y) =>
          row.map((value, x) => (
            <div
              key={`${x}-${y}-${pulseKey}`}
              className={`flex aspect-square items-center justify-center rounded-lg font-display text-2xl transition-all duration-150 ${tileColor(value)} ${value > 0 ? "scale-100" : "scale-95"}`}
            >
              {value === 0 ? "" : value}
            </div>
          )),
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <button type="button" className="arcade-btn-secondary" onClick={() => move("left")}>Left</button>
        <button type="button" className="arcade-btn-secondary" onClick={() => move("right")}>Right</button>
        <button type="button" className="arcade-btn-secondary" onClick={() => move("up")}>Up</button>
        <button type="button" className="arcade-btn-secondary" onClick={() => move("down")}>Down</button>
      </div>
    </div>
  );
};
