export default class GameStats {
  public timeSpentArray: number[];
  private initialLevelTime: number;

  constructor() {
    this.timeSpentArray = [];
    this.initialLevelTime = 0;
  }

  addTimeSpent(finalTime: number): void {
    const deltaTime = finalTime - this.initialLevelTime;
    this.timeSpentArray.push(deltaTime);
    this.initialLevelTime = finalTime;
  }

  resetInitialLevelTime(newTime: number = 0): void {
    this.initialLevelTime = newTime;
  }

  getActualTimeSpent(finalTime: number): number {
    return finalTime - this.initialLevelTime;
  }
}
