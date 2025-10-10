import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import EffectManager from "../../common/managers/EffectManager";
import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import VowelsLevel from "./VowelsLevel";
import CloudManager from "@/games/common/managers/CloudManager";
import Phaser from "phaser";
import ButtonFactory from "@/games/common/factories/ButtonFactory";
import VowelsApiService from "../service/VowelsApiService";
import VowelsButtonService from "../service/VowelsButtonService";
import VowelsEffectService from "../service/VowelsEffectService";
import VowelsUIService from "../service/VowelsUIService";

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
  private buttonService: VowelsButtonService;
  private effectService: VowelsEffectService;
  private uiService: VowelsUIService;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.buttonManager = new ButtonManager(this.scene);
    this.buttonFactory = new ButtonFactory(this.buttonManager);
    this.buttonService = new VowelsButtonService(
      this.buttonManager,
      this.buttonFactory,
    );
    this.gameStats = new GameStats();
    this.effectManager = new EffectManager(this.scene);
    this.cloudManager = new CloudManager(this.scene);
    this.imageMaxSize = 800;
    this.effectService = new VowelsEffectService(this.effectManager);
    this.uiService = new VowelsUIService(
      this.scene,
      this.effectManager,
      this.cloudManager,
      this.imageMaxSize,
    );
  }

  getButtons(): Button[] {
    return this.buttonService.getButtons();
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

  setButtonTexts(): void {
    this.buttonService.setButtonTexts(this.levelManager.getCurrentLevel());
  }

  buttonSuccessEffect(
    button: Button,
    particleTexture?: string,
    successColor?: number,
  ): void {
    this.effectService.buttonSuccessEffect(
      button,
      particleTexture,
      successColor,
    );
  }

  buttonFailEffect(button: Button, failColor?: number): void {
    this.effectService.buttonFailEffect(button, failColor);
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

  accessCurrentLevel(): VowelsLevel {
    return this.levelManager.getCurrentLevel();
  }

  isGameFinished(): boolean {
    if (this.levelManager.isFinished()) return true;
    return false;
  }

  createImage(texture: string): void {
    this.uiService.createImage(texture);
  }

  createBackground(texture: string): void {
    this.uiService.createBackground(texture);
  }

  setImageTexture(texture: string): void {
    this.uiService.setImageTexture(texture);
  }

  setData() {
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

    this.buttonService.createButtons(buttonConfigs, 800);
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
