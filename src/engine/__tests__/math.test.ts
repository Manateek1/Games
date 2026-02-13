import { describe, expect, it } from "vitest";
import { clamp, hashString, seededRandom } from "../math";

describe("math utilities", () => {
  it("clamp keeps value in range", () => {
    expect(clamp(12, 0, 10)).toBe(10);
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(4, 0, 10)).toBe(4);
  });

  it("seededRandom returns deterministic values", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);

    const valuesA = [a(), a(), a()];
    const valuesB = [b(), b(), b()];

    expect(valuesA).toEqual(valuesB);
  });

  it("hashString is deterministic and non-zero for non-empty", () => {
    expect(hashString("arcade")).toBe(hashString("arcade"));
    expect(hashString("arcade")).not.toBe(0);
  });
});
