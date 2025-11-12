import SubtractionLevel from "./MathLevel";

export default class MathLogic {
  private levels: SubtractionLevel[];
  private currentLevelIndex: number = 0;

  constructor(
    _scene: Phaser.Scene,
    levels: SubtractionLevel[],
    _userId: string = "default_user",
    _activityId?: number,
    startingLevel: number = 0,
  ) {
    this.levels = levels;
    this.currentLevelIndex = startingLevel;
  }

  getCurrentLevel(): SubtractionLevel | null {
    return this.levels[this.currentLevelIndex] || null;
  }

  getLevelByIndex(index: number): SubtractionLevel | null {
    return this.levels[index] || null;
  }

  getCurrentLevelIndex(): number {
    return this.currentLevelIndex;
  }

  checkAnswer(answer: number): { correct: boolean; finished: boolean } {
    const currentLevel = this.getCurrentLevel();
    if (!currentLevel) return { correct: false, finished: true };

    const isCorrect = currentLevel.isCorrect(answer);
    if (isCorrect) {
      this.currentLevelIndex++;
      if (this.currentLevelIndex >= this.levels.length) {
        return { correct: true, finished: true };
      }
      return { correct: true, finished: false };
    }

    return { correct: false, finished: false };
  }
}
