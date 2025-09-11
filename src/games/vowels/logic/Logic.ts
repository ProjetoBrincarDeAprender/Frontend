import type GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import randomGenerator from "../../common/utils/RandomGenerator";
import type Level from "../../common/models/Level";

export default class Logic {
  private gameStats: GameStats;
  private levelManager: LevelManager;

  constructor(gameStats: GameStats, levelManager: LevelManager) {
    this.gameStats = gameStats;
    this.levelManager = levelManager;
  }

  handleAnswer(
    text: string,
    timeNow: number,
  ): { correct: boolean; finished: boolean } {
    const currentLevel: Level = this.levelManager.getCurrentLevel();
    const isCorrect: boolean = currentLevel.isCorrectLetter(text);

    if (isCorrect) {
      this.gameStats.addHitTime(timeNow);
      this.gameStats.resetInitialLevelTime(timeNow);
      this.gameStats.addMissCount();
      this.gameStats.resetActualLevelMisses();

      const finished = !this.levelManager.nextLevel();
      return { correct: true, finished };
    } else {
      this.gameStats.addMiss();
      return { correct: false, finished: false };
    }
  }

  generateButtonTexts(buttonsNumber: number): string[] {
    const answer: string = this.levelManager.getCurrentLevel().getAnswer();
    let buttonTexts = this.generateButtonsLetters(buttonsNumber, answer);
    return buttonTexts;
  }

  isGameFinished(): boolean {
    if (this.levelManager.isFinished()) return true;
    return false;
  }

  generateButtonsLetters(buttonsNumber: number = 1, answer: string) {
    const letterArray = new Array(buttonsNumber);
    for (let i = 0; i < buttonsNumber; i++) {
      let randomLetter = randomGenerator.randomCharacter();
      letterArray[i] = randomLetter;
    }
    const answerIndex = randomGenerator.randomIndex(buttonsNumber);
    letterArray[answerIndex] = answer;
    return letterArray;
  }
}
