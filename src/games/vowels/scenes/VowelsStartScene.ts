import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";
import Phaser from "phaser";
import AssetLoader from "@/games/common/loaders/AssetLoader";
import CloudManager from "@/games/common/managers/CloudManager";
import ButtonFactory from "@/games/common/factories/ButtonFactory";

export default class VowelsStartScene extends Phaser.Scene {
  private assetLoader: AssetLoader;
  private buttonManager: ButtonManager;
  private cloudManager: CloudManager;
  private effectManager: EffectManager;
  private buttonFactory: ButtonFactory;
  private gameData: any;

  constructor() {
    super("vowelsStart");
    this.buttonManager = new ButtonManager(this);
    this.effectManager = new EffectManager(this);
    this.buttonFactory = new ButtonFactory(this.buttonManager);
    this.assetLoader = new AssetLoader(this);
    this.cloudManager = new CloudManager(this);
  }

  preload() {
    this.load.json("gameData", "/assets/vowelsGame/gameData/startData.JSON");
    this.assetLoader.preloadClouds();
  }

  create() {
    this.gameData = this.cache.json.get("gameData");

    this.loadBackgroundImage();
    this.loadTitleImage();
    this.loadRectangleBlue();
    this.loadRectangleRed();

    this.load.once("complete", () => {
      this.createBackground();
      this.createTitleImage();
      this.createMenuButtons();
    });

    this.load.start();
  }

  private loadBackgroundImage(): void {
    this.load.image(
      "backgroundStart",
      this.gameData.backgroundConfig.backgroundUrl,
    );
  }

  private loadTitleImage(): void {
    this.load.image("title", this.gameData.titleImageUrl);
  }

  private loadRectangleBlue(): void {
    const buttonTexturesUrl = this.gameData.buttonTexturesUrl;
    this.load.image("hoverButtonRectangle", buttonTexturesUrl.blue.hover);
    this.load.image("defaultButtonRectangle", buttonTexturesUrl.blue.default);
    this.load.image("clickedButtonRectangle", buttonTexturesUrl.blue.clicked);
  }

  private loadRectangleRed(): void {
    const buttonTexturesUrl = this.gameData.buttonTexturesUrl;
    this.load.image("hoverRectangleRed", buttonTexturesUrl.red.hover);
    this.load.image("defaultRectangleRed", buttonTexturesUrl.red.default);
    this.load.image("clickedRectangleRed", buttonTexturesUrl.red.clicked);
  }

  private createBackground(): void {
    const backgroundConfig = this.gameData.backgroundConfig;

    const background = this.add.image(400, 300, "backgroundStart");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    this.cloudManager.generateClouds();

    this.effectManager.overlay(backgroundConfig.overlayOpacity);
  }

  private createTitleImage(): void {
    const titlePosition = this.gameData.titlePosition;
    let title;

    if (titlePosition) {
      title = this.add.image(titlePosition.x, titlePosition.y, "title");
    } else {
      title = this.add.image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 150,
        "title",
      );
    }

    const scaleX = this.cameras.main.width / title.width;
    const scaleY = this.cameras.main.height / title.height;
    const scale = Math.max(scaleX, scaleY) / 1.2;
    title.setScale(scale);
  }

  private createStartButton(): void {
    const buttonContent = this.gameData.buttons[0];

    this.buttonFactory.createButton({
      positions: buttonContent.positions,
      textures: {
        default: "defaultButtonRectangle",
        hover: "hoverButtonRectangle",
        clicked: "clickedButtonRectangle",
      },
      text: buttonContent.text,
      fontSize: buttonContent.fontSize,
      onClick: () => {
        this.scene.start("vowelsGameScene");
      },
    });
  }

  private createExitButton(): void {
    const buttonContent = this.gameData.buttons[1];

    this.buttonFactory.createButton({
      positions: buttonContent.positions,
      textures: {
        default: "defaultRectangleRed",
        hover: "hoverRectangleRed",
        clicked: "clickedRectangleRed",
      },
      text: buttonContent.text,
      fontSize: buttonContent.fontSize,
      scale: 0.7,
      onClick: () => {
        window.history.back();
      },
    });
  }

  private createMenuButtons(): void {
    this.createStartButton();
    this.createExitButton();
  }
}
