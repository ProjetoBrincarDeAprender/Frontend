import ClickedButtonLevel from "./ClickedButtonLevel";

export default class LevelManager {
  private levels: ClickedButtonLevel[];
  private actualIndex: number;

  constructor(levels: ClickedButtonLevel[]) {
    this.levels = levels;
    this.actualIndex = 0;
  }

  public getLevels(): ClickedButtonLevel[] {
    return this.levels;
  }

  public getActualLevel(): ClickedButtonLevel {
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
