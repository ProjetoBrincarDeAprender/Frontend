export default class GameStats {
  public hitTimes: number[];
  public missCounts: number[];

  private actualLevelMisses: number;
  private initialLevelTime: number;

  constructor() {
    this.hitTimes = [];
    this.missCounts = [];

    this.actualLevelMisses = 0;
    this.initialLevelTime = 0;
  }

  addHitTime(finalTime: number): void {
    const deltaTime = finalTime - this.initialLevelTime;
    this.hitTimes.push(deltaTime);
    this.initialLevelTime = finalTime;
    console.log(deltaTime);
  }

  addMissCount(): void {
    this.missCounts.push(this.actualLevelMisses);
    console.log(this.actualLevelMisses);
  }

  addMiss(): void {
    this.actualLevelMisses++;
  }

  resetInitialLevelTime(newTime: number = 0): void {
    this.initialLevelTime = newTime;
  }

  resetActualLevelMisses(): void {
    this.actualLevelMisses = 0;
  }

  getCurrentLevelMisses(): number {
    return this.actualLevelMisses;
  }

  getCurrentLevelTimeSpent(finalTime: number): number {
    return finalTime - this.initialLevelTime;
  }

  resetAllData(): void {
    this.hitTimes = [];
    this.missCounts = [];
  }
}
