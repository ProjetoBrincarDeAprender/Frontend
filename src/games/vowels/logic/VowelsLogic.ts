import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import EffectManager from "../../common/managers/EffectManager";
import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import VowelsLevel from "./VowelsLevel";
import CloudManager from "@/games/common/managers/CloudManager";
import Phaser from "phaser";
import ButtonContentGenerator from "@/games/common/content/ButtonContentGenerator";
import ButtonFactory from "@/games/common/factories/ButtonFactory";
import LettersStrategy from "@/games/common/content/LetterStrategy";
import VowelsApiService from "../service/vowelsApiService";

export default class VowelsLogic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonFactory: ButtonFactory;
  private buttonManager: ButtonManager;
  private cloudManager: CloudManager;
  private effectManager: EffectManager;
  private levelManager!: LevelManager<VowelsLevel>;
  private image?: Phaser.GameObjects.Image;
  private imageMaxSize: number;
  private gameData: any;
  private apiService!: VowelsApiService;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.buttonManager = new ButtonManager(this.scene);
    this.buttonFactory = new ButtonFactory(this.buttonManager);
    this.gameStats = new GameStats();
    this.effectManager = new EffectManager(this.scene);
    this.cloudManager = new CloudManager(this.scene);
    this.imageMaxSize = 800;
  }

  setApiService() {
    this.apiService = new VowelsApiService(
      this.scene,
      this.levelManager,
      this.gameStats,
    );
  }

  setLevelManager() {
    const levels = this.gameData.levels;
    const newLevels: VowelsLevel[] = [];

    levels.forEach((level: any) => {
      const newLevel = new VowelsLevel(
        level.entityKey,
        level.completeEntityKey,
        level.answer,
      );
      newLevels.push(newLevel);
    });

    this.levelManager = new LevelManager(newLevels);
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
      this.apiService.sendLevelData();

      this.gameStats.addHitTime(timeNow);
      this.gameStats.resetInitialLevelTime(timeNow);
      this.gameStats.addMissCount();
      this.gameStats.resetActualLevelMisses();

      console.log(this.accessCurrentLevel().getCompleteAnimalKey());
      this.setImageTexture(this.accessCurrentLevel().getCompleteAnimalKey());

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

  accessCurrentLevel(): VowelsLevel {
    return this.levelManager.getCurrentLevel();
  }

  isGameFinished(): boolean {
    if (this.levelManager.isFinished()) return true;
    return false;
  }

  setButtonTexts(): void {
    const buttonContentGenerator = new ButtonContentGenerator(
      new LettersStrategy(),
    );
    const answer: string = this.levelManager.getCurrentLevel().getAnswer();
    const buttonsNumber: number = this.buttonManager.getButtons().length;
    const buttonTexts = buttonContentGenerator.generate(buttonsNumber, answer);
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

  defineData() {
    this.gameData = this.scene.cache.json.get("mainData");
  }

  createButtons(): void {
    const buttonTextures = {
      default: "defaultButton",
      hover: "hoverButton",
      clicked: "clickedButton",
    };

    const buttonConfigs = [];
    const buttonConfig = this.gameData.buttonConfig;
    const levels = this.gameData.levels;
    const index = this.levelManager.getCurrentIndex();

    for (let i = 0; i < levels[index].options.length; i++) {
      buttonConfigs.push({
        positions: { x: 200, y: 500 },
        textures: buttonTextures,
        onClick: this.setupAnotherLevel,
        scale: buttonConfig.scale,
        fontSize: buttonConfig.fontSize,
      });
    }

    this.buttonFactory.createButtons(buttonConfigs, 800);
  }

  getButtons(): Button[] {
    return this.buttonManager.getButtons();
  }

  setupAnotherLevel() {
    this.setImageTexture(this.accessCurrentLevel().getName());
    this.setButtonTexts();

    this.getButtons().forEach((button) => {
      button.off("pointerdown");
      button.on("pointerdown", () => {
        const result = this.handleClick(button, this.scene.time.now);

        if (result.correct) {
          this.buttonSuccessEffect(button, "star");
          this.scene.time.delayedCall(1000, () => {
            if (result.finished) {
              this.scene.scene.start("vowelsCredits");
            } else {
              this.setupAnotherLevel();
            }
          });
        } else {
          this.buttonFailEffect(button);
        }
      });
    });
  }
}
