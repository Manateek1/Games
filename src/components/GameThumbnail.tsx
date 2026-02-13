import { useEffect, useRef } from "react";
import type { ThumbnailRenderer } from "../types/arcade";

interface GameThumbnailProps {
  renderer: ThumbnailRenderer;
  reducedMotion: boolean;
}

export const GameThumbnail = ({ renderer, reducedMotion }: GameThumbnailProps): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const width = 320;
    const height = 180;
    canvas.width = width;
    canvas.height = height;

    let raf = 0;
    const start = performance.now();

    const tick = (time: number): void => {
      const elapsed = reducedMotion ? 0 : time - start;
      renderer(ctx, elapsed, width, height);
      if (!reducedMotion) {
        raf = window.requestAnimationFrame(tick);
      }
    };

    tick(start);

    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, [renderer, reducedMotion]);

  return <canvas ref={canvasRef} className="h-[180px] w-full rounded-xl border border-cyan-300/25 bg-[#040414]" aria-hidden />;
};
