export default class GameStats {
  public hitTimes: number[];
  public missCounts: number[];

  private acutalLevelMisses: number;
  private initialLevelTime: number;

  constructor() {
    this.hitTimes = [];
    this.missCounts = [];

    this.acutalLevelMisses = 0;
    this.initialLevelTime = 0;
  }

  addHitTime(finalTime: number): void {
    const deltaTime = finalTime - this.initialLevelTime;
    this.hitTimes.push(deltaTime);
    this.initialLevelTime = finalTime;
  }

  addMissCount(): void {
    this.missCounts.push(this.acutalLevelMisses);
  }

  addMiss(): void {
    this.acutalLevelMisses++;
  }

  resetInitialLevelTime(newTime: number = 0): void {
    this.initialLevelTime = newTime;
  }

  resetActualLevelMisses(): void {
    this.acutalLevelMisses = 0;
  }

  resetAllData(): void {
    this.hitTimes = [];
    this.missCounts = [];
  }
}
