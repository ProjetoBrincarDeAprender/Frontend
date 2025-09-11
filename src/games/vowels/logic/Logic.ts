import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import randomGenerator from "../../common/utils/RandomGenerator";
import Level from "../../common/models/Level";
import EffectManager from "@/games/common/managers/effectManager";
import type Button from "@/games/common/models/Button";
import ButtonManager from "@/games/common/managers/ButtonManager";

export default class Logic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private levelManager: LevelManager;
  private image?: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    const levels: Level[] = [];
    levels.push(new Level("abelha", "A"));
    levels.push(new Level("elefante", "E"));

    this.levelManager = new LevelManager(levels);
    this.scene = scene;
    this.gameStats = new GameStats();
    this.effectManager = new EffectManager(this.scene);
    this.buttonManager = new ButtonManager(this.scene);
  }

  handleClick(
    button: Button,
    timeNow: number,
  ): { correct: boolean; finished: boolean } {
    const currentLevel: Level = this.levelManager.getCurrentLevel();
    const isCorrect: boolean = currentLevel.isCorrectLetter(
      button.getButtonStringText(),
    );
    if (isCorrect) {
      this.effectManager.growup(button);
      this.effectManager.changeColor(button.getButtonText());
      this.effectManager.particles("star");

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

  accessCurrentLevel(): Level {
    return this.levelManager.getCurrentLevel();
  }

  isGameFinished(): boolean {
    if (this.levelManager.isFinished()) return true;
    return false;
  }

  setButtonTexts(): void {
    const answer: string = this.levelManager.getCurrentLevel().getAnswer();
    const buttonsNumber: number = this.buttonManager.getButtons().length;
    const buttonTexts = this.generateButtonsLetters(buttonsNumber, answer);
    this.buttonManager.setButtonTexts(buttonTexts);
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

  createImage(texture: string): void {
    this.image = this.scene.add.image(400, 300, texture);
  }

  setImageTexture(texture: string): void {
    if (this.image) this.image.setTexture(texture);
  }

  createButtons(): void {
    const buttonPositions: { x: number; y: number }[] = [
      { x: 200, y: 500 },
      { x: 400, y: 500 },
      { x: 600, y: 500 },
    ];
    const buttonTextures: string[] = [
      "defaultButton",
      "hoverButton",
      "clickedButton",
    ];
    this.buttonManager.createButtons(buttonPositions, buttonTextures);
  }

  getButtons(): Button[] {
    return this.buttonManager.getButtons();
  }
}
