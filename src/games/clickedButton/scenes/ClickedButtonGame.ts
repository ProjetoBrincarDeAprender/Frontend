import ClickedButtonLogic from "../logic/ClickedButtonLogic";
import ClickedButtonLevel from "../logic/ClickedButtonLevel";
import LevelManager from "../logic/LevelManager";
import ButtonManager from "../logic/ButtonManager";
import Phaser from "phaser";

export default class ClickedButtonGameScene extends Phaser.Scene {
  private mainData: any;
  private mainDataPath: string;
  private clickedButtonLogic!: ClickedButtonLogic;
  private levelManager!: LevelManager;
  private buttonManager: ButtonManager;

  constructor(mainDataPath: string) {
    super("clickedButtonGameScene");
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
      this.load.image(entity.key, entity.default);
      this.load.image(entity.completeKey, entity.complete);
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
    this.clickedButtonLogic = new ClickedButtonLogic(
      this,
      this.levelManager,
      this.buttonManager,
    );
  }

  private setupEntity(): void {
    this.clickedButtonLogic.showEntity();
  }

  private setupContent(): void {
    this.clickedButtonLogic.showContent();
  }

  private setupQuestion(): void {
    this.clickedButtonLogic.showQuestion();
  }

  private setupOptions(): void {
    this.clickedButtonLogic.showOptions();
  }

  //   private loadButtonImages() {
  //     const buttonTexturesUrl = this.gameData.textures.buttons;

  //     this.load.image("defaultButton", buttonTexturesUrl.blue.default);
  //     this.load.image("hoverButton", buttonTexturesUrl.blue.hover);
  //     this.load.image("clickedButton", buttonTexturesUrl.blue.clicked);
  //   }
}

// import Phaser from "phaser";

// export default class VowelsGameScene extends Phaser.Scene {
//   private gameData: any;

//   constructor() {
//     super("vowelsGameScene");
//     this.logic = new VowelsLogic(this);
//   }

//   preload() {
//     this.load.json("mainData", "/assets/vowelsGame/gameData/mainData.JSON");
//   }

//   create() {
//     this.gameData = this.cache.json.get("mainData");

//     this.loadEntitiesImages();
//     this.loadBackgroundImage();
//     this.loadButtonImages();
//     this.loadEffectsImages();
//     this.loadAudios();

//     this.load.once("complete", () => {
//       this.logic.setGameData();
//       this.logic.setLevelManager();
//       this.logic.setApiService();
//       this.logic.createBackground("backgroundMain");
//       this.logic.createImage(this.logic.getCurrentLevel().getName());
//       this.logic.createButtons();
//       this.logic.setupAnotherLevel();

//       console.log("Jogo das vogais carregado!");
//     });

//     this.load.start();
//   }

//   private loadEntitiesImages() {
//     const entities = this.gameData.textures.entities;

//     entities.forEach((entity: any) => {
//       this.load.image(entity.key, entity.default);
//       this.load.image(entity.completeKey, entity.complete);
//     });
//   }

//   private loadAudios() {
//     const audios = this.gameData.audios;
//     audios.forEach((audio: any) => {
//       this.load.audio(audio.key, audio.path);
//     });
//   }

//   private loadBackgroundImage(): void {
//     this.load.image("backgroundMain", this.gameData.background.url);
//   }

//   private loadButtonImages() {
//     const buttonTexturesUrl = this.gameData.textures.buttons;

//     this.load.image("defaultButton", buttonTexturesUrl.blue.default);
//     this.load.image("hoverButton", buttonTexturesUrl.blue.hover);
//     this.load.image("clickedButton", buttonTexturesUrl.blue.clicked);
//   }

//   private loadEffectsImages() {
//     const effects = this.gameData.textures.effects;
//     effects.forEach((effect: any) => {
//       this.load.image(effect.key, effect.texture);
//     });
//   }
// }
