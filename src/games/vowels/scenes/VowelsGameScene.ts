import VowelsLogic from "../logic/VowelsLogic";
import Phaser from "phaser";

export default class VowelsGameScene extends Phaser.Scene {
  private gameData: any;
  private logic: VowelsLogic;

  constructor() {
    super("vowelsGameScene");
    this.logic = new VowelsLogic(this);
  }

  preload() {
    this.load.json("mainData", "/assets/vowelsGame/gameData/mainData.JSON");
  }

  create() {
    this.gameData = this.cache.json.get("mainData");

    this.loadAnimalImages();
    this.loadBackgroundImage();
    this.loadButtonImages();
    this.loadEffectsImages();
    this.logic.defineData();

    this.load.once("complete", () => {
      this.logic.setLevelManager();
      this.logic.setApiService();
      this.logic.createBackground("backgroundMain");
      this.logic.createImage(this.logic.accessCurrentLevel().getName());
      this.logic.createButtons();
      this.setupLevel();
      console.log("Jogo das vogais carregado!");
    });

    this.load.start();
  }

  update() {}

  private loadAnimalImages() {
    const entities = this.gameData.textures.entities;

    entities.forEach((entity: any) => {
      this.load.image(entity.key, entity.default);
      this.load.image(entity.completeKey, entity.complete);
    });
  }

  private loadBackgroundImage(): void {
    this.load.image("backgroundMain", this.gameData.background.url);
  }

  private loadButtonImages() {
    const buttonTexturesUrl = this.gameData.textures.buttons;

    this.load.image("defaultButton", buttonTexturesUrl.blue.default);
    this.load.image("hoverButton", buttonTexturesUrl.blue.hover);
    this.load.image("clickedButton", buttonTexturesUrl.blue.clicked);
  }

  private loadEffectsImages() {
    const effects = this.gameData.textures.effects;
    effects.forEach((effect: any) => {
      this.load.image(effect.key, effect.texture);
    });
  }

  private setupLevel() {
    this.logic.setImageTexture(this.logic.accessCurrentLevel().getName());
    this.logic.setButtonTexts();
    this.logic.setupAnotherLevel();
  }
}
