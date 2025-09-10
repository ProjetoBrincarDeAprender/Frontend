import type Level from "../vowels/Level";

export default class LevelManager {
  private levels: Level[];
  private currentIndex: number;

  constructor(levels: Level[]) {
    this.levels = levels;
    this.currentIndex = 0;
  }

  getCurrentLevel(): Level {
    return this.levels[this.currentIndex];
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
}
