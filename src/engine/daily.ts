import type { DailyChallenge } from "../types/arcade";
import { hashString } from "./math";

export const dateKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const pickDailyChallenge = (gameIds: string[], date = new Date()): DailyChallenge => {
  const dayKey = dateKey(date);
  const seed = hashString(`arcadehub-${dayKey}`);
  const gameId = gameIds[seed % gameIds.length];

  return {
    dateKey: dayKey,
    gameId,
    seed,
  };
};
