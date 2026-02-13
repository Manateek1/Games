export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const lerp = (start: number, end: number, amount: number): number =>
  start + (end - start) * amount;

export const randRange = (min: number, max: number, random = Math.random): number =>
  random() * (max - min) + min;

export const randInt = (min: number, max: number, random = Math.random): number =>
  Math.floor(randRange(min, max + 1, random));

export const dist = (ax: number, ay: number, bx: number, by: number): number =>
  Math.hypot(ax - bx, ay - by);

export const wrap = (value: number, max: number): number => {
  if (value < 0) {
    return value + max;
  }
  if (value > max) {
    return value - max;
  }
  return value;
};

export const circleHitsCircle = (
  ax: number,
  ay: number,
  ar: number,
  bx: number,
  by: number,
  br: number,
): boolean => dist(ax, ay, bx, by) <= ar + br;

export const circleHitsRect = (
  cx: number,
  cy: number,
  radius: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean => {
  const px = clamp(cx, rx, rx + rw);
  const py = clamp(cy, ry, ry + rh);
  const dx = cx - px;
  const dy = cy - py;
  return dx * dx + dy * dy <= radius * radius;
};

export const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const seededRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
