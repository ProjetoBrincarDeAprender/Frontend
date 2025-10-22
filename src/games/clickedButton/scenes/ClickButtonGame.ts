import ClickButtonLogic from "../logic/ClickButtonLogic";
import ClickedButtonLevel from "../logic/ClickButtonLevel";
import LevelManager from "../logic/LevelManager";
import ButtonManager from "../logic/ButtonManager";
import Phaser from "phaser";

export default class ClickButtonGameScene extends Phaser.Scene {
  private mainData: any;
  private mainDataPath: string;
  private clickButtonLogic!: ClickButtonLogic;
  private levelManager!: LevelManager;
  private buttonManager: ButtonManager;

  constructor(mainDataPath: string) {
    super("clickButtonGameScene");
    this.mainDataPath = mainDataPath;
    this.buttonManager = new ButtonManager(this);
  }

  preload() {
    this.load.json("mainData", this.mainDataPath);
  }

  create() {
    this.mainData = this.cache.json.get("mainData");

    this.loadAudios();
    this.loadBackground();
    this.loadButtonImages();
    this.loadEffectsImages();
    this.loadEntitiesImages();

    this.load.once("complete", () => {
      this.setLevelManager();
      this.setLogic();
      this.createBackground();
      this.setupQuestion();
      this.setupEntity();
      this.setupContent();
      this.setupOptions();
    });

    this.load.start();
  }

  private loadAudios() {
    const audios = this.mainData.audios;
    audios.forEach((audio: any) => {
      this.load.audio(audio.key, audio.path);
    });
  }

  private loadBackground(): void {
    this.load.image("background", this.mainData.config.background.image);
  }

  private loadButtonImages() {
    const buttonTexturesUrl = this.mainData.textures.buttons;

    this.load.image("defaultButton", buttonTexturesUrl.blue.default);
    this.load.image("hoverButton", buttonTexturesUrl.blue.hover);
    this.load.image("clickedButton", buttonTexturesUrl.blue.clicked);
  }

  private loadEffectsImages() {
    const effects = this.mainData.textures.effects;
    effects.forEach((effect: any) => {
      this.load.image(effect.key, effect.texture);
    });
  }

  private loadEntitiesImages() {
    const entities = this.mainData.textures.entities;

    entities.forEach((entity: any) => {
      this.load.image(entity.key, entity.path);
    });
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, "background");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
  }

  private setLevelManager(): void {
    const levels = this.mainData.levels.map(
      (level: any) => new ClickedButtonLevel(level),
    );
    this.levelManager = new LevelManager(levels);
  }

  private setLogic(): void {
    this.clickButtonLogic = new ClickButtonLogic(
      this,
      this.levelManager,
      this.buttonManager,
    );
  }

  private setupEntity(): void {
    this.clickButtonLogic.showEntity();
  }

  private setupContent(): void {
    this.clickButtonLogic.showContent();
  }

  private setupQuestion(): void {
    this.clickButtonLogic.showQuestion();
  }

  private setupOptions(): void {
    this.clickButtonLogic.showOptions();
  }
}
