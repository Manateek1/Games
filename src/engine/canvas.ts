export interface BackBuffer {
  canvas: OffscreenCanvas | HTMLCanvasElement;
  ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
}

export const setupCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D context unavailable");
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
};

export const createBackBuffer = (width: number, height: number): BackBuffer => {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Offscreen canvas failed");
    }
    return { canvas, ctx };
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Back buffer failed");
  }
  return { canvas, ctx };
};

export const drawNeonGrid = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
): void => {
  ctx.fillStyle = "#060817";
  ctx.fillRect(0, 0, width, height);

  const spacing = 26;
  const offset = (time * 0.045) % spacing;

  ctx.strokeStyle = "rgba(76, 255, 234, 0.16)";
  ctx.lineWidth = 1;

  for (let x = -spacing; x < width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x + offset, height);
    ctx.stroke();
  }

  for (let y = -spacing; y < height + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + offset);
    ctx.lineTo(width, y + offset);
    ctx.stroke();
  }

  const glow = ctx.createRadialGradient(width * 0.5, height * 0.5, 20, width * 0.5, height * 0.5, height * 0.75);
  glow.addColorStop(0, "rgba(95, 255, 235, 0.08)");
  glow.addColorStop(1, "rgba(255, 105, 140, 0.04)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
};
