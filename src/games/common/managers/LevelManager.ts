import Level from "../models/Level";

export default class LevelManager<T extends Level> {
  private levels: T[];
  private currentIndex: number;

  constructor(levels: T[]) {
    this.levels = levels;
    this.currentIndex = 0;
  }

  nextLevel(): boolean {
    this.currentIndex++;
    if (this.currentIndex < this.levels.length) return true;
    return false;
  }

  isFinished(): boolean {
    if (this.currentIndex >= this.levels.length) return true;
    return false;
  }

  getCurrentLevel(): T {
    return this.levels[this.currentIndex];
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }
}
