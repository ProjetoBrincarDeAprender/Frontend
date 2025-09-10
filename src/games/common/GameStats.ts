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

  addHitTime(finalTime: number) {
    const deltaTime = finalTime - this.initialLevelTime;
    this.hitTimes.push(deltaTime);
    this.initialLevelTime = finalTime;
  }

  addMissCount() {
    this.missCounts.push(this.acutalLevelMisses);
  }

  addMiss() {
    this.acutalLevelMisses++;
  }

  resetInitialLevelTime(newTime: number = 0) {
    this.initialLevelTime = newTime;
  }

  resetActualLevelMisses() {
    this.acutalLevelMisses = 0;
  }

  resetAllData() {
    this.hitTimes = [];
    this.missCounts = [];
  }
}
