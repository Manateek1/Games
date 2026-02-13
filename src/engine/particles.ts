import type { GraphicsQuality } from "../types/arcade";
import { randRange } from "./math";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const QUALITY_MULTIPLIER: Record<GraphicsQuality, number> = {
  low: 0.55,
  medium: 1,
  high: 1.5,
};

export class ParticleSystem {
  private particles: Particle[] = [];

  private quality: GraphicsQuality = "medium";

  setQuality(quality: GraphicsQuality): void {
    this.quality = quality;
  }

  burst(params: {
    x: number;
    y: number;
    color: string;
    count: number;
    minSpeed: number;
    maxSpeed: number;
    life: number;
    size: number;
  }): void {
    const total = Math.max(2, Math.round(params.count * QUALITY_MULTIPLIER[this.quality]));

    for (let i = 0; i < total; i += 1) {
      const angle = randRange(0, Math.PI * 2);
      const speed = randRange(params.minSpeed, params.maxSpeed);
      this.particles.push({
        x: params.x,
        y: params.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: params.life,
        maxLife: params.life,
        size: randRange(params.size * 0.55, params.size * 1.25),
        color: params.color,
      });
    }
  }

  update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const particle = this.particles[i];
      particle.life -= dt;
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      particle.vy += 100 * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const particle of this.particles) {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
