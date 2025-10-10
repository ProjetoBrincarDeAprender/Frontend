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

    this.load.once("complete", () => {
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
    const animals = this.gameData.animalConfig;

    animals.forEach((animal: any) => {
      this.load.image(animal.key, animal.questionTextureUrl);
      this.load.image(animal.completeKey, animal.completeQuestionTextureUrl);
    });
  }

  private loadBackgroundImage(): void {
    this.load.image(
      "backgroundMain",
      this.gameData.backgroundConfig.backgroundUrl,
    );
  }

  private loadButtonImages() {
    const buttonTexturesUrl = this.gameData.buttonConfig.texturesUrl;

    this.load.image("defaultButton", buttonTexturesUrl.blue.default);
    this.load.image("hoverButton", buttonTexturesUrl.blue.hover);
    this.load.image("clickedButton", buttonTexturesUrl.blue.clicked);
  }

  private loadEffectsImages() {
    const effects = this.gameData.effects;
    effects.forEach((effect: any) => {
      this.load.image(effect.key, effect.textureUrl);
    });
  }

  private setupLevel() {
    this.logic.setImageTexture(this.logic.accessCurrentLevel().getName());
    this.logic.setButtonTexts();
    this.logic.setupAnotherLevel();
  }
}
