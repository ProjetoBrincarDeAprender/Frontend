import type GameStats from "../common/GameStats";
import type LevelManager from "../common/LevelManager";
import randomGenerator from "../common/utils/RandomGenerator";
import type Level from "./Level";

export default class Logic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private levelManager: LevelManager;

  constructor(
    scene: Phaser.Scene,
    gameStats: GameStats,
    levelManager: LevelManager,
  ) {
    this.scene = scene;
    this.gameStats = gameStats;
    this.levelManager = levelManager;
  }

  handleAnswer(text: string, timeNow: number): boolean {
    const currentLevel: Level = this.levelManager.getCurrentLevel();
    const isCorrect: boolean = currentLevel.isCorrectLetter(text);

    if (isCorrect) {
      this.gameStats.addHitTime(timeNow);
      this.gameStats.resetInitialLevelTime(timeNow);
      this.gameStats.addMissCount();
      this.gameStats.resetActualLevelMisses();

      this.levelManager.nextLevel();

      return true;
    } else {
      this.gameStats.addMiss();
      return false;
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
