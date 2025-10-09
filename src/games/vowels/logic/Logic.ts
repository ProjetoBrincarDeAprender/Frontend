import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import EffectManager from "../../common/managers/EffectManager";
import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import VowelsLevel from "./VowelsLevel";
import CloudManager from "@/games/common/managers/CloudManager";
import api from "@/utils/api";
import Phaser from "phaser";
import ButtonContentGenerator from "@/games/common/content/ButtonContentGenerator";

export default class Logic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonManager: ButtonManager;
  private cloudManager: CloudManager;
  private effectManager: EffectManager;
  private levelManager: LevelManager<VowelsLevel>;
  private image?: Phaser.GameObjects.Image;
  private imageMaxSize: number;

  constructor(scene: Phaser.Scene) {
    const levels: VowelsLevel[] = [];
    levels.push(new VowelsLevel("abelha", "abelhaCompleta", "A"));
    levels.push(new VowelsLevel("elefante", "elefanteCompleta", "E"));
    levels.push(new VowelsLevel("hiena", "hienaCompleta", "I"));
    levels.push(new VowelsLevel("ovelha", "ovelhaCompleta", "O"));
    levels.push(new VowelsLevel("urso", "ursoCompleta", "U"));
    levels.push(new VowelsLevel("gato", "gatoCompleta", "A"));
    levels.push(new VowelsLevel("esquilo", "esquiloCompleta", "E"));
    levels.push(new VowelsLevel("iguana", "iguanaCompleta", "I"));
    levels.push(new VowelsLevel("onca", "oncaCompleta", "O"));
    levels.push(new VowelsLevel("urubu", "urubuCompleta", "U"));

    this.levelManager = new LevelManager(levels);
    this.scene = scene;
    this.gameStats = new GameStats();
    this.effectManager = new EffectManager(this.scene);
    this.buttonManager = new ButtonManager(this.scene);
    this.cloudManager = new CloudManager(this.scene);
    this.imageMaxSize = 800;
  }

  handleClick(
    button: Button,
    timeNow: number,
  ): { correct: boolean; finished: boolean } {
    const currentLevel: VowelsLevel = this.levelManager.getCurrentLevel();
    const isCorrect: boolean = currentLevel.isCorrectLetter(
      button.getButtonStringText(),
    );
    if (isCorrect) {
      this.sendData();

      this.gameStats.addHitTime(timeNow);
      this.gameStats.resetInitialLevelTime(timeNow);
      this.gameStats.addMissCount();
      this.gameStats.resetActualLevelMisses();

      this.setImageTexture(this.accessCurrentLevel().getCompleteAnimalKey());

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
    // Pinta o botão de vermelho no erro (mesma aparência do jogo de sequência numérica)
    button.setTint(failColor);
    // Remove o tint após um curto intervalo para não persistir entre níveis
    this.scene.time.delayedCall(500, () => button.clearTint());
  }

  failEffect(): void {}

  accessCurrentLevel(): VowelsLevel {
    return this.levelManager.getCurrentLevel();
  }

  isGameFinished(): boolean {
    if (this.levelManager.isFinished()) return true;
    return false;
  }

  setButtonTexts(): void {
    const answer: string = this.levelManager.getCurrentLevel().getAnswer();
    const buttonsNumber: number = this.buttonManager.getButtons().length;
    const buttonTexts = ButtonContentGenerator.generateButtonsLetters(
      buttonsNumber,
      answer,
    );
    this.buttonManager.setButtonTexts(buttonTexts);
  }

  createImage(texture: string): void {
    this.image = this.scene.add.image(400, 220, texture);

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
    this.cloudManager.generateClouds();
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

    const buttonTextures = {
      default: "defaultButton",
      hover: "hoverButton",
      clicked: "clickedButton",
    };

    const buttonConfigs = buttonPositions.map((pos) => ({
      positions: pos,
      textures: buttonTextures,
      scale: 1.5,
      fontSize: 50,
    }));

    this.buttonManager.createButtons(buttonConfigs);
  }

  getButtons(): Button[] {
    return this.buttonManager.getButtons();
  }
}
