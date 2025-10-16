import Phaser from "phaser";
import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";
import ButtonFactory from "@/games/common/factories/ButtonFactory";

export default class VowelsSequenceStartScene extends Phaser.Scene {
  private buttonFactory: ButtonFactory;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private gameData: any;

  constructor() {
    super("vowelsStart");
    this.buttonManager = new ButtonManager(this);
    this.buttonFactory = new ButtonFactory(this.buttonManager);
    this.effectManager = new EffectManager(this);
  }

  preload() {
    this.load.json(
      "startData",
      "/assets/vowelsSequenceGame/gameData/startData.JSON",
    );
  }

  create() {
    this.gameData = this.cache.json.get("startData");

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
    const backgroundConfig = this.gameData.config.background;
    this.load.image("backgroundStart", backgroundConfig.image);
  }

  private loadTitleImage(): void {
    const titleConfig = this.gameData.config.title;
    this.load.image("title", titleConfig.image);
  }

  private loadRectangleBlue(): void {
    const textures = this.gameData.textures.buttons;
    this.load.image("hoverButtonRectangle", textures.blue.hover);
    this.load.image("defaultButtonRectangle", textures.blue.default);
    this.load.image("clickedButtonRectangle", textures.blue.clicked);
  }

  private loadRectangleRed(): void {
    const textures = this.gameData.textures.buttons;
    this.load.image("hoverRectangleRed", textures.red.hover);
    this.load.image("defaultRectangleRed", textures.red.default);
    this.load.image("clickedRectangleRed", textures.red.clicked);
  }

  private createBackground(): void {
    const backgroundConfig = this.gameData.config.background;

    const background = this.add.image(400, 300, "backgroundStart");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    this.effectManager.overlay(backgroundConfig.overlayOpacity);
  }

  private createTitleImage(): void {
    const titleConfig = this.gameData.config.title;
    let title;

    if (titleConfig.position) {
      title = this.add.image(
        titleConfig.position.x,
        titleConfig.position.y,
        "title",
      );
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
        this.scene.start("vowelsSequenceGameScene");
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
