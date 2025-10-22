import ClickButtonLevel from "./ClickButtonLevel";

export default class LevelManager {
  private levels: ClickButtonLevel[];
  private actualIndex: number;

  constructor(levels: ClickButtonLevel[]) {
    this.levels = levels;
    this.actualIndex = 0;
  }

  public getLevels(): ClickButtonLevel[] {
    return this.levels;
  }

  public getActualLevel(): ClickButtonLevel {
    return this.levels[this.actualIndex];
  }

  public getActualIndex(): number {
    return this.actualIndex;
  }

  public nextLevel(): boolean {
    this.actualIndex++;
    if (this.actualIndex < this.levels.length) return true;
    return false;
  }

  public isFinished(): boolean {
    if (this.actualIndex >= this.levels.length) return true;
    return false;
  }

  public reset(): void {
    this.actualIndex = 0;
  }
}
