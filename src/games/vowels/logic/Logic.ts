import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
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

  buttonSuccessEffect(
    button: Button,
    particleTexture?: string,
    successColor: number = 0x00ff00,
  ): void {
    this.effectManager.growup(button);
    this.effectManager.changeColor(button.getButtonText(), successColor);
    if (particleTexture) this.effectManager.particles(particleTexture);
  }

  buttonFailEffect(button: Button, failColor: number = 0xff0000): void {
    this.effectManager.growup(button, "Bounce", 1.2, 200);
    this.effectManager.changeColor(button.getButtonText(), failColor);
  }

  failEffect(): void {}

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
    const buttonTexts = this.buttonManager.generateButtonsLetters(
      buttonsNumber,
      answer,
    );
    this.buttonManager.setButtonTexts(buttonTexts);
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
