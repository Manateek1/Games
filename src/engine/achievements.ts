import type { Achievement, GameResult, ProgressState } from "../types/arcade";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "neon-1000",
    title: "Neon Ghost",
    description: "Score 1000 in Neon Dodger.",
  },
  {
    id: "asteroid-ace",
    title: "Debris Artist",
    description: "Score 1500 in Asteroids Pulse.",
  },
  {
    id: "brick-master",
    title: "Brick Maestro",
    description: "Clear 3 levels in Brick Breaker Blitz.",
  },
  {
    id: "void-survivor",
    title: "Void Survivor",
    description: "Survive 120 seconds in Void Survival.",
  },
  {
    id: "rhythm-30",
    title: "Combo Current",
    description: "Reach a 30 combo in Rhythm Tap.",
  },
  {
    id: "runner-40",
    title: "Precision Thread",
    description: "Reach streak 40 in Precision Runner.",
  },
  {
    id: "tile-2048",
    title: "Number Alchemist",
    description: "Create a 2048 tile.",
  },
  {
    id: "memory-3wins",
    title: "Mind Palace",
    description: "Win Memory Match 3 times.",
  },
  {
    id: "pong-duel",
    title: "Arcade Rival",
    description: "Win a two-player Pong duel.",
  },
  {
    id: "collector",
    title: "Cabinet Collector",
    description: "Play 8 different games.",
  },
];

export const evaluateAchievements = (
  progress: ProgressState,
  gameId: string,
  mode: string,
  result: GameResult,
): string[] => {
  const unlocked: string[] = [];

  if (gameId === "neon-dodger" && result.score >= 1000) {
    unlocked.push("neon-1000");
  }
  if (gameId === "asteroids-pulse" && result.score >= 1500) {
    unlocked.push("asteroid-ace");
  }
  if (gameId === "brick-breaker-blitz" && (result.stats?.level ?? 0) >= 3) {
    unlocked.push("brick-master");
  }
  if (gameId === "void-survival" && (result.stats?.time ?? 0) >= 120) {
    unlocked.push("void-survivor");
  }
  if (gameId === "rhythm-tap" && (result.stats?.combo ?? 0) >= 30) {
    unlocked.push("rhythm-30");
  }
  if (gameId === "precision-runner" && (result.stats?.run ?? 0) >= 40) {
    unlocked.push("runner-40");
  }
  if (gameId === "game-2048" && (result.stats?.tile ?? 0) >= 2048) {
    unlocked.push("tile-2048");
  }
  if (gameId === "memory-match" && (progress.stats[gameId]?.wins ?? 0) >= 3) {
    unlocked.push("memory-3wins");
  }
  if (gameId === "pong-neon" && mode === "duel" && result.won) {
    unlocked.push("pong-duel");
  }

  const uniqueGamesPlayed = Object.keys(progress.stats).filter(
    (key) => progress.stats[key].plays > 0,
  ).length;
  if (uniqueGamesPlayed >= 8) {
    unlocked.push("collector");
  }

  return unlocked.filter((id) => !progress.achievements.includes(id));
};
