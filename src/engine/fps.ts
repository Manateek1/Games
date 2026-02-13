export class RollingFps {
  private history: number[] = [];

  private last = 0;

  next(now: number): number {
    if (this.last === 0) {
      this.last = now;
      return 0;
    }

    const delta = now - this.last;
    this.last = now;
    if (delta <= 0) {
      return this.value;
    }

    this.history.push(1000 / delta);
    if (this.history.length > 45) {
      this.history.shift();
    }

    return this.value;
  }

  get value(): number {
    if (this.history.length === 0) {
      return 0;
    }
    const sum = this.history.reduce((total, item) => total + item, 0);
    return sum / this.history.length;
  }
}
