export class PointSystem {
  private score: number;

  constructor(initialScore: number = 0) {
    this.score = initialScore;
  }

  addPoint(): void {
    this.score += 1;
  }

  subtractPoint(): void {
    this.score -= 1;
  }

  getScore(): number {
    return this.score;
  }

  resetScore(newScore: number = 0): void {
    this.score = newScore;
  }
}
