import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import EffectManager from "../../common/managers/EffectManager";
import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import Level from "../../common/models/Level";
import api from "@/utils/api";

export default class Logic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private levelManager: LevelManager<Level>;
  private image?: Phaser.GameObjects.Image;
  private imageMaxSize: number;

  constructor(scene: Phaser.Scene) {
    const levels: Level[] = [];
    levels.push(new Level("abelha", "A"));
    levels.push(new Level("elefante", "E"));
    levels.push(new Level("hiena", "I"));
    levels.push(new Level("ovelha", "O"));
    levels.push(new Level("urso", "U"));

    this.levelManager = new LevelManager(levels);
    this.scene = scene;
    this.gameStats = new GameStats();
    this.effectManager = new EffectManager(this.scene);
    this.buttonManager = new ButtonManager(this.scene);
    this.imageMaxSize = 800;
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
      this.sendData();

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

  private sendData = async () => {
    try {
      const levelData = {
        activityId: 3,
        questionId: this.levelManager.getCurrentIndex(),
        isCorrect: true,
        answer: this.accessCurrentLevel().getAnswer(),
        timeSpent: this.gameStats.getCurrentLevelTimeSpent(this.scene.time.now),
        attempts: this.gameStats.getCurrentLevelMisses(),
        responseDate: this.scene.time.now,
      };

      console.log("Sending data:", levelData);

      const response = await api.post(
        "/adaptiveSystem/interaction/register",
        levelData,
        {},
      );

      if (response.status === 201) {
        console.log("Data sent successfully");
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    this.image = this.scene.add.image(400, 280, texture);

    const imgWidth = this.image.width;
    const imgHeight = this.image.height;

    const maxSize = this.imageMaxSize;
    const scaleX = maxSize / imgWidth;
    const scaleY = maxSize / imgHeight;
    const scale = Math.min(scaleX, scaleY);

    this.image.setScale(scale);
  }

  createBackground(texture: string): void {
    const background = this.scene.add.image(400, 300, texture);
    const scaleX = this.scene.cameras.main.width / background.width;
    const scaleY = this.scene.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
    this.effectManager.overlay(0.3);
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
