import { AudioManager } from "@/games/common/managers/AudioManager";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";
import VowelsLogic from "../logic/VowelsLogic";

export default class VowelsGameScene extends PreloadScene {
  private gameData: any;
  private logic: VowelsLogic;

  constructor() {
    super("vowelsGameScene");
    this.logic = new VowelsLogic(this);
  }

  init() {
    new AudioManager(this);
  }

  preload() {
    super.preload();
    this.load.json("mainData", "/assets/vowelsGame/gameData/mainData.JSON");
  }

  create() {
    this.gameData = this.cache.json.get("mainData");

    this.loadEntitiesImages();
    this.loadBackgroundImage();
    this.loadButtonImages();
    this.loadEffectsImages();
    this.loadAudios();

    this.load.once("complete", () => {
      this.logic.setGameData();
      this.logic.setLevelManager();
      this.logic.setApiService();
      this.logic.createBackground("backgroundMain");
      this.logic.createImage(this.logic.getCurrentLevel().getName());
      this.logic.createButtons();
      this.logic.setupAnotherLevel();

      console.log("Jogo das vogais carregado!");
    });

    this.load.start();
  }

  private loadEntitiesImages() {
    const entities = this.gameData.textures.entities;

    entities.forEach((entity: any) => {
      this.load.image(entity.key, entity.default);
      this.load.image(entity.completeKey, entity.complete);
    });
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
