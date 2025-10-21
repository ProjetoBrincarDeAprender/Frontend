import Phaser from "phaser";
import ButtonFactory from "@/games/common/factories/ButtonFactory";
import ButtonManager from "@/games/common/managers/ButtonManager";

export default class ClickedButtonStartScene extends Phaser.Scene {
  private startData: any;
  private startDataPath: string;
  private buttonFactory: ButtonFactory;

  constructor(startDataPath: string) {
    super("clickedButtonStartScene");
    this.startDataPath = startDataPath;
    this.buttonFactory = new ButtonFactory(new ButtonManager(this));
  }

  preload() {
    this.load.json("startData", this.startDataPath);
  }

  create() {
    this.startData = this.cache.json.get("startData");

    this.loadBackground();
    this.loadTitle();
    this.loadRectangleBlue();
    this.loadRectangleRed();

    this.load.once("complete", () => {
      this.createBackground();
      this.createTitle();
      this.createStartButton();
      this.createExitButton();
    });

    this.load.start();
  }

  private loadBackground() {
    const bgConfig = this.startData.config.background;
    this.load.image("background", bgConfig.image);
  }

  private loadTitle() {
    const titleConfig = this.startData.config.title;
    this.load.image("title", titleConfig.image);
  }

  private loadRectangleBlue(): void {
    const textures = this.startData.textures.buttons;
    this.load.image("hoverRectangleBlue", textures.blue.hover);
    this.load.image("defaultRectangleBlue", textures.blue.default);
    this.load.image("clickedRectangleBlue", textures.blue.clicked);
  }

  private loadRectangleRed(): void {
    const textures = this.startData.textures.buttons;
    this.load.image("hoverRectangleRed", textures.red.hover);
    this.load.image("defaultRectangleRed", textures.red.default);
    this.load.image("clickedRectangleRed", textures.red.clicked);
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, "background");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
  }

  private createTitle(): void {
    const title = this.add.image(400, 150, "title");
    const scaleX = this.cameras.main.width / title.width;
    const scaleY = this.cameras.main.height / title.height;
    const scale = Math.max(scaleX, scaleY);
    title.setScale(scale / 1.5);
  }

  private createStartButton(): void {
    const buttonContent = this.startData.buttons.start;

    this.buttonFactory.createButton({
      positions: buttonContent.positions,
      textures: {
        default: "defaultRectangleBlue",
        hover: "hoverRectangleBlue",
        clicked: "clickedRectangleBlue",
      },
      text: buttonContent.text,
      fontSize: buttonContent.fontSize,
      onClick: () => {
        this.resetAssets();
        this.scene.start("clickedButtonGameScene");
      },
    });
  }

  private createExitButton(): void {
    const buttonContent = this.startData.buttons.exit;

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
        this.resetAssets();
        window.history.back();
      },
    });
  }

  private resetAssets(): void {
    this.textures.remove("background");
    this.textures.remove("title");
    this.textures.remove("hoverRectangleBlue");
    this.textures.remove("defaultRectangleBlue");
    this.textures.remove("clickedRectangleBlue");
    this.textures.remove("hoverRectangleRed");
    this.textures.remove("defaultRectangleRed");
    this.textures.remove("clickedRectangleRed");
    this.cache.json.remove("startData");
  }
}
