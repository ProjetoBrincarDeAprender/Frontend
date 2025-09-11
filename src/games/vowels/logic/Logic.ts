import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import randomGenerator from "../../common/utils/RandomGenerator";
import type Level from "../../common/models/Level";
import EffectManager from "@/games/common/managers/effectManager";
import type Button from "@/games/common/models/Button";

export default class Logic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private levelManager: LevelManager;
  private effectManager: EffectManager;

  constructor(scene: Phaser.Scene, levelManager: LevelManager) {
    this.scene = scene;
    this.gameStats = new GameStats();
    this.levelManager = levelManager;
    this.effectManager = new EffectManager(this.scene);
  }

  handleAnswer(
    button: Button,
    timeNow: number,
    image: string,
  ): { correct: boolean; finished: boolean } {
    const currentLevel: Level = this.levelManager.getCurrentLevel();
    const isCorrect: boolean = currentLevel.isCorrectLetter(
      button.getButtonStringText(),
    );

    if (isCorrect) {
      this.effectManager.growup(button);
      this.effectManager.changeColor(button.getButtonText());
      this.effectManager.particles(image);

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

  isGameFinished(): boolean {
    if (this.levelManager.isFinished()) return true;
    return false;
  }

  generateButtonTexts(buttonsNumber: number): string[] {
    const answer: string = this.levelManager.getCurrentLevel().getAnswer();
    let buttonTexts = this.generateButtonsLetters(buttonsNumber, answer);
    return buttonTexts;
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
