import Phaser from "phaser";
import VowelsSequenceLogic from "../logic/VowelsSequenceLogic";

export default class VowelsSequenceGameScene extends Phaser.Scene {
  private gameData: any;
  private logic: VowelsSequenceLogic;

  constructor() {
    super("vowelsSequenceGameScene");
    this.logic = new VowelsSequenceLogic(this);
  }

  preload() {
    this.load.json(
      "mainData",
      "/assets/vowelsSequenceGame/gameData/mainData.JSON",
    );
  }

  create() {
    this.gameData = this.cache.json.get("mainData");

    this.loadBackgroundImage();
    this.loadButtonImages();
    this.loadEffectsImages();
    this.loadAudios();

    this.load.once("complete", () => {
      this.logic.setGameData();
      this.logic.setLevelManager();
      this.logic.setApiService();
      this.logic.createBackground("backgroundMain");
      // this.logic.createImage(this.logic.getCurrentLevel().getName());
      this.logic.createButtons();
      this.logic.setupAnotherLevel();

      console.log("Jogo das vogais carregado!");
    });

    this.load.start();
  }

  private loadAudios() {
    const audios = this.gameData.audios;
    audios.forEach((audio: any) => {
      this.load.audio(audio.key, audio.path);
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
}
