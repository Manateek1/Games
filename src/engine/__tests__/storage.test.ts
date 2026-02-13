import { describe, expect, it } from "vitest";
import {
  defaultProgress,
  getBestScore,
  markTutorialSeen,
  withDailyBest,
  withGameResult,
  withUnlockedAchievements,
} from "../storage";

describe("storage helpers", () => {
  it("tracks high scores and stats", () => {
    const updated = withGameResult(defaultProgress, {
      gameId: "neon-dodger",
      difficulty: "easy",
      score: 120,
      won: false,
      combo: 6,
      run: 14,
    });

    expect(getBestScore(updated, "neon-dodger", "easy")).toBe(120);
    expect(updated.stats["neon-dodger"].plays).toBe(1);
    expect(updated.stats["neon-dodger"].bestCombo).toBe(6);
  });

  it("marks tutorials and achievements", () => {
    const tutorial = markTutorialSeen(defaultProgress, "pong-neon");
    expect(tutorial.tutorialsSeen["pong-neon"]).toBe(true);

    const unlocked = withUnlockedAchievements(tutorial, ["a", "b", "a"]);
    expect(unlocked.achievements).toContain("a");
    expect(unlocked.achievements).toContain("b");
    expect(unlocked.achievements.length).toBe(2);
  });

  it("updates daily best only when score improves", () => {
    const first = withDailyBest(defaultProgress, "2026-02-13", "neon-dodger", 80);
    const second = withDailyBest(first, "2026-02-13", "neon-dodger", 40);

    expect(second.dailyBest["2026-02-13"].score).toBe(80);
  });
});
